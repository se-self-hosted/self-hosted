import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveMeetingAccess } from "@/lib/meeting-access";
import { saveEditedSummary, summarizeMeeting } from "@/lib/meeting-summary";
import {
  createOpenAISummaryGenerator,
  DEFAULT_SUMMARY_MODEL,
  httpStatusForSummaryAIError,
} from "@/features/ai-summary/lib/openai-summary";
import { normalizeEditedSummary } from "@/features/ai-summary/lib/summary-output";
import { remainingMs, setFlag, tryLock, unlock } from "@/lib/shared-state";

// Long transcripts are summarized in several sequential model calls.
export const maxDuration = 300;

const generateSummarySchema = z.object({
  /** Regenerating keeps the host's edited version unless this is set. */
  discardEdits: z.boolean().optional().default(false),
});

const editSummarySchema = z.object({
  /** The edited Markdown, or null to go back to the AI version. */
  editedSummary: z.string().nullable(),
  /** The version the edit was based on, for conflict detection. */
  baseGeneratedAt: z.iso.datetime(),
  baseEditedAt: z.iso.datetime().nullable(),
});

type StoredSummary = {
  id: string;
  aiSummary: string;
  editedSummary: string | null;
  llmModel: string;
  generatedAt: Date;
  editedAt: Date | null;
};

function serializeSummary(summary: StoredSummary) {
  return {
    id: summary.id,
    aiSummary: summary.aiSummary,
    editedSummary: summary.editedSummary,
    llmModel: summary.llmModel,
    generatedAt: summary.generatedAt,
    editedAt: summary.editedAt,
  };
}

/** An empty body reads as {}; anything else must be JSON. */
async function readJsonBody(req: Request): Promise<{ ok: true; json: unknown } | { ok: false }> {
  const rawBody = await req.text();
  if (!rawBody.trim()) return { ok: true, json: {} };
  try {
    return { ok: true, json: JSON.parse(rawBody) };
  } catch {
    return { ok: false };
  }
}

// One generation per meeting at a time, across every app instance, so a
// double click or a second tab doesn't pay for the same summary twice, and a
// pause between generations so a looping client can't run up the OpenAI bill.
const COOLDOWN_MS = 15_000;
// Outlives the longest request (maxDuration), so a crashed one frees it too.
const IN_FLIGHT_TTL_MS = (maxDuration + 60) * 1000;
const inFlightLock = (meetingId: string) => `summary:in-flight:${meetingId}`;
const cooldownFlag = (meetingId: string) => `summary:cooldown:${meetingId}`;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: meetingId } = await params;

  try {
    const access = await resolveMeetingAccess(meetingId);
    if (!access.meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    if (!access.isHost) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsed = await readJsonBody(req);
    if (!parsed.ok) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const body = generateSummarySchema.safeParse(parsed.json);
    if (!body.success) {
      return NextResponse.json({ error: body.error.issues[0].message }, { status: 400 });
    }

    const lockToken = await tryLock(inFlightLock(meetingId), IN_FLIGHT_TTL_MS);
    if (!lockToken) {
      return NextResponse.json(
        { error: "A summary is already being generated for this meeting", code: "SUMMARY_IN_PROGRESS" },
        { status: 409 },
      );
    }

    try {
      const cooldownLeft = await remainingMs(cooldownFlag(meetingId));
      if (cooldownLeft > 0) {
        return NextResponse.json(
          { error: "A summary was generated moments ago; try again shortly", code: "SUMMARY_COOLDOWN" },
          { status: 429, headers: { "Retry-After": String(Math.ceil(cooldownLeft / 1000)) } },
        );
      }

      const generate = createOpenAISummaryGenerator({
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_SUMMARY_MODEL || DEFAULT_SUMMARY_MODEL,
        timeoutMs: 45_000,
      });
      const result = await summarizeMeeting(meetingId, generate, { discardEdits: body.data.discardEdits });
      // Only a completed model answer costs tokens; failures stay retryable at once.
      if (result.status === "saved" || result.status === "invalid_output") {
        await setFlag(cooldownFlag(meetingId), COOLDOWN_MS);
      }

      switch (result.status) {
        case "saved":
          return NextResponse.json({ summary: serializeSummary(result.summary) });
        case "not_found":
          return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
        case "rejected":
          return NextResponse.json(
            { error: result.message, code: `TRANSCRIPT_${result.reason}`, stats: result.stats },
            { status: 422 },
          );
        case "invalid_output":
          return NextResponse.json({ error: result.message, code: `AI_${result.reason}` }, { status: 502 });
        case "ai_error":
          // Provider detail stays in the server log; the client gets the code.
          console.error(`Meeting summary AI error (${meetingId}): ${result.code} ${result.message}`);
          return NextResponse.json(
            { error: "The AI summary could not be generated", code: result.code, retryable: result.retryable },
            { status: httpStatusForSummaryAIError(result.code) },
          );
      }
    } finally {
      await unlock(inFlightLock(meetingId), lockToken);
    }
  } catch (error) {
    console.error("Meeting Summary POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** FR-15: the host saves an edited summary, or reverts to the AI version. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: meetingId } = await params;

  try {
    const access = await resolveMeetingAccess(meetingId);
    if (!access.meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    if (!access.isHost) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsed = await readJsonBody(req);
    if (!parsed.ok) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const body = editSummarySchema.safeParse(parsed.json);
    if (!body.success) {
      return NextResponse.json({ error: body.error.issues[0].message }, { status: 400 });
    }

    let content: string | null = null;
    if (body.data.editedSummary !== null) {
      const normalized = normalizeEditedSummary(body.data.editedSummary);
      if (!normalized.ok) {
        return NextResponse.json({ error: normalized.message, code: `SUMMARY_${normalized.reason}` }, { status: 422 });
      }
      content = normalized.text;
    }

    const result = await saveEditedSummary(meetingId, content, {
      generatedAt: new Date(body.data.baseGeneratedAt),
      editedAt: body.data.baseEditedAt === null ? null : new Date(body.data.baseEditedAt),
    });

    switch (result.status) {
      case "saved":
        return NextResponse.json({ summary: serializeSummary(result.summary) });
      case "not_found":
        return NextResponse.json({ error: "This meeting has no summary yet", code: "SUMMARY_NOT_FOUND" }, { status: 404 });
      case "conflict":
        return NextResponse.json(
          { error: "The summary changed since editing started", code: "SUMMARY_CONFLICT" },
          { status: 409 },
        );
    }
  } catch (error) {
    console.error("Meeting Summary PATCH Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
