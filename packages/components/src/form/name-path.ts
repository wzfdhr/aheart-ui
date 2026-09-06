import type { FormNamePath } from './types'

const blockedSegments = new Set(['__proto__', 'prototype', 'constructor'])

export const normalizeNamePath = (name: FormNamePath): FormNamePath => {
  if (typeof name === 'string') {
    if (blockedSegments.has(name)) throw new Error('Form field name paths contain an unsafe segment')
    return name
  }
  if (name.length === 0) throw new Error('Form field name paths must not be empty')
  if (name.some((segment) => (typeof segment !== 'string' && typeof segment !== 'number') || blockedSegments.has(String(segment)) || (typeof segment === 'number' && (!Number.isFinite(segment) || !Number.isInteger(segment) || segment < 0)))) {
    throw new Error('Form field name paths contain an unsafe segment')
  }
  return [...name]
}

export const namePathKey = (name: FormNamePath): string => {
  const normalized = normalizeNamePath(name)
  return typeof normalized === 'string'
    ? `s:${normalized}`
    : `p:${JSON.stringify(normalized.map((segment) => [typeof segment, segment]))}`
}

export const namePathLabel = (name: FormNamePath): string =>
  typeof name === 'string' ? name : name.join('.')

export const getNamePathValue = (model: Record<string, unknown>, name: FormNamePath): unknown => {
  const normalized = normalizeNamePath(name)
  if (typeof normalized === 'string') return Object.prototype.hasOwnProperty.call(model, normalized) ? model[normalized] : undefined
  return normalized.reduce<unknown>((value, segment) => {
    if (value === null || typeof value !== 'object') return undefined
    return Object.prototype.hasOwnProperty.call(value, segment) ? (value as Record<string | number, unknown>)[segment] : undefined
  }, model)
}

export const setNamePathValue = (model: Record<string, unknown>, name: FormNamePath, value: unknown) => {
  const normalized = normalizeNamePath(name)
  if (typeof normalized === 'string') {
    model[normalized] = value
    return
  }
  let target: Record<string | number, unknown> = model
  normalized.slice(0, -1).forEach((segment, index) => {
    const next = normalized[index + 1]
    const current = Object.prototype.hasOwnProperty.call(target, segment) ? target[segment] : undefined
    if (!current || typeof current !== 'object') target[segment] = typeof next === 'number' ? [] : {}
    target = target[segment] as Record<string | number, unknown>
  })
  target[normalized[normalized.length - 1]] = value
}

export const deleteNamePathValue = (model: Record<string, unknown>, name: FormNamePath) => {
  const normalized = normalizeNamePath(name)
  if (typeof normalized === 'string') {
    delete model[normalized]
    return
  }
  let target: Record<string | number, unknown> = model
  for (const segment of normalized.slice(0, -1)) {
    if (!Object.prototype.hasOwnProperty.call(target, segment)) return
    const next = target[segment]
    if (!next || typeof next !== 'object') return
    target = next as Record<string | number, unknown>
  }
  delete target[normalized[normalized.length - 1]]
}
