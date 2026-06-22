import type { ExtractPropTypes, PropType } from 'vue'
import type { ButtonType } from '../button/types'

export const modalProps = {
  open: Boolean,
  title: String,
  width: {
    type: [Number, String] as PropType<number | string>,
    default: 520
  },
  centered: Boolean,
  closable: {
    type: Boolean,
    default: true
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
  footer: {
    type: Boolean,
    default: true
  },
  destroyOnClose: Boolean
} as const

export const modalEmits = {
  'update:open': (open: boolean) => typeof open === 'boolean',
  ok: () => true,
  cancel: () => true,
  close: () => true
}

export type ModalProps = ExtractPropTypes<typeof modalProps>
