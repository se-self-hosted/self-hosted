/** Validates raw LLM output before it is stored as a meeting summary. */

export type NormalizedSummary =
  | { ok: true; text: string }
  | { ok: false; reason: "EMPTY_OUTPUT" | "INVALID_OUTPUT"; message: string };

export const MAX_SUMMARY_CHARS = 20_000;

export function normalizeGeneratedSummary(raw: unknown, maxChars = MAX_SUMMARY_CHARS): NormalizedSummary {
  if (typeof raw !== "string") {
    return { ok: false, reason: "INVALID_OUTPUT", message: "The AI returned no summary text." };
  }

  // Models sometimes wrap the whole answer in a ```markdown fence. Normalize
  // line endings first so a CRLF fence is recognized, and only unwrap when the
  // body has no fences of its own (otherwise it is several code blocks).
  const normalized = raw.replace(/\r\n?/g, "\n").trim();
  const fenced = normalized.match(/^```[\w-]*\n([\s\S]*?)\n?```$/);
  const unwrap = fenced && !/^```/m.test(fenced[1]);
  const text = (unwrap ? fenced[1] : normalized).trim();

  if (text.length === 0) {
    return { ok: false, reason: "EMPTY_OUTPUT", message: "The AI returned an empty summary." };
  }
  if (text.length > maxChars) {
    return { ok: false, reason: "INVALID_OUTPUT", message: "The AI summary exceeds the maximum length." };
  }
  return { ok: true, text };
}

export type NormalizedEditedSummary =
  | { ok: true; text: string }
  | { ok: false; reason: "EMPTY" | "TOO_LONG"; message: string };

/** Validates a host-edited summary; the same length limit as generated output applies. */
export function normalizeEditedSummary(raw: string, maxChars = MAX_SUMMARY_CHARS): NormalizedEditedSummary {
  const text = raw.replace(/\r\n?/g, "\n").trim();
  if (text.length === 0) {
    return { ok: false, reason: "EMPTY", message: "The edited summary is empty." };
  }
  if (text.length > maxChars) {
    return { ok: false, reason: "TOO_LONG", message: "The edited summary exceeds the maximum length." };
  }
  return { ok: true, text };
}
