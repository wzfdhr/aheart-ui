import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export const switchProps = {
  modelValue: Boolean,
  disabled: {
    type: Boolean,
    default: undefined
  },
  loading: Boolean,
  size: String as PropType<AheartSize>,
  checkedChildren: String,
  unCheckedChildren: String
} as const

export const switchEmits = {
  'update:modelValue': (checked: boolean) => typeof checked === 'boolean',
  change: (checked: boolean) => typeof checked === 'boolean'
}

export type SwitchProps = ExtractPropTypes<typeof switchProps>
