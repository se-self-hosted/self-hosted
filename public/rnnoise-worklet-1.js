// RNNoise noise suppression on the audio rendering thread.
//
// Served from /public (an AudioWorklet module must be its own file) and
// cached as immutable: change the "-1" in the file name, and the URL in
// RNNoiseProcessor.ts, whenever this file changes.
//
// The wasm (public/rnnoise-<hash>.wasm) is an Emscripten build whose exports
// are minified. These names are only valid for that exact binary, which is
// why its file name carries its hash:
//   b: memory   c: static constructors   d: malloc   e: free
//   f: rnnoise_create(model)   g: rnnoise_destroy(state)
//   h: rnnoise_process_frame(state, outPtr, inPtr) -> voice probability
// Its single import, a.a, is Emscripten's heap-resize hook.

const FRAME_SIZE = 480; // 10 ms at 48 kHz, the only frame size RNNoise takes
const RING_SIZE = 2048; // power of two, comfortably above the ~608 samples ever queued
const RING_MASK = RING_SIZE - 1;
const PCM_SCALE = 32768; // RNNoise works on 16-bit sample values

// One wasm instance per AudioContext, shared by every processor in it: each
// instance reserves over 100 MB of linear memory.
let rnnoisePromise = null;

function loadRNNoise(wasmBytes) {
  if (!rnnoisePromise) {
    let memory;
    const imports = {
      a: {
        a: (requestedSize) => {
          const size = requestedSize >>> 0;
          const current = memory.buffer.byteLength;
          if (size <= current) return 1;
          try {
            memory.grow(Math.ceil((size - current) / 65536));
            return 1;
          } catch {
            return 0;
          }
        },
      },
    };
    rnnoisePromise = WebAssembly.instantiate(wasmBytes, imports).then(({ instance }) => {
      const exports = instance.exports;
      memory = exports.b;
      exports.c();
      return { exports, memory };
    });
    rnnoisePromise.catch(() => {
      rnnoisePromise = null;
    });
  }
  return rnnoisePromise;
}

class RNNoiseWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.alive = true;
    this.rnnoise = null;
    this.heap = null;
    this.frame = new Float32Array(FRAME_SIZE);
    this.frameLength = 0;
    // Output lags input by one frame: starting with a frame of silence queued
    // means a 128-sample render quantum never finds the queue short.
    this.ring = new Float32Array(RING_SIZE);
    this.readIndex = 0;
    this.writeIndex = FRAME_SIZE;
    this.queued = FRAME_SIZE;

    this.port.onmessage = (event) => {
      const message = event.data;
      if (message?.type === "init") {
        loadRNNoise(message.wasm).then(
          ({ exports, memory }) => {
            if (!this.alive) return;
            const state = exports.f(0);
            if (!state) {
              this.port.postMessage({ type: "error", message: "rnnoise_create failed" });
              return;
            }
            this.rnnoise = {
              exports,
              memory,
              state,
              inPtr: exports.d(FRAME_SIZE * 4),
              outPtr: exports.d(FRAME_SIZE * 4),
            };
            this.port.postMessage({ type: "ready" });
          },
          (error) => this.port.postMessage({ type: "error", message: String(error) }),
        );
      } else if (message?.type === "destroy") {
        this.release();
      }
    };
  }

  release() {
    if (!this.alive) return;
    this.alive = false;
    const rnnoise = this.rnnoise;
    this.rnnoise = null;
    if (rnnoise) {
      rnnoise.exports.g(rnnoise.state);
      rnnoise.exports.e(rnnoise.inPtr);
      rnnoise.exports.e(rnnoise.outPtr);
    }
    this.port.onmessage = null;
  }

  heapView() {
    const buffer = this.rnnoise.memory.buffer;
    // Growing wasm memory detaches the old buffer, so re-take the view then.
    if (!this.heap || this.heap.buffer !== buffer) this.heap = new Float32Array(buffer);
    return this.heap;
  }

  processFrame() {
    const { exports, state, inPtr, outPtr } = this.rnnoise;
    this.heapView().set(this.frame, inPtr >> 2);
    exports.h(state, outPtr, inPtr);
    const heap = this.heapView();
    const base = outPtr >> 2;
    for (let i = 0; i < FRAME_SIZE; i++) {
      this.ring[this.writeIndex] = heap[base + i] / PCM_SCALE;
      this.writeIndex = (this.writeIndex + 1) & RING_MASK;
    }
    this.queued += FRAME_SIZE;
    if (this.queued > RING_SIZE) {
      // Never expected; drop the oldest samples rather than read garbage.
      this.readIndex = (this.readIndex + (this.queued - RING_SIZE)) & RING_MASK;
      this.queued = RING_SIZE;
    }
  }

  process(inputs, outputs) {
    if (!this.alive) return false;
    const input = inputs[0]?.[0];
    const output = outputs[0]?.[0];
    if (!output) return true;

    // Pass the raw mic through until the model is loaded, so joining never
    // waits on the ~15 MB download.
    if (!this.rnnoise) {
      if (input) output.set(input);
      return true;
    }

    if (input) {
      for (let i = 0; i < input.length; i++) {
        this.frame[this.frameLength++] = input[i] * PCM_SCALE;
        if (this.frameLength === FRAME_SIZE) {
          this.processFrame();
          this.frameLength = 0;
        }
      }
    }

    if (this.queued >= output.length) {
      for (let i = 0; i < output.length; i++) {
        output[i] = this.ring[this.readIndex];
        this.readIndex = (this.readIndex + 1) & RING_MASK;
      }
      this.queued -= output.length;
    } else {
      output.fill(0);
    }
    return true;
  }
}

registerProcessor("rnnoise", RNNoiseWorkletProcessor);
