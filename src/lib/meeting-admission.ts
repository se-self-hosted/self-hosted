import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { RoomServiceClient, ServerError } from "livekit-server-sdk";
import { prisma } from "@/lib/db";
import { activeSessionWhereClause, isSessionActive } from "@/lib/presence";

export class AdmissionError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

// A background tab can miss heartbeats while its audio connection is still alive.
export async function isConnected(roomHash: string, participantId: string) {
  const publicUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880";
  const useDockerHost = fs.existsSync("/.dockerenv") &&
    ["localhost", "127.0.0.1", "[::1]"].includes(new URL(publicUrl).hostname);
  const url = process.env.LIVEKIT_URL || process.env.LIVEKIT_HOST ||
    (useDockerHost ? "http://livekit:7880" : publicUrl);
  const client = new RoomServiceClient(
    url.replace(/^ws/, "http"),
    process.env.LIVEKIT_API_KEY || "devkey",
    process.env.LIVEKIT_API_SECRET || "secret",
    { requestTimeout: 3 },
  );
  try {
    await client.getParticipant(roomHash, participantId);
    return true;
  } catch (error) {
    if (error instanceof ServerError && error.code === "not_found") return false;
    throw new AdmissionError(503, "PRESENCE_UNAVAILABLE", "ยังตรวจสอบห้องเดิมไม่ได้ กรุณาลองอีกครั้ง");
  }
}

type JoiningUser = { id: string; fullname: string; email: string };

type PresenceSession = {
  id: string;
  joinedAt: Date;
  leftAt: Date | null;
  lastSeenAt: Date;
  participantId: string;
  participant: { meeting: {
    endedAt: Date | null;
    room: { id: string; roomHash: string; roomName: string; status: string };
  } };
};

async function findActiveRoom(sessions: PresenceSession[]) {
  for (const session of sessions) {
    const room = session.participant.meeting.room;
    if (room.status !== "active" || session.participant.meeting.endedAt) continue;
    if (isSessionActive(session) || await isConnected(room.roomHash, session.participantId)) return room;
  }
  return null;
}

export async function getActiveUserRoom(userId: string) {
  const sessions = await prisma.participantSession.findMany({
    where: { leftAt: null, participant: { userId, meeting: { endedAt: null, room: { status: "active" } } } },
    include: { participant: { include: { meeting: { include: { room: true } } } } },
  });
  return findActiveRoom(sessions);
}

export async function joinMeeting(hash: string, name: string, user: JoiningUser | null) {
  // Resolve "already active elsewhere" and find genuinely-stale sessions BEFORE
  // taking any row locks. This can involve a live network call to the LiveKit
  // server per stale-heartbeat session (see isConnected above) — running that
  // under the FOR UPDATE locks below would serialize every join for this
  // account, and every join into this room, behind that external round-trip.
  let staleSessions: PresenceSession[] = [];
  if (user) {
    const sessions = await prisma.participantSession.findMany({
      where: { leftAt: null, participant: { userId: user.id } },
      include: { participant: { include: { meeting: { include: { room: true } } } } },
    });
    const previousRoom = await findActiveRoom(sessions);
    if (previousRoom) {
      const targetRoom = await prisma.meetingRoom.findUnique({ where: { roomHash: hash }, select: { id: true } });
      const sameRoom = targetRoom?.id === previousRoom.id;
      throw new AdmissionError(409, sameRoom ? "ALREADY_IN_ROOM" : "ALREADY_IN_ANOTHER_ROOM",
        sameRoom
          ? "คุณอยู่ในห้องประชุมนี้แล้ว กรุณากลับไปใช้แท็บหรืออุปกรณ์เดิม"
          : `คุณกำลังอยู่ในห้อง “${previousRoom.roomName}” กรุณาออกจากห้องเดิมก่อนเข้าห้องนี้`);
    }
    // None of these were reachable (live or heartbeat) — safe to retire.
    staleSessions = sessions;
  }

  return prisma.$transaction(async (tx) => {
    // Serialize every admission for this account, even across different rooms.
    if (user) await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${user.id} FOR UPDATE`;
    // Serialize meeting creation and capacity checks within the target room.
    await tx.$queryRaw`SELECT id FROM "MeetingRoom" WHERE "roomHash" = ${hash} FOR UPDATE`;
    const room = await tx.meetingRoom.findUnique({ where: { roomHash: hash } });
    if (!room) throw new AdmissionError(404, "ROOM_NOT_FOUND", "ไม่พบห้องประชุม");
    if (room.status !== "active") throw new AdmissionError(400, "ROOM_INACTIVE", "ห้องประชุมปิดแล้ว");

    // Retire stale sessions permanently so a delayed heartbeat cannot revive
    // them. Re-check leftAt under the lock: the pre-check above ran without
    // one, so a session could have already been closed/renewed in the gap.
    for (const session of staleSessions) {
      await tx.participantSession.updateMany({
        where: { id: session.id, leftAt: null },
        data: {
          leftAt: session.lastSeenAt,
          durationSeconds: Math.max(0, Math.round((session.lastSeenAt.getTime() - session.joinedAt.getTime()) / 1000)),
        },
      });
    }

    let meeting = await tx.meeting.findFirst({
      where: { roomId: room.id, endedAt: null }, orderBy: { startedAt: "desc" },
    });
    if (!meeting) meeting = await tx.meeting.create({ data: { roomId: room.id } });
    const activeCount = await tx.participant.count({
      where: { meetingId: meeting.id, sessions: { some: activeSessionWhereClause() } },
    });
    if (activeCount >= room.maxParticipants) throw new AdmissionError(403, "ROOM_FULL", "ห้องประชุมเต็มแล้ว");

    const displayName = user?.id === room.hostId ? user.fullname || user.email : name;
    let participant = user ? await tx.participant.findFirst({
      where: { meetingId: meeting.id, userId: user.id },
    }) : null;
    if (!participant) {
      participant = await tx.participant.create({
        data: { meetingId: meeting.id, displayName, userId: user?.id },
      });
    }
    const now = new Date();
    const connectionId = randomUUID();
    await tx.participantSession.create({
      data: { participantId: participant.id, connectionId, joinedAt: now, lastSeenAt: now },
    });
    return {
      participantId: participant.id, meetingId: meeting.id, connectionId,
      displayName: participant.displayName,
      meetingStartedAt: meeting.startedAt.toISOString(), serverNow: new Date().toISOString(),
    };
  }, { timeout: 15_000 });
}
