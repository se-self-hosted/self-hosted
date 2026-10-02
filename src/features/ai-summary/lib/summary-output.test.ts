import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { MAX_SUMMARY_CHARS, normalizeEditedSummary } from "./summary-output.ts";

test("normalizes line endings and trims an edited summary", () => {
  assert.deepEqual(normalizeEditedSummary("  ## สรุป\r\n- ข้อ 1\r- ข้อ 2  \n\n"), {
    ok: true,
    text: "## สรุป\n- ข้อ 1\n- ข้อ 2",
  });
});

test("rejects an empty edited summary", () => {
  const result = normalizeEditedSummary(" \r\n\t ");
  assert.equal(result.ok, false);
  assert.equal(!result.ok && result.reason, "EMPTY");
});

test("rejects an edited summary over the length limit", () => {
  assert.equal(normalizeEditedSummary("a".repeat(MAX_SUMMARY_CHARS)).ok, true);
  const result = normalizeEditedSummary("a".repeat(MAX_SUMMARY_CHARS + 1));
  assert.equal(!result.ok && result.reason, "TOO_LONG");
});
