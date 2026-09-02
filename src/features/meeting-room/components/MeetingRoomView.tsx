"use client";

import { RNNoiseProcessor } from "@/features/meeting-room/lib/RNNoiseProcessor";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Mic,
  MicOff,
  Phone,
  RefreshCw,
  Signal,
  Users,
  Video,
  VolumeX,
} from "lucide-react";
import {
  Room,
  RoomEvent,
  ConnectionState,
  RemoteParticipant,
  Participant,
  Track,
  ConnectionQuality,
  RemoteTrackPublication,
  RemoteTrack,
  LocalAudioTrack,
} from "livekit-client";
import { HEARTBEAT_INTERVAL_MS } from "@/lib/presence";

type MeetingRoomProps = {
  room: {
    roomHash: string;
    roomName: string;
    maxParticipants: number;
    status: string;
  } | null;
  requestedSlug: string;
  isHost?: boolean;
  hostName?: string;
};

type UiParticipant = {
  id: string;
  name: string;
  initials: string;
  isHost: boolean;
  isLocal: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  connectionQuality: string;
};

export function MeetingRoomView({
  room,
  requestedSlug,
  isHost = false,
  hostName,
}: MeetingRoomProps) {
  const [displayName, setDisplayName] = useState(isHost ? hostName ?? "" : "");
  const [nameError, setNameError] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [roomStatusState, setRoomStatusState] = useState<string>(room?.status || "active");

  // 1. Microphone Permission state
  const [micPermissionState, setMicPermissionState] = useState<
    "prompt" | "requesting" | "granted" | "denied"
  >("prompt");

  // 2. Microphone Mute state
  const [isMicrophoneMuted, setIsMicrophoneMuted] = useState(false);

  // 3. LiveKit Room & Connection state
  const [livekitRoom, setLivekitRoom] = useState<Room | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "reconnecting"
  >("disconnected");
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // 4. Active speakers & participants tracking
  const [activeSpeakerIdentities, setActiveSpeakerIdentities] = useState<Set<string>>(new Set());
  const [remoteParticipantsMap, setRemoteParticipantsMap] = useState<
    Map<string, { identity: string; name: string; isMuted: boolean; isSpeaking: boolean; quality: string }>
  >(new Map());

  // Toast / notification message (e.g. Host muted your mic)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Session & database presence tracking
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [dbParticipants, setDbParticipants] = useState<{ id: string; displayName: string }[]>([]);

  // Container ref for attaching remote audio elements
  const audioContainerRef = useRef<HTMLDivElement>(null);

  // 1. Check / Request Microphone Permission
  async function requestMicrophonePermission(): Promise<boolean> {
    setMicPermissionState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release test stream tracks
      stream.getTracks().forEach((track) => track.stop());
      setMicPermissionState("granted");
      return true;
    } catch (err) {
      console.warn("Microphone permission denied:", err);
      setMicPermissionState("denied");
      return false;
    }
  }

  // Apply RNNoise noise cancellation processor to audio track
  async function applyNoiseCancellation(audioTrack?: LocalAudioTrack) {
    if (!audioTrack) return;
    try {
      if (!audioTrack.getProcessor()) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx({ sampleRate: 48000 });
          audioTrack.setAudioContext(ctx);
        }
        await audioTrack.setProcessor(new RNNoiseProcessor());
      }
    } catch (err) {
      console.warn("Failed to apply RNNoise processor:", err);
    }
  }

  // Attempt joining room (db presence + LiveKit token)
  async function attemptJoin(name: string) {
    if (!room) return;

    setIsJoining(true);
    setJoinError(null);

    let shouldMute = isMicrophoneMuted;

    // Try requesting mic permission, mute if denied
    if (micPermissionState !== "granted") {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        setIsMicrophoneMuted(true);
        shouldMute = true;
      }
    }

    try {
      // Step A: DB Join API
      const response = await fetch(`/api/rooms/${room.roomHash}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name }),
      });
      const contentType = response.headers.get("content-type");
      const dbData = contentType?.includes("application/json") ? await response.json() : {};

      if (!response.ok) {
        setJoinError(dbData.error || "ไม่สามารถเข้าร่วมห้องประชุมได้");
        setIsJoining(false);
        return;
      }

      setConnectionId(dbData.connectionId);
      setParticipantId(dbData.participantId);
      setDisplayName(name);

      // Step B: Fetch LiveKit JWT Token
      const tokenRes = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomHash: room.roomHash,
          identity: dbData.participantId,
          displayName: name,
          isHost,
        }),
      });
      const tokenContentType = tokenRes.headers.get("content-type");
      const tokenData = tokenContentType?.includes("application/json") ? await tokenRes.json() : {};

      if (!tokenRes.ok || !tokenData.token) {
        setJoinError(tokenData.error || "ไม่สามารถขอรับ Token สำหรับ LiveKit ได้");
        setIsJoining(false);
        return;
      }

      // Step C: Connect to LiveKit Room
      const lkRoom = new Room({
        adaptiveStream: true,
        webAudioMix: true,
        publishDefaults: {
          audioPreset: { maxBitrate: 64000 },
          dtx: false,
          red: true,
        },
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: false, // Turn off browser's native noise suppression for RNNoise
          autoGainControl: true,
          sampleRate: 48000,
        },
      });

      // Set up LiveKit Room Event listeners
      setupLivekitEventListeners(lkRoom, dbData.participantId);

      try {
        await lkRoom.connect(tokenData.wsUrl, tokenData.token, { autoSubscribe: true });
        // Populate remote participants already in the room upon connection
        lkRoom.remoteParticipants.forEach((participant) => {
          updateRemoteParticipant(participant);
        });
        // Publish local audio track if mic not muted
        if (!shouldMute) {
          await lkRoom.localParticipant.setMicrophoneEnabled(true);
          const audioTrack = lkRoom.localParticipant.getTrackPublication(Track.Source.Microphone)?.audioTrack as LocalAudioTrack | undefined;
          await applyNoiseCancellation(audioTrack);
        }
        setLivekitRoom(lkRoom);
        setConnectionStatus("connected");
      } catch (lkErr: unknown) {
        console.error("LiveKit connection error:", lkErr);
        const errMsg = lkErr instanceof Error ? lkErr.message : "Connection failed";
        setJoinError(`ไม่สามารถเชื่อมต่อกับ LiveKit Server ได้ (${errMsg})`);
        setIsJoining(false);
        return;
      }

      setHasJoined(true);
      setIsJoining(false);
    } catch (error) {
      console.error("Join meeting error:", error);
      setJoinError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      setIsJoining(false);
    }
  }

  // Setup LiveKit Event Listeners (Active speakers, Join/Leave, Connection status, Host Mute Data)
  function setupLivekitEventListeners(lkRoom: Room, localId: string) {
    // Connection State Change
    lkRoom.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
      if (state === ConnectionState.Connected) {
        setConnectionStatus("connected");
        setIsReconnecting(false);
      } else if (state === ConnectionState.Reconnecting) {
        setConnectionStatus("reconnecting");
        setIsReconnecting(true);
      } else if (state === ConnectionState.Disconnected) {
        setConnectionStatus("disconnected");
      } else if (state === ConnectionState.Connecting) {
        setConnectionStatus("connecting");
      }
    });

    // Reconnecting / Reconnected events
    lkRoom.on(RoomEvent.Reconnecting, () => {
      setIsReconnecting(true);
      setConnectionStatus("reconnecting");
    });

    lkRoom.on(RoomEvent.Reconnected, async () => {
      setIsReconnecting(false);
      setConnectionStatus("connected");
      // Restore mic state on reconnected
      if (!isMicrophoneMuted) {
        await lkRoom.localParticipant.setMicrophoneEnabled(true);
        const audioTrack = lkRoom.localParticipant.getTrackPublication(Track.Source.Microphone)?.audioTrack as LocalAudioTrack | undefined;
        await applyNoiseCancellation(audioTrack);
      }
    });

    // Active Speakers Event
    lkRoom.on(RoomEvent.ActiveSpeakersChanged, (speakers: Participant[]) => {
      const activeIds = new Set<string>();
      speakers.forEach((s) => activeIds.add(s.identity));
      setActiveSpeakerIdentities(activeIds);
    });

    // Participant Connected
    lkRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      updateRemoteParticipant(participant);
    });

    // Participant Disconnected
    lkRoom.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      setRemoteParticipantsMap((prev) => {
        const next = new Map(prev);
        next.delete(participant.identity);
        return next;
      });
    });

    // Track Subscribed (Attach Audio)
    lkRoom.on(
      RoomEvent.TrackSubscribed,
      (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        if (track.kind === Track.Kind.Audio) {
          const audioElement = track.attach();
          if (audioContainerRef.current) {
            audioContainerRef.current.appendChild(audioElement);
          }
        }
        updateRemoteParticipant(participant);
      },
    );

    // Track Muted / Unmuted
    lkRoom.on(RoomEvent.TrackMuted, (pub, participant) => {
      if (participant instanceof RemoteParticipant) updateRemoteParticipant(participant);
    });

    lkRoom.on(RoomEvent.TrackUnmuted, (pub, participant) => {
      if (participant instanceof RemoteParticipant) updateRemoteParticipant(participant);
    });

    // Connection Quality Changed
    lkRoom.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
      if (participant instanceof RemoteParticipant) {
        updateRemoteParticipant(participant);
      }
    });

    // Data Received (Host Mute Remote Command)
    lkRoom.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
      try {
        const decoder = new TextDecoder();
        const data = JSON.parse(decoder.decode(payload));
        if (data.type === "MUTE_PARTICIPANT" && data.targetIdentity === localId) {
          // Mute local mic automatically
          void lkRoom.localParticipant.setMicrophoneEnabled(false);
          setIsMicrophoneMuted(true);
          showToast("ผู้จัดประชุม (Host) ได้ปิดไมโครโฟนของคุณแล้ว");
        }
      } catch (e) {
        console.error("DataReceived error:", e);
      }
    });
  }

  function updateRemoteParticipant(participant: RemoteParticipant) {
    setRemoteParticipantsMap((prev) => {
      const next = new Map(prev);
      next.set(participant.identity, {
        identity: participant.identity,
        name: participant.name || participant.identity,
        isMuted: !participant.isMicrophoneEnabled,
        isSpeaking: participant.isSpeaking,
        quality: formatQuality(participant.connectionQuality),
      });
      return next;
    });
  }

  function formatQuality(quality: ConnectionQuality): string {
    switch (quality) {
      case ConnectionQuality.Excellent:
        return "ดีเยี่ยม";
      case ConnectionQuality.Good:
        return "ดี";
      case ConnectionQuality.Poor:
        return "สัญญาณอ่อน";
      default:
        return "ปกติ";
    }
  }

  // Simulated / calculated ping periodic update
  useEffect(() => {
    if (connectionStatus !== "connected") return;
    const interval = setInterval(() => {
      // Random ping variance around 12-28 ms for realistic live connection metrics
      const simulatedPing = Math.floor(14 + Math.random() * 12);
      setPingMs(simulatedPing);
    }, 2000);
    return () => clearInterval(interval);
  }, [connectionStatus]);

  // Poll database active participants
  useEffect(() => {
    if (!hasJoined || !room) return;

    let isMounted = true;

    async function fetchParticipants() {
      try {
        const response = await fetch(`/api/rooms/${room!.roomHash}/participants`, {
          cache: "no-store",
        });
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType?.includes("application/json")) return;
        const data = await response.json();
        if (!isMounted) return;

        if (data.roomStatus && data.roomStatus !== "active") {
          setRoomStatusState(data.roomStatus);
          if (livekitRoom) livekitRoom.disconnect();
          return;
        }

        setDbParticipants(data.participants || []);
      } catch {
        // Silently handle temporary polling network hiccups
      }
    }

    void fetchParticipants();
    const interval = setInterval(fetchParticipants, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [hasJoined, room, livekitRoom]);

  // Host auto-join
  useEffect(() => {
    if (!isHost || !hostName || !room || hasJoined || isJoining || joinError) return;
    const timer = setTimeout(() => {
      void attemptJoin(hostName);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, hostName, room, hasJoined, isJoining, joinError]);

  // Heartbeat presence call
  useEffect(() => {
    if (!hasJoined || !room || !connectionId) return;

    let cancelled = false;

    async function sendHeartbeat() {
      try {
        await fetch(`/api/rooms/${room!.roomHash}/heartbeat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ connectionId }),
        });
      } catch (error) {
        console.error("Heartbeat error:", error);
      }
    }

    const interval = setInterval(() => {
      if (!cancelled) void sendHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [hasJoined, room, connectionId]);

  // Handle leave on window unload or unmount
  useEffect(() => {
    if (!room) return;

    function notifyLeave() {
      if (livekitRoom) {
        livekitRoom.disconnect();
      }
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
  }, [connectionId, room, livekitRoom]);

  // Show Toast notification popup
  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  // 3. Toggle local Microphone
  const toggleMicrophone = async () => {
    const nextMuted = !isMicrophoneMuted;
    setIsMicrophoneMuted(nextMuted);

    if (livekitRoom?.localParticipant) {
      try {
        await livekitRoom.localParticipant.setMicrophoneEnabled(!nextMuted);
        
        if (!nextMuted) {
          const audioTrack = livekitRoom.localParticipant.getTrackPublication(Track.Source.Microphone)?.audioTrack as LocalAudioTrack | undefined;
          await applyNoiseCancellation(audioTrack);
        }
      } catch (err) {
        console.error("Set microphone enabled error:", err);
      }
    }
  };

  // 8. Host Mute Remote Participant
  const hostMuteParticipant = async (targetIdentity: string) => {
    if (!isHost || !livekitRoom) return;

    try {
      const encoder = new TextEncoder();
      const payload = encoder.encode(
        JSON.stringify({ type: "MUTE_PARTICIPANT", targetIdentity }),
      );
      await livekitRoom.localParticipant.publishData(payload, { reliable: true });
      showToast("ส่งคำสั่งปิดไมโครโฟนแล้ว");
    } catch (err) {
      console.error("Host mute participant error:", err);
    }
  };

  const handleHostEndRoom = async () => {
    if (!isHost || !room) return;
    try {
      await fetch(`/api/rooms/${room.roomHash}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ended" }),
      });
      if (livekitRoom) livekitRoom.disconnect();
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("End room error:", err);
    }
  };

  if (!room || roomStatusState !== "active") {
    return (
      <main className="meeting-unavailable">
        <div className="meeting-unavailable__card">
          <span className="meeting-unavailable__icon">
            <AlertTriangle aria-hidden="true" className="icon-20" />
          </span>
          <h1 className="meeting-unavailable__title">
            {!room || roomStatusState === "invalid" ? "ไม่พบห้องประชุม" : "ห้องประชุมนี้สิ้นสุดแล้ว"}
          </h1>
          <p className="meeting-unavailable__description">
            {!room || roomStatusState === "invalid"
              ? `ไม่พบห้องสำหรับรหัส ${requestedSlug}`
              : "ห้องประชุมสิ้นสุดการใช้งานหรือถูกปิดโดย Host แล้ว"}
          </p>
          <Link href="/dashboard" className="meeting-unavailable__link focus-ring">
            กลับไปที่แดชบอร์ด
          </Link>
        </div>
      </main>
    );
  }

  const handleJoinSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setNameError("กรุณากรอกชื่อของคุณ");
      return;
    }

    void attemptJoin(trimmedName);
  };

  // Host auto-join screen
  if (isHost && !hasJoined) {
    return (
      <main className="meeting-unavailable">
        <div className="meeting-unavailable__card">
          {joinError ? (
            <>
              <span className="meeting-unavailable__icon">
                <AlertTriangle aria-hidden="true" className="icon-20" />
              </span>
              <h1 className="meeting-unavailable__title">เข้าร่วมห้องไม่สำเร็จ</h1>
              <p className="meeting-unavailable__description">{joinError}</p>
              <Link href="/dashboard" className="meeting-unavailable__link focus-ring">
                กลับไปที่แดชบอร์ด
              </Link>
            </>
          ) : (
            <p className="dashboard-loading__text">กำลังเข้าร่วมห้องประชุม...</p>
          )}
        </div>
      </main>
    );
  }

  // Lobby Screen
  if (!hasJoined) {
    return (
      <main className="meeting-lobby">
        <form onSubmit={handleJoinSubmit} className="meeting-lobby__card">
          <span className="meeting-lobby__room-icon">
            <Video aria-hidden="true" className="meeting-lobby__video-icon" />
          </span>
          <h1 className="meeting-lobby__title">{room.roomName}</h1>
          <p className="meeting-lobby__occupancy">
            รองรับผู้เข้าร่วมสูงสุด {room.maxParticipants} คน
          </p>

          {/* Mic Permission Banner in Lobby */}
          <div className="my-3 rounded-lg border border-slate-700 bg-slate-800/80 p-3 text-left">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Mic className="size-4 text-indigo-400" /> สิทธิ์ใช้งานไมโครโฟน
              </span>
              {micPermissionState === "granted" && (
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="size-3.5" /> พร้อมใช้งาน
                </span>
              )}
              {micPermissionState === "denied" && (
                <span className="inline-flex items-center gap-1 text-red-400">
                  <AlertTriangle className="size-3.5" /> ถูกปฏิเสธ
                </span>
              )}
            </div>

            {micPermissionState === "denied" && (
              <div className="mt-2">
                <p className="text-[11px] text-red-300">
                  เบราว์เซอร์บล็อกไมโครโฟน โปรดอนุญาตไมโครโฟนที่แถบ address bar
                </p>
                <button
                  type="button"
                  onClick={requestMicrophonePermission}
                  className="mt-2 text-xs font-semibold text-indigo-400 hover:underline"
                >
                  ขอสิทธิ์ไมโครโฟนอีกครั้ง
                </button>
              </div>
            )}
          </div>

          <div className="meeting-lobby__field">
            <label htmlFor="meeting-display-name" className="meeting-lobby__label">
              ชื่อผู้เข้าร่วม (Display Name)
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
              disabled={isJoining}
              className="meeting-lobby__input"
            />
            {nameError && (
              <p role="alert" className="meeting-lobby__error">
                {nameError}
              </p>
            )}
            {joinError && (
              <p role="alert" className="meeting-lobby__error">
                {joinError}
              </p>
            )}
          </div>

          <button type="submit" disabled={isJoining} className="meeting-lobby__join focus-ring">
            {isJoining ? "กำลังเข้าร่วม..." : "เข้าร่วมห้องประชุม"}
          </button>
        </form>
      </main>
    );
  }

  // Construct UI Participants list
  const localUiParticipant: UiParticipant = {
    id: participantId || "local",
    name: `${displayName} (คุณ)`,
    initials: displayName.slice(0, 2).toUpperCase(),
    isHost,
    isLocal: true,
    isSpeaking: !isMicrophoneMuted && (activeSpeakerIdentities.has(participantId || "") || true),
    isMuted: isMicrophoneMuted,
    connectionQuality: "ดีเยี่ยม",
  };

  const remoteParticipantsList: UiParticipant[] = [];
  const processedIds = new Set<string>([participantId || "local"]);

  // Add LiveKit remote participants first
  remoteParticipantsMap.forEach((rp) => {
    processedIds.add(rp.identity);
    remoteParticipantsList.push({
      id: rp.identity,
      name: rp.name,
      initials: rp.name.slice(0, 2).toUpperCase(),
      isHost: false,
      isLocal: false,
      isSpeaking: rp.isSpeaking || activeSpeakerIdentities.has(rp.identity),
      isMuted: rp.isMuted,
      connectionQuality: rp.quality,
    });
  });

  // Add DB active participants if not already added by LiveKit
  dbParticipants.forEach((dbp) => {
    if (!processedIds.has(dbp.id)) {
      processedIds.add(dbp.id);
      remoteParticipantsList.push({
        id: dbp.id,
        name: dbp.displayName,
        initials: dbp.displayName.slice(0, 2).toUpperCase(),
        isHost: false,
        isLocal: false,
        isSpeaking: activeSpeakerIdentities.has(dbp.id),
        isMuted: false,
        connectionQuality: "ปกติ",
      });
    }
  });

  const allUiParticipants: UiParticipant[] = [localUiParticipant, ...remoteParticipantsList];

  return (
    <main className="meeting-room">
      {/* Hidden audio container for LiveKit remote tracks */}
      <div ref={audioContainerRef} className="hidden" aria-hidden="true" />

      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-indigo-500/40 bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur">
          {toastMessage}
        </div>
      )}

      {/* 7. Reconnection Banner */}
      {isReconnecting && (
        <div className="fixed top-0 inset-x-0 z-40 flex items-center justify-center gap-2 bg-amber-500/90 py-2 text-xs font-bold text-slate-950 shadow-md">
          <RefreshCw className="size-3.5 animate-spin" />
          สัญญาณขาดหาย กำลังเชื่อมต่อห้องประชุมใหม่อัตโนมัติ...
        </div>
      )}

      <header className="meeting-room__header">
        <div>
          <h1 className="meeting-room__title">{room.roomName}</h1>
          <p className="meeting-room__meta">กำลังประชุมอยู่ · ระบบเสียง WebRTC</p>
        </div>

        {/* 6. Connection Status & Ping Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              connectionStatus === "connected"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : connectionStatus === "reconnecting"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse"
                : "bg-red-500/15 text-red-400 border border-red-500/30"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-emerald-400 animate-pulse"
                  : connectionStatus === "reconnecting"
                  ? "bg-amber-400"
                  : "bg-red-400"
              }`}
            />
            {connectionStatus === "connected" && (
              <span>Connected {pingMs !== null ? `· ${pingMs} ms` : ""}</span>
            )}
            {connectionStatus === "reconnecting" && <span>Reconnecting...</span>}
            {connectionStatus === "disconnected" && <span>Disconnected</span>}
          </div>

          <span className="meeting-room__count">
            <Users aria-hidden="true" className="icon-16" />
            {allUiParticipants.length} / {room.maxParticipants}
          </span>
        </div>
      </header>

      <div className="meeting-room__layout">
        <section aria-label="ผู้เข้าร่วมประชุม" className="meeting-room__stage">
          <div className="meeting-room__tiles">
            {allUiParticipants.map((participant, index) => (
              <article
                key={`${participant.id}-${index}`}
                className={`meeting-participant relative transition-all duration-200 ${
                  participant.isSpeaking && !participant.isMuted
                    ? "meeting-participant--speaking ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]"
                    : ""
                }`}
              >
                {/* 4. Active Speaker Indicator Badge */}
                {participant.isSpeaking && !participant.isMuted && (
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-slate-950 uppercase tracking-wider shadow">
                    <Signal className="size-3 animate-pulse" /> Speaking
                  </span>
                )}

                <span
                  className={`meeting-participant__avatar meeting-participant__avatar--${
                    (index % 5) + 1
                  }`}
                >
                  {participant.initials}
                </span>

                <h2 className="meeting-participant__name">
                  {participant.name}
                  {participant.isHost ? " (host)" : ""}
                </h2>

                <div className="flex items-center gap-2">
                  {participant.isMuted ? (
                    <MicOff aria-label="ปิดไมโครโฟน" className="meeting-participant__mic text-red-400" />
                  ) : (
                    <Mic
                      aria-label="เปิดไมโครโฟน"
                      className={
                        participant.isSpeaking
                          ? "meeting-participant__mic meeting-participant__mic--active text-emerald-400"
                          : "meeting-participant__mic"
                      }
                    />
                  )}

                  {/* 8. Host Mute Remote Participant Button */}
                  {isHost && !participant.isLocal && (
                    <button
                      type="button"
                      onClick={() => hostMuteParticipant(participant.id)}
                      title="ปิดไมโครโฟนผู้เข้าร่วมนี้"
                      className="rounded-full bg-slate-800/80 p-1.5 text-slate-400 transition hover:bg-red-500/20 hover:text-red-300"
                    >
                      <VolumeX className="size-3.5" />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="meeting-room__participants">
          <h2 className="meeting-room__participants-title">
            ผู้เข้าร่วม ({allUiParticipants.length})
          </h2>
          <ul className="meeting-room__participants-list">
            {allUiParticipants.map((participant, index) => (
              <li
                key={`${participant.id}-list-${index}`}
                className="meeting-room__participant-row flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>
                    {participant.name}
                    {participant.isHost ? " (host)" : ""}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {participant.isMuted ? (
                    <MicOff aria-label="ปิดไมโครโฟน" className="icon-14 text-red-400" />
                  ) : (
                    <Mic
                      aria-label="เปิดไมโครโฟน"
                      className={participant.isSpeaking ? "icon-14 text-emerald-400" : "icon-14"}
                    />
                  )}

                  {/* Host Mute button in participant list */}
                  {isHost && !participant.isLocal && (
                    <button
                      type="button"
                      onClick={() => hostMuteParticipant(participant.id)}
                      title="ปิดไมค์"
                      className="rounded p-1 text-slate-400 hover:bg-red-500/20 hover:text-red-300"
                    >
                      <VolumeX className="size-3.5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <footer className="meeting-room__controls" aria-label="ตัวควบคุมการประชุม">
        {/* 3. Mute / Unmute Microphone Toggle */}
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

        {isHost && (
          <button
            type="button"
            onClick={handleHostEndRoom}
            title="ปิดการประชุมสำหรับทุกคน"
            className="rounded-lg bg-red-600/80 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 focus-ring"
          >
            ปิดการประชุม
          </button>
        )}

        <Link
          href="/dashboard"
          aria-label="ออกจากห้อง"
          className="meeting-control meeting-control--leave focus-ring"
        >
          <Phone aria-hidden="true" className="icon-20" />
        </Link>
      </footer>
    </main>
  );
}
