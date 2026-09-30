"use client";

import { FormEvent, useRef, useState } from "react";
import { Bot, Download, FileText, Loader2, Pencil, RefreshCw, Sparkles } from "lucide-react";
import {
  canStartSummaryRegeneration,
  canSubmitSummaryDraft,
  createSummaryPdfFilename,
  getSummaryDraftState,
  getSummaryRegenerationCompletionStatus,
  selectMeetingSummaryContent,
} from "../summary";
import type { DisplayedMeetingSummary, SummaryRegenerationStatus } from "../summary";
import type { MeetingSummary } from "../types";

type RegenerateSummary = (options: { discardEdits: boolean }) => Promise<void> | void;

type MeetingSummaryDisplayProps = {
  summary: MeetingSummary | null;
  roomName: string;
  startedAt: string;
  onSave?: (content: string) => Promise<void> | void;
  /** Generates the first summary, or regenerates an existing one. */
  onRegenerate?: RegenerateSummary;
  showRegenerate?: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Bangkok",
});

const DEFAULT_REGENERATION_ERROR = "ไม่สามารถสร้างสรุปใหม่ได้ กรุณาลองอีกครั้ง";

/** Shared by the empty state (first generation) and the summary card. */
function useSummaryRegeneration(onRegenerate?: RegenerateSummary) {
  const [status, setStatus] = useState<SummaryRegenerationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inFlight = useRef(false);
  const available = Boolean(onRegenerate);

  async function run(discardEdits: boolean) {
    if (!onRegenerate || inFlight.current) return;

    inFlight.current = true;
    setStatus("regenerating");
    setErrorMessage("");
    try {
      await onRegenerate({ discardEdits });
      setStatus(getSummaryRegenerationCompletionStatus(true));
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message ? error.message : DEFAULT_REGENERATION_ERROR);
      setStatus(getSummaryRegenerationCompletionStatus(false));
    } finally {
      inFlight.current = false;
    }
  }

  return { status, errorMessage, available, canStart: canStartSummaryRegeneration(available, status), run };
}

export function MeetingSummaryDisplay({
  summary,
  roomName,
  startedAt,
  onSave,
  onRegenerate,
  showRegenerate,
}: MeetingSummaryDisplayProps) {
  if (!summary) {
    return (
      <MeetingSummaryEmpty
        onGenerate={onRegenerate}
        showGenerate={showRegenerate ?? Boolean(onRegenerate)}
      />
    );
  }

  const displayedSummary = selectMeetingSummaryContent(summary);
  if (!displayedSummary) return null;

  return (
    <MeetingSummaryEditor
      key={`${summary.id}:${summary.generatedAt}:${displayedSummary.content}`}
      summary={summary}
      displayedSummary={displayedSummary}
      roomName={roomName}
      startedAt={startedAt}
      onSave={onSave}
      onRegenerate={onRegenerate}
      showRegenerate={showRegenerate ?? Boolean(onRegenerate)}
    />
  );
}

function MeetingSummaryEmpty({
  onGenerate,
  showGenerate,
}: {
  onGenerate?: RegenerateSummary;
  showGenerate: boolean;
}) {
  const generation = useSummaryRegeneration(onGenerate);
  const isGenerating = generation.status === "regenerating";

  return (
    <section className="meeting-summary card p-6" aria-labelledby="meeting-summary-title">
      <h3 id="meeting-summary-title" className="meeting-summary__title">
        <Bot aria-hidden="true" className="icon-20" /> สรุปการประชุมด้วย AI
      </h3>
      <div className="meeting-summary__empty" role="status">
        <FileText aria-hidden="true" className="icon-20" />
        <div>
          <p className="meeting-summary__empty-title">
            {isGenerating ? "กำลังสร้างสรุปการประชุม..." : "ยังไม่มีสรุปการประชุม"}
          </p>
          <p className="meeting-summary__empty-description">
            {showGenerate
              ? "สร้างสรุปจากบทสนทนาของการประชุมนี้ด้วย AI (อาจใช้เวลาสักครู่)"
              : "เมื่อสรุปพร้อมแล้ว เนื้อหาสรุปการประชุมจะแสดงที่นี่"}
          </p>
        </div>
      </div>
      {showGenerate && generation.available && (
        <button
          type="button"
          className="meeting-summary__generate focus-ring"
          onClick={() => void generation.run(false)}
          disabled={!generation.canStart}
        >
          {isGenerating ? (
            <Loader2 aria-hidden="true" className="icon-14 animate-spin" />
          ) : (
            <Sparkles aria-hidden="true" className="icon-14" />
          )}
          {isGenerating ? "กำลังสร้างสรุป..." : "สร้างสรุปด้วย AI"}
        </button>
      )}
      {generation.status === "error" && (
        <p className="meeting-summary__error" role="alert">{generation.errorMessage}</p>
      )}
    </section>
  );
}

type MeetingSummaryEditorProps = {
  summary: MeetingSummary;
  displayedSummary: DisplayedMeetingSummary;
  roomName: string;
  startedAt: string;
  onSave?: (content: string) => Promise<void> | void;
  onRegenerate?: RegenerateSummary;
  showRegenerate: boolean;
};

function MeetingSummaryEditor({
  summary,
  displayedSummary,
  roomName,
  startedAt,
  onSave,
  onRegenerate,
  showRegenerate,
}: MeetingSummaryEditorProps) {
  const originalContent = displayedSummary.content;
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(originalContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const regeneration = useSummaryRegeneration(onRegenerate);
  const regenerationStatus = regeneration.status;
  const [exportError, setExportError] = useState("");

  const draftState = getSummaryDraftState(originalContent, draftContent);
  const canSave = canSubmitSummaryDraft(originalContent, draftContent, Boolean(onSave)) && !isSaving;
  const regenerationAvailable = regeneration.available;
  const canRegenerate = regeneration.canStart && !isEditing;

  function startEditing() {
    setDraftContent(originalContent);
    setSaveError("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftContent(originalContent);
    setSaveError("");
    setIsEditing(false);
  }

  async function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onSave || !canSave) return;

    setIsSaving(true);
    setSaveError("");
    try {
      await onSave(draftContent);
    } catch {
      setSaveError("ไม่สามารถบันทึกสรุปการประชุมได้ กรุณาลองอีกครั้ง");
    } finally {
      setIsSaving(false);
    }
  }

  function regenerateSummary() {
    // The edited version is what's displayed, so a regeneration that kept it
    // would appear to do nothing. Replace it, but only once the host agrees.
    const hasEdits = displayedSummary.source === "edited";
    if (
      hasEdits &&
      !window.confirm("สรุปนี้ถูกแก้ไขแล้ว การสร้างสรุปใหม่จะแทนที่ฉบับแก้ไข ต้องการดำเนินการต่อหรือไม่?")
    ) {
      return;
    }
    void regeneration.run(hasEdits);
  }

  function exportPdf() {
    const previousTitle = document.title;
    const printClass = "summary-export-printing";
    let cleanedUp = false;

    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      document.documentElement.classList.remove(printClass);
      document.title = previousTitle;
      window.removeEventListener("afterprint", cleanup);
    };

    setExportError("");
    try {
      document.title = createSummaryPdfFilename(roomName, startedAt).replace(/\.pdf$/i, "");
      document.documentElement.classList.add(printClass);
      window.addEventListener("afterprint", cleanup);
      window.print();
    } catch {
      cleanup();
      setExportError("ไม่สามารถเปิดหน้าต่างส่งออก PDF ได้ กรุณาลองอีกครั้ง");
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
        <div className="meeting-summary__header-actions">
          <span className="meeting-summary__model">{summary.llmModel}</span>
          {showRegenerate && (
            <button
              type="button"
              className="meeting-summary__regenerate focus-ring"
              onClick={regenerateSummary}
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
          {!isEditing && (
            <>
              <button
                type="button"
                className="meeting-summary__export focus-ring"
                onClick={exportPdf}
                aria-describedby="meeting-summary-export-help"
              >
                <Download aria-hidden="true" className="icon-14" /> ส่งออก PDF
              </button>
              <button
                type="button"
                className="meeting-summary__edit-btn focus-ring"
                onClick={startEditing}
                aria-label="แก้ไขสรุปการประชุม"
              >
                <Pencil aria-hidden="true" className="icon-14" /> แก้ไข
              </button>
            </>
          )}
        </div>
      </div>

      <p id="meeting-summary-export-help" className="sr-only">
        เปิดหน้าต่างพิมพ์เพื่อบันทึกสรุปการประชุมเป็นไฟล์ PDF
      </p>
      {showRegenerate && !regenerationAvailable && (
        <p id="meeting-summary-regenerate-unavailable" className="meeting-summary__notice" role="status">
          ยังไม่เชื่อมต่อระบบสร้างสรุปใหม่
        </p>
      )}
      {regenerationStatus === "error" && (
        <p className="meeting-summary__error" role="alert">{regeneration.errorMessage}</p>
      )}
      {exportError && <p className="meeting-summary__export-error" role="alert">{exportError}</p>}

      {isEditing ? (
        <form className="meeting-summary__form" onSubmit={submitEdit}>
          <label htmlFor={`meeting-summary-${summary.id}`} className="meeting-summary__label">
            เนื้อหาสรุปการประชุม
          </label>
          <textarea
            id={`meeting-summary-${summary.id}`}
            className="meeting-summary__textarea"
            value={draftContent}
            onChange={(event) => {
              setDraftContent(event.target.value);
              setSaveError("");
            }}
            rows={10}
            autoFocus
          />
          {!onSave && (
            <p className="meeting-summary__notice" role="status">
              ยังไม่สามารถบันทึกการแก้ไขได้ จนกว่าระบบบันทึกสรุปจะพร้อมใช้งาน
            </p>
          )}
          {!draftState.hasContent && (
            <p className="meeting-summary__validation" role="alert">
              กรุณากรอกเนื้อหาสรุปการประชุม
            </p>
          )}
          {saveError && <p className="meeting-summary__validation" role="alert">{saveError}</p>}
          <div className="meeting-summary__form-actions">
            <button
              type="button"
              className="meeting-summary__cancel-btn focus-ring"
              onClick={cancelEditing}
              disabled={isSaving}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="meeting-summary__save-btn focus-ring"
              disabled={!canSave}
              aria-label="บันทึกสรุปการประชุม"
            >
              {isSaving && <Loader2 aria-hidden="true" className="icon-14 animate-spin" />}
              บันทึก
            </button>
          </div>
        </form>
      ) : (
        <p className="meeting-summary__content">{displayedSummary.content}</p>
      )}

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
