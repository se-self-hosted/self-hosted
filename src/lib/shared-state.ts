import fs from "fs";
import { randomUUID } from "crypto";
import { createClient } from "redis";

/**
 * Short-lived state every app instance must agree on: locks, cooldowns and
 * small caches. Kept in Redis so several app containers behind one proxy
 * share it; without REDIS_URL, or while Redis is unreachable, it falls back
 * to this process's memory, which is correct for a single instance.
 */

type RedisClient = ReturnType<typeof createClient>;

const KEY_PREFIX = "meetsync:";
const RETRY_CONNECT_AFTER_MS = 30_000;
const CONNECT_TIMEOUT_MS = 2_000;

const globalForRedis = globalThis as unknown as {
  sharedStateRedis?: { client: RedisClient | null; connecting: Promise<RedisClient | null> | null; unavailableUntil: number };
};
const state = (globalForRedis.sharedStateRedis ??= { client: null, connecting: null, unavailableUntil: 0 });

function redisUrl(): string | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  // Same convention as the database URL: the compose hostname only resolves
  // inside docker; a dev server on the host reaches the published port.
  if (!fs.existsSync("/.dockerenv")) return url.replace("//redis:", "//localhost:");
  return url;
}

async function getRedis(): Promise<RedisClient | null> {
  const url = redisUrl();
  if (!url) return null;
  if (state.client) {
    // While a dropped connection is being re-established, use memory rather
    // than queue commands behind it.
    return state.client.isReady ? state.client : null;
  }
  if (Date.now() < state.unavailableUntil) return null;
  state.connecting ??= (async () => {
    let client: RedisClient | undefined;
    try {
      // Inside the try: a malformed REDIS_URL throws here, and must fall
      // back to memory like an unreachable server does.
      let everReady = false;
      client = createClient({
        url,
        disableOfflineQueue: true,
        socket: {
          connectTimeout: CONNECT_TIMEOUT_MS,
          // Keep reconnecting a connection that worked; give up on the first
          // attempt instead, or connect() would never settle while Redis is
          // down and every request waiting on it would hang.
          reconnectStrategy: (retries) => (everReady ? Math.min(250 * (retries + 1), 3_000) : false),
        },
      });
      let lastError = "";
      client.on("error", (error: Error) => {
        if (error.message !== lastError) console.warn("Redis error:", error.message);
        lastError = error.message;
      });
      client.on("ready", () => {
        everReady = true;
        lastError = "";
      });
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          client.connect(),
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error("connect timed out")), CONNECT_TIMEOUT_MS + 500);
          }),
        ]);
      } finally {
        clearTimeout(timer);
      }
      state.client = client;
      return client;
    } catch (error) {
      console.warn("Redis unavailable, using in-process state:", error instanceof Error ? error.message : error);
      state.unavailableUntil = Date.now() + RETRY_CONNECT_AFTER_MS;
      try {
        client?.destroy();
      } catch {
        // Already closed by the failed connect.
      }
      return null;
    } finally {
      state.connecting = null;
    }
  })();
  return state.connecting;
}

/** Runs `op` against Redis, or `fallback` against memory when Redis can't answer. */
async function withRedis<T>(op: (redis: RedisClient) => Promise<T>, fallback: () => T): Promise<T> {
  const redis = await getRedis();
  if (!redis) return fallback();
  try {
    return await op(redis);
  } catch (error) {
    console.warn("Redis command failed, using in-process state:", error instanceof Error ? error.message : error);
    return fallback();
  }
}

// ---- In-process fallback ----

const memory = new Map<string, { value: string; expiresAt: number }>();

function memoryGet(key: string): string | null {
  const entry = memory.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    memory.delete(key);
    return null;
  }
  return entry.value;
}

function memorySet(key: string, value: string, ttlMs: number, onlyIfAbsent = false): boolean {
  if (onlyIfAbsent && memoryGet(key) !== null) return false;
  if (memory.size > 1_000) {
    const now = Date.now();
    for (const [k, entry] of memory) if (entry.expiresAt <= now) memory.delete(k);
  }
  memory.set(key, { value, expiresAt: Date.now() + ttlMs });
  return true;
}

// ---- API ----

/**
 * Takes the named lock for up to `ttlMs` (it expires on its own if the holder
 * crashes). Returns a token to release it with, or null if someone holds it.
 */
export function tryLock(name: string, ttlMs: number): Promise<string | null> {
  const key = KEY_PREFIX + name;
  const token = randomUUID();
  return withRedis(
    async (redis) => ((await redis.set(key, token, { condition: "NX", expiration: { type: "PX", value: ttlMs } })) === "OK" ? token : null),
    () => (memorySet(key, token, ttlMs, true) ? token : null),
  );
}

const RELEASE_SCRIPT = `if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end`;

/** Releases a lock taken by tryLock, unless it already expired and was taken by someone else. */
export async function unlock(name: string, token: string): Promise<void> {
  const key = KEY_PREFIX + name;
  await withRedis(
    async (redis) => { await redis.eval(RELEASE_SCRIPT, { keys: [key], arguments: [token] }); },
    () => { if (memoryGet(key) === token) memory.delete(key); },
  );
}

/** Marks `name` for `ttlMs`, e.g. to start a cooldown. */
export async function setFlag(name: string, ttlMs: number): Promise<void> {
  await setCached(name, "1", ttlMs);
}

/** How long `name` stays set, in ms; 0 when it isn't. */
export function remainingMs(name: string): Promise<number> {
  const key = KEY_PREFIX + name;
  return withRedis(
    async (redis) => Math.max(0, await redis.pTTL(key)),
    () => {
      const entry = memory.get(key);
      return entry && memoryGet(key) !== null ? Math.max(0, entry.expiresAt - Date.now()) : 0;
    },
  );
}

export function getCached(name: string): Promise<string | null> {
  const key = KEY_PREFIX + name;
  return withRedis(async (redis) => (await redis.get(key)) ?? null, () => memoryGet(key));
}

export async function setCached(name: string, value: string, ttlMs: number): Promise<void> {
  const key = KEY_PREFIX + name;
  await withRedis(
    async (redis) => { await redis.set(key, value, { expiration: { type: "PX", value: ttlMs } }); },
    () => { memorySet(key, value, ttlMs); },
  );
}

/** Closes the Redis connection, e.g. so a script or test can exit. */
export async function closeSharedState(): Promise<void> {
  const client = state.client;
  state.client = null;
  if (client) await client.close().catch(() => client.destroy());
}
