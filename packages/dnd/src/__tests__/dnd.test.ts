import { mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Draggable from '../draggable.vue'
import DropZone from '../drop-zone.vue'
import DragOverlay from '../drag-overlay.vue'
import { currentDragData } from '../drag-state'
import SortableList from '../sortable-list.vue'
import { registerSortableAutoScroll } from '../sortable-auto-scroll'
import * as sortableRegistry from '../sortable-registry'

const cleanupFns = vi.hoisted(() => [] as ReturnType<typeof vi.fn>[])
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
vi.mock('@atlaskit/pragmatic-drag-and-drop/reorder', () => ({
  reorder: <T>({ list, startIndex, finishIndex }: { list: T[]; startIndex: number; finishIndex: number }) => {
    const next = [...list]
    const [item] = next.splice(startIndex, 1)
    next.splice(finishIndex, 0, item)
    return next
  }
}))

beforeEach(() => {
  vi.clearAllMocks()
  cleanupFns.length = 0
})

const touchPointer = (type: string, pointerId: number, clientX: number, clientY: number) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
    buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1
  })
  Object.defineProperties(event, {
    pointerId: { value: pointerId },
    pointerType: { value: 'touch' },
    isPrimary: { value: true }
  })
  return event as PointerEvent
}

const itemWithHandle = ({ item, handleProps }: { item: { id: string }; handleProps?: Record<string, unknown> }) => h('div', [
  h('button', { ...handleProps, 'data-handle': item.id }, 'drag'),
  h('span', { 'data-item-body': item.id }, item.id)
])

const sortableSsrApp = () => createSSRApp(defineComponent({
  setup() {
    return () => h(SortableList, {
      items: [{ id: 'item' }],
      itemKey: 'id'
    }, {
      item: ({ item }: { item: { id: string } }) => item.id
    })
  }
}))

describe('sortable SSR and hydration', () => {
  it('does not render a runtime list id on SSR and hydrates without warnings', async () => {
    const register = vi.spyOn(sortableRegistry, 'registerSortableList')
    const firstHtml = await renderToString(sortableSsrApp())
    const secondHtml = await renderToString(sortableSsrApp())
    const host = document.createElement('div')
    host.innerHTML = firstHtml
    document.body.append(host)
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(firstHtml).toBe(secondHtml)
    expect(firstHtml).not.toContain('data-aheart-sortable-list-id=')
    expect(register).not.toHaveBeenCalled()

    const app = sortableSsrApp()
    app.mount(host)
    await nextTick()

    expect(register).toHaveBeenCalledTimes(1)
    expect(host.querySelector('[data-aheart-sortable-list-id]')).not.toBeNull()
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('Hydration'))

    app.unmount()
    warn.mockRestore()
    register.mockRestore()
    host.remove()
  })

  it('assigns different ids to independent apps in the same document', async () => {
    const first = mount(SortableList, {
      props: { items: [{ id: 'first-a' }, { id: 'first-b' }], itemKey: 'id', group: 'shared' },
      attachTo: document.body
    })
    const second = mount(SortableList, {
      props: { items: [{ id: 'second-a' }, { id: 'second-b' }], itemKey: 'id', group: 'shared' },
      attachTo: document.body
    })
    await nextTick()

    const firstList = first.find('ul').element as HTMLElement
    const secondList = second.find('ul').element as HTMLElement
    expect(firstList.dataset.aheartSortableListId).toBeTruthy()
    expect(secondList.dataset.aheartSortableListId).toBeTruthy()
    expect(firstList.dataset.aheartSortableListId).not.toBe(secondList.dataset.aheartSortableListId)

    first.unmount()
    second.unmount()
  })

  it('keeps registry operations isolated between independent apps', async () => {
    const firstItems = ref([{ id: 'first-a' }, { id: 'first-b' }])
    const secondItems = ref([{ id: 'second-a' }, { id: 'second-b' }])
    const first = mount(SortableList, {
      props: { items: firstItems.value, itemKey: 'id', group: 'shared', 'onUpdate:items': (items) => firstItems.value = items as typeof firstItems.value },
      attachTo: document.body
    })
    const second = mount(SortableList, {
      props: { items: secondItems.value, itemKey: 'id', group: 'shared', 'onUpdate:items': (items) => secondItems.value = items as typeof secondItems.value },
      attachTo: document.body
    })
    await nextTick()

    const firstListId = (first.find('ul').element as HTMLElement).dataset.aheartSortableListId!
    const secondListId = (second.find('ul').element as HTMLElement).dataset.aheartSortableListId!
    expect(sortableRegistry.moveSortableItem({ type: 'aheart-sortable', listId: firstListId, index: 0 }, firstListId, 1)).toBe(true)
    await nextTick()

    expect(firstItems.value.map((item) => item.id)).toEqual(['first-b', 'first-a'])
    expect(secondItems.value.map((item) => item.id)).toEqual(['second-a', 'second-b'])
    expect(sortableRegistry.moveSortableItem({ type: 'aheart-sortable', listId: secondListId, index: 0 }, secondListId, 1)).toBe(true)

    first.unmount()
    second.unmount()
  })

  it('does not let an old registry cleanup remove a replacement controller', () => {
    const first = { group: () => 'shared', items: () => [{ id: 'first' }], update: vi.fn() }
    const second = { group: () => 'shared', items: () => [{ id: 'second-a' }, { id: 'second-b' }], update: vi.fn() }
    const releaseFirst = sortableRegistry.registerSortableList('same-id', first)
    sortableRegistry.registerSortableList('same-id', second)

    releaseFirst()

    expect(sortableRegistry.moveSortableItem({ type: 'aheart-sortable', listId: 'same-id', index: 0 }, 'same-id', 1)).toBe(true)
    expect(second.update).toHaveBeenCalledTimes(1)
    sortableRegistry.registerSortableList('same-id', second)()
  })
})

describe('sortable deep declarations', () => {
  it('preserves the established deep registry and context API surface', () => {
    for (const declaration of ['../../es/sortable-registry.d.ts', '../../lib/sortable-registry.d.ts']) {
      const contents = readFileSync(new URL(declaration, import.meta.url), 'utf8')
      expect(contents).toContain('moveSortableItem(source: SortableItemData, targetListId: string, targetIndex: number): boolean;')
      expect(contents).not.toContain('SortableMoveResult')
      expect(contents).not.toContain('moveSortableItemToAdjacentList')
    }
    for (const declaration of ['../../es/sortable-context.d.ts', '../../lib/sortable-context.d.ts']) {
      const contents = readFileSync(new URL(declaration, import.meta.url), 'utf8')
      expect(contents).toContain('move: (source: SortableItemData, targetIndex: number, keyboard?: boolean) => void;')
      expect(contents).not.toContain('moveAdjacent')
    }
  })

  it('does not import Vue useId in source or generated sortable-list modules', () => {
    for (const file of [
      '../sortable-list.vue',
      '../../es/sortable-list.vue.js',
      '../../lib/sortable-list.vue.js'
    ]) {
      expect(readFileSync(new URL(file, import.meta.url), 'utf8')).not.toMatch(/\buseId\b/)
    }
  })
})

describe('sortable auto-scroll registration', () => {
  it('registers an overflow ancestor before it becomes scrollable', () => {
    const scrollRegion = document.createElement('div')
    const list = document.createElement('ul')
    scrollRegion.append(list)
    document.body.append(scrollRegion)
    Object.defineProperties(scrollRegion, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 100 },
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 100 }
    })
    const getComputedStyle = vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => ({
      overflowX: element === scrollRegion ? 'auto' : 'visible',
      overflowY: element === scrollRegion ? 'auto' : 'visible'
    }) as CSSStyleDeclaration)

    const release = registerSortableAutoScroll(list)

    expect(autoScroll.autoScrollForElements).toHaveBeenCalledTimes(1)
    expect(autoScroll.autoScrollForElements).toHaveBeenCalledWith({ element: scrollRegion })
    release()
    expect(autoScroll.autoScrollForElements.mock.results[0].value).toHaveBeenCalledTimes(1)
    getComputedStyle.mockRestore()
    scrollRegion.remove()
  })

  it('registers every scrollable ancestor and window for nested overflow handoff', () => {
    const outer = document.createElement('div')
    const inner = document.createElement('div')
    const list = document.createElement('ul')
    inner.append(list)
    outer.append(inner)
    document.body.append(outer)
    const getComputedStyle = vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => ({
      overflowX: element === outer ? 'auto' : 'visible',
      overflowY: element === inner || element === outer ? 'auto' : 'visible'
    }) as CSSStyleDeclaration)

    const release = registerSortableAutoScroll(list)

    expect(autoScroll.autoScrollForElements).toHaveBeenCalledTimes(2)
    expect(autoScroll.autoScrollForElements).toHaveBeenNthCalledWith(1, { element: inner })
    expect(autoScroll.autoScrollForElements).toHaveBeenNthCalledWith(2, { element: outer })
    expect(autoScroll.autoScrollWindowForElements).toHaveBeenCalledTimes(1)

    release()
    expect(autoScroll.autoScrollForElements.mock.results[0].value).toHaveBeenCalledTimes(1)
    expect(autoScroll.autoScrollForElements.mock.results[1].value).toHaveBeenCalledTimes(1)
    expect(autoScroll.autoScrollWindowForElements.mock.results[0].value).toHaveBeenCalledTimes(1)
    getComputedStyle.mockRestore()
    outer.remove()
  })

  it('registers window auto-scroll once for visible-overflow trees and cleans it after all lists release', () => {
    const firstList = document.createElement('ul')
    const secondList = document.createElement('ul')
    document.body.append(firstList, secondList)
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({ overflowX: 'visible', overflowY: 'visible' } as CSSStyleDeclaration)

    const releaseFirst = registerSortableAutoScroll(firstList)
    const releaseSecond = registerSortableAutoScroll(secondList)

    expect(autoScroll.autoScrollWindowForElements).toHaveBeenCalledTimes(1)
    releaseFirst()
    expect(autoScroll.autoScrollWindowForElements.mock.results[0].value).not.toHaveBeenCalled()
    releaseSecond()
    expect(autoScroll.autoScrollWindowForElements.mock.results[0].value).toHaveBeenCalledTimes(1)
    vi.restoreAllMocks()
    firstList.remove()
    secondList.remove()
  })

  it('registers and cleans auto-scroll through SortableList mount and unmount', async () => {
    const scrollRegion = document.createElement('div')
    document.body.append(scrollRegion)
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => ({
      overflowX: element === scrollRegion ? 'auto' : 'visible',
      overflowY: element === scrollRegion ? 'auto' : 'visible'
    }) as CSSStyleDeclaration)

    const props = { items: [{ id: 'item' }], itemKey: 'id' }
    const first = mount(SortableList, { props, attachTo: scrollRegion })
    const second = mount(SortableList, { props, attachTo: scrollRegion })
    await nextTick()

    expect(autoScroll.autoScrollForElements).toHaveBeenCalledTimes(1)
    first.unmount()
    expect(autoScroll.autoScrollForElements.mock.results[0].value).not.toHaveBeenCalled()
    second.unmount()
    expect(autoScroll.autoScrollForElements.mock.results[0].value).toHaveBeenCalledTimes(1)

    vi.restoreAllMocks()
    scrollRegion.remove()
  })
})

describe('Aheart DnD adapters', () => {
  it('registers a draggable element with its data and disabled guard', async () => {
    mount(Draggable, { props: { data: { type: 'task', id: '1' }, disabled: true }, slots: { default: '任务' } })
    await nextTick()

    const config = adapter.draggable.mock.calls.at(-1)?.[0]
    expect(config.getInitialData()).toEqual({ type: 'task', id: '1' })
    expect(config.canDrag()).toBe(false)
  })

  it('accepts matching drop data and emits the source payload', async () => {
    const wrapper = mount(DropZone, { props: { accept: 'task' }, slots: { default: '待办' } })
    await nextTick()
    const config = adapter.dropTargetForElements.mock.calls.at(-1)?.[0]

    expect(config.canDrop({ source: { data: { type: 'task', id: '1' } } })).toBe(true)
    expect(config.canDrop({ source: { data: { type: 'note' } } })).toBe(false)
    config.onDrop({ source: { data: { type: 'task', id: '1' } } })

    expect(wrapper.emitted('drop')).toEqual([[{ type: 'task', id: '1' }]])
  })

  it('reorders a controlled sortable list when an item is dropped over another item', async () => {
    const wrapper = mount(SortableList, {
      props: { items: [{ id: 'first' }, { id: 'second' }], itemKey: 'id' },
      slots: { item: ({ item }: { item: { id: string } }) => item.id }
    })
    await nextTick()

    const target = adapter.dropTargetForElements.mock.calls
      .map(([config]) => config)
      .find((config) => config.getData().index === 1)
    const source = adapter.draggable.mock.calls
      .map(([config]) => config)
      .find((config) => config.getInitialData().index === 0)

    target.onDrop({ source: { data: source.getInitialData() } })

    expect(wrapper.emitted('update:items')).toEqual([[[{ id: 'second' }, { id: 'first' }]]])
    wrapper.unmount()
  })

  it('moves items between sortable lists in the same group', async () => {
    const sourceList = mount(SortableList, {
      props: { items: [{ id: 'source' }], itemKey: 'id', group: 'tasks' },
      slots: { item: ({ item }: { item: { id: string } }) => item.id },
      global: { config: { idPrefix: 'source' } }
    })
    const targetList = mount(SortableList, {
      props: { items: [{ id: 'target' }], itemKey: 'id', group: 'tasks' },
      slots: { item: ({ item }: { item: { id: string } }) => item.id },
      global: { config: { idPrefix: 'target' } }
    })
    await nextTick()

    const source = adapter.draggable.mock.calls
      .map(([config]) => config)
      .find((config) => config.getInitialData().group === 'tasks' && config.getInitialData().listId !== undefined)
    const target = adapter.dropTargetForElements.mock.calls
      .map(([config]) => config)
      .find((config) => config.getData().group === 'tasks' && config.getData().listId !== source.getInitialData().listId && config.getData().index === 0)

    target.onDrop({ source: { data: source.getInitialData() } })

    expect(sourceList.emitted('update:items')).toEqual([[[]]])
    expect(targetList.emitted('update:items')).toEqual([[[{ id: 'source' }, { id: 'target' }]]])
    sourceList.unmount()
    targetList.unmount()
  })

  it('does not move items between ungrouped sortable lists', async () => {
    const sourceList = mount(SortableList, { props: { items: [{ id: 'source' }], itemKey: 'id' }, global: { config: { idPrefix: 'source' } } })
    const targetList = mount(SortableList, { props: { items: [{ id: 'target' }], itemKey: 'id' }, global: { config: { idPrefix: 'target' } } })
    await nextTick()
    const sources = adapter.draggable.mock.calls
      .map(([config]) => config)
      .filter((config) => config.getInitialData().type === 'aheart-sortable' && config.getInitialData().group === undefined)
    const source = sources.at(-2)
    const target = adapter.dropTargetForElements.mock.calls
      .map(([config]) => config)
      .findLast((config) => config.getData().listId !== source.getInitialData().listId)

    target.onDrop({ source: { data: source.getInitialData() } })

    expect(sourceList.emitted('update:items')).toBeUndefined()
    expect(targetList.emitted('update:items')).toBeUndefined()
    sourceList.unmount()
    targetList.unmount()
  })

  it('moves an item into an empty sortable list in the same group', async () => {
    const sourceList = mount(SortableList, { props: { items: [{ id: 'source' }], itemKey: 'id', group: 'empty' }, global: { config: { idPrefix: 'source' } } })
    const targetList = mount(SortableList, { props: { items: [], itemKey: 'id', group: 'empty' }, global: { config: { idPrefix: 'target' } } })
    await nextTick()
    const source = adapter.draggable.mock.calls.map(([config]) => config).find((config) => config.getInitialData().group === 'empty')
    const target = adapter.dropTargetForElements.mock.calls
      .map(([config]) => config)
      .find((config) => config.getData().group === 'empty' && config.getData().targetIndex === 0)

    target.onDrop({ source: { data: source.getInitialData() } })

    expect(sourceList.emitted('update:items')).toEqual([[[]]])
    expect(targetList.emitted('update:items')).toEqual([[[{ id: 'source' }]]])
    sourceList.unmount()
    targetList.unmount()
  })

  it('moves a touch-handle item into a non-empty compatible list once and restores focus in the destination', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const targetItems = ref([{ id: 'target' }])
    const sourceUpdates = vi.fn((nextItems: typeof sourceItems.value) => { sourceItems.value = nextItems })
    const targetUpdates = vi.fn((nextItems: typeof targetItems.value) => { targetItems.value = nextItems })
    const Host = defineComponent({
      setup() {
        return () => h('div', [
          h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': sourceUpdates }, { item: itemWithHandle }),
          h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': targetUpdates }, { item: itemWithHandle }),
          h(DragOverlay)
        ])
      }
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const [sourceList, targetList] = wrapper.findAll('.aheart-dnd-sortable-list')
    const sourceHandle = sourceList.get('[data-handle="source"]').element
    const targetItem = targetList.get('[data-sortable-index="0"]').element as HTMLElement
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => targetItem })

    sourceHandle.dispatchEvent(touchPointer('pointerdown', 21, 10, 10))
    document.dispatchEvent(touchPointer('pointermove', 21, 10, 28))
    document.dispatchEvent(touchPointer('pointerup', 21, 10, 48))
    await nextTick()
    await nextTick()

    expect(sourceItems.value).toEqual([])
    expect(targetItems.value).toEqual([{ id: 'source' }, { id: 'target' }])
    expect(sourceUpdates).toHaveBeenCalledTimes(1)
    expect(targetUpdates).toHaveBeenCalledTimes(1)
    expect(targetList.get('[data-handle="source"]').element).toBe(document.activeElement)
    expect(currentDragData.value).toBeUndefined()
    expect(document.querySelector('.aheart-dnd-overlay')).toBeNull()
    delete (document as Partial<Document>).elementFromPoint
    wrapper.unmount()
  })

  it('moves a touch-handle item into an empty compatible list once', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const targetItems = ref<{ id: string }[]>([])
    const sourceUpdates = vi.fn((nextItems: typeof sourceItems.value) => { sourceItems.value = nextItems })
    const targetUpdates = vi.fn((nextItems: typeof targetItems.value) => { targetItems.value = nextItems })
    const Host = defineComponent({
      setup() {
        return () => h('div', [
          h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': sourceUpdates }, { item: itemWithHandle }),
          h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': targetUpdates }, { item: itemWithHandle })
        ])
      }
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const [sourceList, targetList] = wrapper.findAll('.aheart-dnd-sortable-list')
    const sourceHandle = sourceList.get('[data-handle="source"]').element
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => targetList.element })

    sourceHandle.dispatchEvent(touchPointer('pointerdown', 22, 10, 10))
    document.dispatchEvent(touchPointer('pointermove', 22, 10, 28))
    document.dispatchEvent(touchPointer('pointerup', 22, 10, 48))
    await nextTick()

    expect(sourceItems.value).toEqual([])
    expect(targetItems.value).toEqual([{ id: 'source' }])
    expect(sourceUpdates).toHaveBeenCalledTimes(1)
    expect(targetUpdates).toHaveBeenCalledTimes(1)
    delete (document as Partial<Document>).elementFromPoint
    wrapper.unmount()
  })

  it('allows only one sortable handle to own a touch gesture across list instances', async () => {
    const wrapper = mount(defineComponent({
      setup() {
        return () => h('div', [
          h(SortableList, { items: [{ id: 'first' }], itemKey: 'id' }, { item: itemWithHandle }),
          h(SortableList, { items: [{ id: 'second' }], itemKey: 'id' }, { item: itemWithHandle })
        ])
      }
    }), { attachTo: document.body })
    await nextTick()
    const [firstList, secondList] = wrapper.findAll('.aheart-dnd-sortable-list')
    const firstHandle = firstList.get('[data-handle="first"]').element
    const secondHandle = secondList.get('[data-handle="second"]').element

    firstHandle.dispatchEvent(touchPointer('pointerdown', 23, 10, 10))
    secondHandle.dispatchEvent(touchPointer('pointerdown', 24, 10, 10))
    document.dispatchEvent(touchPointer('pointermove', 24, 10, 28))
    await nextTick()
    const stateDuringSecondGesture = currentDragData.value
    document.dispatchEvent(touchPointer('pointercancel', 23, 10, 28))
    document.dispatchEvent(touchPointer('pointercancel', 24, 10, 28))

    expect(stateDuringSecondGesture).toBeUndefined()
    wrapper.unmount()
  })

  it('rejects touch-handle moves to disabled and different-group lists', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const disabledItems = ref<{ id: string }[]>([])
    const rejectedItems = ref<{ id: string }[]>([])
    const sourceUpdates = vi.fn((nextItems: typeof sourceItems.value) => { sourceItems.value = nextItems })
    const disabledUpdates = vi.fn((nextItems: typeof disabledItems.value) => { disabledItems.value = nextItems })
    const rejectedUpdates = vi.fn((nextItems: typeof rejectedItems.value) => { rejectedItems.value = nextItems })
    const Host = defineComponent({
      setup() {
        return () => h('div', [
          h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': sourceUpdates }, { item: itemWithHandle }),
          h(SortableList, { items: disabledItems.value, itemKey: 'id', group: 'tasks', disabled: true, 'onUpdate:items': disabledUpdates }, { item: itemWithHandle }),
          h(SortableList, { items: rejectedItems.value, itemKey: 'id', group: 'audit', 'onUpdate:items': rejectedUpdates }, { item: itemWithHandle })
        ])
      }
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const [sourceList, disabledList, rejectedList] = wrapper.findAll('.aheart-dnd-sortable-list')
    const sourceHandle = sourceList.get('[data-handle="source"]').element
    let target: HTMLElement = disabledList.element
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => target })

    sourceHandle.dispatchEvent(touchPointer('pointerdown', 25, 10, 10))
    document.dispatchEvent(touchPointer('pointermove', 25, 10, 28))
    document.dispatchEvent(touchPointer('pointerup', 25, 10, 48))
    target = rejectedList.element
    sourceHandle.dispatchEvent(touchPointer('pointerdown', 26, 10, 10))
    document.dispatchEvent(touchPointer('pointermove', 26, 10, 28))
    document.dispatchEvent(touchPointer('pointerup', 26, 10, 48))
    await nextTick()

    expect(sourceItems.value).toEqual([{ id: 'source' }])
    expect(disabledItems.value).toEqual([])
    expect(rejectedItems.value).toEqual([])
    expect(sourceUpdates).not.toHaveBeenCalled()
    expect(disabledUpdates).not.toHaveBeenCalled()
    expect(rejectedUpdates).not.toHaveBeenCalled()
    expect(currentDragData.value).toBeUndefined()
    delete (document as Partial<Document>).elementFromPoint
    wrapper.unmount()
  })

  it('moves with Alt + ArrowRight to the next compatible registered list and focuses its handle', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const rejectedItems = ref([{ id: 'rejected' }])
    const disabledItems = ref([{ id: 'disabled' }])
    const targetItems = ref([{ id: 'target' }])
    const sourceUpdates = vi.fn((nextItems: typeof sourceItems.value) => { sourceItems.value = nextItems })
    const targetUpdates = vi.fn((nextItems: typeof targetItems.value) => { targetItems.value = nextItems })
    const Host = defineComponent({
      setup() {
        return () => h('div', [
          h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': sourceUpdates }, { item: itemWithHandle }),
          h(SortableList, { items: rejectedItems.value, itemKey: 'id', group: 'audit' }, { item: itemWithHandle }),
          h(SortableList, { items: disabledItems.value, itemKey: 'id', group: 'tasks', disabled: true }, { item: itemWithHandle }),
          h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': targetUpdates }, { item: itemWithHandle })
        ])
      }
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const lists = wrapper.findAll('.aheart-dnd-sortable-list')
    const sourceHandle = lists[0].get('[data-handle="source"]').element as HTMLElement
    sourceHandle.focus()

    sourceHandle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }))
    await nextTick()
    await nextTick()

    expect(sourceItems.value).toEqual([])
    expect(rejectedItems.value).toEqual([{ id: 'rejected' }])
    expect(disabledItems.value).toEqual([{ id: 'disabled' }])
    expect(targetItems.value).toEqual([{ id: 'target' }, { id: 'source' }])
    expect(sourceUpdates).toHaveBeenCalledTimes(1)
    expect(targetUpdates).toHaveBeenCalledTimes(1)
    expect(lists[3].get('[data-handle="source"]').element).toBe(document.activeElement)
    const liveRegions = Array.from(document.querySelectorAll<HTMLElement>('.aheart-dnd-live-region'))
    expect(liveRegions).toHaveLength(1)
    expect(liveRegions[0].getAttribute('aria-live')).toBe('polite')
    expect(liveRegions[0].getAttribute('aria-atomic')).toBe('true')
    expect(liveRegions[0].textContent).toBe('已跨列表移动到第 2 项')

    const targetHandle = lists[3].get('[data-handle="source"]').element as HTMLElement
    targetHandle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', altKey: true, bubbles: true }))
    await nextTick()
    await nextTick()

    expect(liveRegions[0].textContent).toBe('已跨列表移动到第 1 项')
    wrapper.unmount()
    expect(document.querySelectorAll('.aheart-dnd-live-region')).toHaveLength(0)
  })

  it('moves with Alt + ArrowLeft to the previous compatible registered list', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const targetItems = ref<{ id: string }[]>([])
    const sourceUpdates = vi.fn((nextItems: typeof sourceItems.value) => { sourceItems.value = nextItems })
    const targetUpdates = vi.fn((nextItems: typeof targetItems.value) => { targetItems.value = nextItems })
    const Host = defineComponent({
      setup() {
        return () => h('div', [
          h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': targetUpdates }, { item: itemWithHandle }),
          h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': sourceUpdates }, { item: itemWithHandle })
        ])
      }
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const lists = wrapper.findAll('.aheart-dnd-sortable-list')
    const sourceHandle = lists[1].get('[data-handle="source"]').element as HTMLElement
    sourceHandle.focus()

    sourceHandle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', altKey: true, bubbles: true }))
    await nextTick()
    await nextTick()

    expect(sourceItems.value).toEqual([])
    expect(targetItems.value).toEqual([{ id: 'source' }])
    expect(sourceUpdates).toHaveBeenCalledTimes(1)
    expect(targetUpdates).toHaveBeenCalledTimes(1)
    expect(lists[0].get('[data-handle="source"]').element).toBe(document.activeElement)
    wrapper.unmount()
  })

  it('keeps source focus and suppresses success live regions when a controlled parent rejects an adjacent move', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const targetItems = ref([{ id: 'target' }])
    const sourceUpdates = vi.fn()
    const targetUpdates = vi.fn()
    const Host = defineComponent({
      setup() {
        return () => h('div', [
          h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': sourceUpdates }, { item: itemWithHandle }),
          h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': targetUpdates }, { item: itemWithHandle })
        ])
      }
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const [sourceList] = wrapper.findAll('.aheart-dnd-sortable-list')
    const sourceHandle = sourceList.get('[data-handle="source"]').element as HTMLElement
    sourceHandle.focus()
    sourceHandle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }))
    await nextTick()
    await nextTick()

    expect(sourceUpdates).toHaveBeenCalledTimes(1)
    expect(targetUpdates).toHaveBeenCalledTimes(1)
    expect(sourceItems.value).toEqual([{ id: 'source' }])
    expect(targetItems.value).toEqual([{ id: 'target' }])
    expect(document.activeElement).toBe(sourceHandle)
    const liveRegions = Array.from(document.querySelectorAll<HTMLElement>('.aheart-dnd-live-region'))
    expect(liveRegions).toHaveLength(1)
    expect(liveRegions[0].textContent).toBe('')

    wrapper.unmount()
  })

  it('uses the iframe document for handle registration and cross-list focus restoration', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const iframeDocument = iframe.contentDocument!
    const sourceItems = ref([{ id: 'source' }])
    const targetItems = ref([{ id: 'target' }])
    const Host = defineComponent({
      setup() {
        return () => h('div', [
          h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': (next: typeof sourceItems.value) => { sourceItems.value = next } }, { item: itemWithHandle }),
          h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': (next: typeof targetItems.value) => { targetItems.value = next } }, { item: itemWithHandle })
        ])
      }
    })
    const wrapper = mount(Host, { attachTo: iframeDocument.body })
    await nextTick()
    const [sourceList, targetList] = wrapper.findAll('.aheart-dnd-sortable-list')
    const sourceHandle = sourceList.get('[data-handle="source"]').element as HTMLElement
    sourceHandle.focus()
    sourceHandle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }))
    await nextTick()
    await nextTick()

    const sourceConfig = adapter.draggable.mock.calls
      .map(([config]) => config)
      .find((config) => config.getInitialData().listId === sourceList.attributes('data-aheart-sortable-list-id'))
    expect(sourceConfig.dragHandle).toBe(sourceHandle)
    expect(iframeDocument.activeElement).toBe(targetList.get('[data-handle="source"]').element)

    wrapper.unmount()
    iframe.remove()
  })

  it('does not emit a move when the last item receives Alt + ArrowDown', async () => {
    const wrapper = mount(SortableList, {
      props: { items: [{ id: 'first' }, { id: 'last' }], itemKey: 'id' },
      slots: { item: ({ item }: { item: { id: string } }) => item.id }
    })
    await nextTick()

    await wrapper.get('[data-sortable-index="1"]').trigger('keydown', { key: 'ArrowDown', altKey: true })

    expect(wrapper.emitted('update:items')).toBeUndefined()
    const liveRegions = document.querySelectorAll<HTMLElement>('.aheart-dnd-live-region')
    expect(liveRegions).toHaveLength(1)
    expect(liveRegions[0].textContent).toBe('')
    wrapper.unmount()
    expect(document.querySelectorAll('.aheart-dnd-live-region')).toHaveLength(0)
  })

  it('prevents item-level disabled records from dragging or keyboard sorting', async () => {
    const wrapper = mount(SortableList, {
      props: { items: [{ id: 'locked', disabled: true }, { id: 'open' }], itemKey: 'id' },
      slots: { item: ({ item }: { item: { id: string } }) => item.id }
    })
    await nextTick()

    const lockedConfig = adapter.draggable.mock.calls
      .map(([config]) => config)
      .findLast((config) => config.getInitialData().index === 0)
    expect(lockedConfig.canDrag()).toBe(false)
    expect(wrapper.get('[data-sortable-index="0"]').attributes('aria-disabled')).toBe('true')

    await wrapper.get('[data-sortable-index="0"]').trigger('keydown', { key: 'ArrowDown', altKey: true })
    expect(wrapper.emitted('update:items')).toBeUndefined()
  })

  it('keeps focus on the same business item after host-controlled Alt + ArrowDown sorting', async () => {
    const items = ref([{ id: 'first' }, { id: 'second' }])
    const Host = defineComponent({
      setup() {
        return () => h(SortableList, {
          items: items.value,
          itemKey: 'id',
          'onUpdate:items': (nextItems: typeof items.value) => { items.value = nextItems }
        }, {
          item: ({ item }: { item: { id: string } }) => item.id
        })
      }
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()

    const firstElement = wrapper.get('[data-sortable-index="0"]').element
    firstElement.focus()
    await wrapper.get('[data-sortable-index="0"]').trigger('keydown', { key: 'ArrowDown', altKey: true })
    await nextTick()

    expect(items.value).toEqual([{ id: 'second' }, { id: 'first' }])
    expect(wrapper.get('[data-sortable-index="1"]').element).toBe(firstElement)
    expect(document.activeElement).toBe(firstElement)
    wrapper.unmount()
  })

  it('exposes handleProps and reorders only from the registered touch handle', async () => {
    const items = ref([{ id: 'first' }, { id: 'second' }])
    const updates = vi.fn((nextItems: typeof items.value) => { items.value = nextItems })
    const changes = vi.fn()
    const Host = defineComponent({
      setup() {
        return () => [
          h(SortableList, {
            items: items.value,
            itemKey: 'id',
            'onUpdate:items': updates,
            onChange: changes
          }, {
            item: itemWithHandle
          }),
          h(DragOverlay)
        ]
      }
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const source = wrapper.get('[data-sortable-index="0"]').element as HTMLElement
    const target = wrapper.get('[data-sortable-index="1"]').element as HTMLElement
    const handle = wrapper.get('[data-handle="first"]').element as HTMLElement
    source.focus()
    const elementFromPoint = vi.fn(() => target)
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: elementFromPoint })

    handle.dispatchEvent(touchPointer('pointerdown', 7, 10, 10))
    document.dispatchEvent(touchPointer('pointermove', 7, 10, 32))
    await nextTick()

    const sourceConfig = adapter.draggable.mock.calls
      .map(([config]) => config)
      .findLast((config) => config.getInitialData().index === 0)
    expect(sourceConfig.dragHandle).toBe(handle)
    expect(currentDragData.value).toMatchObject({ type: 'aheart-sortable', index: 0 })
    expect(source.classList.contains('aheart-dnd-dragging')).toBe(true)
    expect(document.querySelector('.aheart-dnd-overlay')).not.toBeNull()

    document.dispatchEvent(touchPointer('pointerup', 7, 10, 48))
    await nextTick()

    expect(items.value).toEqual([{ id: 'second' }, { id: 'first' }])
    expect(updates).toHaveBeenCalledTimes(1)
    expect(changes).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(source)
    expect(currentDragData.value).toBeUndefined()
    expect(source.classList.contains('aheart-dnd-dragging')).toBe(false)
    expect(document.querySelector('.aheart-dnd-overlay')).toBeNull()

    delete (document as Partial<Document>).elementFromPoint
    wrapper.unmount()
  })

  it('leaves touch movement from legacy item content to native scrolling', async () => {
    const wrapper = mount(SortableList, {
      props: { items: [{ id: 'first' }, { id: 'second' }], itemKey: 'id' },
      slots: { item: ({ item }: { item: { id: string } }) => h('span', { 'data-legacy-body': item.id }, item.id) },
      attachTo: document.body
    })
    await nextTick()
    const body = wrapper.get('[data-legacy-body="first"]').element

    body.dispatchEvent(touchPointer('pointerdown', 12, 10, 10))
    const move = touchPointer('pointermove', 12, 10, 32)
    document.dispatchEvent(move)
    await nextTick()
    const dragStateDuringMove = currentDragData.value
    wrapper.unmount()

    expect(dragStateDuringMove).toBeUndefined()
    expect(move.defaultPrevented).toBe(false)
  })

  it('clears an active touch pointer sort on cancel and unmount without committing', async () => {
    const wrapper = mount(SortableList, {
      props: { items: [{ id: 'first' }, { id: 'second' }], itemKey: 'id' },
      slots: { item: itemWithHandle },
      attachTo: document.body
    })
    await nextTick()
    const source = wrapper.get('[data-sortable-index="0"]').element
    const handle = wrapper.get('[data-handle="first"]').element

    handle.dispatchEvent(touchPointer('pointerdown', 8, 10, 10))
    document.dispatchEvent(touchPointer('pointermove', 8, 10, 32))
    await nextTick()
    expect(currentDragData.value).toBeDefined()

    document.dispatchEvent(touchPointer('pointercancel', 8, 10, 32))
    await nextTick()
    expect(currentDragData.value).toBeUndefined()
    expect(wrapper.emitted('update:items')).toBeUndefined()

    handle.dispatchEvent(touchPointer('pointerdown', 9, 10, 10))
    document.dispatchEvent(touchPointer('pointermove', 9, 10, 32))
    await nextTick()
    expect(currentDragData.value).toBeDefined()

    wrapper.unmount()
    expect(currentDragData.value).toBeUndefined()
    document.dispatchEvent(touchPointer('pointerup', 9, 10, 48))
    expect(wrapper.emitted('update:items')).toBeUndefined()
  })

  it.each(['blur', 'pagehide', 'visibilitychange'] as const)('clears an active touch sort on %s without committing', async (interruption) => {
    const wrapper = mount(SortableList, {
      props: { items: [{ id: 'first' }, { id: 'second' }], itemKey: 'id' },
      slots: { item: itemWithHandle },
      attachTo: document.body
    })
    await nextTick()
    const source = wrapper.get('[data-sortable-index="0"]').element
    const target = wrapper.get('[data-sortable-index="1"]').element
    const handle = wrapper.get('[data-handle="first"]').element
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => target })

    handle.dispatchEvent(touchPointer('pointerdown', 13, 10, 10))
    document.dispatchEvent(touchPointer('pointermove', 13, 10, 32))
    await nextTick()

    let visibility: ReturnType<typeof vi.spyOn> | undefined
    if (interruption === 'visibilitychange') {
      visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
      document.dispatchEvent(new Event('visibilitychange'))
    } else {
      window.dispatchEvent(new Event(interruption))
    }
    await nextTick()
    const stateAfterInterruption = currentDragData.value
    const draggingAfterInterruption = source.classList.contains('aheart-dnd-dragging')
    document.dispatchEvent(touchPointer('pointerup', 13, 10, 48))
    await nextTick()
    visibility?.mockRestore()
    delete (document as Partial<Document>).elementFromPoint

    expect(stateAfterInterruption).toBeUndefined()
    expect(draggingAfterInterruption).toBe(false)
    expect(wrapper.emitted('update:items')).toBeUndefined()
    wrapper.unmount()
  })

  it('does not touch-sort onto a disabled item', async () => {
    const items = ref([{ id: 'first' }, { id: 'locked', disabled: true }])
    const updates = vi.fn((nextItems: typeof items.value) => { items.value = nextItems })
    const Host = defineComponent({
      setup() {
        return () => h(SortableList, {
          items: items.value,
          itemKey: 'id',
          'onUpdate:items': updates
        }, {
          item: itemWithHandle
        })
      }
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const source = wrapper.get('[data-sortable-index="0"]').element
    const target = wrapper.get('[data-sortable-index="1"]').element
    const handle = wrapper.get('[data-handle="first"]').element
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => target })

    handle.dispatchEvent(touchPointer('pointerdown', 10, 10, 10))
    document.dispatchEvent(touchPointer('pointermove', 10, 10, 32))
    document.dispatchEvent(touchPointer('pointerup', 10, 10, 48))
    await nextTick()
    delete (document as Partial<Document>).elementFromPoint

    expect(items.value).toEqual([{ id: 'first' }, { id: 'locked', disabled: true }])
    expect(updates).not.toHaveBeenCalled()
    expect(currentDragData.value).toBeUndefined()
    wrapper.unmount()
  })

  it('relinquishes a touch fallback when a native drag starts so pointerup cannot double-submit', async () => {
    const wrapper = mount(SortableList, {
      props: { items: [{ id: 'first' }, { id: 'second' }], itemKey: 'id' },
      slots: { item: itemWithHandle },
      attachTo: document.body
    })
    await nextTick()
    const source = wrapper.get('[data-sortable-index="0"]').element
    const handle = wrapper.get('[data-handle="first"]').element

    handle.dispatchEvent(touchPointer('pointerdown', 11, 10, 10))
    document.dispatchEvent(touchPointer('pointermove', 11, 10, 32))
    source.dispatchEvent(new Event('dragstart', { bubbles: true, cancelable: true }))
    document.dispatchEvent(touchPointer('pointerup', 11, 10, 48))

    expect(wrapper.emitted('update:items')).toBeUndefined()
    expect(source.classList.contains('aheart-dnd-dragging')).toBe(false)
    adapter.draggable.mock.calls.at(-1)?.[0].onDrop()
    expect(currentDragData.value).toBeUndefined()
    wrapper.unmount()
  })

  it('applies dynamic list disabled state to keyboard sorting and adapter guards', async () => {
    const disabled = ref(false)
    const items = ref([{ id: 'first' }, { id: 'second' }])
    const Host = defineComponent({
      setup() {
        return () => h(SortableList, {
          items: items.value,
          itemKey: 'id',
          disabled: disabled.value,
          'onUpdate:items': (nextItems: typeof items.value) => { items.value = nextItems }
        }, {
          item: ({ item }: { item: { id: string } }) => item.id
        })
      }
    })
    const wrapper = mount(Host)
    await nextTick()
    const draggableConfig = adapter.draggable.mock.calls[0][0]
    const dropTargetConfig = adapter.dropTargetForElements.mock.calls[0][0]

    disabled.value = true
    await nextTick()
    expect(wrapper.get('[data-sortable-index="0"]').attributes('aria-disabled')).toBe('true')
    expect(draggableConfig.canDrag()).toBe(false)
    expect(dropTargetConfig.canDrop({ source: { data: { type: 'aheart-sortable' } } })).toBe(false)
    await wrapper.get('[data-sortable-index="0"]').trigger('keydown', { key: 'ArrowDown', altKey: true })
    expect(items.value).toEqual([{ id: 'first' }, { id: 'second' }])

    disabled.value = false
    await nextTick()
    expect(wrapper.get('[data-sortable-index="0"]').attributes('aria-disabled')).toBeUndefined()
    expect(draggableConfig.canDrag()).toBe(true)
    expect(dropTargetConfig.canDrop({ source: { data: { type: 'aheart-sortable' } } })).toBe(true)
    await wrapper.get('[data-sortable-index="0"]').trigger('keydown', { key: 'ArrowDown', altKey: true })
    expect(items.value).toEqual([{ id: 'second' }, { id: 'first' }])
    wrapper.unmount()
  })

  it('cleans adapter registrations on host unmount and ignores keyboard events on detached items', async () => {
    const wrapper = mount(SortableList, {
      props: { items: [{ id: 'first' }], itemKey: 'id' },
      slots: { item: ({ item }: { item: { id: string } }) => item.id }
    })
    await nextTick()
    const detachedItem = wrapper.get('[data-sortable-index="0"]').element

    wrapper.unmount()
    cleanupFns.forEach((cleanup) => expect(cleanup).toHaveBeenCalledTimes(1))
    detachedItem.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true, bubbles: true }))
    expect(wrapper.emitted('update:items')).toBeUndefined()
  })

  it('handles a nested drop only at the innermost target', async () => {
    const innerDrop = vi.fn()
    const wrapper = mount(DropZone, {
      props: { accept: 'task' },
      slots: {
        default: () => h(DropZone, { accept: 'task', onDrop: innerDrop }, { default: () => 'inner' })
      }
    })
    await nextTick()

    const [outerConfig, innerConfig] = adapter.dropTargetForElements.mock.calls
      .slice(-2)
      .map(([config]) => config)
    const source = { data: { type: 'task', id: '1' } }
    const dropTargets = [
      { element: innerConfig.element, data: innerConfig.getData() },
      { element: outerConfig.element, data: outerConfig.getData() }
    ]

    innerConfig.onDrop({ source, self: dropTargets[0], location: { current: { dropTargets } } })
    outerConfig.onDrop({ source, self: dropTargets[1], location: { current: { dropTargets } } })

    expect(innerDrop).toHaveBeenCalledWith(source.data)
    expect(wrapper.emitted('drop')).toBeUndefined()
    wrapper.unmount()
  })

  it('clears global drag state when the draggable is unmounted after drag start', async () => {
    const wrapper = mount(Draggable, { props: { data: { type: 'task', id: '1' } } })
    await nextTick()
    const config = adapter.draggable.mock.calls.at(-1)?.[0]
    const dragEnd = vi.fn()
    window.addEventListener('dragend', dragEnd, { once: true })

    config.onDragStart()
    expect(currentDragData.value).toEqual({ type: 'task', id: '1' })

    wrapper.unmount()

    expect(dragEnd).toHaveBeenCalledOnce()
    expect(currentDragData.value).toBeUndefined()
  })
})
