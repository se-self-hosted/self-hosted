import Link from "next/link";
import { Clock3, LayoutGrid, Video } from "lucide-react";
import { MeetingHistory } from "@/features/meeting-history/components/MeetingHistory";

export default function HistoryPage() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar__inner">
          <div className="sidebar__header">
            <Link href="/dashboard" className="sidebar__brand focus-ring">
              <span className="sidebar__brand-icon">
                <Video aria-hidden="true" className="icon-18" strokeWidth={2.2} />
              </span>
              <span className="sidebar__brand-name">MeetSync</span>
            </Link>
          </div>

          <nav aria-label="เมนูหลัก" className="sidebar__nav">
            <p className="sidebar__nav-label">เมนู</p>
            <div className="sidebar__nav-grid">
              <Link href="/dashboard" className="sidebar__nav-link focus-ring">
                <LayoutGrid aria-hidden="true" className="icon-16" />
                แดชบอร์ด
              </Link>
              <Link
                href="/history"
                aria-current="page"
                className="sidebar__nav-link--active focus-ring"
              >
                <Clock3 aria-hidden="true" className="icon-16" />
                ประวัติการประชุม
              </Link>
            </div>
          </nav>
        </div>
      </aside>

      <main className="dashboard__main">
        <div className="dashboard__container">
          <MeetingHistory />
        </div>
      </main>
    </div>
  );
}
