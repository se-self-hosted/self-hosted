/**
 * RNNoise WebAssembly Loader
 * Loads and initializes the RNNoise WASM module
 */
export declare function loadRNNoiseWASM(wasmPath?: string): Promise<any>;
export declare class RNNoiseWASM {
    private module;
    private state;
    private wasmPath?;
    constructor(wasmPath?: string);
    initialize(): Promise<void>;
    processFrame(inputFrame: Float32Array): {
        output: Float32Array;
        vadProb: number;
    };
    processAudio(audioData: Float32Array): Float32Array;
    destroy(): void;
}
//# sourceMappingURL=rnnoise-loader.d.ts.map