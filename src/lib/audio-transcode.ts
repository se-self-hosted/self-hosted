import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { setPriority, tmpdir } from "os";
import { join } from "path";
import { readFile, unlink } from "fs/promises";

// Encoding runs on the same small host as the LiveKit SFU. Stopping a
// recording makes every participant upload at once, and a burst of
// full-speed encodes starves the SFU, dropping audio for the whole room.
// So encode one file at a time, at the lowest CPU priority.
function createQueue() {
  let tail: Promise<unknown> = Promise.resolve();
  return function enqueue<T>(job: () => Promise<T>): Promise<T> {
    const run = tail.then(job, job);
    tail = run.catch(() => {});
    return run;
  };
}

// Uploads and take mixes queue separately: a long mix (up to MIX_TIMEOUT_MS)
// must not hold back every recording upload behind it.
const enqueueUpload = createQueue();
const enqueueMix = createQueue();

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
 * Transcodes any browser-recorded audio (webm/opus, ogg, ...) to a standard
 * mp3 via ffmpeg, and reads back the encoded file's real duration.
 *
 * ffmpeg writes straight to a temp file that ffprobe then reads, so the mp3
 * isn't held in memory twice nor written to disk a second time for probing.
 */
export function transcodeToMp3(input: Buffer): Promise<{ buffer: Buffer; durationSeconds: number | null }> {
  return enqueueUpload(async () => {
    const tmpPath = join(tmpdir(), `transcode-${randomUUID()}.mp3`);
    try {
      await encodeMp3(input, tmpPath);
      const durationSeconds = await probe(tmpPath);
      return { buffer: await readFile(tmpPath), durationSeconds };
    } finally {
      await unlink(tmpPath).catch(() => {});
    }
  });
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
function probe(path: string): Promise<number | null> {
  return new Promise((resolve) => {
    const ffprobe = spawnLowPriority("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      path,
    ]);

    let stdout = "";
    ffprobe.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    ffprobe.on("error", () => resolve(null));
    ffprobe.on("close", (code) => {
      const seconds = parseFloat(stdout.trim());
      resolve(code === 0 && Number.isFinite(seconds) ? seconds : null);
    });
  });
}

function encodeMp3(input: Buffer, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawnLowPriority("ffmpeg", [
      "-y",
      "-threads", "1",
      "-i", "pipe:0",
      "-vn",
      "-acodec", "libmp3lame",
      "-ar", "44100",
      "-b:a", "128k",
      "-f", "mp3",
      outputPath,
    ]);

    let stderr = "";
    ffmpeg.stderr.on("data", (chunk) => { stderr = (stderr + chunk.toString()).slice(-4000); });

    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
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

// A mix is only made when a host opens a take, but a stuck ffmpeg would hold
// the mix queue and with it every other take waiting to be mixed.
const MIX_TIMEOUT_MS = 10 * 60 * 1000;

/**
 * Mixes audio files into one mp3, each shifted by its own delay so speakers
 * line up on the shared timeline. Mono and 96 kbps: it's speech, and a smaller
 * encode keeps the CPU free for live calls.
 */
export function mixToMp3(inputs: { path: string; delaySeconds: number }[]): Promise<Buffer> {
  return enqueueMix(() => encodeMix(inputs));
}

function encodeMix(inputs: { path: string; delaySeconds: number }[]): Promise<Buffer> {
  const delayed = inputs.map(
    ({ delaySeconds }, index) => `[${index}:a]adelay=${Math.max(0, Math.round(delaySeconds * 1000))}:all=1[d${index}]`,
  );
  const labels = inputs.map((_, index) => `[d${index}]`).join("");
  // Sum rather than average (normalize=0), so a lone speaker isn't turned down
  // as more people join, and limit the sum so overlapping voices don't clip.
  const filter = `${delayed.join(";")};${labels}amix=inputs=${inputs.length}:normalize=0:dropout_transition=0,alimiter=limit=0.95[out]`;

  return new Promise((resolve, reject) => {
    const ffmpeg = spawnLowPriority("ffmpeg", [
      "-nostdin",
      ...inputs.flatMap(({ path }) => ["-i", path]),
      "-filter_complex", filter,
      "-map", "[out]",
      "-ac", "1",
      "-ar", "44100",
      "-acodec", "libmp3lame",
      "-b:a", "96k",
      "-f", "mp3",
      "pipe:1",
    ]);
    const timeout = setTimeout(() => ffmpeg.kill("SIGKILL"), MIX_TIMEOUT_MS);

    const outChunks: Buffer[] = [];
    let stderr = "";
    ffmpeg.stdout.on("data", (chunk) => outChunks.push(chunk));
    ffmpeg.stderr.on("data", (chunk) => { stderr = (stderr + chunk.toString()).slice(-4000); });
    ffmpeg.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    ffmpeg.on("close", (code, signal) => {
      clearTimeout(timeout);
      if (code === 0) resolve(Buffer.concat(outChunks));
      else reject(new Error(`ffmpeg mix failed (${signal ?? `code ${code}`}): ${stderr.slice(-2000)}`));
    });
  });
}
