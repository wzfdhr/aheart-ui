import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type RadioValue = string | number | boolean
export type RadioGroupDirection = 'horizontal' | 'vertical'
export type RadioOptionType = 'default' | 'button'
export type RadioButtonStyle = 'outline' | 'solid'

export interface RadioOption {
  label: string
  value: RadioValue
  disabled?: boolean
}

export const radioProps = {
  modelValue: Boolean,
  value: [String, Number, Boolean] as PropType<RadioValue>,
  disabled: {
    type: Boolean,
    default: undefined
  },
  label: String,
  name: String
} as const

export const radioEmits = {
  'update:modelValue': (checked: boolean) => typeof checked === 'boolean',
  change: (checked: boolean) => typeof checked === 'boolean'
}

export const radioGroupProps = {
  modelValue: [String, Number, Boolean] as PropType<RadioValue>,
  options: {
    type: Array as PropType<RadioOption[]>,
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
  block: Boolean
} as const

export const radioGroupEmits = {
  'update:modelValue': (value: RadioValue) =>
    typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean',
  change: (value: RadioValue) => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
}

export type RadioProps = ExtractPropTypes<typeof radioProps>
export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>
