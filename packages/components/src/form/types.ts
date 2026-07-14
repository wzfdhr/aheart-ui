import type { ComputedRef, ExtractPropTypes, InjectionKey, PropType, VNodeChild } from 'vue'
import type { AheartSize, AheartVariant } from '../config'
import type { TooltipProps } from '../tooltip'

export type FormLayout = 'horizontal' | 'vertical' | 'inline'
export type FormItemLayout = Exclude<FormLayout, 'inline'>
export type FormLabelAlign = 'left' | 'right'
export type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating'
export type FormRequiredMark = boolean | 'optional'
export type FormValidateFirst = boolean | 'parallel'
export type FormVariant = AheartVariant
export type FormRenderable = VNodeChild
export type FormMessageVariables = Record<string, string | number>
export type FormScrollToFirstError = boolean | ScrollIntoViewOptions
export type FormTooltipTitle = FormRenderable | (() => FormRenderable)
export type FormItemTooltipConfig = Partial<Omit<TooltipProps, 'title'>> & {
  title?: FormTooltipTitle
  icon?: FormRenderable
}
export type FormItemTooltip = FormTooltipTitle | FormItemTooltipConfig
export type FormRuleType = 'string' | 'number' | 'email' | 'array'
export type FormModel = Record<string, unknown>
export type FormRuleValidatorResult = void | boolean | string
export type FormRuleValidator = (
  rule: FormRule,
  value: unknown,
  model: FormModel
) => FormRuleValidatorResult | Promise<FormRuleValidatorResult>

export interface FormRule {
  required?: boolean
  message?: string
  type?: FormRuleType
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  validator?: FormRuleValidator
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
  validating: boolean
  rules: FormRule[]
  validateFirst: FormValidateFirst
  messageVariables: FormMessageVariables
}

export interface FormContext {
  requiredMark: ComputedRef<FormRequiredMark>
  colon: ComputedRef<boolean>
  registerField: (
    name: string,
    rules: FormRule[],
    validateFirst: FormValidateFirst,
    messageVariables: FormMessageVariables
  ) => void
  unregisterField: (name: string) => void
  getFieldErrors: (name: string) => string[]
  isFieldValidating: (name: string) => boolean
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
  },
  scrollToFirstError: {
    type: [Boolean, Object] as PropType<FormScrollToFirstError>,
    default: false
  }
} as const

export const formEmits = {
  submit: (event: Event) => event instanceof Event,
  finish: (values: FormModel) => typeof values === 'object' && values !== null,
  finishFailed: (info: FormFinishFailedInfo) => Array.isArray(info.errorFields),
  validate: (name: string, status: boolean, errors: string[]) =>
    typeof name === 'string' && typeof status === 'boolean' && Array.isArray(errors)
}

const renderableProp = {
  type: [String, Number, Boolean, Object, Array] as PropType<FormRenderable>,
  default: undefined
}

const tooltipProp = {
  type: [String, Number, Boolean, Object, Array, Function] as PropType<FormItemTooltip>,
  default: undefined
}

export const formItemProps = {
  label: [String, Number, Object, Array] as PropType<FormRenderable>,
  name: String,
  colon: {
    type: Boolean,
    default: undefined
  },
  htmlFor: String,
  labelAlign: String as PropType<FormLabelAlign>,
  layout: String as PropType<FormItemLayout>,
  hidden: Boolean,
  noStyle: Boolean,
  validateFirst: {
    type: [Boolean, String] as PropType<FormValidateFirst>,
    default: false
  },
  messageVariables: {
    type: Object as PropType<FormMessageVariables>,
    default: () => ({})
  },
  required: Boolean,
  rules: Array as PropType<FormRule[]>,
  validateStatus: String as PropType<FormValidateStatus>,
  help: renderableProp,
  extra: renderableProp,
  tooltip: tooltipProp,
  hasFeedback: Boolean
} as const

export type FormProps = ExtractPropTypes<typeof formProps>
export type FormItemProps = ExtractPropTypes<typeof formItemProps>
