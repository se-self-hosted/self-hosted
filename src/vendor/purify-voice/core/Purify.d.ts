/**
 * Purify Voice - Main Class
 * Professional audio denoising using RNNoise
 */
import type { PurifyOptions, PurifyInstance } from './types';
export declare class Purify implements PurifyInstance {
    private options;
    private ready;
    private rnnoiseWasm;
    private audioContext;
    constructor(options?: PurifyOptions);
    initialize(): Promise<void>;
    processFile(audioFile: File | Blob): Promise<Blob>;
    processBuffer(audioBuffer: AudioBuffer): Promise<AudioBuffer>;
    processStream(inputStream: MediaStream): Promise<MediaStream>;
    processRaw(pcmData: Float32Array): Promise<Float32Array>;
    private audioBufferToWav;
    isReady(): boolean;
    destroy(): void;
}
//# sourceMappingURL=Purify.d.ts.map