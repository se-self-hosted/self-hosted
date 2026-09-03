/**
 * Vue Composable for Purify Voice
 */
import type { PurifyOptions } from '../../core/types.js';
export declare function usePurify(options?: PurifyOptions): {
    isReady: any;
    isProcessing: any;
    error: any;
    processFile: (file: File | Blob) => Promise<Blob | null>;
    processBuffer: (buffer: AudioBuffer) => Promise<AudioBuffer | null>;
    processStream: (stream: MediaStream) => Promise<MediaStream | null>;
};
//# sourceMappingURL=usePurify.d.ts.map