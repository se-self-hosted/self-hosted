import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { activeSessionWhereClause } from "@/lib/presence";

/**
 * A caller may view/post meeting data if they're the meeting's host (via
 * session cookie) or a currently-active participant of that specific
 * meeting (proven by an active ParticipantSession, the same check used for
 * LiveKit token issuance) — never just anyone who knows the meeting id.
 */
export async function resolveMeetingAccess(
  meetingId: string,
  participantId?: string | null,
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

  if (participantId) {
    const session = await prisma.participantSession.findFirst({
      where: {
        participantId,
        ...activeSessionWhereClause(),
        participant: { meetingId },
      },
    });
    if (session) {
      return { meeting, allowed: true, isHost: false };
    }
  }

  return { meeting, allowed: false, isHost: false };
}
