import type { TreeVirtual } from './types'
import { normalizeVirtualOptions, type NormalizedVirtualOptions } from '../utils/normalize-virtual-options'

export interface NormalizedTreeVirtual extends NormalizedVirtualOptions {}
const defaults: NormalizedTreeVirtual = { height: 320, estimateSize: 28, overscan: 4 }
export function normalizeTreeVirtual(value: TreeVirtual | undefined, warn?: (message: string) => void): NormalizedTreeVirtual | null {
  return normalizeVirtualOptions(value, defaults, 'ATree', warn)
}
