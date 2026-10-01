import { AppSidebar } from "@/components/app-shell/AppSidebar";
import { MeetingHistory } from "@/features/meeting-history/components/MeetingHistory";

export default function HistoryPage() {
  return (
    <div className="dashboard">
      <AppSidebar active="history" />

      <main className="dashboard__main">
        <div className="dashboard__container">
          <MeetingHistory />
        </div>
      </main>
    </div>
  );
}
