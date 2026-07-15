import TimePicker from './time-picker.vue'
import TimeRangePickerComponent from './time-range-picker.vue'
import { withInstall } from '../utils/install'
import type { DefineComponent } from 'vue'
import type { TimePickerProps, TimeRangePickerProps } from './types'

export * from './types'

type TimePickerComponent = DefineComponent<TimePickerProps, { focus: () => void; blur: () => void }>
type TimeRangePickerComponentType = DefineComponent<TimeRangePickerProps, { focus: (part?: 'start' | 'end') => void; blur: () => void }>

export const TimeRangePicker = withInstall(TimeRangePickerComponent as TimeRangePickerComponentType, 'ATimeRangePicker')
const InstalledTimePicker = withInstall(TimePicker as TimePickerComponent, 'ATimePicker') as ReturnType<typeof withInstall<TimePickerComponent>> & { RangePicker: typeof TimeRangePicker }
InstalledTimePicker.RangePicker = TimeRangePicker

export default InstalledTimePicker
