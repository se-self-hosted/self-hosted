import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isSessionActive } from "@/lib/presence";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ hash: string }> },
) {
  try {
    const { hash } = await params;

    const room = await prisma.meetingRoom.findUnique({
      where: { roomHash: hash },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found", roomStatus: "invalid" }, { status: 404 });
    }

    if (room.status !== "active") {
      return NextResponse.json({ error: "Room is closed", roomStatus: room.status, participants: [] });
    }

    const meeting = await prisma.meeting.findFirst({
      where: { roomId: room.id, endedAt: null },
      orderBy: { startedAt: "desc" },
      include: {
        participants: {
          include: { sessions: true },
        },
      },
    });

    if (!meeting) {
      return NextResponse.json({ participants: [] });
    }

    const activeParticipants = meeting.participants
      .filter((participant) => participant.sessions.some((session) => isSessionActive(session)))
      .map((participant) => {
        const activeSession = participant.sessions.find((session) => isSessionActive(session));
        return {
          id: participant.id,
          displayName: participant.displayName,
          joinedAt: activeSession?.joinedAt,
        };
      });

    return NextResponse.json({ participants: activeParticipants });
  } catch (error) {
    console.error("List Participants Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}