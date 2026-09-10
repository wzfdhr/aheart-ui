import type { TreeVirtual, TreeVirtualConfig } from '../tree/types';
export type TreeSelectVirtualConfig = TreeVirtualConfig;
export type TreeSelectVirtual = TreeVirtual;
export interface NormalizedTreeSelectVirtual {
    height: number;
    estimateSize: number;
    overscan: number;
}
export declare function normalizeTreeSelectVirtual(value: TreeSelectVirtual | undefined, warn?: (message: string) => void): NormalizedTreeSelectVirtual | null;
