import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading'
export type MessageKey = string | number
export type MessageContentNode = VNodeChild
export type MessageStackConfig = boolean | { threshold: number }
export type MessageSemanticPart = 'root' | 'notice' | 'icon' | 'content' | 'close'
export type MessageClassNames = Partial<Record<MessageSemanticPart, string>>
export type MessageStyles = Partial<Record<MessageSemanticPart, StyleValue>>

export interface MessageNotice {
  key: MessageKey
  type: MessageType
  content: MessageContentNode
  duration?: number
  className?: string
  style?: StyleValue
  icon?: MessageContentNode
  closable?: boolean
  closeIcon?: MessageContentNode
  onClick?: () => void
  onClose?: () => void
  pauseOnHover?: boolean
  classNames?: MessageClassNames
  styles?: MessageStyles
}

export interface MessageOpenConfig {
  key?: MessageKey
  type?: MessageType
  content: MessageContentNode
  duration?: number
  className?: string
  style?: StyleValue
  icon?: MessageContentNode
  closable?: boolean
  closeIcon?: MessageContentNode
  onClick?: () => void
  onClose?: () => void
  pauseOnHover?: boolean
  classNames?: MessageClassNames
  styles?: MessageStyles
}

export interface MessageGlobalConfig {
  top?: number | string
  duration?: number
  maxCount?: number
  stack?: MessageStackConfig
  getContainer?: () => HTMLElement
  prefixCls?: string
  rtl?: boolean
  pauseOnHover?: boolean
}

export type MessageContent = MessageContentNode | MessageOpenConfig

export const messageProps = {
  notices: {
    type: Array as PropType<MessageNotice[]>,
    default: () => []
  },
  top: {
    type: [Number, String] as PropType<number | string>,
    default: 8
  },
  prefixCls: String,
  rtl: Boolean,
  classNames: {
    type: Object as PropType<MessageClassNames>,
    default: () => ({})
  },
  styles: {
    type: Object as PropType<MessageStyles>,
    default: () => ({})
  },
  stack: {
    type: [Boolean, Object] as PropType<MessageStackConfig>,
    default: false
  }
} as const

export const messageEmits = {
  close: (key: MessageKey) => typeof key === 'string' || typeof key === 'number',
  noticeMouseEnter: (key: MessageKey) => typeof key === 'string' || typeof key === 'number',
  noticeMouseLeave: (key: MessageKey) => typeof key === 'string' || typeof key === 'number'
}

export type MessageProps = ExtractPropTypes<typeof messageProps>
