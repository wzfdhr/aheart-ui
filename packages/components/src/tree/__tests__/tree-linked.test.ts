import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Tree from '../tree.vue'

enableAutoUnmount(afterEach)
const treeData = [{ key: 'root', title: 'Root', children: [{ key: 1, title: 'Numeric' }, { key: '1', title: 'String' }, { key: 'lock', title: 'Locked', disabled: true, children: [{ key: 'locked-child', title: 'Locked child' }] }] }]

describe('Tree linked check contract', () => {
  it('renders mixed on both the treeitem and native checkbox, and retains disabled keys', async () => {
    const wrapper = mount(Tree, { props: { treeData, checkable: true, checkStrictly: false, defaultExpandedKeys: ['root'], defaultCheckedKeys: [1, 'locked-child'] } })
    const root = wrapper.get('[data-tree-key="root"]')
    expect(root.attributes('aria-checked')).toBe('mixed')
    expect((root.get('input').element as HTMLInputElement).indeterminate).toBe(true)
    await root.get('input').setValue(true)
    expect(wrapper.emitted('update:checkedKeys')?.at(-1)).toEqual([['root', 1, '1', 'locked-child']])
    expect(wrapper.emitted('check')?.at(-1)?.[2]).toEqual({ halfCheckedKeys: [] })
    await root.get('input').setValue(false)
    expect(wrapper.emitted('update:checkedKeys')?.at(-1)).toEqual([['locked-child']])
  })

  it('keeps rejected controlled keys and indeterminate checkbox state authoritative', async () => {
    const wrapper = mount(Tree, { props: { treeData, checkable: true, checkStrictly: false, checkedKeys: [1], defaultExpandedKeys: ['root'] } })
    const input = wrapper.get('[data-tree-key="root"] input')
    await input.setValue(true)
    await flushPromises()
    expect((input.element as HTMLInputElement).checked).toBe(false)
    expect((input.element as HTMLInputElement).indeterminate).toBe(true)
    expect(wrapper.get('[data-tree-key="root"]').attributes('aria-checked')).toBe('mixed')
  })

  it('defaults to independent checks and keeps the original check arguments', async () => {
    const wrapper = mount(Tree, { props: { treeData, checkable: true } })
    await wrapper.get('[data-tree-key="root"] input').setValue(true)
    const event = wrapper.emitted('check')![0]
    expect(event[0]).toEqual(['root'])
    expect(event[1]).toEqual(treeData[0])
    expect(event[2]).toEqual({ halfCheckedKeys: [] })
  })
})
