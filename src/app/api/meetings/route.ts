import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { bangkokDayRange } from "@/features/meeting-history/search";

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Searched and paged here rather than on the client, so a host with a
    // long history doesn't download every meeting they ever ran.
    const searchParams = new URL(req.url).searchParams;
    const query = searchParams.get("query")?.trim().slice(0, 100) ?? "";
    const startedAt = bangkokDayRange(searchParams.get("from"), searchParams.get("to"));
    const cursor = searchParams.get("cursor");
    const requestedLimit = Number.parseInt(searchParams.get("limit") ?? "", 10);
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE;

    const meetings = await prisma.meeting.findMany({
      where: {
        room: { hostId: user.id },
        ...(startedAt.gte || startedAt.lt ? { startedAt } : {}),
        ...(query
          ? {
              OR: [
                { room: { roomName: { contains: query, mode: "insensitive" as const } } },
                { participants: { some: { displayName: { contains: query, mode: "insensitive" as const } } } },
              ],
            }
          : {}),
      },
      orderBy: [{ startedAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        roomId: true,
        startedAt: true,
        endedAt: true,
        durationSeconds: true,
        room: { select: { roomName: true, roomHash: true } },
        participants: { select: { displayName: true } },
        transcript: { select: { id: true } },
        summary: { select: { id: true } },
      },
    });

    const page = meetings.slice(0, limit);
    const formattedMeetings = page.map((m) => ({
      id: m.id,
      roomId: m.roomId,
      roomName: m.room.roomName,
      roomHash: m.room.roomHash,
      startedAt: m.startedAt,
      endedAt: m.endedAt,
      durationSeconds: m.durationSeconds,
      participantCount: m.participants.length,
      participantNames: m.participants.map((p) => p.displayName),
      hasTranscript: Boolean(m.transcript),
      hasSummary: Boolean(m.summary),
    }));

    return NextResponse.json({
      meetings: formattedMeetings,
      nextCursor: meetings.length > limit ? page.at(-1)?.id ?? null : null,
    });
  } catch (error) {
    console.error("Get Meetings Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
