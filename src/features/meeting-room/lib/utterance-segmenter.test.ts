import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { createUtteranceSegmenter, encodeWav, FRAME_SAMPLES, type Utterance } from "./utterance-segmenter.ts";

const FRAME_SECONDS = 0.02;
const silence = () => new Float32Array(FRAME_SAMPLES).fill(0.001);
const speech = () => {
  const frame = new Float32Array(FRAME_SAMPLES);
  for (let index = 0; index < FRAME_SAMPLES; index += 1) frame[index] = 0.1 * Math.sin(index / 4);
  return frame;
};

function run(pattern: [frame: () => Float32Array, count: number][], startAt = 10) {
  const utterances: Utterance[] = [];
  const segmenter = createUtteranceSegmenter((utterance: Utterance) => utterances.push(utterance));
  let now = startAt;
  for (const [frame, count] of pattern) {
    for (let index = 0; index < count; index += 1) {
      now += FRAME_SECONDS;
      segmenter.push(frame(), now);
    }
  }
  return { utterances, segmenter };
}

test("cuts an utterance at a pause, keeping pre-roll and a short tail", () => {
  const { utterances } = run([[silence, 50], [speech, 100], [silence, 60]]);
  assert.equal(utterances.length, 1);
  const [utterance] = utterances;
  // Pre-roll reaches back before the onset frames; speech began at 11.0 s.
  assert.ok(utterance.startTime < 11 && utterance.startTime > 10.6, `start ${utterance.startTime}`);
  // 100 voiced frames plus pre-roll and tail, without the whole 0.8 s pause.
  assert.ok(utterance.duration > 2 && utterance.duration < 2.6, `duration ${utterance.duration}`);
  assert.equal(utterance.samples.length, Math.round(utterance.duration / FRAME_SECONDS) * FRAME_SAMPLES);
});

test("a short pause inside a sentence does not split it", () => {
  const { utterances } = run([[silence, 20], [speech, 50], [silence, 20], [speech, 50], [silence, 60]]);
  assert.equal(utterances.length, 1);
});

test("ignores clicks too short to be speech", () => {
  const { utterances } = run([[silence, 20], [speech, 5], [silence, 60]]);
  assert.equal(utterances.length, 0);
});

test("cuts a monologue without pauses into bounded pieces", () => {
  const { utterances, segmenter } = run([[speech, 2600]]);
  segmenter.flush();
  assert.equal(utterances.length, 3);
  for (const utterance of utterances) assert.ok(utterance.duration <= 20.01, `duration ${utterance.duration}`);
  // Pieces follow on from each other.
  assert.ok(Math.abs(utterances[1].startTime - (utterances[0].startTime + utterances[0].duration)) < 0.1);
});

test("flush ends an open utterance, e.g. on mute", () => {
  const { utterances, segmenter } = run([[silence, 10], [speech, 40]]);
  assert.equal(utterances.length, 0);
  segmenter.flush();
  assert.equal(utterances.length, 1);
});

test("encodes 16-bit mono WAV", () => {
  const wav = new DataView(encodeWav(new Float32Array([0, 1, -1, 2])));
  assert.equal(wav.byteLength, 44 + 8);
  assert.equal(String.fromCharCode(wav.getUint8(0), wav.getUint8(1), wav.getUint8(2), wav.getUint8(3)), "RIFF");
  assert.equal(wav.getUint32(24, true), 16000);
  assert.equal(wav.getInt16(46, true), 32767);
  assert.equal(wav.getInt16(48, true), -32768);
  // Clipped, not wrapped around.
  assert.equal(wav.getInt16(50, true), 32767);
});
