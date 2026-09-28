// A bad payload, a missing meeting and a conflicting segment id stay wrong
// on retry. A 403 does not: a stale heartbeat (e.g. a backgrounded phone
// tab) recovers once the next heartbeat lands.
const PERMANENT_STATUSES = new Set([400, 404, 409]);
const RETRY_DELAYS_MS = [1000, 2000, 4000, 8000, 16000];

/**
 * Persist one transcript line, retrying transient failures. `send` must
 * resend the same segment id each time, so the server can recognise a
 * retry of a line it already stored. Resolves whether the line was saved.
 */
export async function saveTranscriptSegment(
  send: () => Promise<Response>,
  wait: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
): Promise<boolean> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      const response = await send();
      if (response.ok) return true;
      if (PERMANENT_STATUSES.has(response.status)) return false;
    } catch {
      // Network failure: retry below.
    }
    if (attempt >= RETRY_DELAYS_MS.length) return false;
    await wait(RETRY_DELAYS_MS[attempt]);
  }
}
