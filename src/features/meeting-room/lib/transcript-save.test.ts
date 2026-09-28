import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { saveTranscriptSegment } from "./transcript-save.ts";

const noWait = async () => {};

function sender(outcomes: (number | Error)[]) {
  const calls: number[] = [];
  const send = async () => {
    const outcome = outcomes[calls.length];
    calls.push(calls.length);
    if (outcome instanceof Error) throw outcome;
    return new Response(null, { status: outcome });
  };
  return { send, calls };
}

test("saves on the first successful response", async () => {
  const { send, calls } = sender([201]);
  assert.equal(await saveTranscriptSegment(send, noWait), true);
  assert.equal(calls.length, 1);
});

test("retries network errors, server errors and stale-session 403s", async () => {
  const { send, calls } = sender([new TypeError("offline"), 500, 403, 201]);
  assert.equal(await saveTranscriptSegment(send, noWait), true);
  assert.equal(calls.length, 4);
});

test("does not retry failures a retry cannot fix", async () => {
  for (const status of [400, 404, 409]) {
    const { send, calls } = sender([status, 201]);
    assert.equal(await saveTranscriptSegment(send, noWait), false);
    assert.equal(calls.length, 1);
  }
});

test("gives up after the last retry with backing-off delays", async () => {
  const delays: number[] = [];
  const { send, calls } = sender(Array(10).fill(503));
  const saved = await saveTranscriptSegment(send, async (ms) => {
    delays.push(ms);
  });
  assert.equal(saved, false);
  assert.equal(calls.length, 6);
  assert.deepEqual(delays, [1000, 2000, 4000, 8000, 16000]);
});
