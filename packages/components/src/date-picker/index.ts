import DatePicker from './date-picker.vue'
import { withInstall } from '../utils/install'
import type { DefineComponent } from 'vue'
import type { DatePickerProps } from './types'

export * from './types'

type DatePickerComponent = DefineComponent<DatePickerProps, {
  focus: () => void
  blur: () => void
}>

export default withInstall(DatePicker as unknown as DatePickerComponent, 'ADatePicker')
