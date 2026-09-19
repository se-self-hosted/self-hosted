import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { startLiveTranscription, type SpeechRecognizer, type RecognitionResult } from "./live-transcription.ts";

function setup(track?: MediaStreamTrack) {
  const starts: (MediaStreamTrack | undefined)[] = [];
  const finals: [string, number, number, number][] = [];
  const drafts: string[] = [];
  const statuses: string[] = [];
  let elapsed = 10;
  let stops = 0;
  const recognition: SpeechRecognizer = {
    continuous: false, interimResults: false, lang: "",
    onstart: null, onspeechstart: null, onresult: null, onerror: null, onend: null,
    start: (track) => { starts.push(track); recognition.onstart?.(); },
    stop: () => { stops += 1; },
  };
  const stop = startLiveTranscription(recognition, {
    getAudioTrack: () => track, elapsedSeconds: () => elapsed,
    onFinal: (...result) => finals.push(result), onInterim: (text) => drafts.push(text),
    onStatus: (message) => statuses.push(message),
  });
  return { recognition, starts, finals, drafts, statuses, stop,
    elapsed: (value: number) => { elapsed = value; }, stops: () => stops };
}

function result(text: string, isFinal: boolean, confidence?: number): RecognitionResult {
  return { isFinal, 0: { transcript: text, confidence } };
}

test("uses the processed microphone track with Thai recognition", () => {
  const track = { kind: "audio", readyState: "live" } as MediaStreamTrack;
  const h = setup(track);
  assert.equal(h.starts[0], track);
  assert.equal(h.recognition.lang, "th-TH");
  assert.equal(h.recognition.continuous, true);
  assert.equal(h.recognition.interimResults, true);
  h.stop(); h.recognition.onend?.();
});

test("replaces interim hypotheses and saves only the corrected final once", () => {
  const h = setup();
  h.recognition.onresult?.({ resultIndex: 0, results: [result("ประชุมวันสุข", false)] });
  h.recognition.onresult?.({ resultIndex: 0, results: [result("ประชุมวันศุกร์", false)] });
  assert.equal(h.finals.length, 0);
  assert.equal(h.drafts.at(-1), "ประชุมวันศุกร์");
  h.elapsed(13);
  const event = { resultIndex: 0, results: [result("ประชุมวันศุกร์", true, 0)] };
  h.recognition.onresult?.(event);
  h.recognition.onresult?.(event);
  assert.deepEqual(h.finals, [["ประชุมวันศุกร์", 10, 3, 0]]);
  assert.equal(h.drafts.at(-1), "");
  h.stop(); h.recognition.onend?.();
});

test("normalizes whitespace in interim text", () => {
  const h = setup();
  h.recognition.onresult?.({
    resultIndex: 0,
    results: [result("  สวัสดี\t\tครับ\nวันนี้  ", false)],
  });
  assert.equal(h.drafts.at(-1), "สวัสดี ครับ วันนี้");
  assert.equal(h.finals.length, 0);
  h.stop(); h.recognition.onend?.();
});

test("normalizes whitespace in final text without changing timing or confidence", () => {
  const h = setup();
  h.elapsed(13);
  h.recognition.onresult?.({
    resultIndex: 0,
    results: [result("  สวัสดี\t\tครับ\nวันนี้  ", true, 0.75)],
  });
  assert.deepEqual(h.finals, [["สวัสดี ครับ วันนี้", 10, 3, 0.75]]);
  h.stop(); h.recognition.onend?.();
});

test("normalizes recognition text to Unicode NFC", () => {
  const h = setup();
  h.recognition.onresult?.({ resultIndex: 0, results: [result("Cafe\u0301", false)] });
  assert.equal(h.drafts.at(-1), "Café");
  h.elapsed(12);
  h.recognition.onresult?.({ resultIndex: 0, results: [result("Cafe\u0301", true, 0.9)] });
  assert.equal(h.finals.at(-1)?.[0], "Café");
  h.stop(); h.recognition.onend?.();
});

test("ignores whitespace-only interim and final results", () => {
  const h = setup();
  h.recognition.onresult?.({
    resultIndex: 0,
    results: [result(" \t\n ", false), result("\r\n\t", true, 0.9)],
  });
  assert.equal(h.drafts.at(-1), "");
  assert.equal(h.finals.length, 0);
  h.stop(); h.recognition.onend?.();
});

test("preserves ordinary Thai text, punctuation, and letter case", () => {
  const h = setup();
  const text = "สวัสดีครับ, OpenAI!";
  h.recognition.onresult?.({ resultIndex: 0, results: [result(text, false)] });
  assert.equal(h.drafts.at(-1), text);
  h.elapsed(12);
  h.recognition.onresult?.({ resultIndex: 0, results: [result(text, true, 0.8)] });
  assert.equal(h.finals.at(-1)?.[0], text);
  h.stop(); h.recognition.onend?.();
});

test("keeps intentionally repeated speech and does not invent confidence", () => {
  const h = setup();
  h.elapsed(12);
  h.recognition.onresult?.({ resultIndex: 0, results: [result("ครับ", true)] });
  h.elapsed(14);
  h.recognition.onresult?.({ resultIndex: 1, results: [result("ครับ", true), result("ครับ", true, 0.8)] });
  assert.deepEqual(h.finals, [["ครับ", 10, 2, 0], ["ครับ", 12, 2, 0.8]]);
  h.stop(); h.recognition.onend?.();
});

test("mute drains the last final result without restarting", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const h = setup();
  h.stop();
  h.elapsed(12);
  h.recognition.onresult?.({ resultIndex: 0, results: [result("จบประโยค", true, 0.9)] });
  h.recognition.onend?.();
  t.mock.timers.tick(10000);
  assert.equal(h.finals.length, 1);
  assert.equal(h.stops(), 1);
  assert.equal(h.starts.length, 1);
  assert.equal(h.recognition.onresult, null);
});

test("network failures back off, then stop after bounded retries", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const h = setup();
  for (const delay of [500, 1000, 2000, 4000, 8000]) {
    const before = h.starts.length;
    h.recognition.onerror?.({ error: "network" }); h.recognition.onend?.();
    t.mock.timers.tick(delay - 1);
    assert.equal(h.starts.length, before);
    t.mock.timers.tick(1);
    assert.equal(h.starts.length, before + 1);
  }
  h.recognition.onerror?.({ error: "network" }); h.recognition.onend?.();
  t.mock.timers.tick(20000);
  assert.equal(h.starts.length, 6);
  assert.match(h.statuses.at(-1)!, /หยุดทำงาน/);
  h.stop(); h.recognition.onend?.();
});

test("silence does not exhaust retry budget; permission denial does not retry", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const h = setup();
  for (let i = 0; i < 10; i += 1) {
    h.recognition.onerror?.({ error: "no-speech" }); h.recognition.onend?.();
    t.mock.timers.tick(500);
  }
  assert.equal(h.starts.length, 11);
  h.recognition.onerror?.({ error: "not-allowed" }); h.recognition.onend?.();
  t.mock.timers.tick(20000);
  assert.equal(h.starts.length, 11);
  assert.match(h.statuses.at(-1)!, /สิทธิ์ไมโครโฟน/);
  h.stop(); t.mock.timers.tick(2000);
});

test("restarts use a fresh result index without saving unfinished drafts", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const h = setup();
  h.recognition.onresult?.({ resultIndex: 0, results: [result("หนึ่ง", true), result("ยังพูดไม่จบ", false)] });
  h.recognition.onend?.();
  assert.equal(h.drafts.at(-1), "");
  assert.match(h.statuses.at(-1)!, /ไม่สมบูรณ์/);
  t.mock.timers.tick(500);
  h.recognition.onresult?.({ resultIndex: 0, results: [result("สอง", true)] });
  assert.deepEqual(h.finals.map(([text]) => text), ["หนึ่ง", "สอง"]);
  h.stop(); h.recognition.onend?.();
});
