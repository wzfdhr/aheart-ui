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
    expect(wrapper.get('[data-tree-key="leaf"]').element.parentElement?.getAttribute('aria-selected')).toBe('false')
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
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = mount(Tree, { attachTo: host, props: { treeData: nestedTreeData, expandedKeys: ['root', 'branch'] } })

    wrapper.get('[data-tree-key="leaf"]').element.focus()
    await wrapper.setProps({ expandedKeys: ['root'] })
    await nextTick()

    expect(wrapper.get('[data-tree-key="branch"]').attributes('tabindex')).toBe('0')
    expect(document.activeElement).toBe(wrapper.get('[data-tree-key="branch"]').element)
    wrapper.unmount()
    host.remove()
  })

  it('moves focus to the first and last visible treeitem with Home and End', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = mount(Tree, { attachTo: host, props: { treeData, defaultExpandedKeys: ['parent'] } })
    const child = wrapper.get('[data-tree-key="child-a"]')

    child.element.focus()
    await child.trigger('keydown', { key: 'Home' })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[data-tree-key="parent"]').element)

    await wrapper.get('[data-tree-key="parent"]').trigger('keydown', { key: 'End' })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[data-tree-key="leaf"]').element)
    wrapper.unmount()
    host.remove()
  })

  it('expands a branch and enters its first child with ArrowRight', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = mount(Tree, { attachTo: host, props: { treeData } })
    const parent = wrapper.get('[data-tree-key="parent"]')

    parent.element.focus()
    await parent.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    expect(document.activeElement).toBe(wrapper.get('[data-tree-key="child-a"]').element)
    wrapper.unmount()
    host.remove()
  })

  it('returns to a parent with ArrowLeft and collapses an expanded branch', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = mount(Tree, { attachTo: host, props: { treeData, defaultExpandedKeys: ['parent'] } })

    wrapper.get('[data-tree-key="child-a"]').element.focus()
    await wrapper.get('[data-tree-key="child-a"]').trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[data-tree-key="parent"]').element)

    await wrapper.get('[data-tree-key="parent"]').trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    expect(wrapper.get('[data-tree-key="parent"]').element.parentElement?.getAttribute('aria-expanded')).toBe('false')
    wrapper.unmount()
    host.remove()
  })

  it('toggles each selected key independently with Enter in multiple mode', async () => {
    const wrapper = mount(Tree, { props: { treeData, multiple: true } })

    await wrapper.get('[data-tree-key="parent"]').trigger('keydown', { key: 'Enter' })
    await wrapper.get('[data-tree-key="leaf"]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.get('[data-tree-key="parent"]').element.parentElement?.getAttribute('aria-selected')).toBe('true')
    expect(wrapper.get('[data-tree-key="leaf"]').element.parentElement?.getAttribute('aria-selected')).toBe('true')

    await wrapper.get('[data-tree-key="parent"]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.get('[data-tree-key="parent"]').element.parentElement?.getAttribute('aria-selected')).toBe('false')
    expect(wrapper.get('[data-tree-key="leaf"]').element.parentElement?.getAttribute('aria-selected')).toBe('true')
  })

  it('keeps a controlled checkbox unchecked when the parent rejects the update', async () => {
    const wrapper = mount(Tree, { props: { treeData, checkable: true, checkedKeys: [] } })

    await wrapper.get('[data-tree-key="leaf"] input').setValue(true)
    await nextTick()

    expect(wrapper.get('[data-tree-key="leaf"] input').element.checked).toBe(false)
  })

  it('does not drift controlled expanded or selected DOM when the parent rejects updates', async () => {
    const wrapper = mount(Tree, { props: { treeData, expandedKeys: [], selectedKeys: [] } })

    await wrapper.get('[data-tree-key="parent"] .aheart-tree__switcher').trigger('click')
    await wrapper.get('[data-tree-key="leaf"]').trigger('click')
    await nextTick()

    expect(wrapper.get('[data-tree-key="parent"]').element.parentElement?.getAttribute('aria-expanded')).toBe('false')
    expect(wrapper.find('[data-tree-key="child-a"]').exists()).toBe(false)
    expect(wrapper.get('[data-tree-key="leaf"]').element.parentElement?.getAttribute('aria-selected')).toBe('false')
  })

  it('does not emit events for disabled nodes or a disabled tree', async () => {
    const nodeDisabled = mount(Tree, { props: { treeData, defaultExpandedKeys: ['parent'], checkable: true } })
    await nodeDisabled.get('[data-tree-key="child-b"]').trigger('click')
    await nodeDisabled.get('[data-tree-key="child-b"] input').trigger('change')
    expect(nodeDisabled.emitted('select')).toBeUndefined()
    expect(nodeDisabled.emitted('check')).toBeUndefined()

    const treeDisabled = mount(Tree, { props: { treeData, defaultExpandedKeys: ['parent'], checkable: true, disabled: true } })
    await treeDisabled.get('[data-tree-key="leaf"]').trigger('click')
    await treeDisabled.get('[data-tree-key="leaf"] input').trigger('change')
    expect(treeDisabled.emitted('select')).toBeUndefined()
    expect(treeDisabled.emitted('check')).toBeUndefined()
  })

  it('does not scroll the tree when Space checks the focused node', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = mount(Tree, { attachTo: host, props: { treeData, checkable: true } })
    const tree = wrapper.get('[role="tree"]').element as HTMLElement
    tree.scrollTop = 48
    const leaf = wrapper.get('[data-tree-key="leaf"]')

    leaf.element.focus()
    await leaf.trigger('keydown', { key: ' ' })
    await nextTick()

    expect(tree.scrollTop).toBe(48)
    expect(leaf.get('input').element.checked).toBe(true)
    wrapper.unmount()
    host.remove()
  })
})
