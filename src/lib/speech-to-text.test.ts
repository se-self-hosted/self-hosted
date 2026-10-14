import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_STT_MODEL,
  SpeechToTextError,
  speechToTextConfigFromEnv,
  transcribeAudio,
  // @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
} from "./speech-to-text.ts";

const audio = new Blob([new Uint8Array(100)], { type: "audio/wav" });
const config = { baseUrl: "https://stt.example/v1", apiKey: "key", model: "m", prompt: "บทสนทนาในการประชุม AI Summary" };

test("config defaults to OpenAI with the summary key", () => {
  const result = speechToTextConfigFromEnv({ OPENAI_API_KEY: "sk-1" });
  assert.equal(result?.baseUrl, "https://api.openai.com/v1");
  assert.equal(result?.apiKey, "sk-1");
  assert.equal(result?.model, DEFAULT_STT_MODEL);
});

test("config is missing without a key for OpenAI, but a self-hosted server needs none", () => {
  assert.equal(speechToTextConfigFromEnv({}), null);
  const local = speechToTextConfigFromEnv({ STT_BASE_URL: "http://stt:8000/v1/", STT_MODEL: "whisper-th" });
  assert.equal(local?.baseUrl, "http://stt:8000/v1");
  assert.equal(local?.apiKey, undefined);
  assert.equal(local?.model, "whisper-th");
});

test("posts the audio as multipart and returns the trimmed text", async () => {
  let url = "";
  let init: RequestInit | undefined;
  const text = await transcribeAudio(audio, config, {
    fetch: (async (input: string, options: RequestInit) => {
      url = input;
      init = options;
      return new Response(JSON.stringify({ text: " สวัสดีครับ " }));
    }) as unknown as typeof fetch,
  });
  assert.equal(text, "สวัสดีครับ");
  assert.equal(url, "https://stt.example/v1/audio/transcriptions");
  assert.equal((init?.headers as Record<string, string>).Authorization, "Bearer key");
  const form = init?.body as FormData;
  assert.equal(form.get("model"), "m");
  assert.equal(form.get("language"), "th");
  assert.ok(form.get("file") instanceof Blob);
});

test("drops the prompt echoed back for near-silent audio", async () => {
  const text = await transcribeAudio(audio, config, {
    fetch: (async () => new Response(JSON.stringify({ text: "บทสนทนาในการประชุม" }))) as unknown as typeof fetch,
  });
  assert.equal(text, "");
});

test("maps provider failures to codes", async () => {
  const failWith = (status: number) => transcribeAudio(audio, config, {
    fetch: (async () => new Response("{}", { status })) as unknown as typeof fetch,
  });
  await assert.rejects(failWith(401), (error: SpeechToTextError) => error.code === "STT_AUTH_FAILED" && !error.retryable);
  await assert.rejects(failWith(429), (error: SpeechToTextError) => error.code === "STT_RATE_LIMITED" && error.retryable);
  await assert.rejects(failWith(500), (error: SpeechToTextError) => error.code === "STT_UNAVAILABLE");
  await assert.rejects(failWith(400), (error: SpeechToTextError) => error.code === "STT_REJECTED");
  await assert.rejects(transcribeAudio(audio, null), (error: SpeechToTextError) => error.code === "STT_NOT_CONFIGURED");
});
