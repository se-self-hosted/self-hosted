/**
 * React Hook for Purify Voice
 */
import type { PurifyOptions } from '../../core/types.js';
export declare function usePurify(options?: PurifyOptions): {
    isReady: boolean;
    isProcessing: boolean;
    error: Error | null;
    processFile: (file: File | Blob) => Promise<Blob | null>;
    processBuffer: (buffer: AudioBuffer) => Promise<AudioBuffer | null>;
    processStream: (stream: MediaStream) => Promise<MediaStream | null>;
};
//# sourceMappingURL=usePurify.d.ts.map