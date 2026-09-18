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
};

export type MeetingHistoryFilters = {
  query: string;
  from: string;
  to: string;
};
