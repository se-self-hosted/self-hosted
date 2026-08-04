import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";
import { z } from "zod";

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

    const connectionId = randomUUID();

    const participant = await prisma.participant.create({
      data: {
        meetingId: meeting.id,
        displayName,
        sessions: {
          create: {
            joinedAt: new Date(),
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
