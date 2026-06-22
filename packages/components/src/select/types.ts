import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { AheartSize } from '../config'

export type SelectStatus = 'error' | 'warning'
export type SelectPrimitiveValue = string | number
export type SelectMode = 'multiple' | 'tags'
export type SelectValue = SelectPrimitiveValue | SelectPrimitiveValue[]
export type SelectVariant = 'outlined' | 'borderless' | 'filled' | 'underlined'
export type SelectAllowClear = boolean | { clearIcon?: VNodeChild }
export type SelectSemanticPart =
  | 'root'
  | 'prefix'
  | 'search'
  | 'selector'
  | 'option'
  | 'notFound'
  | 'clear'
  | 'suffix'
  | 'loading'
export type SelectClassNames = Partial<Record<SelectSemanticPart, string>>
export type SelectStyles = Partial<Record<SelectSemanticPart, StyleValue>>

export interface SelectOption {
  label: string
  value: SelectPrimitiveValue
  disabled?: boolean
}

export type SelectRawOption = SelectOption | Record<string, unknown>

export interface SelectFieldNames {
  label?: string
  value?: string
  disabled?: string
}

export type SelectFilterOption = boolean | ((inputValue: string, option: SelectOption) => boolean)
export interface SelectFilterSortInfo {
  searchValue: string
}
export type SelectFilterSort = (optionA: SelectOption, optionB: SelectOption, info: SelectFilterSortInfo) => number

export const selectProps = {
  id: String,
  name: String,
  modelValue: [String, Number, Array] as PropType<SelectValue>,
  defaultValue: [String, Number, Array] as PropType<SelectValue>,
  options: Array as PropType<SelectRawOption[]>,
  placeholder: String,
  prefix: String,
  suffixIcon: String,
  loadingIcon: [String, Number, Object, Array, Function] as PropType<VNodeChild>,
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
  allowClear: {
    type: [Boolean, Object] as PropType<SelectAllowClear>,
    default: false
  },
  mode: String as PropType<SelectMode>,
  showSearch: Boolean,
  searchValue: String,
  optionFilterProp: {
    type: String,
    default: 'label'
  },
  filterOption: {
    type: [Boolean, Function] as PropType<SelectFilterOption>,
    default: undefined
  },
  filterSort: Function as PropType<SelectFilterSort>,
  fieldNames: Object as PropType<SelectFieldNames>,
  notFoundContent: {
    type: String,
    default: 'Not Found'
  },
  maxCount: Number,
  loading: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: {
    type: Object as PropType<SelectClassNames>,
    default: () => ({})
  },
  styles: {
    type: Object as PropType<SelectStyles>,
    default: () => ({})
  }
} as const

export const selectEmits = {
  'update:modelValue': (value: SelectValue) =>
    typeof value === 'string' || typeof value === 'number' || Array.isArray(value),
  change: (value: SelectValue) => typeof value === 'string' || typeof value === 'number' || Array.isArray(value),
  clear: () => true,
  search: (value: string) => typeof value === 'string',
  focus: (event: FocusEvent) => event instanceof FocusEvent,
  blur: (event: FocusEvent) => event instanceof FocusEvent
}

export type SelectProps = ExtractPropTypes<typeof selectProps>
