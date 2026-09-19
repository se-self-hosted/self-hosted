export type RecognitionResult = {
  isFinal: boolean;
  [index: number]: { transcript: string; confidence?: number };
};

export type SpeechRecognizer = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onspeechstart: (() => void) | null;
  onresult: ((event: { resultIndex: number; results: ArrayLike<RecognitionResult> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: (track?: MediaStreamTrack) => void;
  stop: () => void;
};

type Options = {
  getAudioTrack: () => MediaStreamTrack | undefined;
  elapsedSeconds: () => number;
  onFinal: (text: string, startTime: number, duration: number, confidence: number) => void;
  onInterim: (text: string) => void;
  /** `isError` marks a terminal failure worth surfacing to the user, as opposed to routine status pings. */
  onStatus: (message: string, isError?: boolean) => void;
};

/** Keep interim hypotheses separate; only the recognizer's final result is saved. */
export function startLiveTranscription(recognition: SpeechRecognizer, options: Options) {
  let active = true;
  let failedAttempts = 0;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  let drainTimer: ReturnType<typeof setTimeout> | undefined;
  let startTime = options.elapsedSeconds();
  let interim = "";
  let stopped = false;
  const finalized = new Set<number>();
  const interimByIndex = new Map<number, string>();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "th-TH";

  const detach = () => {
    clearTimeout(drainTimer);
    recognition.onstart = recognition.onspeechstart = recognition.onresult = recognition.onerror = recognition.onend = null;
  };

  const scheduleRestart = () => {
    if (!active || retryTimer) return;
    if (failedAttempts >= 5) {
      active = false;
      options.onStatus("ถอดเสียงหยุดทำงาน กรุณาตรวจสอบการเชื่อมต่อแล้วกดเริ่มใหม่", true);
      return;
    }
    const delay = Math.min(500 * 2 ** failedAttempts, 8000);
    failedAttempts += 1;
    retryTimer = setTimeout(() => {
      retryTimer = undefined;
      start();
    }, delay);
  };

  function start() {
    if (!active) return;
    finalized.clear();
    interimByIndex.clear();
    startTime = options.elapsedSeconds();
    try {
      // LiveKit exposes the RNNoise-processed track. Older browsers may ignore
      // the optional argument and continue using their default microphone.
      const track = options.getAudioTrack();
      if (track?.kind === "audio" && track.readyState === "live") {
        try {
          recognition.start(track);
        } catch (error) {
          if (!(error instanceof TypeError) && !(error instanceof DOMException && error.name === "NotSupportedError")) throw error;
          recognition.start();
        }
      } else {
        recognition.start();
      }
    } catch {
      options.onStatus("เริ่มถอดเสียงไม่สำเร็จ กำลังลองใหม่...");
      scheduleRestart();
    }
  }

  recognition.onstart = () => {
    if (active) options.onStatus("กำลังฟังเสียง");
  };
  recognition.onspeechstart = () => {
    if (!interim) startTime = options.elapsedSeconds();
  };
  recognition.onresult = (event) => {
    failedAttempts = 0;
    for (const index of interimByIndex.keys()) {
      if (index >= event.resultIndex) interimByIndex.delete(index);
    }
    // Results before resultIndex are unchanged, so avoid rescanning the
    // recognizer's growing history on every event.
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      const alternative = result[0];
      const text = alternative?.transcript.trim();
      if (!text) continue;
      if (!result.isFinal) {
        interimByIndex.set(index, text);
        continue;
      }
      if (finalized.has(index)) continue;
      finalized.add(index);
      const endTime = options.elapsedSeconds();
      const confidence = alternative.confidence;
      options.onFinal(text, startTime, Math.max(0, endTime - startTime),
        typeof confidence === "number" && Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : 0);
      startTime = endTime;
    }
    const nextInterim = [...interimByIndex.values()].join(" ");
    if (active && nextInterim !== interim) options.onInterim(nextInterim);
    interim = nextInterim;
  };
  recognition.onerror = ({ error }) => {
    if (!active) return;
    if (error === "no-speech") {
      failedAttempts = 0;
    } else if (["not-allowed", "service-not-allowed", "audio-capture", "language-not-supported"].includes(error)) {
      active = false;
      clearTimeout(retryTimer);
      options.onStatus(error === "language-not-supported"
        ? "เบราว์เซอร์ไม่รองรับการถอดเสียงภาษาไทย"
        : "ถอดเสียงไม่ได้ กรุณาตรวจสอบสิทธิ์ไมโครโฟนแล้วกดเริ่มใหม่", true);
    } else if (error !== "no-speech") {
      options.onStatus("การถอดเสียงขัดข้อง บางคำอาจหายไป กำลังเชื่อมต่อใหม่...");
    }
  };
  recognition.onend = () => {
    if (!active) {
      detach();
      return;
    }
    if (interim) options.onStatus("ประโยคล่าสุดถอดเสียงไม่สมบูรณ์ กรุณาพูดซ้ำ");
    interim = "";
    interimByIndex.clear();
    options.onInterim("");
    scheduleRestart();
  };
  start();

  return () => {
    if (stopped) return;
    stopped = true;
    active = false;
    clearTimeout(retryTimer);
    options.onInterim("");
    // stop() can deliver a final result for already captured audio after mute.
    // Give it time to drain, while preventing any automatic restart.
    drainTimer = setTimeout(detach, 2000);
    try { recognition.stop(); } catch { detach(); }
  };
}
