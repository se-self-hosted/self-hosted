/**
 * Turns stored transcript segments into compact, speaker-labelled text an LLM
 * can summarize, and decides up front whether there is anything worth
 * summarizing at all — so empty or junk transcripts never reach the AI call.
 */

export type TranscriptInputSegment = {
  speakerName?: string | null;
  startTime: number;
  endTime?: number | null;
  spokenAt?: string | Date | null;
  text: unknown;
  confidence?: number | null;
};

export type PrepareTranscriptOptions = {
  /**
   * Segments below this confidence are dropped. Defaults to 0 (disabled)
   * because the browser recognizer often omits confidence and we persist
   * that as 0, so a real threshold would throw away genuine speech.
   */
  minConfidence?: number;
  /** Minimum letters/digits across the whole transcript to be summarizable. */
  minContentChars?: number;
  /** Consecutive lines from one speaker closer than this are merged. */
  mergeGapSeconds?: number;
  /** Upper bound per chunk, so long meetings can be summarized in parts. */
  maxChunkChars?: number;
};

export type TranscriptStats = {
  inputSegments: number;
  keptSegments: number;
  invalidSegments: number;
  noiseSegments: number;
  duplicateSegments: number;
  lowConfidenceSegments: number;
  speakers: string[];
  contentChars: number;
  durationSeconds: number;
};

export type TranscriptRejectionReason = "EMPTY" | "INVALID" | "TOO_SHORT";

export type PreparedTranscript =
  | {
      ok: true;
      /** Whole transcript, one `[mm:ss] Speaker: text` line per turn. */
      text: string;
      /** `text` split on line boundaries into pieces of at most maxChunkChars. */
      chunks: string[];
      stats: TranscriptStats;
    }
  | {
      ok: false;
      reason: TranscriptRejectionReason;
      message: string;
      stats: TranscriptStats;
    };

const DEFAULTS = {
  minConfidence: 0,
  minContentChars: 20,
  mergeGapSeconds: 10,
  maxChunkChars: 24_000,
} satisfies Required<PrepareTranscriptOptions>;

const ZERO_WIDTH = /[​-‍⁠﻿]/g;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const CONTENT_CHAR = /[\p{L}\p{N}]/gu;

export function sanitizeTranscriptText(value: string): string {
  return value
    .replace(ZERO_WIDTH, "")
    .replace(CONTROL_CHARS, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Counts letters and digits; works for Thai, which has no word spaces. */
export function countContentChars(value: string): number {
  return value.match(CONTENT_CHAR)?.length ?? 0;
}

export function formatTimestamp(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

type Turn = { speaker: string; startTime: number; endTime: number; texts: string[] };

export function prepareTranscriptForAI(
  segments: readonly TranscriptInputSegment[] | null | undefined,
  options: PrepareTranscriptOptions = {},
): PreparedTranscript {
  const opts = { ...DEFAULTS, ...options };
  // A non-positive or non-numeric chunk size would never advance chunkLines.
  if (!(opts.maxChunkChars >= 1)) opts.maxChunkChars = DEFAULTS.maxChunkChars;
  opts.maxChunkChars = Math.floor(opts.maxChunkChars);
  const input = Array.isArray(segments) ? segments : [];
  const stats: TranscriptStats = {
    inputSegments: input.length,
    keptSegments: 0,
    invalidSegments: 0,
    noiseSegments: 0,
    duplicateSegments: 0,
    lowConfidenceSegments: 0,
    speakers: [],
    contentChars: 0,
    durationSeconds: 0,
  };

  if (input.length === 0) {
    return reject("EMPTY", "The meeting has no transcript to summarize.", stats);
  }

  const cleaned = input
    .flatMap((segment) => {
      if (
        !segment ||
        typeof segment.text !== "string" ||
        typeof segment.startTime !== "number" ||
        !Number.isFinite(segment.startTime)
      ) {
        stats.invalidSegments++;
        return [];
      }
      const confidence = segment.confidence ?? 0;
      if (opts.minConfidence > 0 && confidence < opts.minConfidence) {
        stats.lowConfidenceSegments++;
        return [];
      }
      const text = sanitizeTranscriptText(segment.text);
      if (countContentChars(text) === 0) {
        stats.noiseSegments++;
        return [];
      }
      const startTime = Math.max(0, segment.startTime);
      const endTime =
        typeof segment.endTime === "number" && Number.isFinite(segment.endTime)
          ? Math.max(startTime, segment.endTime)
          : startTime;
      const speaker = sanitizeTranscriptText(segment.speakerName ?? "") || "Unknown";
      const spokenAt = segment.spokenAt ? new Date(segment.spokenAt).getTime() : 0;
      return [{ speaker, text, startTime, endTime, spokenAt: Number.isNaN(spokenAt) ? 0 : spokenAt }];
    })
    .sort((a, b) => a.startTime - b.startTime || a.spokenAt - b.spokenAt);

  const turns: Turn[] = [];
  for (const segment of cleaned) {
    const last = turns.at(-1);
    if (last && last.speaker === segment.speaker) {
      // The recognizer can re-emit the same final result after a reconnect.
      if (last.texts.at(-1) === segment.text) {
        stats.duplicateSegments++;
        continue;
      }
      if (segment.startTime - last.endTime <= opts.mergeGapSeconds) {
        last.texts.push(segment.text);
        last.endTime = Math.max(last.endTime, segment.endTime);
        stats.keptSegments++;
        continue;
      }
    }
    turns.push({ speaker: segment.speaker, startTime: segment.startTime, endTime: segment.endTime, texts: [segment.text] });
    stats.keptSegments++;
  }

  if (turns.length === 0) {
    return reject("INVALID", "The transcript contains no usable speech.", stats);
  }

  const lines = turns.map((turn) => `[${formatTimestamp(turn.startTime)}] ${turn.speaker}: ${turn.texts.join(" ")}`);
  stats.speakers = [...new Set(turns.map((turn) => turn.speaker))];
  stats.contentChars = turns.reduce((sum, turn) => sum + turn.texts.reduce((n, t) => n + countContentChars(t), 0), 0);
  stats.durationSeconds = Math.round(turns.at(-1)!.endTime - turns[0].startTime);

  if (stats.contentChars < opts.minContentChars) {
    return reject("TOO_SHORT", "The transcript is too short to summarize.", stats);
  }

  return { ok: true, text: lines.join("\n"), chunks: chunkLines(lines, opts.maxChunkChars), stats };
}

function reject(reason: TranscriptRejectionReason, message: string, stats: TranscriptStats): PreparedTranscript {
  return { ok: false, reason, message, stats };
}

function chunkLines(lines: string[], maxChars: number): string[] {
  const chunks: string[] = [];
  let current = "";
  for (const line of lines) {
    for (let i = 0; i < line.length; i += maxChars) {
      const piece = line.slice(i, i + maxChars);
      const next = current ? `${current}\n${piece}` : piece;
      if (next.length > maxChars && current) {
        chunks.push(current);
        current = piece;
      } else {
        current = next;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}
