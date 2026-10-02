import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { setPriority, tmpdir } from "os";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";

// Encoding runs on the same small host as the LiveKit SFU. Stopping a
// recording makes every participant upload at once, and a burst of
// full-speed encodes starves the SFU, dropping audio for the whole room.
// So encode one file at a time, at the lowest CPU priority.
let encodeQueue: Promise<unknown> = Promise.resolve();

function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const run = encodeQueue.then(job, job);
  encodeQueue = run.catch(() => {});
  return run;
}

function spawnLowPriority(command: string, args: string[]) {
  const child = spawn(command, args);
  if (child.pid) {
    try {
      setPriority(child.pid, 19);
    } catch {
      // Still encode at normal priority rather than fail the upload.
    }
  }
  return child;
}

/**
 * Real duration of the encoded mp3, read back from the file itself via ffprobe.
 * The client's own estimate (elapsed-clock math, background-tab timer drift) is
 * only a guess — trusting it for playback-window matching lets a segment seek
 * past a short recording's actual end, which the <audio> element then silently
 * clamps to, i.e. "starts playing right at the end of the voice".
 *
 * mp3 duration can only be derived by seeking (scanning frames / reading the
 * end of the file for a size-based estimate), so ffprobe needs a real seekable
 * file here — piping it the buffer over stdin silently yields "N/A".
 */
export function probeDurationSeconds(input: Buffer): Promise<number | null> {
  return enqueue(() => probe(input));
}

async function probe(input: Buffer): Promise<number | null> {
  const tmpPath = join(tmpdir(), `probe-${randomUUID()}.mp3`);
  try {
    await writeFile(tmpPath, input);
    return await new Promise((resolve) => {
      const ffprobe = spawnLowPriority("ffprobe", [
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        tmpPath,
      ]);

      let stdout = "";
      ffprobe.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
      ffprobe.on("error", () => resolve(null));
      ffprobe.on("close", (code) => {
        const seconds = parseFloat(stdout.trim());
        resolve(code === 0 && Number.isFinite(seconds) ? seconds : null);
      });
    });
  } catch {
    return null;
  } finally {
    await unlink(tmpPath).catch(() => {});
  }
}

/** Transcodes any browser-recorded audio (webm/opus, ogg, ...) to a standard mp3 buffer via ffmpeg. */
export function transcodeToMp3(input: Buffer): Promise<Buffer> {
  return enqueue(() => encodeMp3(input));
}

function encodeMp3(input: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawnLowPriority("ffmpeg", [
      "-threads", "1",
      "-i", "pipe:0",
      "-vn",
      "-acodec", "libmp3lame",
      "-ar", "44100",
      "-b:a", "128k",
      "-f", "mp3",
      "pipe:1",
    ]);

    const outChunks: Buffer[] = [];
    let stderr = "";

    ffmpeg.stdout.on("data", (chunk) => outChunks.push(chunk));
    ffmpeg.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(Buffer.concat(outChunks));
      } else {
        reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-2000)}`));
      }
    });

    ffmpeg.stdin.on("error", () => {
      // Ignore EPIPE if ffmpeg exits before stdin is fully drained; the
      // "close" handler above still reports the real failure.
    });
    ffmpeg.stdin.end(input);
  });
}
