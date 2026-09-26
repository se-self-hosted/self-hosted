import { Bot, FileText } from "lucide-react";
import { selectMeetingSummaryContent } from "../summary";
import type { MeetingSummary } from "../types";

type MeetingSummaryDisplayProps = {
  summary: MeetingSummary | null;
};

const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Bangkok",
});

export function MeetingSummaryDisplay({ summary }: MeetingSummaryDisplayProps) {
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
        <span className="meeting-summary__model">{summary.llmModel}</span>
      </div>

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
