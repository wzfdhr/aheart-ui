import type { TreeVirtual, TreeVirtualConfig } from '../tree/types';
export type TreeSelectVirtualConfig = TreeVirtualConfig;
export type TreeSelectVirtual = TreeVirtual;
import { type NormalizedVirtualOptions } from '../utils/normalize-virtual-options';
export interface NormalizedTreeSelectVirtual extends NormalizedVirtualOptions {
}
export declare function normalizeTreeSelectVirtual(value: TreeSelectVirtual | undefined, warn?: (message: string) => void): NormalizedTreeSelectVirtual | null;
