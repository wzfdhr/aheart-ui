import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type SelectStatus = 'error' | 'warning'
export type SelectMode = 'multiple'
export type SelectValue = string | string[]

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export const selectProps = {
  modelValue: [String, Array] as PropType<SelectValue>,
  options: Array as PropType<SelectOption[]>,
  placeholder: String,
  size: String as PropType<AheartSize>,
  disabled: {
    type: Boolean,
    default: undefined
  },
  status: String as PropType<SelectStatus>,
  allowClear: Boolean,
  mode: String as PropType<SelectMode>
} as const

export const selectEmits = {
  'update:modelValue': (value: SelectValue) => typeof value === 'string' || Array.isArray(value),
  change: (value: SelectValue) => typeof value === 'string' || Array.isArray(value),
  clear: () => true
}

export type SelectProps = ExtractPropTypes<typeof selectProps>
