import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { MIN_ROOM_PARTICIPANTS, MAX_ROOM_PARTICIPANTS } from "@/lib/constants";
import { z } from "zod";

const updateRoomSchema = z.object({
  roomName: z.string().min(1, "Room name is required").optional(),
  maxParticipants: z
    .number()
    .int()
    .min(MIN_ROOM_PARTICIPANTS, `Room must allow at least ${MIN_ROOM_PARTICIPANTS} participants`)
    .max(MAX_ROOM_PARTICIPANTS, `Room cannot allow more than ${MAX_ROOM_PARTICIPANTS} participants`)
    .optional(),
  status: z.enum(["active", "ended"]).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ hash: string }> },
) {
  try {
    const { hash } = await params;

    const room = await prisma.meetingRoom.findUnique({
      where: { roomHash: hash },
      include: {
        meetings: {
          where: { endedAt: null },
          orderBy: { startedAt: "desc" },
          take: 1,
          include: {
            participants: {
              include: { sessions: true },
            },
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const { isSessionActive } = await import("@/lib/presence");
    const ongoingMeeting = room.meetings[0];
    const activeParticipantCount = ongoingMeeting
      ? ongoingMeeting.participants.filter((participant) =>
          participant.sessions.some((session) => isSessionActive(session)),
        ).length
      : 0;

    const { meetings, ...roomFields } = room;
    return NextResponse.json({ room: { ...roomFields, activeParticipantCount } });
  } catch (error) {
    console.error("Get Room By Hash Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ hash: string }> },
) {
  try {
    const { hash } = await params;

    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const room = await prisma.meetingRoom.findUnique({
      where: { roomHash: hash },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.hostId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = updateRoomSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const updatedRoom = await prisma.meetingRoom.update({
      where: { roomHash: hash },
      data: result.data,
    });

    return NextResponse.json({ room: updatedRoom });
  } catch (error) {
    console.error("Update Room Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ hash: string }> },
) {
  try {
    const { hash } = await params;

    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const room = await prisma.meetingRoom.findUnique({
      where: { roomHash: hash },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.hostId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.meetingRoom.delete({
      where: { roomHash: hash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Room Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}