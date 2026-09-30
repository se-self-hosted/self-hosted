"use client";

import { FormEvent, useRef, useState } from "react";
import { Bot, Download, FileText, Loader2, Pencil, RefreshCw } from "lucide-react";
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

type MeetingSummaryDisplayProps = {
  summary: MeetingSummary | null;
  roomName: string;
  startedAt: string;
  onSave?: (content: string) => Promise<void> | void;
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
  roomName,
  startedAt,
  onSave,
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

type MeetingSummaryEditorProps = {
  summary: MeetingSummary;
  displayedSummary: DisplayedMeetingSummary;
  roomName: string;
  startedAt: string;
  onSave?: (content: string) => Promise<void> | void;
  onRegenerate?: () => Promise<void> | void;
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
  const [regenerationStatus, setRegenerationStatus] = useState<SummaryRegenerationStatus>("idle");
  const regenerationInFlight = useRef(false);
  const [exportError, setExportError] = useState("");

  const draftState = getSummaryDraftState(originalContent, draftContent);
  const canSave = canSubmitSummaryDraft(originalContent, draftContent, Boolean(onSave)) && !isSaving;
  const regenerationAvailable = Boolean(onRegenerate);
  const canRegenerate = canStartSummaryRegeneration(regenerationAvailable, regenerationStatus) && !isEditing;

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
        <p className="meeting-summary__error" role="alert">
          ไม่สามารถสร้างสรุปใหม่ได้ กรุณาลองอีกครั้ง
        </p>
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
