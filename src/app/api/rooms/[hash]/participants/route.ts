import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { activeSessionWhereClause } from "@/lib/presence";
import { getCached, setCached } from "@/lib/shared-state";

type ParticipantsBody =
  | { status: 404; body: { error: string; roomStatus: string } }
  | { status: 200; body: Record<string, unknown> };

// Every client in a room polls this, so polls for the same room share one
// lookup for a moment instead of each querying the database. The result is
// kept for CACHE_TTL_MS in shared state (Redis, so every instance uses it);
// polls arriving while it is being fetched wait on the same lookup.
const CACHE_TTL_MS = 1_500;
const inFlight = new Map<string, Promise<ParticipantsBody>>();

async function loadParticipants(hash: string): Promise<ParticipantsBody> {
  const sharedKey = `participants:${hash}`;
  const shared = await getCached(sharedKey);
  if (shared) return JSON.parse(shared) as ParticipantsBody;
  const result = await queryParticipants(hash);
  await setCached(sharedKey, JSON.stringify(result), CACHE_TTL_MS);
  return result;
}

async function queryParticipants(hash: string): Promise<ParticipantsBody> {
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

    let pending = inFlight.get(hash);
    if (!pending) {
      pending = loadParticipants(hash).finally(() => inFlight.delete(hash));
      inFlight.set(hash, pending);
    }

    const { status, body } = await pending;
    return NextResponse.json(body, { status });
  } catch (error) {
    console.error("List Participants Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
