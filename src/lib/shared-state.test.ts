import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { closeSharedState, getCached, remainingMs, setCached, setFlag, tryLock, unlock } from "./shared-state.ts";

// Runs against Redis when REDIS_URL is set, and against the in-process
// fallback otherwise; both must behave the same.
const unique = () => `test:${process.pid}:${Math.random().toString(36).slice(2)}`;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test("a lock has one holder until released", async () => {
  const name = unique();
  const token = await tryLock(name, 5_000);
  assert.ok(token);
  assert.equal(await tryLock(name, 5_000), null);
  await unlock(name, token);
  const next = await tryLock(name, 5_000);
  assert.ok(next);
  await unlock(name, next);
});

test("a lock expires on its own", async () => {
  const name = unique();
  assert.ok(await tryLock(name, 50));
  await sleep(120);
  const token = await tryLock(name, 5_000);
  assert.ok(token);
  await unlock(name, token);
});

test("an expired holder can't release the next holder's lock", async () => {
  const name = unique();
  const stale = await tryLock(name, 50);
  await sleep(120);
  const current = await tryLock(name, 5_000);
  await unlock(name, stale!);
  assert.equal(await tryLock(name, 5_000), null, "still held by the current holder");
  await unlock(name, current!);
});

test("flags report the time left, then clear", async () => {
  const name = unique();
  assert.equal(await remainingMs(name), 0);
  await setFlag(name, 1_000);
  const left = await remainingMs(name);
  assert.ok(left > 500 && left <= 1_000, String(left));
  await setFlag(name, 50);
  await sleep(120);
  assert.equal(await remainingMs(name), 0);
});

test("cached values expire", async () => {
  const name = unique();
  assert.equal(await getCached(name), null);
  await setCached(name, '{"a":1}', 80);
  assert.equal(await getCached(name), '{"a":1}');
  await sleep(150);
  assert.equal(await getCached(name), null);
});

test.after(closeSharedState);
