import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { AdmissionError, isConnected } from "@/lib/meeting-admission";
import { isSessionActive } from "@/lib/presence";

const heartbeatSchema = z.object({ connectionId: z.string().min(1) });

function sessionEnded() {
  return NextResponse.json({ error: "การเชื่อมต่อห้องประชุมนี้สิ้นสุดแล้ว กรุณาเข้าห้องใหม่", code: "SESSION_ENDED" }, { status: 409 });
}

export async function POST(req: Request, { params }: { params: Promise<{ hash: string }> }) {
  try {
    const { hash } = await params;
    const result = heartbeatSchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const session = await prisma.participantSession.findFirst({
      where: { connectionId: result.data.connectionId, participant: { meeting: { room: { roomHash: hash } } } },
      include: { participant: { select: { userId: true } } },
    });
    if (!session || session.leftAt) return sessionEnded();

    // A stale session's slot no longer counts toward room capacity and may
    // already have been given away, so a late heartbeat must not silently
    // revive it. Keep it only if its audio connection is genuinely still
    // alive (e.g. a throttled background tab); otherwise retire it. The
    // LiveKit lookup runs before any row locks, as in joinMeeting.
    if (!isSessionActive(session) && !(await isConnected(hash, session.participantId))) {
      const retired = await prisma.participantSession.updateMany({
        // lastSeenAt guard: skip if a concurrent heartbeat refreshed it meanwhile.
        where: { id: session.id, leftAt: null, lastSeenAt: session.lastSeenAt },
        data: {
          leftAt: session.lastSeenAt,
          durationSeconds: Math.max(0, Math.round((session.lastSeenAt.getTime() - session.joinedAt.getTime()) / 1000)),
        },
      });
      if (retired.count > 0) return sessionEnded();
    }

    const refreshed = await prisma.$transaction(async (tx) => {
      if (session.participant.userId) {
        await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${session.participant.userId} FOR UPDATE`;
      }
      const updated = await tx.participantSession.updateMany({
        where: {
          id: session.id, leftAt: null,
          participant: { meeting: { endedAt: null, room: { status: "active" } } },
        },
        data: { lastSeenAt: new Date() },
      });
      return updated.count > 0;
    });
    if (!refreshed) return sessionEnded();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AdmissionError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    console.error("Heartbeat Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
