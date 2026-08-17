import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";
import { isSessionActive } from "@/lib/presence";
import { MIN_ROOM_PARTICIPANTS, MAX_ROOM_PARTICIPANTS } from "@/lib/constants";
import { z } from "zod";

const createRoomSchema = z.object({
  roomName: z.string().min(1, "Room name is required"),
  maxParticipants: z
    .number()
    .int()
    .min(MIN_ROOM_PARTICIPANTS, `Room must allow at least ${MIN_ROOM_PARTICIPANTS} participants`)
    .max(MAX_ROOM_PARTICIPANTS, `Room cannot allow more than ${MAX_ROOM_PARTICIPANTS} participants`),
});

async function generateUniqueRoomHash() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const roomHash = generateSlug();
    const existing = await prisma.meetingRoom.findUnique({ where: { roomHash } });
    if (!existing) return roomHash;
  }
  throw new Error("Could not generate a unique room hash after several attempts");
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = createRoomSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { roomName, maxParticipants } = result.data;
    const roomHash = await generateUniqueRoomHash();

    const room = await prisma.meetingRoom.create({
      data: {
        roomName,
        roomHash,
        maxParticipants,
        status: "active",
        hostId: user.id,
      },
    });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    console.error("Create Room Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await prisma.meetingRoom.findMany({
      where: { hostId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        // Only the meeting currently in progress for this room, if any.
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

    const roomsWithCounts = rooms.map((room) => {
      const ongoingMeeting = room.meetings[0];

      // A participant counts as "in the room" only if they have a session
      // that hasn't ended AND hasn't gone stale (missed its heartbeats) —
      // see lib/presence.ts.
      const activeParticipantCount = ongoingMeeting
        ? ongoingMeeting.participants.filter((participant) =>
            participant.sessions.some((session) => isSessionActive(session)),
          ).length
        : 0;

      const isHostInRoom = ongoingMeeting
        ? ongoingMeeting.participants.some(
            (participant) =>
              (participant.displayName === user.fullname ||
                participant.displayName === user.email ||
                (user.name && participant.displayName === user.name)) &&
              participant.sessions.some((session) => isSessionActive(session)),
          )
        : false;

      const { meetings, ...roomFields } = room;
      return { ...roomFields, activeParticipantCount, isHostInRoom };
    });

    return NextResponse.json({ rooms: roomsWithCounts });
  } catch (error) {
    console.error("List Rooms Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}