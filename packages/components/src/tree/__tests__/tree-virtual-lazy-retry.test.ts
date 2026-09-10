import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Tree from '../tree.vue'

type ControlledObserver = {
  callback: ResizeObserverCallback
  disconnect: ReturnType<typeof vi.fn>
}

const observers: ControlledObserver[] = []
const trackedWrappers: Array<ReturnType<typeof mount>> = []
let previousResizeObserver: PropertyDescriptor | undefined
let previousRequestAnimationFrame: PropertyDescriptor | undefined
let previousCancelAnimationFrame: PropertyDescriptor | undefined

class ControlledResizeObserver {
  readonly disconnect = vi.fn()

  constructor(readonly callback: ResizeObserverCallback) {
    observers.push(this)
  }

  observe() {}
  unobserve() {}
}

const mountTree = (options?: any) => {
  const wrapper = mount(Tree, options)
  trackedWrappers.push(wrapper)
  return wrapper
}

const flushOwnerRealm = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}

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

describe('Tree virtual lazy retry focus', () => {
  it('focuses the owning root after retry success and reaches its loaded child with ArrowRight', async () => {
    const loadData = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce([{ key: 'child', title: 'Loaded child' }])
    const wrapper = mountTree({
      attachTo: document.body,
      props: {
        virtual: true,
        treeData: [{ key: 'root', title: 'Lazy root', isLeaf: false }],
        loadData
      } as never
    })

    await flushOwnerRealm()
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushOwnerRealm()
    const retry = wrapper.get('[aria-label="重试加载 Lazy root"]').element as HTMLButtonElement
    retry.focus()
    expect(document.activeElement).toBe(retry)

    // Native button activation is the jsdom-equivalent of browser Enter/Space
    // activation; the browser E2E separately covers trusted key activation.
    retry.click()
    await flushOwnerRealm()
    expect(loadData).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('Loaded child')

    const root = wrapper.get('[data-tree-key="root"]')
    expect(document.activeElement).toBe(root.element)
    await root.trigger('keydown', { key: 'ArrowRight' })
    await flushOwnerRealm()
    expect(document.activeElement).toBe(wrapper.get('[data-tree-key="child"]').element)
  })

  it('does not reclaim focus after retry is blurred before Vue flushes success', async () => {
    const loadData = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce([{ key: 'child', title: 'Loaded child' }])
    const wrapper = mountTree({
      attachTo: document.body,
      props: { virtual: true, treeData: [{ key: 'root', title: 'Lazy root', isLeaf: false }], loadData } as never
    })
    await flushOwnerRealm()
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushOwnerRealm()
    const retry = wrapper.get('[aria-label="重试加载 Lazy root"]').element as HTMLButtonElement
    retry.focus()
    retry.click()
    retry.blur()
    await flushOwnerRealm()
    expect(loadData).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('Loaded child')
    expect(document.activeElement).toBe(document.body)
  })

  it('preserves focus on an external button when retry success resolves', async () => {
    const loadData = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce([{ key: 'child', title: 'Loaded child' }])
    const outside = document.createElement('button')
    document.body.append(outside)
    const wrapper = mountTree({
      attachTo: document.body,
      props: { virtual: true, treeData: [{ key: 'root', title: 'Lazy root', isLeaf: false }], loadData } as never
    })
    await flushOwnerRealm()
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushOwnerRealm()
    const retry = wrapper.get('[aria-label="重试加载 Lazy root"]').element as HTMLButtonElement
    retry.focus()
    retry.click()
    outside.focus()
    await flushOwnerRealm()
    expect(loadData).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('Loaded child')
    expect(document.activeElement).toBe(outside)
    outside.remove()
  })
})
