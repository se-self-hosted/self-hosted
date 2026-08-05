import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { z } from "zod";

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

    const { roomHash, identity, displayName, isHost } = result.data;

    const apiKey = process.env.LIVEKIT_API_KEY || "devkey";
    const apiSecret = process.env.LIVEKIT_API_SECRET || "secret";

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: displayName,
      metadata: JSON.stringify({ isHost }),
    });

    at.addGrant({
      roomJoin: true,
      room: roomHash,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({ token, wsUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880" });
  } catch (error) {
    console.error("LiveKit Token Error:", error);
    return NextResponse.json({ error: "Failed to generate LiveKit token" }, { status: 500 });
  }
}
