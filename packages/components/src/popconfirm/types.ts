import type { ExtractPropTypes, PropType, StyleValue } from 'vue'
import type { ButtonProps, ButtonType } from '../button/types'
import {
  floatingPlacements,
  isFloatingTriggerProp,
  type FloatingPlacement,
  type FloatingTriggerProp
} from '../utils/floating'

export type PopconfirmButtonProps = Partial<ButtonProps>
export type PopconfirmSemanticPart =
  | 'root'
  | 'trigger'
  | 'popup'
  | 'arrow'
  | 'message'
  | 'icon'
  | 'text'
  | 'title'
  | 'description'
  | 'actions'
  | 'cancelButton'
  | 'okButton'
export type PopconfirmClassNames = Partial<Record<PopconfirmSemanticPart, string>>
export type PopconfirmStyles = Partial<Record<PopconfirmSemanticPart, StyleValue>>

export const popconfirmProps = {
  title: String,
  description: String,
  icon: String,
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
  okButtonProps: Object as PropType<PopconfirmButtonProps>,
  cancelButtonProps: Object as PropType<PopconfirmButtonProps>,
  disabled: Boolean,
  showCancel: {
    type: Boolean,
    default: true
  },
  color: String,
  arrow: {
    type: Boolean,
    default: true
  },
  zIndex: Number,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<PopconfirmClassNames>,
  styles: Object as PropType<PopconfirmStyles>
} as const

export const popconfirmEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  openChange: (open: boolean) => typeof open === 'boolean',
  confirm: () => true,
  cancel: () => true,
  popupClick: (event: MouseEvent) => event instanceof MouseEvent
}

export type PopconfirmProps = ExtractPropTypes<typeof popconfirmProps>
