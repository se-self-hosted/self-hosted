import { MeetingDetail } from "@/features/meeting-history/components/MeetingDetail";
import Link from "next/link";
import { Clock3, LayoutGrid, Video, ChevronLeft } from "lucide-react";

export default async function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: meetingId } = await params;
  
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
          <section className="meeting-detail">
            <header className="meeting-detail__header">
              <Link href="/history" className="meeting-detail__back focus-ring" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#666', textDecoration: 'none' }}>
                <ChevronLeft aria-hidden="true" className="icon-16" />
                กลับไปยังประวัติการประชุม
              </Link>
              <h2 className="dashboard__title">รายละเอียดการประชุม</h2>
              <MeetingDetail meetingId={meetingId} />
            </header>
          </section>
        </div>
      </main>
    </div>
  );
}
