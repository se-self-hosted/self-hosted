/**
 * A stable stream for MediaRecorder. LiveKit replaces the microphone's
 * MediaStreamTrack after join (RNNoise swap, device switch, restart) and stops
 * the old one, so a recorder bound to it keeps "recording" silence. Route the
 * current track through one audio graph so the recorder never sees a swap.
 */
// Match the mic capture and RNNoise rate: Firefox refuses to connect a track
// whose sample rate differs from its context's.
export function createRecordingBus(context: AudioContext = new AudioContext({ sampleRate: 48000 })) {
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
      try {
        source = context.createMediaStreamSource(new MediaStream([next]));
      } catch (error) {
        // Still a mismatch (e.g. a device that ignored the rate constraint):
        // record silence for this track rather than fail the whole recording.
        console.error("Recording bus could not use the mic track:", error);
        return;
      }
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
