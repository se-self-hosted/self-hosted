import type { MeetingSummary } from "./types";

export type DisplayedMeetingSummary = {
  content: string;
  source: "ai" | "edited";
};

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
