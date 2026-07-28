import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { hash: string } },
) {
  try {
    const room = await prisma.meetingRoom.findUnique({
      where: { roomHash: params.hash },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ room });
  } catch (error) {
    console.error("Get Room By Hash Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}