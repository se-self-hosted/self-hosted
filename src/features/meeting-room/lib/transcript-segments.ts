type SortableTranscriptSegment = {
  id: string;
  endTime: number;
  spokenAt: string;
};

/**
 * Orders the live panel like a chat: by when each utterance finished, so a new
 * final result always lands at the bottom even if its speech began before
 * segments other speakers finished in the meantime.
 */
export function mergeTranscriptSegments<T extends SortableTranscriptSegment>(
  current: readonly T[],
  incoming: readonly T[],
): T[] {
  const merged = [...current];
  const ids = new Set(current.map((segment) => segment.id));

  for (const segment of incoming) {
    if (ids.has(segment.id)) continue;
    ids.add(segment.id);
    merged.push(segment);
  }

  return merged.sort((a, b) => {
    if (a.endTime !== b.endTime) return a.endTime - b.endTime;
    return new Date(a.spokenAt).getTime() - new Date(b.spokenAt).getTime();
  });
}
