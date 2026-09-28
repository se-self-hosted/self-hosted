import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { canSubmitSummaryDraft, getSummaryDraftState, selectMeetingSummaryContent } from "./summary.ts";

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

test("marks an unchanged draft as not changed", () => {
  assert.deepEqual(getSummaryDraftState("Original summary", "Original summary"), {
    hasChanges: false,
    hasContent: true,
  });
  assert.equal(canSubmitSummaryDraft("Original summary", "Original summary", true), false);
});

test("rejects a whitespace-only draft", () => {
  assert.deepEqual(getSummaryDraftState("Original summary", "  \n\t"), {
    hasChanges: true,
    hasContent: false,
  });
  assert.equal(canSubmitSummaryDraft("Original summary", "  \n\t", true), false);
});

test("accepts changed multiline Thai and English content", () => {
  const draft = "สรุปฉบับแก้ไข\n- Owner: Product team\n- Next step: ทดสอบระบบ";

  assert.deepEqual(getSummaryDraftState("Original summary", draft), {
    hasChanges: true,
    hasContent: true,
  });
  assert.equal(canSubmitSummaryDraft("Original summary", draft, true), true);
});

test("does not submit a valid change while persistence is unavailable", () => {
  assert.equal(canSubmitSummaryDraft("Original summary", "Changed summary", false), false);
});
