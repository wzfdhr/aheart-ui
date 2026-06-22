import type { ExtractPropTypes, PropType, StyleValue } from 'vue'
import {
  floatingPlacements,
  isFloatingTriggerProp,
  type FloatingPlacement,
  type FloatingTriggerProp
} from '../utils/floating'

export interface TooltipArrowConfig {
  pointAtCenter?: boolean
}

export type TooltipArrow = boolean | TooltipArrowConfig
export type TooltipSemanticPart = 'root' | 'trigger' | 'popup' | 'container' | 'content' | 'arrow'
export type TooltipClassNames = Partial<Record<TooltipSemanticPart, string>>
export type TooltipStyles = Partial<Record<TooltipSemanticPart, StyleValue>>

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
    type: [Boolean, Object] as PropType<TooltipArrow>,
    default: true
  },
  zIndex: Number,
  mouseEnterDelay: {
    type: Number,
    default: 0.1
  },
  mouseLeaveDelay: {
    type: Number,
    default: 0.1
  },
  destroyOnHidden: Boolean,
  fresh: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  overlayClassName: String,
  overlayStyle: [String, Object, Array] as PropType<StyleValue>,
  overlayInnerStyle: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<TooltipClassNames>,
  styles: Object as PropType<TooltipStyles>
} as const

export const tooltipEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  openChange: (open: boolean) => typeof open === 'boolean'
}

export type TooltipProps = ExtractPropTypes<typeof tooltipProps>
