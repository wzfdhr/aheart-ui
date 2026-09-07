import { mount, enableAutoUnmount, flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Tree from '../tree.vue'

enableAutoUnmount(afterEach)
const treeData = [{ key: 'root', title: 'Root', isLeaf: false }]

describe('Tree lazy loading', () => {
  it('keeps keyboard focus on the owning node when retry removes the error button', async () => {
    const loadData = vi.fn().mockRejectedValueOnce(new Error('offline')).mockImplementationOnce(() => new Promise(() => {}))
    const wrapper = mount(Tree, { attachTo: document.body, props: { treeData, loadData } })
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushPromises()
    const retry = wrapper.get('[aria-label="重试加载 Root"]').element as HTMLButtonElement
    retry.focus()
    expect(document.activeElement).toBe(retry)
    retry.click()
    await flushPromises()
    expect(document.activeElement).toBe(wrapper.get('[data-tree-key="root"]').element)
    expect(wrapper.get('[role="treeitem"]').attributes('aria-busy')).toBe('true')
  })
  it('accepts void completion without repeat calls and awaits caller-owned children', async () => {
    const loadData = vi.fn(async () => undefined)
    const wrapper = mount(Tree, { props: { treeData, loadData } })
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushPromises()
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushPromises()
    expect(loadData).toHaveBeenCalledTimes(1)
    await wrapper.setProps({ treeData: [{ key: 'root', title: 'Root', isLeaf: false, children: [{ key: 'child', title: 'Caller child' }] }] })
    expect(wrapper.text()).toContain('Caller child')
    expect(loadData).toHaveBeenCalledTimes(1)
  })

  it('aborts disabling and replacing the loader, and treats an empty result as a leaf', async () => {
    let signal!: AbortSignal
    const loadData = (_node: unknown, context: { signal: AbortSignal }) => { signal = context.signal; return new Promise<any[]>(() => {}) }
    const wrapper = mount(Tree, { props: { treeData, loadData, defaultExpandedKeys: ['root'] } })
    await flushPromises()
    const first = signal
    await wrapper.setProps({ disabled: true })
    expect(first.aborted).toBe(true)
    await wrapper.setProps({ disabled: false })
    await flushPromises()
    const second = signal
    await wrapper.setProps({ loadData: async () => [] })
    expect(second.aborted).toBe(true)
    await flushPromises()
    expect(wrapper.find('button.aheart-tree__switcher').exists()).toBe(false)
  })
  it('loads accepted expansion once with signal and does not mutate treeData', async () => {
    let resolve!: (value: any[]) => void
    const loadData = vi.fn((_node, _context) => new Promise<any[]>(done => { resolve = done }))
    const wrapper = mount(Tree, { props: { treeData, loadData } })
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushPromises()
    expect(loadData).toHaveBeenCalledTimes(1)
    expect(loadData.mock.calls[0][1].signal.aborted).toBe(false)
    expect(wrapper.get('[role="treeitem"]').attributes('aria-busy')).toBe('true')
    resolve([{ key: 'child', title: 'Child' }])
    await flushPromises()
    expect(wrapper.text()).toContain('Child')
    expect(treeData[0]).not.toHaveProperty('children')
  })

  it('does not load rejected expansion or explicit leaf nodes', async () => {
    const loadData = vi.fn(async () => [])
    const wrapper = mount(Tree, { props: { treeData, loadData, expandedKeys: [] } })
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushPromises()
    expect(loadData).not.toHaveBeenCalled()
    await wrapper.setProps({ treeData: [{ key: 'leaf', title: 'Leaf', isLeaf: true }] })
    expect(wrapper.find('button.aheart-tree__switcher').exists()).toBe(false)
  })

  it('cancels collapse and ignores a late response after a new request', async () => {
    const requests: { signal: AbortSignal; resolve: (value: any[]) => void }[] = []
    const loadData = vi.fn((_node, { signal }) => new Promise<any[]>(resolve => requests.push({ signal, resolve })))
    const wrapper = mount(Tree, { props: { treeData, loadData } })
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushPromises()
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    expect(requests[0].signal.aborted).toBe(true)
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushPromises()
    requests[0].resolve([{ key: 'old', title: 'Old' }])
    await flushPromises()
    expect(wrapper.text()).not.toContain('Old')
    expect(wrapper.get('[role="treeitem"]').attributes('aria-busy')).toBe('true')
    requests[1].resolve([{ key: 'new', title: 'New' }])
    await flushPromises()
    expect(wrapper.text()).toContain('New')
  })

  it('shows a retry action and retries failures without selecting the node', async () => {
    const loadData = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([{ key: 'new', title: 'New' }])
    const wrapper = mount(Tree, { props: { treeData, loadData } })
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushPromises()
    await wrapper.get('[aria-label="重试加载 Root"]').trigger('click')
    await flushPromises()
    expect(loadData).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('New')
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('aborts replacement and unmount and ignores callbacks even if the loader ignores abort', async () => {
    const requests: { signal: AbortSignal; resolve: (value: any[]) => void }[] = []
    const loadData = (_node: unknown, { signal }: { signal: AbortSignal }) => new Promise<any[]>(resolve => requests.push({ signal, resolve }))
    const wrapper = mount(Tree, { props: { treeData, loadData } })
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushPromises()
    await wrapper.setProps({ treeData: [{ key: 'root', title: 'Replacement', isLeaf: false }] })
    expect(requests[0].signal.aborted).toBe(true)
    await flushPromises()
    requests[0].resolve([{ key: 'old', title: 'Old' }])
    await flushPromises()
    expect(wrapper.text()).not.toContain('Old')
    wrapper.unmount()
    expect(requests.at(-1)!.signal.aborted).toBe(true)
    requests.at(-1)!.resolve([])
    await flushPromises()
  })
})
