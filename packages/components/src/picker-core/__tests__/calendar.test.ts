import { describe, expect, it } from 'vitest'
import { createDateMatrix, isPickerDateDisabled } from '../calendar'
import { formatPickerValue, parsePickerValue } from '../codec'

describe('picker calendar matrix', () => {
  it('creates a stable six-week grid that includes adjacent months', () => {
    const view = parsePickerValue('2026-07-14', 'YYYY-MM-DD')!
    const cells = createDateMatrix(view, 1, view)

    expect(cells).toHaveLength(42)
    expect(formatPickerValue(cells[0]!.value, 'YYYY-MM-DD')).toBe('2026-06-29')
    expect(formatPickerValue(cells[41]!.value, 'YYYY-MM-DD')).toBe('2026-08-09')
    expect(cells.filter((cell) => cell.inView)).toHaveLength(31)
    expect(cells.filter((cell) => cell.today)).toHaveLength(1)
  })

  it('does not read the ambient clock when no reference date is supplied', () => {
    const view = parsePickerValue('2026-07-14', 'YYYY-MM-DD')!
    expect(createDateMatrix(view, 1.8).some((cell) => cell.today)).toBe(false)
  })

  it('applies min, max and custom disabled rules consistently', () => {
    const value = parsePickerValue('2026-07-14', 'YYYY-MM-DD')!
    const min = parsePickerValue('2026-07-10', 'YYYY-MM-DD')
    const max = parsePickerValue('2026-07-20', 'YYYY-MM-DD')

    expect(isPickerDateDisabled(value, { min, max })).toBe(false)
    expect(isPickerDateDisabled(value.subtract(5, 'day'), { min, max })).toBe(true)
    expect(isPickerDateDisabled(value.add(7, 'day'), { min, max })).toBe(true)
    expect(isPickerDateDisabled(value, { disabledDate: (date) => date.date() === 14 })).toBe(true)
  })
})
