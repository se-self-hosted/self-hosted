import type { MeetingSummary } from "./types";

export type DisplayedMeetingSummary = {
  content: string;
  source: "ai" | "edited";
};

export type SummaryRegenerationStatus = "idle" | "regenerating" | "error";

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

export function selectMeetingSummaryContent(
  summary: MeetingSummary | null,
): DisplayedMeetingSummary | null {
  if (!summary) return null;

  if (summary.editedSummary !== null) {
    return { content: summary.editedSummary, source: "edited" };
  }

  return { content: summary.aiSummary, source: "ai" };
}
