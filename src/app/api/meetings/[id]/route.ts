import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { getRecordingPresignedUrl } from "@/lib/storage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: meetingId } = await params;
    const user = await getUserFromRequest();

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        room: true,
        participants: {
          include: {
            sessions: {
              orderBy: { joinedAt: "asc" },
            },
          },
        },
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
        summary: true,
        recordings: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    // Check permissions if authenticated or allow host
    const isHost = Boolean(user && meeting.room.hostId === user.id);

    const recordingsWithUrls = await Promise.all(
      meeting.recordings.map(async (rec) => {
        let presignedUrl = "";
        try {
          presignedUrl = await getRecordingPresignedUrl(rec.objectKey);
        } catch {
          // Ignore presigned error
        }

        return {
          id: rec.id,
          fileName: rec.fileName,
          objectKey: rec.objectKey,
          durationSeconds: rec.durationSeconds,
          fileSize: rec.fileSize.toString(),
          mimeType: rec.mimeType,
          createdAt: rec.createdAt,
          playbackUrl: `/api/recordings/${rec.id}/playback`,
          presignedUrl,
        };
      }),
    );

    const sortedSegments = meeting.transcript
      ? [...meeting.transcript.segments].sort((a, b) => {
          if (a.startTime !== b.startTime) return a.startTime - b.startTime;
          return new Date(a.spokenAt).getTime() - new Date(b.spokenAt).getTime();
        })
      : [];

    return NextResponse.json({
      meeting: {
        id: meeting.id,
        roomId: meeting.roomId,
        roomName: meeting.room.roomName,
        roomHash: meeting.room.roomHash,
        startedAt: meeting.startedAt,
        endedAt: meeting.endedAt,
        durationSeconds: meeting.durationSeconds,
        isHost,
        participants: meeting.participants.map((p) => ({
          id: p.id,
          displayName: p.displayName,
          createdAt: p.createdAt,
          sessions: p.sessions.map((s) => ({
            id: s.id,
            joinedAt: s.joinedAt,
            leftAt: s.leftAt,
            durationSeconds: s.durationSeconds,
          })),
        })),
        recordings: recordingsWithUrls,
        transcript: meeting.transcript
          ? {
              id: meeting.transcript.id,
              fullTranscript: meeting.transcript.fullTranscript,
              language: meeting.transcript.language,
              createdAt: meeting.transcript.createdAt,
              segments: sortedSegments.map((s) => ({
                id: s.id,
                participantId: s.participantId,
                speakerName: s.participant.displayName,
                startTime: s.startTime,
                endTime: s.endTime,
                spokenAt: s.spokenAt,
                text: s.text,
                confidence: s.confidence,
              })),
            }
          : null,
        summary: meeting.summary
          ? {
              id: meeting.summary.id,
              aiSummary: meeting.summary.aiSummary,
              editedSummary: meeting.summary.editedSummary,
              llmModel: meeting.summary.llmModel,
              generatedAt: meeting.summary.generatedAt,
              editedAt: meeting.summary.editedAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Get Meeting Details Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
