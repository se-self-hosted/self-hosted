import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadRecording, getRecordingPresignedUrl } from "@/lib/storage";
import { randomUUID } from "crypto";
import { resolveMeetingAccess } from "@/lib/meeting-access";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: meetingId } = await params;
    const participantId = new URL(req.url).searchParams.get("participantId");
    const access = await resolveMeetingAccess(meetingId, participantId);

    if (!access.meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const recordings = await prisma.recording.findMany({
      where: { meetingId },
      orderBy: { createdAt: "desc" },
    });

    const recordingsWithUrls = await Promise.all(
      recordings.map(async (rec) => {
        let presignedUrl = "";
        try {
          presignedUrl = await getRecordingPresignedUrl(rec.objectKey);
        } catch (e) {
          console.warn("Could not generate presigned URL for recording:", rec.id, e);
        }

        return {
          id: rec.id,
          meetingId: rec.meetingId,
          fileName: rec.fileName,
          objectKey: rec.objectKey,
          durationSeconds: rec.durationSeconds,
          fileSize: rec.fileSize.toString(),
          mimeType: rec.mimeType,
          createdAt: rec.createdAt,
          playbackUrl: `/api/recordings/${rec.id}/playback`,
          presignedUrl,
        };
      }),
    );

    return NextResponse.json({ recordings: recordingsWithUrls });
  } catch (error) {
    console.error("Get Recordings Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: meetingId } = await params;

    const contentType = req.headers.get("content-type") || "";

    let audioBuffer: Buffer;
    let fileName: string = `recording-${Date.now()}.webm`;
    let mimeType: string = "audio/webm";
    let durationSeconds: number | null = null;
    let participantId: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const durationParam = formData.get("durationSeconds");
      participantId = (formData.get("participantId") as string | null) || null;

      if (!file) {
        return NextResponse.json({ error: "Audio file is required in 'file' field" }, { status: 400 });
      }

      fileName = file.name || fileName;
      mimeType = file.type || mimeType;
      const arrayBuffer = await file.arrayBuffer();
      audioBuffer = Buffer.from(arrayBuffer);

      if (durationParam) {
        durationSeconds = parseInt(String(durationParam), 10) || null;
      }
    } else {
      // Raw binary body upload
      const arrayBuffer = await req.arrayBuffer();
      audioBuffer = Buffer.from(arrayBuffer);
      mimeType = contentType || "audio/webm";
      const customFileName = req.headers.get("x-file-name");
      if (customFileName) fileName = customFileName;
      const customDuration = req.headers.get("x-duration-seconds");
      if (customDuration) durationSeconds = parseInt(customDuration, 10) || null;
      participantId = req.headers.get("x-participant-id");
    }

    const access = await resolveMeetingAccess(meetingId, participantId);
    if (!access.meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (audioBuffer.length === 0) {
      return NextResponse.json({ error: "Audio buffer is empty" }, { status: 400 });
    }

    const recordingId = randomUUID();
    const ext = fileName.includes(".") ? fileName.split(".").pop() : "webm";
    const objectKey = `recordings/${meetingId}/${recordingId}.${ext}`;

    // Upload to MinIO/S3
    await uploadRecording(audioBuffer, objectKey, mimeType);

    // Save Recording metadata in database
    const recording = await prisma.recording.create({
      data: {
        id: recordingId,
        meetingId,
        fileName,
        objectKey,
        durationSeconds,
        fileSize: BigInt(audioBuffer.length),
        mimeType,
      },
    });

    let presignedUrl = "";
    try {
      presignedUrl = await getRecordingPresignedUrl(objectKey);
    } catch {
      // Presigned url fallback
    }

    return NextResponse.json(
      {
        success: true,
        recording: {
          id: recording.id,
          meetingId: recording.meetingId,
          fileName: recording.fileName,
          objectKey: recording.objectKey,
          durationSeconds: recording.durationSeconds,
          fileSize: recording.fileSize.toString(),
          mimeType: recording.mimeType,
          createdAt: recording.createdAt,
          playbackUrl: `/api/recordings/${recording.id}/playback`,
          presignedUrl,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload Recording Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
