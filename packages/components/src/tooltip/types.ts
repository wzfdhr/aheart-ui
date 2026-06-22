import type { ExtractPropTypes, PropType } from 'vue'
import {
  floatingPlacements,
  isFloatingTriggerProp,
  type FloatingPlacement,
  type FloatingTriggerProp
} from '../utils/floating'

export const tooltipProps = {
  title: String,
  placement: {
    type: String as PropType<FloatingPlacement>,
    default: 'top',
    validator: (value: string) => floatingPlacements.includes(value as FloatingPlacement)
  },
  trigger: {
    type: [String, Array] as PropType<FloatingTriggerProp>,
    default: 'hover',
    validator: isFloatingTriggerProp
  },
  open: {
    type: Boolean,
    default: undefined
  },
  defaultOpen: Boolean,
  color: String,
  arrow: {
    type: Boolean,
    default: true
  },
  zIndex: Number,
  mouseEnterDelay: {
    type: Number,
    default: 0
  },
  mouseLeaveDelay: {
    type: Number,
    default: 0
  }
} as const

export const tooltipEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  openChange: (open: boolean) => typeof open === 'boolean'
}

export type TooltipProps = ExtractPropTypes<typeof tooltipProps>
