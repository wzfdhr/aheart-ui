import type { ExtractPropTypes, PropType } from 'vue'
import { floatingPlacements, type FloatingPlacement } from '../utils/floating'

export interface DisabledTimeConfig {
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
}

export type LegacyDisabledTime = (value: string) => boolean
export type TimePickerDisabledTime = LegacyDisabledTime | DisabledTimeConfig | (() => DisabledTimeConfig)
export type TimePickerGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement

export const timePickerProps = {
  id: String,
  labelledBy: String,
  ariaLabelledby: String,
  modelValue: String,
  defaultValue: String,
  placeholder: { type: String, default: 'Select time' },
  disabled: Boolean,
  readOnly: Boolean,
  hourStep: { type: Number, default: 1 },
  minuteStep: { type: Number, default: 1 },
  secondStep: { type: Number, default: 1 },
  format: { type: String, default: 'HH:mm' },
  use12Hours: Boolean,
  allowClear: { type: Boolean, default: true },
  open: { type: Boolean, default: undefined },
  defaultOpen: Boolean,
  placement: {
    type: String as PropType<FloatingPlacement>,
    default: 'bottomLeft',
    validator: (value: string) => floatingPlacements.includes(value as FloatingPlacement)
  },
  autoAdjustOverflow: { type: Boolean, default: true },
  getPopupContainer: Function as PropType<TimePickerGetPopupContainer>,
  showNow: { type: Boolean, default: true },
  needConfirm: Boolean,
  disabledTime: [Function, Object] as PropType<TimePickerDisabledTime>
} as const

export const timePickerEmits = {
  'update:modelValue': (value: string | undefined) => value === undefined || typeof value === 'string',
  change: (value: string | undefined) => value === undefined || typeof value === 'string',
  openChange: (open: boolean) => typeof open === 'boolean',
  clear: () => true
}

export type TimePickerProps = ExtractPropTypes<typeof timePickerProps>
