import type { ExtractPropTypes, PropType, VNodeChild } from 'vue'
import type { AheartLocale, AheartSize, AheartVariant } from '../config'
import type {
  DatePickerPublicProps,
  MultiplePickerValue,
  PickerDisabledDate,
  PickerFormat,
  PickerMode,
  PickerPreset,
  PickerCalendarChangeInfo,
  RangePickerPanelValue,
  RangePickerPart,
  RangePickerValue,
  PickerShowTimeOptions,
  PickerStatus,
  PickerValue
} from '../picker-core/types'
import { floatingPlacements, type FloatingPlacement } from '../utils/floating'

export type DatePickerValue = PickerValue | MultiplePickerValue
export type DatePickerGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement

export interface DatePickerCellRenderInfo {
  mode: PickerMode
  text: string
  value: string
  selected: boolean
  disabled: boolean
}

export const datePickerProps = {
  id: String,
  labelledBy: String,
  ariaLabelledby: String,
  describedBy: String,
  ariaDescribedby: String,
  modelValue: [String, Array] as PropType<DatePickerValue>,
  defaultValue: [String, Array] as PropType<DatePickerValue>,
  picker: { type: String as PropType<PickerMode>, default: 'date' },
  multiple: Boolean,
  showTime: [Boolean, Object] as PropType<boolean | PickerShowTimeOptions>,
  needConfirm: { type: Boolean, default: undefined },
  presets: Array as PropType<PickerPreset<DatePickerValue>[]>,
  minDate: String,
  maxDate: String,
  disabledDate: Function as PropType<PickerDisabledDate>,
  defaultPickerValue: String,
  pickerValue: String,
  format: [String, Array] as PropType<PickerFormat>,
  valueFormat: String,
  placeholder: String,
  size: String as PropType<AheartSize>,
  status: String as PropType<PickerStatus>,
  variant: String as PropType<AheartVariant>,
  prefix: null as unknown as PropType<VNodeChild>,
  suffixIcon: null as unknown as PropType<VNodeChild>,
  allowClear: { type: Boolean, default: true },
  disabled: { type: Boolean, default: undefined },
  readOnly: Boolean,
  open: { type: Boolean, default: undefined },
  defaultOpen: Boolean,
  placement: {
    type: String as PropType<FloatingPlacement>,
    default: 'bottomLeft',
    validator: (value: string) => floatingPlacements.includes(value as FloatingPlacement)
  },
  autoAdjustOverflow: { type: Boolean, default: true },
  getPopupContainer: Function as PropType<DatePickerGetPopupContainer>,
  locale: Object as PropType<AheartLocale>,
  cellRender: Function as PropType<(info: DatePickerCellRenderInfo) => VNodeChild>
} as const

export const datePickerEmits = {
  'update:modelValue': (value: DatePickerValue) => value === undefined || typeof value === 'string' || Array.isArray(value),
  change: (value: DatePickerValue) => value === undefined || typeof value === 'string' || Array.isArray(value),
  openChange: (open: boolean) => typeof open === 'boolean',
  panelChange: (value: string, mode: PickerMode) => typeof value === 'string' && typeof mode === 'string',
  ok: (value: DatePickerValue) => value === undefined || typeof value === 'string' || Array.isArray(value),
  clear: () => true,
  invalid: (input: string) => typeof input === 'string'
}

export type DatePickerRuntimeProps = ExtractPropTypes<typeof datePickerProps>

interface DatePickerSupplementalProps {
  id?: string
  labelledBy?: string
  ariaLabelledby?: string
  describedBy?: string
  ariaDescribedby?: string
  placeholder?: string
  locale?: AheartLocale
  cellRender?: (info: DatePickerCellRenderInfo) => VNodeChild
  'onUpdate:modelValue'?: (value: DatePickerValue) => void
  onChange?: (value: DatePickerValue) => void
  onOpenChange?: (open: boolean) => void
  onPanelChange?: (value: string, mode: PickerMode) => void
  onOk?: (value: DatePickerValue) => void
  onClear?: () => void
  onInvalid?: (input: string) => void
}

export type DatePickerProps = DatePickerPublicProps & DatePickerSupplementalProps

export const dateRangePickerProps = {
  id: String,
  labelledBy: String,
  ariaLabelledby: String,
  describedBy: String,
  ariaDescribedby: String,
  modelValue: Array as unknown as PropType<RangePickerValue>,
  defaultValue: Array as unknown as PropType<RangePickerValue>,
  showTime: [Boolean, Object] as PropType<boolean | PickerShowTimeOptions>,
  needConfirm: { type: Boolean, default: undefined },
  presets: Array as PropType<PickerPreset<RangePickerValue>[]>,
  picker: { type: String as PropType<PickerMode>, default: 'date' },
  pickerValue: Array as unknown as PropType<RangePickerPanelValue>,
  defaultPickerValue: Array as unknown as PropType<RangePickerPanelValue>,
  allowEmpty: { type: Array as unknown as PropType<[boolean, boolean]>, default: () => [false, false] },
  order: { type: Boolean, default: true },
  separator: null as unknown as PropType<VNodeChild>,
  minDate: String,
  maxDate: String,
  disabledDate: Function as PropType<PickerDisabledDate>,
  format: [String, Array] as PropType<PickerFormat>,
  valueFormat: String,
  placeholder: Array as unknown as PropType<[string, string]>,
  size: String as PropType<AheartSize>,
  status: String as PropType<PickerStatus>,
  variant: String as PropType<AheartVariant>,
  prefix: null as unknown as PropType<VNodeChild>,
  suffixIcon: null as unknown as PropType<VNodeChild>,
  allowClear: { type: Boolean, default: true },
  disabled: { type: Boolean, default: undefined },
  readOnly: Boolean,
  open: { type: Boolean, default: undefined },
  defaultOpen: Boolean,
  placement: {
    type: String as PropType<FloatingPlacement>,
    default: 'bottomLeft',
    validator: (value: string) => floatingPlacements.includes(value as FloatingPlacement)
  },
  autoAdjustOverflow: { type: Boolean, default: true },
  getPopupContainer: Function as PropType<DatePickerGetPopupContainer>,
  locale: Object as PropType<AheartLocale>,
  cellRender: Function as PropType<(info: DatePickerCellRenderInfo & { range: RangePickerPart }) => VNodeChild>
} as const

export const dateRangePickerEmits = {
  'update:modelValue': (value: RangePickerValue) => value === undefined || Array.isArray(value),
  change: (value: RangePickerValue) => value === undefined || Array.isArray(value),
  openChange: (open: boolean) => typeof open === 'boolean',
  panelChange: (value: RangePickerPanelValue, mode: PickerMode) => Array.isArray(value) && typeof mode === 'string',
  calendarChange: (value: RangePickerValue, info: PickerCalendarChangeInfo) => (value === undefined || Array.isArray(value)) && Boolean(info?.range),
  ok: (value: RangePickerValue) => value === undefined || Array.isArray(value),
  clear: () => true,
  invalid: (input: string, part: RangePickerPart) => typeof input === 'string' && Boolean(part)
}

export type DateRangePickerRuntimeProps = ExtractPropTypes<typeof dateRangePickerProps>

interface DateRangePickerSupplementalProps {
  id?: string
  labelledBy?: string
  ariaLabelledby?: string
  describedBy?: string
  ariaDescribedby?: string
  placeholder?: [string, string]
  locale?: AheartLocale
  cellRender?: (info: DatePickerCellRenderInfo & { range: RangePickerPart }) => VNodeChild
  'onUpdate:modelValue'?: (value: RangePickerValue) => void
  onChange?: (value: RangePickerValue) => void
  onOpenChange?: (open: boolean) => void
  onPanelChange?: (value: RangePickerPanelValue, mode: PickerMode) => void
  onCalendarChange?: (value: RangePickerValue, info: PickerCalendarChangeInfo) => void
  onOk?: (value: RangePickerValue) => void
  onClear?: () => void
  onInvalid?: (input: string, part: RangePickerPart) => void
}

export type DateRangePickerProps = import('../picker-core/types').DateRangePickerPublicProps & DateRangePickerSupplementalProps
