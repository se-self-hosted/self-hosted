import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRecordingObject, getRecordingPresignedUrl } from "@/lib/storage";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: recordingId } = await params;

    const recording = await prisma.recording.findUnique({
      where: { id: recordingId },
    });

    if (!recording) {
      return NextResponse.json({ error: "Recording not found" }, { status: 404 });
    }

    try {
      const s3Response = await getRecordingObject(recording.objectKey);

      if (!s3Response.Body) {
        // Fallback to presigned URL redirect
        const presignedUrl = await getRecordingPresignedUrl(recording.objectKey);
        return NextResponse.redirect(presignedUrl);
      }

      const totalSize = Number(recording.fileSize);
      const mimeType = recording.mimeType || s3Response.ContentType || "audio/webm";

      const rangeHeader = req.headers.get("range");

      // Handle Range request for audio seeking
      if (rangeHeader && totalSize > 0) {
        const parts = rangeHeader.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

        if (start >= totalSize || end >= totalSize || start > end) {
          return new NextResponse("Requested Range Not Satisfiable", {
            status: 416,
            headers: {
              "Content-Range": `bytes */${totalSize}`,
            },
          });
        }

        const chunkLength = end - start + 1;
        const bodyStream = s3Response.Body.transformToWebStream();

        return new NextResponse(bodyStream as ReadableStream, {
          status: 206,
          headers: {
            "Content-Type": mimeType,
            "Content-Range": `bytes ${start}-${end}/${totalSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": String(chunkLength),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }

      // Full stream response
      const bodyStream = s3Response.Body.transformToWebStream();
      return new NextResponse(bodyStream as ReadableStream, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Content-Length": totalSize > 0 ? String(totalSize) : undefined as unknown as string,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (s3Err) {
      console.warn("Direct stream error, attempting presigned redirect:", s3Err);
      const presignedUrl = await getRecordingPresignedUrl(recording.objectKey);
      return NextResponse.redirect(presignedUrl);
    }
  } catch (error) {
    console.error("Recording Playback Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
