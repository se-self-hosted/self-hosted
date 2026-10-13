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

const BANGKOK_OFFSET = "+07:00";
const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The same inclusive Bangkok-calendar-day bounds as filterMeetingHistory,
 * as a startedAt range the database can filter on. Malformed dates are ignored.
 */
export function bangkokDayRange(from?: string | null, to?: string | null) {
  const range: { gte?: Date; lt?: Date } = {};
  if (from && DATE_PATTERN.test(from)) {
    const start = new Date(`${from}T00:00:00${BANGKOK_OFFSET}`);
    if (!Number.isNaN(start.getTime())) range.gte = start;
  }
  if (to && DATE_PATTERN.test(to)) {
    const end = new Date(`${to}T00:00:00${BANGKOK_OFFSET}`);
    if (!Number.isNaN(end.getTime())) range.lt = new Date(end.getTime() + DAY_MS);
  }
  return range;
}
