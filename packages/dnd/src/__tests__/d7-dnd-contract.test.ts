import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Draggable from '../draggable.vue'
import DropZone from '../drop-zone.vue'
import SortableList from '../sortable-list.vue'
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
  document.querySelectorAll('.aheart-dnd-live-region').forEach((node) => node.remove())
  vi.restoreAllMocks()
})

const sortableItem = (item: { id: string }) => item.id
const sourceConfig = () => adapter.draggable.mock.calls
  .map(([config]) => config as any)
  .find((config) => config.getInitialData().itemKey === 'source' || config.getInitialData().index === 0)
const targetConfig = (listId: string, itemKey: string, index: number) => adapter.dropTargetForElements.mock.calls
  .map(([config]) => config as any)
  .find((config) => {
    const data = config.getData()
    return data.listId === listId && (data.itemKey === itemKey || data.position?.itemKey === itemKey || data.index === index)
  })

describe('D7 RED contract: stable identity and controlled transactions', () => {
  it('rejects a drop after insertion instead of moving the old index', async () => {
    const items = ref([{ id: 'source' }, { id: 'target' }])
    const Host = defineComponent({
      setup() {
        return () => h(SortableList, {
          items: items.value,
          itemKey: 'id',
          'onUpdate:items': (next: typeof items.value) => { items.value = next }
        }, { item: ({ item }: { item: { id: string } }) => sortableItem(item) })
      }
    })
    const wrapper = mount(Host)
    await nextTick()
    const source = sourceConfig()
    const listId = source.getInitialData().listId
    const target = targetConfig(listId, 'target', 1)
    source.onDragStart()
    const sourceData = source.getInitialData()
    items.value = [{ id: 'inserted' }, { id: 'source' }, { id: 'target' }]
    await nextTick()

    target.onDrop({ source: { data: sourceData } })

    expect(items.value.map((item) => item.id)).toEqual(['inserted', 'source', 'target'])
    expect(wrapper.emitted('update:items')).toBeUndefined()
    wrapper.unmount()
  })

  it('rejects a stale explicit revision before emitting any update', async () => {
    const items = ref([{ id: 'source' }, { id: 'target' }])
    const wrapper = mount(SortableList, {
      props: { items: items.value, itemKey: 'id', revision: 1, 'onUpdate:items': (next: typeof items.value) => { items.value = next } },
      slots: { item: ({ item }: { item: { id: string } }) => sortableItem(item) }
    })
    await nextTick()
    const source = sourceConfig()
    const target = targetConfig(source.getInitialData().listId, 'target', 1)
    source.onDragStart()
    const sourceData = source.getInitialData()
    await wrapper.setProps({ revision: 2 })
    target.onDrop({ source: { data: sourceData } })

    expect(wrapper.emitted('update:items')).toBeUndefined()
    wrapper.unmount()
  })

  it('rolls back the accepted source when the target parent rejects a cross-list move', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const targetItems = ref([{ id: 'target' }])
    const Host = defineComponent({
      setup() {
        return () => h('div', [
          h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': (next: typeof sourceItems.value) => { sourceItems.value = next } }),
          h(SortableList, { items: targetItems.value, itemKey: 'id', group: 'tasks', 'onUpdate:items': () => undefined })
        ])
      }
    })
    const wrapper = mount(Host)
    await nextTick()
    const source = adapter.draggable.mock.calls.find(([config]) => config.getInitialData().group === 'tasks')?.[0] as any
    const targetListId = adapter.dropTargetForElements.mock.calls
      .map(([config]) => config as any)
      .find((config) => {
        const data = config.getData()
        return data.group === 'tasks' && data.listId !== source.getInitialData().listId && (data.itemKey === 'target' || data.position?.itemKey === 'target' || data.index === 0)
      })
    targetListId.onDrop({ source: { data: source.getInitialData() } })
    await nextTick()
    await nextTick()

    expect(sourceItems.value).toEqual([{ id: 'source' }])
    expect(targetItems.value).toEqual([{ id: 'target' }])
    expect(document.querySelector('.aheart-dnd-live-region')?.textContent ?? '').toMatch(/拒绝|回滚|失败/)
    wrapper.unmount()
  })
})

describe('D7 RED contract: generic keyboard and rejection announcements', () => {
  it('supports Space/Enter grab, Escape cancel, and one keyboard drop for generic adapters', async () => {
    const source = mount(Draggable, { props: { data: { type: 'task', id: '1' }, keyboard: true, label: '任务一' } })
    const target = mount(DropZone, { props: { accept: 'task', keyboard: true, label: '目标区' } })
    await nextTick()
    const sourceRoot = source.element as HTMLElement
    const targetRoot = target.element as HTMLElement
    sourceRoot.focus()
    sourceRoot.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    sourceRoot.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    sourceRoot.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    targetRoot.focus()
    targetRoot.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    targetRoot.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(source.emitted('dragStart')).toHaveLength(2)
    expect(target.emitted('drop')).toHaveLength(1)
    expect(source.emitted('keyboardGrab')).toHaveLength(2)
    expect(source.emitted('keyboardCancel')).toHaveLength(1)
    expect(target.emitted('keyboardDrop')).toHaveLength(1)
    source.unmount()
    target.unmount()
  })

  it('keeps an incompatible generic keyboard zone focusable but rejects and announces the reason', async () => {
    const source = mount(Draggable, { props: { data: { type: 'task' }, keyboard: true, label: '任务' } })
    const target = mount(DropZone, { props: { accept: 'note', keyboard: true, label: '笔记区' } })
    await nextTick()
    const sourceRoot = source.element as HTMLElement
    const targetRoot = target.element as HTMLElement
    sourceRoot.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    targetRoot.focus()
    targetRoot.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

    expect(targetRoot.tabIndex).toBe(0)
    expect(target.emitted('drop')).toBeUndefined()
    expect(document.querySelector('.aheart-dnd-live-region')?.textContent).toMatch(/类型|不匹配|拒绝/)
    source.unmount()
    target.unmount()
  })

  it('announces a sortable rejection when the destination group is incompatible', async () => {
    const sourceItems = ref([{ id: 'source' }])
    const wrapper = mount(defineComponent({
      setup: () => () => h('div', [
        h(SortableList, { items: sourceItems.value, itemKey: 'id', group: 'tasks' }),
        h(SortableList, { items: [{ id: 'audit' }], itemKey: 'id', group: 'audit' })
      ])
    }))
    await nextTick()
    const source = adapter.draggable.mock.calls.find(([config]) => config.getInitialData().group === 'tasks')?.[0] as any
    const rejected = adapter.dropTargetForElements.mock.calls
      .map(([config]) => config as any)
      .find((config) => config.getData().group === 'audit' && config.getData().index === 0)
    rejected.onDrop({ source: { data: source.getInitialData() } })
    await nextTick()

    expect(document.querySelector('.aheart-dnd-live-region')?.textContent ?? '').toMatch(/拒绝|分组|兼容|失败/)
    wrapper.unmount()
  })
})

describe('D7 RED contract: owner realm and lifecycle isolation', () => {
  it('uses the iframe owner window for auto-scroll discovery', () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const ownerDocument = iframe.contentDocument!
    const ownerWindow = ownerDocument.defaultView!
    const region = ownerDocument.createElement('div')
    const list = ownerDocument.createElement('ul')
    region.append(list)
    ownerDocument.body.append(region)
    const mainStyle = vi.spyOn(window, 'getComputedStyle').mockImplementation(() => {
      throw new Error('main realm style lookup used')
    })
    const ownerStyle = vi.spyOn(ownerWindow, 'getComputedStyle').mockReturnValue({ overflowX: 'auto', overflowY: 'auto' } as CSSStyleDeclaration)

    expect(() => registerSortableAutoScroll(list)).not.toThrow()
    expect(ownerStyle).toHaveBeenCalled()
    expect(mainStyle).not.toHaveBeenCalled()
    iframe.remove()
  })

  it('ignores a late drop after scope change or unmount', async () => {
    const items = ref([{ id: 'source' }, { id: 'target' }])
    const wrapper = mount(SortableList, {
      props: { items: items.value, itemKey: 'id', scopeKey: 'route-a', 'onUpdate:items': (next: typeof items.value) => { items.value = next } },
      slots: { item: ({ item }: { item: { id: string } }) => sortableItem(item) }
    })
    await nextTick()
    const source = sourceConfig()
    const target = targetConfig(source.getInitialData().listId, 'target', 1)
    source.onDragStart()
    const sourceData = source.getInitialData()
    await wrapper.setProps({ scopeKey: 'route-b' })
    target.onDrop({ source: { data: sourceData } })
    expect(wrapper.emitted('update:items')).toBeUndefined()
    wrapper.unmount()
    target.onDrop({ source: { data: sourceData } })
    expect(items.value).toEqual([{ id: 'source' }, { id: 'target' }])
  })
})
