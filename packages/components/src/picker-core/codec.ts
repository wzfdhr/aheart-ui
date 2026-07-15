import { createPickerDate, type PickerDate } from './dayjs'
import type { PickerFormat, PickerMode } from './types'

const modeFormats: Record<PickerMode, string> = {
  date: 'YYYY-MM-DD',
  week: 'GGGG-[W]WW',
  month: 'YYYY-MM',
  quarter: 'YYYY-[Q]Q',
  year: 'YYYY'
}

export const defaultValueFormat = (mode: PickerMode, showTime = false) => {
  if (mode === 'date' && showTime) return 'YYYY-MM-DD HH:mm:ss'
  return modeFormats[mode]
}

export const defaultTimeValueFormat = () => 'HH:mm:ss'

export const normalizeFormats = (format: PickerFormat): string[] => {
  const formats = Array.isArray(format) ? format : [format]
  return formats.filter((item, index) => Boolean(item) && formats.indexOf(item) === index)
}

export const parsePickerValue = (value: string | undefined, format: PickerFormat, locale?: string): PickerDate | undefined => {
  if (!value) return undefined

  for (const candidate of normalizeFormats(format)) {
    if (candidate === 'GGGG-[W]WW') {
      const match = /^(\d{4})-W(\d{2})$/.exec(value)
      if (match) {
        const isoYear = Number(match[1])
        const isoWeek = Number(match[2])
        const firstIsoWeek = createPickerDate(`${isoYear}-01-04`, 'YYYY-MM-DD', true).startOf('isoWeek')
        const parsed = firstIsoWeek.add(isoWeek - 1, 'week')
        if (isoWeek >= 1 && isoWeek <= 53 && parsed.format(candidate) === value) return parsed
      }
      continue
    }
    if (candidate === 'YYYY-[Q]Q') {
      const match = /^(\d{4})-Q([1-4])$/.exec(value)
      if (match) return createPickerDate(`${match[1]}-${(Number(match[2]) - 1) * 3 + 1}-01`, 'YYYY-M-DD', true)
      continue
    }
    const parsed = createPickerDate(value, candidate, true, locale)
    if (parsed.isValid()) return parsed
  }

  return undefined
}

export const formatPickerValue = (value: PickerDate | undefined, format: string): string | undefined => {
  if (!value?.isValid()) return undefined
  return value.format(format)
}

export const comparePickerValues = (left: string, right: string, format: PickerFormat): number => {
  const leftValue = parsePickerValue(left, format)
  const rightValue = parsePickerValue(right, format)
  if (!leftValue || !rightValue) return left.localeCompare(right)
  return leftValue.valueOf() - rightValue.valueOf()
}

export const shiftPickerValue = (
  value: PickerDate | undefined,
  amount: number,
  unit: 'day' | 'week' | 'month' | 'quarter' | 'year'
): PickerDate | undefined => {
  if (!value?.isValid()) return undefined
  if (unit === 'quarter') return value.add(amount, 'quarter')
  if (unit === 'week') return value.add(amount * 7, 'day')
  return value.add(amount, unit)
}

export const clampPickerValue = (
  value: PickerDate,
  minValue?: PickerDate,
  maxValue?: PickerDate
): PickerDate => {
  if (minValue?.isValid() && value.isBefore(minValue)) return minValue
  if (maxValue?.isValid() && value.isAfter(maxValue)) return maxValue
  return value
}
