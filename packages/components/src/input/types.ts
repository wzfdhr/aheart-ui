import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { AheartSize } from '../config'

export type InputStatus = 'error' | 'warning'
export type InputVariant = 'outlined' | 'borderless' | 'filled' | 'underlined'
export type InputRenderable = VNodeChild
export interface InputCountFormatterInfo {
  count: number
  maxLength?: number
  value: string
}

export interface InputAllowClearConfig {
  clearIcon?: InputRenderable
  disabled?: boolean
}

export interface InputShowCountConfig {
  formatter?: (info: InputCountFormatterInfo) => InputRenderable
}

export interface InputCountExceedFormatterInfo {
  max: number
}

export interface InputCountConfig {
  max?: number
  strategy?: (value: string) => number
  show?: boolean | ((info: InputCountFormatterInfo) => InputRenderable)
  exceedFormatter?: (value: string, config: InputCountExceedFormatterInfo) => string
}

export type InputAllowClear = boolean | InputAllowClearConfig
export type InputShowCount = boolean | InputShowCountConfig
export type InputSemanticPart =
  | 'root'
  | 'group'
  | 'input'
  | 'prefix'
  | 'suffix'
  | 'clear'
  | 'count'
  | 'addonBefore'
  | 'addonAfter'
export type InputClassNames = Partial<Record<InputSemanticPart, string>>
export type InputStyles = Partial<Record<InputSemanticPart, StyleValue>>

const renderableProp = {
  type: null as unknown as PropType<InputRenderable>,
  default: undefined
}

export const inputProps = {
  id: String,
  modelValue: String,
  placeholder: String,
  prefix: renderableProp,
  suffix: renderableProp,
  addonBefore: renderableProp,
  addonAfter: renderableProp,
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
