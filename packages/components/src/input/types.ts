import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type InputStatus = 'error' | 'warning'

export const inputProps = {
  modelValue: String,
  placeholder: String,
  size: String as PropType<AheartSize>,
  disabled: {
    type: Boolean,
    default: undefined
  },
  status: String as PropType<InputStatus>,
  allowClear: Boolean,
  maxlength: Number,
  showCount: Boolean,
  type: {
    type: String,
    default: 'text'
  }
} as const

export const inputEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  input: (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string',
  clear: () => true
}

export type InputProps = ExtractPropTypes<typeof inputProps>
