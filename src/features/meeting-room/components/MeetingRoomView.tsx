"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  LogOut,
  Mic,
  MicOff,
  Phone,
  Radio,
  Users,
  Video,
} from "lucide-react";

type Room = {
  roomHash: string;
  roomName: string;
  maxParticipants: number;
  status: string;
};

type MeetingRoomViewProps = {
  room: Room | null;
  requestedSlug: string;
  isHost?: boolean;
  hostName?: string;
};

type ParticipantTile = {
  name: string;
  initials: string;
  isHost?: boolean;
  isSpeaking?: boolean;
  isMuted?: boolean;
};

type RemoteParticipant = {
  id: string;
  displayName: string;
};

export function MeetingRoomView({
  room,
  requestedSlug,
  isHost = false,
  hostName,
}: MeetingRoomViewProps) {
  const [displayName, setDisplayName] = useState(isHost ? hostName ?? "" : "");
  const [nameError, setNameError] = useState("");
  const [hasJoined, setHasJoined] = useState(isHost && Boolean(hostName));
  const [isMicrophoneMuted, setIsMicrophoneMuted] = useState(false);

  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [otherParticipants, setOtherParticipants] = useState<RemoteParticipant[]>([]);

  // Register this browser tab as a real participant once it has joined.
  useEffect(() => {
    if (!hasJoined || !room || connectionId) return;

    let cancelled = false;

    async function registerJoin() {
      try {
        const response = await fetch(`/api/rooms/${room!.roomHash}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName }),
        });
        const data = await response.json();
        if (!cancelled && response.ok) {
          setConnectionId(data.connectionId);
          setParticipantId(data.participantId);
        }
      } catch (error) {
        console.error("Join meeting error:", error);
      }
    }

    void registerJoin();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasJoined, room]);

  // Poll the real participant list so the grid reflects who has actually joined.
  useEffect(() => {
    if (!hasJoined || !room) return;

    let cancelled = false;

    async function fetchParticipants() {
      try {
        const response = await fetch(`/api/rooms/${room!.roomHash}/participants`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (cancelled) return;

        const others: RemoteParticipant[] = data.participants
          .filter((participant: RemoteParticipant) => participant.id !== participantId)
          .map((participant: RemoteParticipant) => ({
            id: participant.id,
            displayName: participant.displayName,
          }));

        setOtherParticipants(others);
      } catch (error) {
        console.error("Fetch participants error:", error);
      }
    }

    void fetchParticipants();
    const interval = setInterval(fetchParticipants, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [hasJoined, room, participantId]);

  // Tell the server we've left, whether by closing the tab or navigating away in-app.
  useEffect(() => {
    if (!room) return;

    function notifyLeave() {
      if (!connectionId) return;
      const payload = JSON.stringify({ connectionId });
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon?.(`/api/rooms/${room!.roomHash}/leave`, blob);
    }

    window.addEventListener("beforeunload", notifyLeave);

    return () => {
      window.removeEventListener("beforeunload", notifyLeave);
      notifyLeave();
    };
  }, [connectionId, room]);

  if (!room || room.status !== "active") {
    return (
      <main className="meeting-unavailable">
        <div className="meeting-unavailable__card">
          <span className="meeting-unavailable__icon">
            <AlertTriangle aria-hidden="true" className="icon-20" />
          </span>
          <h1 className="meeting-unavailable__title">
            {room ? "ห้องประชุมนี้สิ้นสุดแล้ว" : "ไม่พบห้องประชุม"}
          </h1>
          <p className="meeting-unavailable__description">
            {room
              ? "ห้องที่สิ้นสุดหรือปิดแล้วไม่สามารถเข้าร่วมได้"
              : `ไม่พบห้องสำหรับรหัส ${requestedSlug}`}
          </p>
          <Link href="/dashboard" className="meeting-unavailable__link focus-ring">
            กลับไปที่แดชบอร์ด
          </Link>
        </div>
      </main>
    );
  }

  const joinRoom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setNameError("กรุณากรอกชื่อของคุณ");
      return;
    }

    setDisplayName(trimmedName);
    setHasJoined(true);
  };

  if (!hasJoined) {
    return (
      <main className="meeting-lobby">
        <form onSubmit={joinRoom} className="meeting-lobby__card">
          <span className="meeting-lobby__room-icon">
            <Video aria-hidden="true" className="meeting-lobby__video-icon" />
          </span>
          <h1 className="meeting-lobby__title">{room.roomName}</h1>
          <p className="meeting-lobby__occupancy">
            รองรับผู้เข้าร่วมสูงสุด {room.maxParticipants} คน
          </p>

          <div className="meeting-lobby__field">
            <label htmlFor="meeting-display-name" className="meeting-lobby__label">
              display_name
            </label>
            <input
              id="meeting-display-name"
              type="text"
              value={displayName}
              onChange={(event) => {
                setDisplayName(event.target.value);
                setNameError("");
              }}
              placeholder="ชื่อของคุณ"
              autoComplete="name"
              autoFocus
              className="meeting-lobby__input"
            />
            {nameError && (
              <p role="alert" className="meeting-lobby__error">
                {nameError}
              </p>
            )}
          </div>

          <button type="submit" className="meeting-lobby__join focus-ring">
            เข้าร่วมห้องประชุม
          </button>
        </form>
      </main>
    );
  }

  const participants: ParticipantTile[] = [
    {
      name: displayName,
      initials: displayName.slice(0, 2),
      isHost,
      isSpeaking: !isMicrophoneMuted,
      isMuted: isMicrophoneMuted,
    },
    ...otherParticipants.map((participant) => ({
      name: participant.displayName,
      initials: participant.displayName.slice(0, 2),
      // Mic/speaking state isn't known yet without a real audio connection (LiveKit).
      isMuted: false,
      isSpeaking: false,
    })),
  ];

  const toggleMicrophone = () => {
    // TODO: Connect this local state toggle to LiveKit microphone control.
    setIsMicrophoneMuted((isMuted) => !isMuted);
  };

  return (
    <main className="meeting-room">
      <header className="meeting-room__header">
        <div>
          <h1 className="meeting-room__title">{room.roomName}</h1>
          <p className="meeting-room__meta">12:34 · กำลังบันทึกเสียง</p>
        </div>
        <span className="meeting-room__recording">
          <span aria-hidden="true" className="meeting-room__recording-dot" />
          REC
        </span>
        <span className="meeting-room__count">
          <Users aria-hidden="true" className="icon-16" />
          {participants.length} / {room.maxParticipants}
        </span>
      </header>

      <div className="meeting-room__layout">
        <section aria-label="ผู้เข้าร่วมประชุม" className="meeting-room__stage">
          <div className="meeting-room__tiles">
            {participants.map((participant, index) => (
              <article
                key={`${participant.name}-${index}`}
                className={
                  participant.isSpeaking
                    ? "meeting-participant meeting-participant--speaking"
                    : "meeting-participant"
                }
              >
                <span
                  className={`meeting-participant__avatar meeting-participant__avatar--${index + 1}`}
                >
                  {participant.initials}
                </span>
                <h2 className="meeting-participant__name">
                  {participant.name}
                  {participant.isHost ? " (host)" : ""}
                </h2>
                {participant.isMuted ? (
                  <MicOff aria-label="ปิดไมโครโฟน" className="meeting-participant__mic" />
                ) : (
                  <Mic
                    aria-label="เปิดไมโครโฟน"
                    className={
                      participant.isSpeaking
                        ? "meeting-participant__mic meeting-participant__mic--active"
                        : "meeting-participant__mic"
                    }
                  />
                )}
              </article>
            ))}
          </div>
        </section>

        <aside className="meeting-room__participants">
          <h2 className="meeting-room__participants-title">ผู้เข้าร่วม ({participants.length})</h2>
          <ul className="meeting-room__participants-list">
            {participants.map((participant, index) => (
              <li key={`${participant.name}-list-${index}`} className="meeting-room__participant-row">
                <span>
                  {participant.name}
                  {participant.isHost ? " (host)" : ""}
                </span>
                {participant.isMuted ? (
                  <MicOff aria-label="ปิดไมโครโฟน" className="icon-14" />
                ) : (
                  <Mic
                    aria-label="เปิดไมโครโฟน"
                    className={participant.isSpeaking ? "icon-14 text-emerald-400" : "icon-14"}
                  />
                )}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <footer className="meeting-room__controls" aria-label="ตัวควบคุมการประชุม">
        <button
          type="button"
          onClick={toggleMicrophone}
          aria-label={isMicrophoneMuted ? "เปิดไมโครโฟน" : "ปิดไมโครโฟน"}
          aria-pressed={isMicrophoneMuted}
          className={
            isMicrophoneMuted
              ? "meeting-control meeting-control--muted focus-ring"
              : "meeting-control focus-ring"
          }
        >
          {isMicrophoneMuted ? (
            <MicOff aria-hidden="true" className="icon-20" />
          ) : (
            <Mic aria-hidden="true" className="icon-20" />
          )}
        </button>
        <button type="button" aria-label="ผู้เข้าร่วม" className="meeting-control focus-ring">
          <Users aria-hidden="true" className="icon-20" />
        </button>
        <Link href="/dashboard" aria-label="ออกจากห้อง" className="meeting-control meeting-control--leave focus-ring">
          <Phone aria-hidden="true" className="icon-20" />
        </Link>
        <span className="sr-only">
          <Radio aria-hidden="true" />
          <LogOut aria-hidden="true" />
          การควบคุมเสียงเป็นเพียงส่วนติดต่อผู้ใช้ในขณะนี้
        </span>
      </footer>
    </main>
  );
}
