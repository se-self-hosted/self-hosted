import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { groupRecordingTakes } from "./recording-takes.ts";

const rec = (id: string, startOffsetSeconds: number | null, durationSeconds: number | null) =>
  ({ id, startOffsetSeconds, durationSeconds });

test("everyone's file from one press of record forms one take", () => {
  const takes = groupRecordingTakes([rec("host", 10, 60), rec("a", 10.4, 59), rec("b", 11, 58)]);
  assert.equal(takes.length, 1);
  assert.deepEqual(takes[0].recordings.map((r: { id: string }) => r.id), ["host", "a", "b"]);
  assert.equal(takes[0].startOffsetSeconds, 10);
  assert.equal(takes[0].durationSeconds, 60);
});

test("a member who joins mid-take is part of that take", () => {
  const takes = groupRecordingTakes([rec("host", 0, 120), rec("late", 90, 30)]);
  assert.equal(takes.length, 1);
  assert.equal(takes[0].durationSeconds, 120);
});

test("recording twice gives two takes, in order", () => {
  const takes = groupRecordingTakes([
    rec("second-host", 200, 30),
    rec("first-host", 0, 60),
    rec("first-a", 0.5, 60),
    rec("second-a", 200.3, 29),
  ]);
  assert.deepEqual(
    takes.map((take: { recordings: { id: string }[] }) => take.recordings.map((r) => r.id)),
    [["first-host", "first-a"], ["second-host", "second-a"]],
  );
});

test("stopping and recording again right away still gives two takes", () => {
  // The first file's encoded length runs a moment past the stop.
  const takes = groupRecordingTakes([rec("first", 0, 61), rec("second", 60.5, 20)]);
  assert.equal(takes.length, 2);
});

test("files without a start or duration are left out", () => {
  const takes = groupRecordingTakes([rec("ok", 0, 10), rec("no-start", null, 10), rec("no-length", 5, null)]);
  assert.equal(takes.length, 1);
  assert.deepEqual(takes[0].recordings.map((r: { id: string }) => r.id), ["ok"]);
});

test("the key changes when a late upload joins the take", () => {
  const before = groupRecordingTakes([rec("host", 0, 60)])[0].key;
  const after = groupRecordingTakes([rec("host", 0, 60), rec("late", 30, 30)])[0].key;
  assert.notEqual(before, after);
  assert.equal(groupRecordingTakes([rec("late", 30, 30), rec("host", 0, 60)])[0].key, after);
});
