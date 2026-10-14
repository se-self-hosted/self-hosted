import { NextResponse } from "next/server";
import { LEAVE_GRACE_MS, resolveMeetingAccess } from "@/lib/meeting-access";
import { tryLock, unlock } from "@/lib/shared-state";
import {
  httpStatusForSpeechToTextError,
  SpeechToTextError,
  speechToTextConfigFromEnv,
  transcribeAudio,
} from "@/lib/speech-to-text";

// The client sends one utterance of at most ~20 s of 16 kHz mono WAV
// (~640 KB); anything much larger is not a live transcript line.
const MAX_AUDIO_BYTES = 1_500_000;
// Covers the STT call's own 30 s timeout, so a held lock always means a
// request still in flight.
const LOCK_TTL_MS = 35_000;

/**
 * Transcribes one utterance of the caller's own speech and returns the text.
 * Saving and broadcasting the line stays with the client, through the same
 * transcript endpoint the browser recognizer used.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: meetingId } = await params;

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
    }
    const participantId = form.get("participantId");
    const audio = form.get("audio");

    const access = await resolveMeetingAccess(
      meetingId,
      {
        participantId: typeof participantId === "string" ? participantId : null,
        connectionId: req.headers.get("x-connection-id"),
      },
      // The last utterance before leaving is still uploading.
      { leftGraceMs: LEAVE_GRACE_MS },
    );
    if (!access.meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!(audio instanceof Blob) || audio.size === 0) {
      return NextResponse.json({ error: "Audio is required" }, { status: 400 });
    }
    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: "Audio is too long" }, { status: 413 });
    }

    const config = speechToTextConfigFromEnv();
    if (!config) {
      return NextResponse.json({ error: "Speech-to-text is not configured", code: "STT_NOT_CONFIGURED" }, { status: 503 });
    }

    // One utterance in flight per speaker: the client sends them in order,
    // and this bounds what one session can spend on the provider.
    const lockName = `transcribe:${meetingId}:${typeof participantId === "string" && participantId ? participantId : "host"}`;
    const token = await tryLock(lockName, LOCK_TTL_MS);
    if (!token) {
      return NextResponse.json({ error: "Another utterance is still being transcribed" }, { status: 429 });
    }
    try {
      const text = await transcribeAudio(audio, config);
      return NextResponse.json({ text });
    } finally {
      await unlock(lockName, token);
    }
  } catch (error) {
    if (error instanceof SpeechToTextError) {
      console.error("Transcribe error:", error.code, error.message);
      return NextResponse.json({ error: "Transcription failed", code: error.code }, { status: httpStatusForSpeechToTextError(error.code) });
    }
    console.error("Transcribe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
