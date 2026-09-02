import type { MeetingHistoryItem } from "./types";

/**
 * Frontend-only data source for SHT-124–SHT-126. Replace this fixture at the
 * MeetingHistory `meetings` prop boundary when the SHT-112 API is available.
 */
export const meetingHistoryFixtures: MeetingHistoryItem[] = [
  { id: "fixture-engineering-stand-up", roomName: "Engineering Stand-up", startedAt: "2026-07-18T17:00:00+07:00", endedAt: "2026-07-18T17:30:45+07:00", durationSeconds: 1845, participantCount: 5, participantNames: ["Thanakorn", "Siriporn", "Wichai", "Nattaya", "Guest"] },
  { id: "fixture-customer-success-sync", roomName: "Customer Success Sync", startedAt: "2026-07-17T21:00:00+07:00", endedAt: "2026-07-17T21:53:30+07:00", durationSeconds: 3210, participantCount: 4, participantNames: ["Thanakorn", "Araya", "Pimchanok", "Guest"] },
  { id: "fixture-marketing-campaign-review", roomName: "Marketing Campaign Review", startedAt: "2026-07-16T22:30:00+07:00", endedAt: "2026-07-16T23:15:00+07:00", durationSeconds: 2700, participantCount: 6, participantNames: ["Siriporn", "Nattaya", "Krit", "Araya", "Guest 1", "Guest 2"] },
  { id: "fixture-board-quarterly-review", roomName: "Board Quarterly Review", startedAt: "2026-07-15T16:00:00+07:00", endedAt: "2026-07-15T17:30:00+07:00", durationSeconds: 5400, participantCount: 3, participantNames: ["Thanakorn", "Wichai", "Somsak"] },
  { id: "fixture-ux-research-debrief", roomName: "UX Research Debrief", startedAt: "2026-07-14T20:00:00+07:00", endedAt: "2026-07-14T20:35:00+07:00", durationSeconds: 2100, participantCount: 3, participantNames: ["Siriporn", "Araya", "Pimchanok"] },
];
