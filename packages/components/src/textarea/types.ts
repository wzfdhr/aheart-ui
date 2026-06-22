import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { AheartSize } from '../config'

export type TextareaStatus = 'error' | 'warning'
export type TextareaVariant = 'outlined' | 'borderless' | 'filled' | 'underlined'
export type TextareaRenderable = VNodeChild

export interface TextareaCountFormatterInfo {
  count: number
  maxLength?: number
  value: string
}

export interface TextareaAllowClearConfig {
  clearIcon?: TextareaRenderable
  disabled?: boolean
}

export interface TextareaShowCountConfig {
  formatter?: (info: TextareaCountFormatterInfo) => TextareaRenderable
}

export interface TextareaCountExceedFormatterInfo {
  max: number
}

export interface TextareaCountConfig {
  max?: number
  strategy?: (value: string) => number
  show?: boolean | ((info: TextareaCountFormatterInfo) => TextareaRenderable)
  exceedFormatter?: (value: string, config: TextareaCountExceedFormatterInfo) => string
}

export interface TextareaAutoSizeConfig {
  minRows?: number
  maxRows?: number
}

export type TextareaAllowClear = boolean | TextareaAllowClearConfig
export type TextareaShowCount = boolean | TextareaShowCountConfig
export type TextareaSemanticPart = 'root' | 'textarea' | 'clear' | 'count'
export type TextareaClassNames = Partial<Record<TextareaSemanticPart, string>>
export type TextareaStyles = Partial<Record<TextareaSemanticPart, StyleValue>>

export const textareaProps = {
  id: String,
  modelValue: String,
  placeholder: String,
  rows: {
    type: Number,
    default: 3
  },
  size: String as PropType<AheartSize>,
  disabled: {
    type: Boolean,
    default: undefined
  },
  readOnly: Boolean,
  status: String as PropType<TextareaStatus>,
  variant: {
    type: String as PropType<TextareaVariant>,
    default: undefined
  },
  bordered: {
    type: Boolean,
    default: undefined
  },
  allowClear: {
    type: [Boolean, Object] as PropType<TextareaAllowClear>,
    default: false
  },
  maxlength: Number,
  showCount: {
    type: [Boolean, Object] as PropType<TextareaShowCount>,
    default: false
  },
  count: Object as PropType<TextareaCountConfig>,
  autoSize: [Boolean, Object] as PropType<boolean | TextareaAutoSizeConfig>,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<TextareaClassNames>,
  styles: Object as PropType<TextareaStyles>
} as const

export const textareaEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  input: (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string',
  clear: () => true,
  pressEnter: (event: KeyboardEvent) => event instanceof KeyboardEvent
}

export type TextareaProps = ExtractPropTypes<typeof textareaProps>
