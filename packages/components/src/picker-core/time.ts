export interface PickerTimeParts {
  hour: number
  minute: number
  second: number
}

export interface PickerMeridiemLabels {
  am: string
  pm: string
}

const pad = (value: number) => String(value).padStart(2, '0')

const normalizeMeridiem = (value: string, labels?: PickerMeridiemLabels) => {
  if (!labels) return value
  const normalized = value.trim()
  const lowerValue = normalized.toLocaleLowerCase()
  for (const [period, label] of [['AM', labels.am], ['PM', labels.pm]] as const) {
    const lowerLabel = label.trim().toLocaleLowerCase()
    if (lowerLabel && lowerValue.endsWith(lowerLabel)) {
      return `${normalized.slice(0, normalized.length - label.trim().length).trim()} ${period}`
    }
  }
  return normalized
}

export const parseTimeValue = (value?: string, labels?: PickerMeridiemLabels): PickerTimeParts | undefined => {
  if (!value) return undefined
  const match = normalizeMeridiem(value, labels).match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?(?:\s*(AM|PM))?$/i)
  if (!match) return undefined
  let hour = Number(match[1])
  const period = match[4]?.toUpperCase()
  if (period) {
    if (hour < 1 || hour > 12) return undefined
    hour = hour % 12 + (period === 'PM' ? 12 : 0)
  }
  if (hour > 23) return undefined
  return { hour, minute: Number(match[2]), second: Number(match[3] ?? 0) }
}

export const formatTimeValue = (parts: PickerTimeParts, format: string, labels?: PickerMeridiemLabels) => {
  const hour12 = parts.hour % 12 || 12
  const period = parts.hour >= 12 ? labels?.pm ?? 'PM' : labels?.am ?? 'AM'
  return format
    .replace('HH', pad(parts.hour))
    .replace('hh', pad(hour12))
    .replace('mm', pad(parts.minute))
    .replace('ss', pad(parts.second))
    .replace('A', period)
}

export const createTimeOptions = (limit: number, step: number, start = 0) => {
  const normalizedStep = Math.max(1, Math.min(limit, Math.floor(step) || 1))
  const values: number[] = []
  for (let value = start; value < limit + start; value += normalizedStep) values.push(value)
  return values
}

export const timePartsToSeconds = (parts: PickerTimeParts) => parts.hour * 3600 + parts.minute * 60 + parts.second
