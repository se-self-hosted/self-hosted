import type { MeetingSummary } from "./types";

export type DisplayedMeetingSummary = {
  content: string;
  source: "ai" | "edited";
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
