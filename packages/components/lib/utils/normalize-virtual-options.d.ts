export interface NormalizedVirtualOptions {
    height: number;
    estimateSize: number;
    overscan: number;
}
/** Private shared policy; component wrappers retain their public types and diagnostics. */
export declare function normalizeVirtualOptions(value: unknown, defaults: NormalizedVirtualOptions, name: string, warn?: (message: string) => void, compact?: boolean): NormalizedVirtualOptions | null;
