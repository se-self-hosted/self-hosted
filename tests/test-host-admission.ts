import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import test from "node:test";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";
import { AdmissionError, joinMeeting } from "../src/lib/meeting-admission";

// Run against the development app and its database:
// docker compose exec -T app node --import tsx --test tests/test-host-admission.ts
const base = process.env.TEST_BASE_URL || "http://localhost:3000";

test("authenticated hosts can have only one room connection", async (t) => {
  const users: string[] = [];
  const connections = new Map<string, string>();
  let refreshing: Promise<unknown> | null = null;
  async function post(path: string, body: object, cookie = "") {
    const response = await fetch(`${base}${path}`, {
      method: "POST", headers: { "Content-Type": "application/json", cookie },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    const route = path.match(/^\/api\/rooms\/([^/]+)\/(join|leave)$/);
    if (route && response.status === 201 && route[2] === "join") {
      connections.set(data.connectionId, route[1]);
    }
    if (route && response.ok && route[2] === "leave" && "connectionId" in body && typeof body.connectionId === "string") {
      if (connections.get(body.connectionId) === route[1]) connections.delete(body.connectionId);
    }
    return { status: response.status, data, cookie: response.headers.get("set-cookie")?.split(";")[0] || "" };
  }
  // Simulate the browser heartbeat while cold route compilation is taking place.
  const interval = setInterval(() => {
    if (refreshing) return;
    refreshing = Promise.all([...connections].map(([connectionId, hash]) =>
      post(`/api/rooms/${hash}/heartbeat`, { connectionId })))
      .finally(() => { refreshing = null; });
  }, 2_000);
  async function stopHeartbeat(connectionId: string) {
    connections.delete(connectionId);
    await refreshing;
  }
  try {
    await post("/api/livekit/token", {});
    await post("/api/rooms/test-warmup/heartbeat", {});
    await post("/api/rooms/test-warmup/leave", {});
    const password = randomUUID();
    const host = await prisma.user.create({ data: {
      email: `admission-${randomUUID()}@example.com`, fullname: "Same Name", password: await bcrypt.hash(password, 4),
    } });
    users.push(host.id);
    const other = await prisma.user.create({ data: {
      email: `admission-${randomUUID()}@example.com`, fullname: host.fullname, password: host.password,
    } });
    users.push(other.id);
    const rooms = await Promise.all([0, 1, 2].map((n) => prisma.meetingRoom.create({ data: {
      hostId: host.id, roomName: `Admission test ${n}`, roomHash: randomUUID(), maxParticipants: 10, status: "active",
    } })));
    const login = await post("/api/auth/login", { email: host.email, password });
    assert.equal(login.status, 200, JSON.stringify(login.data));
    const otherLogin = await post("/api/auth/login", { email: other.email, password });
    const join = (index: number, cookie = login.cookie, displayName = host.fullname) =>
      post(`/api/rooms/${rooms[index].roomHash}/join`, { displayName }, cookie);
    const leave = (index: number, connectionId: string) =>
      post(`/api/rooms/${rooms[index].roomHash}/leave`, { connectionId });

    let first: Awaited<ReturnType<typeof join>>;
    await t.test("same-room concurrent joins admit one and preserve its session", async () => {
      const results = await Promise.all([join(0), join(0)]);
      assert.deepEqual(results.map((r) => r.status).sort(), [201, 409], JSON.stringify(results));
      first = results.find((r) => r.status === 201)!;
      assert.equal(results.find((r) => r.status === 409)!.data.code, "ALREADY_IN_ROOM");
      const session = await prisma.participantSession.findFirstOrThrow({ where: { connectionId: first.data.connectionId } });
      assert.equal(session.leftAt, null);
      assert.equal(await prisma.meeting.count({ where: { roomId: rooms[0].id } }), 1);
    });
    await t.test("another room and a changed name cannot bypass the account guard", async () => {
      const blocked = await join(1, login.cookie, "Different Name");
      assert.equal(blocked.status, 409);
      assert.equal(blocked.data.code, "ALREADY_IN_ANOTHER_ROOM");
      assert.equal(await prisma.meeting.count({ where: { roomId: rooms[1].id } }), 0);
    });
    await t.test("guests and other accounts sharing the name remain independent", async () => {
      const guest = await join(0, "");
      const secondGuest = await join(0, "");
      const otherHost = await join(0, otherLogin.cookie);
      assert.equal(guest.status, 201);
      assert.equal(secondGuest.status, 201);
      assert.equal(otherHost.status, 201);
      assert.notEqual(guest.data.participantId, first.data.participantId);
      assert.notEqual(guest.data.participantId, secondGuest.data.participantId);
      const token = await post("/api/livekit/token", {
        roomHash: rooms[0].roomHash, identity: guest.data.participantId,
        connectionId: guest.data.connectionId, displayName: host.fullname, isHost: true,
      });
      assert.equal(token.status, 200, JSON.stringify(token.data));
      const claims = JSON.parse(Buffer.from(token.data.token.split(".")[1], "base64url").toString());
      assert.equal(claims.video.roomAdmin, false);
      await Promise.all([guest, secondGuest, otherHost].map((r) => leave(0, r.data.connectionId)));
    });
    await t.test("tokens require a valid admission bound to this account and room", async () => {
      const payload = {
        roomHash: rooms[0].roomHash, identity: first.data.participantId,
        connectionId: first.data.connectionId, displayName: host.fullname,
      };
      assert.equal((await post("/api/livekit/token", payload)).status, 409);
      assert.equal((await post("/api/livekit/token", { ...payload, roomHash: rooms[1].roomHash }, login.cookie)).status, 409);
      assert.equal((await post("/api/livekit/token", { ...payload, connectionId: "unknown" }, login.cookie)).status, 409);
      assert.equal((await post("/api/livekit/token", payload, login.cookie)).status, 200);
    });
    await t.test("leaving releases admission; wrong-room leave cannot release it", async () => {
      await leave(1, first.data.connectionId);
      assert.equal((await join(1)).status, 409);
      await leave(0, first.data.connectionId);
      const again = await join(0);
      assert.equal(again.status, 201);
      assert.equal(again.data.participantId, first.data.participantId);
      assert.notEqual(again.data.connectionId, first.data.connectionId);
      await leave(0, again.data.connectionId);
    });
    await t.test("different-room simultaneous requests admit only one", async () => {
      const results = await Promise.all([join(1), join(2)]);
      assert.deepEqual(results.map((r) => r.status).sort(), [201, 409]);
      const winnerIndex = results.findIndex((r) => r.status === 201);
      await leave(winnerIndex + 1, results[winnerIndex].data.connectionId);
    });
    await t.test("a stale heartbeat cannot bypass a live audio connection or an unavailable presence service", async () => {
      const active = await join(0);
      assert.equal(active.status, 201);
      await stopHeartbeat(active.data.connectionId);
      await prisma.participantSession.updateMany({
        where: { connectionId: active.data.connectionId }, data: { lastSeenAt: new Date(Date.now() - 60_000) },
      });
      let available = true;
      const server = createServer((_req, res) => {
        res.writeHead(available ? 200 : 503, { "Content-Type": "application/json" });
        res.end(JSON.stringify(available
          ? { sid: "PA_test", identity: active.data.participantId }
          : { code: "unavailable", msg: "Service unavailable" }));
      });
      const previousUrl = process.env.LIVEKIT_URL;
      try {
        await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
        const address = server.address();
        assert.ok(address && typeof address !== "string");
        process.env.LIVEKIT_URL = `http://127.0.0.1:${address.port}`;
        await assert.rejects(joinMeeting(rooms[1].roomHash, host.fullname, host),
          (error: unknown) => error instanceof AdmissionError && error.code === "ALREADY_IN_ANOTHER_ROOM");
        available = false;
        await assert.rejects(joinMeeting(rooms[1].roomHash, host.fullname, host),
          (error: unknown) => error instanceof AdmissionError && error.status === 503);
        const session = await prisma.participantSession.findFirstOrThrow({ where: { connectionId: active.data.connectionId } });
        assert.equal(session.leftAt, null);
      } finally {
        if (previousUrl === undefined) delete process.env.LIVEKIT_URL;
        else process.env.LIVEKIT_URL = previousUrl;
        await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
        await leave(0, active.data.connectionId);
      }
    });
    await t.test("a stale disconnected session is replaced and cannot revive by heartbeat", async () => {
      const old = await join(0);
      assert.equal(old.status, 201);
      await stopHeartbeat(old.data.connectionId);
      await prisma.participantSession.updateMany({
        where: { connectionId: old.data.connectionId }, data: { lastSeenAt: new Date(Date.now() - 60_000) },
      });
      const replacement = await join(1);
      assert.equal(replacement.status, 201, JSON.stringify(replacement.data));
      const heartbeat = (index: number, connectionId: string) =>
        post(`/api/rooms/${rooms[index].roomHash}/heartbeat`, { connectionId });
      assert.equal((await heartbeat(0, old.data.connectionId)).status, 409);
      assert.equal((await heartbeat(0, replacement.data.connectionId)).status, 409);
      assert.equal((await heartbeat(1, replacement.data.connectionId)).status, 200);
      await leave(1, replacement.data.connectionId);
    });
    await t.test("dashboard reports the account's current room and clears it after leaving", async () => {
      async function dashboard() {
        const response = await fetch(`${base}/api/rooms`, { headers: { cookie: login.cookie } });
        assert.equal(response.status, 200);
        return response.json();
      }
      const guest = await join(0, "", host.fullname);
      assert.equal(guest.status, 201);
      const before = await dashboard();
      assert.equal(before.activeRoomId, null);
      assert.ok(before.rooms.every((room: { isHostInRoom: boolean }) => !room.isHostInRoom));
      const active = await join(1);
      assert.equal(active.status, 201);
      const during = await dashboard();
      assert.equal(during.activeRoomId, rooms[1].id);
      assert.deepEqual(during.rooms.filter((room: { isHostInRoom: boolean }) => room.isHostInRoom)
        .map((room: { id: string }) => room.id), [rooms[1].id]);
      await leave(1, active.data.connectionId);
      assert.equal((await dashboard()).activeRoomId, null);
      await leave(0, guest.data.connectionId);
    });
  } finally {
    clearInterval(interval);
    connections.clear();
    await refreshing;
    await prisma.user.deleteMany({ where: { id: { in: users } } });
    await prisma.$disconnect();
  }
});
