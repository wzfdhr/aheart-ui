const pad = (value: number) => String(value).padStart(2, '0')

export const formatDate = (date: Date, format: string) => format
  .replace('YYYY', String(date.getFullYear()))
  .replace('MM', pad(date.getMonth() + 1))
  .replace('DD', pad(date.getDate()))

export const parseDate = (value: string, format: string) => {
  if (format !== 'YYYY-MM-DD') return undefined

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return undefined

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : undefined
}

export const sameDate = (first: Date | undefined, second: Date | undefined) =>
  first === second || Boolean(first && second && first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate())
