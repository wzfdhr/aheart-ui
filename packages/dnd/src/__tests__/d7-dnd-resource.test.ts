import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Draggable from '../draggable.vue'
import DropZone from '../drop-zone.vue'
import SortableList from '../sortable-list.vue'
import { endDrag, startDrag } from '../drag-state'
import { registerSortableAutoScroll } from '../sortable-auto-scroll'
import { beginSortableSession, invalidateSortableScope, moveSortableItem, registerSortableList } from '../sortable-registry'

const cleanupFns = vi.hoisted(() => [] as Array<ReturnType<typeof vi.fn>>)
const adapter = vi.hoisted(() => ({
  draggable: vi.fn(() => { const cleanup = vi.fn(); cleanupFns.push(cleanup); return cleanup }),
  dropTargetForElements: vi.fn(() => { const cleanup = vi.fn(); cleanupFns.push(cleanup); return cleanup })
}))
const autoScroll = vi.hoisted(() => ({
  autoScrollForElements: vi.fn(() => vi.fn()),
  autoScrollWindowForElements: vi.fn(() => vi.fn())
}))

vi.mock('@atlaskit/pragmatic-drag-and-drop/element/adapter', () => adapter)
vi.mock('@atlaskit/pragmatic-drag-and-drop-auto-scroll/element', () => autoScroll)

beforeEach(() => { vi.clearAllMocks(); cleanupFns.length = 0 })
afterEach(() => {
  endDrag()
  document.querySelectorAll('.aheart-dnd-live-region').forEach((node) => node.remove())
  vi.restoreAllMocks()
})

const itemSlot = ({ item, handleProps }: { item: { id: string }; handleProps: Record<string, unknown> }) => h('div', [
  h('button', { ...handleProps, 'data-resource-handle': item.id }, 'drag'),
  h('span', item.id)
])
const dragConfigs = () => adapter.draggable.mock.calls.map(([config]) => config as any)
const dropConfigs = () => adapter.dropTargetForElements.mock.calls.map(([config]) => config as any)
const sourceConfig = (key = 'source') => dragConfigs().find((config) => config.getInitialData().itemKey === key || config.getInitialData().index === 0)
const targetConfig = (key = 'target') => dropConfigs().find((config) => {
  const data = config.getData()
  return data.itemKey === key || data.position?.itemKey === key
})

const touchEvent = (type: string, pointerId: number, x: number, y: number) => {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1 })
  Object.defineProperties(event, { pointerId: { value: pointerId }, pointerType: { value: 'touch' }, isPrimary: { value: true } })
  return event as PointerEvent
}

describe('D7 resource/lifecycle RED: late callbacks and snapshot fields', () => {
  it('ignores a late touch drop after pointercancel', async () => {
    const items = ref([{ id: 'source' }, { id: 'target' }])
    const updates = vi.fn((next: typeof items.value) => { items.value = next })
    const wrapper = mount(SortableList, { attachTo: document.body, props: { items: items.value, itemKey: 'id', 'onUpdate:items': updates }, slots: { item: itemSlot } })
    await nextTick()
    const sourceHandle = wrapper.get('[data-resource-handle="source"]').element
    const target = wrapper.get('[data-sortable-index="1"]').element
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => target })
    sourceHandle.dispatchEvent(touchEvent('pointerdown', 31, 10, 10))
    document.dispatchEvent(touchEvent('pointermove', 31, 10, 30))
    document.dispatchEvent(touchEvent('pointercancel', 31, 10, 30))
    document.dispatchEvent(touchEvent('pointerup', 31, 10, 40))
    await nextTick()
    expect(updates).not.toHaveBeenCalled()
    delete (document as Partial<Document>).elementFromPoint
    wrapper.unmount()
  })

  it('rejects a microtask-late target drop after a native source onDrop with no target', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const targetItems = ref([{ id: 'target' }])
    const sourceUpdates = vi.fn((next: typeof sourceItems.value) => { sourceItems.value = next })
    const targetUpdates = vi.fn((next: typeof targetItems.value) => { targetItems.value = next })
    const Host = defineComponent({ setup: () => () => h('div', [
      h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': sourceUpdates }),
      h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': targetUpdates })
    ]) })
    const wrapper = mount(Host)
    await nextTick()
    const source = sourceConfig()!
    source.onDragStart()
    const sourceData = source.getInitialData()
    source.onDrop()
    await Promise.resolve()
    targetConfig()!.onDrop({ source: { data: sourceData } })
    await nextTick(); await nextTick()
    expect(sourceItems.value).toEqual([{ id: 'source' }])
    expect(targetItems.value).toEqual([{ id: 'target' }])
    expect(sourceUpdates).not.toHaveBeenCalled()
    expect(targetUpdates).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('reports stale event fields from the drag-start snapshot', async () => {
    const items = ref([{ id: 'source' }, { id: 'target' }])
    const rejects: any[] = []
    const wrapper = mount(SortableList, { props: { items: items.value, itemKey: 'id', revision: 'r1', itemLabel: (item: { id: string }) => `label:${item.id}`, onMoveReject: (event: any) => rejects.push(event), 'onUpdate:items': (next: typeof items.value) => { items.value = next } }, slots: { item: itemSlot } })
    await nextTick()
    const source = sourceConfig()!
    const sourceData = source.getInitialData()
    source.onDragStart()
    await wrapper.setProps({ items: [{ id: 'inserted' }, { id: 'source' }, { id: 'target' }] })
    await nextTick()
    targetConfig()!.onDrop({ source: { data: sourceData } })
    await nextTick()
    expect(rejects[0]).toMatchObject({ itemKey: 'source', itemLabel: 'label:source', source: { index: 0, revision: 'r1' } })
    wrapper.unmount()
  })

  it('uses the new group for a session after group prop changes', async () => {
    const wrapper = mount(SortableList, { props: { items: [{ id: 'source' }], itemKey: 'id', group: 'old' }, slots: { item: itemSlot } })
    await nextTick()
    const source = sourceConfig()!
    await wrapper.setProps({ group: 'new' })
    source.onDragStart()
    expect(source.getInitialData().group).toBe('new')
    wrapper.unmount()
  })
})

describe('D7 resource/lifecycle RED: owner realm and cleanup', () => {
  it('does not let a main-document active drag scroll an iframe owner region', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerDocument = iframe.contentDocument!
    const ownerWindow = ownerDocument.defaultView!
    const region = ownerDocument.createElement('div')
    const list = ownerDocument.createElement('ul')
    region.append(list); ownerDocument.body.append(region)
    Object.defineProperties(region, { scrollTop: { writable: true, value: 0 }, clientHeight: { value: 100 }, scrollHeight: { value: 1000 } })
    vi.spyOn(ownerWindow, 'getComputedStyle').mockReturnValue({ overflowY: 'auto', overflowX: 'hidden' } as CSSStyleDeclaration)
    vi.spyOn(region, 'getBoundingClientRect').mockReturnValue({ top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 } as DOMRect)
    const release = registerSortableAutoScroll(list)
    startDrag({ type: 'main-document' })
    const move = new ownerWindow.Event('pointermove', { bubbles: true }) as PointerEvent
    Object.defineProperties(move, { clientX: { value: 100 }, clientY: { value: 99 } })
    ownerDocument.dispatchEvent(move)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(region.scrollTop).toBe(0)
    release(); iframe.remove()
  })

  it('hands an iframe inner edge to outer and continues RAF scrolling without another pointermove', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerDocument = iframe.contentDocument!
    const ownerWindow = ownerDocument.defaultView!
    const outer = ownerDocument.createElement('div')
    const inner = ownerDocument.createElement('div')
    const list = ownerDocument.createElement('ul')
    inner.append(list); outer.append(inner); ownerDocument.body.append(outer)
    Object.defineProperties(inner, { scrollTop: { writable: true, value: 900 }, clientHeight: { value: 100 }, scrollHeight: { value: 1000 } })
    Object.defineProperties(outer, { scrollTop: { writable: true, value: 0 }, clientHeight: { value: 100 }, scrollHeight: { value: 1000 } })
    vi.spyOn(ownerWindow, 'getComputedStyle').mockImplementation((element) => ({ overflowY: element === inner || element === outer ? 'auto' : 'hidden', overflowX: 'hidden' } as CSSStyleDeclaration))
    vi.spyOn(inner, 'getBoundingClientRect').mockReturnValue({ top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 } as DOMRect)
    vi.spyOn(outer, 'getBoundingClientRect').mockReturnValue({ top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 } as DOMRect)
    const release = registerSortableAutoScroll(list)
    startDrag({ type: 'task' }, ownerDocument)
    const move = new ownerWindow.Event('pointermove', { bubbles: true }) as PointerEvent
    Object.defineProperties(move, { clientX: { value: 100 }, clientY: { value: 99 } })
    ownerDocument.dispatchEvent(move)
    await new Promise((resolve) => setTimeout(resolve, 20))
    const firstOuterScrollTop = outer.scrollTop
    expect(firstOuterScrollTop).toBeGreaterThan(0)
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(inner.scrollTop).toBe(900)
    expect(outer.scrollTop).toBeGreaterThan(firstOuterScrollTop)
    endDrag(ownerDocument)
    release(); iframe.remove()
  })

  it('does not overwrite an external same-class live-region node', async () => {
    const external = document.createElement('div')
    external.className = 'aheart-dnd-live-region'
    external.textContent = 'external-owned'
    document.body.append(external)
    const wrapper = mount(Draggable, { attachTo: document.body, props: { data: { type: 'task' }, keyboard: true, label: '任务' } })
    await nextTick()
    ;(wrapper.element as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    expect(external.textContent).toBe('external-owned')
    wrapper.unmount(); external.remove()
  })

  it('cancels an iframe keyboard session as owner-detached and cleans the inner region', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerDocument = iframe.contentDocument!
    const cancels: any[] = []
    const wrapper = mount(Draggable, { attachTo: ownerDocument.body, props: { data: { type: 'task' }, keyboard: true, label: '任务', onKeyboardCancel: (event: any) => cancels.push(event) } })
    await nextTick()
    ;(wrapper.element as HTMLElement).dispatchEvent(new ownerDocument.defaultView!.KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    expect(ownerDocument.querySelector('.aheart-dnd-live-region')).not.toBeNull()
    iframe.remove()
    await new Promise((resolve) => setTimeout(resolve, 20))
    const cancelReason = cancels.length > 0 ? String(cancels[0].reason) : 'missing'
    expect(cancelReason).toBe('owner-detached')
    expect(Boolean(ownerDocument.querySelector('.aheart-dnd-live-region'))).toBe(false)
    wrapper.unmount()
  })

  it('cancels an old keyboard session when a DropZone scope changes', async () => {
    const cancels: any[] = []
    const source = mount(Draggable, { attachTo: document.body, props: { data: { type: 'task' }, keyboard: true, scopeKey: 'route-a', onKeyboardCancel: (event: any) => cancels.push(event) } })
    const target = mount(DropZone, { attachTo: document.body, props: { accept: 'task', keyboard: true, scopeKey: 'route-a' } })
    await nextTick()
    ;(source.element as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await target.setProps({ scopeKey: 'route-b' })
    expect(cancels[0]).toMatchObject({ reason: 'scope-changed' })
    source.unmount(); target.unmount()
  })
})

describe('D7 resource/lifecycle RED: rollback focus', () => {
  it('restores source handle focus after target acceptance is rolled back', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const targetItems = ref([{ id: 'target' }])
    const Host = defineComponent({ setup: () => () => h('div', [
      h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': () => undefined }, { item: itemSlot }),
      h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': (next: typeof targetItems.value) => { targetItems.value = next } }, { item: itemSlot })
    ]) })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const sourceHandle = wrapper.get('[data-resource-handle="source"]').element as HTMLElement
    sourceHandle.focus()
    sourceHandle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }))
    await nextTick(); await nextTick(); await nextTick()
    expect(sourceItems.value).toEqual([{ id: 'source' }])
    expect(targetItems.value).toEqual([{ id: 'target' }])
    expect(document.activeElement).toBe(sourceHandle)
    wrapper.unmount()
  })
})

describe('D7 final development RED: native/tick/ancestor resource isolation', () => {
  it('accepts source-before-target native callbacks once and rejects a microtask-late target', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const targetItems = ref([{ id: 'target' }])
    const sourceUpdates = vi.fn((next: typeof sourceItems.value) => { sourceItems.value = next })
    const targetUpdates = vi.fn((next: typeof targetItems.value) => { targetItems.value = next })
    const Host = defineComponent({ setup: () => () => h('div', [
      h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': sourceUpdates }),
      h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': targetUpdates })
    ]) })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const source = sourceConfig()!
    source.onDragStart()
    const sourceData = source.getInitialData()
    source.onDrop()
    targetConfig()!.onDrop({ source: { data: sourceData } })
    await nextTick(); await nextTick()
    expect(sourceItems.value).toEqual([])
    expect(targetItems.value).toEqual([{ id: 'source' }, { id: 'target' }])
    expect(sourceUpdates).toHaveBeenCalledTimes(1)
    expect(targetUpdates).toHaveBeenCalledTimes(1)
    await Promise.resolve()
    targetConfig()!.onDrop({ source: { data: sourceData } })
    await nextTick(); await nextTick()
    expect(sourceUpdates).toHaveBeenCalledTimes(1)
    expect(targetUpdates).toHaveBeenCalledTimes(1)

    source.onDragStart()
    const lateSourceData = source.getInitialData()
    source.onDrop()
    await Promise.resolve()
    targetConfig()!.onDrop({ source: { data: lateSourceData } })
    await nextTick(); await nextTick()
    expect(sourceUpdates).toHaveBeenCalledTimes(1)
    expect(targetUpdates).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('allows only one candidate transaction when the same target receives two drops in one tick', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const targetItems = ref([{ id: 'target' }])
    const sourceUpdates = vi.fn((next: typeof sourceItems.value) => { sourceItems.value = next })
    const targetUpdates = vi.fn((next: typeof targetItems.value) => { targetItems.value = next })
    const Host = defineComponent({ setup: () => () => h('div', [
      h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': sourceUpdates }),
      h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': targetUpdates })
    ]) })
    const wrapper = mount(Host)
    await nextTick()
    const source = sourceConfig()!
    const sourceData = source.getInitialData()
    source.onDragStart()
    const target = targetConfig()!
    target.onDrop({ source: { data: sourceData } })
    target.onDrop({ source: { data: sourceData } })
    await nextTick(); await nextTick()
    expect(sourceUpdates).toHaveBeenCalledTimes(1)
    expect(targetUpdates).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('does not schedule unbounded RAF or scrollBy when iframe ancestors are all at their boundaries', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerDocument = iframe.contentDocument!
    const ownerWindow = ownerDocument.defaultView!
    const outer = ownerDocument.createElement('div')
    const inner = ownerDocument.createElement('div')
    const list = ownerDocument.createElement('ul')
    inner.append(list); outer.append(inner); ownerDocument.body.append(outer)
    Object.defineProperties(inner, { scrollTop: { writable: true, value: 900 }, scrollHeight: { value: 1000 }, clientHeight: { value: 100 } })
    Object.defineProperties(outer, { scrollTop: { writable: true, value: 900 }, scrollHeight: { value: 1000 }, clientHeight: { value: 100 } })
    Object.defineProperty(ownerDocument, 'scrollingElement', { configurable: true, value: ownerDocument.documentElement })
    Object.defineProperties(ownerDocument.documentElement, { scrollTop: { writable: true, value: 900 }, scrollHeight: { value: 1000 }, clientHeight: { value: 100 } })
    vi.spyOn(ownerWindow, 'getComputedStyle').mockImplementation((element) => ({ overflowY: element === inner || element === outer ? 'auto' : 'hidden', overflowX: 'hidden' } as CSSStyleDeclaration))
    vi.spyOn(inner, 'getBoundingClientRect').mockReturnValue({ top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 } as DOMRect)
    vi.spyOn(outer, 'getBoundingClientRect').mockReturnValue({ top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 } as DOMRect)
    let rafCalls = 0
    const raf = vi.spyOn(ownerWindow, 'requestAnimationFrame').mockImplementation((callback) => {
      rafCalls += 1
      return ownerWindow.setTimeout(() => callback(0), 0) as unknown as number
    })
    const scrollBy = vi.spyOn(ownerWindow, 'scrollBy').mockImplementation(() => undefined)
    const release = registerSortableAutoScroll(list)
    startDrag({ type: 'task' }, ownerDocument)
    const move = new ownerWindow.Event('pointermove', { bubbles: true }) as PointerEvent
    Object.defineProperties(move, { clientX: { value: 100 }, clientY: { value: 99 } })
    ownerDocument.dispatchEvent(move)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(rafCalls).toBeLessThanOrEqual(2)
    expect(scrollBy).not.toHaveBeenCalled()
    expect(inner.scrollTop).toBe(900)
    expect(outer.scrollTop).toBe(900)
    endDrag(ownerDocument); release(); iframe.remove()
  })

  it('releases one iframe ancestor while retaining the other owner registration', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerDocument = iframe.contentDocument!
    const ownerWindow = ownerDocument.defaultView!
    const first = ownerDocument.createElement('div')
    const second = ownerDocument.createElement('div')
    const firstList = ownerDocument.createElement('ul')
    const secondList = ownerDocument.createElement('ul')
    first.append(firstList); second.append(secondList); ownerDocument.body.append(first, second)
    for (const region of [first, second]) {
      Object.defineProperties(region, { scrollTop: { writable: true, value: 0 }, scrollHeight: { value: 1000 }, clientHeight: { value: 100 } })
      vi.spyOn(region, 'getBoundingClientRect').mockReturnValue({ top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100 } as DOMRect)
    }
    vi.spyOn(ownerWindow, 'getComputedStyle').mockImplementation((element) => ({ overflowY: element === first || element === second ? 'auto' : 'hidden', overflowX: 'hidden' } as CSSStyleDeclaration))
    const releaseFirst = registerSortableAutoScroll(firstList)
    const releaseSecond = registerSortableAutoScroll(secondList)
    releaseFirst()
    startDrag({ type: 'task' }, ownerDocument)
    const move = new ownerWindow.Event('pointermove', { bubbles: true }) as PointerEvent
    Object.defineProperties(move, { clientX: { value: 100 }, clientY: { value: 99 } })
    ownerDocument.dispatchEvent(move)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(first.scrollTop).toBe(0)
    expect(second.scrollTop).toBeGreaterThan(0)
    endDrag(ownerDocument); releaseSecond(); iframe.remove()
  })

  it('keeps a below-threshold touch pointercancel path update-free', async () => {
    const items = ref([{ id: 'source' }, { id: 'target' }])
    const updates = vi.fn()
    const wrapper = mount(SortableList, { attachTo: document.body, props: { items: items.value, itemKey: 'id', 'onUpdate:items': updates }, slots: { item: itemSlot } })
    await nextTick()
    const handle = wrapper.get('[data-resource-handle="source"]').element
    handle.dispatchEvent(touchEvent('pointerdown', 90, 10, 10))
    document.dispatchEvent(touchEvent('pointercancel', 90, 11, 11))
    document.dispatchEvent(touchEvent('pointerup', 90, 11, 11))
    expect(updates).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('settles a pending cancel rollback only after one rollback tick and reports rollback-rejected', async () => {
    const sourceId = 'resource-source'
    const targetId = 'resource-target'
    let sourceItems: Array<{ id: string }> = [{ id: 'source' }]
    const targetItems: Array<{ id: string }> = [{ id: 'target' }]
    const rejects: any[] = []
    const reasons: string[] = []
    const sourceController = {
      group: () => 'tasks', items: () => sourceItems, keyOf: (item: any) => item.id,
      update: (next: unknown[], context?: { phase?: string }) => {
        if (context?.phase === 'candidate') {
          sourceItems = next as Array<{ id: string }>
          queueMicrotask(() => invalidateSortableScope(sourceId))
        }
        // Rollback is intentionally rejected by leaving sourceItems unchanged.
      },
      onMoveReject: (event: any) => { rejects.push(event); reasons.push(event.reason) }
    }
    const targetController = {
      group: () => 'tasks', items: () => targetItems, keyOf: (item: any) => item.id,
      update: () => undefined,
      onMoveReject: (event: any) => { rejects.push(event); reasons.push(event.reason) }
    }
    const unregisterSource = registerSortableList(sourceId, sourceController)
    const unregisterTarget = registerSortableList(targetId, targetController)
    const source = beginSortableSession({ type: 'aheart-sortable', listId: sourceId, index: 0, itemKey: 'source', input: 'pointer' } as any)
    moveSortableItem(source, targetId, 0)
    expect(reasons).toEqual([])
    await nextTick()
    expect(reasons).toEqual([])
    await nextTick()
    expect(reasons.at(-1)).toBe('rollback-rejected')
    expect(reasons).not.toContain('cancelled')
    expect(rejects.at(-1)).toMatchObject({ reason: 'rollback-rejected' })
    expect(sourceItems).toEqual([])
    unregisterSource()
    unregisterTarget()
  })
})
