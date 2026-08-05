import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";
import { z } from "zod";
import { isSessionActive } from "@/lib/presence";

const joinSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
});

export async function POST(
  req: Request,
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

    if (room.status !== "active") {
      return NextResponse.json({ error: "Room is not active" }, { status: 400 });
    }

    const body = await req.json();
    const result = joinSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { displayName } = result.data;

    // Reuse the meeting currently in progress for this room, or start a new one.
    let meeting = await prisma.meeting.findFirst({
      where: { roomId: room.id, endedAt: null },
      orderBy: { startedAt: "desc" },
    });

    if (!meeting) {
      meeting = await prisma.meeting.create({
        data: { roomId: room.id },
      });
    }

    // Close out any stale/duplicate session under the same name in this
    // meeting — e.g. the host rejoining after a refresh, a dropped
    // connection, or opening the room again from the dashboard.
    const sameNameParticipants = await prisma.participant.findMany({
      where: { meetingId: meeting.id, displayName },
      include: { sessions: true },
    });

    const staleSessions = sameNameParticipants.flatMap((participant) =>
      participant.sessions.filter((session) => isSessionActive(session)),
    );

    if (staleSessions.length > 0) {
      const now = new Date();
      await Promise.all(
        staleSessions.map((session) =>
          prisma.participantSession.update({
            where: { id: session.id },
            data: {
              leftAt: now,
              durationSeconds: Math.round(
                (now.getTime() - session.joinedAt.getTime()) / 1000,
              ),
            },
          }),
        ),
      );
    }

    const connectionId = randomUUID();
    const now = new Date();

    const participant = await prisma.participant.create({
      data: {
        meetingId: meeting.id,
        displayName,
        sessions: {
          create: {
            joinedAt: now,
            lastSeenAt: now,
            connectionId,
          },
        },
      },
    });

    return NextResponse.json(
      { participantId: participant.id, meetingId: meeting.id, connectionId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Join Room Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}