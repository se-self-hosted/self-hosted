import type { MeetingSummary } from "./types";

export type DisplayedMeetingSummary = {
  content: string;
  source: "ai" | "edited";
};

export type SummaryDraftState = {
  hasChanges: boolean;
  hasContent: boolean;
};

export type SummaryRegenerationStatus = "idle" | "regenerating" | "error";

const UNSAFE_FILENAME_CHARACTERS = /[<>:"/\\|?*\u0000-\u001f]/g;
const TRAILING_FILENAME_CHARACTERS = /[. ]+$/g;

export function selectMeetingSummaryContent(
  summary: MeetingSummary | null,
): DisplayedMeetingSummary | null {
  if (!summary) return null;

  if (summary.editedSummary !== null) {
    return { content: summary.editedSummary, source: "edited" };
  }

  return { content: summary.aiSummary, source: "ai" };
}

export function getSummaryDraftState(
  originalContent: string,
  draftContent: string,
): SummaryDraftState {
  return {
    hasChanges: draftContent !== originalContent,
    hasContent: draftContent.trim().length > 0,
  };
}

export function canSubmitSummaryDraft(
  originalContent: string,
  draftContent: string,
  persistenceAvailable: boolean,
): boolean {
  const state = getSummaryDraftState(originalContent, draftContent);
  return persistenceAvailable && state.hasChanges && state.hasContent;
}

export function canStartSummaryRegeneration(
  regenerationAvailable: boolean,
  status: SummaryRegenerationStatus,
): boolean {
  return regenerationAvailable && status !== "regenerating";
}

export function getSummaryRegenerationCompletionStatus(
  succeeded: boolean,
): SummaryRegenerationStatus {
  return succeeded ? "idle" : "error";
}

export function createSummaryPdfFilename(roomName: string, startedAt: string): string {
  return createSummaryReportFilename(roomName, startedAt, "pdf");
}

export function createSummaryReportFilename(
  roomName: string,
  startedAt: string,
  extension: "pdf" | "txt",
): string {
  const date = /^\d{4}-\d{2}-\d{2}/.exec(startedAt)?.[0] ?? "undated";
  const safeRoomName = roomName
    .normalize("NFC")
    .replace(UNSAFE_FILENAME_CHARACTERS, "-")
    .replace(/-+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[-. ]+|[-. ]+$/g, "")
    .slice(0, 80)
    .trim()
    .replace(TRAILING_FILENAME_CHARACTERS, "");

  return `${safeRoomName || "meeting-summary"}-${date}-summary.${extension}`;
}

export type MeetingReportInput = {
  roomName: string;
  startedAt: string;
  durationSeconds?: number | null;
  participantNames?: string[];
  summary: MeetingSummary;
};

export type MeetingReport = {
  title: string;
  details: { label: string; value: string }[];
  content: string;
};

const reportDateFormatter = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Asia/Bangkok",
});

function formatReportDate(isoString: string): string {
  const date = new Date(isoString);
  return Number.isNaN(date.getTime()) ? "-" : reportDateFormatter.format(date);
}

export function formatReportDuration(totalSeconds: number | null | undefined): string {
  if (totalSeconds == null || !Number.isFinite(totalSeconds)) return "-";
  const total = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const parts = [
    hours ? `${hours} ชั่วโมง` : "",
    minutes ? `${minutes} นาที` : "",
    !hours && seconds ? `${seconds} วินาที` : "",
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "0 วินาที";
}

/** The meeting report both exports share: meeting details plus the displayed summary. */
export function buildMeetingReport({
  roomName,
  startedAt,
  durationSeconds,
  participantNames,
  summary,
}: MeetingReportInput): MeetingReport | null {
  const displayed = selectMeetingSummaryContent(summary);
  if (!displayed) return null;

  const details = [
    { label: "ห้องประชุม", value: roomName.trim() || "-" },
    { label: "วันที่ประชุม", value: formatReportDate(startedAt) },
  ];
  if (durationSeconds !== undefined) {
    details.push({ label: "ระยะเวลา", value: formatReportDuration(durationSeconds) });
  }
  if (participantNames) {
    details.push({
      label: `ผู้เข้าร่วม (${participantNames.length} คน)`,
      value: participantNames.length > 0 ? participantNames.join(", ") : "-",
    });
  }
  details.push({
    label: displayed.source === "edited" ? "แก้ไขล่าสุด" : "สร้างสรุปเมื่อ",
    value: `${formatReportDate(summary.editedAt ?? summary.generatedAt)} (${summary.llmModel})`,
  });

  return { title: "รายงานสรุปการประชุม", details, content: displayed.content.trim() };
}

export function formatMeetingReportText(report: MeetingReport): string {
  return [
    report.title,
    "=".repeat(40),
    ...report.details.map(({ label, value }) => `${label}: ${value}`),
    "",
    summaryMarkdownToText(report.content),
    "",
  ].join("\n");
}

/** A standalone printable page; all text is escaped, the summary rendered from its Markdown. */
export function formatMeetingReportHtml(report: MeetingReport, documentTitle: string): string {
  const details = report.details
    .map(({ label, value }) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
    .join("");

  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>${escapeHtml(documentTitle)}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  body { margin: 0; color: #111827; font: 13px/1.7 Tahoma, "Noto Sans Thai", Arial, sans-serif; }
  h1 { margin: 0 0 12px; font-size: 20px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 18px; break-inside: avoid; }
  th, td { padding: 6px 8px; border: 1px solid #d1d5db; text-align: left; vertical-align: top; }
  th { width: 32%; background: #f3f4f6; font-weight: 600; }
  .content { overflow-wrap: anywhere; }
  .content h2 { margin: 18px 0 6px; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb; font-size: 15px; break-after: avoid; }
  .content h3 { margin: 14px 0 4px; font-size: 14px; break-after: avoid; }
  .content p { margin: 6px 0; }
  .content ul, .content ol { margin: 6px 0; padding-left: 22px; }
  .content li { margin: 2px 0; break-inside: avoid; }
  .content code { padding: 0 3px; border-radius: 3px; background: #f3f4f6; font-family: Menlo, Consolas, monospace; font-size: 12px; }
</style>
</head>
<body>
<h1>${escapeHtml(report.title)}</h1>
<table>${details}</table>
<main class="content">${summaryMarkdownToHtml(report.content)}</main>
</body>
</html>`;
}

const SUMMARY_ERROR_MESSAGES: Record<string, string> = {
  TRANSCRIPT_EMPTY: "การประชุมนี้ยังไม่มีบทสนทนาสำหรับสร้างสรุป",
  TRANSCRIPT_INVALID: "บทสนทนาไม่มีเนื้อหาที่ใช้สร้างสรุปได้",
  TRANSCRIPT_TOO_SHORT: "บทสนทนาสั้นเกินไปสำหรับการสร้างสรุป",
  AI_NOT_CONFIGURED: "ยังไม่ได้ตั้งค่าบริการ AI กรุณาติดต่อผู้ดูแลระบบ",
  AI_AUTH_FAILED: "บริการ AI ปฏิเสธคีย์ API กรุณาติดต่อผู้ดูแลระบบ",
  AI_QUOTA_EXCEEDED: "โควตาบริการ AI หมดแล้ว กรุณาติดต่อผู้ดูแลระบบ",
  AI_RATE_LIMITED: "มีการใช้งาน AI มากเกินไป กรุณารอสักครู่แล้วลองอีกครั้ง",
  AI_TIMEOUT: "บริการ AI ตอบสนองช้าเกินไป กรุณาลองอีกครั้ง",
  AI_UNAVAILABLE: "ไม่สามารถเชื่อมต่อบริการ AI ได้ในขณะนี้ กรุณาลองอีกครั้ง",
  AI_CONTENT_FILTERED: "AI ไม่สามารถสรุปเนื้อหาของการประชุมนี้ได้",
  AI_INPUT_TOO_LARGE: "บทสนทนายาวเกินกว่าที่ระบบจะสรุปได้",
  SUMMARY_IN_PROGRESS: "กำลังสร้างสรุปอยู่ กรุณารอสักครู่",
  SUMMARY_COOLDOWN: "เพิ่งสร้างสรุปไป กรุณารอสักครู่แล้วลองอีกครั้ง",
};

const DEFAULT_SUMMARY_ERROR_MESSAGE = "ไม่สามารถสร้างสรุปการประชุมได้ กรุณาลองอีกครั้ง";

/** Thai message for an error code from POST /api/meetings/[id]/summary. */
export function getSummaryErrorMessage(code: unknown): string {
  return (typeof code === "string" && SUMMARY_ERROR_MESSAGES[code]) || DEFAULT_SUMMARY_ERROR_MESSAGE;
}

/**
 * Asks the server to generate (or regenerate) the meeting's AI summary.
 * Resolves with the stored summary; rejects with a user-facing Thai message.
 */
export async function requestMeetingSummary(
  meetingId: string,
  { discardEdits = false }: { discardEdits?: boolean } = {},
  fetchImpl: typeof fetch = fetch,
): Promise<MeetingSummary> {
  let response: Response;
  try {
    response = await fetchImpl(`/api/meetings/${encodeURIComponent(meetingId)}/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discardEdits }),
    });
  } catch {
    throw new Error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง");
  }

  const data = (await response.json().catch(() => null)) as { summary?: MeetingSummary; code?: unknown } | null;
  if (!response.ok || !data?.summary) {
    throw new Error(getSummaryErrorMessage(data?.code));
  }
  return data.summary;
}

/**
 * A deliberately small Markdown subset for AI meeting summaries: headings,
 * bullet and numbered lists, paragraphs, **bold** and `code`. It parses into
 * plain data so React can render it without raw HTML, and the printable report
 * and text export can share the same structure.
 */

export type SummaryInline = { type: "text" | "strong" | "code"; text: string };

export type SummaryBlock =
  | { type: "heading"; level: 1 | 2 | 3; inlines: SummaryInline[] }
  | { type: "list"; ordered: boolean; items: SummaryInline[][] }
  | { type: "paragraph"; lines: SummaryInline[][] };

const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const BULLET = /^\s*[-*+•]\s+(.*)$/;
const ORDERED = /^\s*\d{1,3}[.)]\s+(.*)$/;
const RULE = /^\s*([-*_])(\s*\1){2,}\s*$/;
const INLINE = /(\*\*[^*\n]+?\*\*|__[^_\n]+?__|`[^`\n]+`)/g;

export function parseSummaryInline(text: string): SummaryInline[] {
  const inlines: SummaryInline[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const token = match[0];
    const index = match.index ?? 0;
    if (index > last) inlines.push({ type: "text", text: text.slice(last, index) });
    inlines.push(
      token.startsWith("`")
        ? { type: "code", text: token.slice(1, -1) }
        : { type: "strong", text: token.slice(2, -2) },
    );
    last = index + token.length;
  }
  if (last < text.length) inlines.push({ type: "text", text: text.slice(last) });
  return inlines;
}

export function parseSummaryMarkdown(markdown: string): SummaryBlock[] {
  const blocks: SummaryBlock[] = [];
  let paragraph: SummaryInline[][] | null = null;
  let list: Extract<SummaryBlock, { type: "list" }> | null = null;

  const endParagraph = () => {
    if (paragraph) blocks.push({ type: "paragraph", lines: paragraph });
    paragraph = null;
  };
  const endList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (const rawLine of markdown.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trimEnd();

    if (!line.trim() || RULE.test(line)) {
      endParagraph();
      endList();
      continue;
    }

    const heading = HEADING.exec(line.trim());
    if (heading) {
      endParagraph();
      endList();
      const level = Math.min(heading[1].length, 3) as 1 | 2 | 3;
      blocks.push({ type: "heading", level, inlines: parseSummaryInline(heading[2]) });
      continue;
    }

    const bullet = BULLET.exec(line);
    const ordered = bullet ? null : ORDERED.exec(line);
    const item = bullet ?? ordered;
    if (item) {
      endParagraph();
      const isOrdered = Boolean(ordered);
      if (list && list.ordered !== isOrdered) endList();
      if (!list) list = { type: "list", ordered: isOrdered, items: [] };
      list.items.push(parseSummaryInline(item[1]));
      continue;
    }

    // A wrapped continuation of the previous list item.
    if (list && /^\s+/.test(line)) {
      const lastItem = list.items[list.items.length - 1];
      lastItem.push({ type: "text", text: " " }, ...parseSummaryInline(line.trim()));
      continue;
    }

    endList();
    if (!paragraph) paragraph = [];
    paragraph.push(parseSummaryInline(line.trim()));
  }
  endParagraph();
  endList();
  return blocks;
}

function inlineText(inlines: SummaryInline[]): string {
  return inlines.map((inline) => inline.text).join("");
}

/** Plain text for the .txt export: no Markdown markers, lists as bullets. */
export function summaryMarkdownToText(markdown: string): string {
  const blocks = parseSummaryMarkdown(markdown);
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading": {
          const text = inlineText(block.inlines);
          return `${text}\n${"-".repeat(Math.min(40, Math.max(3, text.length)))}`;
        }
        case "list":
          return block.items
            .map((item, index) => `${block.ordered ? `${index + 1}.` : "•"} ${inlineText(item)}`)
            .join("\n");
        case "paragraph":
          return block.lines.map(inlineText).join("\n");
      }
    })
    // A heading sits directly on top of its section.
    .reduce((text, part, index) => {
      if (index === 0) return part;
      return text + (blocks[index - 1].type === "heading" ? "\n" : "\n\n") + part;
    }, "");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inlineHtml(inlines: SummaryInline[]): string {
  return inlines
    .map((inline) => {
      const text = escapeHtml(inline.text);
      if (inline.type === "strong") return `<strong>${text}</strong>`;
      if (inline.type === "code") return `<code>${text}</code>`;
      return text;
    })
    .join("");
}

/** Escaped HTML for the printable report. */
export function summaryMarkdownToHtml(markdown: string): string {
  return parseSummaryMarkdown(markdown)
    .map((block) => {
      switch (block.type) {
        case "heading": {
          const tag = block.level === 3 ? "h3" : "h2";
          return `<${tag}>${inlineHtml(block.inlines)}</${tag}>`;
        }
        case "list": {
          const tag = block.ordered ? "ol" : "ul";
          return `<${tag}>${block.items.map((item) => `<li>${inlineHtml(item)}</li>`).join("")}</${tag}>`;
        }
        case "paragraph":
          return `<p>${block.lines.map(inlineHtml).join("<br>")}</p>`;
      }
    })
    .join("\n");
}
