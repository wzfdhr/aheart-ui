export interface ResolvedSelectVirtual {
  height: number
  estimateSize: number
  overscan: number
}

const DEFAULTS: ResolvedSelectVirtual = { height: 288, estimateSize: 32, overscan: 3 }

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === null || Object.getPrototypeOf(prototype) === null
}

const warnInvalid = (warn: ((message: string) => void) | undefined, field: string, value: unknown) => {
  warn?.(`Invalid select virtual ${field} value; using the default.`)
}

/** Resolves Select's opt-in virtual list settings without mutating user input. */
export const normalizeSelectVirtual = (value: unknown, warn?: (message: string) => void): ResolvedSelectVirtual | null => {
  if (value === false || value === undefined) return null
  if (value === true) return { ...DEFAULTS }
  if (!isPlainObject(value)) {
    warn?.('Invalid select virtual options; virtualization is disabled.')
    return null
  }

  const result: ResolvedSelectVirtual = { ...DEFAULTS }
  if (value.height !== undefined) {
    if (typeof value.height === 'number' && Number.isFinite(value.height) && value.height > 0) result.height = value.height
    else warnInvalid(warn, 'height', value.height)
  }
  if (value.estimateSize !== undefined) {
    if (typeof value.estimateSize === 'number' && Number.isFinite(value.estimateSize) && value.estimateSize > 0) result.estimateSize = value.estimateSize
    else warnInvalid(warn, 'estimateSize', value.estimateSize)
  }
  if (value.overscan !== undefined) {
    if (typeof value.overscan === 'number' && Number.isSafeInteger(value.overscan) && value.overscan >= 0) result.overscan = value.overscan
    else warnInvalid(warn, 'overscan', value.overscan)
  }
  return result
}
