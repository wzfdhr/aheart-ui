import type { TreeVirtual, TreeVirtualConfig } from './types'

export interface NormalizedTreeVirtual {
  height: number
  estimateSize: number
  overscan: number
}

const DEFAULTS: NormalizedTreeVirtual = { height: 320, estimateSize: 28, overscan: 4 }
const positive = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0
const plain = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') return false
  const prototype = Object.getPrototypeOf(value)
  // Object.prototype is realm-local; an options object created in an iframe
  // must still be accepted as a plain record.
  return prototype === null || (Object.prototype.toString.call(value) === '[object Object]' && Object.getPrototypeOf(prototype) === null)
}

/** Normalize without mutating the caller's configuration. */
export function normalizeTreeVirtual(value: TreeVirtual | undefined, warn?: (message: string) => void): NormalizedTreeVirtual | null {
  if (value === false || value === undefined) return null
  if (value === true) return { ...DEFAULTS }
  if (!plain(value)) {
    warn?.('[ATree] invalid virtual options; virtualization is disabled.')
    return null
  }
  const source = value as TreeVirtualConfig
  const result = { ...DEFAULTS }
  if (source.height !== undefined) {
    if (positive(source.height)) result.height = source.height
    else warn?.('[ATree] virtual.height must be a positive number; using the default.')
  }
  if (source.estimateSize !== undefined) {
    if (positive(source.estimateSize)) result.estimateSize = source.estimateSize
    else warn?.('[ATree] virtual.estimateSize must be a positive number; using the default.')
  }
  if (source.overscan !== undefined) {
    if (typeof source.overscan === 'number' && Number.isSafeInteger(source.overscan) && source.overscan >= 0) result.overscan = source.overscan
    else warn?.('[ATree] virtual.overscan must be a non-negative safe integer; using the default.')
  }
  return result
}
