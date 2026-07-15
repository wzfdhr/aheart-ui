import { describe, expect, it } from 'vitest'
import { advanceRangeSelection, normalizeMultipleValues, normalizeRangeValue, updateRangeDraft } from '../selection'

describe('picker selection helpers', () => {
  it('deduplicates multiple values without changing their first-seen order', () => {
    expect(normalizeMultipleValues(['2026-07-14', '2026-07-15', '2026-07-14'])).toEqual([
      '2026-07-14',
      '2026-07-15'
    ])
  })

  it('orders a completed range by default', () => {
    expect(normalizeRangeValue(['2026-07-20', '2026-07-14'], 'YYYY-MM-DD')).toEqual(['2026-07-14', '2026-07-20'])
  })

  it('preserves explicit range order when order is disabled', () => {
    expect(normalizeRangeValue(['18:00:00', '09:00:00'], 'HH:mm:ss', false)).toEqual(['18:00:00', '09:00:00'])
  })

  it('orders custom formatted ranges with a codec comparator', () => {
    expect(normalizeRangeValue(['31/01/2026', '02/02/2026'], 'DD/MM/YYYY')).toEqual([
      '31/01/2026',
      '02/02/2026'
    ])
  })

  it('supports empty range endpoints only when allowed', () => {
    expect(normalizeRangeValue([undefined, '2026-07-14'], 'YYYY-MM-DD', true, [true, false])).toEqual([
      undefined,
      '2026-07-14'
    ])
    expect(normalizeRangeValue([undefined, '2026-07-14'], 'YYYY-MM-DD', true, [false, false])).toBeUndefined()
  })

  it('restarts a completed selection from the next selected start value', () => {
    expect(advanceRangeSelection(['2026-07-14', '2026-07-20'], '2026-08-01', 'start', 'YYYY-MM-DD')).toEqual({
      value: [
      '2026-08-01',
      undefined
      ],
      activePart: 'end',
      complete: false
    })
  })

  it('preserves the start when editing the end of a completed range', () => {
    expect(updateRangeDraft(['2026-07-14', '2026-07-20'], '2026-07-25', 'end')).toEqual([
      '2026-07-14',
      '2026-07-25'
    ])
    expect(updateRangeDraft(['2026-07-14', '2026-07-20'], '2026-07-10', 'start')).toEqual([
      '2026-07-10',
      '2026-07-20'
    ])
    expect(advanceRangeSelection(['2026-07-14', '2026-07-20'], '2026-07-25', 'end', 'YYYY-MM-DD')).toEqual({
      value: ['2026-07-14', '2026-07-25'],
      activePart: 'start',
      complete: true
    })
  })

  it('keeps an end-first selection incomplete unless an empty start is allowed', () => {
    expect(advanceRangeSelection(undefined, '2026-07-20', 'end', 'YYYY-MM-DD')).toEqual({
      value: [undefined, '2026-07-20'], activePart: 'start', complete: false
    })
    expect(advanceRangeSelection(undefined, '2026-07-20', 'end', 'YYYY-MM-DD', true, [true, false])).toEqual({
      value: [undefined, '2026-07-20'], activePart: 'start', complete: true
    })
  })

  it('advances a range draft from start to an ordered completed range', () => {
    const start = advanceRangeSelection(undefined, '2026-07-20', 'start', 'YYYY-MM-DD')
    expect(start).toEqual({ value: ['2026-07-20', undefined], activePart: 'end', complete: false })

    expect(advanceRangeSelection(start.value, '2026-07-14', start.activePart, 'YYYY-MM-DD')).toEqual({
      value: ['2026-07-14', '2026-07-20'],
      activePart: 'start',
      complete: true
    })
  })
})
