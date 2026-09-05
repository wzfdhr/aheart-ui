export interface OverlayRegistration {
  id: symbol
  document?: Document
  getTrigger?: () => Element | null | undefined
  getContent?: () => Element | null | undefined
  escapeEnabled?: boolean | (() => boolean)
  getBaseZIndex?: () => number
  onZIndexChange?: (zIndex: number) => void
  onEscape?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerEvent) => void
}

interface OverlayRecord extends OverlayRegistration {
  document: Document
}

const records = new WeakMap<Document, OverlayRecord[]>()
const listeners = new WeakMap<Document, { keydown: (event: KeyboardEvent) => void; pointerdown: (event: PointerEvent) => void }>()
const locks = new WeakMap<Document, { count: number; overflow: string; paddingRight: string }>()
const recentPointerTargets = new WeakMap<Document, { target: Element; recordedAt: number }>()
const INTERACTIVE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

const getRecords = (ownerDocument: Document) => {
  let value = records.get(ownerDocument)
  if (!value) {
    value = []
    records.set(ownerDocument, value)
  }
  return value
}

const isEscapeEnabled = (record: OverlayRecord) =>
  typeof record.escapeEnabled === 'function' ? record.escapeEnabled() : record.escapeEnabled !== false

const getElement = (getter: (() => Element | null | undefined) | undefined) => getter?.() ?? null

export const getRecentPointerTarget = (ownerDocument: Document = document, maxAge = 500) => {
  const recent = recentPointerTargets.get(ownerDocument)
  return recent && Date.now() - recent.recordedAt <= maxAge ? recent.target : null
}

export const refreshOverlayStack = (ownerDocument: Document = document) => {
  let previousZIndex = Number.NEGATIVE_INFINITY

  for (const record of getRecords(ownerDocument)) {
    if (!record.onZIndexChange) continue
    const baseZIndex = record.getBaseZIndex?.() ?? 0
    const zIndex = Number.isFinite(previousZIndex) ? Math.max(baseZIndex, previousZIndex + 10) : baseZIndex
    record.onZIndexChange(zIndex)
    previousZIndex = zIndex
  }
}

const containsTarget = (record: OverlayRecord, targets: readonly EventTarget[]) => {
  const NodeConstructor = record.document.defaultView?.Node
  return targets.some((target) =>
    Boolean(
      NodeConstructor &&
      target instanceof NodeConstructor &&
      [getElement(record.getTrigger), getElement(record.getContent)].some((element) => element?.contains(target))
    )
  )
}

/** True when target is in this overlay or in an overlay opened from its content. */
export const isTargetInOverlayTree = (
  id: symbol,
  target: EventTarget | null | readonly EventTarget[],
  ownerDocument: Document = document
) => {
  const stack = getRecords(ownerDocument)
  const record = stack.find((entry) => entry.id === id)
  if (!record) return false
  const targets = Array.isArray(target) ? target : [target]
  if (containsTarget(record, targets)) return true

  const getParent = (child: OverlayRecord) => {
    const childIndex = stack.indexOf(child)
    const childTrigger = getElement(child.getTrigger)
    const childContent = getElement(child.getContent)

    for (let index = childIndex - 1; index >= 0; index -= 1) {
      const candidate = stack[index]
      const candidateContent = getElement(candidate.getContent)
      if (candidateContent && (candidateContent.contains(childTrigger) || candidateContent.contains(childContent))) {
        return candidate
      }
    }
  }

  return stack.some((candidate) => {
    if (candidate.id === id || !containsTarget(candidate, targets)) return false
    const visited = new Set<symbol>()
    let parent = getParent(candidate)

    while (parent && !visited.has(parent.id)) {
      if (parent.id === id) return true
      visited.add(parent.id)
      parent = getParent(parent)
    }

    return false
  })
}

const ensureListeners = (ownerDocument: Document) => {
  if (listeners.has(ownerDocument)) return
  const keydown = (event: KeyboardEvent) => {
    recentPointerTargets.delete(ownerDocument)
    if (event.key !== 'Escape') return
    const stack = getRecords(ownerDocument)
    const top = stack[stack.length - 1]
    if (!top) return
    event.preventDefault()
    event.stopPropagation()
    if (isEscapeEnabled(top)) top.onEscape?.(event)
  }
  const pointerdown = (event: PointerEvent) => {
    const ElementConstructor = ownerDocument.defaultView?.Element
    const pathTarget = (event.composedPath?.() ?? [event.target]).find(
      (target) => ElementConstructor && target instanceof ElementConstructor
    )
    const pathElement = ElementConstructor && pathTarget instanceof ElementConstructor ? pathTarget as Element : null
    const pointerTarget = pathElement?.closest(INTERACTIVE_SELECTOR) ?? pathElement
    if (pointerTarget) recentPointerTargets.set(ownerDocument, { target: pointerTarget, recordedAt: Date.now() })
    const stack = getRecords(ownerDocument)
    const top = stack[stack.length - 1]
    const path = event.composedPath?.() ?? [event.target]
    if (!top || !top.onPointerDownOutside || isTargetInOverlayTree(top.id, path, ownerDocument)) return
    top.onPointerDownOutside(event)
  }
  ownerDocument.addEventListener('keydown', keydown, true)
  ownerDocument.addEventListener('pointerdown', pointerdown, true)
  listeners.set(ownerDocument, { keydown, pointerdown })
}

/** Installs the lightweight input tracker before a closed blocking overlay is opened. */
export const prepareOverlayDocument = (ownerDocument: Document = document) => {
  ensureListeners(ownerDocument)
}

export const registerOverlay = (registration: OverlayRegistration) => {
  const ownerDocument = registration.document ?? document
  const stack = getRecords(ownerDocument)
  const existing = stack.findIndex((entry) => entry.id === registration.id)
  if (existing >= 0) stack.splice(existing, 1)
  stack.push({ ...registration, document: ownerDocument })
  refreshOverlayStack(ownerDocument)
  ensureListeners(ownerDocument)

  return () => unregisterOverlay(registration.id, ownerDocument)
}

export const updateOverlay = (id: symbol, patch: Partial<Omit<OverlayRegistration, 'id' | 'document'>>, ownerDocument: Document = document) => {
  const record = getRecords(ownerDocument).find((entry) => entry.id === id)
  if (record) {
    Object.assign(record, patch)
    refreshOverlayStack(ownerDocument)
  }
}

export const unregisterOverlay = (id: symbol, ownerDocument: Document = document) => {
  const stack = getRecords(ownerDocument)
  const index = stack.findIndex((entry) => entry.id === id)
  if (index >= 0) stack.splice(index, 1)
  refreshOverlayStack(ownerDocument)

  if (stack.length === 0) {
    records.delete(ownerDocument)
  }
}

export const isTopmost = (id: symbol, ownerDocument: Document = document) => {
  const stack = getRecords(ownerDocument)
  return stack[stack.length - 1]?.id === id
}

export const lockBodyScroll = (ownerDocument: Document = document) => {
  const body = ownerDocument.body
  if (!body) return
  const state = locks.get(ownerDocument)
  if (state) {
    state.count += 1
    return
  }
  const paddingRight = body.style.paddingRight
  const viewportWidth = ownerDocument.defaultView?.innerWidth ?? 0
  const contentWidth = ownerDocument.documentElement.clientWidth
  const scrollbarWidth = contentWidth > 0 ? Math.max(0, viewportWidth - contentWidth) : 0
  locks.set(ownerDocument, { count: 1, overflow: body.style.overflow, paddingRight })

  if (scrollbarWidth > 0) {
    const currentPadding = Number.parseFloat(ownerDocument.defaultView?.getComputedStyle(body).paddingRight ?? '0') || 0
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
  }
  body.style.overflow = 'hidden'
}

export const unlockBodyScroll = (ownerDocument: Document = document) => {
  const state = locks.get(ownerDocument)
  if (!state) return
  state.count -= 1
  if (state.count > 0) return
  if (ownerDocument.body) {
    ownerDocument.body.style.overflow = state.overflow
    ownerDocument.body.style.paddingRight = state.paddingRight
  }
  locks.delete(ownerDocument)
}
