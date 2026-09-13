import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const heartbeatSchema = z.object({ connectionId: z.string().min(1) });

export async function POST(req: Request, { params }: { params: Promise<{ hash: string }> }) {
  try {
    const { hash } = await params;
    const result = heartbeatSchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }
    const refreshed = await prisma.$transaction(async (tx) => {
      const session = await tx.participantSession.findFirst({
        where: { connectionId: result.data.connectionId, participant: { meeting: { room: { roomHash: hash } } } },
        include: { participant: { select: { userId: true } } },
      });
      if (!session) return false;
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
    if (!refreshed) {
      return NextResponse.json({ error: "การเชื่อมต่อห้องประชุมนี้สิ้นสุดแล้ว กรุณาเข้าห้องใหม่", code: "SESSION_ENDED" }, { status: 409 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Heartbeat Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
