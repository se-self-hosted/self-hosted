import { RoomEvent, Track, TrackEvent, type LocalTrack, type Room } from "livekit-client";

/**
 * Calls `onTrack` with the MediaStreamTrack carrying the local mic, now and
 * whenever it changes: publish/unpublish (mute toggles), LiveKit restarts,
 * and the RNNoise processor swap all replace it. Returns a cleanup.
 */
export function followLocalMicrophone(room: Room, onTrack: (track?: MediaStreamTrack) => void) {
  const localParticipant = room.localParticipant;
  let micTrack: LocalTrack | undefined;
  const sync = () => {
    const next = localParticipant.getTrackPublication(Track.Source.Microphone)?.track;
    if (next !== micTrack) {
      micTrack?.off(TrackEvent.Restarted, sync).off(TrackEvent.TrackProcessorUpdate, sync);
      micTrack = next;
      micTrack?.on(TrackEvent.Restarted, sync).on(TrackEvent.TrackProcessorUpdate, sync);
    }
    onTrack(micTrack?.mediaStreamTrack);
  };
  sync();
  room.on(RoomEvent.LocalTrackPublished, sync).on(RoomEvent.LocalTrackUnpublished, sync);
  return () => {
    room.off(RoomEvent.LocalTrackPublished, sync).off(RoomEvent.LocalTrackUnpublished, sync);
    micTrack?.off(TrackEvent.Restarted, sync).off(TrackEvent.TrackProcessorUpdate, sync);
  };
}
