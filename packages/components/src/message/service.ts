import { createApp, h, shallowReactive, shallowRef, type App } from 'vue'
import MessageHost from './message.vue'
import type { MessageContent, MessageGlobalConfig, MessageKey, MessageNotice, MessageOpenConfig, MessageStackConfig, MessageType } from './types'

interface MessageState {
  top: number | string
  duration: number
  maxCount?: number
  stack?: MessageStackConfig
  getContainer?: () => HTMLElement
  prefixCls?: string
  rtl: boolean
  pauseOnHover: boolean
}

export interface MessageHandle {
  key: MessageKey
  close: () => void
  then: Promise<void>['then']
}

const state = shallowReactive<MessageState>({
  top: 8,
  duration: 3,
  rtl: false,
  pauseOnHover: true
})
const notices = shallowRef<MessageNotice[]>([])

let app: App<Element> | undefined
let container: HTMLDivElement | undefined
let hostContainer: HTMLElement | undefined
let seed = 0
const timers = new Map<string, ReturnType<typeof setTimeout>>()
const timerMeta = new Map<string, { start: number; remaining: number }>()
const closeResolvers = new Map<string, Array<() => void>>()

const normalizeTop = (top: number | string | undefined) => top ?? state.top

const stringifyKey = (key: MessageKey) => `${typeof key}:${String(key)}`
const getTargetContainer = () => state.getContainer?.() ?? document.body

const unmountHost = () => {
  if (app) {
    app.unmount()
    app = undefined
  }

  if (container?.parentNode) {
    container.parentNode.removeChild(container)
  }

  container = undefined
  hostContainer = undefined
}

const ensureHost = () => {
  if (typeof document === 'undefined') {
    return
  }

  const targetContainer = getTargetContainer()

  if (app && container && hostContainer === targetContainer) {
    return
  }

  if (app || container) {
    unmountHost()
  }

  container = document.createElement('div')
  container.className = 'aheart-message-root'
  targetContainer.appendChild(container)
  hostContainer = targetContainer
  app = createApp({
    render() {
      return h(MessageHost, {
        notices: notices.value,
        top: state.top,
        prefixCls: state.prefixCls,
        rtl: state.rtl,
        stack: state.stack,
        onClose: closeNotice,
        onNoticeMouseEnter: pauseNotice,
        onNoticeMouseLeave: resumeNotice
      })
    }
  })
  app.mount(container)
}

const nextKey = () => `aheart-message-${Date.now()}-${seed++}`

const isMessageOpenConfig = (value: MessageContent): value is MessageOpenConfig => {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && 'content' in value)
}

const normalizeArgs = (
  type: MessageType,
  contentOrConfig: MessageContent,
  duration?: number,
  onClose?: () => void
): MessageOpenConfig => {
  if (!isMessageOpenConfig(contentOrConfig)) {
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

  timerMeta.delete(key)
}

const scheduleClose = (notice: MessageNotice) => {
  const key = stringifyKey(notice.key)
  clearTimer(key)

  if (notice.duration === 0) {
    return
  }

  const remaining = (notice.duration ?? state.duration) * 1000
  timerMeta.set(key, {
    start: Date.now(),
    remaining
  })
  timers.set(
    key,
    setTimeout(() => {
      closeNotice(notice.key)
    }, remaining)
  )
}

const resolveClose = (key: string) => {
  const resolvers = closeResolvers.get(key)

  if (!resolvers) {
    return
  }

  resolvers.forEach((resolve) => resolve())
  closeResolvers.delete(key)
}

const closeNotice = (key: MessageKey) => {
  const notice = notices.value.find((item) => item.key === key)
  const normalizedKey = stringifyKey(key)
  clearTimer(normalizedKey)
  notices.value = notices.value.filter((item) => item.key !== key)
  notice?.onClose?.()
  resolveClose(normalizedKey)
}

const pauseNotice = (key: MessageKey) => {
  const normalizedKey = stringifyKey(key)
  const notice = notices.value.find((item) => item.key === key)

  if (!notice || !notice.pauseOnHover) {
    return
  }

  const meta = timerMeta.get(normalizedKey)
  const timer = timers.get(normalizedKey)

  if (!meta || !timer) {
    return
  }

  clearTimeout(timer)
  timers.delete(normalizedKey)
  meta.remaining = Math.max(0, meta.remaining - (Date.now() - meta.start))
  timerMeta.set(normalizedKey, meta)
}

const resumeNotice = (key: MessageKey) => {
  const normalizedKey = stringifyKey(key)
  const notice = notices.value.find((item) => item.key === key)
  const meta = timerMeta.get(normalizedKey)

  if (!notice || !notice.pauseOnHover || !meta || timers.has(normalizedKey)) {
    return
  }

  meta.start = Date.now()
  timers.set(
    normalizedKey,
    setTimeout(() => {
      closeNotice(key)
    }, meta.remaining)
  )
}

const open = (contentOrConfig: MessageContent, duration?: number, onClose?: () => void): MessageHandle => {
  const config = normalizeArgs('info', contentOrConfig, duration, onClose)
  const key = config.key ?? nextKey()
  const normalizedKey = stringifyKey(key)
  let resolveClosePromise: () => void
  const closePromise = new Promise<void>((resolve) => {
    resolveClosePromise = resolve
  })
  const notice: MessageNotice = {
    key,
    type: config.type ?? 'info',
    content: config.content,
    duration: config.duration ?? state.duration,
    className: config.className,
    style: config.style,
    icon: config.icon,
    closable: config.closable,
    closeIcon: config.closeIcon,
    onClick: config.onClick,
    onClose: config.onClose,
    pauseOnHover: config.pauseOnHover ?? state.pauseOnHover,
    classNames: config.classNames,
    styles: config.styles
  }
  const nextNotices = notices.value.slice()
  const existingIndex = nextNotices.findIndex((item) => item.key === key)

  ensureHost()

  if (existingIndex >= 0) {
    nextNotices.splice(existingIndex, 1, notice)
  } else {
    nextNotices.push(notice)
  }

  if (state.maxCount && nextNotices.length > state.maxCount) {
    const removed = nextNotices.splice(0, nextNotices.length - state.maxCount)
    removed.forEach((item) => {
      const removedKey = stringifyKey(item.key)
      clearTimer(removedKey)
      resolveClose(removedKey)
    })
  }

  notices.value = nextNotices
  closeResolvers.set(normalizedKey, [...(closeResolvers.get(normalizedKey) ?? []), resolveClosePromise!])
  scheduleClose(notice)

  return {
    key,
    close: () => closeNotice(key),
    then: closePromise.then.bind(closePromise)
  }
}

const typedOpen = (type: MessageType) => (contentOrConfig: MessageContent, duration?: number, onClose?: () => void) => {
  const config = normalizeArgs(type, contentOrConfig, duration, onClose)
  return open(config)
}

const destroy = (key?: MessageKey) => {
  if (key !== undefined) {
    closeNotice(key)
    return
  }

  Array.from(timers.keys()).forEach(clearTimer)
  Array.from(closeResolvers.keys()).forEach(resolveClose)
  notices.value = []
  state.top = 8
  state.duration = 3
  state.maxCount = undefined
  state.stack = undefined
  state.getContainer = undefined
  state.prefixCls = undefined
  state.rtl = false
  state.pauseOnHover = true
  unmountHost()
}

const config = (options: MessageGlobalConfig) => {
  const previousContainer = hostContainer

  if (options.top !== undefined) {
    state.top = normalizeTop(options.top)
  }

  if (options.duration !== undefined) {
    state.duration = options.duration
  }

  if (options.maxCount !== undefined) {
    state.maxCount = options.maxCount
  }

  if (options.stack !== undefined) {
    state.stack = options.stack
  }

  if (options.getContainer !== undefined) {
    state.getContainer = options.getContainer
  }

  if (options.prefixCls !== undefined) {
    state.prefixCls = options.prefixCls
  }

  if (options.rtl !== undefined) {
    state.rtl = options.rtl
  }

  if (options.pauseOnHover !== undefined) {
    state.pauseOnHover = options.pauseOnHover
  }

  if (typeof document !== 'undefined' && previousContainer && previousContainer !== getTargetContainer()) {
    ensureHost()
  }
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
