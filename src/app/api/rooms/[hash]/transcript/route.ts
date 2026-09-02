import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
          orderBy: { startedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!room || room.meetings.length === 0) {
      return NextResponse.json({ error: "No meeting found for this room" }, { status: 404 });
    }

    const meetingId = room.meetings[0].id;
    const url = new URL(`/api/meetings/${meetingId}/transcript`, "http://localhost");
    const res = await fetch(url.toString());
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Room Transcript GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
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
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    let meeting = room.meetings[0];
    if (!meeting) {
      // Find latest meeting even if ended or create a new one
      const latest = await prisma.meeting.findFirst({
        where: { roomId: room.id },
        orderBy: { startedAt: "desc" },
      });
      if (latest) {
        meeting = latest;
      } else {
        meeting = await prisma.meeting.create({
          data: { roomId: room.id },
        });
      }
    }

    const body = await req.json();

    // Call the meeting transcript endpoint directly or perform logic
    const transcriptUrl = new URL(`/api/meetings/${meeting.id}/transcript`, "http://localhost");
    const res = await fetch(transcriptUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Room Transcript POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
