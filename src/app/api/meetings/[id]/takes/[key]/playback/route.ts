import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveMeetingAccess } from "@/lib/meeting-access";
import { groupRecordingTakes } from "@/lib/recording-takes";
import { ensureTakeMix } from "@/lib/recording-take-mix";
import { streamRecordingObject } from "@/lib/recording-response";

/** Plays (or downloads) one take with every speaker mixed together. */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; key: string }> },
) {
  try {
    const { id: meetingId, key } = await params;
    const access = await resolveMeetingAccess(meetingId);
    if (!access.meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const recordings = await prisma.recording.findMany({
      where: { meetingId },
      select: { id: true, objectKey: true, startOffsetSeconds: true, durationSeconds: true },
    });
    const takes = groupRecordingTakes(recordings);
    const index = takes.findIndex((take) => take.key === key);
    if (index === -1) {
      // A late upload changes the take's key; the page has to reload it.
      return NextResponse.json({ error: "Recording take not found" }, { status: 404 });
    }

    const objectKey = await ensureTakeMix(meetingId, takes[index]);
    return await streamRecordingObject(req, {
      objectKey,
      mimeType: "audio/mpeg",
      fileName: `${access.meeting.room.roomHash}_recording-${index + 1}.mp3`,
    });
  } catch (error) {
    console.error("Recording Take Playback Error:", error);
    return NextResponse.json({ error: "Unable to play recording" }, { status: 500 });
  }
}
