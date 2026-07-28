import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { generateSlug } from "@/lib/slug";
import { z } from "zod";

const createRoomSchema = z.object({
  roomName: z.string().min(1, "Room name is required"),
  maxParticipants: z.number().int().min(1),
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
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("List Rooms Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}