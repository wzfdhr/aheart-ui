import DatePicker from './date-picker.vue'
import DateRangePickerComponent from './date-range-picker.vue'
import { withInstall } from '../utils/install'
import type { DefineComponent } from 'vue'
import type { DatePickerProps, DateRangePickerProps } from './types'

export * from './types'

type DatePickerComponent = DefineComponent<DatePickerProps, {
  focus: () => void
  blur: () => void
}>

type DateRangePickerComponentType = DefineComponent<DateRangePickerProps, {
  focus: (part?: 'start' | 'end') => void
  blur: () => void
}>

export const DateRangePicker = withInstall(
  DateRangePickerComponent as unknown as DateRangePickerComponentType,
  'ADateRangePicker'
)

const InstalledDatePicker = withInstall(DatePicker as unknown as DatePickerComponent, 'ADatePicker') as ReturnType<typeof withInstall<DatePickerComponent>> & {
  RangePicker: typeof DateRangePicker
}

InstalledDatePicker.RangePicker = DateRangePicker

export default InstalledDatePicker
