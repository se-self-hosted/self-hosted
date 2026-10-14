import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { createTranscriptionQueue } from "./server-transcription.ts";

const utterance = (startTime: number) => ({ samples: new Float32Array(320), startTime, duration: 1 });
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

function setup(responses: (Response | Error)[]) {
  const finals: [string, number][] = [];
  const statuses: [string, boolean | undefined][] = [];
  const pending: boolean[] = [];
  let unavailable = 0;
  let calls = 0;
  const queue = createTranscriptionQueue({
    transcribe: async () => {
      const next = responses[calls++] ?? json(200, { text: "" });
      if (next instanceof Error) throw next;
      return next;
    },
    onFinal: (text: string, start: number) => finals.push([text, start]),
    onPending: (value: boolean) => pending.push(value),
    onStatus: (message: string, isError?: boolean) => statuses.push([message, isError]),
    onUnavailable: () => { unavailable += 1; },
    wait: async () => {},
  });
  return { queue, finals, statuses, pending, unavailable: () => unavailable, calls: () => calls };
}

test("sends utterances in order and reports each line with its start time", async () => {
  const ctx = setup([json(200, { text: "สวัสดี" }), json(200, { text: "ครับ" })]);
  ctx.queue.enqueue(utterance(1));
  ctx.queue.enqueue(utterance(3));
  await settle();
  await settle();
  assert.deepEqual(ctx.finals, [["สวัสดี", 1], ["ครับ", 3]]);
  assert.deepEqual(ctx.pending, [true, false]);
});

test("skips empty text without a line", async () => {
  const ctx = setup([json(200, { text: "  " })]);
  ctx.queue.enqueue(utterance(1));
  await settle();
  assert.deepEqual(ctx.finals, []);
});

test("retries network failures and server errors", async () => {
  const ctx = setup([new TypeError("offline"), json(503, { code: "STT_UNAVAILABLE" }), json(200, { text: "ok" })]);
  ctx.queue.enqueue(utterance(1));
  for (let index = 0; index < 5; index += 1) await settle();
  assert.equal(ctx.calls(), 3);
  assert.deepEqual(ctx.finals, [["ok", 1]]);
});

test("gives up after the retries with a visible error", async () => {
  const ctx = setup([json(500, {}), json(500, {}), json(500, {})]);
  ctx.queue.enqueue(utterance(1));
  for (let index = 0; index < 5; index += 1) await settle();
  assert.equal(ctx.calls(), 3);
  assert.equal(ctx.statuses.at(-1)?.[1], true);
});

test("does not retry a rejected upload", async () => {
  const ctx = setup([json(413, { error: "Audio is too long" })]);
  ctx.queue.enqueue(utterance(1));
  await settle();
  assert.equal(ctx.calls(), 1);
});

test("an unconfigured server asks the caller to fall back and stops sending", async () => {
  const ctx = setup([json(503, { code: "STT_NOT_CONFIGURED" })]);
  ctx.queue.enqueue(utterance(1));
  ctx.queue.enqueue(utterance(2));
  await settle();
  ctx.queue.enqueue(utterance(3));
  await settle();
  assert.equal(ctx.unavailable(), 1);
  assert.equal(ctx.calls(), 1);
});
