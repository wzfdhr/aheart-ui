import { formatPickerValue, parsePickerValue } from '../picker-core/codec'
import { createPickerDate } from '../picker-core/dayjs'

/** @deprecated Use picker-core values through DatePicker instead. Kept for deep-import compatibility. */
export const formatDate = (date: Date, format: string) => formatPickerValue(
  createPickerDate(date.toISOString()),
  format
) ?? ''

/** @deprecated Use picker-core values through DatePicker instead. */
export const parseDate = (value: string, format: string) => {
  if (format !== 'YYYY-MM-DD') return undefined
  const parsed = parsePickerValue(value, format)
  if (!parsed || parsed.format(format) !== value) return undefined
  return new Date(parsed.year(), parsed.month(), parsed.date())
}

/** @deprecated Use picker-core comparisons through DatePicker instead. */
export const sameDate = (first: Date | undefined, second: Date | undefined) =>
  first === second || Boolean(first && second && first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate())
