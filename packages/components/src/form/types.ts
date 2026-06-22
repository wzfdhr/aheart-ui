import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type FormLayout = 'horizontal' | 'vertical' | 'inline'
export type FormLabelAlign = 'left' | 'right'
export type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating'

export const formProps = {
  layout: {
    type: String as PropType<FormLayout>,
    default: 'horizontal'
  },
  labelAlign: {
    type: String as PropType<FormLabelAlign>,
    default: 'right'
  },
  size: String as PropType<AheartSize>,
  disabled: {
    type: Boolean,
    default: undefined
  }
} as const

export const formEmits = {
  submit: (event: Event) => event instanceof Event
}

export const formItemProps = {
  label: String,
  name: String,
  required: Boolean,
  validateStatus: String as PropType<FormValidateStatus>,
  help: String,
  extra: String,
  hasFeedback: Boolean
} as const

export type FormProps = ExtractPropTypes<typeof formProps>
export type FormItemProps = ExtractPropTypes<typeof formItemProps>
