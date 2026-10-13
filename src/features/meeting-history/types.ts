export type MeetingHistoryItem = {
  id: string;
  roomName: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  participantCount: number;
  participantNames: string[];
};

export type MeetingHistoryResponse = {
  meetings: MeetingHistoryItem[];
  nextCursor?: string | null;
};

export type MeetingHistoryFilters = {
  query: string;
  from: string;
  to: string;
};

export type MeetingSummary = {
  id: string;
  aiSummary: string;
  editedSummary: string | null;
  llmModel: string;
  generatedAt: string;
  editedAt: string | null;
};
