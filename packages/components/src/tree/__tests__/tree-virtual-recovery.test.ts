import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Tree from '../tree.vue'

type ControlledObserver = {
  elements: Set<Element>
  disconnected: boolean
  callback: ResizeObserverCallback
}

const observers: ControlledObserver[] = []
const trackedWrappers: Array<ReturnType<typeof mount>> = []
let previousResizeObserver: PropertyDescriptor | undefined
let previousRequestAnimationFrame: PropertyDescriptor | undefined
let previousCancelAnimationFrame: PropertyDescriptor | undefined

class ControlledResizeObserver {
  readonly elements = new Set<Element>()
  disconnected = false

  constructor(readonly callback: ResizeObserverCallback) {
    observers.push(this)
  }

  observe(element: Element) {
    this.elements.add(element)
  }

  unobserve(element: Element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.disconnected = true
    this.elements.clear()
  }
}

const data = () => Array.from({ length: 100 }, (_, key) => ({ key, title: `Node ${key}` }))

const mountTree = (options?: any) => {
  const wrapper = mount(Tree, options)
  trackedWrappers.push(wrapper)
  return wrapper
}

const adapter = (wrapper: any) => wrapper.vm.$.setupState.virtualAdapter.virtualizer.value

beforeEach(() => {
  observers.length = 0
  previousResizeObserver = Object.getOwnPropertyDescriptor(window, 'ResizeObserver')
  previousRequestAnimationFrame = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame')
  previousCancelAnimationFrame = Object.getOwnPropertyDescriptor(window, 'cancelAnimationFrame')
  Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: ControlledResizeObserver })
  Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: vi.fn().mockReturnValue(1) })
  Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: vi.fn() })
})

afterEach(() => {
  for (const wrapper of trackedWrappers.splice(0)) wrapper.unmount()
  if (previousResizeObserver) Object.defineProperty(window, 'ResizeObserver', previousResizeObserver)
  else Reflect.deleteProperty(window, 'ResizeObserver')
  if (previousRequestAnimationFrame) Object.defineProperty(window, 'requestAnimationFrame', previousRequestAnimationFrame)
  else Reflect.deleteProperty(window, 'requestAnimationFrame')
  if (previousCancelAnimationFrame) Object.defineProperty(window, 'cancelAnimationFrame', previousCancelAnimationFrame)
  else Reflect.deleteProperty(window, 'cancelAnimationFrame')
  previousResizeObserver = undefined
  previousRequestAnimationFrame = undefined
  previousCancelAnimationFrame = undefined
})

describe('Tree virtual implementation recovery RED', () => {
  it('disconnects the active observer set when virtualization is disabled', async () => {
    const wrapper = mountTree({
      attachTo: document.body,
      props: { virtual: true, treeData: data() } as never
    })
    await nextTick()
    await wrapper.setProps({ disabled: true } as never)
    const active = observers.filter(observer => !observer.disconnected).length
    console.log('DISABLED_ACTIVE_OBSERVERS', active, 'VIRTUALIZER_ENABLED', adapter(wrapper).options.enabled)
    wrapper.unmount()
    expect(active).toBe(0)
  })

  it('retains measured mounted row dimensions when estimateSize changes', async () => {
    const spy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const height = this.matches('.aheart-tree') ? 320 : 56
      return { height, width: 400, top: 0, left: 0, right: 400, bottom: height, x: 0, y: 0, toJSON() {} } as DOMRect
    })
    const wrapper = mountTree({
      attachTo: document.body,
      props: { virtual: true, treeData: data() } as never
    })
    await nextTick()
    const before = adapter(wrapper).getVirtualItems()[0].size
    await wrapper.setProps({ virtual: { estimateSize: 40 } } as never)
    await nextTick()
    const after = adapter(wrapper).getVirtualItems()[0].size
    console.log('ESTIMATE_CHANGE', before, after, 'ROWS_OBS', observers.filter(observer => !observer.disconnected).length)
    wrapper.unmount()
    spy.mockRestore()
    expect(after).toBe(56)
  })

  it('invalidates a same-key replacement instead of retaining an offscreen measurement', async () => {
    const original = data()
    const wrapper = mountTree({
      attachTo: document.body,
      props: { virtual: true, treeData: original } as never
    })
    await nextTick()
    const virtualizer = adapter(wrapper)
    virtualizer.resizeItem(50, 112)
    await nextTick()
    await wrapper.setProps({ treeData: original.map(node => node.key === 50 ? { ...node, title: 'Replacement short row' } : node) } as never)
    await nextTick()
    const cached = virtualizer.itemSizeCache.get('n-35-30')
    console.log('REPLACED_OFFSCREEN_CACHE', cached)
    wrapper.unmount()
    expect(cached).not.toBe(112)
  })

  it('does not restore focus to a parent after the child explicitly blurred before collapse', async () => {
    const wrapper = mountTree({
      attachTo: document.body,
      props: {
        virtual: true,
        treeData: [{ key: 'parent', title: 'Parent', children: [{ key: 'child', title: 'Child' }] }],
        expandedKeys: ['parent']
      } as never
    })
    await nextTick()
    const child = wrapper.get('[data-tree-key="child"]').element as HTMLElement
    child.focus()
    child.blur()
    await nextTick()
    await wrapper.setProps({ expandedKeys: [] } as never)
    await nextTick()
    const active = document.activeElement?.getAttribute('data-tree-key')
    console.log('EXPLICIT_BLUR_COLLAPSE', active)
    wrapper.unmount()
    expect(active).toBe(null)
  })
})
