import type { DragData, KeyboardDragCancelEvent, KeyboardDragEvent, KeyboardDropEvent } from './types'
import { acquireDndLiveRegion, announceDnd, disposeDndLiveRegion } from './dnd-announcer'

type Registration = {
  element: HTMLElement
  getData: () => DragData
  getLabel: () => string
  getScope: () => string | number | undefined
  isDisabled: () => boolean
  accepts?: (data: DragData) => boolean
  onGrab: (event: KeyboardDragEvent) => void
  onCancel?: (event: KeyboardDragCancelEvent) => void
  onDrop?: (data: DragData, event: KeyboardDropEvent) => void
  kind?: 'source' | 'zone'
}
type Session = Registration & { sessionId: string; data: DragData; sourceLabel: string; sourceScope?: string | number; sourceElement: HTMLElement }

const sessions = new WeakMap<Document, Session | undefined>()
const registrations = new WeakMap<Document, Set<Registration>>()
let sessionCounter = 0

const rootKey = (event: KeyboardEvent) => event.target === event.currentTarget && (event.key === ' ' || event.key === 'Enter')
const compatible = (session: Session, zone: Registration) => (
  !zone.isDisabled() && (!zone.accepts || zone.accepts(session.data)) && zone.getScope() === session.sourceScope
)

function updateKeyboardState(ownerDocument: Document) {
  const session = sessions.get(ownerDocument)
  for (const registration of registrations.get(ownerDocument) ?? []) {
    if (registration.kind === 'source') {
      registration.element.classList.toggle('aheart-dnd-keyboard-grabbed', Boolean(session?.element === registration.element))
      registration.element.dataset.aheartDndKeyboardState = session?.element === registration.element ? 'grabbed' : 'idle'
      registration.element.setAttribute('aria-pressed', session?.element === registration.element ? 'true' : 'false')
    } else {
      const isCompatible = Boolean(session && compatible(session, registration))
      registration.element.classList.toggle('aheart-dnd-keyboard-compatible', isCompatible)
      registration.element.dataset.aheartDndKeyboardState = session ? (isCompatible ? 'compatible' : 'incompatible') : 'idle'
      registration.element.setAttribute('aria-dropeffect', session ? (isCompatible ? 'move' : 'none') : 'none')
    }
  }
}

function makeSessionId() {
  return `aheart-keyboard-${Date.now().toString(36)}-${(++sessionCounter).toString(36)}`
}

function cancel(ownerDocument: Document, reason: KeyboardDragCancelEvent['reason']) {
  const session = sessions.get(ownerDocument)
  if (!session) return
  sessions.set(ownerDocument, undefined)
  updateKeyboardState(ownerDocument)
  session.onCancel?.({
    sessionId: session.sessionId,
    data: session.data,
    source: { label: session.sourceLabel, scopeKey: session.sourceScope },
    reason
  })
  if (reason !== 'owner-detached' && session.sourceElement.isConnected) session.sourceElement.focus({ preventScroll: true })
}

function ensureDocumentListeners(ownerDocument: Document) {
  const win = ownerDocument.defaultView
  const frameElement = win?.frameElement
  let interruptionTimer: number | undefined
  const deferInterruption = () => {
    if (!win) { cancel(ownerDocument, 'page-hidden'); return }
    if (interruptionTimer !== undefined) return
    interruptionTimer = win.setTimeout(() => {
      interruptionTimer = undefined
      if (!sessions.get(ownerDocument)) return
      cancel(ownerDocument, frameElement && !frameElement.isConnected ? 'owner-detached' : 'page-hidden')
    }, 0)
  }
  const keydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') cancel(ownerDocument, 'cancelled')
  }
  const visibility = () => { if (ownerDocument.visibilityState === 'hidden') deferInterruption() }
  const pagehide = () => deferInterruption()
  ownerDocument.addEventListener('keydown', keydown, true)
  ownerDocument.addEventListener('visibilitychange', visibility)
  win?.addEventListener('pagehide', pagehide)
  let frameObserver: MutationObserver | undefined
  const ParentObserver = frameElement?.ownerDocument.defaultView?.MutationObserver
  if (frameElement && ParentObserver) {
    frameObserver = new ParentObserver(() => {
      if (!frameElement.isConnected) {
        cancel(ownerDocument, 'owner-detached')
        documentCleanup.get(ownerDocument)?.()
        for (const release of liveReleases.get(ownerDocument) ?? []) release()
        disposeDndLiveRegion(ownerDocument)
        liveReleases.delete(ownerDocument)
        registrations.get(ownerDocument)?.clear()
        registrations.delete(ownerDocument)
        documentCleanup.delete(ownerDocument)
      }
    })
    frameObserver.observe(frameElement.ownerDocument, { childList: true, subtree: true })
  }
  return () => {
    if (interruptionTimer !== undefined) win?.clearTimeout(interruptionTimer)
    interruptionTimer = undefined
    ownerDocument.removeEventListener('keydown', keydown, true)
    ownerDocument.removeEventListener('visibilitychange', visibility)
    win?.removeEventListener('pagehide', pagehide)
    frameObserver?.disconnect()
  }
}

const documentCleanup = new WeakMap<Document, () => void>()
const liveReleases = new WeakMap<Document, Set<() => void>>()

function register(registration: Registration, kind: 'source' | 'zone') {
  const ownerDocument = registration.element.ownerDocument
  let set = registrations.get(ownerDocument)
  if (!set) {
    set = new Set()
    registrations.set(ownerDocument, set)
    documentCleanup.set(ownerDocument, ensureDocumentListeners(ownerDocument))
  }
  set.add(registration)
  const releaseLiveRegion = acquireDndLiveRegion(ownerDocument)
  let releases = liveReleases.get(ownerDocument)
  if (!releases) { releases = new Set(); liveReleases.set(ownerDocument, releases) }
  releases.add(releaseLiveRegion)
  const keydown = (event: KeyboardEvent) => {
    if (!rootKey(event)) return
    if (registration.isDisabled()) {
      announceDnd(ownerDocument, kind === 'zone' ? '目标已禁用' : '项目已禁用')
      return
    }
    if (kind === 'source') {
      const current = sessions.get(ownerDocument)
      if (current) cancel(ownerDocument, 'replaced')
      const data = { ...registration.getData() }
      const session: Session = {
        ...registration,
        sessionId: makeSessionId(),
        data,
        sourceLabel: registration.getLabel(),
        sourceScope: registration.getScope(),
        sourceElement: registration.element
      }
      sessions.set(ownerDocument, session)
      updateKeyboardState(ownerDocument)
      event.preventDefault()
      const payload = { sessionId: session.sessionId, data, source: { label: session.sourceLabel, scopeKey: session.sourceScope } }
      registration.onGrab(payload)
      announceDnd(ownerDocument, `${session.sourceLabel}，已抓取`)
      return
    }
    const session = sessions.get(ownerDocument)
    if (!session) {
      announceDnd(ownerDocument, `${registration.getLabel()}，没有可放置的项目`)
      return
    }
    event.preventDefault()
    const reason = registration.isDisabled()
      ? '目标已禁用'
      : registration.getScope() !== session.sourceScope
        ? '目标不在当前页面'
        : registration.accepts && !registration.accepts(session.data)
          ? '类型不匹配，拒绝放置'
          : undefined
    if (reason) {
      announceDnd(ownerDocument, reason)
      return
    }
    sessions.set(ownerDocument, undefined)
    updateKeyboardState(ownerDocument)
    const payload: KeyboardDropEvent = {
      sessionId: session.sessionId,
      data: session.data,
      source: { label: session.sourceLabel, scopeKey: session.sourceScope },
      target: { label: registration.getLabel(), scopeKey: registration.getScope() }
    }
    registration.onDrop?.(session.data, payload)
    announceDnd(ownerDocument, `${session.sourceLabel}，已放置到${registration.getLabel()}`)
  }
  registration.element.addEventListener('keydown', keydown)
  const focus = () => {
    if (kind !== 'zone') return
    const session = sessions.get(ownerDocument)
    if (!session) return
    announceDnd(ownerDocument, compatible(session, registration) ? `${registration.getLabel()}，可放置` : `${registration.getLabel()}，类型不匹配`)
  }
  registration.element.addEventListener('focus', focus)
  return () => {
    const current = sessions.get(ownerDocument)
    if (current?.element === registration.element) cancel(ownerDocument, 'unmounted')
    registration.element.removeEventListener('keydown', keydown)
    registration.element.removeEventListener('focus', focus)
    releaseLiveRegion()
    liveReleases.get(ownerDocument)?.delete(releaseLiveRegion)
    set!.delete(registration)
    updateKeyboardState(ownerDocument)
    if (set!.size === 0) {
      documentCleanup.get(ownerDocument)?.()
      documentCleanup.delete(ownerDocument)
      registrations.delete(ownerDocument)
    }
  }
}

export function registerKeyboardSource(registration: Omit<Registration, 'accepts' | 'onDrop'>) {
  return register({ ...registration, kind: 'source' }, 'source')
}

export function registerKeyboardZone(registration: Registration) {
  return register({ ...registration, kind: 'zone' }, 'zone')
}

export function cancelKeyboardScope(ownerDocument: Document, scopeKey: string | number | undefined) {
  const session = sessions.get(ownerDocument)
  if (session && session.sourceScope !== scopeKey) cancel(ownerDocument, 'scope-changed')
}
