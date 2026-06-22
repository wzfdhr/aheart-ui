import type { ExtractPropTypes, PropType } from 'vue'

export type CheckboxValue = string | number | boolean
export type CheckboxGroupDirection = 'horizontal' | 'vertical'

export interface CheckboxOption {
  label: string
  value: CheckboxValue
  disabled?: boolean
}

export const checkboxProps = {
  modelValue: Boolean,
  value: [String, Number, Boolean] as PropType<CheckboxValue>,
  name: String,
  disabled: {
    type: Boolean,
    default: undefined
  },
  indeterminate: Boolean,
  label: String
} as const

export const checkboxEmits = {
  'update:modelValue': (checked: boolean) => typeof checked === 'boolean',
  change: (checked: boolean) => typeof checked === 'boolean'
}

export const checkboxGroupProps = {
  modelValue: {
    type: Array as PropType<CheckboxValue[]>,
    default: () => []
  },
  options: {
    type: Array as PropType<CheckboxOption[]>,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  name: String,
  direction: {
    type: String as PropType<CheckboxGroupDirection>,
    default: 'horizontal'
  }
} as const

export const checkboxGroupEmits = {
  'update:modelValue': (value: CheckboxValue[]) => Array.isArray(value),
  change: (value: CheckboxValue[]) => Array.isArray(value)
}

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>
export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>
