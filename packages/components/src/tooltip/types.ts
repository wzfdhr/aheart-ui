import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
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
export type TooltipRenderable = VNodeChild
export type TooltipRenderableFactory = () => VNodeChild
export type TooltipTitle = TooltipRenderable | TooltipRenderableFactory
export type TooltipGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement
export interface TooltipAlignConfig {
  offset?: [number, number]
  [key: string]: unknown
}
export type TooltipSemanticPart = 'root' | 'trigger' | 'popup' | 'container' | 'content' | 'arrow'
export interface TooltipSemanticInfo {
  open: boolean
  placement: FloatingPlacement
}
export type TooltipSemanticClassNames = Partial<Record<TooltipSemanticPart, string>>
export type TooltipSemanticStyles = Partial<Record<TooltipSemanticPart, StyleValue>>
export type TooltipClassNames = TooltipSemanticClassNames | ((info: TooltipSemanticInfo) => TooltipSemanticClassNames)
export type TooltipStyles = TooltipSemanticStyles | ((info: TooltipSemanticInfo) => TooltipSemanticStyles)

const titleProp = {
  type: null as unknown as PropType<TooltipTitle>,
  default: undefined
}

export const tooltipProps = {
  title: titleProp,
  placement: {
    type: String as PropType<FloatingPlacement>,
    default: 'top',
    validator: (value: string) => floatingPlacements.includes(value as FloatingPlacement)
  },
  autoAdjustOverflow: {
    type: Boolean,
    default: true
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
  align: Object as PropType<TooltipAlignConfig>,
  arrow: {
    type: [Boolean, Object] as PropType<TooltipArrow>,
    default: true
  },
  zIndex: Number,
  getPopupContainer: Function as PropType<TooltipGetPopupContainer>,
  mouseEnterDelay: {
    type: Number,
    default: 0.1
  },
  mouseLeaveDelay: {
    type: Number,
    default: 0.1
  },
  destroyOnHidden: Boolean,
  destroyTooltipOnHide: Boolean,
  fresh: Boolean,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  overlayClassName: String,
  overlayStyle: [String, Object, Array] as PropType<StyleValue>,
  overlayInnerStyle: [String, Object, Array] as PropType<StyleValue>,
  classNames: [Object, Function] as PropType<TooltipClassNames>,
  styles: [Object, Function] as PropType<TooltipStyles>
} as const

export const tooltipEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  openChange: (open: boolean) => typeof open === 'boolean'
}

export type TooltipProps = ExtractPropTypes<typeof tooltipProps>
