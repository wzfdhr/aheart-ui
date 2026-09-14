import type { TreeVirtual, TreeVirtualConfig } from '../tree/types'
export type TreeSelectVirtualConfig = TreeVirtualConfig
export type TreeSelectVirtual = TreeVirtual
import { normalizeVirtualOptions, type NormalizedVirtualOptions } from '../utils/normalize-virtual-options'

export interface NormalizedTreeSelectVirtual extends NormalizedVirtualOptions {}
const defaults: NormalizedTreeSelectVirtual = { height: 256, estimateSize: 28, overscan: 4 }
export function normalizeTreeSelectVirtual(value: TreeSelectVirtual | undefined, warn?: (message: string) => void): NormalizedTreeSelectVirtual | null {
  return normalizeVirtualOptions(value, defaults, 'ATreeSelect', warn)
}
