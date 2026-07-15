import { describe, expect, it } from 'vitest'
import {
  defaultValueFormat,
  formatPickerValue,
  comparePickerValues,
  defaultTimeValueFormat,
  parsePickerValue,
  shiftPickerValue
} from '../codec'

describe('picker value codec', () => {
  it('keeps all public values as strings', () => {
    const value = parsePickerValue('2028-02-29', ['DD/MM/YYYY', 'YYYY-MM-DD'])

    expect(formatPickerValue(value, 'YYYY-MM-DD')).toBe('2028-02-29')
    expect(formatPickerValue(value, 'YYYY-MM-DD')).toEqual(expect.any(String))
  })

  it('rejects impossible dates and accepts the first matching input format', () => {
    expect(parsePickerValue('2027-02-29', 'YYYY-MM-DD')).toBeUndefined()
    expect(formatPickerValue(parsePickerValue('14/07/2026', ['YYYY-MM-DD', 'DD/MM/YYYY']), 'YYYY-MM-DD')).toBe(
      '2026-07-14'
    )
  })

  it('provides stable formats for every picker mode', () => {
    expect(defaultValueFormat('date')).toBe('YYYY-MM-DD')
    expect(defaultValueFormat('week')).toBe('GGGG-[W]WW')
    expect(defaultValueFormat('month')).toBe('YYYY-MM')
    expect(defaultValueFormat('quarter')).toBe('YYYY-[Q]Q')
    expect(defaultValueFormat('year')).toBe('YYYY')
    expect(defaultValueFormat('date', true)).toBe('YYYY-MM-DD HH:mm:ss')
    expect(defaultTimeValueFormat()).toBe('HH:mm:ss')
  })

  it('compares custom formatted values by their parsed timestamps', () => {
    expect(comparePickerValues('31/01/2026', '02/02/2026', 'DD/MM/YYYY')).toBeLessThan(0)
    expect(comparePickerValues('09:00 PM', '10:00 AM', 'hh:mm A')).toBeGreaterThan(0)
  })

  it('handles cross-year ISO weeks and quarters', () => {
    expect(formatPickerValue(parsePickerValue('2027-01-01', 'YYYY-MM-DD'), 'GGGG-[W]WW')).toBe('2026-W53')
    expect(formatPickerValue(parsePickerValue('2026-10-01', 'YYYY-MM-DD'), 'YYYY-[Q]Q')).toBe('2026-Q4')
  })

  it('round-trips every default model format', () => {
    const values = [
      ['2026-07-14', 'YYYY-MM-DD'],
      ['2026-W29', 'GGGG-[W]WW'],
      ['2026-07', 'YYYY-MM'],
      ['2026-Q3', 'YYYY-[Q]Q'],
      ['2026', 'YYYY'],
      ['2026-07-14 09:08:07', 'YYYY-MM-DD HH:mm:ss']
    ] as const

    for (const [value, format] of values) {
      expect(formatPickerValue(parsePickerValue(value, format), format)).toBe(value)
    }
  })

  it('clamps month shifts to the destination month end', () => {
    const januaryEnd = parsePickerValue('2028-01-31', 'YYYY-MM-DD')

    expect(formatPickerValue(shiftPickerValue(januaryEnd, 1, 'month'), 'YYYY-MM-DD')).toBe('2028-02-29')
  })
})
