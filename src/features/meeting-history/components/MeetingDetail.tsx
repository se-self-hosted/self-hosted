"use client";

import { useEffect, useState } from "react";
import { Clock3, Users, FileText, Video, AlertCircle, Loader2, Download } from "lucide-react";

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
  const [meeting, setMeeting] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/meetings/${meetingId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch meeting details");
        return res.json();
      })
      .then(data => {
        if (data.meeting) {
          setMeeting(data.meeting);
        } else {
          setError("Meeting not found");
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [meetingId]);

  if (isLoading) {
    return <div className="meeting-detail__loading"><Loader2 className="animate-spin icon-24" /> กำลังโหลดข้อมูล...</div>;
  }

  if (error || !meeting) {
    return <div className="meeting-detail__error"><AlertCircle className="icon-24" /> {error || "ไม่พบข้อมูลการประชุม"}</div>;
  }

  return (
    <div className="meeting-detail__content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1.5rem' }}>
      
      {/* 1. Meeting Information and Duration */}
      <section className="card p-6" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', padding: '1.5rem' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>ข้อมูลการประชุม: {meeting.roomName}</h3>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <p className="text-sm text-gray-500" style={{ color: '#666', fontSize: '0.875rem' }}>เวลาเริ่ม</p>
            <p className="font-medium" style={{ fontWeight: 500 }}>{dateFormatter.format(new Date(meeting.startedAt))}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500" style={{ color: '#666', fontSize: '0.875rem' }}>เวลาสิ้นสุด</p>
            <p className="font-medium" style={{ fontWeight: 500 }}>{meeting.endedAt ? dateFormatter.format(new Date(meeting.endedAt)) : "ยังไม่สิ้นสุด"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500" style={{ color: '#666', fontSize: '0.875rem' }}>ระยะเวลา</p>
            <p className="font-medium" style={{ fontWeight: 500 }}>{formatDuration(meeting.durationSeconds)}</p>
          </div>
        </div>
      </section>

      {/* 2. Participant List and Attendance Information (Multiple Sessions) */}
      <section className="card p-6" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', padding: '1.5rem' }}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users className="icon-20" /> ผู้เข้าร่วม ({meeting.participants.length} คน)
        </h3>
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="meeting-history__table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '0.75rem 0' }}>ชื่อ</th>
                <th>เวลาเข้า</th>
                <th>เวลาออก</th>
                <th>ระยะเวลา</th>
                <th>จำนวนครั้ง (เซสชัน)</th>
              </tr>
            </thead>
            <tbody>
              {meeting.participants.map((p: any) => {
                const totalDuration = p.sessions.reduce((acc: number, s: any) => acc + (s.durationSeconds || 0), 0);
                const firstJoined = p.sessions.length > 0 ? p.sessions[0].joinedAt : p.createdAt;
                const lastLeft = p.sessions.length > 0 ? p.sessions[p.sessions.length - 1].leftAt : null;
                
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '0.75rem 0' }}><strong>{p.displayName}</strong></td>
                    <td>{dateFormatter.format(new Date(firstJoined))}</td>
                    <td>{lastLeft ? dateFormatter.format(new Date(lastLeft)) : "ยังไม่ออก"}</td>
                    <td>{formatDuration(totalDuration)}</td>
                    <td>
                      {p.sessions.length} ครั้ง
                      {p.sessions.length > 1 && (
                        <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>
                          {p.sessions.map((s: any, i: number) => (
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

      {/* 3. Transcript Retrieval */}
      {meeting.transcript && (
        <section className="card p-6" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', padding: '1.5rem' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center justify-between" style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText className="icon-20" /> Transcript</div>
          </h3>
          <div className="transcript-segments" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', padding: '1rem', background: '#fafafa', borderRadius: '4px' }}>
            {meeting.transcript.segments.map((seg: any) => (
              <div key={seg.id} className="transcript-segment" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ minWidth: '60px', color: '#666', fontSize: '0.875rem' }}>
                  {formatDuration(Math.floor(seg.startTime))}
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.875rem', color: '#333' }}>{seg.speakerName}</strong>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#111' }}>{seg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recordings (if any) */}
      {meeting.recordings && meeting.recordings.length > 0 && (
        <section className="card p-6" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', padding: '1.5rem' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Video className="icon-20" /> วิดีโอ/เสียงที่บันทึก
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {meeting.recordings.map((rec: any) => (
              <li key={rec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #eaeaea', borderRadius: '4px' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500 }}>{rec.fileName}</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#666' }}>{formatDuration(rec.durationSeconds)} • {(parseInt(rec.fileSize) / (1024*1024)).toFixed(2)} MB</p>
                </div>
                {rec.presignedUrl && (
                  <a href={rec.presignedUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#0066cc', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '0.875rem' }}>
                    <Download className="icon-16" /> ดาวน์โหลด
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  );
}
