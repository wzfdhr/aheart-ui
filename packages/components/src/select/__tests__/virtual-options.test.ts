import { describe, expect, it } from 'vitest'
import { normalizeSelectVirtual } from '../virtual-options'

describe('normalizeSelectVirtual', () => {
  it('keeps false and undefined disabled without warning', () => {
    const warnings: string[] = []
    expect(normalizeSelectVirtual(false, (message) => warnings.push(message))).toBeNull()
    expect(normalizeSelectVirtual(undefined, (message) => warnings.push(message))).toBeNull()
    expect(warnings).toEqual([])
  })

  it('uses defaults for true, empty objects, and undefined fields', () => {
    expect(normalizeSelectVirtual(true)).toEqual({ height: 288, estimateSize: 32, overscan: 3 })
    expect(normalizeSelectVirtual({})).toEqual({ height: 288, estimateSize: 32, overscan: 3 })
    expect(normalizeSelectVirtual({ height: undefined, estimateSize: undefined, overscan: undefined })).toEqual({ height: 288, estimateSize: 32, overscan: 3 })
  })
  it('accepts a plain configuration created by an iframe realm', () => {
    const frame = document.createElement('iframe')
    document.body.append(frame)
    try {
      const value = new (frame.contentWindow as any).Object()
      value.height = 240
      expect(normalizeSelectVirtual(value)).toEqual({ height: 240, estimateSize: 32, overscan: 3 })
    } finally { frame.remove() }
  })

  it('accepts valid finite dimensions and non-negative safe integer overscan', () => {
    expect(normalizeSelectVirtual({ height: 480, estimateSize: 24, overscan: 0 })).toEqual({ height: 480, estimateSize: 24, overscan: 0 })
    expect(normalizeSelectVirtual({ height: Number.MIN_VALUE, estimateSize: 1, overscan: Number.MAX_SAFE_INTEGER })).toEqual({ height: Number.MIN_VALUE, estimateSize: 1, overscan: Number.MAX_SAFE_INTEGER })
  })

  it('falls back independently and warns for invalid fields', () => {
    const warnings: string[] = []
    expect(normalizeSelectVirtual({ height: 0, estimateSize: Infinity, overscan: 1.5 }, (message) => warnings.push(message))).toEqual({ height: 288, estimateSize: 32, overscan: 3 })
    expect(warnings).toHaveLength(3)
    expect(warnings.join(' ')).toMatch(/height/)
    expect(warnings.join(' ')).toMatch(/estimateSize/)
    expect(warnings.join(' ')).toMatch(/overscan/)
  })

  it('returns null for null, arrays, non-plain objects, and other types', () => {
    const values: unknown[] = [null, [], new Date(), 'yes', 1, 0, NaN, Symbol('virtual')]
    for (const value of values) expect(normalizeSelectVirtual(value)).toBeNull()
  })

  it('does not mutate input and does not expose unknown fields', () => {
    const input = { height: 400, unknown: 'secret' }
    const snapshot = { ...input }
    expect(normalizeSelectVirtual(input)).toEqual({ height: 400, estimateSize: 32, overscan: 3 })
    expect(input).toEqual(snapshot)
    expect(normalizeSelectVirtual(Object.create(null))).toEqual({ height: 288, estimateSize: 32, overscan: 3 })
  })
})
