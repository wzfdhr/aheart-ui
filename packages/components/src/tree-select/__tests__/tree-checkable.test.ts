import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TreeSelect from '../tree-select.vue'

enableAutoUnmount(afterEach)
const treeData = [{ key: 'root', title: 'Root', children: [{ key: 'a', title: 'Apple' }, { key: 'b', title: 'Banana' }] }]
const mountSelect = (props: Record<string, unknown>) => mount(TreeSelect, {
  attachTo: document.body,
  props: { ...props, getPopupContainer: (trigger: HTMLElement) => trigger.parentElement! }
})

describe('TreeSelect checkable model', () => {
  it('checks the full logical subtree even when search hides siblings', async () => {
    const wrapper = mountSelect({ treeData, treeCheckable: true, treeCheckStrictly: false, showSearch: true, defaultOpen: true })
    await wrapper.get('input[type="search"]').setValue('Apple')
    await wrapper.get('[data-tree-key="root"] input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['root', 'a', 'b']])
    expect(wrapper.get('.aheart-tree-select__trigger').attributes('aria-expanded')).toBe('true')
  })

  it('keeps a rejected controlled check unchanged and supports strict default', async () => {
    const wrapper = mountSelect({ treeData, treeCheckable: true, modelValue: [], defaultOpen: true })
    await wrapper.get('[data-tree-key="root"] input').setValue(true)
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toEqual([[['root']]])
    expect((wrapper.get('[data-tree-key="root"] input').element as HTMLInputElement).checked).toBe(false)
  })

  it('shares lazy data with selected labels and cancels pending loads on close', async () => {
    let resolve!: (data: any[]) => void
    let signal!: AbortSignal
    const loadData = vi.fn((_node, context) => { signal = context.signal; return new Promise<any[]>(done => { resolve = done }) })
    const wrapper = mountSelect({ treeData: [{ key: 'root', title: 'Root', isLeaf: false }], treeCheckable: true, loadData, defaultOpen: true })
    await flushPromises()
    await wrapper.get('.aheart-tree__switcher').trigger('click')
    await flushPromises()
    resolve([{ key: 'child', title: 'Loaded child' }])
    await flushPromises()
    await wrapper.get('[data-tree-key="child"] input').setValue(true)
    expect(wrapper.get('.aheart-tree-select__trigger').text()).toContain('Loaded child')
    await wrapper.setProps({ treeData: [{ key: 'root', title: 'Replacement', isLeaf: false }] })
    await flushPromises()
    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    expect(signal.aborted).toBe(true)
    resolve([{ key: 'late', title: 'Late child' }])
    await flushPromises()
    expect(wrapper.text()).not.toContain('Late child')
  })
})
