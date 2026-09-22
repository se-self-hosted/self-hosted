"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Check,
  Clock3,
  Disc,
  DoorOpen,
  FileText,
  Headphones,
  LayoutGrid,
  LogOut,
  Pause,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Users,
  Video,
  Volume2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

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
  const { user, isLoading, checkAuth, logout } = useAuthStore();
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
    setSelectedMeetingId(meetingId);
    setLoadingDetails(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setSelectedRecordingIndex(0);
    setAudioError("");

    try {
      const res = await fetch(`/api/meetings/${meetingId}`);
      if (res.ok) {
        const data = await res.json();
        setMeetingDetails(data.meeting || null);
      }
    } catch (e) {
      console.error("Load meeting details error:", e);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeMeetingDetails = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setSelectedMeetingId(null);
    setMeetingDetails(null);
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

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar__inner">
          <div className="sidebar__header">
            <div className="sidebar__brand">
              <span className="sidebar__brand-icon">
                <Video aria-hidden="true" className="icon-18" strokeWidth={2.2} />
              </span>
              <span className="sidebar__brand-name">MeetSync</span>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              aria-label="ออกจากระบบ"
              className="sidebar__logout-mobile"
            >
              <LogOut aria-hidden="true" className="icon-20" />
            </button>
          </div>

          <nav aria-label="เมนูหลัก" className="sidebar__nav">
            <p className="sidebar__nav-label">เมนู</p>
            <div className="sidebar__nav-grid">
              <button
                type="button"
                onClick={() => setCurrentTab("rooms")}
                className={currentTab === "rooms" ? "sidebar__nav-link--active" : "sidebar__nav-link"}
              >
                <LayoutGrid aria-hidden="true" className="icon-16" />
                แดชบอร์ด
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab("history")}
                className={currentTab === "history" ? "sidebar__nav-link--active" : "sidebar__nav-link"}
              >
                <Clock3 aria-hidden="true" className="icon-16" />
                ประวัติการประชุม
              </button>
            </div>
          </nav>

          <div className="sidebar__footer">
            <div className="sidebar__user-row">
              <Link href="/account/edit" className="flex items-center gap-3 min-w-0 flex-1 rounded-md transition-opacity hover:opacity-80">
                <span className="sidebar__avatar">
                  {(user.fullname || user.email).charAt(0).toUpperCase()}
                </span>
                <span className="sidebar__user-info">
                  <span className="sidebar__user-name">{user.fullname || "Host"}</span>
                  <span className="sidebar__user-email">{user.email}</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                aria-label="ออกจากระบบ"
                className="sidebar__logout-desktop shrink-0"
              >
                <LogOut aria-hidden="true" className="icon-16" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="dashboard__main">
        <div className="dashboard__container">
          {/* TAB 1: ROOMS */}
          {currentTab === "rooms" && (
            <>
              <header className="dashboard__header">
                <div>
                  <h1 className="dashboard__title">ห้องประชุม</h1>
                  <p className="dashboard__subtitle">
                    {activeRoomCount} ห้องใช้งานอยู่ · {rooms.length} ทั้งหมด
                  </p>
                </div>
                <button type="button" onClick={openCreateModal} className="dashboard__create-btn focus-ring">
                  <Plus aria-hidden="true" className="icon-18" />
                  สร้างห้องประชุม
                </button>
              </header>

              <section aria-label="รายการห้องประชุม" className="rooms-grid">
                {rooms.map((room) => {
                  const isActive = room.status === "active";
                  const wasCopied = copiedRoomId === room.slug;
                  const isAlreadyInRoom = Boolean(room.isHostInRoom);

                  return (
                    <article key={room.id} className="room-card">
                      <div className="room-card__top">
                        <span className="room-card__icon">
                          <Video aria-hidden="true" className="icon-18" strokeWidth={1.9} />
                        </span>
                        <span className={isActive ? "room-card__badge--active" : "room-card__badge"}>
                          {isActive && <span aria-hidden="true" className="icon-8 room-card__badge-dot" />}
                          {isActive ? (isAlreadyInRoom ? "อยู่ในห้องแล้ว" : "Active") : "Ended"}
                        </span>
                      </div>

                      <div className="room-card__body">
                        <h2 className="room-card__title">{room.name}</h2>
                        <p className="room-card__subtitle">
                          {isActive ? `${room.participants} / ${room.capacity} คน` : `สูงสุด ${room.capacity} คน`}
                        </p>
                      </div>

                      <div className="room-card__actions">
                        <button
                          type="button"
                          onClick={() => copyRoomLink(room.id, room.slug)}
                          className="room-card__copy-btn focus-ring"
                        >
                          {wasCopied && <Check aria-hidden="true" className="icon-14 room-card__copy-icon" />}
                          {wasCopied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
                        </button>
                        <button
                          type="button"
                          onClick={() => router.push(`/meeting/${room.slug}?role=host`)}
                          disabled={!isActive || isAlreadyInRoom || Boolean(activeRoomId)}
                          title={isAlreadyInRoom ? "คุณอยู่ในห้องประชุมนี้แล้ว" : activeRoomId ? "กรุณาออกจากห้องเดิมก่อนเข้าห้องนี้" : undefined}
                          className="room-card__join-btn focus-ring"
                        >
                          <DoorOpen aria-hidden="true" className="icon-16" />
                          {isAlreadyInRoom ? "เข้าร่วมแล้ว" : "เข้าร่วม"}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(room)}
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
            </>
          )}

          {/* TAB 2: MEETING HISTORY */}
          {currentTab === "history" && (
            <>
              <header className="dashboard__header">
                <div>
                  <h1 className="dashboard__title">ประวัติการประชุม</h1>
                  <p className="dashboard__subtitle">
                    การประชุมทั้งหมด {meetings.length} รายการ · บันทึกเสียงและถอดข้อความ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadMeetingsHistory}
                  disabled={loadingMeetings}
                  className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 focus-ring"
                >
                  <RotateCcw className={`inline-block size-3.5 mr-1.5 ${loadingMeetings ? "animate-spin" : ""}`} />
                  รีเฟรช
                </button>
              </header>

              {loadingMeetings && meetings.length === 0 ? (
                <div className="dashboard-loading">
                  <p className="dashboard-loading__text">กำลังโหลดประวัติการประชุม...</p>
                </div>
              ) : meetings.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
                  <Clock3 className="size-10 text-slate-600 mb-3" />
                  <h3 className="text-sm font-semibold text-slate-300">ยังไม่มีประวัติการประชุม</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    เมื่อคุณสร้างห้องประชุมและมีการใช้งาน ประวัติการประชุม บันทึกเสียง และบทสนทนาจะแสดงที่นี่
                  </p>
                </div>
              ) : (
                <section aria-label="ประวัติการประชุมทั้งหมด" className="space-y-3">
                  {meetings.map((m) => (
                    <article
                      key={m.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-bold text-white">{m.roomName}</h2>
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-400">
                            #{m.roomHash}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock3 className="size-3.5 text-indigo-400" />
                            {formatDate(m.startedAt)}
                          </span>
                          {m.durationSeconds !== null && (
                            <span>· ระยะเวลา {formatSeconds(m.durationSeconds)}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Users className="size-3.5 text-emerald-400" />
                            {m.participantsCount} ผู้เข้าร่วม
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {m.recordings.length > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[11px] font-semibold text-red-300">
                              <Disc className="size-3 text-red-400" /> มีบันทึกเสียง ({m.recordings.length})
                            </span>
                          )}
                          {m.hasTranscript && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[11px] font-semibold text-indigo-300">
                              <FileText className="size-3 text-indigo-400" /> มีบทสนทนา (Transcript)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => openMeetingDetails(m.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 focus-ring"
                        >
                          <Headphones className="size-3.5" />
                          ดูบันทึก & ฟังเสียง
                        </button>
                      </div>
                    </article>
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
          <div role="dialog" aria-modal="true" className="modal max-w-2xl max-h-[90vh] flex flex-col">
            <div className="modal__header">
              <div>
                <h2 className="modal__title">
                  {meetingDetails?.roomName || "รายละเอียดการประชุม"}
                </h2>
                <p className="modal__subtitle">
                  {meetingDetails ? formatDate(meetingDetails.startedAt) : "กำลังโหลดข้อมูล..."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeMeetingDetails}
                aria-label="ปิดหน้าต่าง"
                className="modal__close-btn focus-ring"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {loadingDetails || !meetingDetails ? (
                <div className="dashboard-loading">
                  <p className="dashboard-loading__text">กำลังโหลดข้อมูลการประชุม...</p>
                </div>
              ) : (
                <>
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-3">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">ระยะเวลา</p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {meetingDetails.durationSeconds !== null
                          ? formatSeconds(meetingDetails.durationSeconds)
                          : "กำลังประชุม"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-3">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">ผู้เข้าร่วม</p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {meetingDetails.participants.length} คน
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-3 col-span-2 md:col-span-1">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">ไฟล์เสียงบันทึก</p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {meetingDetails.recordings.length} ไฟล์
                      </p>
                    </div>
                  </div>

                  {/* Audio Player Component */}
                  {meetingDetails.recordings.length > 0 && (
                    <div className="rounded-xl border border-indigo-500/30 bg-slate-950/80 p-4 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Volume2 className="size-4 text-indigo-400" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                            เล่นเสียงบันทึกการประชุม (MinIO/S3)
                          </h3>
                        </div>

                        {meetingDetails.recordings.length > 1 && (
                          <select
                            value={selectedRecordingIndex}
                            onChange={(e) => {
                              audioPlayerRef.current?.pause();
                              setSelectedRecordingIndex(Number(e.target.value));
                              setIsPlaying(false);
                              setCurrentTime(0);
                              setDuration(0);
                              setAudioError("");
                            }}
                            className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300 border border-slate-700"
                          >
                            {meetingDetails.recordings.map((rec, idx) => (
                              <option key={rec.id} value={idx}>
                                บันทึก #{idx + 1} ({rec.fileName})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

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
                        <p role="alert" className="mb-3 text-sm text-red-400">{audioError}</p>
                      )}

                      {/* Custom Audio Controls */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={toggleAudioPlay}
                            aria-label={isPlaying ? "หยุดเสียงชั่วคราว" : "เล่นเสียงบันทึก"}
                            className="flex size-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-500 transition"
                          >
                            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                          </button>

                          <div className="flex-1 space-y-1">
                            <input
                              type="range"
                              min="0"
                              max={duration || 100}
                              step="0.1"
                              value={currentTime}
                              onChange={(e) => seekAudioToTime(Number(e.target.value))}
                              className="w-full accent-indigo-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-slate-400">
                              <span>{formatSeconds(currentTime)}</span>
                              <span>{formatSeconds(duration)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                          <span className="truncate max-w-[280px]">
                            {meetingDetails.recordings[selectedRecordingIndex]?.fileName}
                          </span>
                          <a
                            href={
                              meetingDetails.recordings[selectedRecordingIndex]?.playbackUrl
                            }
                            download
                            className="text-indigo-400 hover:underline"
                          >
                            ดาวน์โหลดไฟล์เสียง
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chronological Transcript Timeline */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-indigo-400" />
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                          Transcript Timeline (เรียงตามลำดับเวลา)
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400">
                        {meetingDetails.transcript?.segments.length || 0} ข้อความ
                      </span>
                    </div>

                    {!meetingDetails.transcript || meetingDetails.transcript.segments.length === 0 ? (
                      <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-6 text-center text-slate-400">
                        <Sparkles className="size-6 text-indigo-400/40 mx-auto mb-2" />
                        <p className="text-xs">ไม่มีข้อความสนทนาในห้องประชุมนี้</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        {meetingDetails.transcript.segments.map((seg) => (
                          <div
                            key={seg.id}
                            onClick={() => playSegment(seg)}
                            className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 hover:border-indigo-500/40 hover:bg-slate-800/50 cursor-pointer transition group"
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-bold text-indigo-300 group-hover:text-indigo-200">
                                {seg.speakerName}
                              </span>
                              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                                {formatSeconds(seg.startTime)} - {formatSeconds(seg.endTime)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed">{seg.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
              <div>
                <h2 id="room-modal-title" className="modal__title">
                  {modalMode === "create" ? "สร้างห้องประชุม" : "แก้ไขห้องประชุม"}
                </h2>
                <p className="modal__subtitle">
                  {modalMode === "create"
                    ? "กรอกรายละเอียดสำหรับห้องประชุมใหม่"
                    : "แก้ไขชื่อหรือจำนวนผู้เข้าร่วมสูงสุด"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="ปิดหน้าต่าง"
                className="modal__close-btn focus-ring"
              >
                <X aria-hidden="true" className="icon-20" />
              </button>
            </div>

            <form onSubmit={saveRoom} className="modal__form">
              <div>
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

              <div>
                <label htmlFor="room-capacity" className="modal__label">
                  จำนวนผู้เข้าร่วมสูงสุด
                </label>
                <input
                  id="room-capacity"
                  type="number"
                  min="2"
                  max="40"
                  step="1"
                  value={capacity}
                  onChange={(event) => {
                    setCapacity(event.target.value);
                    setFormError("");
                  }}
                  className="modal__input"
                />
              </div>

              {formError && (
                <p role="alert" className="modal__error">
                  {formError}
                </p>
              )}

              <div className="modal__actions">
                {modalMode === "edit" && (
                  <button
                    type="button"
                    onClick={deleteSelectedRoom}
                    className="modal__delete-btn focus-ring-danger"
                  >
                    <Trash2 aria-hidden="true" className="icon-16" />
                    ลบห้อง
                  </button>
                )}
                <button type="button" onClick={closeModal} className="modal__cancel-btn focus-ring">
                  ยกเลิก
                </button>
                <button type="submit" className="modal__submit-btn focus-ring">
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
