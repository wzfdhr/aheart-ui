import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type InputStatus = 'error' | 'warning'
export type InputVariant = 'outlined' | 'borderless' | 'filled' | 'underlined'

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
  clear: () => true,
  pressEnter: (event: KeyboardEvent) => event instanceof KeyboardEvent
}

export type InputProps = ExtractPropTypes<typeof inputProps>
