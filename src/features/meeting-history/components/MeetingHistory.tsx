"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, useEffect } from "react";
import { CalendarDays, ChevronRight, Search, Loader2 } from "lucide-react";
import { filterMeetingHistory } from "../search";
import type { MeetingHistoryFilters, MeetingHistoryItem } from "../types";

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
  return [hours ? `${hours}h` : "", minutes ? `${minutes}m` : "", !hours && seconds ? `${seconds}s` : ""]
    .filter(Boolean)
    .join(" ");
}

export function MeetingHistory({ meetings: initialMeetings }: MeetingHistoryProps) {
  const [meetings, setMeetings] = useState<MeetingHistoryItem[]>(initialMeetings || []);
  const [isLoading, setIsLoading] = useState(!initialMeetings);
  const [draftFilters, setDraftFilters] = useState<MeetingHistoryFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<MeetingHistoryFilters>(emptyFilters);

  useEffect(() => {
    if (!initialMeetings) {
      setIsLoading(true);
      fetch('/api/meetings')
        .then(res => res.json())
        .then(data => {
          if (data.meetings) {
            setMeetings(data.meetings);
          }
        })
        .catch(err => console.error(err))
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
        <label className="meeting-history__date">
          <span>ตั้งแต่</span>
          <input
            type="date"
            value={draftFilters.from}
            max={draftFilters.to || undefined}
            onChange={(event) => setDraftFilters((filters) => ({ ...filters, from: event.target.value }))}
          />
        </label>
        <label className="meeting-history__date">
          <span>ถึง</span>
          <input
            type="date"
            value={draftFilters.to}
            min={draftFilters.from || undefined}
            onChange={(event) => setDraftFilters((filters) => ({ ...filters, to: event.target.value }))}
          />
        </label>
        <button type="submit" className="meeting-history__submit focus-ring" disabled={isLoading}>ค้นหา</button>
      </form>

      <div className="meeting-history__results" aria-live="polite">
        {isLoading ? (
          <div className="meeting-history__state"><Loader2 aria-hidden="true" className="icon-20 animate-spin" /><p>กำลังโหลดข้อมูลการประชุม...</p></div>
        ) : filteredMeetings.length === 0 ? (
          <div className="meeting-history__state"><CalendarDays aria-hidden="true" className="icon-20" /><p>ไม่พบการประชุมที่ตรงกับเงื่อนไข</p></div>
        ) : (
          <div className="meeting-history__table-wrap">
            <table className="meeting-history__table">
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
                        <ChevronRight aria-hidden="true" className="icon-16" />
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
