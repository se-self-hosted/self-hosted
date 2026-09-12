import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { getTranscriptFixture } from "./fixtures.ts";

test("returns speaker, text, and timestamp for transcript rows", () => {
  const state = getTranscriptFixture("meeting-1");
  assert.equal(state.status, "ready");
  if (state.status !== "ready") return;

  const expectedSpeakers = [
    { id: "thanakorn", displayName: "Thanakorn P." },
    { id: "siriporn", displayName: "Siriporn L." },
    { id: "wichai", displayName: "Wichai A." },
    { id: "thanakorn", displayName: "Thanakorn P." },
    { id: "nattaya", displayName: "Nattaya S." },
  ];

  assert.ok(state.segments.length > 0);
  assert.equal(state.segments.length, expectedSpeakers.length);

  for (const [index, segment] of state.segments.entries()) {
    assert.deepEqual(
      { id: segment.speaker.id, displayName: segment.speaker.displayName },
      expectedSpeakers[index],
    );
    assert.ok(segment.text);
    assert.equal(Number.isNaN(new Date(segment.spokenAt).getTime()), false);
  }
});

test("keeps identity attributes stable for repeated Thanakorn segments", () => {
  const state = getTranscriptFixture("meeting-1");
  assert.equal(state.status, "ready");
  if (state.status !== "ready") return;

  const thanakornSegments = state.segments.filter(
    (segment) => segment.speaker.id === "thanakorn",
  );

  assert.equal(thanakornSegments.length, 2);
  for (const segment of thanakornSegments) {
    assert.deepEqual(
      {
        id: segment.speaker.id,
        displayName: segment.speaker.displayName,
        initials: segment.speaker.initials,
        color: segment.speaker.color,
      },
      {
        id: "thanakorn",
        displayName: "Thanakorn P.",
        initials: "TP",
        color: "indigo",
      },
    );
  }
});

test("supports empty, loading, and error viewer states", () => {
  assert.equal(getTranscriptFixture("empty").status, "empty");
  assert.equal(getTranscriptFixture("loading").status, "loading");
  assert.equal(getTranscriptFixture("error").status, "error");
});
