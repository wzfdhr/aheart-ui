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
export type PopoverSemanticPart = 'root' | 'trigger' | 'popup' | 'container' | 'title' | 'content' | 'arrow'
export type PopoverClassNames = Partial<Record<PopoverSemanticPart, string>>
export type PopoverStyles = Partial<Record<PopoverSemanticPart, StyleValue>>

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
  fresh: Boolean,
  arrow: {
    type: [Boolean, Object] as PropType<PopoverArrow>,
    default: true
  },
  zIndex: Number,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  overlayClassName: String,
  overlayStyle: [String, Object, Array] as PropType<StyleValue>,
  overlayInnerStyle: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<PopoverClassNames>,
  styles: Object as PropType<PopoverStyles>
} as const

export const popoverEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  openChange: (open: boolean) => typeof open === 'boolean'
}

export type PopoverProps = ExtractPropTypes<typeof popoverProps>
