import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type TextareaStatus = 'error' | 'warning'
export type TextareaVariant = 'outlined' | 'borderless' | 'filled' | 'underlined'

export interface TextareaAutoSizeConfig {
  minRows?: number
  maxRows?: number
}

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
  allowClear: Boolean,
  maxlength: Number,
  showCount: Boolean,
  autoSize: [Boolean, Object] as PropType<boolean | TextareaAutoSizeConfig>
} as const

export const textareaEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  input: (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string',
  clear: () => true,
  pressEnter: (event: KeyboardEvent) => event instanceof KeyboardEvent
}

export type TextareaProps = ExtractPropTypes<typeof textareaProps>
