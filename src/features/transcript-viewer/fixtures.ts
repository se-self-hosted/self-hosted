import type {
  TranscriptMeetingViewModel,
  TranscriptParticipant,
  TranscriptViewerState,
} from "./types";

const participants: TranscriptParticipant[] = [
  { id: "thanakorn", displayName: "Thanakorn P.", initials: "TP", color: "indigo" },
  { id: "siriporn", displayName: "Siriporn L.", initials: "SL", color: "cyan" },
  { id: "wichai", displayName: "Wichai A.", initials: "WA", color: "violet" },
  { id: "nattaya", displayName: "Nattaya S.", initials: "NS", color: "emerald" },
  { id: "guest", displayName: "Guest", initials: "+1", color: "amber" },
];

function createMeeting(meetingId: string): TranscriptMeetingViewModel {
  return {
    id: meetingId,
    title: "Engineering Stand-up",
    startedAt: "2026-07-18T17:00:00+07:00",
    durationSeconds: 1845,
    participants,
  };
}

/**
 * Temporary presentation fixture for SHT-121/SHT-122.
 * Replace this function at the page boundary when the SHT-120 API is available.
 */
export function getTranscriptFixture(meetingId: string): TranscriptViewerState {
  if (meetingId === "loading") return { status: "loading" };
  if (meetingId === "error") {
    return { status: "error", message: "ไม่สามารถโหลด Transcript ได้ กรุณาลองใหม่อีกครั้ง" };
  }

  const meeting = createMeeting(meetingId);
  if (meetingId === "empty") return { status: "empty", meeting, segments: [] };

  return {
    status: "ready",
    meeting,
    segments: [
      {
        id: "segment-1",
        speaker: participants[0],
        spokenAt: "2026-07-18T17:00:00+07:00",
        text: "สวัสดีทุกคน วันนี้เราจะพูดถึงแผน Q3 ของทีมผลิตภัณฑ์ เริ่มจาก OKR ที่เราตั้งไว้ก่อนเลยนะครับ",
      },
      {
        id: "segment-2",
        speaker: participants[1],
        spokenAt: "2026-07-18T17:02:00+07:00",
        text: "โอเคค่ะ ฉันเพิ่ง pull ข้อมูลมาจาก analytics เมื่อวาน ตัวเลข conversion ขึ้นมา 12% จากเดือนที่แล้ว",
      },
      {
        id: "segment-3",
        speaker: participants[2],
        spokenAt: "2026-07-18T17:05:00+07:00",
        text: "ดีมากเลยครับ แต่เรายังต้องดู retention ด้วยนะ ผมว่า 7-day retention ยังต่ำอยู่",
      },
      {
        id: "segment-4",
        speaker: participants[0],
        spokenAt: "2026-07-18T17:08:00+07:00",
        text: "เห็นด้วยครับ งั้นเราลองโฟกัสที่ onboarding flow ใหม่ก่อนดีกว่า มีใครอยากรับผิดชอบส่วนนี้บ้างไหมครับ",
      },
      {
        id: "segment-5",
        speaker: participants[3],
        spokenAt: "2026-07-18T17:11:00+07:00",
        text: "หนูรับได้เลยค่ะ จะทำ user research เพิ่มเติมก่อน แล้วนำเสนอใน sprint review สัปดาห์หน้า",
      },
    ],
  };
}
