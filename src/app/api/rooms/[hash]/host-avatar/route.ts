import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { streamAvatar } from "@/lib/avatar-response";

/**
 * The room host's profile photo. Like joining, it only needs the room link,
 * since members have no account; it reveals nothing they won't see in the room.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ hash: string }> },
) {
  try {
    const { hash } = await params;
    const room = await prisma.meetingRoom.findUnique({
      where: { roomHash: hash },
      select: { host: { select: { avatarKey: true } } },
    });
    if (!room) return NextResponse.json({ error: "Meeting room not found" }, { status: 404 });
    return await streamAvatar(room.host.avatarKey);
  } catch (error) {
    console.error("Host Avatar Fetch Error:", error);
    return NextResponse.json({ error: "Unable to load profile photo" }, { status: 500 });
  }
}
