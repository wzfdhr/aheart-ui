import type { ComputedRef, ExtractPropTypes, InjectionKey, PropType } from 'vue'
import type { AheartSize, AheartVariant } from '../config'

export type FormLayout = 'horizontal' | 'vertical' | 'inline'
export type FormLabelAlign = 'left' | 'right'
export type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating'
export type FormRequiredMark = boolean | 'optional'
export type FormVariant = AheartVariant
export type FormRuleType = 'string' | 'number' | 'email' | 'array'
export type FormModel = Record<string, unknown>

export interface FormRule {
  required?: boolean
  message?: string
  type?: FormRuleType
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
}

export type FormRules = Record<string, FormRule[]>

export interface FormValidationError {
  name: string
  errors: string[]
}

export interface FormFinishFailedInfo {
  values: FormModel
  errorFields: FormValidationError[]
}

export interface FormFieldState {
  errors: string[]
  rules: FormRule[]
}

export interface FormContext {
  requiredMark: ComputedRef<FormRequiredMark>
  colon: ComputedRef<boolean>
  registerField: (name: string, rules: FormRule[]) => void
  unregisterField: (name: string) => void
  getFieldErrors: (name: string) => string[]
  isFieldRequired: (name: string) => boolean
}

export const formContextKey: InjectionKey<FormContext> = Symbol('aheart-form-context')

export const formProps = {
  model: {
    type: Object as PropType<FormModel>,
    default: () => ({})
  },
  rules: {
    type: Object as PropType<FormRules>,
    default: () => ({})
  },
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
  },
  requiredMark: {
    type: [Boolean, String] as PropType<FormRequiredMark>,
    default: true
  },
  colon: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String as PropType<FormVariant>,
    default: undefined
  }
} as const

export const formEmits = {
  submit: (event: Event) => event instanceof Event,
  finish: (values: FormModel) => typeof values === 'object' && values !== null,
  finishFailed: (info: FormFinishFailedInfo) => Array.isArray(info.errorFields),
  validate: (name: string, status: boolean, errors: string[]) =>
    typeof name === 'string' && typeof status === 'boolean' && Array.isArray(errors)
}

export const formItemProps = {
  label: String,
  name: String,
  required: Boolean,
  rules: Array as PropType<FormRule[]>,
  validateStatus: String as PropType<FormValidateStatus>,
  help: String,
  extra: String,
  hasFeedback: Boolean
} as const

export type FormProps = ExtractPropTypes<typeof formProps>
export type FormItemProps = ExtractPropTypes<typeof formItemProps>
