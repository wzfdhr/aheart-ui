import type { TableKey, TableRecord } from './types'

export interface VirtualRow<T extends TableRecord = TableRecord> {
  key: TableKey
  record: T
  index: number
}

export interface VirtualRange { start: number; end: number; top: number; bottom: number }

export function getVirtualRange(count: number, scrollTop: number, height: number, estimate: number, overscan: number, measured: Map<number, number>): VirtualRange {
  if (!count) return { start: 0, end: 0, top: 0, bottom: 0 }
  const offset = (index: number) => { let total = 0; for (let i = 0; i < index; i++) total += measured.get(i) ?? estimate; return total }
  const total = offset(count)
  let start = 0
  while (start < count - 1 && offset(start + 1) <= Math.max(0, scrollTop)) start++
  let end = start
  while (end < count && offset(end) < scrollTop + height) end++
  start = Math.max(0, start - overscan)
  end = Math.min(count, end + overscan)
  return { start, end, top: offset(start), bottom: Math.max(0, total - offset(end)) }
}
