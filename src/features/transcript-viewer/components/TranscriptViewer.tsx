import Link from "next/link";
import {
  Bot,
  ChevronLeft,
  Clock3,
  LayoutGrid,
  MessageCircle,
  Music2,
  Video,
} from "lucide-react";
import type {
  TranscriptMeetingViewModel,
  TranscriptSegmentViewModel,
  TranscriptViewerState,
} from "../types";

type TranscriptViewerProps = {
  state: TranscriptViewerState;
};

const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Bangkok",
});

const timeFormatter = new Intl.DateTimeFormat("th-TH", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Bangkok",
});

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds}s`;
}

function ViewerSidebar() {
  return (
    <aside className="transcript-sidebar">
      <div className="transcript-sidebar__inner">
        <Link href="/dashboard" className="sidebar__brand transcript-sidebar__brand focus-ring">
          <span className="sidebar__brand-icon">
            <Video aria-hidden="true" className="icon-18" strokeWidth={2.2} />
          </span>
          <span className="sidebar__brand-name">MeetSync</span>
        </Link>

        <nav aria-label="เมนูหลัก" className="transcript-sidebar__nav">
          <p className="sidebar__nav-label">เมนู</p>
          <Link href="/dashboard" className="sidebar__nav-link focus-ring">
            <LayoutGrid aria-hidden="true" className="icon-16" />
            แดชบอร์ด
          </Link>
          <Link href="/dashboard#history" className="sidebar__nav-link--active focus-ring">
            <Clock3 aria-hidden="true" className="icon-16" />
            ประวัติการประชุม
          </Link>
        </nav>
      </div>
    </aside>
  );
}

function ViewerStateMessage({ state }: TranscriptViewerProps) {
  const isLoading = state.status === "loading";
  const isError = state.status === "error";

  return (
    <div className="transcript-state" role={isError ? "alert" : "status"} aria-live="polite">
      {isLoading ? <span className="transcript-state__spinner" aria-hidden="true" /> : null}
      <h1 className="transcript-state__title">
        {isLoading ? "กำลังโหลด Transcript..." : "โหลด Transcript ไม่สำเร็จ"}
      </h1>
      {isError ? <p className="transcript-state__description">{state.message}</p> : null}
      {isError ? (
        <Link href="/dashboard#history" className="transcript-state__link focus-ring">
          กลับไปประวัติการประชุม
        </Link>
      ) : null}
    </div>
  );
}

function MeetingHeader({ meeting }: { meeting: TranscriptMeetingViewModel }) {
  const visibleParticipants = meeting.participants.slice(0, 4);
  const remaining = Math.max(0, meeting.participants.length - visibleParticipants.length);

  return (
    <header className="transcript-header">
      <Link href="/dashboard#history" className="transcript-header__back focus-ring">
        <ChevronLeft aria-hidden="true" className="icon-14" />
        ประวัติการประชุม
      </Link>
      <h1 className="transcript-header__title">{meeting.title}</h1>
      <div className="transcript-header__meta">
        <span>{dateFormatter.format(new Date(meeting.startedAt))}</span>
        <span>ระยะเวลา {formatDuration(meeting.durationSeconds)}</span>
        <div className="transcript-avatars" aria-label={`ผู้เข้าร่วม ${meeting.participants.length} คน`}>
          {visibleParticipants.map((participant) => (
            <span
              key={participant.id}
              title={participant.displayName}
              className={`transcript-avatar transcript-avatar--${participant.color}`}
            >
              {participant.initials}
            </span>
          ))}
          {remaining > 0 ? <span className="transcript-avatar transcript-avatar--more">+{remaining}</span> : null}
        </div>
      </div>
    </header>
  );
}

function TranscriptRow({ segment }: { segment: TranscriptSegmentViewModel }) {
  return (
    <li className="transcript-row">
      <span
        className={`transcript-row__avatar transcript-avatar--${segment.speaker.color}`}
        aria-hidden="true"
      >
        {segment.speaker.initials}
      </span>
      <div className="transcript-row__content">
        <div className="transcript-row__heading">
          <h2 className="transcript-row__speaker">{segment.speaker.displayName}</h2>
          <time className="transcript-row__time" dateTime={segment.spokenAt}>
            {timeFormatter.format(new Date(segment.spokenAt))}
          </time>
        </div>
        <p className="transcript-row__text">{segment.text}</p>
      </div>
    </li>
  );
}

function TranscriptContent({ state }: TranscriptViewerProps) {
  if (state.status === "loading" || state.status === "error") {
    return <ViewerStateMessage state={state} />;
  }

  return (
    <div className="transcript-page__body">
      <MeetingHeader meeting={state.meeting} />
      <div className="transcript-tabs" role="tablist" aria-label="รายละเอียดการประชุม">
        <span className="transcript-tab transcript-tab--active" role="tab" aria-selected="true">
          <MessageCircle aria-hidden="true" className="icon-14" />
          Transcript
        </span>
        <span className="transcript-tab" aria-disabled="true">
          <Bot aria-hidden="true" className="icon-14" />
          AI Summary
        </span>
        <span className="transcript-tab" aria-disabled="true">
          <Music2 aria-hidden="true" className="icon-14" />
          เสียง
        </span>
      </div>

      <section className="transcript-panel" aria-label="Transcript การประชุม">
        {state.status === "empty" ? (
          <div className="transcript-empty" role="status">
            <span className="transcript-empty__icon">
              <MessageCircle aria-hidden="true" className="icon-20" />
            </span>
            <h2 className="transcript-empty__title">ยังไม่มี Transcript</h2>
            <p className="transcript-empty__description">
              เมื่อมีข้อมูล Transcript ข้อความจากการประชุมจะแสดงที่นี่
            </p>
          </div>
        ) : (
          <ol className="transcript-list">
            {state.segments.map((segment) => (
              <TranscriptRow key={segment.id} segment={segment} />
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

export function TranscriptViewer({ state }: TranscriptViewerProps) {
  return (
    <div className="transcript-page">
      <ViewerSidebar />
      <main className="transcript-page__main">
        <TranscriptContent state={state} />
      </main>
    </div>
  );
}
