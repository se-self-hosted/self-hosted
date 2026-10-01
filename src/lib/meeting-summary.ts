import { prisma } from "@/lib/db";
import {
  prepareTranscriptForAI,
  type PrepareTranscriptOptions,
  type TranscriptRejectionReason,
  type TranscriptStats,
} from "@/features/ai-summary/lib/prepare-transcript";
import { normalizeGeneratedSummary } from "@/features/ai-summary/lib/summary-output";
import { SummaryAIError, type SummaryAIErrorCode } from "@/features/ai-summary/lib/openai-summary";

export type SummaryGeneratorInput = {
  meetingId: string;
  language: string;
  text: string;
  chunks: string[];
  stats: TranscriptStats;
};

/** The LLM call itself; injected so it can be swapped or stubbed in tests. */
export type SummaryGenerator = (input: SummaryGeneratorInput) => Promise<{ summary: string; model: string }>;

export type SummarizeMeetingResult =
  | { status: "saved"; summary: Awaited<ReturnType<typeof saveGeneratedSummary>> }
  | { status: "not_found" }
  | { status: "rejected"; reason: TranscriptRejectionReason; message: string; stats: TranscriptStats }
  | { status: "invalid_output"; reason: "EMPTY_OUTPUT" | "INVALID_OUTPUT"; message: string }
  | { status: "ai_error"; code: SummaryAIErrorCode; message: string; retryable: boolean };

export async function loadTranscriptForSummary(meetingId: string) {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: {
      id: true,
      transcript: {
        select: {
          language: true,
          segments: {
            orderBy: [{ startTime: "asc" }, { spokenAt: "asc" }],
            select: {
              startTime: true,
              endTime: true,
              spokenAt: true,
              text: true,
              confidence: true,
              participant: { select: { displayName: true } },
            },
          },
        },
      },
    },
  });
  if (!meeting) return null;

  return {
    language: meeting.transcript?.language ?? "th",
    segments: (meeting.transcript?.segments ?? []).map(({ participant, ...segment }) => ({
      ...segment,
      speakerName: participant.displayName,
    })),
  };
}

/**
 * Stores a freshly generated AI summary. A regeneration keeps the host's
 * edited version unless `discardEdits` is set, so edits are never lost silently.
 */
export async function saveGeneratedSummary(
  meetingId: string,
  { summary, model }: { summary: string; model: string },
  { discardEdits = false }: { discardEdits?: boolean } = {},
) {
  const generatedAt = new Date();
  return prisma.meetingSummary.upsert({
    where: { meetingId },
    create: { meetingId, aiSummary: summary, llmModel: model, generatedAt },
    update: {
      aiSummary: summary,
      llmModel: model,
      generatedAt,
      ...(discardEdits ? { editedSummary: null, editedAt: null } : {}),
    },
  });
}

/**
 * Loads, validates and prepares the transcript, and only calls the generator
 * when there is real content. Nothing is written for a rejected transcript,
 * a failed AI call or unusable AI output, so an existing summary is left intact.
 */
export async function summarizeMeeting(
  meetingId: string,
  generate: SummaryGenerator,
  options: PrepareTranscriptOptions & { discardEdits?: boolean } = {},
): Promise<SummarizeMeetingResult> {
  const source = await loadTranscriptForSummary(meetingId);
  if (!source) return { status: "not_found" };

  const prepared = prepareTranscriptForAI(source.segments, options);
  if (!prepared.ok) {
    return { status: "rejected", reason: prepared.reason, message: prepared.message, stats: prepared.stats };
  }

  let generated: { summary: string; model: string };
  try {
    generated = await generate({
      meetingId,
      language: source.language,
      text: prepared.text,
      chunks: prepared.chunks,
      stats: prepared.stats,
    });
  } catch (error) {
    if (error instanceof SummaryAIError) {
      return { status: "ai_error", code: error.code, message: error.message, retryable: error.retryable };
    }
    console.error("Meeting summary generator failed:", error);
    return { status: "ai_error", code: "AI_UNAVAILABLE", message: "The summary generator failed.", retryable: true };
  }
  const { summary, model } = generated;

  const normalized = normalizeGeneratedSummary(summary);
  if (!normalized.ok) {
    return { status: "invalid_output", reason: normalized.reason, message: normalized.message };
  }

  const saved = await saveGeneratedSummary(
    meetingId,
    { summary: normalized.text, model },
    { discardEdits: options.discardEdits },
  );
  return { status: "saved", summary: saved };
}
