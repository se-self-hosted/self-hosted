import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveMeetingAccess } from "@/lib/meeting-access";
import { summarizeMeeting } from "@/lib/meeting-summary";
import {
  createOpenAISummaryGenerator,
  DEFAULT_SUMMARY_MODEL,
  httpStatusForSummaryAIError,
} from "@/features/ai-summary/lib/openai-summary";

// Long transcripts are summarized in several sequential model calls.
export const maxDuration = 300;

const generateSummarySchema = z.object({
  /** Regenerating keeps the host's edited version unless this is set. */
  discardEdits: z.boolean().optional().default(false),
});

// One generation per meeting at a time in this process, so a double click or
// a second tab doesn't pay for the same summary twice, and a pause between
// generations so a looping client can't run up the OpenAI bill.
const inFlight = new Set<string>();
const lastFinishedAt = new Map<string, number>();
const COOLDOWN_MS = 15_000;

function startCooldown(meetingId: string) {
  const now = Date.now();
  for (const [id, finishedAt] of lastFinishedAt) {
    if (now - finishedAt >= COOLDOWN_MS) lastFinishedAt.delete(id);
  }
  lastFinishedAt.set(meetingId, now);
}

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

    const rawBody = await req.text();
    let json: unknown = {};
    if (rawBody.trim()) {
      try {
        json = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
      }
    }
    const body = generateSummarySchema.safeParse(json);
    if (!body.success) {
      return NextResponse.json({ error: body.error.issues[0].message }, { status: 400 });
    }

    if (inFlight.has(meetingId)) {
      return NextResponse.json(
        { error: "A summary is already being generated for this meeting", code: "SUMMARY_IN_PROGRESS" },
        { status: 409 },
      );
    }
    const sinceLast = Date.now() - (lastFinishedAt.get(meetingId) ?? 0);
    if (sinceLast < COOLDOWN_MS) {
      const retryAfter = Math.ceil((COOLDOWN_MS - sinceLast) / 1000);
      return NextResponse.json(
        { error: "A summary was generated moments ago; try again shortly", code: "SUMMARY_COOLDOWN" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }
    inFlight.add(meetingId);

    try {
      const generate = createOpenAISummaryGenerator({
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_SUMMARY_MODEL || DEFAULT_SUMMARY_MODEL,
        timeoutMs: 45_000,
      });
      const result = await summarizeMeeting(meetingId, generate, { discardEdits: body.data.discardEdits });
      // Only a completed model answer costs tokens; failures stay retryable at once.
      if (result.status === "saved" || result.status === "invalid_output") {
        startCooldown(meetingId);
      }

      switch (result.status) {
        case "saved": {
          const { summary } = result;
          return NextResponse.json({
            summary: {
              id: summary.id,
              aiSummary: summary.aiSummary,
              editedSummary: summary.editedSummary,
              llmModel: summary.llmModel,
              generatedAt: summary.generatedAt,
              editedAt: summary.editedAt,
            },
          });
        }
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
      inFlight.delete(meetingId);
    }
  } catch (error) {
    console.error("Meeting Summary POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
