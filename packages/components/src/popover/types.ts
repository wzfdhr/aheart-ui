import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import {
  floatingPlacements,
  isFloatingTriggerProp,
  type FloatingPlacement,
  type FloatingTriggerProp
} from '../utils/floating'

export interface PopoverArrowConfig {
  pointAtCenter?: boolean
}

export type PopoverArrow = boolean | PopoverArrowConfig
export type PopoverRenderable = VNodeChild
export type PopoverRenderableFactory = () => VNodeChild
export type PopoverContent = PopoverRenderable | PopoverRenderableFactory
export type PopoverGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement
export interface PopoverAlignConfig {
  offset?: [number, number]
  [key: string]: unknown
}
export type PopoverSemanticPart = 'root' | 'trigger' | 'popup' | 'container' | 'title' | 'content' | 'arrow'
export interface PopoverSemanticInfo {
  open: boolean
  placement: FloatingPlacement
}
export type PopoverSemanticClassNames = Partial<Record<PopoverSemanticPart, string>>
export type PopoverSemanticStyles = Partial<Record<PopoverSemanticPart, StyleValue>>
export type PopoverClassNames = PopoverSemanticClassNames | ((info: PopoverSemanticInfo) => PopoverSemanticClassNames)
export type PopoverStyles = PopoverSemanticStyles | ((info: PopoverSemanticInfo) => PopoverSemanticStyles)

const renderableProp = {
  type: null as unknown as PropType<PopoverContent>,
  default: undefined
}

export const popoverProps = {
  title: renderableProp,
  content: renderableProp,
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
  align: Object as PropType<PopoverAlignConfig>,
  arrow: {
    type: [Boolean, Object] as PropType<PopoverArrow>,
    default: true
  },
  zIndex: Number,
  getPopupContainer: Function as PropType<PopoverGetPopupContainer>,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  overlayClassName: String,
  overlayStyle: [String, Object, Array] as PropType<StyleValue>,
  overlayInnerStyle: [String, Object, Array] as PropType<StyleValue>,
  classNames: [Object, Function] as PropType<PopoverClassNames>,
  styles: [Object, Function] as PropType<PopoverStyles>
} as const

export const popoverEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  openChange: (open: boolean) => typeof open === 'boolean'
}

export type PopoverProps = ExtractPropTypes<typeof popoverProps>
