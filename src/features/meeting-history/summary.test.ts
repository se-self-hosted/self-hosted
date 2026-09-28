import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { createSummaryPdfFilename, selectMeetingSummaryContent } from "./summary.ts";

const baseSummary = {
  id: "summary-1",
  aiSummary: "AI summary",
  editedSummary: null,
  llmModel: "gpt-4o-mini",
  generatedAt: "2026-09-26T09:00:00.000Z",
  editedAt: null,
};

test("returns no display content when the meeting has no summary", () => {
  assert.equal(selectMeetingSummaryContent(null), null);
});

test("selects the generated AI summary when no edited summary exists", () => {
  assert.deepEqual(selectMeetingSummaryContent(baseSummary), {
    content: "AI summary",
    source: "ai",
  });
});

test("selects the edited summary when it exists", () => {
  assert.deepEqual(
    selectMeetingSummaryContent({
      ...baseSummary,
      editedSummary: "Edited summary",
      editedAt: "2026-09-26T10:00:00.000Z",
    }),
    { content: "Edited summary", source: "edited" },
  );
});

test("preserves multiline Thai and English summary content", () => {
  const content = "สรุปการประชุม\n- Next step: ทดสอบระบบ\n- Owner: ทีม Product";
  const displayedSummary = selectMeetingSummaryContent({ ...baseSummary, aiSummary: content });

  assert.ok(displayedSummary);
  assert.equal(displayedSummary.content, content);
});

test("creates a meeting-specific PDF filename while preserving Thai", () => {
  assert.equal(
    createSummaryPdfFilename("ประชุมทีม: Sprint / Review", "2026-09-27T02:00:00.000Z"),
    "ประชุมทีม- Sprint - Review-2026-09-27-summary.pdf",
  );
});

test("creates a safe fallback PDF filename", () => {
  assert.equal(
    createSummaryPdfFilename("  <>:\"/\\|?*...  ", "not-a-date"),
    "meeting-summary-undated-summary.pdf",
  );
});
