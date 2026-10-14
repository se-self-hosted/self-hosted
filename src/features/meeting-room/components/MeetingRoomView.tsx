"use client";

import { startLiveTranscription, type SpeechRecognizer } from "@/features/meeting-room/lib/live-transcription";
import { createMeetingClock } from "@/features/meeting-room/lib/meeting-clock";
import { RNNoiseProcessor } from "@/features/meeting-room/lib/RNNoiseProcessor";
import { mergeTranscriptSegments } from "@/features/meeting-room/lib/transcript-segments";
import { saveTranscriptSegment } from "@/features/meeting-room/lib/transcript-save";
import { createRecordingBus, type RecordingBus } from "@/features/meeting-room/lib/recording-bus";
import { followLocalMicrophone } from "@/features/meeting-room/lib/local-microphone";
import { startServerTranscription } from "@/features/meeting-room/lib/server-transcription";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  Circle,
  CircleStop,
  FileText,
  LogIn,
  Mic,
  MicOff,
  PhoneOff,
  RefreshCw,
  Square,
  Users,
  Video,
  X,
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
  AudioPresets,
} from "livekit-client";
import { HEARTBEAT_INTERVAL_MS } from "@/lib/presence";
import { TypewriterLoader } from "@/components/TypewriterLoader";
import { ThemeSwitch } from "@/components/app-shell/ThemeSwitch";
import {
  InterimTranscript,
  ParticipantRow,
  ParticipantTile,
  RecordingTimer,
  TranscriptLines,
  createTextStore,
  type SpeakerStyle,
} from "./MeetingRoomParts";

// Our token route writes this metadata and grants no canUpdateOwnMetadata,
// so a participant can't claim to be the host by rewriting their own.
function participantMetadata(participant?: Participant): { isHost: boolean; avatarUrl: string | null } {
  if (!participant?.metadata) return { isHost: false, avatarUrl: null };
  try {
    const metadata = JSON.parse(participant.metadata);
    return {
      isHost: metadata.isHost === true,
      // Only ever our own same-origin avatar route.
      avatarUrl: typeof metadata.avatarUrl === "string" && metadata.avatarUrl.startsWith("/api/rooms/")
        ? metadata.avatarUrl
        : null,
    };
  } catch {
    return { isHost: false, avatarUrl: null };
  }
}

function isHostParticipant(participant?: Participant) {
  return participantMetadata(participant).isHost;
}

type RemoteParticipantState = {
  identity: string;
  name: string;
  isHost: boolean;
  avatarUrl: string | null;
  isMuted: boolean;
  isSpeaking: boolean;
  quality: string;
};

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

function remoteParticipantState(participant: RemoteParticipant): RemoteParticipantState {
  const { isHost, avatarUrl } = participantMetadata(participant);
  return {
    identity: participant.identity,
    name: participant.name || participant.identity,
    isHost,
    avatarUrl,
    isMuted: !participant.isMicrophoneEnabled,
    isSpeaking: participant.isSpeaking,
    quality: formatQuality(participant.connectionQuality),
  };
}

function sameRemoteParticipantState(a: RemoteParticipantState | undefined, b: RemoteParticipantState) {
  return Boolean(a) && a!.name === b.name && a!.isHost === b.isHost && a!.avatarUrl === b.avatarUrl &&
    a!.isMuted === b.isMuted && a!.isSpeaking === b.isSpeaking && a!.quality === b.quality;
}

function sameSet(a: ReadonlySet<string>, b: ReadonlySet<string>) {
  if (a.size !== b.size) return false;
  for (const value of a) if (!b.has(value)) return false;
  return true;
}

const toneFor = (index: number) => `tone-${(index % 6) + 1}`;
const roleFor = (participant: UiParticipant) =>
  participant.isLocal ? (participant.isHost ? "คุณ · host" : "คุณ") : participant.isHost ? "host" : "ผู้เข้าร่วม";

// The DB list only fills in people who joined but haven't connected to
// LiveKit yet; everyone connected is tracked live from LiveKit events. It
// also notices a room the host has closed.
const PARTICIPANT_POLL_MS = 10_000;
const PING_POLL_MS = 5_000;

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
  avatarUrl: string | null;
  isHost: boolean;
  isLocal: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  connectionQuality: string;
};

export type LiveTranscriptSegment = {
  id: string;
  participantId?: string;
  speakerName: string;
  startTime: number;
  endTime: number;
  spokenAt: string;
  text: string;
  confidence?: number;
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
  const [joinStep, setJoinStep] = useState<"permission" | "room" | "token" | "connecting" | null>(null);
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
  const [remoteParticipantsMap, setRemoteParticipantsMap] = useState<Map<string, RemoteParticipantState>>(new Map());

  // Toast / notification message (e.g. Host muted your mic)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // One AudioContext for noise suppression per joined session, closed on
  // leave. Creating one per mic toggle leaked an audio thread each time.
  const noiseContextRef = useRef<AudioContext | null>(null);

  // Session & database presence tracking
  const joiningRef = useRef(false);
  const mountedRef = useRef(true);
  const activeSessionRef = useRef<{ connectionId: string; roomHash: string; room?: Room } | null>(null);
  // Proves this client's participant id to the API. Unlike activeSessionRef
  // it outlives leaving, so saves still in flight then can finish.
  const connectionIdRef = useRef<string | null>(null);

  const releaseSession = useCallback(async () => {
    const session = activeSessionRef.current;
    activeSessionRef.current = null;
    if (!session) return;
    // Start the keepalive request before yielding, including during tab unload.
    const leaving = fetch(`/api/rooms/${session.roomHash}/leave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connectionId: session.connectionId }),
      keepalive: true,
    });
    await Promise.all([session.room?.disconnect(), leaving]);
    const noiseContext = noiseContextRef.current;
    noiseContextRef.current = null;
    if (noiseContext && noiseContext.state !== "closed") await noiseContext.close().catch(() => {});
  }, []);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [dbParticipants, setDbParticipants] = useState<{ id: string; displayName: string }[]>([]);

  // All participants use the persisted meeting start, including late joins/rejoins.
  const meetingClockRef = useRef<ReturnType<typeof createMeetingClock> | null>(null);

  // 5. Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartedAt, setRecordingStartedAt] = useState<number | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // Set while startRecording awaits the audio graph, before mediaRecorderRef
  // exists; a stop in that window cancels the start instead of missing it.
  const recordingStartRef = useRef<{ cancelled: boolean } | null>(null);
  const recordingBusRef = useRef<RecordingBus | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartOffsetRef = useRef<number | null>(null);
  // Host "start" requests received vs. acted on: a late joiner can receive one
  // mid-join, before its room and mic are ready, so starting waits for the join.
  const [recordStartRequests, setRecordStartRequests] = useState(0);
  const handledRecordStartsRef = useRef(0);
  const pendingUploadResolveRef = useRef<(() => void) | null>(null);
  const recordingDurationOverrideRef = useRef<number | null>(null);

  // 6. Transcript Timeline State
  const [transcriptSegments, setTranscriptSegments] = useState<LiveTranscriptSegment[]>([]);
  const [showTranscriptPanel, setShowTranscriptPanel] = useState(false);
  const transcriptListRef = useRef<HTMLDivElement>(null);
  // Follow new lines only while the reader is at the bottom, so scrolling up
  // to read earlier lines isn't yanked back by every interim update.
  const followTranscriptRef = useRef(true);
  // Interim text changes several times a second while someone speaks; only
  // the bubble showing it subscribes, not the whole room.
  const [interimStore] = useState(createTextStore);
  // Set once the server answers that it has no speech-to-text configured.
  const [serverSttUnavailable, setServerSttUnavailable] = useState(false);

  // Container ref for attaching remote audio elements
  const audioContainerRef = useRef<HTMLDivElement>(null);
  // The element attached for each remote track. LiveKit has already
  // detached the track by the time TrackUnsubscribed fires, so the element
  // can't be recovered from the track then.
  const remoteAudioElementsRef = useRef(new Map<RemoteTrack, HTMLMediaElement>());

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
          if (!noiseContextRef.current || noiseContextRef.current.state === "closed") {
            noiseContextRef.current = new AudioCtx({ sampleRate: 48000 });
          }
          audioTrack.setAudioContext(noiseContextRef.current);
        }
        await audioTrack.setProcessor(new RNNoiseProcessor());
      }
    } catch (err) {
      console.warn("Failed to apply RNNoise processor:", err);
    }
  }

  // Attempt joining room (db presence + LiveKit token)
  async function attemptJoin(name: string) {
    if (!room || joiningRef.current || isJoining || hasJoined) return;
    joiningRef.current = true;
    let joined = false;

    setIsJoining(true);
    setJoinError(null);

    let shouldMute = isMicrophoneMuted;

    try {
      // Joining muted must not request or capture microphone audio.
      if (!shouldMute && micPermissionState !== "granted") {
        setJoinStep("permission");
        const granted = await requestMicrophonePermission();
        if (!granted) {
          setIsMicrophoneMuted(true);
          shouldMute = true;
        }
      }
      if (!mountedRef.current) return;
      // Step A: DB Join API
      setJoinStep("room");
      const response = await fetch(`/api/rooms/${room.roomHash}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name }),
      });
      const contentType = response.headers.get("content-type");
      const dbData = contentType?.includes("application/json") ? await response.json() : {};

      if (!response.ok) {
        setJoinError(dbData.error || "ไม่สามารถเข้าร่วมห้องประชุมได้");
        return;
      }

      const session = { connectionId: dbData.connectionId, roomHash: room.roomHash, room: undefined as Room | undefined };
      activeSessionRef.current = session;
      connectionIdRef.current = dbData.connectionId;
      if (!mountedRef.current) return;
      meetingClockRef.current = createMeetingClock(dbData.meetingStartedAt, dbData.serverNow);
      setParticipantId(dbData.participantId);
      setMeetingId(dbData.meetingId);
      setDisplayName(dbData.displayName || name);

      // Step B: Fetch LiveKit JWT Token
      setJoinStep("token");
      const tokenRes = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomHash: room.roomHash,
          identity: dbData.participantId,
          connectionId: dbData.connectionId,
          displayName: name,
          isHost,
        }),
      });
      const tokenContentType = tokenRes.headers.get("content-type");
      const tokenData = tokenContentType?.includes("application/json") ? await tokenRes.json() : {};
      if (!mountedRef.current || activeSessionRef.current !== session) return;

      if (!tokenRes.ok || !tokenData.token) {
        setJoinError(tokenData.error || "ไม่สามารถขอรับ Token สำหรับ LiveKit ได้");
        return;
      }

      // Step C: Connect to LiveKit Room
      const lkRoom = new Room({
        adaptiveStream: true,
        webAudioMix: true,
        publishDefaults: {
          // Speech at 24 kbps with DTX: a silent mic sends almost nothing,
          // which matters when every client downloads up to 39 other mics.
          audioPreset: AudioPresets.speech,
          dtx: true,
          red: true,
        },
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: false, // RNNoise handles noise suppression
          autoGainControl: true,
          sampleRate: 48000,
        },
      });

      session.room = lkRoom;

      // Set up LiveKit Room Event listeners
      setupLivekitEventListeners(lkRoom, dbData.participantId);

      try {
        setJoinStep("connecting");
        await lkRoom.connect(tokenData.wsUrl, tokenData.token, { autoSubscribe: true });
        if (!mountedRef.current || activeSessionRef.current !== session) return;
        // Populate remote participants already in the room upon connection
        setRemoteParticipantsMap(new Map(
          Array.from(lkRoom.remoteParticipants.values(), (participant) => [participant.identity, remoteParticipantState(participant)]),
        ));
        // Publish local audio track if mic not muted
        if (!shouldMute) {
          await lkRoom.localParticipant.setMicrophoneEnabled(true);
          if (!mountedRef.current || activeSessionRef.current !== session) return;
          // Noise cancellation loads and compiles an RNNoise WASM module — pure
          // audio-quality polish, not worth blocking the user's entry to the
          // meeting on. Publish the raw mic track now, swap in the processed
          // one once it's ready.
          const audioTrack = lkRoom.localParticipant.getTrackPublication(Track.Source.Microphone)?.audioTrack as LocalAudioTrack | undefined;
          void applyNoiseCancellation(audioTrack);
        }
        if (!mountedRef.current || activeSessionRef.current !== session) return;
        setLivekitRoom(lkRoom);
        setConnectionStatus("connected");
      } catch (lkErr: unknown) {
        console.error("LiveKit connection error:", lkErr);
        const errMsg = lkErr instanceof Error ? lkErr.message : "Connection failed";
        setJoinError(`ไม่สามารถเชื่อมต่อกับ LiveKit Server ได้ (${errMsg})`);
        return;
      }

      joined = true;
      setHasJoined(true);
    } catch (error) {
      console.error("Join meeting error:", error);
      setJoinError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      if (!joined) {
        await releaseSession().catch((error) => console.error("Release session error:", error));
      }
      joiningRef.current = false;
      setIsJoining(false);
      setJoinStep(null);
    }
  }

  // Setup LiveKit Event Listeners (Active speakers, Join/Leave, Connection status, Host Mute Data, Transcript Data)
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

    lkRoom.on(RoomEvent.Disconnected, () => {
      if (activeSessionRef.current?.room !== lkRoom) return;
      stopRecording();
      void releaseSession().catch((error) => console.error("Release session error:", error));
      audioContainerRef.current?.replaceChildren();
      remoteAudioElementsRef.current.clear();
      setHasJoined(false);
      setLivekitRoom(null);
      setRemoteParticipantsMap(new Map());
      setJoinError("การเชื่อมต่อสิ้นสุดแล้ว คุณสามารถกดเข้าร่วมห้องประชุมอีกครั้งได้");
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
      const activeIds = new Set(speakers.map((s) => s.identity));
      setActiveSpeakerIdentities((prev) => (sameSet(prev, activeIds) ? prev : activeIds));
    });

    // Participant Connected
    lkRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      updateRemoteParticipant(participant);
      // Each client records its own mic, so someone joining mid-recording
      // must be told to start theirs.
      if (isHost && (mediaRecorderRef.current || recordingStartRef.current)) {
        const payload = new TextEncoder().encode(
          JSON.stringify({ type: "RECORDING_CONTROL", action: "start" }),
        );
        lkRoom.localParticipant
          .publishData(payload, { reliable: true, destinationIdentities: [participant.identity] })
          .catch((e) => console.error("Broadcast recording control error:", e));
      }
    });

    // Participant Disconnected
    // Drop a start still waiting on the join, and stop any recording.
    const stopRecordingForHost = () => {
      handledRecordStartsRef.current = 0;
      setRecordStartRequests(0);
      stopRecording();
    };

    lkRoom.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      setRemoteParticipantsMap((prev) => {
        const next = new Map(prev);
        next.delete(participant.identity);
        return next;
      });
      // Recording follows the host: its own recorder stops when it drops, and
      // on rejoin it shows "not recording" and tells no late joiner to start.
      // Members stop too, so the room never ends up half recorded.
      if (isHostParticipant(participant)) {
        const wasRecording = Boolean(mediaRecorderRef.current || recordingStartRef.current);
        stopRecordingForHost();
        if (wasRecording) showToast("ผู้จัดประชุมออกจากห้อง การบันทึกเสียงจึงหยุดลง");
      }
    });

    // Track Subscribed (Attach Audio)
    lkRoom.on(
      RoomEvent.TrackSubscribed,
      (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        if (track.kind === Track.Kind.Audio) {
          const audioElement = track.attach();
          remoteAudioElementsRef.current.set(track, audioElement);
          if (audioContainerRef.current) {
            audioContainerRef.current.appendChild(audioElement);
          }
        }
        updateRemoteParticipant(participant);
      },
    );

    // Remove the element attach() created, or every departed participant
    // leaves an <audio> element behind. Out of the DOM, LiveKit reuses it
    // for the next track it attaches.
    lkRoom.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
      const element = remoteAudioElementsRef.current.get(track);
      remoteAudioElementsRef.current.delete(track);
      track.detach();
      element?.remove();
    });

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

    // Data Received (Host Mute Remote Command & Live Transcript Broadcast)
    lkRoom.on(RoomEvent.DataReceived, (payload: Uint8Array, sender?: RemoteParticipant) => {
      try {
        const decoder = new TextDecoder();
        const data = JSON.parse(decoder.decode(payload));
        // Every token may publish data, so commands must come from the host
        // and a transcript line from the speaker it names.
        const fromHost = isHostParticipant(sender);
        if (data.type === "MUTE_PARTICIPANT" && data.targetIdentity === localId && fromHost) {
          // Mute local mic automatically
          void lkRoom.localParticipant.setMicrophoneEnabled(false);
          setIsMicrophoneMuted(true);
          showToast("ผู้จัดประชุม (Host) ได้ปิดไมโครโฟนของคุณแล้ว");
        } else if (data.type === "TRANSCRIPT_SEGMENT" && data.segment && data.segment.participantId === sender?.identity) {
          setTranscriptSegments((prev) => mergeTranscriptSegments(prev, [data.segment]));
        } else if (data.type === "RECORDING_CONTROL" && fromHost) {
          if (data.action === "start") {
            setRecordStartRequests((n) => n + 1);
          } else if (data.action === "stop") {
            stopRecordingForHost();
          }
        }
      } catch (e) {
        console.error("DataReceived error:", e);
      }
    });
  }

  function updateRemoteParticipant(participant: RemoteParticipant) {
    const state = remoteParticipantState(participant);
    // Skip the update (and the room re-render) when nothing shown changed.
    setRemoteParticipantsMap((prev) => {
      if (sameRemoteParticipantState(prev.get(participant.identity), state)) return prev;
      const next = new Map(prev);
      next.set(participant.identity, state);
      return next;
    });
  }

  // Round-trip time of LiveKit's signaling connection, measured by its pings.
  useEffect(() => {
    if (connectionStatus !== "connected" || !livekitRoom) return;
    const readPing = () => {
      const rtt = livekitRoom.engine.client.rtt;
      setPingMs(rtt > 0 ? Math.round(rtt) : null);
    };
    readPing();
    const interval = setInterval(readPing, PING_POLL_MS);
    return () => clearInterval(interval);
  }, [connectionStatus, livekitRoom]);

  // Poll database active participants
  useEffect(() => {
    if (!hasJoined || !room) return;

    let isMounted = true;

    async function fetchParticipants() {
      if (document.hidden) return;
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
    const interval = setInterval(fetchParticipants, PARTICIPANT_POLL_MS);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [hasJoined, room, livekitRoom]);

  // Load existing transcript segments
  useEffect(() => {
    if (!hasJoined || !room) return;
    const baseUrl = meetingId
      ? `/api/meetings/${meetingId}/transcript`
      : `/api/rooms/${room.roomHash}/transcript`;
    const targetUrl = participantId
      ? `${baseUrl}?participantId=${encodeURIComponent(participantId)}`
      : baseUrl;

    fetch(targetUrl, { headers: { "x-connection-id": connectionIdRef.current ?? "" } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { segments?: LiveTranscriptSegment[] } | null) => {
        if (data?.segments && Array.isArray(data.segments)) {
          setTranscriptSegments((prev) => mergeTranscriptSegments(prev, data.segments!));
        }
      })
      .catch(() => {});
  }, [hasJoined, room, meetingId, participantId]);

  // Returns a promise that resolves once the recorded audio has finished
  // uploading, so callers that navigate away (e.g. ending the meeting) can
  // wait for the MinIO upload instead of cancelling it mid-flight.
  const stopRecording = useCallback(() => {
    return new Promise<void>((resolve) => {
      // Cancel a start still waiting on the audio graph, and release the ref
      // now: that start holds its own handle, and keeping the ref set until
      // it settles would make a quick restart look like a duplicate start.
      if (recordingStartRef.current) {
        recordingStartRef.current.cancelled = true;
        recordingStartRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        // Derive duration from the meeting clock (same clock transcript
        // timestamps use), not the setInterval counter below — background
        // tabs throttle intervals, which would under-report duration and
        // throw off the segment-to-recording time match on playback.
        const clock = meetingClockRef.current;
        const startOffset = recordingStartOffsetRef.current;
        recordingDurationOverrideRef.current =
          clock && startOffset !== null
            ? Math.max(1, Math.round(clock().elapsedSeconds - startOffset))
            : null;

        pendingUploadResolveRef.current = resolve;
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      } else {
        resolve();
      }
      recordingStartedAtRef.current = null;
      setRecordingStartedAt(null);
      setIsRecording(false);
    });
  }, []);

  // Keep the admission alive while connecting as well as during the meeting.
  useEffect(() => {
    let cancelled = false;
    async function sendHeartbeat() {
      const session = activeSessionRef.current;
      if (!session) return;
      try {
        const response = await fetch(`/api/rooms/${session.roomHash}/heartbeat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ connectionId: session.connectionId }),
        });
        if (response.status === 409 && !cancelled && activeSessionRef.current === session) {
          stopRecording();
          await releaseSession();
          setHasJoined(false);
          setLivekitRoom(null);
          setJoinError("การเชื่อมต่อห้องประชุมนี้สิ้นสุดแล้ว กรุณาเข้าห้องใหม่");
        }
      } catch (error) {
        console.error("Heartbeat error:", error);
      }
    }
    const interval = setInterval(() => { void sendHeartbeat(); }, HEARTBEAT_INTERVAL_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, [releaseSession, stopRecording]);

  // Opening the panel starts at the newest line.
  useEffect(() => {
    if (showTranscriptPanel) followTranscriptRef.current = true;
  }, [showTranscriptPanel]);

  // Keep the newest segment in view (InterimTranscript does the same for the
  // growing interim draft). Scroll the list itself — scrollIntoView would
  // also scroll the page behind the panel. Jump rather than animate: a smooth
  // scroll's intermediate positions would read as the reader scrolling away
  // and stop the follow.
  useEffect(() => {
    const list = transcriptListRef.current;
    if (showTranscriptPanel && list && followTranscriptRef.current) {
      list.scrollTo({ top: list.scrollHeight });
    }
  }, [transcriptSegments, showTranscriptPanel]);

  // 5. Start / Stop Audio Recording — each client records only its own mic,
  // so every speaker's words end up in their own separate file.
  const startRecording = async () => {
    // A repeated host "start" (a rejoin, a double click) must not open a
    // second recorder: it would orphan the first, which then never stops or
    // uploads.
    if (mediaRecorderRef.current || recordingStartRef.current) return;
    const start = { cancelled: false };
    recordingStartRef.current = start;
    let bus: RecordingBus | undefined;
    try {
      audioChunksRef.current = [];
      recordingStartOffsetRef.current = meetingClockRef.current?.().elapsedSeconds ?? null;

      // Record the bus, not the mic track itself: LiveKit swaps that track
      // after join, and the effect below keeps the bus on the current one.
      // Joining muted records silence rather than opening the mic behind
      // LiveKit's back.
      bus = createRecordingBus();
      bus.setTrack(livekitRoom?.localParticipant.getTrackPublication(Track.Source.Microphone)?.audioTrack?.mediaStreamTrack);
      await bus.resume();
      if (start.cancelled) {
        bus.close();
        return;
      }
      const recordingBus = bus;
      const stream = bus.stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const resolvePendingUpload = pendingUploadResolveRef.current;
        pendingUploadResolveRef.current = null;

        try {
          if (audioChunksRef.current.length === 0) return;
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const startedAt = recordingStartedAtRef.current;
          const duration = recordingDurationOverrideRef.current ??
            Math.max(1, startedAt === null ? 1 : Math.round((Date.now() - startedAt) / 1000));
          recordingDurationOverrideRef.current = null;

          const formData = new FormData();
          formData.append("file", audioBlob, `speaker-${participantId || "guest"}-${Date.now()}.webm`);
          formData.append("durationSeconds", String(duration));
          formData.append("participantId", participantId || "");
          if (recordingStartOffsetRef.current !== null) {
            formData.append("startOffsetSeconds", String(recordingStartOffsetRef.current));
          }

          const targetUrl = meetingId
            ? `/api/meetings/${meetingId}/recordings`
            : `/api/rooms/${room?.roomHash}/recordings`;

          const res = await fetch(targetUrl, {
            method: "POST",
            // Headers, not just form fields: the server checks access before
            // reading a possibly long upload.
            headers: { "x-connection-id": connectionIdRef.current ?? "", "x-participant-id": participantId || "" },
            body: formData,
          });
          if (res.ok) {
            showToast("บันทึกเสียงและอัปโหลดไปยัง MinIO สำเร็จแล้ว");
          }
        } catch (uploadErr) {
          console.error("Recording upload error:", uploadErr);
        } finally {
          recordingBus.close();
          if (recordingBusRef.current === recordingBus) recordingBusRef.current = null;
          resolvePendingUpload?.();
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      recordingBusRef.current = recordingBus;
      const startedAt = Date.now();
      recordingStartedAtRef.current = startedAt;
      setRecordingStartedAt(startedAt);
      setIsRecording(true);

      showToast("เริ่มบันทึกเสียงการประชุมแล้ว");
    } catch (err) {
      bus?.close();
      console.error("Failed to start recording:", err);
      showToast("ไม่สามารถเริ่มบันทึกเสียงได้");
    } finally {
      if (recordingStartRef.current === start) recordingStartRef.current = null;
    }
  };

  // Follow the local mic while recording: publish/unpublish (mute toggles),
  // LiveKit restarts, and the RNNoise processor swap all change which
  // MediaStreamTrack carries the audio.
  useEffect(() => {
    const bus = recordingBusRef.current;
    if (!isRecording || !livekitRoom || !bus) return;
    return followLocalMicrophone(livekitRoom, bus.setTrack);
  }, [isRecording, livekitRoom]);

  // Host-triggered: every participant's client records only its own mic,
  // so the meeting ends up with one file per speaker instead of one mixed file.
  const toggleRecording = async () => {
    if (!isHost || !livekitRoom?.localParticipant) return;
    const action = isRecording ? "stop" : "start";
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({ type: "RECORDING_CONTROL", action }),
      );
      await livekitRoom.localParticipant.publishData(payload, { reliable: true });
    } catch (e) {
      console.error("Broadcast recording control error:", e);
    }
    if (action === "stop") {
      stopRecording();
    } else {
      void startRecording();
    }
  };

  // Recording starts only when the host presses record; members follow the
  // host's "start" once their own join has finished.
  useEffect(() => {
    if (recordStartRequests === handledRecordStartsRef.current || !hasJoined || !livekitRoom) return;
    handledRecordStartsRef.current = recordStartRequests;
    void startRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordStartRequests, hasJoined, livekitRoom]);

  // Read the active connection from a ref: state changes must never end a session.
  useEffect(() => {
    mountedRef.current = true;
    function notifyLeave() {
      mountedRef.current = false;
      stopRecording();
      void releaseSession().catch((error) => console.error("Leave room error:", error));
    }
    window.addEventListener("beforeunload", notifyLeave);
    return () => {
      window.removeEventListener("beforeunload", notifyLeave);
      notifyLeave();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [releaseSession, stopRecording]);

  // Show Toast notification popup; a newer toast gets its own full 4 seconds.
  function showToast(msg: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      toastTimerRef.current = null;
      setToastMessage(null);
    }, 4000);
  }

  // Add and broadcast transcript segment with start and end time
  const addTranscriptSegment = useCallback(async (
    text: string,
    startTimeOffset?: number,
    durationSec?: number,
    confidence = 0,
  ) => {
    const clock = meetingClockRef.current;
    if (!text.trim() || !clock) return;
    const { elapsedSeconds: elapsedSec, spokenAt } = clock();
    const segStartTime = startTimeOffset !== undefined ? startTimeOffset : Math.max(0, elapsedSec - (durationSec || 2));
    // Server transcription returns a line seconds after it was spoken, so
    // the end comes from the audio's own length, not from arrival time.
    const segEndTime = Math.max(
      segStartTime + 0.5,
      startTimeOffset !== undefined && durationSec !== undefined ? segStartTime + durationSec : elapsedSec,
    );

    const newSegment: LiveTranscriptSegment = {
      id: `seg-${crypto.randomUUID()}`,
      participantId: participantId || undefined,
      speakerName: displayName || "คุณ",
      startTime: Number(segStartTime.toFixed(2)),
      endTime: Number(segEndTime.toFixed(2)),
      spokenAt,
      text: text.trim(),
      confidence: Number(confidence.toFixed(2)),
    };

    setTranscriptSegments((prev) => mergeTranscriptSegments(prev, [newSegment]));

    // Broadcast across LiveKit Data Channel
    if (livekitRoom?.localParticipant) {
      try {
        const payload = new TextEncoder().encode(
          JSON.stringify({ type: "TRANSCRIPT_SEGMENT", segment: newSegment }),
        );
        await livekitRoom.localParticipant.publishData(payload, { reliable: true });
      } catch (e) {
        console.error("Broadcast transcript error:", e);
      }
    }

    // Persist to database. Everyone has already seen this line live, so a
    // failed save is retried rather than silently missing from the history.
    const targetUrl = meetingId
      ? `/api/meetings/${meetingId}/transcript`
      : `/api/rooms/${room?.roomHash}/transcript`;
    const request: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-connection-id": connectionIdRef.current ?? "" },
      body: JSON.stringify(newSegment),
      // Lets a line spoken just before the tab closes still reach the server.
      keepalive: true,
    };
    const saved = await saveTranscriptSegment(() => fetch(targetUrl, request));
    if (!saved) {
      console.error("Save transcript segment failed:", newSegment.id);
      showToast("บันทึกข้อความถอดเสียงไม่สำเร็จ บางประโยคอาจไม่อยู่ในประวัติการประชุม");
    }
  }, [participantId, displayName, livekitRoom, meetingId, room]);

  // Recognition consumes the same cleaned local audio used in the meeting.
  // Server-side speech-to-text works in every browser; the browser's own
  // recognizer (Chrome only) is the fallback when the server has none set up.
  useEffect(() => {
    if (!hasJoined || isMicrophoneMuted || !livekitRoom) return;
    const clock = meetingClockRef.current;
    if (!clock) return;
    const onStatus = (message: string, isError?: boolean) => {
      console.debug("Live transcription:", message);
      if (isError) showToast(message);
    };
    if (meetingId && !serverSttUnavailable) {
      const bus = createRecordingBus();
      const stopFollowing = followLocalMicrophone(livekitRoom, bus.setTrack);
      const stop = startServerTranscription(bus, {
        elapsedSeconds: () => clock().elapsedSeconds,
        transcribe: (wav) => {
          const form = new FormData();
          form.append("audio", wav, "speech.wav");
          form.append("participantId", participantId ?? "");
          return fetch(`/api/meetings/${meetingId}/transcribe`, {
            method: "POST",
            headers: { "x-connection-id": connectionIdRef.current ?? "" },
            body: form,
          });
        },
        onFinal: (text, start, duration) => {
          void addTranscriptSegment(text, start, duration);
        },
        onPending: (pending) => interimStore.set(pending ? "กำลังถอดเสียง…" : ""),
        onStatus,
        onUnavailable: () => setServerSttUnavailable(true),
      });
      return () => {
        stop();
        stopFollowing();
        bus.close();
      };
    }
    const speechWindow = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognizer;
      webkitSpeechRecognition?: new () => SpeechRecognizer;
    };
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("This browser does not support live transcription.");
      showToast("เบราว์เซอร์นี้ไม่รองรับการถอดเสียงสด กรุณาใช้ Google Chrome");
      return;
    }
    return startLiveTranscription(new SpeechRecognition(), {
      getAudioTrack: () => livekitRoom.localParticipant
        .getTrackPublication(Track.Source.Microphone)?.audioTrack?.mediaStreamTrack,
      elapsedSeconds: () => clock().elapsedSeconds,
      onFinal: (text, start, duration, confidence) => {
        void addTranscriptSegment(text, start, duration, confidence);
      },
      onInterim: interimStore.set,
      onStatus,
    });
  }, [hasJoined, isMicrophoneMuted, livekitRoom, addTranscriptSegment, interimStore, meetingId, participantId, serverSttUnavailable]);

  // 3. Toggle local Microphone
  const toggleMicrophone = async () => {
    const nextMuted = !isMicrophoneMuted;
    if (nextMuted) setIsMicrophoneMuted(true);

    if (livekitRoom?.localParticipant) {
      try {
        await livekitRoom.localParticipant.setMicrophoneEnabled(!nextMuted);

        if (!nextMuted) {
          const audioTrack = livekitRoom.localParticipant.getTrackPublication(Track.Source.Microphone)?.audioTrack as LocalAudioTrack | undefined;
          await applyNoiseCancellation(audioTrack);
          setIsMicrophoneMuted(false);
        }
      } catch (err) {
        setIsMicrophoneMuted(!nextMuted);
        console.error("Set microphone enabled error:", err);
      }
    }
  };

  // 8. Host Mute Remote Participant. Stable, so memoized tiles and rows
  // don't re-render just because the room did.
  const hostMuteParticipant = useCallback(async (targetIdentity: string) => {
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
  }, [isHost, livekitRoom]);

  const handleHostEndRoom = async () => {
    if (!isHost || !room) return;
    try {
      // Broadcast first so every participant's client stops and uploads its
      // own recording before the host's disconnect/redirect below tears
      // down the room.
      if (livekitRoom?.localParticipant) {
        try {
          const payload = new TextEncoder().encode(
            JSON.stringify({ type: "RECORDING_CONTROL", action: "stop" }),
          );
          await livekitRoom.localParticipant.publishData(payload, { reliable: true });
        } catch (e) {
          console.error("Broadcast recording stop error:", e);
        }
      }
      if (isRecording) {
        await stopRecording();
      }
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

  // Construct UI Participants list
  const allUiParticipants = useMemo<UiParticipant[]>(() => {
    const localUiParticipant: UiParticipant = {
      id: participantId || "local",
      name: displayName,
      initials: displayName.slice(0, 2).toUpperCase(),
      avatarUrl: participantMetadata(livekitRoom?.localParticipant).avatarUrl,
      isHost,
      isLocal: true,
      isSpeaking: !isMicrophoneMuted && activeSpeakerIdentities.has(participantId || ""),
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
        avatarUrl: rp.avatarUrl,
        isHost: rp.isHost,
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
          avatarUrl: null,
          isHost: false,
          isLocal: false,
          isSpeaking: activeSpeakerIdentities.has(dbp.id),
          isMuted: false,
          connectionQuality: "ปกติ",
        });
      }
    });

    return [localUiParticipant, ...remoteParticipantsList];
  }, [
    participantId, displayName, livekitRoom, isHost, isMicrophoneMuted,
    activeSpeakerIdentities, remoteParticipantsMap, dbParticipants,
  ]);

  // Transcript avatars and tones depend only on who is in the room and in what
  // order, not on who is speaking, so the transcript doesn't re-render on
  // every speaker change.
  const speakerKey = allUiParticipants.map((p) => `${p.id}\u0000${p.avatarUrl ?? ""}`).join("\u0001");
  const speakerStyles = useMemo(() => {
    const styles = new Map<string, SpeakerStyle>();
    speakerKey.split("\u0001").forEach((entry, index) => {
      const [id, avatarUrl] = entry.split("\u0000");
      styles.set(id, { tone: toneFor(index), avatarUrl: avatarUrl || null });
    });
    return styles;
  }, [speakerKey]);

  if (!room || roomStatusState !== "active") {
    return (
      <main className="meeting-unavailable">
        <div className="meeting-unavailable__card">
          <span className="meeting-unavailable__icon">
            <AlertTriangle aria-hidden="true" className="icon-24" strokeWidth={1.8} />
          </span>
          <h1 className="meeting-unavailable__title">
            {!room || roomStatusState === "invalid" ? "ไม่พบห้องประชุม" : "ห้องประชุมนี้สิ้นสุดแล้ว"}
          </h1>
          <p className="meeting-unavailable__description">
            {!room || roomStatusState === "invalid"
              ? `ไม่พบห้องสำหรับรหัส ${requestedSlug}`
              : "ห้องประชุมสิ้นสุดการใช้งานหรือถูกปิดโดย Host แล้ว"}
          </p>
          <Link href="/dashboard" className="meeting-unavailable__link action-fill focus-ring">
            กลับไปที่แดชบอร์ด
          </Link>
        </div>
      </main>
    );
  }

  const handleJoinSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = (isHost ? hostName ?? "" : displayName).trim();

    if (!trimmedName) {
      setNameError("กรุณากรอกชื่อของคุณ");
      return;
    }

    void attemptJoin(trimmedName);
  };

  // Both roles enter from a user gesture so browser audio activation is available.
  if (!hasJoined) {
    if (isJoining) {
      const stepLabel: Record<NonNullable<typeof joinStep>, string> = {
        permission: "กำลังขอสิทธิ์ไมโครโฟน...",
        room: "กำลังเข้าร่วมห้องประชุม...",
        token: "กำลังขอสิทธิ์เชื่อมต่อ...",
        connecting: "กำลังเชื่อมต่อกับเซิร์ฟเวอร์ประชุม...",
      };
      return (
        <main className="meeting-lobby">
          <div className="meeting-lobby__card">
            <div className="meeting-lobby__joining">
              <TypewriterLoader label={joinStep ? stepLabel[joinStep] : "กำลังเข้าร่วม..."} />
            </div>
          </div>
        </main>
      );
    }
    return (
      <main className="meeting-lobby">
        {isHost && (
          <Link href="/dashboard" className="meeting-lobby__back action-fill focus-ring">
            <ChevronLeft aria-hidden="true" className="icon-18" strokeWidth={1.8} />
            กลับไปที่แดชบอร์ด
          </Link>
        )}

        <form onSubmit={handleJoinSubmit} className="meeting-lobby__card">
          <div className="meeting-lobby__intro">
            <span className="meeting-lobby__room-icon">
              <Video aria-hidden="true" className="meeting-lobby__video-icon" strokeWidth={1.8} />
            </span>
            <div className="meeting-lobby__title-group">
              <h1 className="meeting-lobby__title">{room.roomName}</h1>
              <p className="meeting-lobby__occupancy">
                รองรับผู้เข้าร่วมสูงสุด {room.maxParticipants} คน
              </p>
            </div>
          </div>

          {/* Both roles see permission status independently of their mute choice. */}
          <div className="meeting-lobby__mic-row">
            <div className="meeting-lobby__mic-row-main">
              <div className="meeting-lobby__mic-info">
                <span className="meeting-lobby__mic-label">
                  <Mic aria-hidden="true" className="icon-18" strokeWidth={1.8} /> สิทธิ์ใช้งานไมโครโฟน
                </span>
                {(micPermissionState === "prompt" || micPermissionState === "requesting") && (
                  <span className="meeting-lobby__mic-state">
                    {micPermissionState === "prompt" ? "ยังไม่ได้ตรวจสอบ" : "กำลังตรวจสอบ..."}
                  </span>
                )}
              </div>
              {micPermissionState === "granted" && (
                <span className="pill pill--sm pill--ok shrink-0">
                  <Check aria-hidden="true" className="icon-14" strokeWidth={2.4} />
                  <span className="pill__label">พร้อมใช้งาน</span>
                </span>
              )}
              {micPermissionState === "denied" && (
                <span className="pill pill--sm pill--bad shrink-0">
                  <AlertTriangle aria-hidden="true" className="icon-14" />
                  <span className="pill__label">ถูกปฏิเสธ</span>
                </span>
              )}
              {micPermissionState === "prompt" && (
                <button
                  type="button"
                  onClick={requestMicrophonePermission}
                  disabled={isJoining}
                  className="btn btn--secondary btn--sm action-fill focus-ring shrink-0"
                >
                  ตรวจสอบ
                </button>
              )}
            </div>

            {micPermissionState === "denied" && (
              <div className="meeting-lobby__mic-denied">
                <p>เบราว์เซอร์บล็อกไมโครโฟน โปรดอนุญาตไมโครโฟนที่แถบ address bar</p>
                <button
                  type="button"
                  onClick={requestMicrophonePermission}
                  disabled={isJoining}
                  className="meeting-lobby__mic-retry action-fill focus-ring"
                >
                  ขอสิทธิ์ไมโครโฟนอีกครั้ง
                </button>
              </div>
            )}
          </div>

          {!isHost && (
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
            </div>
          )}

          <div className="meeting-lobby__mic">
            <button
              type="button"
              onClick={() => setIsMicrophoneMuted((muted) => !muted)}
              disabled={isJoining || micPermissionState === "requesting"}
              aria-label="ไมโครโฟนก่อนเข้าห้อง"
              aria-pressed={!isMicrophoneMuted}
              aria-describedby="lobby-microphone-status"
              title={isMicrophoneMuted ? "เปิดไมค์ก่อนเข้าห้อง" : "ปิดไมค์ก่อนเข้าห้อง"}
              className={`${isMicrophoneMuted ? "meeting-lobby__mic-toggle--off" : "meeting-lobby__mic-toggle"} focus-ring`}
            >
              {isMicrophoneMuted ? (
                <MicOff aria-hidden="true" className="icon-24" strokeWidth={1.8} />
              ) : (
                <Mic aria-hidden="true" className="icon-24" strokeWidth={1.8} />
              )}
            </button>
            <p id="lobby-microphone-status" aria-live="polite" className="meeting-lobby__mic-caption">
              {isMicrophoneMuted ? "เข้าห้องโดยปิดไมค์" : "เข้าห้องโดยเปิดไมค์"}
            </p>
          </div>

          {joinError && (
            <p role="alert" className="meeting-lobby__error text-center">
              {joinError}
            </p>
          )}

          <button
            type="submit"
            disabled={isJoining || micPermissionState === "requesting" || (isHost && !hostName?.trim())}
            className="meeting-lobby__join action-fill focus-ring"
          >
            <LogIn aria-hidden="true" className="icon-18" strokeWidth={1.8} />
            {isJoining ? "กำลังเข้าร่วม..." : "เข้าร่วมห้องประชุม"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="meeting-room">
      {/* Hidden audio container for LiveKit remote tracks */}
      <div ref={audioContainerRef} className="hidden" aria-hidden="true" />

      {/* Toast Banner */}
      {toastMessage && (
        <div role="status" className="meeting-toast">
          {toastMessage}
        </div>
      )}

      {/* Reconnection Banner */}
      {isReconnecting && (
        <div role="status" className="meeting-reconnect">
          <RefreshCw aria-hidden="true" className="icon-14 animate-spin" />
          สัญญาณขาดหาย กำลังเชื่อมต่อห้องประชุมใหม่อัตโนมัติ...
        </div>
      )}

      <header className="meeting-room__header">
        <div className="meeting-room__heading">
          <div className="meeting-room__title-row">
            <h1 className="meeting-room__title">{room.roomName}</h1>
            {isRecording && recordingStartedAt !== null && (
              <span className="meeting-room__recording">
                <span aria-hidden="true" className="meeting-room__recording-dot" />
                <RecordingTimer key={recordingStartedAt} startedAt={recordingStartedAt} />
              </span>
            )}
          </div>
          <p className="meeting-room__meta">กำลังประชุมอยู่ · ระบบเสียง WebRTC + RNNoise</p>
        </div>

        {/* Connection Status & Ping Badge */}
        <div className="meeting-room__status">
          <span
            className={`meeting-room__connection ${
              connectionStatus === "connected"
                ? "pill--ok"
                : connectionStatus === "reconnecting"
                ? "pill--warn"
                : "pill--bad"
            }`}
          >
            <span aria-hidden="true" className="pill__dot" />
            {connectionStatus === "connected" && (
              <span>
                Connected
                {pingMs !== null && (
                  <>
                    {" · "}
                    <span className="font-mono font-medium">{pingMs} ms</span>
                  </>
                )}
              </span>
            )}
            {connectionStatus === "reconnecting" && <span>Reconnecting...</span>}
            {connectionStatus === "disconnected" && <span>Disconnected</span>}
          </span>

          <span className="meeting-room__count">
            <Users aria-hidden="true" className="icon-18" strokeWidth={1.8} />
            <span className="meeting-room__count-value">
              {allUiParticipants.length} / {room.maxParticipants}
            </span>
          </span>
        </div>

        <div className="meeting-room__header-end">
          <ThemeSwitch iconOnly />
          {showTranscriptPanel && (
            <span className="pill meeting-room__transcript-status h-[30px]">
              <FileText aria-hidden="true" className="icon-16" strokeWidth={1.8} />
              Live transcript
            </span>
          )}
        </div>
      </header>

      <div className="meeting-room__layout">
        <section aria-label="ผู้เข้าร่วมประชุม" className="meeting-room__stage">
          <div className="meeting-room__tiles">
            {allUiParticipants.map((participant, index) => (
              <ParticipantTile
                key={participant.id}
                id={participant.id}
                name={participant.name}
                initials={participant.initials}
                avatarUrl={participant.avatarUrl}
                role={roleFor(participant)}
                tone={toneFor(index)}
                isSpeaking={participant.isSpeaking}
                isMuted={participant.isMuted}
                onMute={isHost && !participant.isLocal ? hostMuteParticipant : undefined}
              />
            ))}
          </div>
        </section>

        {/* Participants Sidebar */}
        <aside aria-labelledby="meeting-participants-title" className="meeting-room__participants">
          <h2 id="meeting-participants-title" className="meeting-room__participants-title">
            ผู้เข้าร่วม ({allUiParticipants.length})
          </h2>
          <ul className="meeting-room__participants-list">
            {allUiParticipants.map((participant, index) => (
              <ParticipantRow
                key={participant.id}
                id={participant.id}
                name={participant.name}
                initials={participant.initials}
                avatarUrl={participant.avatarUrl}
                role={roleFor(participant)}
                tone={toneFor(index)}
                isSpeaking={participant.isSpeaking}
                isMuted={participant.isMuted}
                onMute={isHost && !participant.isLocal ? hostMuteParticipant : undefined}
              />
            ))}
          </ul>
        </aside>
      </div>

      {/* Live Transcript Timeline Panel */}
      {showTranscriptPanel && (
        <section
          aria-labelledby="live-transcript-title"
          className="live-transcript"
        >
          <div className="live-transcript__header">
            <h2 id="live-transcript-title" className="live-transcript__title">
              <FileText aria-hidden="true" className="icon-18" strokeWidth={1.8} />
              Live Transcript ({transcriptSegments.length})
            </h2>
            <button
              type="button"
              onClick={() => setShowTranscriptPanel(false)}
              aria-label="ปิด Live Transcript"
              className="close-btn focus-ring"
            >
              <X aria-hidden="true" className="icon-18" />
            </button>
          </div>

          <div
            ref={transcriptListRef}
            onScroll={(event) => {
              const list = event.currentTarget;
              followTranscriptRef.current = list.scrollHeight - list.scrollTop - list.clientHeight < 48;
            }}
            aria-live="polite"
            className="live-transcript__list"
          >
            <TranscriptLines
              segments={transcriptSegments}
              participantId={participantId}
              displayName={displayName}
              speakers={speakerStyles}
            />
            <InterimTranscript
              store={interimStore}
              isMuted={isMicrophoneMuted}
              hasSegments={transcriptSegments.length > 0}
              listRef={transcriptListRef}
              followRef={followTranscriptRef}
            />
          </div>

          <div className="live-transcript__footer">
            {isMicrophoneMuted ? (
              <>
                <span aria-hidden="true" className="live-transcript__dot bg-bad" />
                <span className="flex-1 text-muted">ไมค์ของคุณปิดอยู่ จึงไม่ถูกถอดเสียง</span>
                <button type="button" onClick={toggleMicrophone} className="btn btn--secondary btn--sm action-fill focus-ring">
                  เปิดไมค์
                </button>
              </>
            ) : (
              <>
                <span aria-hidden="true" className="live-transcript__dot bg-ok-dot" />
                <span>กำลังฟัง — พูดแล้วข้อความจะแสดงที่นี่</span>
              </>
            )}
          </div>
        </section>
      )}

      <footer className="meeting-room__controls" aria-label="ตัวควบคุมการประชุม">
        {/* Mute / Unmute Microphone Toggle */}
        <div className="meeting-control-group">
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
              <MicOff aria-hidden="true" className="icon-20" strokeWidth={1.8} />
            ) : (
              <Mic aria-hidden="true" className="icon-20" strokeWidth={1.8} />
            )}
          </button>
          <span className="meeting-control-group__caption">{isMicrophoneMuted ? "ปิดไมค์" : "ไมค์เปิด"}</span>
        </div>

        {/* Recording Toggle Button — host-only: starts/stops recording for every participant */}
        {isHost && (
          <div className="meeting-control-group">
            <button
              type="button"
              onClick={() => void toggleRecording()}
              aria-label={isRecording ? "หยุดบันทึกเสียง" : "เริ่มบันทึกเสียง"}
              aria-pressed={isRecording}
              title={isRecording ? "หยุดบันทึกเสียงและอัปโหลด" : "บันทึกเสียงการประชุม (แยกไฟล์ตามผู้พูด)"}
              className={`meeting-control focus-ring ${
                isRecording ? "meeting-control--recording" : "meeting-control--record"
              }`}
            >
              {isRecording ? (
                <Square aria-hidden="true" className="icon-18 fill-current" />
              ) : (
                <Circle aria-hidden="true" className="icon-20 fill-current" />
              )}
            </button>
            <span className="meeting-control-group__caption">{isRecording ? "กำลังบันทึก" : "บันทึก"}</span>
          </div>
        )}

        {/* Live Transcript Drawer Button */}
        <div className="meeting-control-group">
          <button
            type="button"
            onClick={() => setShowTranscriptPanel(!showTranscriptPanel)}
            aria-label="บันทึกข้อความสนทนา"
            aria-pressed={showTranscriptPanel}
            title="Live Transcript Timeline"
            className={`meeting-control meeting-control--transcript focus-ring ${showTranscriptPanel ? "meeting-control--transcript-active" : ""}`}
          >
            <FileText aria-hidden="true" className="icon-20" strokeWidth={1.8} />
          </button>
          <span className="meeting-control-group__caption">Transcript</span>
        </div>

        <div aria-hidden="true" className="meeting-control-divider" />

        {isHost && (
          <div className="meeting-control-group">
            <button
              type="button"
              onClick={handleHostEndRoom}
              title="ปิดการประชุมสำหรับทุกคน"
              className="meeting-control__end action-fill action-fill--danger-outline focus-ring-danger"
            >
              <CircleStop aria-hidden="true" className="icon-18" strokeWidth={1.8} />
              <span className="max-sm:sr-only">ปิดการประชุม</span>
            </button>
            <span className="meeting-control-group__caption">สำหรับทุกคน</span>
          </div>
        )}

        <div className="meeting-control-group">
          <button
            type="button"
            onClick={async () => {
              // Leave the call now instead of after the upload, which can take
              // a while; the upload's access check still admits a session that
              // just left. Navigating waits for it, so it isn't cut off.
              const uploaded = stopRecording();
              await releaseSession().catch((error) => console.error("Leave room error:", error));
              await uploaded;
              window.location.href = "/dashboard";
            }}
            aria-label="ออกจากห้อง"
            title="ออกจากห้อง"
            className="meeting-control__leave focus-ring-danger"
          >
            <PhoneOff aria-hidden="true" className="icon-20" strokeWidth={1.8} />
          </button>
          <span className="meeting-control-group__caption">ออก</span>
        </div>
      </footer>
    </main>
  );
}
