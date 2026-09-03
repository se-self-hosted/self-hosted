import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const meetings = await prisma.meeting.findMany({
      where: {
        room: {
          hostId: user.id,
        },
      },
      orderBy: { startedAt: "desc" },
      include: {
        room: {
          select: {
            id: true,
            roomName: true,
            roomHash: true,
            maxParticipants: true,
          },
        },
        participants: {
          include: {
            sessions: true,
          },
        },
        recordings: {
          select: {
            id: true,
            fileName: true,
            durationSeconds: true,
            fileSize: true,
            mimeType: true,
            createdAt: true,
          },
        },
        transcript: {
          select: {
            id: true,
            language: true,
            createdAt: true,
          },
        },
        summary: {
          select: {
            id: true,
            llmModel: true,
            generatedAt: true,
          },
        },
      },
    });

    const formattedMeetings = meetings.map((m) => {
      return {
        id: m.id,
        roomId: m.roomId,
        roomName: m.room.roomName,
        roomHash: m.room.roomHash,
        startedAt: m.startedAt,
        endedAt: m.endedAt,
        durationSeconds: m.durationSeconds,
        participantsCount: m.participants.length,
        participants: m.participants.map((p) => ({
          id: p.id,
          displayName: p.displayName,
          sessionCount: p.sessions.length,
        })),
        recordings: m.recordings.map((r) => ({
          id: r.id,
          fileName: r.fileName,
          durationSeconds: r.durationSeconds,
          fileSize: r.fileSize.toString(),
          mimeType: r.mimeType,
          createdAt: r.createdAt,
          playbackUrl: `/api/recordings/${r.id}/playback`,
        })),
        hasTranscript: Boolean(m.transcript),
        hasSummary: Boolean(m.summary),
      };
    });

    return NextResponse.json({ meetings: formattedMeetings });
  } catch (error) {
    console.error("Get Meetings Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
