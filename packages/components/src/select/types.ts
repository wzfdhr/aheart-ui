import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type SelectStatus = 'error' | 'warning'
export type SelectPrimitiveValue = string | number
export type SelectMode = 'multiple' | 'tags'
export type SelectValue = SelectPrimitiveValue | SelectPrimitiveValue[]
export type SelectVariant = 'outlined' | 'borderless' | 'filled' | 'underlined'

export interface SelectOption {
  label: string
  value: SelectPrimitiveValue
  disabled?: boolean
}

export type SelectFilterOption = boolean | ((inputValue: string, option: SelectOption) => boolean)

export const selectProps = {
  id: String,
  name: String,
  modelValue: [String, Number, Array] as PropType<SelectValue>,
  options: Array as PropType<SelectOption[]>,
  placeholder: String,
  prefix: String,
  suffixIcon: String,
  size: String as PropType<AheartSize>,
  disabled: {
    type: Boolean,
    default: undefined
  },
  status: String as PropType<SelectStatus>,
  variant: {
    type: String as PropType<SelectVariant>,
    default: undefined
  },
  bordered: {
    type: Boolean,
    default: undefined
  },
  allowClear: Boolean,
  mode: String as PropType<SelectMode>,
  showSearch: Boolean,
  searchValue: String,
  filterOption: {
    type: [Boolean, Function] as PropType<SelectFilterOption>,
    default: undefined
  },
  notFoundContent: {
    type: String,
    default: 'Not Found'
  },
  maxCount: Number
} as const

export const selectEmits = {
  'update:modelValue': (value: SelectValue) =>
    typeof value === 'string' || typeof value === 'number' || Array.isArray(value),
  change: (value: SelectValue) => typeof value === 'string' || typeof value === 'number' || Array.isArray(value),
  clear: () => true,
  search: (value: string) => typeof value === 'string'
}

export type SelectProps = ExtractPropTypes<typeof selectProps>
