import type { ExtractPropTypes, PropType } from 'vue'

export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading'

export interface MessageNotice {
  key: string
  type: MessageType
  content: string
  duration?: number
  onClose?: () => void
}

export interface MessageOpenConfig {
  key?: string
  type?: MessageType
  content: string
  duration?: number
  onClose?: () => void
}

export interface MessageGlobalConfig {
  top?: number | string
  duration?: number
  maxCount?: number
}

export type MessageContent = string | MessageOpenConfig

export const messageProps = {
  notices: {
    type: Array as PropType<MessageNotice[]>,
    default: () => []
  },
  top: {
    type: [Number, String] as PropType<number | string>,
    default: 8
  }
} as const

export const messageEmits = {
  close: (key: string) => typeof key === 'string'
}

export type MessageProps = ExtractPropTypes<typeof messageProps>
