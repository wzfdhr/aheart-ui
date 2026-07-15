import { comparePickerValues } from './codec'
import type { PickerFormat, RangePickerPart, RangePickerValue } from './types'

export const normalizeMultipleValues = (values: readonly string[]): string[] => [...new Set(values)]

export const normalizeRangeValue = (
  value: RangePickerValue,
  format: PickerFormat,
  order = true,
  allowEmpty: [boolean, boolean] = [false, false]
): RangePickerValue => {
  if (!value) return undefined
  const [start, end] = value

  if ((!start && !allowEmpty[0]) || (!end && !allowEmpty[1])) return undefined
  if (order && start && end && comparePickerValues(start, end, format) > 0) return [end, start]
  return [start, end]
}

export const updateRangeDraft = (
  value: RangePickerValue,
  nextValue: string,
  activePart: RangePickerPart
): Exclude<RangePickerValue, undefined> => {
  return activePart === 'start' ? [nextValue, value?.[1]] : [value?.[0], nextValue]
}

export interface RangeSelectionResult {
  value: Exclude<RangePickerValue, undefined>
  activePart: RangePickerPart
  complete: boolean
}

export const advanceRangeSelection = (
  value: RangePickerValue,
  nextValue: string,
  activePart: RangePickerPart,
  format: PickerFormat,
  order = true,
  allowEmpty: [boolean, boolean] = [false, false]
): RangeSelectionResult => {
  if (activePart === 'start') {
    return { value: [nextValue, undefined], activePart: 'end', complete: false }
  }

  const candidate: Exclude<RangePickerValue, undefined> = [value?.[0], nextValue]
  const complete = Boolean((candidate[0] || allowEmpty[0]) && (candidate[1] || allowEmpty[1]))
  const normalized = complete ? normalizeRangeValue(candidate, format, order, allowEmpty) : candidate
  return {
    value: normalized ?? candidate,
    activePart: 'start',
    complete
  }
}
