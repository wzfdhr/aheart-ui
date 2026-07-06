import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { AheartSize } from '../config'

export type InputNumberStatus = 'error' | 'warning'
export type InputNumberVariant = 'outlined' | 'borderless' | 'filled' | 'underlined'
export type InputNumberMode = 'input' | 'spinner'
export type InputNumberStepType = 'up' | 'down'
export type InputNumberStepEmitter = 'handler' | 'keydown' | 'wheel'
export type InputNumberFocusCursor = 'start' | 'end' | 'all'
export type InputNumberRenderable = VNodeChild
export type InputNumberValue = number | string

export interface InputNumberFocusOptions extends FocusOptions {
  cursor?: InputNumberFocusCursor
}

export interface InputNumberFormatterInfo {
  userTyping: boolean
  input: string
}

export interface InputNumberControlsConfig {
  upIcon?: InputNumberRenderable
  downIcon?: InputNumberRenderable
}

export type InputNumberControls = boolean | InputNumberControlsConfig
export type InputNumberSemanticPart = 'root' | 'input' | 'prefix' | 'suffix' | 'actions' | 'action'
export interface InputNumberSemanticInfo {
  props: Readonly<Record<string, unknown>>
}

export type InputNumberSemanticRecord<T> = Partial<Record<InputNumberSemanticPart, T>>
export type InputNumberSemanticConfig<T> =
  | InputNumberSemanticRecord<T>
  | ((info: InputNumberSemanticInfo) => InputNumberSemanticRecord<T>)
export type InputNumberClassNames = InputNumberSemanticConfig<string>
export type InputNumberStyles = InputNumberSemanticConfig<StyleValue>

export interface InputNumberStepInfo {
  offset: number
  type: InputNumberStepType
  emitter: InputNumberStepEmitter
}

const renderableProp = {
  type: null as unknown as PropType<InputNumberRenderable>,
  default: undefined
}

export const inputNumberProps = {
  id: String,
  modelValue: [Number, String] as PropType<InputNumberValue>,
  value: [Number, String] as PropType<InputNumberValue>,
  defaultValue: [Number, String] as PropType<InputNumberValue>,
  autoFocus: Boolean,
  placeholder: String,
  addonBefore: renderableProp,
  addonAfter: renderableProp,
  prefix: renderableProp,
  suffix: renderableProp,
  size: String as PropType<AheartSize>,
  mode: {
    type: String as PropType<InputNumberMode>,
    default: 'input'
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  readOnly: Boolean,
  status: String as PropType<InputNumberStatus>,
  variant: {
    type: String as PropType<InputNumberVariant>,
    default: undefined
  },
  bordered: {
    type: Boolean,
    default: undefined
  },
  min: Number,
  max: Number,
  step: {
    type: [Number, String] as PropType<number | string>,
    default: 1
  },
  precision: Number,
  decimalSeparator: String,
  stringMode: Boolean,
  formatter: Function as PropType<(value: InputNumberValue | undefined, info: InputNumberFormatterInfo) => string>,
  parser: Function as PropType<(displayValue: string) => InputNumberValue | undefined>,
  keyboard: {
    type: Boolean,
    default: true
  },
  controls: {
    type: [Boolean, Object] as PropType<InputNumberControls>,
    default: true
  },
  changeOnBlur: {
    type: Boolean,
    default: true
  },
  changeOnWheel: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: [Object, Function] as PropType<InputNumberClassNames>,
  styles: [Object, Function] as PropType<InputNumberStyles>
} as const

export const inputNumberEmits = {
  'update:modelValue': (value: InputNumberValue | undefined) =>
    typeof value === 'number' || typeof value === 'string' || value === undefined,
  change: (value: InputNumberValue | undefined) =>
    typeof value === 'number' || typeof value === 'string' || value === undefined,
  input: (value: string) => typeof value === 'string',
  pressEnter: (event: KeyboardEvent) => event instanceof KeyboardEvent,
  step: (value: InputNumberValue, info: InputNumberStepInfo) =>
    (typeof value === 'number' || typeof value === 'string') &&
    typeof info.offset === 'number' &&
    (info.type === 'up' || info.type === 'down') &&
    (info.emitter === 'handler' || info.emitter === 'keydown' || info.emitter === 'wheel')
}

export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>
