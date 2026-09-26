/** Validates raw LLM output before it is stored as a meeting summary. */

export type NormalizedSummary =
  | { ok: true; text: string }
  | { ok: false; reason: "EMPTY_OUTPUT" | "INVALID_OUTPUT"; message: string };

export const MAX_SUMMARY_CHARS = 20_000;

export function normalizeGeneratedSummary(raw: unknown, maxChars = MAX_SUMMARY_CHARS): NormalizedSummary {
  if (typeof raw !== "string") {
    return { ok: false, reason: "INVALID_OUTPUT", message: "The AI returned no summary text." };
  }

  // Models sometimes wrap the whole answer in a ```markdown fence.
  const fenced = raw.trim().match(/^```[\w-]*\n([\s\S]*?)\n?```$/);
  const text = (fenced ? fenced[1] : raw).replace(/\r\n/g, "\n").trim();

  if (text.length === 0) {
    return { ok: false, reason: "EMPTY_OUTPUT", message: "The AI returned an empty summary." };
  }
  if (text.length > maxChars) {
    return { ok: false, reason: "INVALID_OUTPUT", message: "The AI summary exceeds the maximum length." };
  }
  return { ok: true, text };
}
