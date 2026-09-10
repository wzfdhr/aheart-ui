import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TreeSelect from '../tree-select.vue'

type Nodes = Array<{ key: string; title: string }>
const wrappers: Array<ReturnType<typeof mount>> = []

const settle = async () => { await nextTick(); await flushPromises(); await nextTick() }

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class RetryResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
})

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

const prepareRetry = async (pending = false) => {
  let resolveRetry: ((nodes: Nodes) => void) | undefined
  const loadData = vi.fn()
    .mockRejectedValueOnce(new Error('offline'))
    .mockImplementationOnce(() => pending
      ? new Promise<Nodes>(resolve => { resolveRetry = resolve })
      : Promise.resolve([{ key: 'child', title: 'Loaded child' }]))
  const wrapper = mount(TreeSelect, {
    attachTo: document.body,
    props: {
      treeData: [{ key: 'root', title: 'Root', isLeaf: false }],
      virtual: true,
      defaultOpen: true,
      loadData,
      getPopupContainer: (trigger: HTMLElement) => trigger.parentElement!
    } as never
  })
  wrappers.push(wrapper)
  await settle()
  await wrapper.get('.aheart-tree__switcher').trigger('click')
  await settle()
  return { wrapper, getResolveRetry: () => resolveRetry, retry: wrapper.get('[aria-label="重试加载 Root"]').element as HTMLButtonElement }
}

describe('TreeSelect virtual retry focus handoff', () => {
  it('keeps the Tree render handoff when Chrome removes the focused retry with focusout relatedTarget null', async () => {
    const { wrapper, retry } = await prepareRetry()
    const originalRemoveChild = Node.prototype.removeChild
    Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
      if (child === retry && document.activeElement === retry) {
        child.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
      }
      return originalRemoveChild.call(this, child)
    }
    try {
      retry.focus()
      await wrapper.get('[aria-label="重试加载 Root"]').trigger('click')
      await flushPromises()
      await nextTick()
      await settle()
      const root = wrapper.get('[data-tree-key="root"]')
      expect(wrapper.get('[data-tree-key="child"]').exists()).toBe(true)
      expect(document.activeElement).toBe(root.element)
      await root.trigger('keydown', { key: 'ArrowRight' })
      expect(document.activeElement).toBe(wrapper.get('[data-tree-key="child"]').element)
    } finally {
      Node.prototype.removeChild = originalRemoveChild
    }
  })

  it('does not reclaim focus after a connected retry origin is explicitly blurred', async () => {
    const { wrapper, retry } = await prepareRetry()
    retry.focus()
    expect(retry.isConnected).toBe(true)
    expect(document.activeElement).toBe(retry)
    retry.click()
    retry.blur()
    await settle()
    expect(document.activeElement).toBe(document.body)
  })

  it('does not reclaim focus after focus moves outside and then blurs during retry', async () => {
    const { wrapper, getResolveRetry, retry } = await prepareRetry(true)
    const outside = document.createElement('button')
    document.body.append(outside)
    try {
      retry.focus()
      retry.click()
      await Promise.resolve()
      outside.focus()
      outside.blur()
      getResolveRetry()!([{ key: 'child', title: 'Loaded child' }])
      await settle()
      expect(wrapper.get('[data-tree-key="child"]').exists()).toBe(true)
      expect(document.activeElement).toBe(document.body)
    } finally {
      outside.remove()
    }
  })
})
