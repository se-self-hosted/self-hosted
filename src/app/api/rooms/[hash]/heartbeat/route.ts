import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const heartbeatSchema = z.object({
  connectionId: z.string().min(1, "connectionId is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = heartbeatSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { connectionId } = result.data;

    const session = await prisma.participantSession.findFirst({
      where: { connectionId, leftAt: null },
    });

    // Session already ended (or unknown) — nothing to refresh, not an error.
    if (!session) {
      return NextResponse.json({ success: true });
    }

    await prisma.participantSession.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Heartbeat Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
