import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export const inputNumberProps = {
  modelValue: Number,
  placeholder: String,
  size: String as PropType<AheartSize>,
  disabled: {
    type: Boolean,
    default: undefined
  },
  min: Number,
  max: Number,
  step: {
    type: Number,
    default: 1
  },
  controls: {
    type: Boolean,
    default: true
  }
} as const

export const inputNumberEmits = {
  'update:modelValue': (value: number | undefined) => typeof value === 'number' || value === undefined,
  change: (value: number | undefined) => typeof value === 'number' || value === undefined
}

export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>
