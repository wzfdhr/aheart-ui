import type { ExtractPropTypes, PropType } from 'vue'
import type { ButtonType } from '../button/types'
import {
  floatingPlacements,
  isFloatingTriggerProp,
  type FloatingPlacement,
  type FloatingTriggerProp
} from '../utils/floating'

export const popconfirmProps = {
  title: String,
  description: String,
  placement: {
    type: String as PropType<FloatingPlacement>,
    default: 'top',
    validator: (value: string) => floatingPlacements.includes(value as FloatingPlacement)
  },
  trigger: {
    type: [String, Array] as PropType<FloatingTriggerProp>,
    default: 'click',
    validator: isFloatingTriggerProp
  },
  open: {
    type: Boolean,
    default: undefined
  },
  defaultOpen: Boolean,
  okText: {
    type: String,
    default: 'OK'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  okType: {
    type: String as PropType<ButtonType>,
    default: 'primary'
  },
  disabled: Boolean,
  showCancel: {
    type: Boolean,
    default: true
  },
  arrow: {
    type: Boolean,
    default: true
  },
  zIndex: Number
} as const

export const popconfirmEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  openChange: (open: boolean) => typeof open === 'boolean',
  confirm: () => true,
  cancel: () => true
}

export type PopconfirmProps = ExtractPropTypes<typeof popconfirmProps>
