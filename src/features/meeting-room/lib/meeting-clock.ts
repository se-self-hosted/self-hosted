/** Anchor transcript timestamps to the meeting, independent of the device's wall clock. */
export function createMeetingClock(
  meetingStartedAt: string,
  serverNow: string,
  monotonicNow: () => number = () => performance.now(),
) {
  const startedAtMs = Date.parse(meetingStartedAt);
  const serverNowMs = Date.parse(serverNow);
  if (!Number.isFinite(startedAtMs) || !Number.isFinite(serverNowMs)) {
    throw new Error("Invalid meeting clock timestamps");
  }
  const receivedAtMs = monotonicNow();

  return () => {
    // The server timestamp is sampled just before returning the join response.
    // Response transit time is not included in this approximation.
    const elapsedMs = Math.max(0, serverNowMs - startedAtMs + monotonicNow() - receivedAtMs);
    return {
      elapsedSeconds: elapsedMs / 1000,
      spokenAt: new Date(startedAtMs + elapsedMs).toISOString(),
    };
  };
}

/** How far a client's spokenAt may drift from the meeting clock and still be trusted. */
export const MAX_SPOKEN_AT_DRIFT_MS = 5 * 60_000;

/**
 * Server-side wall-clock time for a stored segment. The client's `spokenAt`
 * comes from the same meeting clock as `startTime`, so it is kept when valid
 * and close to it; otherwise it is derived from the meeting start rather than
 * the save time (which lags by the client's retry delay) or a bogus value.
 */
export function resolveSegmentSpokenAt(
  meetingStartedAt: Date,
  startTimeSeconds: number,
  clientSpokenAt?: string | null,
): Date {
  const derived = new Date(meetingStartedAt.getTime() + Math.max(0, startTimeSeconds) * 1000);
  if (clientSpokenAt) {
    const parsed = new Date(clientSpokenAt);
    if (Math.abs(parsed.getTime() - derived.getTime()) <= MAX_SPOKEN_AT_DRIFT_MS) return parsed;
  }
  return derived;
}
