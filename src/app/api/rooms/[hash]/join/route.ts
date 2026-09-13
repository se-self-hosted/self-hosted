import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { AdmissionError, joinMeeting } from "@/lib/meeting-admission";
import { z } from "zod";

const joinSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required"),
});

export async function POST(req: Request, { params }: { params: Promise<{ hash: string }> }) {
  try {
    const { hash } = await params;
    const result = joinSchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }
    const joined = await joinMeeting(hash, result.data.displayName, await getUserFromRequest());
    return NextResponse.json(joined, { status: 201 });
  } catch (error) {
    if (error instanceof AdmissionError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    console.error("Join Room Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
