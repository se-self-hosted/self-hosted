/**
 * A stable stream for MediaRecorder. LiveKit replaces the microphone's
 * MediaStreamTrack after join (RNNoise swap, device switch, restart) and stops
 * the old one, so a recorder bound to it keeps "recording" silence. Route the
 * current track through one audio graph so the recorder never sees a swap.
 */
export function createRecordingBus(context: AudioContext = new AudioContext()) {
  const destination = context.createMediaStreamDestination();
  let source: MediaStreamAudioSourceNode | undefined;
  let current: MediaStreamTrack | undefined;

  return {
    stream: destination.stream,
    resume: () => context.resume(),
    /** Point the bus at `track`; a missing or ended track records silence. */
    setTrack(track?: MediaStreamTrack) {
      const next = track?.readyState === "live" ? track : undefined;
      if (next === current) return;
      source?.disconnect();
      source = undefined;
      current = next;
      if (!next) return;
      source = context.createMediaStreamSource(new MediaStream([next]));
      source.connect(destination);
    },
    close() {
      source?.disconnect();
      source = undefined;
      current = undefined;
      void context.close().catch(() => {});
    },
  };
}

export type RecordingBus = ReturnType<typeof createRecordingBus>;
