import type { CascaderVirtual } from './types'
import { normalizeVirtualOptions, type NormalizedVirtualOptions } from '../utils/normalize-virtual-options'

export interface NormalizedCascaderVirtual extends NormalizedVirtualOptions {}
const defaults: NormalizedCascaderVirtual = { height: 256, estimateSize: 32, overscan: 4 }
export function normalizeCascaderVirtual(value: CascaderVirtual | undefined, warn?: (message: string) => void): NormalizedCascaderVirtual | null {
  return normalizeVirtualOptions(value, defaults, 'ACascader', warn, true)
}
