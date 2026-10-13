import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { LEAVE_GRACE_MS, resolveMeetingAccess } from "@/lib/meeting-access";
import { resolveSegmentSpokenAt } from "@/features/meeting-room/lib/meeting-clock";
import { buildFullTranscript } from "@/lib/transcript-text";

const segmentSchema = z.object({
  id: z.string().min(1).optional(),
  participantId: z.string().optional(),
  speakerName: z.string().max(100, "Speaker name is too long").optional(),
  startTime: z.number().min(0, "Start time must be non-negative"),
  endTime: z.number().min(0, "End time must be non-negative"),
  spokenAt: z.string().optional(),
  text: z.string().min(1, "Transcript text is required").max(5000, "Transcript text is too long"),
  confidence: z.number().min(0).max(1).optional().default(1.0),
});

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

    const transcript = await prisma.transcript.findUnique({
      where: { meetingId },
      select: {
        id: true,
        meetingId: true,
        language: true,
        createdAt: true,
        segments: {
          orderBy: [
            { startTime: "asc" },
            { spokenAt: "asc" },
          ],
          select: {
            id: true,
            participantId: true,
            startTime: true,
            endTime: true,
            spokenAt: true,
            text: true,
            confidence: true,
            participant: { select: { displayName: true } },
          },
        },
      },
    });

    if (!transcript) {
      return NextResponse.json({
        transcript: null,
        segments: [],
      });
    }

    return NextResponse.json({
      transcript: {
        id: transcript.id,
        meetingId: transcript.meetingId,
        fullTranscript: buildFullTranscript(transcript.segments),
        language: transcript.language,
        createdAt: transcript.createdAt,
      },
      segments: transcript.segments.map((s) => ({
        id: s.id,
        participantId: s.participantId,
        speakerName: s.participant.displayName || "Unknown",
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
      select: { startedAt: true },
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

    // Reject a batch reusing another meeting's segment id before writing any
    // of it, so a conflict can't leave the batch half-stored.
    const segmentIds = rawSegments.flatMap((seg) => (seg.id ? [seg.id] : []));
    if (segmentIds.length > 0) {
      const foreign = await prisma.transcriptSegment.count({
        where: { id: { in: segmentIds }, transcriptId: { not: transcript.id } },
      });
      if (foreign > 0) {
        return NextResponse.json({ error: "Segment id already in use" }, { status: 409 });
      }
    }

    // Resolve participant for each segment. Loaded only when a segment lacks
    // a participantId (live saves always carry one), and kept in sync as
    // segments create new participants so a batch introducing several new
    // speakers reuses each one instead of creating a duplicate row per
    // subsequent segment.
    let participants: { id: string; displayName: string }[] | null = null;
    const loadParticipants = async () =>
      (participants ??= await prisma.participant.findMany({
        where: { meetingId },
        orderBy: { createdAt: "asc" },
        select: { id: true, displayName: true },
      }));
    const segmentSelect = {
      id: true,
      transcriptId: true,
      participantId: true,
      startTime: true,
      endTime: true,
      spokenAt: true,
      text: true,
      confidence: true,
      participant: { select: { displayName: true } },
    } as const;
    const createdSegments = [];
    for (const seg of rawSegments) {
      // Clients retry a failed save with the same id; answer a retry of a
      // segment already stored with that row instead of a duplicate-key 500.
      const findExisting = () =>
        seg.id
          ? prisma.transcriptSegment.findUnique({ where: { id: seg.id }, select: segmentSelect })
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
        const participants = await loadParticipants();
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
        const participants = await loadParticipants();
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

      const spokenAt = resolveSegmentSpokenAt(meeting.startedAt, seg.startTime, seg.spokenAt);

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
        select: segmentSelect,
      }).catch(async (error) => {
        // A concurrent retry of the same segment won the insert.
        const raced = isUniqueViolation(error) ? await findExisting() : null;
        if (raced?.transcriptId === transcript.id) return raced;
        throw error;
      });

      createdSegments.push(createdSegment);
    }

    // fullTranscript is built on read (buildFullTranscript), not rewritten
    // here: that made every saved line re-read and re-store the whole
    // transcript, and concurrent saves could each store a copy missing the
    // other's line.
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
