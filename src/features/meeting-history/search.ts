import type { MeetingHistoryFilters, MeetingHistoryItem } from "./types";

const bangkokDateFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Bangkok",
});

export function filterMeetingHistory(
  meetings: MeetingHistoryItem[],
  filters: MeetingHistoryFilters,
) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase();

  return meetings.filter((meeting) => {
    const searchableText = [meeting.roomName, ...meeting.participantNames]
      .join(" ")
      .toLocaleLowerCase();
    const meetingDate = bangkokDateFormatter.format(new Date(meeting.startedAt));

    const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
    const matchesFrom = !filters.from || meetingDate >= filters.from;
    const matchesTo = !filters.to || meetingDate <= filters.to;

    return matchesQuery && matchesFrom && matchesTo;
  });
}
