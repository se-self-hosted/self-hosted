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

  // `current` is always a previous result, so already in order: insert each
  // new line in place (usually at the end) instead of re-sorting everything.
  for (const segment of incoming) {
    if (ids.has(segment.id)) continue;
    ids.add(segment.id);
    let index = merged.length;
    while (index > 0 && compareSegments(merged[index - 1], segment) > 0) index--;
    merged.splice(index, 0, segment);
  }

  return merged;
}

function compareSegments(a: SortableTranscriptSegment, b: SortableTranscriptSegment) {
  if (a.endTime !== b.endTime) return a.endTime - b.endTime;
  return Date.parse(a.spokenAt) - Date.parse(b.spokenAt);
}
