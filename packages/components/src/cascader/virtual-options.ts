import type { CascaderVirtual } from './types'

export interface NormalizedCascaderVirtual { height: number; estimateSize: number; overscan: number }
const defaults: NormalizedCascaderVirtual = { height: 256, estimateSize: 32, overscan: 4 }
const plain = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === null || (Object.prototype.toString.call(value) === '[object Object]' && Object.getPrototypeOf(proto) === null)
}
export const normalizeCascaderVirtual = (value: CascaderVirtual | undefined, warn?: (message: string) => void): NormalizedCascaderVirtual | null => {
  if (value === false || value === undefined) return null
  if (value === true) return { ...defaults }
  if (!plain(value)) { warn?.('[ACascader] invalid virtual options; virtualization is disabled.'); return null }
  const result = { ...defaults }
  const source = value as Record<string, unknown>
  if (source.height !== undefined) typeof source.height === 'number' && Number.isFinite(source.height) && source.height > 0 ? result.height = source.height : warn?.('[ACascader] virtual.height must be positive; using default.')
  if (source.estimateSize !== undefined) typeof source.estimateSize === 'number' && Number.isFinite(source.estimateSize) && source.estimateSize > 0 ? result.estimateSize = source.estimateSize : warn?.('[ACascader] virtual.estimateSize must be positive; using default.')
  if (source.overscan !== undefined) typeof source.overscan === 'number' && Number.isSafeInteger(source.overscan) && source.overscan >= 0 ? result.overscan = source.overscan : warn?.('[ACascader] virtual.overscan must be non-negative safe integer; using default.')
  return result
}
