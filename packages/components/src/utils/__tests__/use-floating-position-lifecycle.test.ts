import { effectScope, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

// RED evidence is retained from ZtHhpE's real iframe owner-realm reproduction:
// the popup updated through the parent realm while the iframe ResizeObserver
// callback remained alive after close/reopen.

type ResizeCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void

class ControlledResizeObserver {
  static instances: ControlledResizeObserver[] = []
  readonly callback: ResizeCallback
  readonly targets = new Set<Element>()
  disconnectCount = 0

  constructor(callback: ResizeCallback) {
    this.callback = callback
    ControlledResizeObserver.instances.push(this)
  }

  observe(target: Element) {
    this.targets.add(target)
  }

  unobserve(target: Element) {
    this.targets.delete(target)
  }

  disconnect() {
    this.disconnectCount += 1
    this.targets.clear()
  }

  emit() {
    this.callback([], this as unknown as ResizeObserver)
  }
}

type OwnerRaf = { handle: number; callback: FrameRequestCallback }

const baseOptions = {
  ancestorScroll: false,
  ancestorResize: false,
  layoutShift: false,
  animationFrame: false
} as const

const flushVue = async () => {
  await nextTick()
  await Promise.resolve()
  await Promise.resolve()
}

const createHarness = async () => {
  const frame = document.createElement('iframe')
  document.body.appendChild(frame)
  const ownerWindow = frame.contentWindow
  const ownerDocument = frame.contentDocument
  if (!ownerWindow || !ownerDocument) throw new Error('iframe owner realm is unavailable')

  const reference = ownerDocument.createElement('button')
  const floating = ownerDocument.createElement('div')
  ownerDocument.body.append(reference, floating)
  const ownerRafQueue: OwnerRaf[] = []
  let nextHandle = 1
  const ownerRequestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    const item = { handle: nextHandle++, callback }
    ownerRafQueue.push(item)
    return item.handle
  })
  const ownerCancelAnimationFrame = vi.fn((handle: number) => {
    const index = ownerRafQueue.findIndex(item => item.handle === handle)
    if (index >= 0) ownerRafQueue.splice(index, 1)
  })
  Object.defineProperty(ownerWindow, 'requestAnimationFrame', { configurable: true, writable: true, value: ownerRequestAnimationFrame })
  Object.defineProperty(ownerWindow, 'cancelAnimationFrame', { configurable: true, writable: true, value: ownerCancelAnimationFrame })
  Object.defineProperty(ownerWindow, 'ResizeObserver', { configurable: true, writable: true, value: ControlledResizeObserver })
  ControlledResizeObserver.instances = []
  const mainRaf = vi.spyOn(window, 'requestAnimationFrame')
  const module = await import('../use-floating-position')
  const scope = effectScope()
  const updates = vi.fn()
  const cleanup = scope.run(() => module.createOwnerRealmAutoUpdate(reference, floating, updates, baseOptions))
  await flushVue()

  const runOwnerRaf = () => {
    const pending = ownerRafQueue.splice(0)
    for (const item of pending) item.callback(0)
  }
  return {
    frame,
    ownerWindow,
    reference,
    floating,
    updates,
    cleanup,
    scope,
    mainRaf,
    ownerRafQueue,
    ownerRequestAnimationFrame,
    ownerCancelAnimationFrame,
    runOwnerRaf,
    resizeObserver: () => ControlledResizeObserver.instances[0]
  }
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('useFloatingPosition owner-realm auto-update lifecycle', () => {
  it('disables upstream elementResize and coalesces iframe ResizeObserver callbacks on owner RAF', async () => {
    const harness = await createHarness()
    const observer = harness.resizeObserver()
    expect(observer).toBeDefined()
    expect(observer.targets.has(harness.reference)).toBe(true)
    expect(observer.targets.has(harness.floating)).toBe(true)
    expect(ControlledResizeObserver.instances).toHaveLength(1)

    const initialUpdates = harness.updates.mock.calls.length
    observer.emit()
    observer.emit()
    expect(harness.ownerRequestAnimationFrame).toHaveBeenCalledTimes(1)
    expect(harness.mainRaf).not.toHaveBeenCalled()
    expect(harness.updates).toHaveBeenCalledTimes(initialUpdates)
    harness.runOwnerRaf()
    expect(harness.updates.mock.calls.length).toBe(initialUpdates + 1)
    harness.cleanup()
    harness.scope.stop()
  })

  it('cancels a pending owner RAF and disconnects RO without a stale callback update', async () => {
    const harness = await createHarness()
    const observer = harness.resizeObserver()
    observer.emit()
    const oldCallback = harness.ownerRafQueue[0]?.callback
    expect(oldCallback).toBeDefined()
    const updatesBeforeCleanup = harness.updates.mock.calls.length
    harness.cleanup()
    expect(harness.ownerCancelAnimationFrame).toHaveBeenCalledTimes(1)
    expect(observer.disconnectCount).toBe(1)
    oldCallback?.(0)
    expect(harness.updates).toHaveBeenCalledTimes(updatesBeforeCleanup)
    harness.scope.stop()
  })

  it('continues updating while alive and coalesces each callback burst to one RAF', async () => {
    const harness = await createHarness()
    const observer = harness.resizeObserver()
    const initialUpdates = harness.updates.mock.calls.length
    observer.emit()
    observer.emit()
    expect(harness.ownerRequestAnimationFrame).toHaveBeenCalledTimes(1)
    harness.runOwnerRaf()
    expect(harness.updates.mock.calls.length).toBe(initialUpdates + 1)
    observer.emit()
    expect(harness.ownerRequestAnimationFrame).toHaveBeenCalledTimes(2)
    harness.runOwnerRaf()
    expect(harness.updates.mock.calls.length).toBe(initialUpdates + 2)
    harness.cleanup()
    harness.scope.stop()
  })

  it('does not create a local ResizeObserver when elementResize is explicitly disabled', async () => {
    const frame = document.createElement('iframe')
    document.body.appendChild(frame)
    const ownerWindow = frame.contentWindow
    const ownerDocument = frame.contentDocument
    if (!ownerWindow || !ownerDocument) throw new Error('iframe owner realm is unavailable')
    Object.defineProperty(ownerWindow, 'ResizeObserver', { configurable: true, writable: true, value: ControlledResizeObserver })
    ControlledResizeObserver.instances = []
    const reference = ownerDocument.createElement('button')
    const floating = ownerDocument.createElement('div')
    ownerDocument.body.append(reference, floating)
    const module = await import('../use-floating-position')
    const cleanup = module.createOwnerRealmAutoUpdate(reference, floating, vi.fn(), { ...baseOptions, elementResize: false })
    expect(ControlledResizeObserver.instances).toHaveLength(0)
    cleanup()
  })

  it('isolates a reopened owner lifecycle from the old callback', async () => {
    const first = await createHarness()
    const firstObserver = first.resizeObserver()
    firstObserver.emit()
    const oldCallback = first.ownerRafQueue[0]?.callback
    first.cleanup()
    const second = await createHarness()
    const secondObserver = ControlledResizeObserver.instances.at(-1)
    const secondUpdates = second.updates.mock.calls.length
    oldCallback?.(0)
    expect(second.updates).toHaveBeenCalledTimes(secondUpdates)
    expect(secondObserver).toBeDefined()
    expect(secondObserver).not.toBe(firstObserver)
    second.cleanup()
    first.scope.stop()
    second.scope.stop()
  })
})
