import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { AheartSize } from '../config'

export type InputNumberStatus = 'error' | 'warning'
export type InputNumberVariant = 'outlined' | 'borderless' | 'filled' | 'underlined'
export type InputNumberStepType = 'up' | 'down'
export type InputNumberRenderable = VNodeChild

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
export type InputNumberClassNames = Partial<Record<InputNumberSemanticPart, string>>
export type InputNumberStyles = Partial<Record<InputNumberSemanticPart, StyleValue>>

export interface InputNumberStepInfo {
  offset: number
  type: InputNumberStepType
}

const renderableProp = {
  type: null as unknown as PropType<InputNumberRenderable>,
  default: undefined
}

export const inputNumberProps = {
  id: String,
  modelValue: Number,
  placeholder: String,
  prefix: renderableProp,
  suffix: renderableProp,
  size: String as PropType<AheartSize>,
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
    type: Number,
    default: 1
  },
  precision: Number,
  formatter: Function as PropType<(value: number | undefined, info: InputNumberFormatterInfo) => string>,
  parser: Function as PropType<(displayValue: string) => number | undefined>,
  keyboard: {
    type: Boolean,
    default: true
  },
  controls: {
    type: [Boolean, Object] as PropType<InputNumberControls>,
    default: true
  },
  changeOnWheel: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<InputNumberClassNames>,
  styles: Object as PropType<InputNumberStyles>
} as const

export const inputNumberEmits = {
  'update:modelValue': (value: number | undefined) => typeof value === 'number' || value === undefined,
  change: (value: number | undefined) => typeof value === 'number' || value === undefined,
  pressEnter: (event: KeyboardEvent) => event instanceof KeyboardEvent,
  step: (value: number, info: InputNumberStepInfo) =>
    typeof value === 'number' &&
    typeof info.offset === 'number' &&
    (info.type === 'up' || info.type === 'down')
}

export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>
