import type { ExtractPropTypes, PropType, StyleValue } from 'vue'
import type { AheartSize } from '../config'

export type InputStatus = 'error' | 'warning'
export type InputVariant = 'outlined' | 'borderless' | 'filled' | 'underlined'
export interface InputCountFormatterInfo {
  count: number
  maxLength?: number
  value: string
}

export interface InputAllowClearConfig {
  clearIcon?: string
}

export interface InputShowCountConfig {
  formatter?: (info: InputCountFormatterInfo) => string
}

export interface InputCountConfig {
  max?: number
  strategy?: (value: string) => number
  show?: boolean | ((info: InputCountFormatterInfo) => string)
}

export type InputAllowClear = boolean | InputAllowClearConfig
export type InputShowCount = boolean | InputShowCountConfig
export type InputSemanticPart = 'root' | 'input' | 'prefix' | 'suffix' | 'clear' | 'count'
export type InputClassNames = Partial<Record<InputSemanticPart, string>>
export type InputStyles = Partial<Record<InputSemanticPart, StyleValue>>

export const inputProps = {
  id: String,
  modelValue: String,
  placeholder: String,
  prefix: String,
  suffix: String,
  addonBefore: String,
  addonAfter: String,
  size: String as PropType<AheartSize>,
  disabled: {
    type: Boolean,
    default: undefined
  },
  readOnly: Boolean,
  status: String as PropType<InputStatus>,
  variant: {
    type: String as PropType<InputVariant>,
    default: undefined
  },
  bordered: {
    type: Boolean,
    default: undefined
  },
  allowClear: {
    type: [Boolean, Object] as PropType<InputAllowClear>,
    default: false
  },
  maxlength: Number,
  showCount: {
    type: [Boolean, Object] as PropType<InputShowCount>,
    default: false
  },
  count: Object as PropType<InputCountConfig>,
  type: {
    type: String,
    default: 'text'
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<InputClassNames>,
  styles: Object as PropType<InputStyles>
} as const

export const inputEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  input: (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string',
  clear: () => true,
  pressEnter: (event: KeyboardEvent) => event instanceof KeyboardEvent
}

export type InputProps = ExtractPropTypes<typeof inputProps>
