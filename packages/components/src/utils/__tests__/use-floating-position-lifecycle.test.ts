import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { effectScope, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { autoUpdate as realAutoUpdate, computePosition } from '@floating-ui/dom'

vi.mock('@floating-ui/dom', async importOriginal => {
  const actual = await importOriginal<typeof import('@floating-ui/dom')>()
  return { ...actual, computePosition: vi.fn(actual.computePosition) }
})

const computePositionSpy = vi.mocked(computePosition)

// RED evidence is retained from ZtHhpE's iframe realm reobserveFrame cleanup
// residue: its ResizeObserver callback remained active across close/reopen.

type ResizeCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void

class ControlledResizeObserver {
  static instances: ControlledResizeObserver[] = []
  readonly callback: ResizeCallback
  readonly targets = new Set<Element>()
  disconnectCount = 0
  lastEntryTarget: Element | undefined

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

  emit(target: Element) {
    this.lastEntryTarget = target
    this.callback([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver)
  }
}

class MainResizeObserverSpy {
  static instances: MainResizeObserverSpy[] = []
  readonly callback: ResizeCallback

  constructor(callback: ResizeCallback) {
    this.callback = callback
    MainResizeObserverSpy.instances.push(this)
  }

  observe() {}
  unobserve() {}
  disconnect() {}
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

const originalWindowResizeObserver = Object.getOwnPropertyDescriptor(window, 'ResizeObserver')
const originalGlobalResizeObserver = Object.getOwnPropertyDescriptor(globalThis, 'ResizeObserver')

const createHarness = async ({ composable = false } = {}) => {
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
  MainResizeObserverSpy.instances = []
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, writable: true, value: MainResizeObserverSpy })
  Object.defineProperty(globalThis, 'ResizeObserver', { configurable: true, writable: true, value: MainResizeObserverSpy })
  const mainRaf = vi.spyOn(window, 'requestAnimationFrame')
  const module = await import('../use-floating-position')
  const scope = effectScope()
  const updates = vi.fn()
  const referenceRef = ref(reference)
  const floatingRef = ref(floating)
  const openRef = ref(true)
  const upstreamAutoUpdate = vi.fn((...args: Parameters<typeof realAutoUpdate>) => realAutoUpdate(...args))
  const cleanup = composable
    ? undefined
    : scope.run(() => module.createOwnerRealmAutoUpdate(
      reference,
      floating,
      updates,
      baseOptions,
      upstreamAutoUpdate
    ))
  const result = composable
    ? scope.run(() => module.useFloatingPosition({ reference: referenceRef, floating: floatingRef, open: openRef, autoUpdateOptions: baseOptions }))
    : undefined
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
    resizeObserver: () => ControlledResizeObserver.instances[0],
    upstreamAutoUpdate,
    result,
    referenceRef,
    floatingRef,
    openRef,
    mainResizeObserverInstances: () => MainResizeObserverSpy.instances
  }
}

afterEach(() => {
  document.body.innerHTML = ''
  if (originalWindowResizeObserver) Object.defineProperty(window, 'ResizeObserver', originalWindowResizeObserver)
  else delete (window as Window & { ResizeObserver?: typeof ResizeObserver }).ResizeObserver
  if (originalGlobalResizeObserver) Object.defineProperty(globalThis, 'ResizeObserver', originalGlobalResizeObserver)
  else delete (globalThis as typeof globalThis & { ResizeObserver?: typeof ResizeObserver }).ResizeObserver
  computePositionSpy.mockClear()
  vi.restoreAllMocks()
})

describe('useFloatingPosition owner-realm auto-update lifecycle', () => {
  it('disables upstream elementResize and coalesces iframe ResizeObserver callbacks on owner RAF', async () => {
    const harness = await createHarness()
    const observer = harness.resizeObserver()
    expect(observer).toBeDefined()
    expect(observer.targets.has(harness.reference)).toBe(true)
    expect(observer.targets.has(harness.floating)).toBe(true)
    observer.emit(harness.reference)
    expect(observer.lastEntryTarget).toBe(harness.reference)
    observer.emit(harness.floating)
    expect(observer.lastEntryTarget).toBe(harness.floating)
    expect(ControlledResizeObserver.instances).toHaveLength(1)
    expect(harness.mainResizeObserverInstances()).toHaveLength(0)
    expect(harness.upstreamAutoUpdate).toHaveBeenCalledTimes(1)
    expect(harness.upstreamAutoUpdate.mock.calls[0]?.[3]).toMatchObject({ ...baseOptions, elementResize: false })

    const initialUpdates = harness.updates.mock.calls.length
    observer.emit(harness.reference)
    observer.emit(harness.floating)
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
    observer.emit(harness.reference)
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
    observer.emit(harness.reference)
    observer.emit(harness.floating)
    expect(harness.ownerRequestAnimationFrame).toHaveBeenCalledTimes(1)
    harness.runOwnerRaf()
    expect(harness.updates.mock.calls.length).toBe(initialUpdates + 1)
    observer.emit(harness.floating)
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
    firstObserver.emit(first.reference)
    const oldCallback = first.ownerRafQueue[0]?.callback
    first.cleanup()
    const second = await createHarness()
    const secondObserver = ControlledResizeObserver.instances.at(-1)
    const firstUpdates = first.updates.mock.calls.length
    const secondUpdates = second.updates.mock.calls.length
    oldCallback?.(0)
    expect(first.updates).toHaveBeenCalledTimes(firstUpdates)
    expect(second.updates).toHaveBeenCalledTimes(secondUpdates)
    expect(secondObserver).toBeDefined()
    expect(secondObserver).not.toBe(firstObserver)
    second.cleanup()
    first.scope.stop()
    second.scope.stop()
  })

  it('wires useFloatingPosition watchEffect through the owner-realm helper', async () => {
    const source = await readFile(resolve(process.cwd(), 'src/utils/use-floating-position.ts'), 'utf8')
    expect(source).toMatch(/watchEffect[\s\S]*createOwnerRealmAutoUpdate/)
    expect(source).toMatch(/createOwnerRealmAutoUpdate\([\s\S]*options\.autoUpdateOptions/)
  })

  it('cleans and reopens the production composable on the same iframe refs', async () => {
    const harness = await createHarness({ composable: true })
    const firstObserver = harness.resizeObserver()
    expect(firstObserver).toBeDefined()
    expect(ControlledResizeObserver.instances).toHaveLength(1)
    firstObserver.emit(harness.reference)
    const oldCallback = harness.ownerRafQueue[0]?.callback
    expect(oldCallback).toBeDefined()
    const computeCallsBeforeClose = computePositionSpy.mock.calls.length

    harness.openRef.value = false
    await flushVue()
    expect(harness.ownerCancelAnimationFrame).toHaveBeenCalledTimes(1)
    expect(firstObserver.disconnectCount).toBe(1)
    const queueBeforeStaleCallback = harness.ownerRafQueue.length
    const styleAfterClose = structuredClone(harness.result?.popupStyle.value)
    oldCallback?.(0)
    await flushVue()
    expect(harness.ownerRafQueue.length).toBe(queueBeforeStaleCallback)
    expect(harness.result?.popupStyle.value).toEqual(styleAfterClose)
    expect(computePositionSpy.mock.calls.length).toBe(computeCallsBeforeClose)

    harness.openRef.value = true
    await flushVue()
    expect(ControlledResizeObserver.instances).toHaveLength(2)
    const secondObserver = ControlledResizeObserver.instances[1]
    expect(secondObserver).toBeDefined()
    oldCallback?.(0)
    expect(harness.ownerRafQueue.length).toBe(0)
    const computeCallsBeforeReopenedResize = computePositionSpy.mock.calls.length
    secondObserver.emit(harness.reference)
    expect(harness.ownerRafQueue).toHaveLength(1)
    harness.runOwnerRaf()
    await flushVue()
    expect(computePositionSpy.mock.calls.length).toBeGreaterThan(computeCallsBeforeReopenedResize)

    secondObserver.emit(harness.floating)
    expect(harness.ownerRafQueue).toHaveLength(1)
    harness.scope.stop()
    expect(harness.ownerCancelAnimationFrame).toHaveBeenCalledTimes(2)
    expect(secondObserver.disconnectCount).toBe(1)
    expect(harness.ownerRafQueue).toHaveLength(0)
  })
})
