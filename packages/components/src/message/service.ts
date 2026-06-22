import { createApp, h, reactive, type App } from 'vue'
import MessageHost from './message.vue'
import type { MessageContent, MessageGlobalConfig, MessageNotice, MessageOpenConfig, MessageType } from './types'

interface MessageState {
  notices: MessageNotice[]
  top: number | string
  duration: number
  maxCount?: number
}

export interface MessageHandle {
  key: string
  close: () => void
}

const state = reactive<MessageState>({
  notices: [],
  top: 8,
  duration: 3
})

let app: App<Element> | undefined
let container: HTMLDivElement | undefined
let seed = 0
const timers = new Map<string, ReturnType<typeof setTimeout>>()

const normalizeTop = (top: number | string | undefined) => top ?? state.top

const ensureHost = () => {
  if (typeof document === 'undefined') {
    return
  }

  if (app && container) {
    return
  }

  container = document.createElement('div')
  container.className = 'aheart-message-root'
  document.body.appendChild(container)
  app = createApp({
    render() {
      return h(MessageHost, {
        notices: state.notices,
        top: state.top,
        onClose: closeNotice
      })
    }
  })
  app.mount(container)
}

const nextKey = () => `aheart-message-${Date.now()}-${seed++}`

const normalizeArgs = (
  type: MessageType,
  contentOrConfig: MessageContent,
  duration?: number,
  onClose?: () => void
): MessageOpenConfig => {
  if (typeof contentOrConfig === 'string') {
    return {
      type,
      content: contentOrConfig,
      duration,
      onClose
    }
  }

  return {
    ...contentOrConfig,
    type: contentOrConfig.type ?? type,
    duration: contentOrConfig.duration ?? duration,
    onClose: contentOrConfig.onClose ?? onClose
  }
}

const clearTimer = (key: string) => {
  const timer = timers.get(key)

  if (timer) {
    clearTimeout(timer)
    timers.delete(key)
  }
}

const scheduleClose = (notice: MessageNotice) => {
  clearTimer(notice.key)

  if (notice.duration === 0) {
    return
  }

  timers.set(
    notice.key,
    setTimeout(() => {
      closeNotice(notice.key)
    }, (notice.duration ?? state.duration) * 1000)
  )
}

const closeNotice = (key: string) => {
  const notice = state.notices.find((item) => item.key === key)
  clearTimer(key)
  state.notices = state.notices.filter((item) => item.key !== key)
  notice?.onClose?.()
}

const open = (contentOrConfig: MessageContent, duration?: number, onClose?: () => void): MessageHandle => {
  const config = normalizeArgs('info', contentOrConfig, duration, onClose)
  const key = config.key ?? nextKey()
  const notice: MessageNotice = {
    key,
    type: config.type ?? 'info',
    content: config.content,
    duration: config.duration ?? state.duration,
    onClose: config.onClose
  }
  const existingIndex = state.notices.findIndex((item) => item.key === key)

  ensureHost()

  if (existingIndex >= 0) {
    state.notices.splice(existingIndex, 1, notice)
  } else {
    state.notices.push(notice)
  }

  if (state.maxCount && state.notices.length > state.maxCount) {
    const removed = state.notices.splice(0, state.notices.length - state.maxCount)
    removed.forEach((item) => clearTimer(item.key))
  }

  scheduleClose(notice)

  return {
    key,
    close: () => closeNotice(key)
  }
}

const typedOpen = (type: MessageType) => (contentOrConfig: MessageContent, duration?: number, onClose?: () => void) => {
  const config = normalizeArgs(type, contentOrConfig, duration, onClose)
  return open(config)
}

const destroy = (key?: string) => {
  if (key) {
    closeNotice(key)
    return
  }

  Array.from(timers.keys()).forEach(clearTimer)
  state.notices = []
  state.top = 8
  state.duration = 3
  state.maxCount = undefined
}

const config = (options: MessageGlobalConfig) => {
  if (options.top !== undefined) {
    state.top = normalizeTop(options.top)
  }

  if (options.duration !== undefined) {
    state.duration = options.duration
  }

  state.maxCount = options.maxCount
}

export const message = {
  open,
  success: typedOpen('success'),
  info: typedOpen('info'),
  warning: typedOpen('warning'),
  error: typedOpen('error'),
  loading: typedOpen('loading'),
  destroy,
  config
}
