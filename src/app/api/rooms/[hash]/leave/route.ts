import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const leaveSchema = z.object({
  connectionId: z.string().min(1, "connectionId is required"),
});

export async function POST(req: Request, { params }: { params: Promise<{ hash: string }> }) {
  try {
    const body = await req.json();
    const result = leaveSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { connectionId } = result.data;
    const { hash } = await params;

    const session = await prisma.participantSession.findFirst({
      where: { connectionId, leftAt: null, participant: { meeting: { room: { roomHash: hash } } } },
    });

    // Already marked as left (or never existed) — treat as success, idempotent.
    if (!session) {
      return NextResponse.json({ success: true });
    }

    const leftAt = new Date();
    const durationSeconds = Math.round(
      (leftAt.getTime() - session.joinedAt.getTime()) / 1000,
    );

    await prisma.participantSession.update({
      where: { id: session.id },
      data: { leftAt, durationSeconds },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leave Room Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
