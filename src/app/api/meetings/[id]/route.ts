import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveMeetingAccess } from "@/lib/meeting-access";
import { groupRecordingTakes } from "@/lib/recording-takes";
import { buildFullTranscript } from "@/lib/transcript-text";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: meetingId } = await params;
    const access = await resolveMeetingAccess(meetingId);

    if (!access.meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      select: {
        id: true,
        roomId: true,
        startedAt: true,
        endedAt: true,
        durationSeconds: true,
        room: { select: { roomName: true, roomHash: true } },
        participants: {
          select: {
            id: true,
            displayName: true,
            createdAt: true,
            sessions: {
              orderBy: { joinedAt: "asc" },
              select: { id: true, joinedAt: true, leftAt: true, durationSeconds: true },
            },
          },
        },
        transcript: {
          select: {
            id: true,
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
        },
        summary: true,
        recordings: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            participantId: true,
            fileName: true,
            startOffsetSeconds: true,
            durationSeconds: true,
            fileSize: true,
            mimeType: true,
            createdAt: true,
            participant: { select: { displayName: true } },
          },
        },
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const isHost = access.isHost;

    // Played back through the authenticated playback route; a presigned URL
    // would point at the internal MinIO host, so none is signed here.
    const recordingsWithUrls = meeting.recordings.map((rec) => ({
      id: rec.id,
      participantId: rec.participantId,
      speakerName: rec.participant?.displayName ?? null,
      fileName: rec.fileName,
      startOffsetSeconds: rec.startOffsetSeconds,
      durationSeconds: rec.durationSeconds,
      fileSize: rec.fileSize.toString(),
      mimeType: rec.mimeType,
      createdAt: rec.createdAt,
      playbackUrl: `/api/recordings/${rec.id}/playback`,
    }));

    // One entry per press of record, with every speaker mixed together.
    const recordingTakes = groupRecordingTakes(meeting.recordings).map((take, index) => ({
      key: take.key,
      index: index + 1,
      startOffsetSeconds: take.startOffsetSeconds,
      durationSeconds: take.durationSeconds,
      speakerCount: new Set(take.recordings.map((rec) => rec.participantId ?? rec.id)).size,
      playbackUrl: `/api/meetings/${meeting.id}/takes/${take.key}/playback`,
    }));

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
        recordingTakes,
        transcript: meeting.transcript
          ? {
              id: meeting.transcript.id,
              fullTranscript: buildFullTranscript(meeting.transcript.segments),
              language: meeting.transcript.language,
              createdAt: meeting.transcript.createdAt,
              segments: meeting.transcript.segments.map((s) => ({
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
