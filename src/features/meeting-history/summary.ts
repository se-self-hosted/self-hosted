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
