import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import Draggable from '../draggable.vue'
import DropZone from '../drop-zone.vue'
import SortableList from '../sortable-list.vue'

const adapter = vi.hoisted(() => ({
  draggable: vi.fn(() => vi.fn()),
  dropTargetForElements: vi.fn(() => vi.fn())
}))

vi.mock('@atlaskit/pragmatic-drag-and-drop/element/adapter', () => adapter)
vi.mock('@atlaskit/pragmatic-drag-and-drop/reorder', () => ({
  reorder: <T>({ list, startIndex, finishIndex }: { list: T[]; startIndex: number; finishIndex: number }) => {
    const next = [...list]
    const [item] = next.splice(startIndex, 1)
    next.splice(finishIndex, 0, item)
    return next
  }
}))

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
})
