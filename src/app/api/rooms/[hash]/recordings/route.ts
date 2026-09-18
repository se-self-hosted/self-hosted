import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
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
    const url = new URL(`/api/meetings/${meetingId}/recordings`, req.url);
    url.search = new URL(req.url).search;
    const res = await fetch(url.toString(), {
      headers: { cookie: req.headers.get("cookie") || "" },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Room Recordings GET Error:", error);
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

    // Forward upload to the meeting recording route
    const recordingUrl = new URL(`/api/meetings/${meeting.id}/recordings`, req.url);
    const headers = new Headers(req.headers);

    const bodyBuffer = await req.arrayBuffer();
    const res = await fetch(recordingUrl.toString(), {
      method: "POST",
      headers,
      body: bodyBuffer,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Room Recordings POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
