import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { resolveMeetingAccess } from "@/lib/meeting-access";

const segmentSchema = z.object({
  id: z.string().min(1).optional(),
  participantId: z.string().optional(),
  speakerName: z.string().optional(),
  startTime: z.number().min(0, "Start time must be non-negative"),
  endTime: z.number().min(0, "End time must be non-negative"),
  spokenAt: z.string().optional(),
  text: z.string().min(1, "Transcript text is required"),
  confidence: z.number().min(0).max(1).optional().default(1.0),
});

// Covers the recognizer's drain after stop() plus the save's own round trip,
// so a member's last line isn't rejected because they just left.
const LEAVE_GRACE_MS = 30_000;

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

const postTranscriptSchema = z.union([
  segmentSchema,
  z.object({
    segments: z.array(segmentSchema).min(1, "At least one segment is required"),
    language: z.string().optional().default("th"),
  }),
]);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: meetingId } = await params;
    const participantId = new URL(req.url).searchParams.get("participantId");
    const access = await resolveMeetingAccess(meetingId, {
      participantId,
      connectionId: req.headers.get("x-connection-id"),
    });

    if (!access.meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        participants: true,
        transcript: {
          include: {
            segments: {
              orderBy: [
                { startTime: "asc" },
                { spokenAt: "asc" },
              ],
              include: {
                participant: true,
              },
            },
          },
        },
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    if (!meeting.transcript) {
      return NextResponse.json({
        transcript: null,
        segments: [],
      });
    }

    // Ensure segments are sorted chronologically
    const sortedSegments = [...meeting.transcript.segments].sort((a, b) => {
      if (a.startTime !== b.startTime) {
        return a.startTime - b.startTime;
      }
      return new Date(a.spokenAt).getTime() - new Date(b.spokenAt).getTime();
    });

    return NextResponse.json({
      transcript: {
        id: meeting.transcript.id,
        meetingId: meeting.transcript.meetingId,
        fullTranscript: meeting.transcript.fullTranscript,
        language: meeting.transcript.language,
        createdAt: meeting.transcript.createdAt,
      },
      segments: sortedSegments.map((s) => ({
        id: s.id,
        participantId: s.participantId,
        speakerName: s.participant?.displayName || "Unknown",
        startTime: s.startTime,
        endTime: s.endTime,
        spokenAt: s.spokenAt,
        text: s.text,
        confidence: s.confidence,
      })),
    });
  } catch (error) {
    console.error("Get Transcript Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: meetingId } = await params;
    const body = await req.json();

    // Only the single-segment shape carries a caller identity; a batch
    // payload has no one participant to attribute the request to.
    const candidateParticipantId =
      body && typeof body === "object" && "participantId" in body && typeof body.participantId === "string"
        ? body.participantId
        : null;
    const access = await resolveMeetingAccess(
      meetingId,
      { participantId: candidateParticipantId, connectionId: req.headers.get("x-connection-id") },
      { leftGraceMs: LEAVE_GRACE_MS },
    );

    if (!access.meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: { participants: true },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const result = postTranscriptSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    let rawSegments: z.infer<typeof segmentSchema>[] = [];
    let language = "th";

    if ("segments" in result.data) {
      rawSegments = result.data.segments;
      language = result.data.language || "th";
    } else {
      rawSegments = [result.data];
    }

    // Two speakers' first lines can race to create the meeting's one
    // Transcript; the loser reads the winner's row instead of failing.
    const transcript = await prisma.transcript
      .upsert({
        where: { meetingId },
        create: { meetingId, fullTranscript: "", language },
        update: {},
      })
      .catch((error) => {
        if (isUniqueViolation(error)) return prisma.transcript.findUniqueOrThrow({ where: { meetingId } });
        throw error;
      });

    // Resolve participant for each segment. Kept in sync as segments create
    // new participants so a batch introducing several new speakers reuses
    // each one instead of creating a duplicate row per subsequent segment.
    const participants = [...meeting.participants];
    const createdSegments = [];
    for (const seg of rawSegments) {
      // Clients retry a failed save with the same id; answer a retry of a
      // segment already stored with that row instead of a duplicate-key 500.
      const findExisting = () =>
        seg.id
          ? prisma.transcriptSegment.findUnique({ where: { id: seg.id }, include: { participant: true } })
          : null;
      const existing = await findExisting();
      if (existing) {
        if (existing.transcriptId !== transcript.id) {
          return NextResponse.json({ error: "Segment id already in use" }, { status: 409 });
        }
        createdSegments.push(existing);
        continue;
      }

      let participantId = seg.participantId;

      if (!participantId && seg.speakerName) {
        const found = participants.find(
          (p) => p.displayName.toLowerCase() === seg.speakerName!.toLowerCase(),
        );
        if (found) {
          participantId = found.id;
        } else {
          // Create participant if not exists
          const created = await prisma.participant.create({
            data: {
              meetingId,
              displayName: seg.speakerName,
            },
          });
          participants.push(created);
          participantId = created.id;
        }
      } else if (!participantId) {
        // Fallback to first participant or create a guest participant
        if (participants.length > 0) {
          participantId = participants[0].id;
        } else {
          const created = await prisma.participant.create({
            data: {
              meetingId,
              displayName: "Guest",
            },
          });
          participants.push(created);
          participantId = created.id;
        }
      }

      const spokenAt = seg.spokenAt ? new Date(seg.spokenAt) : new Date();

      const createdSegment = await prisma.transcriptSegment.create({
        data: {
          // Preserve the client-generated id so the caller's own optimistic,
          // already-displayed copy of this segment can be deduped against
          // the persisted row later (e.g. after a reconnect re-fetches it).
          ...(seg.id ? { id: seg.id } : {}),
          transcriptId: transcript.id,
          participantId: participantId!,
          startTime: seg.startTime,
          endTime: Math.max(seg.startTime, seg.endTime),
          spokenAt,
          text: seg.text.trim(),
          confidence: seg.confidence ?? 1.0,
        },
        include: {
          participant: true,
        },
      }).catch(async (error) => {
        // A concurrent retry of the same segment won the insert.
        const raced = isUniqueViolation(error) ? await findExisting() : null;
        if (raced?.transcriptId === transcript.id) return raced;
        throw error;
      });

      createdSegments.push(createdSegment);
    }

    // Update fullTranscript chronologically
    const allSegments = await prisma.transcriptSegment.findMany({
      where: { transcriptId: transcript.id },
      orderBy: [
        { startTime: "asc" },
        { spokenAt: "asc" },
      ],
      include: { participant: true },
    });

    const fullTranscript = allSegments
      .map((s) => `${s.participant.displayName}: ${s.text}`)
      .join("\n");

    await prisma.transcript.update({
      where: { id: transcript.id },
      data: { fullTranscript },
    });

    return NextResponse.json(
      {
        success: true,
        createdCount: createdSegments.length,
        segments: createdSegments.map((s) => ({
          id: s.id,
          participantId: s.participantId,
          speakerName: s.participant.displayName,
          startTime: s.startTime,
          endTime: s.endTime,
          spokenAt: s.spokenAt,
          text: s.text,
          confidence: s.confidence,
        })),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Save Transcript Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
