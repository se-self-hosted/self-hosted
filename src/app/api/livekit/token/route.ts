import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

const tokenSchema = z.object({
  roomHash: z.string().min(1, "roomHash is required"),
  identity: z.string().min(1, "identity is required"),
  displayName: z.string().min(1, "displayName is required"),
  isHost: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = tokenSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { roomHash, identity, displayName } = result.data;
    let isHost = result.data.isHost;

    const room = await prisma.meetingRoom.findUnique({
      where: { roomHash },
    });

    if (!room) {
      return NextResponse.json({ error: "Meeting room not found" }, { status: 404 });
    }

    if (room.status !== "active") {
      return NextResponse.json({ error: "Meeting room is not active" }, { status: 400 });
    }

    const user = await getUserFromRequest();
    if (user && user.id === room.hostId) {
      isHost = true;
    }

    const apiKey = process.env.LIVEKIT_API_KEY || "devkey";
    const apiSecret = process.env.LIVEKIT_API_SECRET || "secret";

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: displayName,
      metadata: JSON.stringify({ isHost, roomHash, displayName }),
    });

    at.addGrant({
      roomJoin: true,
      room: roomHash,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: isHost,
    });

    const token = await at.toJwt();
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880";

    return NextResponse.json({ token, wsUrl });
  } catch (error) {
    console.error("LiveKit Token Error:", error);
    return NextResponse.json({ error: "Failed to generate LiveKit token" }, { status: 500 });
  }
}
