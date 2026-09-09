import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Draggable from '../draggable.vue'
import DropZone from '../drop-zone.vue'
import SortableList from '../sortable-list.vue'
import { endDrag, startDrag } from '../drag-state'
import { registerSortableAutoScroll } from '../sortable-auto-scroll'

const cleanupFns = vi.hoisted(() => [] as Array<ReturnType<typeof vi.fn>>)
const adapter = vi.hoisted(() => ({
  draggable: vi.fn(() => {
    const cleanup = vi.fn()
    cleanupFns.push(cleanup)
    return cleanup
  }),
  dropTargetForElements: vi.fn(() => {
    const cleanup = vi.fn()
    cleanupFns.push(cleanup)
    return cleanup
  })
}))
const autoScroll = vi.hoisted(() => ({
  autoScrollForElements: vi.fn(() => vi.fn()),
  autoScrollWindowForElements: vi.fn(() => vi.fn())
}))

vi.mock('@atlaskit/pragmatic-drag-and-drop/element/adapter', () => adapter)
vi.mock('@atlaskit/pragmatic-drag-and-drop-auto-scroll/element', () => autoScroll)

beforeEach(() => {
  vi.clearAllMocks()
  cleanupFns.length = 0
})

afterEach(() => {
  endDrag()
  document.querySelectorAll('.aheart-dnd-live-region').forEach((node) => node.remove())
  vi.restoreAllMocks()
})

const itemSlot = ({ item }: { item: { id?: string } }) => item.id ?? 'missing'
const listConfigs = () => adapter.dropTargetForElements.mock.calls.map(([config]) => config as any)
const dragConfigs = () => adapter.draggable.mock.calls.map(([config]) => config as any)
const firstDrag = () => dragConfigs().find((config) => config.getInitialData().index === 0)
const targetConfig = (listId: string, key: string, index: number) => listConfigs().find((config) => {
  const data = config.getData()
  return data.listId === listId && (data.itemKey === key || data.position?.itemKey === key || data.index === index)
})

describe('D7 development-review RED: native adapter ordering and revisions', () => {
  it('keeps a session and rejects stale data across getInitialData -> onDragStart -> drop', async () => {
    const items = ref([{ id: 'source' }, { id: 'target' }])
    const rejects: any[] = []
    const Host = defineComponent({
      setup() {
        return () => h(SortableList, {
          items: items.value,
          itemKey: 'id',
          onMoveReject: (event: any) => rejects.push(event),
          'onUpdate:items': (next: typeof items.value) => { items.value = next }
        }, { item: itemSlot })
      }
    })
    const wrapper = mount(Host)
    await nextTick()
    const source = firstDrag()!
    const initialData = source.getInitialData()
    const listId = initialData.listId
    source.onDragStart()
    const sessionData = source.getInitialData()
    expect(initialData.itemKey).toBe('source')
    expect(sessionData.sessionId).toBeTruthy()
    items.value = [{ id: 'inserted' }, { id: 'source' }, { id: 'target' }]
    await nextTick()
    targetConfig(listId, 'target', 1)!.onDrop({ source: { data: initialData } })

    expect(wrapper.emitted('update:items')).toBeUndefined()
    expect(rejects[0]).toMatchObject({ reason: 'stale-revision' })
    wrapper.unmount()
  })

  it('rejects an in-place splice that changes the ordered key set as stale', async () => {
    const items = ref([{ id: 'source' }, { id: 'target' }, { id: 'tail' }])
    const rejects: any[] = []
    const Host = defineComponent({
      setup() {
        return () => h(SortableList, {
          items: items.value,
          itemKey: 'id',
          onMoveReject: (event: any) => rejects.push(event),
          'onUpdate:items': (next: typeof items.value) => { items.value = next }
        }, { item: itemSlot })
      }
    })
    const wrapper = mount(Host)
    await nextTick()
    const source = firstDrag()!
    const sourceData = source.getInitialData()
    source.onDragStart()
    items.value.splice(0, 1, { id: 'replacement' })
    await nextTick()
    targetConfig(sourceData.listId, 'target', 1)!.onDrop({ source: { data: sourceData } })
    await nextTick()

    expect(wrapper.emitted('update:items')).toBeUndefined()
    expect(rejects[0]).toMatchObject({ reason: 'stale-revision' })
    wrapper.unmount()
  })

  it('does not allow same-group lists from separate iframe owner documents to move', async () => {
    const firstFrame = document.createElement('iframe')
    const secondFrame = document.createElement('iframe')
    document.body.append(firstFrame, secondFrame)
    const firstItems = ref([{ id: 'source' }])
    const secondItems = ref([{ id: 'target' }])
    const sourceWrapper = mount(SortableList, { attachTo: firstFrame.contentDocument!.body, props: { items: firstItems.value, itemKey: 'id', group: 'shared', 'onUpdate:items': (next: typeof firstItems.value) => { firstItems.value = next } }, slots: { item: itemSlot } })
    const targetWrapper = mount(SortableList, { attachTo: secondFrame.contentDocument!.body, props: { items: secondItems.value, itemKey: 'id', group: 'shared', 'onUpdate:items': (next: typeof secondItems.value) => { secondItems.value = next } }, slots: { item: itemSlot } })
    await nextTick()
    const source = dragConfigs().find((config) => config.getInitialData().itemKey === 'source')!
    const sourceData = source.getInitialData()
    source.onDragStart()
    const target = listConfigs().find((config) => config.getData().itemKey === 'target' || config.getData().position?.itemKey === 'target')!
    target.onDrop({ source: { data: sourceData } })
    await nextTick()

    expect(firstItems.value).toEqual([{ id: 'source' }])
    expect(secondItems.value).toEqual([{ id: 'target' }])
    expect(sourceWrapper.emitted('update:items')).toBeUndefined()
    expect(targetWrapper.emitted('update:items')).toBeUndefined()
    sourceWrapper.unmount()
    targetWrapper.unmount()
    firstFrame.remove()
    secondFrame.remove()
  })
})

describe('D7 development-review RED: settle, keyboard, and lifecycle', () => {
  it('rolls back and rejects when a list unmounts during candidate emit', async () => {
    const mounted = ref(true)
    const sourceItems = ref([{ id: 'source' }])
    const targetItems = ref([{ id: 'target' }])
    const Host = defineComponent({
      setup() {
        return () => mounted.value ? h('div', [
          h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': (next: typeof sourceItems.value) => { sourceItems.value = next; mounted.value = false } }),
          h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': () => undefined })
        ]) : h('div')
      }
    })
    const wrapper = mount(Host)
    await nextTick()
    const source = dragConfigs().find((config) => config.getInitialData().itemKey === 'source')!
    const sourceData = source.getInitialData()
    source.onDragStart()
    const target = listConfigs().find((config) => config.getData().itemKey === 'target' || config.getData().position?.itemKey === 'target')!
    target.onDrop({ source: { data: sourceData } })
    await nextTick()
    await nextTick()

    expect(sourceItems.value).toEqual([{ id: 'source' }])
    expect(document.querySelector('.aheart-dnd-live-region')).toBeNull()
    wrapper.unmount()
  })

  it('rolls back and announces failure when a keyboard cross-list move is parent-rejected', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const targetItems = ref([{ id: 'target' }])
    const Host = defineComponent({
      setup() {
        return () => h('div', [
          h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': (next: typeof sourceItems.value) => { sourceItems.value = next } }, { item: itemSlot }),
          h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': () => undefined }, { item: itemSlot })
        ])
      }
    })
    const wrapper = mount(Host)
    await nextTick()
    const sourceItem = wrapper.findAll('.aheart-dnd-sortable-item')[0]
    sourceItem.element.focus()
    sourceItem.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }))
    await nextTick()
    await nextTick()

    expect(sourceItems.value).toEqual([{ id: 'source' }])
    expect(targetItems.value).toEqual([{ id: 'target' }])
    expect(document.querySelector('.aheart-dnd-live-region')?.textContent ?? '').toMatch(/失败|拒绝|父层/)
    wrapper.unmount()
  })

  it('cancels a generic keyboard session on scope change and announces target focus', async () => {
    const source = mount(Draggable, { attachTo: document.body, props: { data: { type: 'task' }, keyboard: true, label: '任务', scopeKey: 'route-a' } })
    const target = mount(DropZone, { attachTo: document.body, props: { accept: 'task', keyboard: true, label: '目标', scopeKey: 'route-a' } })
    await nextTick()
    const sourceRoot = source.element as HTMLElement
    const targetRoot = target.element as HTMLElement
    sourceRoot.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    targetRoot.focus()
    targetRoot.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(document.activeElement).toBe(targetRoot)
    expect(document.querySelector('.aheart-dnd-live-region')?.textContent ?? '').toMatch(/任务|目标|放置/)
    sourceRoot.focus()
    sourceRoot.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await source.setProps({ scopeKey: 'route-b' })
    expect(source.emitted('keyboardCancel')?.[0]?.[0]).toMatchObject({ reason: 'scope-changed' })
    expect(document.querySelector('.aheart-dnd-live-region')?.textContent ?? '').toMatch(/取消|切换|页面/)
    source.unmount()
    target.unmount()
  })

  it('announces dynamic disabled target rejection and removes the final live region', async () => {
    const source = mount(Draggable, { props: { data: { type: 'task' }, keyboard: true, label: '任务' } })
    const target = mount(DropZone, { props: { accept: 'task', keyboard: true, label: '目标', disabled: false } })
    await nextTick()
    ;(source.element as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await target.setProps({ disabled: true })
    ;(target.element as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(document.querySelector('.aheart-dnd-live-region')?.textContent ?? '').toMatch(/禁用|目标/)
    expect((target.element as HTMLElement).getAttribute('tabindex')).toBe('-1')
    source.unmount()
    target.unmount()
    expect(document.querySelector('.aheart-dnd-live-region')).toBeNull()
  })

  it('exposes grabbed and target keyboard state through semantic class or aria', async () => {
    const source = mount(Draggable, { props: { data: { type: 'task' }, keyboard: true, label: '任务' } })
    const target = mount(DropZone, { props: { accept: 'task', keyboard: true, label: '目标' } })
    await nextTick()
    ;(source.element as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    const grabbed = source.element.classList.contains('aheart-dnd-keyboard-grabbed') || source.element.getAttribute('aria-grabbed') === 'true'
    const targetState = target.element.classList.contains('aheart-dnd-keyboard-target') || target.element.getAttribute('aria-dropeffect') === 'move'
    expect(grabbed).toBe(true)
    expect(targetState).toBe(true)
    source.unmount()
    target.unmount()
  })
})

describe('D7 development-review RED: iframe auto-scroll and key safety', () => {
  it('does not scroll on ordinary iframe pointermove, scrolls active overflow, and remains usable after pointerup', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerDocument = iframe.contentDocument!
    const ownerWindow = ownerDocument.defaultView!
    const region = ownerDocument.createElement('div')
    const list = ownerDocument.createElement('ul')
    region.append(list)
    ownerDocument.body.append(region)
    Object.defineProperties(region, { clientHeight: { value: 100 }, scrollHeight: { value: 1000 }, scrollTop: { writable: true, value: 0 } })
    vi.spyOn(ownerWindow, 'getComputedStyle').mockReturnValue({ overflowY: 'auto', overflowX: 'hidden' } as CSSStyleDeclaration)
    vi.spyOn(region, 'getBoundingClientRect').mockReturnValue({ top: 0, left: 0, width: 200, height: 100, right: 200, bottom: 100 } as DOMRect)
    const release = registerSortableAutoScroll(list)
    const ordinaryMove = new ownerWindow.Event('pointermove', { bubbles: true }) as PointerEvent
    Object.defineProperties(ordinaryMove, { clientX: { value: 100 }, clientY: { value: 99 } })
    ownerDocument.dispatchEvent(ordinaryMove)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(region.scrollTop).toBe(0)
    startDrag({ type: 'task' }, ownerDocument)
    const move = new ownerWindow.Event('pointermove', { bubbles: true }) as PointerEvent
    Object.defineProperties(move, { clientX: { value: 100 }, clientY: { value: 99 } })
    ownerDocument.dispatchEvent(move)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(region.scrollTop).toBeGreaterThan(0)
    ownerWindow.dispatchEvent(new ownerWindow.Event('pointerup'))
    region.scrollTop = 0
    startDrag({ type: 'task' }, ownerDocument)
    ownerDocument.dispatchEvent(move)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(region.scrollTop).toBeGreaterThan(0)
    endDrag(ownerDocument)
    release()
    iframe.remove()
  })

  it('safely rejects a missing stable key with a development warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const items = ref([{}, { id: 'target' }])
    const wrapper = mount(SortableList, { props: { items: items.value, itemKey: 'id' }, slots: { item: itemSlot } })
    await nextTick()
    const source = firstDrag()!
    const target = targetConfig(source.getInitialData().listId, 'target', 1)!
    source.onDragStart()
    target.onDrop({ source: { data: source.getInitialData() } })
    expect(wrapper.emitted('update:items')).toBeUndefined()
    expect(warn).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('safely rejects duplicate stable keys with a development warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const items = ref([{ id: 'dup' }, { id: 'dup' }])
    const wrapper = mount(SortableList, { props: { items: items.value, itemKey: 'id' }, slots: { item: itemSlot } })
    await nextTick()
    const source = firstDrag()!
    const target = listConfigs().find((config) => config.getData().index === 1)!
    source.onDragStart()
    target.onDrop({ source: { data: source.getInitialData() } })
    expect(wrapper.emitted('update:items')).toBeUndefined()
    expect(warn).toHaveBeenCalled()
    wrapper.unmount()
  })
})
