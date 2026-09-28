"use client";

import { useState } from "react";
import { Bot, Download, FileText } from "lucide-react";
import { createSummaryPdfFilename, selectMeetingSummaryContent } from "../summary";
import type { MeetingSummary } from "../types";

type MeetingSummaryDisplayProps = {
  summary: MeetingSummary | null;
  roomName: string;
  startedAt: string;
};

const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Bangkok",
});

export function MeetingSummaryDisplay({ summary, roomName, startedAt }: MeetingSummaryDisplayProps) {
  const [exportError, setExportError] = useState("");

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
        <div className="meeting-summary__actions">
          <span className="meeting-summary__model">{summary.llmModel}</span>
          <button
            type="button"
            className="meeting-summary__export focus-ring"
            onClick={exportPdf}
            aria-describedby="meeting-summary-export-help"
          >
            <Download aria-hidden="true" className="icon-14" /> ส่งออก PDF
          </button>
        </div>
      </div>

      <p id="meeting-summary-export-help" className="sr-only">
        เปิดหน้าต่างพิมพ์เพื่อบันทึกสรุปการประชุมเป็นไฟล์ PDF
      </p>
      {exportError && <p className="meeting-summary__export-error" role="alert">{exportError}</p>}

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
