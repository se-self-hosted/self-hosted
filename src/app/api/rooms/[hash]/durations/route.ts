import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ hash: string }> },
) {
  try {
    const { hash } = await params;
    const { searchParams } = new URL(req.url);
    const meetingId = searchParams.get("meetingId");

    const room = await prisma.meetingRoom.findUnique({
      where: { roomHash: hash },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Default to the most recent meeting for this room (ongoing, or the
    // last one that ended) so this still works after the meeting is over.
    const meeting = meetingId
      ? await prisma.meeting.findFirst({
          where: { id: meetingId, roomId: room.id },
          include: { participants: { include: { sessions: true } } },
        })
      : await prisma.meeting.findFirst({
          where: { roomId: room.id },
          orderBy: { startedAt: "desc" },
          include: { participants: { include: { sessions: true } } },
        });

    if (!meeting) {
      return NextResponse.json({ error: "No meeting found for this room" }, { status: 404 });
    }

    const now = Date.now();

    // A single person can have multiple Participant rows if they left and
    // rejoined during the same meeting — group by displayName so their
    // time-in-room adds up across every join.
    const totalsByName = new Map<string, number>();

    for (const participant of meeting.participants) {
      let total = totalsByName.get(participant.displayName) ?? 0;

      for (const session of participant.sessions) {
        if (session.leftAt) {
          total +=
            session.durationSeconds ??
            Math.round((session.leftAt.getTime() - session.joinedAt.getTime()) / 1000);
        } else {
          // Still in the room right now — count elapsed time so far.
          total += Math.round((now - session.joinedAt.getTime()) / 1000);
        }
      }

      totalsByName.set(participant.displayName, total);
    }

    const participants = Array.from(totalsByName.entries())
      .map(([displayName, totalSeconds]) => ({ displayName, totalSeconds }))
      .sort((a, b) => b.totalSeconds - a.totalSeconds);

    // Total attendance duration = everyone's time-in-room added together
    // (person-time), not the meeting's own wall-clock span.
    const totalAttendanceSeconds = participants.reduce(
      (sum, participant) => sum + participant.totalSeconds,
      0,
    );

    return NextResponse.json({
      meetingId: meeting.id,
      startedAt: meeting.startedAt,
      endedAt: meeting.endedAt,
      totalAttendanceSeconds,
      participants,
    });
  } catch (error) {
    console.error("Calculate Session Duration Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}