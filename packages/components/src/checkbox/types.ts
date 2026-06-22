import type { ExtractPropTypes } from 'vue'

export const checkboxProps = {
  modelValue: Boolean,
  disabled: {
    type: Boolean,
    default: undefined
  },
  indeterminate: Boolean,
  label: String
} as const

export const checkboxEmits = {
  'update:modelValue': (checked: boolean) => typeof checked === 'boolean',
  change: (checked: boolean) => typeof checked === 'boolean'
}

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>
