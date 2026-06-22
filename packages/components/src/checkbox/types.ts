import type { ExtractPropTypes, PropType, StyleValue } from 'vue'

export type CheckboxValue = string | number | boolean
export type CheckboxGroupDirection = 'horizontal' | 'vertical'
export type CheckboxSemanticPart = 'root' | 'icon' | 'label'
export type CheckboxClassNames = Partial<Record<CheckboxSemanticPart, string>>
export type CheckboxStyles = Partial<Record<CheckboxSemanticPart, StyleValue>>
export type CheckboxRawOption = CheckboxValue | CheckboxOption

export interface CheckboxOption {
  label: string
  value: CheckboxValue
  disabled?: boolean
  className?: string
  style?: StyleValue
  title?: string
}

export const checkboxProps = {
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
  value: [String, Number, Boolean] as PropType<CheckboxValue>,
  name: String,
  disabled: {
    type: Boolean,
    default: undefined
  },
  indeterminate: Boolean,
  label: String,
  title: String,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<CheckboxClassNames>,
  styles: Object as PropType<CheckboxStyles>
} as const

export const checkboxEmits = {
  'update:modelValue': (checked: boolean) => typeof checked === 'boolean',
  'update:checked': (checked: boolean) => typeof checked === 'boolean',
  change: (checked: boolean, event: Event) => typeof checked === 'boolean' && event instanceof Event
}

export const checkboxGroupProps = {
  modelValue: {
    type: Array as PropType<CheckboxValue[]>,
    default: undefined
  },
  value: {
    type: Array as PropType<CheckboxValue[]>,
    default: undefined
  },
  defaultValue: {
    type: Array as PropType<CheckboxValue[]>,
    default: undefined
  },
  options: {
    type: Array as PropType<CheckboxRawOption[]>,
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
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>
} as const

export const checkboxGroupEmits = {
  'update:modelValue': (value: CheckboxValue[]) => Array.isArray(value),
  'update:value': (value: CheckboxValue[]) => Array.isArray(value),
  change: (value: CheckboxValue[]) => Array.isArray(value)
}

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>
export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>
