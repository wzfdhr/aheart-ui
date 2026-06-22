import type { ExtractPropTypes, PropType } from 'vue'
import {
  floatingPlacements,
  isFloatingTriggerProp,
  type FloatingPlacement,
  type FloatingTriggerProp
} from '../utils/floating'

export const popoverProps = {
  title: String,
  content: String,
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
  zIndex: Number
} as const

export const popoverEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  openChange: (open: boolean) => typeof open === 'boolean'
}

export type PopoverProps = ExtractPropTypes<typeof popoverProps>
