import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import Tree from '../tree.vue'

const treeData = [
  {
    key: 'parent',
    title: 'Parent',
    children: [
      { key: 'child-a', title: 'Child A' },
      { key: 'child-b', title: 'Child B', disabled: true }
    ]
  },
  { key: 'leaf', title: 'Leaf' }
]

describe('Tree', () => {
  it('renders tree data and expands default keys', () => {
    const wrapper = mount(Tree, { props: { treeData, defaultExpandedKeys: ['parent'] } })

    expect(wrapper.get('[role="tree"]').text()).toContain('Parent')
    expect(wrapper.text()).toContain('Child A')
    expect(wrapper.get('[data-tree-key="parent"]').element.parentElement?.getAttribute('aria-expanded')).toBe('true')
  })

  it('emits a selected key without mutating controlled selection', async () => {
    const wrapper = mount(Tree, { props: { treeData, selectedKeys: [] } })

    await wrapper.get('[data-tree-key="leaf"]').trigger('click')

    expect(wrapper.emitted('update:selectedKeys')).toEqual([[['leaf']]])
    expect(wrapper.get('[data-tree-key="leaf"]').classes()).not.toContain('is-selected')
  })

  it('toggles checked keys for checkable nodes', async () => {
    const wrapper = mount(Tree, { props: { treeData, checkable: true } })

    await wrapper.get('[data-tree-key="leaf"] input').setValue(true)

    expect(wrapper.emitted('update:checkedKeys')).toEqual([[['leaf']]])
    expect(wrapper.get('[data-tree-key="leaf"] input').element.checked).toBe(true)
  })

  it('does not select disabled nodes', async () => {
    const wrapper = mount(Tree, { props: { treeData, defaultExpandedKeys: ['parent'] } })

    await wrapper.get('[data-tree-key="child-b"]').trigger('click')

    expect(wrapper.emitted('update:selectedKeys')).toBeUndefined()
  })

  it('expands and collapses with the keyboard', async () => {
    const wrapper = mount(Tree, { props: { treeData } })
    const parent = wrapper.get('[data-tree-key="parent"]')

    await parent.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:expandedKeys')).toEqual([[['parent']]])

    await parent.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:expandedKeys')?.at(-1)).toEqual([[]])
  })

  it('moves keyboard focus through visible nodes', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = mount(Tree, { attachTo: host, props: { treeData, defaultExpandedKeys: ['parent'] } })
    const parent = wrapper.get('[data-tree-key="parent"]')

    await parent.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    expect(document.activeElement).toBe(wrapper.get('[data-tree-key="child-a"]').element)
    wrapper.unmount()
    host.remove()
  })

  it('does not reset uncontrolled keys when default key arrays are replaced', async () => {
    const wrapper = mount(Tree, { props: { treeData, defaultExpandedKeys: ['parent'] } })

    await wrapper.get('[data-tree-key="parent"] .aheart-tree__switcher').trigger('click')
    await wrapper.setProps({ defaultExpandedKeys: ['parent'] })

    expect(wrapper.get('[data-tree-key="parent"]').element.parentElement?.getAttribute('aria-expanded')).toBe('false')
  })

  it('keeps keyboard focus within the active tree instance', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const firstTree = mount(Tree, { attachTo: host, props: { treeData, defaultExpandedKeys: ['parent'] } })
    const secondTree = mount(Tree, { attachTo: host, props: { treeData, defaultExpandedKeys: ['parent'] } })

    await secondTree.get('[data-tree-key="parent"]').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    expect(document.activeElement).toBe(secondTree.get('[data-tree-key="child-a"]').element)
    firstTree.unmount()
    secondTree.unmount()
    host.remove()
  })

  it('restores focus to the closest visible ancestor after a controlled nested collapse', async () => {
    const nestedTreeData = [{ key: 'root', title: 'Root', children: [{ key: 'branch', title: 'Branch', children: [{ key: 'leaf', title: 'Leaf' }] }] }]
    const wrapper = mount(Tree, { props: { treeData: nestedTreeData, expandedKeys: ['root', 'branch'] } })

    await wrapper.get('[data-tree-key="branch"]').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.setProps({ expandedKeys: ['root'] })

    expect(wrapper.get('[data-tree-key="branch"]').attributes('tabindex')).toBe('0')
  })
})
