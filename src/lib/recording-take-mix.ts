import { mkdtemp, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { extname, join } from "path";
import { mixToMp3 } from "./audio-transcode";
import { getRecordingObject, uploadRecording } from "./storage";
import type { RecordingTake } from "./recording-takes";

type MixSource = {
  id: string;
  objectKey: string;
  startOffsetSeconds: number | null;
  durationSeconds: number | null;
};

// Two viewers opening the same take at once share one mix instead of encoding twice.
const inFlight = new Map<string, Promise<string>>();

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

async function mixIfMissing(objectKey: string, take: RecordingTake<MixSource>): Promise<string> {
  const existing = await getRecordingObject(objectKey, "bytes=0-0");
  void existing.Body?.cancel().catch(() => {});
  if (existing.status === 200 || existing.status === 206) return objectKey;

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
        await writeFile(path, Buffer.from(await new Response(object.Body).arrayBuffer()));
        return { path, delaySeconds: recording.startOffsetSeconds! - take.startOffsetSeconds };
      }),
    );
    await uploadRecording(await mixToMp3(inputs), objectKey, "audio/mpeg");
    return objectKey;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
