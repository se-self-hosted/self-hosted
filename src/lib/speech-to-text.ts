/**
 * Server-side speech-to-text for live transcript lines. Talks to any
 * OpenAI-compatible `/audio/transcriptions` endpoint, so the same code serves
 * OpenAI (the default) or a self-hosted Whisper server such as speaches:
 *
 *   STT_BASE_URL  default https://api.openai.com/v1
 *   STT_API_KEY   default OPENAI_API_KEY (a self-hosted server may need none)
 *   STT_MODEL     default gpt-4o-mini-transcribe
 *   STT_PROMPT    optional vocabulary hint, replacing the default below
 */

export const DEFAULT_STT_BASE_URL = "https://api.openai.com/v1";
export const DEFAULT_STT_MODEL = "gpt-4o-mini-transcribe";

/**
 * Prior-text hint: tells the model the meeting mixes Thai with English terms,
 * so "AI Summary" is not respelled as similar-sounding Thai words.
 */
export const DEFAULT_STT_PROMPT =
  "บทสนทนาในการประชุมภาษาไทย มีคำศัพท์ภาษาอังกฤษปนอยู่ เช่น AI Summary, transcript, meeting, LiveKit, API, deploy";

export type SpeechToTextErrorCode =
  | "STT_NOT_CONFIGURED"
  | "STT_AUTH_FAILED"
  | "STT_RATE_LIMITED"
  | "STT_UNAVAILABLE"
  | "STT_REJECTED";

export class SpeechToTextError extends Error {
  readonly code: SpeechToTextErrorCode;
  readonly retryable: boolean;

  constructor(code: SpeechToTextErrorCode, message: string, retryable = false) {
    super(message);
    this.name = "SpeechToTextError";
    this.code = code;
    this.retryable = retryable;
  }
}

export type SpeechToTextConfig = {
  baseUrl: string;
  apiKey?: string;
  model: string;
  prompt: string;
};

export function speechToTextConfigFromEnv(env: Record<string, string | undefined> = process.env): SpeechToTextConfig | null {
  const baseUrl = (env.STT_BASE_URL || DEFAULT_STT_BASE_URL).replace(/\/+$/, "");
  const apiKey = env.STT_API_KEY || env.OPENAI_API_KEY || undefined;
  // OpenAI always needs a key; a self-hosted server on its own URL may not.
  if (!apiKey && baseUrl === DEFAULT_STT_BASE_URL) return null;
  return {
    baseUrl,
    apiKey,
    model: env.STT_MODEL || DEFAULT_STT_MODEL,
    prompt: env.STT_PROMPT ?? DEFAULT_STT_PROMPT,
  };
}

export async function transcribeAudio(
  audio: Blob,
  config: SpeechToTextConfig | null,
  { language = "th", fetch: fetchImpl = globalThis.fetch, timeoutMs = 30_000 }: {
    language?: string;
    fetch?: typeof fetch;
    timeoutMs?: number;
  } = {},
): Promise<string> {
  if (!config) {
    throw new SpeechToTextError("STT_NOT_CONFIGURED", "Neither STT_API_KEY nor OPENAI_API_KEY is set.");
  }

  const form = new FormData();
  form.append("file", audio, "speech.wav");
  form.append("model", config.model);
  form.append("language", language);
  form.append("response_format", "json");
  if (config.prompt) form.append("prompt", config.prompt);

  let response: Response;
  try {
    response = await fetchImpl(`${config.baseUrl}/audio/transcriptions`, {
      method: "POST",
      headers: config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : undefined,
      body: form,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    throw new SpeechToTextError("STT_UNAVAILABLE", `Could not reach the STT server: ${(error as Error)?.message ?? error}`, true);
  }

  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as { error?: { message?: unknown } };
      if (typeof body?.error?.message === "string") detail = `: ${body.error.message}`;
    } catch {
      // Non-JSON error body; the status alone decides.
    }
    const message = `STT server responded ${response.status}${detail}`;
    if (response.status === 401 || response.status === 403) throw new SpeechToTextError("STT_AUTH_FAILED", message);
    if (response.status === 429) throw new SpeechToTextError("STT_RATE_LIMITED", message, true);
    if (response.status >= 500 || response.status === 408) throw new SpeechToTextError("STT_UNAVAILABLE", message, true);
    throw new SpeechToTextError("STT_REJECTED", message);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new SpeechToTextError("STT_UNAVAILABLE", "The STT server returned a response that is not JSON.", true);
  }
  const text = (body as { text?: unknown })?.text;
  return dropPromptEcho(typeof text === "string" ? text.trim() : "", config.prompt);
}

/**
 * On near-silent audio the model can answer with the prompt itself, which
 * would show up as a line nobody said.
 */
function dropPromptEcho(text: string, prompt: string) {
  if (!text || !prompt) return text;
  const normalize = (value: string) => value.replace(/[\s.,!?…]+/g, "").toLowerCase();
  const spoken = normalize(text);
  return spoken && normalize(prompt).includes(spoken) && spoken.length >= 8 ? "" : text;
}

/** HTTP status the transcribe API answers with for each STT failure. */
export function httpStatusForSpeechToTextError(code: SpeechToTextErrorCode): number {
  switch (code) {
    case "STT_NOT_CONFIGURED":
    case "STT_UNAVAILABLE":
      return 503;
    case "STT_RATE_LIMITED":
      return 429;
    default:
      return 502;
  }
}
