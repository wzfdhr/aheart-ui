import type { CascaderVirtual } from './types';
export interface NormalizedCascaderVirtual {
    height: number;
    estimateSize: number;
    overscan: number;
}
export declare const normalizeCascaderVirtual: (value: CascaderVirtual | undefined, warn?: ((message: string) => void) | undefined) => NormalizedCascaderVirtual | null;
