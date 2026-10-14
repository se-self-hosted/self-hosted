// Mic capture for server-side speech-to-text, on the audio rendering thread.
//
// Served from /public (an AudioWorklet module must be its own file) and
// cached as immutable: change the "-1" in the file name, and the URL in
// server-transcription.ts, whenever this file changes.
//
// Downmixes to mono, averages down to 16 kHz (what speech models expect, a
// third of the upload of 48 kHz) and posts 20 ms frames to the main thread.

const TARGET_RATE = 16000;
const FRAME_SAMPLES = 320;

class PcmCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // `sampleRate` is the AudioContext's rate, a global in this scope.
    this.ratio = sampleRate / TARGET_RATE;
    this.position = 0;
    this.sum = 0;
    this.count = 0;
    this.frame = new Float32Array(FRAME_SAMPLES);
    this.filled = 0;
  }

  process(inputs) {
    const channels = inputs[0];
    if (!channels || channels.length === 0) return true;
    const length = channels[0].length;
    for (let index = 0; index < length; index += 1) {
      let sample = 0;
      for (let channel = 0; channel < channels.length; channel += 1) sample += channels[channel][index];
      this.sum += sample / channels.length;
      this.count += 1;
      this.position += 1;
      if (this.position < this.ratio) continue;
      this.position -= this.ratio;
      this.frame[this.filled] = this.sum / this.count;
      this.sum = 0;
      this.count = 0;
      this.filled += 1;
      if (this.filled === FRAME_SAMPLES) {
        this.port.postMessage(this.frame, [this.frame.buffer]);
        this.frame = new Float32Array(FRAME_SAMPLES);
        this.filled = 0;
      }
    }
    return true;
  }
}

registerProcessor("pcm-capture", PcmCaptureProcessor);
