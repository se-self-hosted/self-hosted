/**
 * Cuts a stream of 16 kHz mono frames into utterances at pauses, for upload
 * to server-side speech-to-text. Energy-based: the mic track is already
 * RNNoise-cleaned, so silence sits far below speech.
 */

export const SAMPLE_RATE = 16_000;
/** The capture worklet posts 20 ms frames. */
export const FRAME_SAMPLES = 320;
const FRAME_SECONDS = FRAME_SAMPLES / SAMPLE_RATE;

// Speech this many frames in a row opens an utterance (60 ms), so a click doesn't.
const ONSET_FRAMES = 3;
// Kept from before the onset: the first syllable starts quieter than the threshold.
const PRE_ROLL_FRAMES = 15;
// A pause this long ends the utterance (0.8 s).
const END_SILENCE_FRAMES = 40;
// Past this length, a shorter pause (0.3 s) is enough to end it…
const SOFT_MAX_FRAMES = 500;
const SOFT_END_SILENCE_FRAMES = 15;
// …and at this length it is cut regardless (20 s), keeping uploads small.
const HARD_MAX_FRAMES = 1000;
// Less voiced audio than this (0.25 s) is a cough or a bump, not a line.
const MIN_VOICED_FRAMES = 12;
// Silence kept after the last voiced frame, so the last word isn't clipped.
const TAIL_FRAMES = 10;

// RMS of a normalized frame. Speech is usually 0.02–0.3; RNNoise output in
// silence well under 0.005.
const MIN_SPEECH_LEVEL = 0.012;
// Speech must also stand this far above the running noise floor.
const NOISE_FLOOR_RATIO = 3;

export type Utterance = {
  samples: Float32Array;
  /** Meeting clock at the first kept sample. */
  startTime: number;
  duration: number;
};

export function frameLevel(frame: Float32Array) {
  let sum = 0;
  for (let index = 0; index < frame.length; index += 1) sum += frame[index] * frame[index];
  return frame.length ? Math.sqrt(sum / frame.length) : 0;
}

/**
 * `push` takes each frame with the meeting clock at its arrival, so a
 * suspended AudioContext (a backgrounded phone) can't skew timestamps.
 */
export function createUtteranceSegmenter(onUtterance: (utterance: Utterance) => void) {
  let noiseFloor = MIN_SPEECH_LEVEL / NOISE_FLOOR_RATIO;
  const preRoll: { frame: Float32Array; time: number }[] = [];
  let onsetRun = 0;
  let frames: Float32Array[] = [];
  let startTime = 0;
  let voicedFrames = 0;
  let silenceRun = 0;
  let inUtterance = false;

  const isSpeech = (level: number) => level >= Math.max(MIN_SPEECH_LEVEL, noiseFloor * NOISE_FLOOR_RATIO);

  function finish() {
    if (!inUtterance) return;
    const keep = Math.max(0, frames.length - Math.max(0, silenceRun - TAIL_FRAMES));
    const kept = frames.slice(0, keep);
    const voiced = voicedFrames;
    inUtterance = false;
    frames = [];
    voicedFrames = 0;
    silenceRun = 0;
    if (voiced < MIN_VOICED_FRAMES) return;
    const samples = new Float32Array(kept.length * FRAME_SAMPLES);
    kept.forEach((frame, index) => samples.set(frame, index * FRAME_SAMPLES));
    onUtterance({ samples, startTime, duration: kept.length * FRAME_SECONDS });
  }

  return {
    push(frame: Float32Array, now: number) {
      const level = frameLevel(frame);
      const speech = isSpeech(level);
      if (!speech) {
        // Falls fast, rises slowly: a steady hum lifts the floor, a pause in
        // speech doesn't.
        noiseFloor = level < noiseFloor ? noiseFloor * 0.9 + level * 0.1 : noiseFloor * 0.995 + level * 0.005;
      }

      if (!inUtterance) {
        preRoll.push({ frame, time: now });
        if (preRoll.length > PRE_ROLL_FRAMES) preRoll.shift();
        onsetRun = speech ? onsetRun + 1 : 0;
        if (onsetRun < ONSET_FRAMES) return;
        inUtterance = true;
        frames = preRoll.map((entry) => entry.frame);
        startTime = Math.max(0, preRoll[0].time - FRAME_SECONDS);
        voicedFrames = onsetRun;
        silenceRun = 0;
        preRoll.length = 0;
        onsetRun = 0;
        return;
      }

      frames.push(frame);
      if (speech) {
        voicedFrames += 1;
        silenceRun = 0;
      } else {
        silenceRun += 1;
      }
      const endSilence = frames.length >= SOFT_MAX_FRAMES ? SOFT_END_SILENCE_FRAMES : END_SILENCE_FRAMES;
      if (silenceRun >= endSilence) {
        finish();
      } else if (frames.length >= HARD_MAX_FRAMES) {
        finish();
        // Mid-word cut: keep listening as a new utterance starting now.
        inUtterance = true;
        startTime = now;
        silenceRun = 0;
      }
    },
    /** Ends any open utterance, e.g. on mute. */
    flush: finish,
  };
}

/** 16-bit PCM WAV: every STT provider accepts it, unlike webm/mp4 from MediaRecorder. */
export function encodeWav(samples: Float32Array, sampleRate = SAMPLE_RATE) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeAscii = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index += 1) view.setUint8(offset + index, text.charCodeAt(index));
  };
  writeAscii(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeAscii(8, "WAVE");
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(44 + index * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  return buffer;
}
