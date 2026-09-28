import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadRecording, getRecordingPresignedUrl } from "@/lib/storage";
import { transcodeToMp3, probeDurationSeconds } from "@/lib/audio-transcode";
import { randomUUID } from "crypto";
import { LEAVE_GRACE_MS, resolveMeetingAccess } from "@/lib/meeting-access";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: meetingId } = await params;
    const participantId = new URL(req.url).searchParams.get("participantId");
    const access = await resolveMeetingAccess(meetingId, {
      participantId,
      connectionId: req.headers.get("x-connection-id"),
    });

    if (!access.meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const recordings = await prisma.recording.findMany({
      where: { meetingId },
      orderBy: { createdAt: "desc" },
      include: { participant: { select: { displayName: true } } },
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
          participantId: rec.participantId,
          speakerName: rec.participant?.displayName ?? null,
          fileName: rec.fileName,
          objectKey: rec.objectKey,
          startOffsetSeconds: rec.startOffsetSeconds,
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
    const connectionId = req.headers.get("x-connection-id");
    const checkAccess = (participantId: string | null) =>
      resolveMeetingAccess(meetingId, { participantId, connectionId }, { leftGraceMs: LEAVE_GRACE_MS });

    // Check before reading the body: a long meeting's upload can outlast the
    // uploader's session, e.g. when the host ends the meeting mid-upload.
    const headerParticipantId = req.headers.get("x-participant-id");
    let access = await checkAccess(headerParticipantId);
    if (!access.meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    if (!access.allowed && headerParticipantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const contentType = req.headers.get("content-type") || "";

    let audioBuffer: Buffer;
    let fileName: string = `recording-${Date.now()}.webm`;
    let mimeType: string = "audio/webm";
    let durationSeconds: number | null = null;
    let participantId: string | null = null;
    let startOffsetSeconds: number | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const durationParam = formData.get("durationSeconds");
      const startOffsetParam = formData.get("startOffsetSeconds");
      participantId = (formData.get("participantId") as string | null) || headerParticipantId;

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
      if (startOffsetParam) {
        startOffsetSeconds = parseFloat(String(startOffsetParam));
        if (!Number.isFinite(startOffsetSeconds)) startOffsetSeconds = null;
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
      participantId = headerParticipantId;
    }

    // The recording is stored under the body's participant id, so that is
    // the one the caller must have proven.
    if (participantId !== headerParticipantId) {
      access = await checkAccess(participantId);
    }
    if (!access.meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (audioBuffer.length === 0) {
      return NextResponse.json({ error: "Audio buffer is empty" }, { status: 400 });
    }

    // Standardize every recording to mp3, regardless of what the browser
    // captured (webm/opus, ogg, ...), so stored files are consistent.
    let ext = "mp3";
    try {
      audioBuffer = await transcodeToMp3(audioBuffer);
      mimeType = "audio/mpeg";
      // Trust the encoded file's own duration over the client's elapsed-clock
      // estimate — it's what playback-window matching actually seeks against.
      const probedDuration = await probeDurationSeconds(audioBuffer);
      if (probedDuration !== null) {
        durationSeconds = Math.round(probedDuration);
      }
    } catch (transcodeErr) {
      console.error("mp3 transcode failed, storing original format:", transcodeErr);
      ext = fileName.includes(".") ? fileName.split(".").pop()! : "webm";
    }

    // Human-readable name for data management: ID_Name_RoomNumber.
    // The actual storage path below stays opaque/recordingId-based so a
    // display-name or room-number change never breaks a stored reference.
    const speaker = participantId
      ? await prisma.participant.findUnique({ where: { id: participantId }, select: { displayName: true } })
      : null;
    const sanitize = (s: string) => s.replace(/[^\p{L}\p{N}_-]+/gu, "_").replace(/^_+|_+$/g, "") || "unknown";
    fileName = [
      sanitize(participantId || "guest"),
      sanitize(speaker?.displayName || "guest"),
      sanitize(access.meeting.room.roomHash),
    ].join("_") + `.${ext}`;

    const recordingId = randomUUID();
    const objectKey = `recordings/${meetingId}/${recordingId}.${ext}`;

    // Upload to MinIO/S3
    await uploadRecording(audioBuffer, objectKey, mimeType);

    // Save Recording metadata in database
    const recording = await prisma.recording.create({
      data: {
        id: recordingId,
        meetingId,
        participantId: participantId || null,
        fileName,
        objectKey,
        startOffsetSeconds,
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

    // Store this participant's own transcript segments alongside their audio
    // in MinIO, so the voice and the words spoken travel together as one unit
    // instead of only living in Postgres.
    if (participantId) {
      try {
        const transcript = await prisma.transcript.findUnique({
          where: { meetingId },
          select: { id: true },
        });
        if (transcript) {
          const windowStart = startOffsetSeconds ?? 0;
          const windowEnd = durationSeconds != null ? windowStart + durationSeconds : null;
          const segments = await prisma.transcriptSegment.findMany({
            where: {
              transcriptId: transcript.id,
              participantId,
              startTime: { gte: windowStart, ...(windowEnd != null ? { lte: windowEnd } : {}) },
            },
            orderBy: { startTime: "asc" },
            select: { startTime: true, endTime: true, text: true, confidence: true, spokenAt: true },
          });
          const transcriptKey = `recordings/${meetingId}/${recordingId}.json`;
          const transcriptPayload = JSON.stringify(
            {
              recordingId,
              meetingId,
              participantId,
              speakerName: speaker?.displayName ?? null,
              startOffsetSeconds,
              durationSeconds,
              segments,
            },
            null,
            2,
          );
          await uploadRecording(Buffer.from(transcriptPayload, "utf-8"), transcriptKey, "application/json");
        }
      } catch (transcriptUploadErr) {
        console.error("Transcript companion upload failed:", transcriptUploadErr);
      }
    }

    const speakerName = speaker?.displayName ?? null;

    return NextResponse.json(
      {
        success: true,
        recording: {
          id: recording.id,
          meetingId: recording.meetingId,
          participantId: recording.participantId,
          speakerName,
          fileName: recording.fileName,
          objectKey: recording.objectKey,
          startOffsetSeconds: recording.startOffsetSeconds,
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
