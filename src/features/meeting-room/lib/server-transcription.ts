import type { RecordingBus } from "./recording-bus";
import { createUtteranceSegmenter, encodeWav, type Utterance } from "./utterance-segmenter";

const WORKLET_URL = "/pcm-capture-worklet-1.js";
// A failed upload is retried this long before the line is given up on.
const RETRY_DELAYS_MS = [1000, 3000];
// Utterances waiting on a slow network beyond this are dropped, newest first,
// so a stalled connection can't pile up minutes of audio in memory.
const MAX_QUEUED = 8;

type QueueOptions = {
  /** Uploads one WAV utterance; resolves with the transcribe API response. */
  transcribe: (wav: Blob) => Promise<Response>;
  onFinal: (text: string, startTime: number, duration: number) => void;
  /** True while an utterance is waiting on the server. */
  onPending: (pending: boolean) => void;
  /** `isError` marks a failure worth surfacing to the user. */
  onStatus: (message: string, isError?: boolean) => void;
  /** The server has no speech-to-text configured; the caller can fall back. */
  onUnavailable: () => void;
  wait?: (ms: number) => Promise<void>;
};

/**
 * Sends utterances to the server one at a time, in order, so lines come back
 * in the order they were spoken and one speaker never has two in flight.
 */
export function createTranscriptionQueue({
  transcribe, onFinal, onPending, onStatus, onUnavailable,
  wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
}: QueueOptions) {
  const queue: Utterance[] = [];
  let running = false;
  let stopped = false;

  async function send(utterance: Utterance) {
    const wav = new Blob([encodeWav(utterance.samples)], { type: "audio/wav" });
    for (let attempt = 0; ; attempt += 1) {
      let response: Response | undefined;
      try {
        response = await transcribe(wav);
      } catch {
        // Network failure: retried below.
      }
      if (response?.ok) {
        const body = (await response.json().catch(() => null)) as { text?: unknown } | null;
        const text = typeof body?.text === "string" ? body.text.trim() : "";
        if (text) onFinal(text, utterance.startTime, utterance.duration);
        return;
      }
      if (response) {
        const body = (await response.json().catch(() => null)) as { code?: unknown } | null;
        if (body?.code === "STT_NOT_CONFIGURED") {
          stopped = true;
          queue.length = 0;
          onUnavailable();
          return;
        }
        if (body?.code === "STT_AUTH_FAILED") {
          stopped = true;
          queue.length = 0;
          onStatus("บริการถอดเสียงปฏิเสธการเชื่อมต่อ กรุณาแจ้งผู้ดูแลระบบ", true);
          return;
        }
        // A bad or oversized upload stays bad on retry. 403 does not: a
        // stale heartbeat (a backgrounded phone) recovers on the next one.
        if ([400, 404, 413].includes(response.status)) {
          onStatus(`ถอดเสียงประโยคนี้ไม่สำเร็จ (${response.status})`);
          return;
        }
      }
      if (attempt >= RETRY_DELAYS_MS.length || stopped) {
        onStatus("ถอดเสียงบางประโยคไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อ", true);
        return;
      }
      await wait(RETRY_DELAYS_MS[attempt]);
    }
  }

  async function drain() {
    if (running) return;
    running = true;
    onPending(true);
    try {
      while (queue.length > 0 && !stopped) await send(queue.shift()!);
    } finally {
      running = false;
      onPending(false);
    }
  }

  return {
    enqueue(utterance: Utterance) {
      if (stopped) return;
      if (queue.length >= MAX_QUEUED) {
        onStatus("เครือข่ายช้า บางประโยคอาจไม่ถูกถอดเสียง");
        return;
      }
      queue.push(utterance);
      void drain();
    },
  };
}

type CaptureOptions = QueueOptions & {
  elapsedSeconds: () => number;
};

/**
 * Captures the bus's audio at 16 kHz, cuts it at pauses and transcribes each
 * utterance on the server. Unlike the browser recognizer this works in every
 * browser with AudioWorklet, phones included, and never opens the mic a
 * second time. Returns a stop function; utterances already cut still upload.
 */
export function startServerTranscription(bus: RecordingBus, options: CaptureOptions) {
  const { context } = bus;
  const queue = createTranscriptionQueue(options);
  const segmenter = createUtteranceSegmenter(queue.enqueue);
  let active = true;
  let source: MediaStreamAudioSourceNode | undefined;
  let node: AudioWorkletNode | undefined;
  let mute: GainNode | undefined;

  // Phones start an AudioContext made outside a tap suspended; the next tap
  // anywhere resumes it.
  const resume = () => {
    if (context.state === "suspended") void bus.resume().catch(() => {});
  };
  const gestures = ["pointerdown", "touchend", "keydown"] as const;
  gestures.forEach((name) => document.addEventListener(name, resume, { passive: true }));
  resume();

  void (async () => {
    try {
      await context.audioWorklet.addModule(WORKLET_URL);
    } catch (error) {
      console.error("Speech capture worklet failed to load:", error);
      if (active) options.onUnavailable();
      return;
    }
    if (!active) return;
    source = context.createMediaStreamSource(bus.stream);
    node = new AudioWorkletNode(context, "pcm-capture", { numberOfInputs: 1, numberOfOutputs: 1 });
    node.port.onmessage = ({ data }: MessageEvent<Float32Array>) => {
      if (active) segmenter.push(data, options.elapsedSeconds());
    };
    // A worklet only runs while connected to the destination; keep it silent.
    mute = context.createGain();
    mute.gain.value = 0;
    source.connect(node).connect(mute).connect(context.destination);
    options.onStatus("กำลังฟังเสียง");
  })();

  return () => {
    active = false;
    gestures.forEach((name) => document.removeEventListener(name, resume));
    segmenter.flush();
    if (node) node.port.onmessage = null;
    source?.disconnect();
    node?.disconnect();
    mute?.disconnect();
  };
}
