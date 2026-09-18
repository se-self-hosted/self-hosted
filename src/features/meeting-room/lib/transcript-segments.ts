type SortableTranscriptSegment = {
  id: string;
  startTime: number;
  spokenAt: string;
};

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
    if (a.startTime !== b.startTime) return a.startTime - b.startTime;
    return new Date(a.spokenAt).getTime() - new Date(b.spokenAt).getTime();
  });
}
