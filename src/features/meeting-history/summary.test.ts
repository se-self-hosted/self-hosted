import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { canStartSummaryRegeneration, canSubmitSummaryDraft, createSummaryPdfFilename, getSummaryDraftState, getSummaryErrorMessage, getSummaryRegenerationCompletionStatus, requestMeetingSummary, selectMeetingSummaryContent } from "./summary.ts";

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

test("disables regeneration when no callback is available", () => {
  assert.equal(canStartSummaryRegeneration(false, "idle"), false);
  assert.equal(canStartSummaryRegeneration(false, "error"), false);
});

test("allows available regeneration while idle and prevents duplicate loading requests", () => {
  assert.equal(canStartSummaryRegeneration(true, "idle"), true);
  assert.equal(canStartSummaryRegeneration(true, "regenerating"), false);
});

test("returns to idle after success and allows retry after an error", () => {
  assert.equal(getSummaryRegenerationCompletionStatus(true), "idle");
  assert.equal(getSummaryRegenerationCompletionStatus(false), "error");
  assert.equal(canStartSummaryRegeneration(true, "error"), true);
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

test("maps summary API error codes to Thai messages with a fallback", () => {
  assert.equal(getSummaryErrorMessage("TRANSCRIPT_EMPTY"), "การประชุมนี้ยังไม่มีบทสนทนาสำหรับสร้างสรุป");
  assert.equal(getSummaryErrorMessage("AI_RATE_LIMITED"), "มีการใช้งาน AI มากเกินไป กรุณารอสักครู่แล้วลองอีกครั้ง");
  assert.equal(getSummaryErrorMessage("SOMETHING_NEW"), getSummaryErrorMessage(undefined));
});

test("requests a summary and returns the stored row", async () => {
  let request: { url: string; body: unknown } | undefined;
  const fetchStub = (async (url: string, init: RequestInit) => {
    request = { url, body: JSON.parse(String(init.body)) };
    return new Response(JSON.stringify({ summary: baseSummary }), { status: 200 });
  }) as unknown as typeof fetch;

  assert.deepEqual(await requestMeetingSummary("m 1", { discardEdits: true }, fetchStub), baseSummary);
  assert.deepEqual(request, { url: "/api/meetings/m%201/summary", body: { discardEdits: true } });
});

test("turns a failed summary request into a user-facing message", async () => {
  const failing = (async () =>
    new Response(JSON.stringify({ error: "x", code: "AI_TIMEOUT" }), { status: 504 })) as unknown as typeof fetch;
  await assert.rejects(requestMeetingSummary("m1", {}, failing), { message: getSummaryErrorMessage("AI_TIMEOUT") });

  const offline = (async () => {
    throw new TypeError("fetch failed");
  }) as unknown as typeof fetch;
  await assert.rejects(requestMeetingSummary("m1", {}, offline), /เชื่อมต่อเซิร์ฟเวอร์/);
});
