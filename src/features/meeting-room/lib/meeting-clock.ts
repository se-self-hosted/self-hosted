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
