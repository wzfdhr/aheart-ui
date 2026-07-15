import dayjs from 'dayjs'
import 'dayjs/locale/en.js'
import 'dayjs/locale/zh-cn.js'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import isoWeek from 'dayjs/plugin/isoWeek.js'
import quarterOfYear from 'dayjs/plugin/quarterOfYear.js'

export type PickerDate = dayjs.Dayjs

let configured = false

const ensurePickerDayjs = () => {
  if (configured) return
  dayjs.extend(advancedFormat)
  dayjs.extend(customParseFormat)
  dayjs.extend(isoWeek)
  dayjs.extend(quarterOfYear)
  configured = true
}

export const createPickerDate = (value?: string, format?: string, strict?: boolean, locale?: string): PickerDate => {
  ensurePickerDayjs()
  return format ? dayjs(value, format, locale, strict) : dayjs(value)
}

export const pickerDayjsLocale = (locale: 'zh-CN' | 'en-US') => (locale === 'zh-CN' ? 'zh-cn' : 'en')
