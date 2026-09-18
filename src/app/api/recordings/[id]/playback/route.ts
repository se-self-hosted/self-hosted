import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRecordingObject } from "@/lib/storage";
import { resolveMeetingAccess } from "@/lib/meeting-access";

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

    // Ignore malformed/multipart ranges; MinIO handles valid single ranges,
    // including suffix and open-ended requests, and streams only those bytes.
    const requestedRange = req.headers.get("range");
    const range = requestedRange && /^bytes=(?:\d+-\d*|-\d+)$/.test(requestedRange)
      ? requestedRange
      : undefined;
    const object = await getRecordingObject(recording.objectKey, range);
    if (object.status === 416) {
      void object.Body?.cancel().catch(() => {});
      return new NextResponse(null, {
        status: 416,
        headers: {
          "Content-Range": object.ContentRange || `bytes */${recording.fileSize}`,
          "Cache-Control": "private, no-store",
        },
      });
    }
    if (object.status !== 200 && object.status !== 206) {
      void object.Body?.cancel().catch(() => {});
      return NextResponse.json(
        { error: object.status === 404 ? "Recording file not found" : "Recording storage unavailable" },
        { status: object.status === 404 ? 404 : 502 },
      );
    }
    if (!object.Body) {
      return NextResponse.json({ error: "Recording stream unavailable" }, { status: 502 });
    }

    const headers = new Headers({
      "Content-Type": recording.mimeType || object.ContentType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
    });
    if (object.ContentLength !== undefined) {
      headers.set("Content-Length", String(object.ContentLength));
    }
    if (object.ContentRange) headers.set("Content-Range", object.ContentRange);
    return new NextResponse(object.Body, { status: object.status, headers });
  } catch (error) {
    console.error("Recording Playback Error:", error);
    return NextResponse.json({ error: "Unable to play recording" }, { status: 500 });
  }
}
