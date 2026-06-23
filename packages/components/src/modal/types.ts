import type { CSSProperties, ExtractPropTypes, PropType, VNodeChild } from 'vue'
import type { ButtonProps, ButtonType } from '../button/types'

export const modalSemanticParts = ['root', 'mask', 'wrap', 'dialog', 'header', 'title', 'body', 'footer', 'close'] as const

export type ModalSemanticPart = (typeof modalSemanticParts)[number]
export type ModalClassNames = Partial<Record<ModalSemanticPart, string>>
export type ModalStyles = Partial<Record<ModalSemanticPart, CSSProperties>>
export type ModalButtonProps = Partial<ButtonProps>
export type ModalRenderable = VNodeChild
export type ModalRender = (node: ModalRenderable) => ModalRenderable

export interface ModalMaskConfig {
  enabled?: boolean
  blur?: boolean
  closable?: boolean
}

export type ModalMask = boolean | ModalMaskConfig

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
}

export type ModalClosable = boolean | ModalClosableConfig

export const modalProps = {
  open: Boolean,
  title: {
    type: null as unknown as PropType<ModalRenderable>,
    default: undefined
  },
  width: {
    type: [Number, String] as PropType<number | string>,
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
  classNames: Object as PropType<ModalClassNames>,
  styles: Object as PropType<ModalStyles>,
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
