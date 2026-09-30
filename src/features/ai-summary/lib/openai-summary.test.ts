import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { createOpenAISummaryGenerator, httpStatusForSummaryAIError, parseRetryAfter, SummaryAIError } from "./openai-summary.ts";

type Call = { url: string; body: { model: string; messages: { role: string; content: string }[] } };

function completion(content: string, finishReason = "stop", model = "gpt-4o-mini-2024-07-18") {
  return new Response(JSON.stringify({ model, choices: [{ message: { content }, finish_reason: finishReason }] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function errorResponse(status: number, code = "", headers: Record<string, string> = {}) {
  return new Response(JSON.stringify({ error: { code, message: `error ${status}` } }), { status, headers });
}

/** A fetch stub answering each call with the next queued response (or thrower). */
function fakeFetch(queue: (Response | (() => never))[]) {
  const calls: Call[] = [];
  const impl = (async (url: string, init: RequestInit) => {
    calls.push({ url, body: JSON.parse(String(init.body)) });
    const next = queue.shift();
    if (!next) throw new Error("unexpected extra fetch");
    return typeof next === "function" ? next() : next;
  }) as unknown as typeof fetch;
  return { impl, calls };
}

function generator(fetchImpl: typeof fetch, sleeps: number[] = [], overrides = {}) {
  return createOpenAISummaryGenerator({
    apiKey: "sk-test",
    fetch: fetchImpl,
    baseDelayMs: 10,
    sleep: async (ms: number) => {
      sleeps.push(ms);
    },
    ...overrides,
  });
}

const input = { language: "th", text: "[00:01] A: สวัสดี", chunks: ["[00:01] A: สวัสดี"] };

async function rejectsWith(promise: Promise<unknown>, code: string) {
  await assert.rejects(promise, (error: unknown) => {
    assert.ok(error instanceof SummaryAIError);
    assert.equal(error.code, code);
    return true;
  });
}

test("summarizes a single-chunk transcript with gpt-4o-mini and reports the served model", async () => {
  const { impl, calls } = fakeFetch([completion("## ภาพรวม\n- ok")]);
  const result = await generator(impl)(input);

  assert.deepEqual(result, { summary: "## ภาพรวม\n- ok", model: "gpt-4o-mini-2024-07-18" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.openai.com/v1/chat/completions");
  assert.equal(calls[0].body.model, "gpt-4o-mini");
  assert.match(calls[0].body.messages[1].content, /Thai/);
  assert.match(calls[0].body.messages[1].content, /สวัสดี/);
});

test("summarizes each chunk, then merges the notes into one summary", async () => {
  const { impl, calls } = fakeFetch([completion("notes 1"), completion("notes 2"), completion("final")]);
  const result = await generator(impl)({ ...input, chunks: ["part A", "part B"] });

  assert.equal(result.summary, "final");
  assert.equal(calls.length, 3);
  assert.match(calls[0].body.messages[1].content, /part 1 of 2[\s\S]*part A/);
  assert.match(calls[1].body.messages[1].content, /part 2 of 2[\s\S]*part B/);
  assert.match(calls[2].body.messages[1].content, /notes 1[\s\S]*notes 2/);
});

test("retries a rate limit, honouring Retry-After, then succeeds", async () => {
  const sleeps: number[] = [];
  const { impl, calls } = fakeFetch([errorResponse(429, "rate_limit_exceeded", { "retry-after": "3" }), completion("ok")]);
  const result = await generator(impl, sleeps)(input);

  assert.equal(result.summary, "ok");
  assert.equal(calls.length, 2);
  assert.deepEqual(sleeps, [3000]);
});

test("retries server errors up to maxRetries, then reports AI_UNAVAILABLE", async () => {
  const sleeps: number[] = [];
  const { impl, calls } = fakeFetch([errorResponse(500), errorResponse(502), errorResponse(503)]);

  await rejectsWith(generator(impl, sleeps)(input), "AI_UNAVAILABLE");
  assert.equal(calls.length, 3);
  assert.equal(sleeps.length, 2);
});

test("does not retry an exhausted quota or a rejected API key", async () => {
  const quota = fakeFetch([errorResponse(429, "insufficient_quota")]);
  await rejectsWith(generator(quota.impl)(input), "AI_QUOTA_EXCEEDED");
  assert.equal(quota.calls.length, 1);

  const auth = fakeFetch([errorResponse(401, "invalid_api_key")]);
  await rejectsWith(generator(auth.impl)(input), "AI_AUTH_FAILED");
  assert.equal(auth.calls.length, 1);
});

test("maps a request timeout to AI_TIMEOUT after retrying", async () => {
  const timeout = () => {
    throw Object.assign(new Error("timed out"), { name: "TimeoutError" });
  };
  const { impl, calls } = fakeFetch([timeout, timeout]);

  await rejectsWith(generator(impl, [], { maxRetries: 1 })(input), "AI_TIMEOUT");
  assert.equal(calls.length, 2);
});

test("maps a network failure to AI_UNAVAILABLE", async () => {
  const offline = () => {
    throw new TypeError("fetch failed");
  };
  await rejectsWith(generator(fakeFetch([offline]).impl, [], { maxRetries: 0 })(input), "AI_UNAVAILABLE");
});

test("rejects filtered, truncated and empty completions without retrying", async () => {
  await rejectsWith(generator(fakeFetch([completion("x", "content_filter")]).impl)(input), "AI_CONTENT_FILTERED");
  await rejectsWith(generator(fakeFetch([completion("x", "length")]).impl)(input), "AI_OUTPUT_TRUNCATED");
  await rejectsWith(generator(fakeFetch([completion("   ")]).impl)(input), "AI_BAD_RESPONSE");
});

test("fails fast with AI_NOT_CONFIGURED when no API key is set", async () => {
  const { impl, calls } = fakeFetch([]);
  await rejectsWith(generator(impl, [], { apiKey: undefined })(input), "AI_NOT_CONFIGURED");
  assert.equal(calls.length, 0);
});

test("parses Retry-After seconds and ignores garbage", () => {
  assert.equal(parseRetryAfter("2"), 2000);
  assert.equal(parseRetryAfter(null), undefined);
  assert.equal(parseRetryAfter("soon"), undefined);
});

test("maps AI error codes to HTTP statuses", () => {
  assert.equal(httpStatusForSummaryAIError("AI_RATE_LIMITED"), 429);
  assert.equal(httpStatusForSummaryAIError("AI_TIMEOUT"), 504);
  assert.equal(httpStatusForSummaryAIError("AI_NOT_CONFIGURED"), 503);
  assert.equal(httpStatusForSummaryAIError("AI_CONTENT_FILTERED"), 422);
  assert.equal(httpStatusForSummaryAIError("AI_AUTH_FAILED"), 502);
});

test("refuses a transcript with more chunks than maxChunks before calling OpenAI", async () => {
  const { impl, calls } = fakeFetch([]);
  await rejectsWith(
    generator(impl, [], { maxChunks: 2 })({ ...input, chunks: ["a", "b", "c"] }),
    "AI_INPUT_TOO_LARGE",
  );
  assert.equal(calls.length, 0);
  assert.equal(httpStatusForSummaryAIError("AI_INPUT_TOO_LARGE"), 413);
});
