import { Track, AudioProcessorOptions, TrackProcessor } from "livekit-client";
import { Purify } from "purify-voice";

export class RNNoiseProcessor implements TrackProcessor<Track.Kind.Audio, AudioProcessorOptions> {
  name = "rnnoise";
  processedTrack?: MediaStreamTrack;
  purify: Purify;

  constructor() {
    this.purify = new Purify();
  }

  async init(opts: AudioProcessorOptions): Promise<void> {
    await this.purify.initialize();
    const stream = new MediaStream([opts.track]);
    const processedStream = await this.purify.processStream(stream);
    this.processedTrack = processedStream.getAudioTracks()[0];
  }

  async restart(opts: AudioProcessorOptions): Promise<void> {
    const stream = new MediaStream([opts.track]);
    const processedStream = await this.purify.processStream(stream);
    this.processedTrack = processedStream.getAudioTracks()[0];
  }

  async destroy(): Promise<void> {
    this.purify.destroy();
  }
}
