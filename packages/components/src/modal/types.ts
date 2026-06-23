import type { CSSProperties, ExtractPropTypes, PropType, VNodeChild } from 'vue'
import type { ButtonProps, ButtonType } from '../button/types'

export const modalSemanticParts = ['root', 'mask', 'wrap', 'dialog', 'header', 'title', 'body', 'footer', 'close'] as const

export type ModalSemanticPart = (typeof modalSemanticParts)[number]
export type ModalClassNames = Partial<Record<ModalSemanticPart, string>>
export type ModalStyles = Partial<Record<ModalSemanticPart, CSSProperties>>
export type ModalButtonProps = Partial<ButtonProps>
export type ModalRenderable = VNodeChild

export interface ModalClosableConfig {
  closeIcon?: ModalRenderable
  disabled?: boolean
}

export type ModalClosable = boolean | ModalClosableConfig

export const modalProps = {
  open: Boolean,
  title: String,
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
    type: Boolean,
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
  okButtonProps: Object as PropType<ModalButtonProps>,
  cancelButtonProps: Object as PropType<ModalButtonProps>,
  zIndex: {
    type: Number,
    default: 1000
  },
  loading: Boolean,
  footer: {
    type: Boolean,
    default: true
  },
  className: String,
  rootClassName: String,
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
  afterOpenChange: (open: boolean) => typeof open === 'boolean'
}

export type ModalProps = ExtractPropTypes<typeof modalProps>
