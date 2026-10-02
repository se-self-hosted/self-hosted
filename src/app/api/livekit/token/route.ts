import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { hostAvatarUrlFor } from "@/lib/avatar";
import { activeSessionWhereClause } from "@/lib/presence";

const tokenSchema = z.object({
  roomHash: z.string().min(1, "roomHash is required"),
  identity: z.string().min(1, "identity is required"),
  connectionId: z.string().min(1, "connectionId is required"),
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

    const { roomHash, identity, connectionId } = result.data;

    // Independent lookups — run concurrently instead of chaining two DB/JWT round-trips.
    const [room, user] = await Promise.all([
      prisma.meetingRoom.findUnique({ where: { roomHash } }),
      getUserFromRequest(),
    ]);

    if (!room) {
      return NextResponse.json({ error: "Meeting room not found" }, { status: 404 });
    }

    if (room.status !== "active") {
      return NextResponse.json({ error: "Meeting room is not active" }, { status: 400 });
    }

    const session = await prisma.participantSession.findFirst({
      where: {
        connectionId,
        participantId: identity,
        ...activeSessionWhereClause(),
        participant: { meeting: { roomId: room.id, endedAt: null } },
      },
      include: { participant: true },
    });
    if (!session || (session.participant.userId && session.participant.userId !== user?.id)) {
      return NextResponse.json({ error: "กรุณาเข้าร่วมห้องประชุมใหม่", code: "SESSION_ENDED" }, { status: 409 });
    }
    const isHost = Boolean(user && user.id === room.hostId && session.participant.userId === user.id);
    const displayName = session.participant.displayName;
    // Everyone in the room reads the host's photo from this metadata.
    const avatarUrl = isHost
      ? hostAvatarUrlFor(roomHash, (await prisma.user.findUnique({ where: { id: room.hostId }, select: { avatarKey: true } }))?.avatarKey ?? null)
      : null;

    const apiKey = process.env.LIVEKIT_API_KEY || "devkey";
    const apiSecret = process.env.LIVEKIT_API_SECRET || "secret";

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: displayName,
      metadata: JSON.stringify({ isHost, roomHash, displayName, avatarUrl }),
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
