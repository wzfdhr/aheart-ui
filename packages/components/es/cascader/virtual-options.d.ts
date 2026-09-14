import type { CascaderVirtual } from './types';
import { type NormalizedVirtualOptions } from '../utils/normalize-virtual-options';
export interface NormalizedCascaderVirtual extends NormalizedVirtualOptions {
}
export declare function normalizeCascaderVirtual(value: CascaderVirtual | undefined, warn?: (message: string) => void): NormalizedCascaderVirtual | null;
