import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { prepareTranscriptForAI, formatTimestamp } from "./prepare-transcript.ts";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { normalizeGeneratedSummary } from "./summary-output.ts";

const seg = (speakerName: string, startTime: number, text: unknown, extra: object = {}) => ({
  speakerName,
  startTime,
  endTime: startTime + 2,
  text,
  confidence: 0,
  ...extra,
});

test("rejects a missing or empty transcript as EMPTY", () => {
  for (const input of [[], null, undefined]) {
    const result = prepareTranscriptForAI(input);
    assert.equal(result.ok, false);
    assert.equal(result.ok || result.reason, "EMPTY");
  }
});

test("rejects a transcript of only malformed or noise segments as INVALID", () => {
  const result = prepareTranscriptForAI([
    seg("A", 0, null),
    seg("A", Number.NaN, "hello there"),
    seg("B", 3, "   ...  "),
    seg("B", 4, "​​"),
  ]);
  assert.equal(result.ok, false);
  assert.equal(result.ok || result.reason, "INVALID");
  assert.equal(result.stats.invalidSegments, 2);
  assert.equal(result.stats.noiseSegments, 2);
});

test("rejects a transcript below the minimum content as TOO_SHORT", () => {
  const result = prepareTranscriptForAI([seg("A", 0, "ok"), seg("B", 5, "yes")]);
  assert.equal(result.ok || result.reason, "TOO_SHORT");
});

test("keeps confidence-0 speech by default since the recognizer often omits it", () => {
  const result = prepareTranscriptForAI([seg("A", 0, "สวัสดีครับ วันนี้เราจะคุยเรื่องแผนงาน")]);
  assert.equal(result.ok, true);
});

test("sorts, sanitizes, dedupes and merges same-speaker turns", () => {
  const result = prepareTranscriptForAI([
    seg("Bob", 20, "Sounds good,\nlet's ship it on Friday."),
    seg("Alice", 0, "  Welcome   everyone to the planning meeting. "),
    seg("Alice", 3, "First item is the release date."),
    seg("Alice", 4, "First item is the release date."),
    seg("", 3700, "Any other business?"),
  ]);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(
    result.text,
    [
      "[00:00] Alice: Welcome everyone to the planning meeting. First item is the release date.",
      "[00:20] Bob: Sounds good, let's ship it on Friday.",
      "[1:01:40] Unknown: Any other business?",
    ].join("\n"),
  );
  assert.equal(result.stats.duplicateSegments, 1);
  assert.deepEqual(result.stats.speakers, ["Alice", "Bob", "Unknown"]);
  assert.deepEqual(result.chunks, [result.text]);
});

test("splits long transcripts into chunks on line boundaries", () => {
  const segments = Array.from({ length: 10 }, (_, i) => seg(i % 2 ? "A" : "B", i * 60, "x".repeat(40)));
  const result = prepareTranscriptForAI(segments, { maxChunkChars: 120 });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.ok(result.chunks.length > 1);
  assert.ok(result.chunks.every((chunk: string) => chunk.length <= 120));
  assert.equal(result.chunks.join("\n"), result.text);
});

test("formats timestamps", () => {
  assert.equal(formatTimestamp(0), "00:00");
  assert.equal(formatTimestamp(65.9), "01:05");
  assert.equal(formatTimestamp(3661), "1:01:01");
});

test("normalizes AI output and rejects empty or invalid responses", () => {
  assert.deepEqual(normalizeGeneratedSummary("```markdown\n# Summary\n- a\n```"), { ok: true, text: "# Summary\n- a" });
  assert.equal(normalizeGeneratedSummary("   ").ok || "EMPTY_OUTPUT", "EMPTY_OUTPUT");
  assert.equal(normalizeGeneratedSummary(undefined).ok, false);
  assert.equal(normalizeGeneratedSummary("x".repeat(11), 10).ok, false);
});

test("unwraps a CRLF fence but leaves separate code blocks intact", () => {
  assert.deepEqual(normalizeGeneratedSummary("```markdown\r\n# Summary\r\n- a\r\n```"), { ok: true, text: "# Summary\n- a" });
  const twoBlocks = "```js\nx\n```\nprose\n```py\ny\n```";
  assert.deepEqual(normalizeGeneratedSummary(twoBlocks), { ok: true, text: twoBlocks });
});

test("falls back to the default chunk size for a non-positive maxChunkChars", () => {
  const segments = [seg("A", 0, "Welcome everyone to the planning meeting.")];
  for (const maxChunkChars of [0, -5, Number.NaN]) {
    const result = prepareTranscriptForAI(segments, { maxChunkChars });
    assert.equal(result.ok, true);
    if (result.ok) assert.deepEqual(result.chunks, [result.text]);
  }
});
