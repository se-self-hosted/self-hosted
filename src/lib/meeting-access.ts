import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { activeSessionWhereClause } from "@/lib/presence";

/**
 * How long after leaving a session may still write. It covers the in-flight
 * work of leaving: the recognizer's drain after stop(), the recording upload
 * starting, and the client's whole transcript retry schedule (~31 s).
 */
export const LEAVE_GRACE_MS = 60_000;

/**
 * A caller may view/post meeting data if they're the meeting's host (via
 * session cookie) or a participant of that specific meeting proven by the
 * session's `connectionId` — the same pair used for LiveKit token issuance.
 * The participant id alone proves nothing: it is also the LiveKit identity,
 * visible to everyone in the room.
 *
 * `leftGraceMs` also admits a session that ended within that window, so
 * writes still in flight when someone leaves (their last transcript line)
 * are not rejected.
 */
export async function resolveMeetingAccess(
  meetingId: string,
  proof?: { participantId?: string | null; connectionId?: string | null },
  { leftGraceMs = 0 }: { leftGraceMs?: number } = {},
) {
  const [user, meeting] = await Promise.all([
    getUserFromRequest(),
    prisma.meeting.findUnique({
      where: { id: meetingId },
      select: { id: true, room: { select: { hostId: true, roomHash: true } } },
    }),
  ]);

  if (!meeting) {
    return { meeting: null, allowed: false, isHost: false };
  }

  const isHost = Boolean(user && meeting.room.hostId === user.id);
  if (isHost) {
    return { meeting, allowed: true, isHost: true };
  }

  if (proof?.participantId && proof.connectionId) {
    const session = await prisma.participantSession.findFirst({
      where: {
        participantId: proof.participantId,
        connectionId: proof.connectionId,
        participant: { meetingId },
        OR: [
          activeSessionWhereClause(),
          ...(leftGraceMs > 0 ? [{ leftAt: { gte: new Date(Date.now() - leftGraceMs) } }] : []),
        ],
      },
    });
    if (session) {
      return { meeting, allowed: true, isHost: false };
    }
  }

  return { meeting, allowed: false, isHost: false };
}
