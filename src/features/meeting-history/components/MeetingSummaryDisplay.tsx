"use client";

import { useRef, useState } from "react";
import { Bot, FileText, Loader2, RefreshCw } from "lucide-react";
import {
  canStartSummaryRegeneration,
  getSummaryRegenerationCompletionStatus,
  selectMeetingSummaryContent,
} from "../summary";
import type { SummaryRegenerationStatus } from "../summary";
import type { MeetingSummary } from "../types";

type MeetingSummaryDisplayProps = {
  summary: MeetingSummary | null;
  onRegenerate?: () => Promise<void> | void;
  showRegenerate?: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Bangkok",
});

export function MeetingSummaryDisplay({
  summary,
  onRegenerate,
  showRegenerate,
}: MeetingSummaryDisplayProps) {
  if (!summary) {
    return (
      <section className="meeting-summary card p-6" aria-labelledby="meeting-summary-title">
        <h3 id="meeting-summary-title" className="meeting-summary__title">
          <Bot aria-hidden="true" className="icon-20" /> สรุปการประชุมด้วย AI
        </h3>
        <div className="meeting-summary__empty" role="status">
          <FileText aria-hidden="true" className="icon-20" />
          <div>
            <p className="meeting-summary__empty-title">ยังไม่มีสรุปการประชุม</p>
            <p className="meeting-summary__empty-description">
              เมื่อสรุปพร้อมแล้ว เนื้อหาสรุปการประชุมจะแสดงที่นี่
            </p>
          </div>
        </div>
      </section>
    );
  }

  const displayedSummary = selectMeetingSummaryContent(summary);
  if (!displayedSummary) return null;

  return (
    <MeetingSummaryContent
      key={`${summary.id}:${summary.generatedAt}:${summary.editedAt ?? ""}`}
      summary={summary}
      onRegenerate={onRegenerate}
      showRegenerate={showRegenerate ?? Boolean(onRegenerate)}
    />
  );
}

type MeetingSummaryContentProps = {
  summary: MeetingSummary;
  onRegenerate?: () => Promise<void> | void;
  showRegenerate: boolean;
};

function MeetingSummaryContent({
  summary,
  onRegenerate,
  showRegenerate,
}: MeetingSummaryContentProps) {
  const displayedSummary = selectMeetingSummaryContent(summary);
  const [regenerationStatus, setRegenerationStatus] = useState<SummaryRegenerationStatus>("idle");
  const regenerationInFlight = useRef(false);
  const regenerationAvailable = Boolean(onRegenerate);
  const canRegenerate = canStartSummaryRegeneration(regenerationAvailable, regenerationStatus);

  if (!displayedSummary) return null;

  async function regenerateSummary() {
    if (!onRegenerate || regenerationInFlight.current) return;

    regenerationInFlight.current = true;
    setRegenerationStatus("regenerating");
    try {
      await onRegenerate();
      setRegenerationStatus(getSummaryRegenerationCompletionStatus(true));
    } catch {
      setRegenerationStatus(getSummaryRegenerationCompletionStatus(false));
    } finally {
      regenerationInFlight.current = false;
    }
  }

  return (
    <section className="meeting-summary card p-6" aria-labelledby="meeting-summary-title">
      <div className="meeting-summary__header">
        <div>
          <h3 id="meeting-summary-title" className="meeting-summary__title">
            <Bot aria-hidden="true" className="icon-20" /> สรุปการประชุมด้วย AI
          </h3>
          <p className="meeting-summary__subtitle">
            {displayedSummary.source === "edited" ? "ฉบับแก้ไข" : "สร้างจากบทสนทนาการประชุม"}
          </p>
        </div>
        <div className="meeting-summary__actions">
          <span className="meeting-summary__model">{summary.llmModel}</span>
          {showRegenerate && (
            <button
              type="button"
              className="meeting-summary__regenerate focus-ring"
              onClick={() => void regenerateSummary()}
              disabled={!canRegenerate}
              aria-describedby={!regenerationAvailable ? "meeting-summary-regenerate-unavailable" : undefined}
            >
              {regenerationStatus === "regenerating" ? (
                <Loader2 aria-hidden="true" className="icon-14 animate-spin" />
              ) : (
                <RefreshCw aria-hidden="true" className="icon-14" />
              )}
              {regenerationStatus === "regenerating" ? "Regenerating..." : "Regenerate Summary"}
            </button>
          )}
        </div>
      </div>

      {showRegenerate && !regenerationAvailable && (
        <p id="meeting-summary-regenerate-unavailable" className="meeting-summary__notice" role="status">
          ยังไม่เชื่อมต่อระบบสร้างสรุปใหม่
        </p>
      )}
      {regenerationStatus === "error" && (
        <p className="meeting-summary__error" role="alert">
          ไม่สามารถสร้างสรุปใหม่ได้ กรุณาลองอีกครั้ง
        </p>
      )}

      <p className="meeting-summary__content">{displayedSummary.content}</p>

      <dl className="meeting-summary__metadata">
        <div>
          <dt>สร้างเมื่อ</dt>
          <dd>{dateFormatter.format(new Date(summary.generatedAt))}</dd>
        </div>
        {summary.editedAt && (
          <div>
            <dt>แก้ไขล่าสุด</dt>
            <dd>{dateFormatter.format(new Date(summary.editedAt))}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
