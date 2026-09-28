import type { MeetingSummary } from "./types";

export type DisplayedMeetingSummary = {
  content: string;
  source: "ai" | "edited";
};

export type SummaryDraftState = {
  hasChanges: boolean;
  hasContent: boolean;
};

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
