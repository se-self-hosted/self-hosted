"use client";

import { memo, useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { Mic, MicOff, VolumeX } from "lucide-react";
import type { LiveTranscriptSegment } from "./MeetingRoomView";

// Leaf components of the meeting room. Each re-renders only when its own
// props change, so a speaker change, a REC tick or an interim transcript
// update doesn't re-render every tile, row and transcript line in the room.

export function formatSeconds(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/** Profile photo when the participant has one, initials otherwise (or if it fails to load). */
export function ParticipantAvatar({ avatarUrl, initials }: { avatarUrl: string | null; initials: string }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  if (!avatarUrl || failedUrl === avatarUrl) return <>{initials}</>;
  // eslint-disable-next-line @next/next/no-img-element -- a small same-origin avatar; next/image adds nothing here
  return <img src={avatarUrl} alt="" className="participant-avatar__image" onError={() => setFailedUrl(avatarUrl)} />;
}

type ParticipantViewProps = {
  id: string;
  name: string;
  initials: string;
  avatarUrl: string | null;
  role: string;
  tone: string;
  isSpeaking: boolean;
  isMuted: boolean;
  onMute?: (id: string) => void;
};

export const ParticipantTile = memo(function ParticipantTile({
  id, name, initials, avatarUrl, role, tone, isSpeaking, isMuted, onMute,
}: ParticipantViewProps) {
  const speaking = isSpeaking && !isMuted;
  return (
    <article className={`meeting-participant${speaking ? " meeting-participant--speaking" : ""}`}>
      {/* Active Speaker Indicator Badge */}
      {speaking && <span className="meeting-participant__speaking">กำลังพูด</span>}

      <div className="meeting-participant__corner">
        {/* Host Mute Remote Participant Button */}
        {onMute && (
          <button
            type="button"
            onClick={() => onMute(id)}
            title="ปิดไมโครโฟนผู้เข้าร่วมนี้"
            aria-label={`ปิดไมโครโฟนของ ${name}`}
            className="meeting-participant__mute-btn focus-ring"
          >
            <VolumeX aria-hidden="true" className="icon-16" strokeWidth={1.8} />
          </button>
        )}
        {isMuted && (
          <span title="ปิดไมโครโฟน" className="meeting-participant__muted">
            <MicOff aria-label="ปิดไมโครโฟน" className="icon-16" strokeWidth={1.8} />
          </span>
        )}
      </div>

      <span className={`meeting-participant__avatar ${tone}`}>
        <ParticipantAvatar avatarUrl={avatarUrl} initials={initials} />
      </span>

      <div className="meeting-participant__identity">
        <h2 className="meeting-participant__name">{name}</h2>
        <p className="meeting-participant__role">{role}</p>
      </div>
    </article>
  );
});

export const ParticipantRow = memo(function ParticipantRow({
  id, name, initials, avatarUrl, role, tone, isSpeaking, isMuted, onMute,
}: ParticipantViewProps) {
  return (
    <li className="meeting-room__participant-row">
      <span aria-hidden="true" className={`meeting-room__row-avatar ${tone}`}>
        <ParticipantAvatar avatarUrl={avatarUrl} initials={initials} />
      </span>
      <div className="meeting-room__row-info">
        <span className="meeting-room__row-name">{name}</span>
        <span className="meeting-room__row-role">{role}</span>
      </div>

      <div className="meeting-room__row-icons">
        {/* Host Mute button in participant list */}
        {onMute && (
          <button
            type="button"
            onClick={() => onMute(id)}
            title="ปิดไมค์"
            aria-label={`ปิดไมค์ของ ${name}`}
            className="meeting-room__row-mute-btn focus-ring"
          >
            <VolumeX aria-hidden="true" className="icon-16" strokeWidth={1.8} />
          </button>
        )}
        {isMuted ? (
          <MicOff aria-label="ปิดไมโครโฟน" className="icon-18 text-bad" strokeWidth={1.8} />
        ) : (
          <Mic
            aria-label="เปิดไมโครโฟน"
            className={isSpeaking ? "icon-18 text-ok-dot" : "icon-18"}
            strokeWidth={1.8}
          />
        )}
      </div>
    </li>
  );
});

/** The REC clock ticks here, not in the room, so only this badge re-renders each second. */
export function RecordingTimer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(startedAt);
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  return <>REC {formatSeconds(Math.max(0, (now - startedAt) / 1000))}</>;
}

export type TextStore = {
  get: () => string;
  set: (value: string) => void;
  subscribe: (listener: () => void) => () => void;
};

/** Holds a fast-changing string outside React state, for leaf components to subscribe to. */
export function createTextStore(): TextStore {
  let value = "";
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set: (next) => {
      if (next === value) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export type SpeakerStyle = { tone: string; avatarUrl: string | null };

export const TranscriptLines = memo(function TranscriptLines({
  segments, participantId, displayName, speakers,
}: {
  segments: LiveTranscriptSegment[];
  participantId: string | null;
  displayName: string;
  speakers: ReadonlyMap<string, SpeakerStyle>;
}) {
  return segments.map((seg) => {
    const isOwn = seg.participantId ? seg.participantId === participantId : seg.speakerName === displayName;
    if (isOwn) {
      return (
        <div key={seg.id} className="bubble-row--mine">
          <p className="bubble--mine">{seg.text}</p>
          <span className="bubble-row__time">
            คุณ · {formatSeconds(seg.startTime)} – {formatSeconds(seg.endTime)}
          </span>
        </div>
      );
    }
    const speaker = seg.participantId ? speakers.get(seg.participantId) : undefined;
    return (
      <div key={seg.id} className="bubble-row--theirs">
        <span aria-hidden="true" className={`bubble-row__avatar ${speaker?.tone ?? "tone-6"}`}>
          <ParticipantAvatar
            avatarUrl={speaker?.avatarUrl ?? null}
            initials={seg.speakerName.slice(0, 2).toUpperCase()}
          />
        </span>
        <div className="bubble-row__body">
          <span className="bubble-row__who">{seg.speakerName}</span>
          <p className="bubble--theirs">{seg.text}</p>
          <span className="bubble-row__time">
            {formatSeconds(seg.startTime)} – {formatSeconds(seg.endTime)}
          </span>
        </div>
      </div>
    );
  });
});

/**
 * The unconfirmed line being spoken now (or the empty-state hint), fed by the
 * recognizer several times a second. It keeps the list scrolled to the newest
 * text while the reader is following it.
 */
export function InterimTranscript({
  store, isMuted, hasSegments, listRef, followRef,
}: {
  store: TextStore;
  isMuted: boolean;
  hasSegments: boolean;
  listRef: RefObject<HTMLDivElement | null>;
  followRef: RefObject<boolean>;
}) {
  const interim = useSyncExternalStore(store.subscribe, store.get, () => "");
  const showInterim = Boolean(interim) && !isMuted;

  useEffect(() => {
    const list = listRef.current;
    if (showInterim && list && followRef.current) list.scrollTo({ top: list.scrollHeight });
  }, [interim, showInterim, listRef, followRef]);

  if (showInterim) {
    return (
      <div aria-label="ข้อความถอดเสียงที่ยังไม่ยืนยัน" className="bubble-row--mine">
        <p className="bubble--interim">{interim}</p>
      </div>
    );
  }
  if (!hasSegments) {
    return <p className="live-transcript__empty">ยังไม่มีข้อความ เมื่อมีคนพูด ข้อความจะแสดงที่นี่</p>;
  }
  return null;
}
