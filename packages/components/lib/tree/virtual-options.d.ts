import type { TreeVirtual } from './types';
import { type NormalizedVirtualOptions } from '../utils/normalize-virtual-options';
export interface NormalizedTreeVirtual extends NormalizedVirtualOptions {
}
export declare function normalizeTreeVirtual(value: TreeVirtual | undefined, warn?: (message: string) => void): NormalizedTreeVirtual | null;
