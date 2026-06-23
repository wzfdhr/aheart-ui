import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
import type { ButtonProps, ButtonType } from '../button/types'
import {
  floatingPlacements,
  isFloatingTriggerProp,
  type FloatingPlacement,
  type FloatingTriggerProp
} from '../utils/floating'

export type PopconfirmButtonProps = Partial<ButtonProps>
export type PopconfirmRenderable = VNodeChild
export type PopconfirmRenderableFactory = () => VNodeChild
export type PopconfirmContent = PopconfirmRenderable | PopconfirmRenderableFactory
export type PopconfirmGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement
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

const renderableProp = {
  type: null as unknown as PropType<PopconfirmContent>,
  default: undefined
}

const iconProp = {
  type: null as unknown as PropType<PopconfirmRenderable>,
  default: undefined
}

export const popconfirmProps = {
  title: renderableProp,
  description: renderableProp,
  icon: iconProp,
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
  getPopupContainer: Function as PropType<PopconfirmGetPopupContainer>,
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
