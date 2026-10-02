import { MeetingDetail } from "@/features/meeting-history/components/MeetingDetail";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AppSidebar } from "@/components/app-shell/AppSidebar";

export default async function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: meetingId } = await params;
  
  return (
    <div className="dashboard">
      <AppSidebar active="history" />

      <main className="dashboard__main">
        <div className="dashboard__container">
          <section className="meeting-detail">
            <header className="meeting-detail__header">
              <Link href="/history" className="meeting-detail__back action-fill focus-ring">
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
