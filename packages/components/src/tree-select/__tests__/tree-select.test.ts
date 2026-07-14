import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TreeSelect from '../tree-select.vue'

const treeData = [
  { key: 'workspace', title: 'Workspace', children: [{ key: 'overview', title: 'Overview' }] },
  { key: 'archive', title: 'Archive' }
]

describe('TreeSelect', () => {
  it('opens a tree and emits a selected value', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData, placeholder: 'Choose a page' } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('[data-tree-key="archive"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['archive']])
    expect(wrapper.text()).toContain('Archive')
  })

  it('retains multiple values while the tree remains open', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData, multiple: true, defaultValue: ['archive'] } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('[data-tree-key="workspace"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[['archive', 'workspace']]])
    expect(wrapper.find('.aheart-tree-select__panel').exists()).toBe(true)
  })

  it('emits a controlled value without changing its displayed selection', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData, modelValue: 'archive' } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('[data-tree-key="workspace"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['workspace']])
    expect(wrapper.get('.aheart-tree-select__trigger').text()).toContain('Archive')
  })

  it('keeps an explicitly undefined controlled value empty', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData, modelValue: undefined, defaultValue: 'archive' } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('[data-tree-key="workspace"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['workspace']])
    expect(wrapper.get('.aheart-tree-select__trigger').text()).toContain('请选择')
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData, disabled: true } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')

    expect(wrapper.find('.aheart-tree-select__panel').exists()).toBe(false)
  })

  it('filters visible tree data by search text', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData, showSearch: true } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('input[type="search"]').setValue('over')

    expect(wrapper.text()).toContain('Workspace')
    expect(wrapper.text()).toContain('Overview')
    expect(wrapper.text()).not.toContain('Archive')
  })

  it('restores a visible keyboard focus target after filtering', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData, showSearch: true } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('[data-tree-key="workspace"]').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('input[type="search"]').setValue('over')

    expect(wrapper.get('[data-tree-key="workspace"]').attributes('tabindex')).toBe('0')
  })
})
