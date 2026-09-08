import type { TableSize, TableScroll, TableVirtual } from './types';
export interface NormalizedTableVirtual {
    enabled: boolean;
    height: number;
    estimateSize: number;
    overscan: number;
}
export declare function normalizeTableVirtual(value: TableVirtual | undefined, scroll: TableScroll | undefined, size: TableSize, warn?: (message: string) => void): NormalizedTableVirtual;
