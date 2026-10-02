import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveMeetingAccess } from "@/lib/meeting-access";
import { streamRecordingObject } from "@/lib/recording-response";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const recording = await prisma.recording.findUnique({ where: { id } });
    if (!recording) {
      return NextResponse.json({ error: "Recording not found" }, { status: 404 });
    }

    const access = await resolveMeetingAccess(recording.meetingId);
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return await streamRecordingObject(req, recording);
  } catch (error) {
    console.error("Recording Playback Error:", error);
    return NextResponse.json({ error: "Unable to play recording" }, { status: 500 });
  }
}
