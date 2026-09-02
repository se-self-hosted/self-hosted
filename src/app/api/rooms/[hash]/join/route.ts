import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { randomUUID } from "crypto";
import { z } from "zod";
import { isSessionActive, activeSessionWhereClause } from "@/lib/presence";

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
    const user = await getUserFromRequest();

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

    // Only close out previous active sessions for authenticated users to avoid kicking out guests with the same name
    const searchNames = user
      ? Array.from(new Set([displayName, user.fullname, user.email].filter(Boolean) as string[]))
      : [];

    const existingParticipants = searchNames.length > 0 
      ? await prisma.participant.findMany({
          where: {
            meetingId: meeting.id,
            displayName: { in: searchNames },
          },
          include: { sessions: true },
        })
      : [];

    const activePreviousSessions = existingParticipants.flatMap((participant) =>
      participant.sessions.filter((session) => isSessionActive(session)),
    );

    if (activePreviousSessions.length > 0) {
      const now = new Date();
      await Promise.all(
        activePreviousSessions.map((session) =>
          prisma.participantSession.update({
            where: { id: session.id },
            data: {
              leftAt: now,
              lastSeenAt: new Date(0),
              durationSeconds: Math.round(
                (now.getTime() - session.joinedAt.getTime()) / 1000,
              ),
            },
          }),
        ),
      );
    }

    const activeParticipantCount = await prisma.participant.count({
      where: {
        meetingId: meeting.id,
        sessions: { some: activeSessionWhereClause() },
      },
    });

    if (activeParticipantCount >= room.maxParticipants) {
      return NextResponse.json(
        { error: "ห้องประชุมเต็มแล้ว" },
        { status: 403 },
      );
    }

    const connectionId = randomUUID();
    const now = new Date();

    // Reuse existing participant for this user/host if present, avoiding duplicate participant rows
    const existingParticipant = existingParticipants.find((p) => p.displayName === displayName) || existingParticipants[0];
    let targetParticipantId: string;

    if (existingParticipant) {
      targetParticipantId = existingParticipant.id;
      await prisma.participantSession.create({
        data: {
          participantId: existingParticipant.id,
          joinedAt: now,
          lastSeenAt: now,
          connectionId,
        },
      });
    } else {
      const newParticipant = await prisma.participant.create({
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
      targetParticipantId = newParticipant.id;
    }

    return NextResponse.json(
      { participantId: targetParticipantId, meetingId: meeting.id, connectionId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Join Room Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}