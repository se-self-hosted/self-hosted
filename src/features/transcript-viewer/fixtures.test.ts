import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { getTranscriptFixture } from "./fixtures.ts";

test("returns speaker, text, and timestamp for transcript rows", () => {
  const state = getTranscriptFixture("meeting-1");
  assert.equal(state.status, "ready");
  if (state.status !== "ready") return;
  assert.ok(state.segments.length > 0);
  for (const segment of state.segments) {
    assert.ok(segment.speaker.displayName);
    assert.ok(segment.text);
    assert.equal(Number.isNaN(new Date(segment.spokenAt).getTime()), false);
  }
});

test("supports empty, loading, and error viewer states", () => {
  assert.equal(getTranscriptFixture("empty").status, "empty");
  assert.equal(getTranscriptFixture("loading").status, "loading");
  assert.equal(getTranscriptFixture("error").status, "error");
});
