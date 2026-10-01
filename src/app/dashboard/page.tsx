"use client";

import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import {
  AudioLines,
  CalendarDays,
  Check,
  CircleSlash,
  Clock3,
  Disc,
  Download,
  FileText,
  Headphones,
  Link2,
  LogIn,
  Minus,
  Pause,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Timer,
  Trash2,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { AppSidebar } from "@/components/app-shell/AppSidebar";

type Room = {
  id: string;
  slug: string;
  name: string;
  status: "active" | "ended";
  participants?: number;
  capacity: number;
  isHostInRoom?: boolean;
};

type PastMeeting = {
  id: string;
  roomId: string;
  roomName: string;
  roomHash: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  participantsCount: number;
  participants: { id: string; displayName: string; sessionCount: number }[];
  recordings: {
    id: string;
    fileName: string;
    durationSeconds: number | null;
    fileSize: string;
    mimeType: string;
    createdAt: string;
    playbackUrl: string;
  }[];
  hasTranscript: boolean;
  hasSummary: boolean;
};

type MeetingDetails = {
  id: string;
  roomId: string;
  roomName: string;
  roomHash: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  isHost: boolean;
  participants: {
    id: string;
    displayName: string;
    createdAt: string;
    sessions: { id: string; joinedAt: string; leftAt: string | null; durationSeconds: number | null }[];
  }[];
  recordings: {
    id: string;
    fileName: string;
    objectKey: string;
    participantId: string;
    startOffsetSeconds: number | null;
    durationSeconds: number | null;
    fileSize: string;
    mimeType: string;
    createdAt: string;
    playbackUrl: string;
    presignedUrl: string;
  }[];
  transcript: {
    id: string;
    fullTranscript: string;
    language: string;
    createdAt: string;
    segments: {
      id: string;
      participantId: string;
      speakerName: string;
      startTime: number;
      endTime: number;
      spokenAt: string;
      text: string;
      confidence: number;
    }[];
  } | null;
  summary: {
    id: string;
    aiSummary: string;
    editedSummary: string | null;
    llmModel: string;
    generatedAt: string;
    editedAt: string | null;
  } | null;
};

export default function DashboardPage() {
  const { user, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [currentTab, setCurrentTab] = useState<"rooms" | "history">("rooms");

  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<PastMeeting[]>([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);

  const [copiedRoomId, setCopiedRoomId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedRoomSlug, setSelectedRoomSlug] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("1");
  const [formError, setFormError] = useState("");

  // Meeting Detail & Playback Modal
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  // Bumped per open/close so a slow earlier response can't fill the modal
  // after the user has moved on to another meeting.
  const detailsRequestRef = useRef(0);

  // Audio Player State
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const pendingSeekSecondsRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedRecordingIndex, setSelectedRecordingIndex] = useState(0);

  useEffect(() => {
    checkAuth().finally(() => setIsChecking(false));
  }, [checkAuth]);

  useEffect(() => {
    if (!isChecking && !isLoading && !user) {
      router.push("/");
    }
  }, [isChecking, isLoading, user, router]);

  // Load Rooms
  useEffect(() => {
    if (!isChecking && !isLoading && user) {
      let isMounted = true;
      const controller = new AbortController();

      async function loadRooms() {
        try {
          const response = await fetch("/api/rooms", { signal: controller.signal, cache: "no-store" });
          const contentType = response.headers.get("content-type");

          if (!response.ok || !contentType?.includes("application/json")) return;

          const data = await response.json();
          if (!isMounted) return;

          const loadedRooms: Room[] = (data.rooms || []).map((room: { id: string; roomHash: string; roomName: string; maxParticipants: number; activeParticipantCount?: number; status: "active" | "ended"; isHostInRoom?: boolean }) => ({
            id: room.id,
            slug: room.roomHash,
            name: room.roomName,
            capacity: room.maxParticipants,
            participants: room.activeParticipantCount ?? 0,
            status: room.status,
            isHostInRoom: room.isHostInRoom ?? false,
          }));

          setRooms(loadedRooms);
          setActiveRoomId(data.activeRoomId ?? null);
        } catch (error: unknown) {
          if ((error as Error)?.name !== "AbortError") {
            // Silently handle temporary network failures during polling
          }
        }
      }

      void loadRooms();
      const interval = setInterval(loadRooms, 3000);

      return () => {
        isMounted = false;
        controller.abort();
        clearInterval(interval);
      };
    }
  }, [isChecking, isLoading, user]);

  // Load Meetings History
  const loadMeetingsHistory = async () => {
    setLoadingMeetings(true);
    try {
      const res = await fetch("/api/meetings");
      if (res.ok) {
        const data = await res.json();
        setMeetings(data.meetings || []);
      }
    } catch (e) {
      console.error("Load meetings history error:", e);
    } finally {
      setLoadingMeetings(false);
    }
  };

  useEffect(() => {
    if (currentTab === "history" && user) {
      void loadMeetingsHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, user]);

  // Open Meeting Details / Playback
  const openMeetingDetails = async (meetingId: string) => {
    const request = ++detailsRequestRef.current;
    setSelectedMeetingId(meetingId);
    setMeetingDetails(null);
    setDetailsError("");
    setLoadingDetails(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setSelectedRecordingIndex(0);
    setAudioError("");

    try {
      const res = await fetch(`/api/meetings/${meetingId}`);
      const data = res.ok ? await res.json().catch(() => null) : null;
      if (request !== detailsRequestRef.current) return;
      if (data?.meeting) {
        setMeetingDetails(data.meeting);
      } else {
        setDetailsError(`ไม่สามารถโหลดข้อมูลการประชุมได้ (HTTP ${res.status})`);
      }
    } catch (e) {
      console.error("Load meeting details error:", e);
      if (request === detailsRequestRef.current) setDetailsError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      if (request === detailsRequestRef.current) setLoadingDetails(false);
    }
  };

  const closeMeetingDetails = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    detailsRequestRef.current += 1;
    setSelectedMeetingId(null);
    setMeetingDetails(null);
    setDetailsError("");
    setIsPlaying(false);
  };

  const reportAudioError = (error?: unknown) => {
    if (error instanceof DOMException && error.name === "AbortError") return;
    setIsPlaying(false);
    setAudioError("เล่นไฟล์เสียงไม่สำเร็จ กรุณาลองใหม่หรือดาวน์โหลดไฟล์เสียง");
    console.error("Recording playback failed:", error);
  };

  const playAudio = () => {
    const player = audioPlayerRef.current;
    if (!player) return;
    setAudioError("");
    void player.play().catch((error: unknown) => {
      if (audioPlayerRef.current === player) reportAudioError(error);
    });
  };

  const seekAudioToTime = (seconds: number) => {
    const player = audioPlayerRef.current;
    if (player) {
      // A stale/underestimated durationSeconds can hand us a target past this
      // track's real end; without this clamp the browser silently snaps it to
      // the file's very end instead of erroring, which looks like "it plays
      // right at the end".
      player.currentTime = Number.isFinite(player.duration) && player.duration > 0
        ? Math.min(Math.max(0, seconds), Math.max(0, player.duration - 0.05))
        : seconds;
      if (!isPlaying) {
        playAudio();
      }
    }
  };

  // Transcript timestamps are meeting-elapsed seconds (anchored to Meeting.startedAt),
  // while each recording file's own timeline starts at 0 from whenever that
  // participant's recorder actually started — so we must pick the recording whose
  // offset window contains the segment and subtract its startOffsetSeconds.
  const findRecordingIndexForSegment = (seg: { participantId: string; startTime: number }) => {
    if (!meetingDetails) return -1;

    // Each participant records only their own mic, so a segment can only ever
    // live in that same participant's recording(s) — never fall back to
    // another speaker's track just because its time window happens to
    // overlap; that plays the wrong person's voice.
    const ownTracks = meetingDetails.recordings
      .map((rec, index) => ({ rec, index }))
      .filter(({ rec }) => rec.participantId === seg.participantId && rec.startOffsetSeconds !== null);
    if (ownTracks.length === 0) return -1;

    const containing = ownTracks.find(
      ({ rec }) =>
        seg.startTime >= rec.startOffsetSeconds! &&
        (rec.durationSeconds == null || seg.startTime <= rec.startOffsetSeconds! + rec.durationSeconds),
    );
    if (containing) return containing.index;

    const before = ownTracks
      .filter(({ rec }) => rec.startOffsetSeconds! <= seg.startTime)
      .sort((a, b) => b.rec.startOffsetSeconds! - a.rec.startOffsetSeconds!)[0];
    return (before ?? ownTracks[0]).index;
  };

  const playSegment = (seg: { participantId: string; startTime: number }) => {
    const index = findRecordingIndexForSegment(seg);
    if (index === -1) {
      setAudioError("ไม่พบไฟล์เสียงที่บันทึกไว้ของผู้พูดคนนี้");
      return;
    }
    const recording = meetingDetails!.recordings[index];
    const localTime = Math.max(0, seg.startTime - (recording.startOffsetSeconds ?? 0));

    if (index === selectedRecordingIndex) {
      seekAudioToTime(localTime);
      return;
    }

    pendingSeekSecondsRef.current = localTime;
    audioPlayerRef.current?.pause();
    setSelectedRecordingIndex(index);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError("");
  };

  const toggleAudioPlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      playAudio();
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedRoomId(null);
    setSelectedRoomSlug(null);
    setRoomName("");
    setCapacity("1");
    setFormError("");
  };

  const openCreateModal = () => {
    setSelectedRoomId(null);
    setRoomName("");
    setCapacity("1");
    setFormError("");
    setModalMode("create");
  };

  const openEditModal = (room: Room) => {
    setSelectedRoomId(room.id);
    setSelectedRoomSlug(room.slug);
    setRoomName(room.name);
    setCapacity(String(room.capacity));
    setFormError("");
    setModalMode("edit");
  };

  const saveRoom = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = roomName.trim();
    const parsedCapacity = Number(capacity);

    if (!trimmedName) {
      setFormError("กรุณากรอกชื่อห้องประชุม");
      return;
    }

    if (!Number.isInteger(parsedCapacity) || parsedCapacity < 2) {
      setFormError("จำนวนผู้เข้าร่วมต้องมีอย่างน้อย 2 คน");
      return;
    }

    if (parsedCapacity > 40) {
      setFormError("จำนวนผู้เข้าร่วมต้องไม่เกิน 40 คน");
      return;
    }

    if (modalMode === "create") {
      try {
        const response = await fetch("/api/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName: trimmedName,
            maxParticipants: parsedCapacity,
          }),
        });

        const contentType = response.headers.get("content-type");
        const data = contentType?.includes("application/json") ? await response.json() : {};

        if (!response.ok) {
          setFormError(data.error || "ไม่สามารถสร้างห้องได้");
          return;
        }

        const newRoom: Room = {
          id: data.room.id,
          slug: data.room.roomHash,
          name: data.room.roomName,
          capacity: data.room.maxParticipants,
          participants: 0,
          status: "active",
        };

        setRooms((currentRooms) => [...currentRooms, newRoom]);
      } catch (error) {
        console.error("Create room error:", error);
        setFormError("ไม่สามารถเชื่อมต่อกับ Server ได้");
        return;
      }
    } else if (selectedRoomId) {
      try {
        const response = await fetch(`/api/rooms/${selectedRoomSlug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName: trimmedName,
            maxParticipants: parsedCapacity,
          }),
        });

        const contentType = response.headers.get("content-type");
        const data = contentType?.includes("application/json") ? await response.json() : {};

        if (!response.ok) {
          setFormError(data.error || "ไม่สามารถแก้ไขห้องได้");
          return;
        }

        setRooms((currentRooms) =>
          currentRooms.map((room) =>
            room.id === selectedRoomId
              ? { ...room, name: data.room.roomName, capacity: data.room.maxParticipants }
              : room,
          ),
        );
      } catch (error) {
        console.error("Update room error:", error);
        setFormError("ไม่สามารถเชื่อมต่อกับ Server ได้");
        return;
      }
    }

    closeModal();
  };

  const deleteSelectedRoom = async () => {
    if (!selectedRoomId || !selectedRoomSlug) return;

    try {
      const response = await fetch(`/api/rooms/${selectedRoomSlug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        const data = contentType?.includes("application/json") ? await response.json() : {};
        setFormError(data.error || "ไม่สามารถลบห้องได้");
        return;
      }

      setRooms((currentRooms) => currentRooms.filter((room) => room.id !== selectedRoomId));
      closeModal();
    } catch (error) {
      console.error("Delete room error:", error);
      setFormError("ไม่สามารถเชื่อมต่อกับ Server ได้");
    }
  };

  const copyRoomLink = async (_roomId: string, roomSlug: string) => {
    const meetingUrl = `${window.location.origin}/meeting/${roomSlug}`;

    try {
      await navigator.clipboard.writeText(meetingUrl);
      setCopiedRoomId(roomSlug);
      window.setTimeout(() => setCopiedRoomId(null), 1800);
    } catch {
      setCopiedRoomId(null);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  if (isChecking || isLoading) {
    return (
      <div className="dashboard-loading">
        <p className="dashboard-loading__text">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const activeRoomCount = rooms.filter((room) => room.status === "active").length;
  const endedRoomCount = rooms.length - activeRoomCount;
  const editingRoom = modalMode === "edit" ? rooms.find((room) => room.id === selectedRoomId) : undefined;
  const parsedDraftCapacity = Number(capacity);

  const stepCapacity = (delta: number) => {
    const current = Number.isFinite(parsedDraftCapacity) ? Math.round(parsedDraftCapacity) : 2;
    setCapacity(String(Math.min(40, Math.max(2, current + delta))));
    setFormError("");
  };

  const selectRecording = (index: number) => {
    audioPlayerRef.current?.pause();
    setSelectedRecordingIndex(index);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError("");
  };

  const meetingGroups = groupMeetingsByDay(meetings);

  return (
    <div className="dashboard">
      <AppSidebar
        active={currentTab === "rooms" ? "dashboard" : "history"}
        onNavigate={(section) => setCurrentTab(section === "dashboard" ? "rooms" : "history")}
      />

      <main className="dashboard__main">
        <div className="dashboard__container">
          {/* TAB 1: ROOMS */}
          {currentTab === "rooms" && (
            <>
              <header className="dashboard__header">
                <div className="dashboard__heading">
                  <p className="dashboard__date">{formatToday()}</p>
                  <h1 className="dashboard__title">ห้องประชุม</h1>
                </div>
                <div className="dashboard__tools">
                  <div className="dashboard__counts">
                    <span className="pill pill--ok">
                      <span aria-hidden="true" className="pill__dot" />
                      {activeRoomCount} ใช้งานอยู่
                    </span>
                    <span className="pill pill--idle">
                      <span aria-hidden="true" className="pill__dot" />
                      {endedRoomCount} สิ้นสุดแล้ว
                    </span>
                  </div>
                  <LiveClock />
                  <button type="button" onClick={openCreateModal} className="dashboard__create-btn focus-ring">
                    <Plus aria-hidden="true" className="icon-18" strokeWidth={2} />
                    สร้างห้องประชุม
                  </button>
                </div>
              </header>

              <section aria-label="รายการห้องประชุม" className="rooms-grid">
                {rooms.map((room) => {
                  const isActive = room.status === "active";
                  const wasCopied = copiedRoomId === room.slug;
                  const isAlreadyInRoom = Boolean(room.isHostInRoom);

                  return (
                    <article key={room.id} className="room-card">
                      <div className="room-card__top">
                        <div className="room-card__heading">
                          <h2 className="room-card__title">{room.name}</h2>
                          <p className="room-card__subtitle">
                            <Users aria-hidden="true" className="icon-16" strokeWidth={1.8} />
                            {isActive ? `${room.participants} / ${room.capacity} คน` : `สูงสุด ${room.capacity} คน`}
                          </p>
                          <span className={`room-card__status pill pill--sm ${isActive ? "pill--ok" : "pill--idle"}`}>
                            <span aria-hidden="true" className="pill__dot" />
                            {isActive ? (isAlreadyInRoom ? "อยู่ในห้องแล้ว" : "Active") : "Ended"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openEditModal(room)}
                          aria-label={`แก้ไขห้อง ${room.name}`}
                          title="แก้ไข"
                          className="room-card__edit-btn focus-ring"
                        >
                          <Pencil aria-hidden="true" className="icon-16" strokeWidth={1.8} />
                        </button>
                      </div>

                      <div className="room-card__actions">
                        <button
                          type="button"
                          onClick={() => copyRoomLink(room.id, room.slug)}
                          className="room-card__copy-btn focus-ring"
                        >
                          {wasCopied ? (
                            <Check aria-hidden="true" className="icon-16 room-card__copy-icon" />
                          ) : (
                            <Link2 aria-hidden="true" className="icon-16" strokeWidth={1.8} />
                          )}
                          {wasCopied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
                        </button>
                        <button
                          type="button"
                          onClick={() => router.push(`/meeting/${room.slug}?role=host`)}
                          disabled={!isActive || isAlreadyInRoom || Boolean(activeRoomId)}
                          title={isAlreadyInRoom ? "คุณอยู่ในห้องประชุมนี้แล้ว" : activeRoomId ? "กรุณาออกจากห้องเดิมก่อนเข้าห้องนี้" : undefined}
                          className="room-card__join-btn focus-ring"
                        >
                          <LogIn aria-hidden="true" className="icon-16" strokeWidth={1.8} />
                          {isAlreadyInRoom ? "เข้าร่วมแล้ว" : "เข้าร่วม"}
                        </button>
                      </div>
                    </article>
                  );
                })}
                {rooms.length === 0 && <p className="rooms-empty">ยังไม่มีห้องประชุม</p>}
              </section>
            </>
          )}

          {/* TAB 2: MEETING HISTORY */}
          {currentTab === "history" && (
            <>
              <header className="dashboard__header">
                <div className="dashboard__heading">
                  <h1 className="dashboard__title">ประวัติการประชุม</h1>
                  <p className="dashboard__subtitle">
                    การประชุมทั้งหมด {meetings.length} รายการ · บันทึกเสียงและถอดข้อความ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadMeetingsHistory}
                  disabled={loadingMeetings}
                  className="btn btn--secondary text-sm focus-ring"
                >
                  <RotateCcw aria-hidden="true" className={`icon-16 ${loadingMeetings ? "animate-spin" : ""}`} />
                  รีเฟรช
                </button>
              </header>

              {loadingMeetings && meetings.length === 0 ? (
                <div className="state-message">
                  <p>กำลังโหลดประวัติการประชุม...</p>
                </div>
              ) : meetings.length === 0 ? (
                <div className="history-empty">
                  <Clock3 aria-hidden="true" className="history-empty__icon" strokeWidth={1.6} />
                  <h3 className="history-empty__title">ยังไม่มีประวัติการประชุม</h3>
                  <p className="history-empty__description">
                    เมื่อคุณสร้างห้องประชุมและมีการใช้งาน ประวัติการประชุม บันทึกเสียง และบทสนทนาจะแสดงที่นี่
                  </p>
                </div>
              ) : (
                <section aria-label="ประวัติการประชุมทั้งหมด" className="history-list">
                  {meetingGroups.map((group) => (
                    <Fragment key={group.key}>
                      <h2 className="history-group__label">{group.label}</h2>
                      {group.meetings.map((m) => (
                        <article key={m.id} className="history-card">
                          <div className="history-card__info">
                            <div className="history-card__title-row">
                              <h3 className="history-card__title">{m.roomName}</h3>
                              <span className="chip-mono">#{m.roomHash}</span>
                            </div>

                            <div className="history-card__meta">
                              <span className="history-card__meta-item">
                                <CalendarDays aria-hidden="true" className="icon-16" strokeWidth={1.8} />
                                {formatDate(m.startedAt)}
                              </span>
                              {m.durationSeconds !== null && (
                                <span className="history-card__meta-item">
                                  <Timer aria-hidden="true" className="icon-16" strokeWidth={1.8} />
                                  ระยะเวลา {formatSeconds(m.durationSeconds)}
                                </span>
                              )}
                              <span className="history-card__meta-item">
                                <Users aria-hidden="true" className="icon-16" strokeWidth={1.8} />
                                {m.participantsCount} ผู้เข้าร่วม
                              </span>
                            </div>

                            <div className="history-card__badges">
                              {m.recordings.length > 0 ? (
                                <span className="badge badge--rec">
                                  <Disc aria-hidden="true" className="icon-14" /> มีบันทึกเสียง ({m.recordings.length})
                                </span>
                              ) : (
                                <span className="badge badge--none">
                                  <CircleSlash aria-hidden="true" className="icon-14" /> ไม่มีบันทึกเสียง
                                </span>
                              )}
                              {m.hasTranscript ? (
                                <span className="badge badge--info">
                                  <FileText aria-hidden="true" className="icon-14" /> มีบทสนทนา (Transcript)
                                </span>
                              ) : (
                                <span className="badge badge--none">
                                  <FileText aria-hidden="true" className="icon-14" /> ไม่มีบทสนทนา
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => openMeetingDetails(m.id)}
                            className="history-card__open-btn focus-ring"
                          >
                            <Headphones aria-hidden="true" className="icon-16" strokeWidth={1.8} />
                            ดูบันทึก & ฟังเสียง
                          </button>
                        </article>
                      ))}
                    </Fragment>
                  ))}
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {/* Meeting Detail & Audio Playback Modal */}
      {selectedMeetingId && (
        <div
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeMeetingDetails();
          }}
          className="modal-overlay"
        >
          <div role="dialog" aria-modal="true" aria-labelledby="meeting-notes-title" className="modal modal--wide">
            <div className="modal__header modal__header--divided">
              <div className="modal__heading">
                <div className="modal__title-row">
                  <h2 id="meeting-notes-title" className="modal__title">
                    {meetingDetails?.roomName || "รายละเอียดการประชุม"}
                  </h2>
                  {meetingDetails && <span className="chip-mono">#{meetingDetails.roomHash}</span>}
                </div>
                <p className="modal__subtitle">
                  {meetingDetails
                    ? formatDate(meetingDetails.startedAt)
                    : detailsError
                    ? "โหลดข้อมูลไม่สำเร็จ"
                    : "กำลังโหลดข้อมูล..."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeMeetingDetails}
                aria-label="ปิดหน้าต่าง"
                className="modal__close-btn focus-ring"
              >
                <X aria-hidden="true" className="icon-18" />
              </button>
            </div>

            <div className="modal__body modal__body--scroll">
              {detailsError ? (
                <div className="state-message">
                  <p role="alert" className="state-message__error">{detailsError}</p>
                  <button
                    type="button"
                    onClick={() => selectedMeetingId && void openMeetingDetails(selectedMeetingId)}
                    className="btn btn--primary btn--sm focus-ring"
                  >
                    ลองอีกครั้ง
                  </button>
                </div>
              ) : loadingDetails || !meetingDetails ? (
                <div className="state-message">
                  <p>กำลังโหลดข้อมูลการประชุม...</p>
                </div>
              ) : (
                <>
                  {/* Stats Row */}
                  <div className="stat-grid">
                    <div className="stat-tile">
                      <span className="stat-tile__label">ระยะเวลา</span>
                      <span className="stat-tile__value">
                        {meetingDetails.durationSeconds !== null
                          ? formatSeconds(meetingDetails.durationSeconds)
                          : "กำลังประชุม"}
                      </span>
                    </div>
                    <div className="stat-tile">
                      <span className="stat-tile__label">ผู้เข้าร่วม</span>
                      <span className="stat-tile__value">{meetingDetails.participants.length} คน</span>
                    </div>
                    <div className="stat-tile">
                      <span className="stat-tile__label">ไฟล์เสียงบันทึก</span>
                      <span className="stat-tile__value">{meetingDetails.recordings.length} ไฟล์</span>
                    </div>
                  </div>

                  {/* Audio Player Component */}
                  {meetingDetails.recordings.length > 0 && (
                    <section aria-label="เสียงบันทึกการประชุม" className="player">
                      <h3 className="player__heading">
                        <Volume2 aria-hidden="true" className="icon-18" strokeWidth={1.8} />
                        เล่นเสียงบันทึกการประชุม
                      </h3>

                      <audio
                        key={meetingDetails.recordings[selectedRecordingIndex]?.id}
                        ref={audioPlayerRef}
                        preload="metadata"
                        src={
                          meetingDetails.recordings[selectedRecordingIndex]?.playbackUrl
                        }
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                        onLoadedMetadata={(e) => {
                          const length = e.currentTarget.duration;
                          setDuration(Number.isFinite(length) ? length : 0);
                          if (pendingSeekSecondsRef.current !== null) {
                            const pending = pendingSeekSecondsRef.current;
                            pendingSeekSecondsRef.current = null;
                            e.currentTarget.currentTime = Number.isFinite(length) && length > 0
                              ? Math.min(pending, Math.max(0, length - 0.05))
                              : pending;
                            void e.currentTarget.play().catch((error: unknown) => reportAudioError(error));
                          }
                        }}
                        onDurationChange={(e) => {
                          const length = e.currentTarget.duration;
                          if (Number.isFinite(length)) setDuration(length);
                        }}
                        onPlaying={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onError={(e) => reportAudioError(e.currentTarget.error)}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />

                      {audioError && (
                        <p role="alert" className="player__error">{audioError}</p>
                      )}

                      {/* Custom Audio Controls */}
                      <div className="player__row">
                        <button
                          type="button"
                          onClick={toggleAudioPlay}
                          aria-label={isPlaying ? "หยุดเสียงชั่วคราว" : "เล่นเสียงบันทึก"}
                          className="player__play"
                        >
                          {isPlaying ? (
                            <Pause aria-hidden="true" className="icon-20" fill="currentColor" />
                          ) : (
                            <Play aria-hidden="true" className="icon-20 ml-0.5" fill="currentColor" />
                          )}
                        </button>

                        <div className="player__track">
                          <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            step="0.1"
                            value={currentTime}
                            onChange={(e) => seekAudioToTime(Number(e.target.value))}
                            aria-label="ตำแหน่งเสียง"
                            className="player__range"
                          />
                          <div className="player__times">
                            <span>{formatSeconds(currentTime)}</span>
                            <span>{formatSeconds(duration)}</span>
                          </div>
                        </div>
                      </div>

                      {meetingDetails.recordings.length > 1 && (
                        <div className="flex flex-col gap-2">
                          <p className="player__files-label">ไฟล์เสียง</p>
                          <div className="player__files">
                            {meetingDetails.recordings.map((rec, idx) => (
                              <button
                                key={rec.id}
                                type="button"
                                aria-pressed={idx === selectedRecordingIndex}
                                onClick={() => selectRecording(idx)}
                                className={idx === selectedRecordingIndex ? "player__file--selected" : "player__file"}
                              >
                                <AudioLines aria-hidden="true" className="icon-16 shrink-0" strokeWidth={1.8} />
                                <span className="player__file-label">บันทึก #{idx + 1}</span>
                                <span className="player__file-name">{rec.fileName}</span>
                                {rec.durationSeconds !== null && (
                                  <span className="player__file-name flex-none">{formatSeconds(rec.durationSeconds)}</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="player__footer">
                        <a
                          href={
                            meetingDetails.recordings[selectedRecordingIndex]?.playbackUrl
                          }
                          download
                          className="player__download"
                        >
                          <Download aria-hidden="true" className="icon-16" strokeWidth={1.8} />
                          ดาวน์โหลดไฟล์เสียง
                        </a>
                        <span className="player__filename">
                          {meetingDetails.recordings[selectedRecordingIndex]?.fileName}
                        </span>
                      </div>
                    </section>
                  )}

                  {/* Chronological Transcript Timeline */}
                  <section aria-labelledby="meeting-timeline-title" className="timeline">
                    <div className="timeline__header">
                      <h3 id="meeting-timeline-title" className="timeline__title">
                        <FileText aria-hidden="true" className="icon-18" strokeWidth={1.8} />
                        Transcript Timeline
                      </h3>
                      <span className="timeline__count">
                        {meetingDetails.transcript?.segments.length || 0} ข้อความ
                      </span>
                    </div>

                    {!meetingDetails.transcript || meetingDetails.transcript.segments.length === 0 ? (
                      <p className="timeline__empty">ไม่มีข้อความสนทนาในห้องประชุมนี้</p>
                    ) : (
                      <ol className="timeline__list">
                        {meetingDetails.transcript.segments.map((seg) => (
                          <li key={seg.id}>
                            <button
                              type="button"
                              onClick={() => playSegment(seg)}
                              className="timeline__item focus-ring"
                            >
                              <span className="timeline__item-head">
                                <span className="timeline__speaker">{seg.speakerName}</span>
                                <span className="timeline__time">
                                  {formatSeconds(seg.startTime)} – {formatSeconds(seg.endTime)}
                                </span>
                              </span>
                              <span className="timeline__text">{seg.text}</span>
                            </button>
                          </li>
                        ))}
                      </ol>
                    )}
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Room Modal */}
      {modalMode && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
          className="modal-overlay"
        >
          <div role="dialog" aria-modal="true" aria-labelledby="room-modal-title" className="modal">
            <div className="modal__header">
              <div className="modal__heading">
                <h2 id="room-modal-title" className="modal__title">
                  {modalMode === "create" ? "สร้างห้องประชุม" : "แก้ไขห้องประชุม"}
                </h2>
                <p className="modal__subtitle">
                  {modalMode === "create"
                    ? "ห้องใหม่จะแสดงบนแดชบอร์ด"
                    : editingRoom?.name ?? "แก้ไขชื่อหรือจำนวนผู้เข้าร่วมสูงสุด"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="ปิดหน้าต่าง"
                className="modal__close-btn focus-ring"
              >
                <X aria-hidden="true" className="icon-18" />
              </button>
            </div>

            <form onSubmit={saveRoom} className="modal__form">
              <div className="modal__body">
                <div className="modal__field">
                  <label htmlFor="room-name" className="modal__label">
                    ชื่อห้องประชุม
                  </label>
                  <input
                    id="room-name"
                    type="text"
                    value={roomName}
                    onChange={(event) => {
                      setRoomName(event.target.value);
                      setFormError("");
                    }}
                    autoFocus
                    placeholder="เช่น Weekly Team Sync"
                    className="modal__input"
                  />
                </div>

                <div className="modal__field">
                  <label htmlFor="room-capacity" className="modal__label">
                    จำนวนผู้เข้าร่วมสูงสุด
                  </label>
                  <div className="modal__stepper">
                    <button
                      type="button"
                      onClick={() => stepCapacity(-1)}
                      disabled={parsedDraftCapacity <= 2}
                      aria-label="ลดจำนวนผู้เข้าร่วมสูงสุด"
                      className="modal__stepper-btn focus-ring"
                    >
                      <Minus aria-hidden="true" className="icon-18" strokeWidth={1.8} />
                    </button>
                    <input
                      id="room-capacity"
                      type="number"
                      min="2"
                      max="40"
                      step="1"
                      inputMode="numeric"
                      value={capacity}
                      onChange={(event) => {
                        setCapacity(event.target.value);
                        setFormError("");
                      }}
                      className="modal__stepper-input"
                    />
                    <button
                      type="button"
                      onClick={() => stepCapacity(1)}
                      disabled={parsedDraftCapacity >= 40}
                      aria-label="เพิ่มจำนวนผู้เข้าร่วมสูงสุด"
                      className="modal__stepper-btn focus-ring"
                    >
                      <Plus aria-hidden="true" className="icon-18" strokeWidth={1.8} />
                    </button>
                    <span className="modal__stepper-unit">คน</span>
                  </div>
                  {editingRoom && (
                    <p className="modal__hint">
                      {editingRoom.participants
                        ? `ขณะนี้มีผู้อยู่ในห้อง ${editingRoom.participants} คน`
                        : "ขณะนี้ไม่มีผู้อยู่ในห้อง"}
                    </p>
                  )}
                </div>

                {formError && (
                  <p role="alert" className="modal__error">
                    {formError}
                  </p>
                )}
              </div>

              <div className="modal__actions">
                {modalMode === "edit" && (
                  <button
                    type="button"
                    onClick={deleteSelectedRoom}
                    className="modal__delete-btn focus-ring-danger"
                  >
                    <Trash2 aria-hidden="true" className="icon-16" strokeWidth={1.8} />
                    ลบห้อง
                  </button>
                )}
                <button type="button" onClick={closeModal} className="modal__cancel-btn focus-ring">
                  ยกเลิก
                </button>
                <button type="submit" className="modal__submit-btn focus-ring">
                  {modalMode === "create" && <Plus aria-hidden="true" className="icon-16" strokeWidth={1.8} />}
                  {modalMode === "create" ? "สร้างห้อง" : "บันทึก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function formatToday() {
  return new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function LiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <time dateTime={now.toISOString()} className="dashboard__clock">
      {now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false })}
    </time>
  );
}

function groupMeetingsByDay(meetings: PastMeeting[]) {
  const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const groups: { key: string; label: string; meetings: PastMeeting[] }[] = [];
  for (const meeting of meetings) {
    const startedAt = new Date(meeting.startedAt);
    const key = dayKey(startedAt);
    let group = groups.find((g) => g.key === key);
    if (!group) {
      const dateLabel = startedAt.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
      const prefix = key === dayKey(today) ? "วันนี้ · " : key === dayKey(yesterday) ? "เมื่อวาน · " : "";
      group = { key, label: `${prefix}${dateLabel}`, meetings: [] };
      groups.push(group);
    }
    group.meetings.push(meeting);
  }
  return groups;
}
