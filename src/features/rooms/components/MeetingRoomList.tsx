import { Check, DoorOpen, Pencil, RefreshCw, Users, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MeetingRoom } from "../types";

type MeetingRoomListProps = {
  rooms: MeetingRoom[];
  isLoading: boolean;
  error: string | null;
  copiedRoomId: string | null;
  onCopyLink: (room: MeetingRoom) => void;
  onEdit: (room: MeetingRoom) => void;
  onRetry: () => void;
};

function RoomListSkeleton() {
  return (
    <div aria-label="กำลังโหลดรายการห้องประชุม" aria-live="polite" className="rooms-grid">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} aria-hidden="true" className="room-card room-card--skeleton">
          <div className="room-card__skeleton-row">
            <span className="room-card__skeleton-icon" />
            <span className="room-card__skeleton-badge" />
          </div>
          <span className="room-card__skeleton-title" />
          <span className="room-card__skeleton-subtitle" />
          <span className="room-card__skeleton-action" />
        </div>
      ))}
    </div>
  );
}

export function MeetingRoomList({
  rooms,
  isLoading,
  error,
  copiedRoomId,
  onCopyLink,
  onEdit,
  onRetry,
}: MeetingRoomListProps) {
  const router = useRouter();

  if (isLoading) {
    return <RoomListSkeleton />;
  }

  if (error) {
    return (
      <div role="alert" className="rooms-state">
        <span className="rooms-state__icon">
          <RefreshCw aria-hidden="true" className="icon-20" />
        </span>
        <h2 className="rooms-state__title">ไม่สามารถโหลดห้องประชุมได้</h2>
        <p className="rooms-state__description">{error}</p>
        <button type="button" onClick={onRetry} className="rooms-state__button focus-ring">
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="rooms-state">
        <span className="rooms-state__icon">
          <Video aria-hidden="true" className="icon-20" />
        </span>
        <h2 className="rooms-state__title">ยังไม่มีห้องประชุม</h2>
        <p className="rooms-state__description">
          สร้างห้องประชุมแรกของคุณด้วยปุ่ม “สร้างห้องประชุม” ด้านบน
        </p>
      </div>
    );
  }

  return (
    <section aria-label="รายการห้องประชุม" className="rooms-grid">
      {rooms.map((room) => {
        const isActive = room.status === "active";
        const wasCopied = copiedRoomId === room.id;

        return (
          <article key={room.id} className="room-card">
            <div className="room-card__top">
              <span className="room-card__icon">
                <Video aria-hidden="true" className="icon-18" strokeWidth={1.9} />
              </span>
              <span className={isActive ? "room-card__badge--active" : "room-card__badge"}>
                {isActive && <span aria-hidden="true" className="icon-8 room-card__badge-dot" />}
                {isActive ? "Active" : "Ended"}
              </span>
            </div>

            <div className="room-card__body">
              <h2 className="room-card__title">{room.name}</h2>
              <p className="room-card__subtitle">
                <Users aria-hidden="true" className="icon-14" />
                {isActive && room.currentParticipants !== undefined
                  ? `${room.currentParticipants} / ${room.maxParticipants} คน`
                  : `สูงสุด ${room.maxParticipants} คน`}
              </p>
              <p className="room-card__hash" title={room.slug}>
                /meeting/{room.slug}
              </p>
            </div>

            <div className="room-card__actions">
              <button
                type="button"
                onClick={() => onCopyLink(room)}
                className="room-card__copy-btn focus-ring"
              >
                {wasCopied && <Check aria-hidden="true" className="icon-14 room-card__copy-icon" />}
                {wasCopied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/meeting/${room.slug}`)}
                disabled={!isActive}
                title={isActive ? `เข้าร่วมห้อง ${room.name}` : "ห้องประชุมนี้สิ้นสุดแล้ว"}
                className="room-card__join-btn focus-ring"
              >
                <DoorOpen aria-hidden="true" className="icon-16" />
                เข้าร่วม
              </button>
              <button
                type="button"
                onClick={() => onEdit(room)}
                aria-label={`แก้ไขห้อง ${room.name}`}
                className="room-card__edit-btn focus-ring"
              >
                <Pencil aria-hidden="true" className="icon-16" />
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
