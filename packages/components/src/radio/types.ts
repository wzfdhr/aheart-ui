import type { ExtractPropTypes } from 'vue'

export const radioProps = {
  modelValue: Boolean,
  disabled: {
    type: Boolean,
    default: undefined
  },
  label: String,
  name: String
} as const

export const radioEmits = {
  'update:modelValue': (checked: boolean) => typeof checked === 'boolean',
  change: (checked: boolean) => typeof checked === 'boolean'
}

export type RadioProps = ExtractPropTypes<typeof radioProps>
