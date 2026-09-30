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

  return `${safeRoomName || "meeting-summary"}-${date}-summary.pdf`;
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
  SUMMARY_IN_PROGRESS: "กำลังสร้างสรุปอยู่ กรุณารอสักครู่",
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
