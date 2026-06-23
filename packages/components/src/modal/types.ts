import type { CSSProperties, ExtractPropTypes, PropType, VNodeChild } from 'vue'
import type { ButtonProps, ButtonType } from '../button/types'
import type { GridBreakpoint } from '../grid/types'

export const modalSemanticParts = [
  'root',
  'mask',
  'wrap',
  'wrapper',
  'dialog',
  'container',
  'header',
  'title',
  'body',
  'footer',
  'close'
] as const

export type ModalSemanticPart = (typeof modalSemanticParts)[number]
export interface ModalSemanticInfo {
  props: Readonly<Record<string, unknown>>
}

export type ModalSemanticRecord<T> = Partial<Record<ModalSemanticPart, T>>
export type ModalSemanticConfig<T> = ModalSemanticRecord<T> | ((info: ModalSemanticInfo) => ModalSemanticRecord<T>)
export type ModalClassNames = ModalSemanticConfig<string>
export type ModalStyles = ModalSemanticConfig<CSSProperties>
export type ModalButtonProps = Partial<ButtonProps>
export type ModalRenderable = VNodeChild
export type ModalRender = (node: ModalRenderable) => ModalRenderable
export type ModalResponsiveWidth = Partial<Record<GridBreakpoint, number | string>>
export type ModalWidth = number | string | ModalResponsiveWidth

export interface ModalMaskConfig {
  enabled?: boolean
  blur?: boolean
  closable?: boolean
}

export type ModalMask = boolean | ModalMaskConfig

export interface ModalFocusableConfig {
  trap?: boolean
  focusTriggerAfterClose?: boolean
}

export interface ModalFooterRenderExtra {
  okButton: ModalRenderable
  cancelButton: ModalRenderable
  OkBtn: () => ModalRenderable
  CancelBtn: () => ModalRenderable
}

export type ModalFooterRender = (originNode: ModalRenderable, extra: ModalFooterRenderExtra) => ModalRenderable
export type ModalFooter = boolean | ModalRenderable | ModalFooterRender

export interface ModalClosableConfig {
  closeIcon?: ModalRenderable
  disabled?: boolean
  onClose?: () => void
  afterClose?: () => void
}

export type ModalClosable = boolean | ModalClosableConfig

export const modalProps = {
  open: Boolean,
  title: {
    type: null as unknown as PropType<ModalRenderable>,
    default: undefined
  },
  width: {
    type: [Number, String, Object] as PropType<ModalWidth>,
    default: 520
  },
  centered: Boolean,
  closable: {
    type: [Boolean, Object] as PropType<ModalClosable>,
    default: true
  },
  closeIcon: {
    type: null as unknown as PropType<ModalRenderable>,
    default: undefined
  },
  mask: {
    type: [Boolean, Object] as PropType<ModalMask>,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  confirmLoading: Boolean,
  okText: {
    type: null as unknown as PropType<ModalRenderable>,
    default: 'OK'
  },
  cancelText: {
    type: null as unknown as PropType<ModalRenderable>,
    default: 'Cancel'
  },
  okType: {
    type: String as PropType<ButtonType>,
    default: 'primary'
  },
  okButtonProps: Object as PropType<ModalButtonProps>,
  cancelButtonProps: Object as PropType<ModalButtonProps>,
  zIndex: {
    type: Number,
    default: 1000
  },
  loading: Boolean,
  footer: {
    type: [Boolean, String, Number, Object, Array, Function] as PropType<ModalFooter>,
    default: true
  },
  className: String,
  rootClassName: String,
  wrapClassName: String,
  modalRender: Function as PropType<ModalRender>,
  style: Object as PropType<CSSProperties>,
  rootStyle: Object as PropType<CSSProperties>,
  classNames: [Object, Function] as PropType<ModalClassNames>,
  styles: [Object, Function] as PropType<ModalStyles>,
  focusable: Object as PropType<ModalFocusableConfig>,
  focusTriggerAfterClose: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined
  },
  forceRender: Boolean,
  destroyOnClose: Boolean,
  destroyOnHidden: Boolean
} as const

export const modalEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  ok: () => true,
  cancel: () => true,
  close: () => true,
  afterOpenChange: (open: boolean) => typeof open === 'boolean',
  afterClose: () => true
}

export type ModalProps = ExtractPropTypes<typeof modalProps>
