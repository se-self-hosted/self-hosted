/**
 * Angular Service for Purify Voice
 */
import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
export declare class PurifyService implements OnDestroy {
    private purify;
    private _isReady;
    private _isProcessing;
    private _error;
    readonly isReady$: Observable<boolean>;
    readonly isProcessing$: Observable<boolean>;
    readonly error$: Observable<Error | null>;
    constructor();
    private initialize;
    processFile(file: File | Blob): Promise<Blob | null>;
    processBuffer(buffer: AudioBuffer): Promise<AudioBuffer | null>;
    processStream(stream: MediaStream): Promise<MediaStream | null>;
    get isReady(): boolean;
    get isProcessing(): boolean;
    get error(): Error | null;
    ngOnDestroy(): void;
}
//# sourceMappingURL=purify.service.d.ts.map