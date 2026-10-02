import { createHash } from "crypto";

export type TakeSource = {
  id: string;
  startOffsetSeconds: number | null;
  durationSeconds: number | null;
};

export type RecordingTake<T extends TakeSource> = {
  /** Changes whenever the take gains or loses a file, so a cached mix never goes stale. */
  key: string;
  startOffsetSeconds: number;
  durationSeconds: number;
  recordings: T[];
};

// Each client times its file on the shared meeting clock, but its encoded
// length can run slightly past the moment the host pressed stop. Without some
// slack, stopping and recording again right away would merge the two takes.
const OVERLAP_SLACK_SECONDS = 1;

/**
 * Groups per-speaker files into takes: one take per press of the record
 * button. Every client records its own mic over the same span, and a member
 * who joins mid-take starts inside it, so files that overlap in time belong to
 * the same take while separate presses never overlap. Files missing a start or
 * a duration can't be placed and are left out.
 */
export function groupRecordingTakes<T extends TakeSource>(recordings: T[]): RecordingTake<T>[] {
  const placed = recordings
    .filter((recording) => recording.startOffsetSeconds !== null && recording.durationSeconds !== null)
    .sort((a, b) => a.startOffsetSeconds! - b.startOffsetSeconds!);

  const groups: { start: number; end: number; recordings: T[] }[] = [];
  for (const recording of placed) {
    const start = recording.startOffsetSeconds!;
    const end = start + recording.durationSeconds!;
    const current = groups.at(-1);
    if (current && start < current.end - OVERLAP_SLACK_SECONDS) {
      current.end = Math.max(current.end, end);
      current.recordings.push(recording);
    } else {
      groups.push({ start, end, recordings: [recording] });
    }
  }

  return groups.map((group) => ({
    key: takeKey(group.recordings.map((recording) => recording.id)),
    startOffsetSeconds: group.start,
    durationSeconds: Math.round(group.end - group.start),
    recordings: group.recordings,
  }));
}

function takeKey(recordingIds: string[]): string {
  return createHash("sha256").update([...recordingIds].sort().join(",")).digest("hex").slice(0, 24);
}
