import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Tree from '../tree.vue'
import TreeSelect from '../../tree-select/tree-select.vue'

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

const prepareCollapsedRetry = async (treeSelect = false) => {
  const calls: AbortSignal[] = []
  const loadData = vi.fn((_node: unknown, context: { signal: AbortSignal }) => {
    calls.push(context.signal)
    return calls.length === 1 ? Promise.reject(new Error('offline')) : new Promise<unknown[]>(() => {})
  })
  const wrapper = treeSelect
    ? mount(TreeSelect, { attachTo: document.body, props: { treeData: [{ key: 'root', title: 'Lazy root', isLeaf: false }], virtual: true, open: true, loadData, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! } as never })
    : mountTree({ attachTo: document.body, props: { virtual: true, treeData: [{ key: 'root', title: 'Lazy root', isLeaf: false }], loadData } as never })
  await flushOwnerRealm()
  await wrapper.get('.aheart-tree__switcher').trigger('click')
  await flushOwnerRealm()
  expect(loadData).toHaveBeenCalledTimes(1)
  await wrapper.get('.aheart-tree__switcher').trigger('click')
  await flushOwnerRealm()
  expect(wrapper.get('[data-tree-key="root"]').attributes('aria-expanded')).toBe('false')
  const retry = wrapper.get('[aria-label="重试加载 Lazy root"]').element as HTMLButtonElement
  retry.focus()
  await flushOwnerRealm()
  return { wrapper, loadData, calls, retry }
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

  it('does not reclaim focus after a microtask external focus then blur while retry is pending', async () => {
    let resolveRetry!: (nodes: Array<{ key: string; title: string }>) => void
    const retryPromise = new Promise<Array<{ key: string; title: string }>>(resolve => { resolveRetry = resolve })
    const loadData = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockReturnValueOnce(retryPromise)
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
    await Promise.resolve()
    outside.focus()
    outside.blur()
    resolveRetry([{ key: 'child', title: 'Loaded child' }])
    await flushOwnerRealm()
    expect(document.activeElement).toBe(document.body)
    outside.remove()
  })

  it('does not start a second loader after retry and same-turn standalone unmount', async () => {
    const { wrapper, loadData, retry } = await prepareCollapsedRetry()
    retry.click()
    wrapper.unmount()
    await flushOwnerRealm()
    expect(loadData).toHaveBeenCalledTimes(1)
  })

  it('does not start a second loader after retry and same-turn controlled TreeSelect close', async () => {
    const { wrapper, loadData, retry } = await prepareCollapsedRetry(true)
    retry.click()
    await wrapper.setProps({ open: false } as never)
    await flushOwnerRealm()
    expect(loadData).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['disabled', { disabled: true }],
    ['removed', { treeData: [] }],
    ['replaced', { treeData: [{ key: 'replacement', title: 'Replacement', isLeaf: false }] }]
  ])('does not start a second loader after retry and same-turn %s transition', async (_label, nextProps) => {
    const { wrapper, loadData, retry } = await prepareCollapsedRetry()
    retry.click()
    await wrapper.setProps(nextProps as never)
    await flushOwnerRealm()
    expect(loadData).toHaveBeenCalledTimes(1)
    if (_label === 'disabled') expect(document.activeElement?.getAttribute('data-tree-key')).not.toBe('root')
  })

  it('starts one retry after an already-expanded path without an extra expand event', async () => {
    const { wrapper, loadData, retry } = await prepareCollapsedRetry()
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushOwnerRealm()
    const expandCount = wrapper.emitted('expand')?.length
    retry.click()
    await flushOwnerRealm()
    expect(loadData).toHaveBeenCalledTimes(2)
    expect(wrapper.emitted('expand')?.length).toBe(expandCount)
  })

  it('does not reclaim focus after a collapsed retry control is synchronously blurred', async () => {
    const { retry } = await prepareCollapsedRetry()
    retry.click()
    retry.blur()
    await flushOwnerRealm()
    expect(document.activeElement).toBe(document.body)
  })

  it('keeps a parent-rejected expandedKeys collapse closed and does not retry load', async () => {
    const { wrapper, loadData, retry } = await prepareCollapsedRetry()
    await wrapper.setProps({ expandedKeys: [] } as never)
    retry.click()
    await flushOwnerRealm()
    expect(loadData).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[data-tree-key="root"]').attributes('aria-expanded')).toBe('false')
  })

  it('starts one retry when a controlled expandedKeys parent accepts the focus expansion', async () => {
    const prepared = await prepareCollapsedRetry()
    await prepared.wrapper.setProps({
      expandedKeys: [],
      'onUpdate:expandedKeys': (keys: unknown[]) => { void prepared.wrapper.setProps({ expandedKeys: keys } as never) }
    } as never)
    prepared.retry.click()
    await flushOwnerRealm()
    expect(prepared.loadData).toHaveBeenCalledTimes(2)
    expect(prepared.wrapper.get('[data-tree-key="root"]').attributes('aria-expanded')).toBe('true')
  })

  it('does not retry load when the native switcher collapses again in the same turn', async () => {
    const { wrapper, loadData, retry } = await prepareCollapsedRetry()
    retry.click()
    ;(wrapper.get('.aheart-tree__switcher').element as HTMLButtonElement).click()
    await flushOwnerRealm()
    expect(loadData).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[data-tree-key="root"]').attributes('aria-expanded')).toBe('false')
  })
})
