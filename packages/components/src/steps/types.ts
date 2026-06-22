import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { AheartSize } from '../config'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'
export type StepsDirection = 'horizontal' | 'vertical'
export type StepsType = 'default' | 'dot' | 'navigation' | 'panel' | 'inline'
export type StepsTitlePlacement = 'horizontal' | 'vertical'
export type StepRenderable = VNodeChild
export type StepsSemanticPart =
  | 'root'
  | 'item'
  | 'activeItem'
  | 'button'
  | 'indicator'
  | 'icon'
  | 'content'
  | 'title'
  | 'subTitle'
  | 'description'
  | 'connector'
export type StepsClassNames = Partial<Record<StepsSemanticPart, string>>
export type StepsStyles = Partial<Record<StepsSemanticPart, StyleValue>>

export interface StepItem {
  title: StepRenderable
  description?: StepRenderable
  status?: StepStatus
  disabled?: boolean
  icon?: StepRenderable
  subTitle?: StepRenderable
  content?: StepRenderable
}

export const stepsProps = {
  items: Array as PropType<StepItem[]>,
  current: {
    type: Number,
    default: 0
  },
  status: {
    type: String as PropType<StepStatus>,
    default: 'process'
  },
  direction: {
    type: String as PropType<StepsDirection>,
    default: 'horizontal'
  },
  orientation: String as PropType<StepsDirection>,
  size: String as PropType<AheartSize>,
  type: {
    type: String as PropType<StepsType>,
    default: 'default'
  },
  titlePlacement: {
    type: String as PropType<StepsTitlePlacement>,
    default: 'horizontal'
  },
  initial: {
    type: Number,
    default: 1
  },
  percent: Number,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<StepsClassNames>,
  styles: Object as PropType<StepsStyles>
} as const

export const stepsEmits = {
  change: (current: number) => Number.isInteger(current)
}

export type StepsProps = ExtractPropTypes<typeof stepsProps>
