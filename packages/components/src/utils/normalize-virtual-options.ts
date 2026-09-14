export interface NormalizedVirtualOptions { height: number; estimateSize: number; overscan: number }
const positive = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0

/** Private shared policy; component wrappers retain their public types and diagnostics. */
export function normalizeVirtualOptions(value: unknown, defaults: NormalizedVirtualOptions, name: string, warn?: (message: string) => void, compact = false): NormalizedVirtualOptions | null {
  if (value === false || value === undefined) return null
  if (value === true) return { ...defaults }
  const prototype = value && typeof value === 'object' ? Object.getPrototypeOf(value) : undefined
  if (prototype === undefined || !(prototype === null || (Object.prototype.toString.call(value) === '[object Object]' && Object.getPrototypeOf(prototype) === null))) {
    if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) warn?.(`[${name}] invalid virtual options; virtualization is disabled.`)
    return null
  }
  const source = value as Record<string, number>
  const result = { ...defaults }
  for (const key of ['height', 'estimateSize', 'overscan'] as const) {
    if (source[key] === undefined) continue
    const integer = key === 'overscan'
    const valid = integer
      ? typeof source[key] === 'number' && Number.isSafeInteger(source[key]) && source[key] >= 0
      : compact ? typeof source[key] === 'number' && Number.isFinite(source[key]) && source[key] > 0 : positive(source[key])
    if (valid) result[key] = source[key]
    else if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
      const requirement = integer ? 'non-negative safe integer' : compact ? 'positive' : 'positive number'
      warn?.(`[${name}] virtual.${key} must be ${compact ? '' : 'a '}${requirement}; using ${compact ? '' : 'the '}default.`)
    }
  }
  return result
}
