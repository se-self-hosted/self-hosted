"use client";

import { use, useEffect, useState } from "react";
import { MeetingRoomView } from "@/features/meeting-room/components/MeetingRoomView";
import { getMeetingRoomBySlug } from "@/features/rooms/data";
import type { MeetingRoom } from "@/features/rooms/types";

type MeetingRoomPageProps = {
  params: Promise<{ slug: string }>;
};

export default function MeetingRoomPage({ params }: MeetingRoomPageProps) {
  const { slug } = use(params);
  const [room, setRoom] = useState<MeetingRoom | null>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    getMeetingRoomBySlug(slug)
      .then((loadedRoom) => {
        if (!isCancelled) setRoom(loadedRoom);
      })
      .catch(() => {
        if (!isCancelled) setError("ไม่สามารถโหลดข้อมูลห้องประชุมได้");
      });

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
