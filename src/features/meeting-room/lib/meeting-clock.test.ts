import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { createMeetingClock } from "./meeting-clock.ts";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { startLiveTranscription, type SpeechRecognizer } from "./live-transcription.ts";

const meetingStartedAt = "2026-09-13T10:00:00.000Z";

test("a late joiner's first speech starts at 5:01 on the meeting timeline", () => {
  let ticks = 100;
  const clock = createMeetingClock(meetingStartedAt, "2026-09-13T10:05:00.000Z", () => ticks);
  const saved: { text: string; startTime: number; duration: number }[] = [];
  const recognition: SpeechRecognizer = {
    continuous: false, interimResults: false, lang: "",
    onstart: null, onspeechstart: null, onresult: null, onerror: null, onend: null,
    start: () => {}, stop: () => { recognition.onend?.(); },
  };
  const stop = startLiveTranscription(recognition, {
    getAudioTrack: () => undefined,
    elapsedSeconds: () => clock().elapsedSeconds,
    onFinal: (text, startTime, duration) => saved.push({ text, startTime, duration }),
    onInterim: () => {}, onStatus: () => {},
  });
  try {
    ticks += 1000;
    recognition.onspeechstart?.();
    ticks += 2000;
    recognition.onresult?.({
      resultIndex: 0,
      results: [{ isFinal: true, 0: { transcript: "สวัสดีครับ", confidence: 0.9 } }],
    });
    assert.deepEqual(saved, [{ text: "สวัสดีครับ", startTime: 301, duration: 2 }]);
    assert.equal(clock().spokenAt, "2026-09-13T10:05:03.000Z");
  } finally {
    stop();
  }
});

test("host, late joiner, and rejoin share the same elapsed meeting time", () => {
  let hostTicks = 0;
  let guestTicks = 7000;
  const host = createMeetingClock(meetingStartedAt, meetingStartedAt, () => hostTicks);
  hostTicks = 300000;
  const guest = createMeetingClock(meetingStartedAt, "2026-09-13T10:05:00.000Z", () => guestTicks);
  assert.deepEqual(host(), guest());

  hostTicks += 10000;
  guestTicks += 10000;
  assert.equal(host().elapsedSeconds, 310);
  assert.deepEqual(host(), guest());

  const rejoined = createMeetingClock(meetingStartedAt, "2026-09-13T10:05:10.000Z", () => 0);
  assert.deepEqual(rejoined(), host());
});

test("device wall-clock changes do not move transcript timestamps", (t) => {
  let ticks = 0;
  t.mock.method(Date, "now", () => Date.parse("2030-01-01T00:00:00Z"));
  const clock = createMeetingClock(meetingStartedAt, "2026-09-13T10:05:00.000Z", () => ticks);
  assert.equal(clock().elapsedSeconds, 300);
  t.mock.method(Date, "now", () => 0);
  ticks += 2500;
  assert.equal(clock().elapsedSeconds, 302.5);
  assert.equal(clock().spokenAt, "2026-09-13T10:05:02.500Z");
});

test("invalid server timestamps cannot silently reset the timeline to join time", () => {
  assert.throws(() => createMeetingClock("invalid", meetingStartedAt), /Invalid meeting clock/);
  assert.throws(() => createMeetingClock(meetingStartedAt, "invalid"), /Invalid meeting clock/);
});
