import { Track, AudioProcessorOptions, TrackProcessor } from "livekit-client";

// Both files are cached as immutable (see next.config.ts headers), so a new
// build of either must ship under a new name.
const WASM_URL = "/rnnoise-c5576250.wasm";
const WORKLET_URL = "/rnnoise-worklet-1.js";
const SAMPLE_RATE = 48000; // RNNoise only works on 48 kHz audio

// Fetched once per page load and reused by every processor, including the
// ones LiveKit creates on mute/unmute and track restarts.
let wasmBytes: Promise<ArrayBuffer> | null = null;

function loadWasmBytes(): Promise<ArrayBuffer> {
  if (!wasmBytes) {
    const loading = fetch(WASM_URL).then((response) => {
      if (!response.ok) throw new Error(`RNNoise model download failed (${response.status})`);
      return response.arrayBuffer();
    });
    loading.catch(() => {
      if (wasmBytes === loading) wasmBytes = null;
    });
    wasmBytes = loading;
  }
  return wasmBytes;
}

const workletModules = new WeakMap<BaseAudioContext, Promise<void>>();

function loadWorklet(context: BaseAudioContext): Promise<void> {
  let loading = workletModules.get(context);
  if (!loading) {
    loading = context.audioWorklet.addModule(WORKLET_URL);
    loading.catch(() => workletModules.delete(context));
    workletModules.set(context, loading);
  }
  return loading;
}

/**
 * Noise suppression for the local mic. The model runs in an AudioWorklet on
 * the audio rendering thread, so a busy main thread (React renders, network
 * work) can't make the outgoing audio stutter.
 */
export class RNNoiseProcessor implements TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> {
  name = "rnnoise";
  processedTrack?: MediaStreamTrack;

  private audioContext?: AudioContext;
  private ownsAudioContext = false;
  private sourceNode?: MediaStreamAudioSourceNode;
  private workletNode?: AudioWorkletNode;
  private destinationNode?: MediaStreamAudioDestinationNode;
  private isDestroyed = false;

  async init(opts: AudioProcessorOptions): Promise<void> {
    this.isDestroyed = false;
    try {
      if (typeof window === "undefined") {
        this.processedTrack = opts.track;
        return;
      }

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ownsAudioContext = !opts.audioContext;
      this.audioContext = opts.audioContext || (AudioCtx ? new AudioCtx({ sampleRate: SAMPLE_RATE }) : undefined);
      if (!this.audioContext) {
        throw new Error("Web Audio API AudioContext not supported");
      }
      if (this.audioContext.sampleRate !== SAMPLE_RATE) {
        throw new Error(`RNNoise needs ${SAMPLE_RATE} Hz audio, got ${this.audioContext.sampleRate} Hz`);
      }
      if (this.audioContext.state === "suspended") {
        try {
          await this.audioContext.resume();
        } catch (e) {
          console.warn("Could not resume AudioContext:", e);
        }
      }

      const [wasm] = await Promise.all([loadWasmBytes(), loadWorklet(this.audioContext)]);
      if (this.isDestroyed) return;

      this.sourceNode = this.audioContext.createMediaStreamSource(new MediaStream([opts.track]));
      this.workletNode = new AudioWorkletNode(this.audioContext, "rnnoise", {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1],
        channelCount: 1,
        channelCountMode: "explicit",
      });
      this.workletNode.port.onmessage = (event: MessageEvent<{ type: string; message?: string }>) => {
        // The worklet passes the raw mic through when the model can't load.
        if (event.data?.type === "error") console.warn("RNNoise worklet failed to load:", event.data.message);
      };
      // Copied, not transferred: the cached bytes serve later processors too.
      this.workletNode.port.postMessage({ type: "init", wasm });
      this.destinationNode = this.audioContext.createMediaStreamDestination();

      this.sourceNode.connect(this.workletNode);
      this.workletNode.connect(this.destinationNode);

      this.processedTrack = this.destinationNode.stream.getAudioTracks()[0];
    } catch (err) {
      console.warn("RNNoiseProcessor initialization failed, falling back to unprocessed track:", err);
      await this.destroy();
      this.isDestroyed = false;
      this.processedTrack = opts.track;
    }
  }

  async restart(opts: AudioProcessorOptions): Promise<void> {
    await this.destroy();
    await this.init(opts);
  }

  async destroy(): Promise<void> {
    this.isDestroyed = true;

    if (this.sourceNode) {
      try { this.sourceNode.disconnect(); } catch {}
      this.sourceNode = undefined;
    }
    if (this.workletNode) {
      try {
        this.workletNode.port.postMessage({ type: "destroy" });
        this.workletNode.port.onmessage = null;
        this.workletNode.port.close();
        this.workletNode.disconnect();
      } catch {}
      this.workletNode = undefined;
    }
    if (this.destinationNode) {
      // Our own output track; the original mic track belongs to LiveKit.
      this.destinationNode.stream.getTracks().forEach((track) => track.stop());
      try { this.destinationNode.disconnect(); } catch {}
      this.destinationNode = undefined;
    }
    this.processedTrack = undefined;

    const context = this.audioContext;
    this.audioContext = undefined;
    if (context && this.ownsAudioContext && context.state !== "closed") {
      await context.close().catch(() => {});
    }
    this.ownsAudioContext = false;
  }
}
