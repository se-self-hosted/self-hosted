/**
 * The whole transcript as "Speaker: text" lines, from segments already in
 * chronological order. Built on read: rewriting it on every saved line made
 * each save cost as much as the transcript was long.
 */
export function buildFullTranscript(
  segments: readonly { text: string; participant: { displayName: string } }[],
): string {
  return segments.map((s) => `${s.participant.displayName}: ${s.text}`).join("\n");
}
