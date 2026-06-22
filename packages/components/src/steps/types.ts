import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'
export type StepsDirection = 'horizontal' | 'vertical'

export interface StepItem {
  title: string
  description?: string
  status?: StepStatus
  disabled?: boolean
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
  size: String as PropType<AheartSize>
} as const

export const stepsEmits = {
  change: (current: number) => Number.isInteger(current)
}

export type StepsProps = ExtractPropTypes<typeof stepsProps>
