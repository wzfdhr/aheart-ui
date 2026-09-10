import type { TreeVirtual, TreeVirtualConfig } from '../tree/types'

export type TreeSelectVirtualConfig = TreeVirtualConfig
export type TreeSelectVirtual = TreeVirtual

export interface NormalizedTreeSelectVirtual {
  height: number
  estimateSize: number
  overscan: number
}

const DEFAULTS: NormalizedTreeSelectVirtual = { height: 256, estimateSize: 28, overscan: 4 }
const positive = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0
const plain = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === null || (Object.prototype.toString.call(value) === '[object Object]' && Object.getPrototypeOf(prototype) === null)
}

export function normalizeTreeSelectVirtual(value: TreeSelectVirtual | undefined, warn?: (message: string) => void): NormalizedTreeSelectVirtual | null {
  if (value === false || value === undefined) return null
  if (value === true) return { ...DEFAULTS }
  if (!plain(value)) {
    warn?.('[ATreeSelect] invalid virtual options; virtualization is disabled.')
    return null
  }
  const source = value as TreeSelectVirtualConfig
  const result = { ...DEFAULTS }
  if (source.height !== undefined) {
    if (positive(source.height)) result.height = source.height
    else warn?.('[ATreeSelect] virtual.height must be a positive number; using the default.')
  }
  if (source.estimateSize !== undefined) {
    if (positive(source.estimateSize)) result.estimateSize = source.estimateSize
    else warn?.('[ATreeSelect] virtual.estimateSize must be a positive number; using the default.')
  }
  if (source.overscan !== undefined) {
    if (typeof source.overscan === 'number' && Number.isSafeInteger(source.overscan) && source.overscan >= 0) result.overscan = source.overscan
    else warn?.('[ATreeSelect] virtual.overscan must be a non-negative safe integer; using the default.')
  }
  return result
}
