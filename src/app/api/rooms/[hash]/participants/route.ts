import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
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
      .filter((participant) => participant.sessions.some((session) => session.leftAt === null))
      .map((participant) => {
        const activeSession = participant.sessions.find((session) => session.leftAt === null);
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
