import type { Component, ExtractPropTypes, ExtractPublicPropTypes, PropType, VNodeChild } from 'vue'
import type { AheartSize, AheartVariant } from '../config'
import type { PickerStatus } from '../picker-core/types'
import type { PickerDisabledTime, PickerDisabledTimeConfig, PickerPreset, PickerSingleDisabledTime, RangePickerPart, RangePickerValue } from '../picker-core/types'
import { floatingPlacements, type FloatingPlacement } from '../utils/floating'

export type DisabledTimeConfig = PickerDisabledTimeConfig

/** @deprecated Use the structured disabled-time callbacks instead. */
export type LegacyDisabledTime = (value: string) => boolean
export type TimePickerDisabledTime = PickerSingleDisabledTime
export type TimePickerGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement

export const timePickerProps = {
  id: String,
  labelledBy: String,
  ariaLabelledby: String,
  modelValue: String,
  defaultValue: String,
  placeholder: String,
  disabled: { type: Boolean, default: undefined },
  readOnly: Boolean,
  hourStep: { type: Number, default: 1 },
  minuteStep: { type: Number, default: 1 },
  secondStep: { type: Number, default: 1 },
  format: { type: String, default: 'HH:mm:ss' },
  valueFormat: { type: String, default: 'HH:mm:ss' },
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
  disabledTime: [Function, Object] as PropType<TimePickerDisabledTime>,
  hideDisabledOptions: Boolean,
  changeOnScroll: Boolean,
  size: String as PropType<AheartSize>,
  status: String as PropType<PickerStatus>,
  variant: String as PropType<AheartVariant>,
  prefix: null as unknown as PropType<VNodeChild>,
  suffixIcon: [Object, Function] as PropType<VNodeChild | Component>,
  clearIcon: [Object, Function] as PropType<VNodeChild | Component>,
  renderExtraFooter: Function as PropType<() => VNodeChild>
} as const

export const timePickerEmits = {
  'update:modelValue': (value: string | undefined) => value === undefined || typeof value === 'string',
  change: (value: string | undefined) => value === undefined || typeof value === 'string',
  openChange: (open: boolean) => typeof open === 'boolean',
  clear: () => true,
  invalid: (input: string) => typeof input === 'string'
}

export type TimePickerRuntimeProps = ExtractPropTypes<typeof timePickerProps>

interface TimePickerSupplementalProps {
  'onUpdate:modelValue'?: (value: string | undefined) => void
  onChange?: (value: string | undefined) => void
  onOpenChange?: (open: boolean) => void
  onClear?: () => void
  onInvalid?: (input: string) => void
}

export type TimePickerProps = ExtractPublicPropTypes<typeof timePickerProps> & TimePickerSupplementalProps

export const timeRangePickerProps = {
  ...timePickerProps,
  modelValue: Array as unknown as PropType<RangePickerValue>,
  defaultValue: Array as unknown as PropType<RangePickerValue>,
  placeholder: Array as unknown as PropType<[string, string]>,
  disabledTime: [Function, Object] as PropType<PickerDisabledTime>,
  allowEmpty: { type: Array as unknown as PropType<[boolean, boolean]>, default: () => [false, false] },
  order: { type: Boolean, default: true },
  separator: null as unknown as PropType<VNodeChild>,
  presets: Array as PropType<PickerPreset<RangePickerValue>[]>,
  needConfirm: { type: Boolean, default: true }
} as const

export const timeRangePickerEmits = {
  'update:modelValue': (value: RangePickerValue) => value === undefined || Array.isArray(value),
  change: (value: RangePickerValue) => value === undefined || Array.isArray(value),
  calendarChange: (value: RangePickerValue, info: { range: RangePickerPart }) => Array.isArray(value) && Boolean(info.range),
  openChange: (open: boolean) => typeof open === 'boolean',
  clear: () => true,
  invalid: (input: string, part: RangePickerPart) => typeof input === 'string' && (part === 'start' || part === 'end'),
  ok: (value: RangePickerValue) => value === undefined || Array.isArray(value)
}

export type TimeRangePickerRuntimeProps = ExtractPropTypes<typeof timeRangePickerProps>

interface TimeRangePickerSupplementalProps {
  'onUpdate:modelValue'?: (value: RangePickerValue) => void
  onChange?: (value: RangePickerValue) => void
  onCalendarChange?: (value: RangePickerValue, info: { range: RangePickerPart }) => void
  onOpenChange?: (open: boolean) => void
  onClear?: () => void
  onInvalid?: (input: string, part: RangePickerPart) => void
  onOk?: (value: RangePickerValue) => void
}

export type TimeRangePickerProps = ExtractPublicPropTypes<typeof timeRangePickerProps> & TimeRangePickerSupplementalProps
