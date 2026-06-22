import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type TextareaStatus = 'error' | 'warning'

export const textareaProps = {
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
  status: String as PropType<TextareaStatus>,
  maxlength: Number,
  showCount: Boolean,
  autoSize: Boolean
} as const

export const textareaEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  input: (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string'
}

export type TextareaProps = ExtractPropTypes<typeof textareaProps>
