"use client";

import { useEffect, useRef, useState } from "react";
import { Users, FileText, Video, AlertCircle, Loader2, Download, Play, Pause } from "lucide-react";
import { MeetingSummaryDisplay } from "./MeetingSummaryDisplay";
import type { MeetingSummary } from "../types";

type Session = {
  id: string;
  joinedAt: string;
  leftAt: string | null;
  durationSeconds: number | null;
};

type Participant = {
  id: string;
  displayName: string;
  createdAt: string;
  sessions: Session[];
};

type TranscriptSegment = {
  id: string;
  participantId: string;
  speakerName: string;
  startTime: number;
  endTime: number;
  text: string;
};

type Recording = {
  id: string;
  participantId: string | null;
  speakerName: string | null;
  fileName: string;
  startOffsetSeconds: number | null;
  durationSeconds: number | null;
  fileSize: string;
  mimeType: string;
  playbackUrl: string;
};

type MeetingData = {
  isHost: boolean;
  roomName: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  participants: Participant[];
  transcript: { segments: TranscriptSegment[] } | null;
  summary: MeetingSummary | null;
  recordings: Recording[];
};

type MeetingDetailProps = {
  meetingId: string;
};

const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Bangkok",
});

function formatDuration(totalSeconds: number | null) {
  if (totalSeconds == null) return "0s";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [hours ? `${hours}h` : "", minutes ? `${minutes}m` : "", !hours && seconds ? `${seconds}s` : ""]
    .filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "0s";
}

function formatTimestamp(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

export function MeetingDetail({ meetingId }: MeetingDetailProps) {
  const [meeting, setMeeting] = useState<MeetingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [playbackErrors, setPlaybackErrors] = useState<Record<string, string>>({});
  const mediaRefs = useRef<Record<string, HTMLMediaElement | null>>({});
  const [nowPlaying, setNowPlaying] = useState<{
    recordingId: string;
    speakerName: string;
    currentTime: number;
    duration: number;
    paused: boolean;
  } | null>(null);
  const trackedMediaRef = useRef<HTMLMediaElement | null>(null);

  function findRecordingForSegment(seg: TranscriptSegment): Recording | null {
    if (!meeting) return null;

    // Each participant records only their own mic, so a segment can only ever
    // live in that same participant's recording(s) — never fall back to
    // another speaker's file just because its time window happens to
    // overlap; that plays the wrong person's voice.
    const ownTracks = meeting.recordings.filter(
      (r) => r.participantId === seg.participantId && r.startOffsetSeconds !== null,
    );
    if (ownTracks.length === 0) return null;

    const containing = ownTracks.find(
      (r) =>
        seg.startTime >= r.startOffsetSeconds! &&
        (r.durationSeconds == null || seg.startTime <= r.startOffsetSeconds! + r.durationSeconds),
    );
    if (containing) return containing;

    const before = ownTracks
      .filter((r) => r.startOffsetSeconds! <= seg.startTime)
      .sort((a, b) => b.startOffsetSeconds! - a.startOffsetSeconds!)[0];
    return before || ownTracks[0];
  }

  // Plays quietly behind the transcript — no player UI takes over the page,
  // just a small floating bar (below) that mirrors whatever is playing.
  function trackNowPlaying(recording: Recording, media: HTMLMediaElement) {
    if (trackedMediaRef.current && trackedMediaRef.current !== media) {
      trackedMediaRef.current.onplay = null;
      trackedMediaRef.current.onpause = null;
      trackedMediaRef.current.ontimeupdate = null;
      trackedMediaRef.current.onended = null;
    }
    trackedMediaRef.current = media;

    const sync = () => {
      setNowPlaying({
        recordingId: recording.id,
        speakerName: recording.speakerName ?? recording.fileName,
        currentTime: media.currentTime,
        duration: Number.isFinite(media.duration) ? media.duration : 0,
        paused: media.paused,
      });
    };
    media.onplay = sync;
    media.onpause = sync;
    media.ontimeupdate = sync;
    media.onended = sync;
    sync();
  }

  function playSegment(seg: TranscriptSegment) {
    const recording = findRecordingForSegment(seg);
    if (!recording) return;
    const media = mediaRefs.current[recording.id];
    if (!media) return;
    const target = Math.max(0, seg.startTime - (recording.startOffsetSeconds ?? 0));
    // A stale/underestimated durationSeconds can let a segment match a
    // recording it doesn't actually fall inside of; without this clamp the
    // browser silently snaps an out-of-range currentTime to the file's very
    // end instead of erroring, which looks like "it plays right at the end".
    media.currentTime = Number.isFinite(media.duration) && media.duration > 0
      ? Math.min(target, Math.max(0, media.duration - 0.05))
      : target;
    trackNowPlaying(recording, media);
    void media.play();
  }

  function toggleNowPlayingPause() {
    const media = trackedMediaRef.current;
    if (!media) return;
    if (media.paused) void media.play();
    else media.pause();
  }

  function seekNowPlaying(time: number) {
    const media = trackedMediaRef.current;
    if (!media) return;
    media.currentTime = time;
  }

  function handlePlaybackError(id: string, media: HTMLMediaElement) {
    const messages: Record<number, string> = {
      1: "การโหลดเสียงถูกยกเลิก กรุณารีเฟรชแล้วลองอีกครั้ง",
      2: "โหลดไฟล์เสียงไม่สำเร็จ กรุณาตรวจการเชื่อมต่อแล้วลองอีกครั้ง",
      3: "เบราว์เซอร์ถอดรหัสไฟล์เสียงนี้ไม่ได้ ไฟล์อาจไม่สมบูรณ์",
      4: "ไม่สามารถเปิดไฟล์เสียงได้ แหล่งไฟล์หรือรูปแบบเสียงอาจไม่รองรับ",
    };
    setPlaybackErrors((previous) => ({
      ...previous,
      [id]: messages[media.error?.code ?? 0] || "ไม่สามารถเล่นไฟล์เสียงนี้ได้",
    }));
  }

  function clearPlaybackError(id: string) {
    setPlaybackErrors((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }

  useEffect(() => {
    fetch(`/api/meetings/${meetingId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch meeting details");
        return res.json();
      })
      .then((data: { meeting?: MeetingData }) => {
        if (data.meeting) {
          setMeeting(data.meeting);
        } else {
          setError("Meeting not found");
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [meetingId]);

  if (isLoading) {
    return (
      <div className="meeting-detail__loading">
        <Loader2 className="animate-spin icon-24" /> กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="meeting-detail__error">
        <AlertCircle className="icon-24" /> {error || "ไม่พบข้อมูลการประชุม"}
      </div>
    );
  }

  return (
    <div className="meeting-detail__content">

      {/* 1. Meeting Information and Duration */}
      <section className="card p-6">
        <h3 className="text-lg font-semibold mb-4">ข้อมูลการประชุม: {meeting.roomName}</h3>
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}
        >
          <div>
            <p className="text-sm text-gray-500">เวลาเริ่ม</p>
            <p className="font-medium">{dateFormatter.format(new Date(meeting.startedAt))}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">เวลาสิ้นสุด</p>
            <p className="font-medium">
              {meeting.endedAt ? dateFormatter.format(new Date(meeting.endedAt)) : "ยังไม่สิ้นสุด"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">ระยะเวลา</p>
            <p className="font-medium">{formatDuration(meeting.durationSeconds)}</p>
          </div>
        </div>
      </section>

      {/* 2. Participant List and Attendance Information (Multiple Sessions) */}
      <section className="card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="icon-20" /> ผู้เข้าร่วม ({meeting.participants.length} คน)
        </h3>
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table className="meeting-history__table">
            <thead>
              <tr>
                <th>ชื่อ</th>
                <th>เวลาเข้า</th>
                <th>เวลาออก</th>
                <th>ระยะเวลา</th>
                <th>จำนวนครั้ง (เซสชัน)</th>
              </tr>
            </thead>
            <tbody>
              {meeting.participants.map((p) => {
                const totalDuration = p.sessions.reduce((acc, s) => acc + (s.durationSeconds ?? 0), 0);
                const firstJoined = p.sessions.length > 0 ? p.sessions[0].joinedAt : p.createdAt;
                const lastLeft = p.sessions.length > 0 ? p.sessions[p.sessions.length - 1].leftAt : null;

                return (
                  <tr key={p.id}>
                    <td><strong>{p.displayName}</strong></td>
                    <td>{dateFormatter.format(new Date(firstJoined))}</td>
                    <td>{lastLeft ? dateFormatter.format(new Date(lastLeft)) : "ยังไม่ออก"}</td>
                    <td>{formatDuration(totalDuration)}</td>
                    <td>
                      {p.sessions.length} ครั้ง
                      {p.sessions.length > 1 && (
                        <div className="text-xs text-gray-400 mt-1">
                          {p.sessions.map((s, i) => (
                            <div key={s.id}>#{i + 1}: {formatDuration(s.durationSeconds)}</div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. AI Summary */}
      <MeetingSummaryDisplay
        summary={meeting.summary}
        showRegenerate={meeting.isHost}
      />

      {/* 4. Transcript */}
      {meeting.transcript && (
        <section className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="icon-20" /> Transcript
          </h3>
          <div className="transcript-segments">
            {meeting.transcript.segments.map((seg) => {
              const playable = findRecordingForSegment(seg) !== null;
              return (
                <div
                  key={seg.id}
                  className={`transcript-segment${playable ? " transcript-segment--playable" : ""}`}
                  role={playable ? "button" : undefined}
                  tabIndex={playable ? 0 : undefined}
                  title={playable ? "คลิกเพื่อฟังเสียงที่บันทึกไว้ ณ จุดนี้" : undefined}
                  onClick={playable ? () => playSegment(seg) : undefined}
                  onKeyDown={
                    playable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            playSegment(seg);
                          }
                        }
                      : undefined
                  }
                >
                  <div className="transcript-segment__time">
                    {formatTimestamp(seg.startTime)}
                  </div>
                  <div>
                    <strong className="transcript-segment__speaker">{seg.speakerName}</strong>
                    <p className="transcript-segment__text">{seg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Recordings */}
      {meeting.recordings.length > 0 && (
        <section className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Video className="icon-20" /> วิดีโอ/เสียงที่บันทึก
          </h3>
          <ul className="recordings-list">
            {meeting.recordings.map((rec) => (
              <li key={rec.id} className="recordings-list__item">
                <div>
                  <p className="recordings-list__name">{rec.speakerName ?? rec.fileName}</p>
                  <p className="recordings-list__meta">
                    {formatDuration(rec.durationSeconds)} • {(parseInt(rec.fileSize) / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {rec.playbackUrl && (
                  <div className="recordings-list__actions">
                    {rec.mimeType.startsWith("video") ? (
                      <video
                        ref={(el) => { mediaRefs.current[rec.id] = el; }}
                        controls src={rec.playbackUrl} className="recordings-list__preview"
                        onError={(event) => handlePlaybackError(rec.id, event.currentTarget)}
                        onCanPlay={() => clearPlaybackError(rec.id)}
                      />
                    ) : (
                      <>
                        <button
                          type="button"
                          className="recordings-list__play-btn"
                          aria-label={`เล่นเสียง ${rec.speakerName ?? rec.fileName}`}
                          onClick={() => {
                            const media = mediaRefs.current[rec.id];
                            if (!media) return;
                            trackNowPlaying(rec, media);
                            void media.play();
                          }}
                        >
                          <Play className="icon-16" />
                        </button>
                        <audio
                          ref={(el) => { mediaRefs.current[rec.id] = el; }}
                          preload="metadata" src={rec.playbackUrl}
                          aria-hidden="true"
                          onError={(event) => handlePlaybackError(rec.id, event.currentTarget)}
                          onCanPlay={() => clearPlaybackError(rec.id)}
                        />
                      </>
                    )}
                    {playbackErrors[rec.id] && (
                      <p role="alert" className="text-sm text-red-600">{playbackErrors[rec.id]}</p>
                    )}
                    <a
                      href={rec.playbackUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="recordings-list__download"
                    >
                      <Download className="icon-16" /> ดาวน์โหลด
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {nowPlaying && (
        <div className="now-playing-bar" role="region" aria-label="กำลังเล่นเสียง">
          <button
            type="button"
            onClick={toggleNowPlayingPause}
            aria-label={nowPlaying.paused ? "เล่น" : "หยุดชั่วคราว"}
            className="now-playing-bar__toggle"
          >
            {nowPlaying.paused ? <Play className="icon-16" /> : <Pause className="icon-16" />}
          </button>
          <span className="now-playing-bar__speaker">{nowPlaying.speakerName}</span>
          <span className="now-playing-bar__time">
            {formatTimestamp(nowPlaying.currentTime)} / {formatTimestamp(nowPlaying.duration)}
          </span>
          <input
            type="range"
            className="now-playing-bar__seek"
            min={0}
            max={nowPlaying.duration || 0}
            step={0.1}
            value={nowPlaying.currentTime}
            onChange={(e) => seekNowPlaying(Number(e.target.value))}
            aria-label="ตำแหน่งเสียง"
          />
        </div>
      )}
    </div>
  );
}
