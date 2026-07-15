import type { PickerDate } from './dayjs'

export interface PickerDateCell {
  value: PickerDate
  inView: boolean
  today: boolean
}

export interface PickerDateConstraints {
  min?: PickerDate
  max?: PickerDate
  disabledDate?: (value: PickerDate) => boolean
}

export const createDateMatrix = (view: PickerDate, weekStartsOn = 0, referenceDate?: PickerDate): PickerDateCell[] => {
  const normalizedWeekStart = Math.trunc(Math.min(6, Math.max(0, weekStartsOn)))
  const monthStart = view.startOf('month')
  const leadingDays = (monthStart.day() - normalizedWeekStart + 7) % 7
  const gridStart = monthStart.subtract(leadingDays, 'day')
  const today = referenceDate?.startOf('day')

  return Array.from({ length: 42 }, (_, index) => {
    const value = gridStart.add(index, 'day')
    return {
      value,
      inView: value.month() === view.month(),
      today: Boolean(today && value.isSame(today, 'day'))
    }
  })
}

export const isPickerDateDisabled = (value: PickerDate, constraints: PickerDateConstraints = {}): boolean => {
  const day = value.startOf('day')
  if (constraints.min?.isValid() && day.isBefore(constraints.min.startOf('day'))) return true
  if (constraints.max?.isValid() && day.isAfter(constraints.max.startOf('day'))) return true
  return constraints.disabledDate?.(value) ?? false
}
