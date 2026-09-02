export type TranscriptParticipant = {
  id: string;
  displayName: string;
  initials: string;
  color: "indigo" | "cyan" | "violet" | "amber" | "emerald";
};

export type TranscriptSegmentViewModel = {
  id: string;
  speaker: TranscriptParticipant;
  text: string;
  spokenAt: string;
};

export type TranscriptMeetingViewModel = {
  id: string;
  title: string;
  startedAt: string;
  durationSeconds: number;
  participants: TranscriptParticipant[];
};

export type TranscriptViewerState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "empty" | "ready";
      meeting: TranscriptMeetingViewModel;
      segments: TranscriptSegmentViewModel[];
    };
