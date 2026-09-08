import type { TableSize, TableScroll, TableVirtual, TableVirtualConfig } from './types'

export interface NormalizedTableVirtual {
  enabled: boolean
  height: number
  estimateSize: number
  overscan: number
}

const positive = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0
const parsedHeight = (value: unknown) => {
  if (positive(value)) return value
  if (typeof value === 'string') {
    const match = /^\s*(\d+(?:\.\d+)?)px\s*$/i.exec(value)
    if (match) return Number(match[1])
    if (/^\s*\d+(?:\.\d+)?\s*$/.test(value)) return Number(value)
  }
  return undefined
}

export function normalizeTableVirtual(value: TableVirtual | undefined, scroll: TableScroll | undefined, size: TableSize, warn = (message: string) => console.warn(message)): NormalizedTableVirtual {
  const enabled = value === true || (value !== false && value !== undefined)
  const config: TableVirtualConfig = value && typeof value === 'object' ? value : {}
  if (!enabled) return { enabled: false, height: 0, estimateSize: 0, overscan: 0 }
  const fromVirtual = config.height
  const fromScroll = parsedHeight(scroll?.y)
  if (fromVirtual !== undefined && !positive(fromVirtual)) warn('[ATable] virtual.height must be a positive number.')
  if (fromVirtual !== undefined && fromScroll !== undefined) warn('[ATable] virtual.height takes precedence over scroll.y.')
  const height = positive(fromVirtual) ? fromVirtual : fromScroll ?? 320
  const defaults: Record<TableSize, number> = { small: 40, middle: 48, large: 56 }
  if (config.estimateSize !== undefined && !positive(config.estimateSize)) warn('[ATable] virtual.estimateSize must be a positive number.')
  if (config.overscan !== undefined && (!Number.isFinite(config.overscan) || config.overscan < 0)) warn('[ATable] virtual.overscan must be a non-negative number.')
  return {
    enabled: true,
    height,
    estimateSize: positive(config.estimateSize) ? config.estimateSize : defaults[size] ?? 48,
    overscan: Number.isFinite(config.overscan) && (config.overscan ?? 0) >= 0 ? Math.floor(config.overscan as number) : 4
  }
}
