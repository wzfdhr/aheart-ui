import type { TreeVirtual } from './types';
export interface NormalizedTreeVirtual {
    height: number;
    estimateSize: number;
    overscan: number;
}
/** Normalize without mutating the caller's configuration. */
export declare function normalizeTreeVirtual(value: TreeVirtual | undefined, warn?: (message: string) => void): NormalizedTreeVirtual | null;
