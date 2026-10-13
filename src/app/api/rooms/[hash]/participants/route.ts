import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { activeSessionWhereClause } from "@/lib/presence";

type ParticipantsBody =
  | { status: 404; body: { error: string; roomStatus: string } }
  | { status: 200; body: Record<string, unknown> };

// Every client in a room polls this, so concurrent polls for the same room
// share one lookup for a moment instead of each querying the database.
const CACHE_TTL_MS = 1_500;
const cache = new Map<string, { expiresAt: number; result: Promise<ParticipantsBody> }>();

async function loadParticipants(hash: string): Promise<ParticipantsBody> {
  const room = await prisma.meetingRoom.findUnique({
    where: { roomHash: hash },
    select: { id: true, status: true },
  });

  if (!room) {
    return { status: 404, body: { error: "Room not found", roomStatus: "invalid" } };
  }

  if (room.status !== "active") {
    return { status: 200, body: { error: "Room is closed", roomStatus: room.status, participants: [] } };
  }

  const active = activeSessionWhereClause();
  const meeting = await prisma.meeting.findFirst({
    where: { roomId: room.id, endedAt: null },
    orderBy: { startedAt: "desc" },
    select: {
      participants: {
        where: { sessions: { some: active } },
        select: {
          id: true,
          displayName: true,
          sessions: { where: active, orderBy: { joinedAt: "asc" }, take: 1, select: { joinedAt: true } },
        },
      },
    },
  });

  return {
    status: 200,
    body: {
      participants: (meeting?.participants ?? []).map((participant) => ({
        id: participant.id,
        displayName: participant.displayName,
        joinedAt: participant.sessions[0]?.joinedAt,
      })),
    },
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ hash: string }> },
) {
  try {
    const { hash } = await params;

    const now = Date.now();
    let entry = cache.get(hash);
    if (!entry || entry.expiresAt <= now) {
      for (const [key, value] of cache) {
        if (value.expiresAt <= now) cache.delete(key);
      }
      const fresh = { expiresAt: now + CACHE_TTL_MS, result: loadParticipants(hash) };
      cache.set(hash, fresh);
      // A failed lookup must not be served to the next poller.
      fresh.result.catch(() => {
        if (cache.get(hash) === fresh) cache.delete(hash);
      });
      entry = fresh;
    }

    const { status, body } = await entry.result;
    return NextResponse.json(body, { status });
  } catch (error) {
    console.error("List Participants Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
