import type { ExtractPropTypes, PropType, StyleValue } from 'vue'
import type { AheartSize } from '../config'

export type RadioValue = string | number | boolean
export type RadioGroupDirection = 'horizontal' | 'vertical'
export type RadioOptionType = 'default' | 'button'
export type RadioButtonStyle = 'outline' | 'solid'
export type RadioSemanticPart = 'root' | 'icon' | 'label'
export type RadioClassNames = Partial<Record<RadioSemanticPart, string>>
export type RadioStyles = Partial<Record<RadioSemanticPart, StyleValue>>
export type RadioRawOption = string | number | RadioOption

export interface RadioOption {
  label: string
  value: RadioValue
  disabled?: boolean
  className?: string
  style?: StyleValue
  title?: string
}

export const radioProps = {
  modelValue: {
    type: Boolean,
    default: undefined
  },
  checked: {
    type: Boolean,
    default: undefined
  },
  defaultChecked: {
    type: Boolean,
    default: undefined
  },
  value: {
    type: [String, Number, Boolean] as PropType<RadioValue>,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  label: String,
  name: String,
  title: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<RadioClassNames>,
  styles: Object as PropType<RadioStyles>
} as const

export const radioEmits = {
  'update:modelValue': (checked: boolean) => typeof checked === 'boolean',
  'update:checked': (checked: boolean) => typeof checked === 'boolean',
  change: (checked: boolean, event: Event) => typeof checked === 'boolean' && event instanceof Event
}

export const radioGroupProps = {
  modelValue: {
    type: [String, Number, Boolean] as PropType<RadioValue>,
    default: undefined
  },
  value: {
    type: [String, Number, Boolean] as PropType<RadioValue>,
    default: undefined
  },
  defaultValue: {
    type: [String, Number, Boolean] as PropType<RadioValue>,
    default: undefined
  },
  options: {
    type: Array as PropType<RadioRawOption[]>,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  name: String,
  direction: {
    type: String as PropType<RadioGroupDirection>,
    default: 'horizontal'
  },
  optionType: {
    type: String as PropType<RadioOptionType>,
    default: 'default'
  },
  buttonStyle: {
    type: String as PropType<RadioButtonStyle>,
    default: 'outline'
  },
  size: String as PropType<AheartSize>,
  block: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>
} as const

export const radioGroupEmits = {
  'update:modelValue': (value: RadioValue) =>
    typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean',
  'update:value': (value: RadioValue) =>
    typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean',
  change: (value: RadioValue) => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
}

export type RadioProps = ExtractPropTypes<typeof radioProps>
export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>
