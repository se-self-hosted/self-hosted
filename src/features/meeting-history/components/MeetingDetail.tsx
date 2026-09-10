"use client";

import { useEffect, useState } from "react";
import { Users, FileText, Video, AlertCircle, Loader2, Download } from "lucide-react";

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
  speakerName: string;
  startTime: number;
  endTime: number;
  text: string;
};

type Recording = {
  id: string;
  fileName: string;
  durationSeconds: number | null;
  fileSize: string;
  mimeType: string;
  playbackUrl: string;
};

type MeetingData = {
  roomName: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  participants: Participant[];
  transcript: { segments: TranscriptSegment[] } | null;
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
  return [hours ? `${hours}h` : "", minutes ? `${minutes}m` : "", !hours && seconds ? `${seconds}s` : ""]
    .filter(Boolean)
    .join(" ");
}

export function MeetingDetail({ meetingId }: MeetingDetailProps) {
  const [meeting, setMeeting] = useState<MeetingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [playbackErrors, setPlaybackErrors] = useState<Record<string, string>>({});

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

      {/* 3. Transcript */}
      {meeting.transcript && (
        <section className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="icon-20" /> Transcript
          </h3>
          <div className="transcript-segments">
            {meeting.transcript.segments.map((seg) => (
              <div key={seg.id} className="transcript-segment">
                <div className="transcript-segment__time">
                  {formatDuration(Math.floor(seg.startTime))}
                </div>
                <div>
                  <strong className="transcript-segment__speaker">{seg.speakerName}</strong>
                  <p className="transcript-segment__text">{seg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Recordings */}
      {meeting.recordings.length > 0 && (
        <section className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Video className="icon-20" /> วิดีโอ/เสียงที่บันทึก
          </h3>
          <ul className="recordings-list">
            {meeting.recordings.map((rec) => (
              <li key={rec.id} className="recordings-list__item">
                <div>
                  <p className="recordings-list__name">{rec.fileName}</p>
                  <p className="recordings-list__meta">
                    {formatDuration(rec.durationSeconds)} • {(parseInt(rec.fileSize) / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {rec.playbackUrl && (
                  <div className="recordings-list__actions">
                    {rec.mimeType.startsWith("video") ? (
                      <video
                        controls src={rec.playbackUrl} className="recordings-list__preview"
                        onError={(event) => handlePlaybackError(rec.id, event.currentTarget)}
                        onCanPlay={() => clearPlaybackError(rec.id)}
                      />
                    ) : (
                      <audio
                        controls preload="metadata" src={rec.playbackUrl}
                        aria-label={`เล่นเสียง ${rec.fileName}`}
                        onError={(event) => handlePlaybackError(rec.id, event.currentTarget)}
                        onCanPlay={() => clearPlaybackError(rec.id)}
                      />
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

    </div>
  );
}
