import type { ExtractPropTypes, PropType, VNodeChild } from 'vue'
import type { AheartLocale, AheartSize, AheartVariant } from '../config'
import type {
  DatePickerPublicProps,
  MultiplePickerValue,
  PickerDisabledDate,
  PickerFormat,
  PickerMode,
  PickerPreset,
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
