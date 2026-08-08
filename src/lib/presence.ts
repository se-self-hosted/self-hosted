/**
 * A participant session counts as "still in the room" only if:
 * 1. it hasn't been explicitly ended (leftAt is null), AND
 * 2. its last heartbeat isn't stale — covers tab closes, crashes, or
 *    dropped connections where the client never got to call /leave.
 *
 * The client sends a heartbeat every HEARTBEAT_INTERVAL_MS while in the
 * room; STALE_AFTER_MS gives some buffer beyond that before we consider
 * the session gone.
 */
export const HEARTBEAT_INTERVAL_MS = 5_000;
export const STALE_AFTER_MS = 15_000;

export function isSessionActive(session: {
  leftAt: Date | null | string;
  lastSeenAt: Date | string;
}): boolean {
  if (session.leftAt) return false;
  const lastSeenMs =
    session.lastSeenAt instanceof Date
      ? session.lastSeenAt.getTime()
      : new Date(session.lastSeenAt).getTime();
  return Date.now() - lastSeenMs < STALE_AFTER_MS;
}

/**
 * Same "still active" rule as isSessionActive, expressed as a Prisma
 * where-clause so it can be pushed down into the database (e.g. for
 * counting active participants) instead of loading every session into
 * memory first.
 */
export function activeSessionWhereClause() {
  return {
    leftAt: null,
    lastSeenAt: { gte: new Date(Date.now() - STALE_AFTER_MS) },
  };
}