import type { Component, VNodeChild } from 'vue'
import type { AheartSize, AheartVariant } from '../config'
import type { FloatingPlacement } from '../utils/floating'

export type PickerMode = 'date' | 'week' | 'month' | 'quarter' | 'year'
export type PickerValue = string | undefined
export type MultiplePickerValue = string[]
export type RangePickerValue = [string | undefined, string | undefined] | undefined
export type PickerFormat = string | string[]
export type RangePickerPart = 'start' | 'end'
export type PickerStatus = 'warning' | 'error'
export type RangePickerPanelValue = [string, string]
export type PickerGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement
export type PickerDisabledDate = (
  current: string,
  info: { from?: string; type: PickerMode }
) => boolean

export interface PickerShowTimeOptions {
  format?: string
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  use12Hours?: boolean
  defaultValue?: string
}

export interface PickerDisabledTimeConfig {
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
}

export type PickerDisabledTime =
  | PickerDisabledTimeConfig
  | ((value: string | undefined, part?: RangePickerPart) => boolean | PickerDisabledTimeConfig)

export interface PickerPreset<T> {
  label: VNodeChild
  value: T | (() => T)
}

export interface PickerCalendarChangeInfo {
  range: RangePickerPart
}

export interface PickerCellInfo {
  mode: PickerMode
  originNode: VNodeChild
  range?: RangePickerPart
}

export interface PickerAppearanceProps {
  size?: AheartSize
  status?: PickerStatus
  variant?: AheartVariant
  prefix?: VNodeChild
  suffixIcon?: VNodeChild | Component
  allowClear?: boolean
  disabled?: boolean
  readOnly?: boolean
}

export interface PickerPopupProps {
  open?: boolean
  defaultOpen?: boolean
  placement?: FloatingPlacement
  autoAdjustOverflow?: boolean
  getPopupContainer?: PickerGetPopupContainer
}

interface DatePickerBasePublicProps extends PickerAppearanceProps, PickerPopupProps {
  picker?: PickerMode
  showTime?: boolean | PickerShowTimeOptions
  needConfirm?: boolean
  minDate?: string
  maxDate?: string
  disabledDate?: PickerDisabledDate
  defaultPickerValue?: string
  pickerValue?: string
  format?: PickerFormat
  valueFormat?: string
}

export interface DatePickerSinglePublicProps extends DatePickerBasePublicProps {
  multiple?: false
  modelValue?: PickerValue
  defaultValue?: PickerValue
  presets?: PickerPreset<PickerValue>[]
}

export interface DatePickerMultiplePublicProps extends Omit<DatePickerBasePublicProps, 'showTime'> {
  multiple: true
  modelValue?: MultiplePickerValue
  defaultValue?: MultiplePickerValue
  presets?: PickerPreset<MultiplePickerValue>[]
  showTime?: false
}

export type DatePickerPublicProps = DatePickerSinglePublicProps | DatePickerMultiplePublicProps

export interface DateRangePickerPublicProps extends PickerAppearanceProps, PickerPopupProps {
  modelValue?: RangePickerValue
  defaultValue?: RangePickerValue
  showTime?: boolean | PickerShowTimeOptions
  needConfirm?: boolean
  presets?: PickerPreset<RangePickerValue>[]
  picker?: PickerMode
  pickerValue?: RangePickerPanelValue
  defaultPickerValue?: RangePickerPanelValue
  allowEmpty?: [boolean, boolean]
  order?: boolean
  separator?: VNodeChild
  minDate?: string
  maxDate?: string
  disabledDate?: PickerDisabledDate
  format?: PickerFormat
  valueFormat?: string
}

export interface TimePickerPublicProps extends PickerAppearanceProps, PickerPopupProps {
  modelValue?: PickerValue
  defaultValue?: PickerValue
  format?: PickerFormat
  valueFormat?: string
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  use12Hours?: boolean
  hideDisabledOptions?: boolean
  changeOnScroll?: boolean
  showNow?: boolean
  needConfirm?: boolean
  disabledTime?: PickerDisabledTime
  clearIcon?: VNodeChild | Component
  renderExtraFooter?: () => VNodeChild
}

export interface TimeRangePickerPublicProps extends Omit<TimePickerPublicProps, 'modelValue' | 'defaultValue' | 'disabledTime'> {
  modelValue?: RangePickerValue
  defaultValue?: RangePickerValue
  allowEmpty?: [boolean, boolean]
  order?: boolean
  separator?: VNodeChild
  presets?: PickerPreset<RangePickerValue>[]
  disabledTime?: PickerDisabledTime
}
