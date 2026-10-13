import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { meetingHistoryFixtures } from "./fixtures.ts";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { bangkokDayRange, filterMeetingHistory } from "./search.ts";

test("searches fixture meetings by room name without case sensitivity", () => {
  const results = filterMeetingHistory(meetingHistoryFixtures, { query: "ENGINEERING", from: "", to: "" });
  assert.deepEqual(results.map((meeting) => meeting.roomName), ["Engineering Stand-up"]);
});

test("searches fixture meetings by participant name", () => {
  const results = filterMeetingHistory(meetingHistoryFixtures, { query: "Pimchanok", from: "", to: "" });
  assert.deepEqual(results.map((meeting) => meeting.roomName), ["Customer Success Sync", "UX Research Debrief"]);
});

test("filters fixture meetings by inclusive Bangkok dates", () => {
  const results = filterMeetingHistory(meetingHistoryFixtures, { query: "", from: "2026-07-15", to: "2026-07-17" });
  assert.deepEqual(results.map((meeting) => meeting.roomName), ["Customer Success Sync", "Marketing Campaign Review", "Board Quarterly Review"]);
});

test("combines text and date filters", () => {
  const results = filterMeetingHistory(meetingHistoryFixtures, { query: "Siriporn", from: "2026-07-16", to: "2026-07-18" });
  assert.deepEqual(results.map((meeting) => meeting.roomName), ["Engineering Stand-up", "Marketing Campaign Review"]);
});

test("bangkokDayRange covers whole Bangkok days, inclusive of the end date", () => {
  const range = bangkokDayRange("2026-07-15", "2026-07-17");
  assert.equal(range.gte?.toISOString(), "2026-07-14T17:00:00.000Z");
  assert.equal(range.lt?.toISOString(), "2026-07-17T17:00:00.000Z");
});

test("bangkokDayRange ignores empty and malformed dates", () => {
  assert.deepEqual(bangkokDayRange("", null), {});
  assert.deepEqual(bangkokDayRange("15/07/2026", "2026-13-45"), {});
});
