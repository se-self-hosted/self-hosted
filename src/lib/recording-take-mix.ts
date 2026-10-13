import { createWriteStream } from "fs";
import { mkdtemp, rm } from "fs/promises";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import type { ReadableStream as NodeReadableStream } from "stream/web";
import { tmpdir } from "os";
import { extname, join } from "path";
import { mixToMp3 } from "./audio-transcode";
import { getRecordingObject, uploadRecording } from "./storage";
import { tryLock, unlock } from "./shared-state";
import type { RecordingTake } from "./recording-takes";

type MixSource = {
  id: string;
  objectKey: string;
  startOffsetSeconds: number | null;
  durationSeconds: number | null;
};

// Two viewers opening the same take at once share one mix instead of encoding
// twice: in this process through the shared promise, across app instances
// through a lock while the others wait for the finished file.
const inFlight = new Map<string, Promise<string>>();
// Longer than a mix may run (MIX_TIMEOUT_MS in audio-transcode) plus its upload.
const MIX_LOCK_TTL_MS = 12 * 60 * 1000;
const WAIT_POLL_MS = 1_000;

export function takeMixObjectKey(meetingId: string, takeKey: string): string {
  return `recordings/${meetingId}/takes/${takeKey}.mp3`;
}

/**
 * Returns the storage key of the take's mixed mp3, mixing it from the
 * per-speaker files on first use. The key encodes the take's file set, so a
 * late upload gets a fresh mix rather than a stale one.
 */
export function ensureTakeMix(meetingId: string, take: RecordingTake<MixSource>): Promise<string> {
  const objectKey = takeMixObjectKey(meetingId, take.key);
  let pending = inFlight.get(objectKey);
  if (!pending) {
    pending = mixIfMissing(objectKey, take).finally(() => inFlight.delete(objectKey));
    inFlight.set(objectKey, pending);
  }
  return pending;
}

async function objectExists(objectKey: string): Promise<boolean> {
  const existing = await getRecordingObject(objectKey, "bytes=0-0");
  void existing.Body?.cancel().catch(() => {});
  return existing.status === 200 || existing.status === 206;
}

async function mixIfMissing(objectKey: string, take: RecordingTake<MixSource>): Promise<string> {
  const lockName = `take-mix:${objectKey}`;
  const deadline = Date.now() + MIX_LOCK_TTL_MS;
  for (;;) {
    if (await objectExists(objectKey)) return objectKey;
    const token = await tryLock(lockName, MIX_LOCK_TTL_MS);
    if (token) {
      try {
        // Another instance may have finished between the check and the lock.
        if (!(await objectExists(objectKey))) await mix(objectKey, take);
        return objectKey;
      } finally {
        await unlock(lockName, token);
      }
    }
    if (Date.now() > deadline) throw new Error(`Timed out waiting for another instance to mix ${objectKey}`);
    await new Promise((resolve) => setTimeout(resolve, WAIT_POLL_MS));
  }
}

async function mix(objectKey: string, take: RecordingTake<MixSource>): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), "take-mix-"));
  try {
    const inputs = await Promise.all(
      take.recordings.map(async (recording) => {
        const object = await getRecordingObject(recording.objectKey);
        if (object.status !== 200 || !object.Body) {
          void object.Body?.cancel().catch(() => {});
          throw new Error(`Recording ${recording.id} is unavailable (${object.status})`);
        }
        const path = join(dir, `${recording.id}${extname(recording.objectKey) || ".mp3"}`);
        // Stream to disk: a take can hold dozens of long files.
        await pipeline(Readable.fromWeb(object.Body as NodeReadableStream), createWriteStream(path));
        return { path, delaySeconds: recording.startOffsetSeconds! - take.startOffsetSeconds };
      }),
    );
    await uploadRecording(await mixToMp3(inputs), objectKey, "audio/mpeg");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
