import { Track, AudioProcessorOptions, TrackProcessor } from "livekit-client";

const FRAME_SIZE = 480; // 10ms at 48000Hz for RNNoise
const BUFFER_SIZE = 1024; // Web Audio script processor buffer size (~21.3ms latency)

interface RNNoiseWasmModule {
  _rnnoise_create: (mode: number) => number;
  _rnnoise_destroy: (state: number) => void;
  _rnnoise_process_frame: (state: number, outPtr: number, inPtr: number) => number;
  _malloc: (bytes: number) => number;
  _free: (ptr: number) => void;
  setValue: (ptr: number, val: number, type: string) => void;
  getValue: (ptr: number, type: string) => number;
}

export class RNNoiseProcessor implements TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> {
  name = "rnnoise";
  processedTrack?: MediaStreamTrack;

  private audioContext?: AudioContext;
  private sourceNode?: MediaStreamAudioSourceNode;
  private processorNode?: ScriptProcessorNode;
  private destinationNode?: MediaStreamAudioDestinationNode;
  private wasmModule?: RNNoiseWasmModule;
  private rnnoiseState?: number;
  private inPtr?: number;
  private outPtr?: number;
  private inBuffer: Float32Array = new Float32Array(FRAME_SIZE);
  private outBuffer: Float32Array = new Float32Array(0);
  private isDestroyed = false;

  async init(opts: AudioProcessorOptions): Promise<void> {
    this.isDestroyed = false;
    try {
      if (typeof window === "undefined") {
        this.processedTrack = opts.track;
        return;
      }

      // 1. AudioContext setup & resume
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = opts.audioContext || (AudioCtx ? new AudioCtx({ sampleRate: 48000 }) : undefined);

      if (this.audioContext && this.audioContext.state === "suspended") {
        try {
          await this.audioContext.resume();
        } catch (e) {
          console.warn("Could not resume AudioContext:", e);
        }
      }

      if (!this.audioContext) {
        throw new Error("Web Audio API AudioContext not supported");
      }

      // 2. Load RNNoise WASM module
      const { default: loadRNNoise } = await import("@/vendor/purify-voice/wasm/rnnoise.js");
      const loadedModule = await loadRNNoise({
        locateFile: (file: string) => {
          if (file.endsWith(".wasm")) {
            return "/rnnoise.wasm";
          }
          return file;
        },
      });
      this.wasmModule = loadedModule as unknown as RNNoiseWasmModule;

      if (this.isDestroyed) {
        await this.destroy();
        return;
      }

      this.rnnoiseState = this.wasmModule._rnnoise_create(0);
      if (!this.rnnoiseState) {
        throw new Error("Failed to initialize RNNoise state");
      }

      this.inPtr = this.wasmModule._malloc(FRAME_SIZE * 4);
      this.outPtr = this.wasmModule._malloc(FRAME_SIZE * 4);

      // 3. Setup Web Audio Graph
      const inputStream = new MediaStream([opts.track]);
      this.sourceNode = this.audioContext.createMediaStreamSource(inputStream);
      this.processorNode = this.audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
      this.destinationNode = this.audioContext.createMediaStreamDestination();

      const mod = this.wasmModule;
      const state = this.rnnoiseState;
      const inPtr = this.inPtr;
      const outPtr = this.outPtr;

      this.processorNode.onaudioprocess = (event: AudioProcessingEvent) => {
        if (this.isDestroyed || !state) return;

        const inputChannel = event.inputBuffer.getChannelData(0);
        const outputChannel = event.outputBuffer.getChannelData(0);

        // Append incoming samples to inBuffer
        const newIn = new Float32Array(this.inBuffer.length + inputChannel.length);
        newIn.set(this.inBuffer);
        newIn.set(inputChannel, this.inBuffer.length);
        this.inBuffer = newIn;

        // Process all complete 480-sample frames
        const outFrames: Float32Array[] = [];
        while (this.inBuffer.length >= FRAME_SIZE) {
          const frame = this.inBuffer.subarray(0, FRAME_SIZE);
          for (let i = 0; i < FRAME_SIZE; i++) {
            mod.setValue(inPtr + i * 4, frame[i] * 32768, "float");
          }
          mod._rnnoise_process_frame(state, outPtr, inPtr);
          const outFrame = new Float32Array(FRAME_SIZE);
          for (let i = 0; i < FRAME_SIZE; i++) {
            outFrame[i] = mod.getValue(outPtr + i * 4, "float") / 32768;
          }
          outFrames.push(outFrame);
          this.inBuffer = this.inBuffer.slice(FRAME_SIZE);
        }

        // Append processed frames to outBuffer
        const totalOutLen = outFrames.reduce((acc, f) => acc + f.length, 0);
        if (totalOutLen > 0) {
          const newOut = new Float32Array(this.outBuffer.length + totalOutLen);
          newOut.set(this.outBuffer);
          let offset = this.outBuffer.length;
          for (const f of outFrames) {
            newOut.set(f, offset);
            offset += f.length;
          }
          this.outBuffer = newOut;
        }

        // Fill destination output channel
        if (this.outBuffer.length >= BUFFER_SIZE) {
          outputChannel.set(this.outBuffer.subarray(0, BUFFER_SIZE));
          this.outBuffer = this.outBuffer.slice(BUFFER_SIZE);
        } else {
          outputChannel.set(this.outBuffer);
          this.outBuffer = new Float32Array(0);
        }
      };

      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.destinationNode);

      this.processedTrack = this.destinationNode.stream.getAudioTracks()[0];
    } catch (err) {
      console.warn("RNNoiseProcessor initialization failed, falling back to unprocessed track:", err);
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
    if (this.processorNode) {
      try {
        this.processorNode.onaudioprocess = null;
        this.processorNode.disconnect();
      } catch {}
      this.processorNode = undefined;
    }
    if (this.destinationNode) {
      try { this.destinationNode.disconnect(); } catch {}
      this.destinationNode = undefined;
    }

    if (this.wasmModule && this.inPtr) {
      try { this.wasmModule._free(this.inPtr); } catch {}
      this.inPtr = undefined;
    }
    if (this.wasmModule && this.outPtr) {
      try { this.wasmModule._free(this.outPtr); } catch {}
      this.outPtr = undefined;
    }
    if (this.wasmModule && this.rnnoiseState) {
      try { this.wasmModule._rnnoise_destroy(this.rnnoiseState); } catch {}
      this.rnnoiseState = undefined;
    }
  }
}
