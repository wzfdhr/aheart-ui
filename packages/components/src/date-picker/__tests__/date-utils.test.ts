import { describe, expect, it } from 'vitest'
import { formatDate, parseDate, sameDate } from '../date-utils'

describe('date picker utilities', () => {
  it('formats a local date without timezone conversion', () => {
    expect(formatDate(new Date(2026, 6, 14), 'YYYY-MM-DD')).toBe('2026-07-14')
  })

  it('parses complete calendar values and rejects impossible dates', () => {
    expect(parseDate('2026-07-14', 'YYYY-MM-DD')).toEqual(new Date(2026, 6, 14))
    expect(parseDate('2026-02-30', 'YYYY-MM-DD')).toBeUndefined()
  })

  it('compares dates by calendar day', () => {
    expect(sameDate(new Date(2026, 6, 14, 8), new Date(2026, 6, 14, 20))).toBe(true)
    expect(sameDate(new Date(2026, 6, 14), new Date(2026, 6, 15))).toBe(false)
  })
})
