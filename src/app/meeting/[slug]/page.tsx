"use client";

import { use, useEffect, useState } from "react";
import { MeetingRoomView } from "@/features/meeting-room/components/MeetingRoomView";

type Room = {
  id: string;
  roomHash: string;
  roomName: string;
  maxParticipants: number;
  status: string;
};

type MeetingRoomPageProps = {
  params: Promise<{ slug: string }>;
};

export default function MeetingRoomPage({ params }: MeetingRoomPageProps) {
  const { slug } = use(params);
  const [room, setRoom] = useState<Room | null>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchRoom() {
      try {
        const response = await fetch(`/api/rooms/${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });

        if (response.status === 404) {
          if (!isCancelled) setRoom(null);
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Room request failed");
        }

        if (!isCancelled) setRoom(data.room);
      } catch {
        if (!isCancelled) setError("ไม่สามารถโหลดข้อมูลห้องประชุมได้");
      }
    }

    void fetchRoom();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  if (error) {
    return (
      <main className="meeting-unavailable">
        <div role="alert" className="meeting-unavailable__card">
          <h1 className="meeting-unavailable__title">เกิดข้อผิดพลาด</h1>
          <p className="meeting-unavailable__description">{error}</p>
        </div>
      </main>
    );
  }

  if (room === undefined) {
    return (
      <main className="meeting-unavailable">
        <p className="dashboard-loading__text">กำลังโหลดห้องประชุม...</p>
      </main>
    );
  }

  return <MeetingRoomView room={room} requestedSlug={slug} />;
}
