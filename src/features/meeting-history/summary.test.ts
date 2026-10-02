import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { buildMeetingReport, canStartSummaryRegeneration, createSummaryReportFilename, formatMeetingReportHtml, formatMeetingReportMarkdown, formatMeetingReportText, formatReportDuration, canSubmitSummaryDraft, createSummaryPdfFilename, getSummaryDraftState, getSummaryErrorMessage, getSummaryRegenerationCompletionStatus, getSummarySaveErrorMessage, MAX_EDITED_SUMMARY_CHARS, parseSummaryMarkdown, requestMeetingSummary, saveMeetingSummaryEdit, summaryMarkdownToHtml, summaryMarkdownToText, selectMeetingSummaryContent } from "./summary.ts";

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
    isTooLong: false,
  });
  assert.equal(canSubmitSummaryDraft("Original summary", "Original summary", true), false);
});

test("rejects a whitespace-only draft", () => {
  assert.deepEqual(getSummaryDraftState("Original summary", "  \n\t"), {
    hasChanges: true,
    hasContent: false,
    isTooLong: false,
  });
  assert.equal(canSubmitSummaryDraft("Original summary", "  \n\t", true), false);
});

test("accepts changed multiline Thai and English content", () => {
  const draft = "สรุปฉบับแก้ไข\n- Owner: Product team\n- Next step: ทดสอบระบบ";

  assert.deepEqual(getSummaryDraftState("Original summary", draft), {
    hasChanges: true,
    hasContent: true,
    isTooLong: false,
  });
  assert.equal(canSubmitSummaryDraft("Original summary", draft, true), true);
});

test("rejects a draft over the length limit, ignoring surrounding whitespace", () => {
  const atLimit = `  ${"ก".repeat(MAX_EDITED_SUMMARY_CHARS)}\n`;
  const overLimit = "ก".repeat(MAX_EDITED_SUMMARY_CHARS + 1);

  assert.equal(getSummaryDraftState("Original summary", atLimit).isTooLong, false);
  assert.equal(canSubmitSummaryDraft("Original summary", atLimit, true), true);
  assert.equal(getSummaryDraftState("Original summary", overLimit).isTooLong, true);
  assert.equal(canSubmitSummaryDraft("Original summary", overLimit, true), false);
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

test("builds a text report with meeting details and the displayed summary", () => {
  const report = buildMeetingReport({
    roomName: "Weekly Sync",
    startedAt: "2026-09-27T02:00:00.000Z",
    durationSeconds: 3725,
    participantNames: ["Alice", "Bob"],
    summary: { ...baseSummary, editedSummary: "  Edited summary  ", editedAt: "2026-09-27T05:00:00.000Z" },
  });
  assert.ok(report);
  const text = formatMeetingReportText(report);

  assert.match(text, /^รายงานสรุปการประชุม\n/);
  assert.match(text, /ห้องประชุม: Weekly Sync/);
  assert.match(text, /ระยะเวลา: 1 ชั่วโมง 2 นาที/);
  assert.match(text, /ผู้เข้าร่วม \(2 คน\): Alice, Bob/);
  assert.match(text, /แก้ไขล่าสุด: .*\(gpt-4o-mini\)/);
  assert.ok(text.endsWith("\nEdited summary\n"));
});

test("omits optional report details that were not given", () => {
  const report = buildMeetingReport({ roomName: "Room", startedAt: "2026-09-27T02:00:00.000Z", summary: baseSummary });
  assert.deepEqual(report?.details.map((d) => d.label), ["ห้องประชุม", "วันที่ประชุม", "สร้างสรุปเมื่อ"]);
  assert.equal(report?.content, "AI summary");
});

test("escapes summary and meeting text in the printable report", () => {
  const report = buildMeetingReport({
    roomName: "<b>Room</b>",
    startedAt: "2026-09-27T02:00:00.000Z",
    summary: { ...baseSummary, aiSummary: "<script>alert(1)</script> & more" },
  });
  assert.ok(report);
  const html = formatMeetingReportHtml(report, "a\"<title>");

  assert.doesNotMatch(html, /<script>|<b>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt; &amp; more/);
  assert.match(html, /<title>a&quot;&lt;title&gt;<\/title>/);
});

test("formats report durations", () => {
  assert.equal(formatReportDuration(null), "-");
  assert.equal(formatReportDuration(0), "0 วินาที");
  assert.equal(formatReportDuration(95), "1 นาที 35 วินาที");
  assert.equal(formatReportDuration(7200), "2 ชั่วโมง");
});

test("names every export format like the PDF", () => {
  for (const extension of ["txt", "md", "docx"] as const) {
    assert.equal(
      createSummaryReportFilename("Weekly Sync", "2026-09-27T02:00:00.000Z", extension),
      `Weekly Sync-2026-09-27-summary.${extension}`,
    );
  }
});

test("builds a Markdown report that keeps the summary Markdown as written", () => {
  const report = buildMeetingReport({
    roomName: "Weekly Sync",
    startedAt: "2026-09-27T02:00:00.000Z",
    durationSeconds: 3725,
    participantNames: ["Alice", "Bob"],
    summary: { ...baseSummary, aiSummary: "## ภาพรวม\n- **ตกลง** ปล่อย `v2`" },
  });
  assert.ok(report);
  const markdown = formatMeetingReportMarkdown(report);

  assert.match(markdown, /^# รายงานสรุปการประชุม\n\n/);
  assert.match(markdown, /^- \*\*ห้องประชุม:\*\* Weekly Sync$/m);
  assert.match(markdown, /^- \*\*ระยะเวลา:\*\* 1 ชั่วโมง 2 นาที$/m);
  assert.match(markdown, /^- \*\*ผู้เข้าร่วม \(2 คน\):\*\* Alice, Bob$/m);
  assert.ok(markdown.endsWith("\n\n## ภาพรวม\n- **ตกลง** ปล่อย `v2`\n"));
});

test("escapes Markdown markers in meeting details but not in the summary", () => {
  const report = buildMeetingReport({
    roomName: "Q3 *Plan* #1 <b>",
    startedAt: "2026-09-27T02:00:00.000Z",
    participantNames: ["a_b", "[c]"],
    summary: { ...baseSummary, aiSummary: "**bold**" },
  });
  assert.ok(report);
  const markdown = formatMeetingReportMarkdown(report);

  assert.match(markdown, /ห้องประชุม:\*\* Q3 \\\*Plan\\\* \\#1 \\<b\\>$/m);
  assert.match(markdown, /\(2 คน\):\*\* a\\_b, \\\[c\\\]$/m);
  assert.ok(markdown.endsWith("\n**bold**\n"));
});

const sampleMarkdown = [
  "## ภาพรวม",
  "ประชุมเรื่อง **AI summary**",
  "ต่อบรรทัด",
  "",
  "## Action Items",
  "- [Alice] เขียน `e2e` test",
  "  ภายในวันศุกร์",
  "* [วิภา] ทำ API",
  "1. first",
  "2) second",
  "---",
  "### Note ###",
].join("\n");

test("parses the summary Markdown subset into blocks", () => {
  assert.deepEqual(parseSummaryMarkdown(sampleMarkdown), [
    { type: "heading", level: 2, inlines: [{ type: "text", text: "ภาพรวม" }] },
    {
      type: "paragraph",
      lines: [
        [{ type: "text", text: "ประชุมเรื่อง " }, { type: "strong", text: "AI summary" }],
        [{ type: "text", text: "ต่อบรรทัด" }],
      ],
    },
    { type: "heading", level: 2, inlines: [{ type: "text", text: "Action Items" }] },
    {
      type: "list",
      ordered: false,
      items: [
        [
          { type: "text", text: "[Alice] เขียน " },
          { type: "code", text: "e2e" },
          { type: "text", text: " test" },
          { type: "text", text: " " },
          { type: "text", text: "ภายในวันศุกร์" },
        ],
        [{ type: "text", text: "[วิภา] ทำ API" }],
      ],
    },
    { type: "list", ordered: true, items: [[{ type: "text", text: "first" }], [{ type: "text", text: "second" }]] },
    { type: "heading", level: 3, inlines: [{ type: "text", text: "Note" }] },
  ]);
});

test("turns summary Markdown into plain text without markers", () => {
  const text = summaryMarkdownToText(sampleMarkdown);
  assert.doesNotMatch(text, /##|\*\*|`/);
  assert.match(text, /^ภาพรวม\n---+\nประชุมเรื่อง AI summary\nต่อบรรทัด\n\n/);
  assert.match(text, /• \[Alice\] เขียน e2e test ภายในวันศุกร์\n• \[วิภา\] ทำ API/);
  assert.match(text, /1\. first\n2\. second/);
});

test("renders summary Markdown to escaped HTML", () => {
  const html = summaryMarkdownToHtml("## <img src=x onerror=alert(1)>\n- **<b>bold</b>**\ntext `<i>`");
  assert.equal(
    html,
    "<h2>&lt;img src=x onerror=alert(1)&gt;</h2>\n<ul><li><strong>&lt;b&gt;bold&lt;/b&gt;</strong></li></ul>\n<p>text <code>&lt;i&gt;</code></p>",
  );
});

test("saves an edit with the version it was based on", async () => {
  let request: { url: string; method?: string; body: unknown } | undefined;
  const saved = { ...baseSummary, editedSummary: "Edited", editedAt: "2026-09-26T10:00:00.000Z" };
  const fetchStub = (async (url: string, init: RequestInit) => {
    request = { url, method: init.method, body: JSON.parse(String(init.body)) };
    return new Response(JSON.stringify({ summary: saved }), { status: 200 });
  }) as unknown as typeof fetch;

  assert.deepEqual(await saveMeetingSummaryEdit("m 1", baseSummary, "Edited", fetchStub), saved);
  assert.deepEqual(request, {
    url: "/api/meetings/m%201/summary",
    method: "PATCH",
    body: { editedSummary: "Edited", baseGeneratedAt: baseSummary.generatedAt, baseEditedAt: null },
  });
});

test("reverts to the AI version by sending a null edit", async () => {
  let body: unknown;
  const edited = { ...baseSummary, editedSummary: "Edited", editedAt: "2026-09-26T10:00:00.000Z" };
  const fetchStub = (async (_url: string, init: RequestInit) => {
    body = JSON.parse(String(init.body));
    return new Response(JSON.stringify({ summary: baseSummary }), { status: 200 });
  }) as unknown as typeof fetch;

  assert.deepEqual(await saveMeetingSummaryEdit("m1", edited, null, fetchStub), baseSummary);
  assert.deepEqual(body, {
    editedSummary: null,
    baseGeneratedAt: edited.generatedAt,
    baseEditedAt: edited.editedAt,
  });
});

test("turns a failed save into a user-facing message", async () => {
  const conflict = (async () =>
    new Response(JSON.stringify({ error: "x", code: "SUMMARY_CONFLICT" }), { status: 409 })) as unknown as typeof fetch;
  await assert.rejects(saveMeetingSummaryEdit("m1", baseSummary, "Edited", conflict), {
    message: getSummarySaveErrorMessage("SUMMARY_CONFLICT"),
  });

  const offline = (async () => {
    throw new TypeError("fetch failed");
  }) as unknown as typeof fetch;
  await assert.rejects(saveMeetingSummaryEdit("m1", baseSummary, "Edited", offline), /เชื่อมต่อเซิร์ฟเวอร์/);

  assert.match(getSummarySaveErrorMessage("SUMMARY_CONFLICT"), /โหลดหน้าใหม่/);
  assert.equal(getSummarySaveErrorMessage("SOMETHING_NEW"), getSummarySaveErrorMessage(undefined));
});
