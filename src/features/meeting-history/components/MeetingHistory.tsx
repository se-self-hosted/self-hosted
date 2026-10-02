"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, useEffect } from "react";
import { AlertCircle, ArrowRight, CalendarDays, Search } from "lucide-react";
import { TypewriterLoader } from "@/components/TypewriterLoader";
import { HistoryDatePicker } from "./HistoryDatePicker";
import { filterMeetingHistory } from "../search";
import type { MeetingHistoryFilters, MeetingHistoryItem, MeetingHistoryResponse } from "../types";

type MeetingHistoryProps = { meetings?: MeetingHistoryItem[] };
const emptyFilters: MeetingHistoryFilters = { query: "", from: "", to: "" };

const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Bangkok",
});

function formatDuration(totalSeconds: number | null) {
  if (totalSeconds == null) return "0s";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [hours ? `${hours}h` : "", minutes ? `${minutes}m` : "", !hours && seconds ? `${seconds}s` : ""]
    .filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "0s";
}

export function MeetingHistory({ meetings: initialMeetings }: MeetingHistoryProps) {
  const [meetings, setMeetings] = useState<MeetingHistoryItem[]>(initialMeetings || []);
  const [isLoading, setIsLoading] = useState(!initialMeetings);
  const [error, setError] = useState("");
  const [draftFilters, setDraftFilters] = useState<MeetingHistoryFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<MeetingHistoryFilters>(emptyFilters);

  useEffect(() => {
    if (!initialMeetings) {
      setIsLoading(true);
      setError("");
      fetch('/api/meetings')
        .then((res) => {
          if (!res.ok) throw new Error("โหลดประวัติการประชุมไม่สำเร็จ");
          return res.json() as Promise<MeetingHistoryResponse>;
        })
        .then((data) => setMeetings(data.meetings))
        .catch((err: Error) => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [initialMeetings]);

  const filteredMeetings = useMemo(
    () => filterMeetingHistory(meetings, appliedFilters),
    [meetings, appliedFilters],
  );

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedFilters(draftFilters);
  }

  return (
    <section id="history" aria-labelledby="meeting-history-title" className="meeting-history">
      <header className="meeting-history__header">
        <h2 id="meeting-history-title" className="dashboard__title">ประวัติการประชุม</h2>
        <p className="dashboard__subtitle">{isLoading ? 'กำลังโหลด...' : `${filteredMeetings.length} การประชุม`}</p>
      </header>

      <form className="meeting-history__filters" role="search" onSubmit={submitSearch}>
        <label className="meeting-history__search">
          <span className="sr-only">ค้นหาชื่อห้องหรือผู้เข้าร่วม</span>
          <Search aria-hidden="true" className="icon-16" />
          <input
            value={draftFilters.query}
            maxLength={100}
            onChange={(event) => setDraftFilters((filters) => ({ ...filters, query: event.target.value }))}
            placeholder="ค้นหาชื่อห้องหรือผู้เข้าร่วม"
          />
        </label>
        <HistoryDatePicker
          label="ตั้งแต่"
          value={draftFilters.from}
          max={draftFilters.to || undefined}
          onChange={(from) => setDraftFilters((filters) => ({ ...filters, from }))}
        />
        <HistoryDatePicker
          align="end"
          label="ถึง"
          value={draftFilters.to}
          min={draftFilters.from || undefined}
          onChange={(to) => setDraftFilters((filters) => ({ ...filters, to }))}
        />
        <button type="submit" className="meeting-history__submit action-fill focus-ring" disabled={isLoading}>ค้นหา</button>
      </form>

      <div className="meeting-history__results" aria-live="polite">
        {isLoading ? (
          <div className="meeting-history__state"><TypewriterLoader label="กำลังโหลดข้อมูลการประชุม..." /></div>
        ) : error ? (
          <div className="meeting-history__state"><AlertCircle aria-hidden="true" className="icon-20" /><p>{error}</p></div>
        ) : filteredMeetings.length === 0 ? (
          <div className="meeting-history__state"><CalendarDays aria-hidden="true" className="icon-20" /><p>ไม่พบการประชุมที่ตรงกับเงื่อนไข</p></div>
        ) : (
          <div className="meeting-history__table-wrap">
            <table className="meeting-history__table meeting-history__table--overview">
              <thead>
                <tr>
                  <th>ชื่อห้องประชุม</th>
                  <th>เริ่มประชุม</th>
                  <th>ระยะเวลา</th>
                  <th>ผู้เข้าร่วม</th>
                  <th><span className="sr-only">ดูรายละเอียด</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredMeetings.map((meeting) => (
                  <tr key={meeting.id}>
                    <td>
                      <strong>{meeting.roomName}</strong>
                      <small>
                        {meeting.participantNames.slice(0, 3).join(" · ") || "ไม่มีข้อมูลผู้เข้าร่วม"}
                        {meeting.participantNames.length > 3 ? ` +${meeting.participantNames.length - 3}` : ""}
                      </small>
                    </td>
                    <td>{dateFormatter.format(new Date(meeting.startedAt))}</td>
                    <td>{formatDuration(meeting.durationSeconds)}</td>
                    <td>{meeting.participantCount}</td>
                    <td>
                      <Link
                        href={`/history/${meeting.id}`}
                        aria-label={`ดูรายละเอียดการประชุม ${meeting.roomName}`}
                        className="meeting-history__link focus-ring"
                      >
                        <span aria-hidden="true" className="meeting-history__link-circle">
                          <ArrowRight className="meeting-history__link-arrow" strokeWidth={1.8} />
                        </span>
                        <span className="meeting-history__link-text">ดูสรุปการประชุม</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
