import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Draggable from '../draggable.vue'
import DropZone from '../drop-zone.vue'
import { currentDragData } from '../drag-state'
import SortableList from '../sortable-list.vue'
import { registerSortableAutoScroll } from '../sortable-auto-scroll'

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
  autoScrollForElements: vi.fn(() => vi.fn())
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

describe('sortable auto-scroll registration', () => {
  it('registers the nearest scrollable ancestor once and releases it after all lists unmount', () => {
    const scrollRegion = document.createElement('div')
    const firstList = document.createElement('ul')
    const secondList = document.createElement('ul')
    const staticList = document.createElement('ul')
    scrollRegion.append(firstList, secondList)
    document.body.append(scrollRegion, staticList)
    Object.defineProperties(scrollRegion, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 200 },
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 100 }
    })
    const getComputedStyle = vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => ({
      overflowX: element === scrollRegion ? 'auto' : 'visible',
      overflowY: element === scrollRegion ? 'auto' : 'visible'
    }) as CSSStyleDeclaration)

    const releaseFirst = registerSortableAutoScroll(firstList)
    const releaseSecond = registerSortableAutoScroll(secondList)
    const releaseStatic = registerSortableAutoScroll(staticList)

    expect(autoScroll.autoScrollForElements).toHaveBeenCalledTimes(1)
    expect(autoScroll.autoScrollForElements).toHaveBeenCalledWith({ element: scrollRegion })

    releaseFirst()
    expect(autoScroll.autoScrollForElements.mock.results[0].value).not.toHaveBeenCalled()
    releaseSecond()
    expect(autoScroll.autoScrollForElements.mock.results[0].value).toHaveBeenCalledTimes(1)
    releaseStatic()
    getComputedStyle.mockRestore()
    scrollRegion.remove()
    staticList.remove()
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
  })

  it('moves items between sortable lists in the same group', async () => {
    const sourceList = mount(SortableList, {
      props: { items: [{ id: 'source' }], itemKey: 'id', group: 'tasks' },
      slots: { item: ({ item }: { item: { id: string } }) => item.id }
    })
    const targetList = mount(SortableList, {
      props: { items: [{ id: 'target' }], itemKey: 'id', group: 'tasks' },
      slots: { item: ({ item }: { item: { id: string } }) => item.id }
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
    const sourceList = mount(SortableList, { props: { items: [{ id: 'source' }], itemKey: 'id' } })
    const targetList = mount(SortableList, { props: { items: [{ id: 'target' }], itemKey: 'id' } })
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
    const sourceList = mount(SortableList, { props: { items: [{ id: 'source' }], itemKey: 'id', group: 'empty' } })
    const targetList = mount(SortableList, { props: { items: [], itemKey: 'id', group: 'empty' } })
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

  it('does not emit a move when the last item receives Alt + ArrowDown', async () => {
    const wrapper = mount(SortableList, {
      props: { items: [{ id: 'first' }, { id: 'last' }], itemKey: 'id' },
      slots: { item: ({ item }: { item: { id: string } }) => item.id }
    })
    await nextTick()

    await wrapper.get('[data-sortable-index="1"]').trigger('keydown', { key: 'ArrowDown', altKey: true })

    expect(wrapper.emitted('update:items')).toBeUndefined()
    expect(wrapper.get('.aheart-dnd-live-region').text()).toBe('')
    wrapper.unmount()
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

    config.onDragStart()
    expect(currentDragData.value).toEqual({ type: 'task', id: '1' })

    wrapper.unmount()

    expect(currentDragData.value).toBeUndefined()
  })
})
