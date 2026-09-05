import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import TreeSelect from '../tree-select.vue'

enableAutoUnmount(afterEach)

const mountTreeSelect = (options: Record<string, any> = {}) => mount(TreeSelect, {
  ...options,
  global: { ...options.global, stubs: { ...options.global?.stubs, Teleport: true } }
})

const treeData = [
  { key: 'workspace', title: 'Workspace', children: [{ key: 'overview', title: 'Overview' }] },
  { key: 'archive', title: 'Archive' }
]

describe('TreeSelect', () => {
  it('connects combobox, dialog, and visible tree active descendant', async () => {
    const wrapper = mountTreeSelect({ attrs: { 'aria-describedby': 'tree-help' }, props: { treeData } })
    const trigger = wrapper.get('.aheart-tree-select__trigger')
    await trigger.trigger('click')
    const panel = wrapper.get('.aheart-tree-select__panel')
    expect(trigger.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(trigger.attributes('aria-describedby')).toBe('tree-help')
    const node = wrapper.get('[data-tree-key="workspace"]')
    await node.trigger('focusin')
    const activeId = trigger.attributes('aria-activedescendant')
    expect(activeId).toBe(node.attributes('id'))
    expect(panel.element.querySelector(`#${activeId}`)).toBe(node.element)
  })

  it('clears a stale active descendant after search filters the focused node', async () => {
    const wrapper = mountTreeSelect({ props: { treeData, showSearch: true } })
    const trigger = wrapper.get('.aheart-tree-select__trigger')
    await trigger.trigger('click')
    const workspace = wrapper.get('[data-tree-key="workspace"]')
    await workspace.trigger('focusin')
    expect(trigger.attributes('aria-activedescendant')).toBe(workspace.attributes('id'))

    await wrapper.get('input[type="search"]').setValue('Archive')
    expect(trigger.attributes('aria-activedescendant')).toBeUndefined()
    const archive = wrapper.get('[data-tree-key="archive"]')
    await archive.trigger('focusin')
    expect(trigger.attributes('aria-activedescendant')).toBe(archive.attributes('id'))
  })

  it('opens a tree and emits a selected value', async () => {
    const wrapper = mountTreeSelect({ props: { treeData, placeholder: 'Choose a page' } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('[data-tree-key="archive"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['archive']])
    expect(wrapper.text()).toContain('Archive')
  })

  it('retains multiple values while the tree remains open', async () => {
    const wrapper = mountTreeSelect({ props: { treeData, multiple: true, defaultValue: ['archive'] } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('[data-tree-key="workspace"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[['archive', 'workspace']]])
    expect(wrapper.find('.aheart-tree-select__panel').exists()).toBe(true)
  })

  it('renders removable multiple tags and aggregates tags beyond maxTagCount', async () => {
    const wrapper = mountTreeSelect({
      props: { treeData, multiple: true, defaultValue: ['archive', 'overview'], maxTagCount: 1 }
    })

    expect(wrapper.findAll('.aheart-tree-select__tag')).toHaveLength(2)
    expect(wrapper.get('.aheart-tree-select__tag--rest').text()).toBe('+1')
    await wrapper.get('.aheart-tree-select__tag-remove').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['overview']])
  })

  it('does not expose removable tag actions when disabled', () => {
    const wrapper = mountTreeSelect({
      props: { treeData, multiple: true, defaultValue: ['archive'], disabled: true }
    })

    expect(wrapper.find('.aheart-tree-select__tag-remove').exists()).toBe(false)
  })

  it('emits a controlled value without changing its displayed selection', async () => {
    const wrapper = mountTreeSelect({ props: { treeData, modelValue: 'archive' } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('[data-tree-key="workspace"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['workspace']])
    expect(wrapper.get('.aheart-tree-select__trigger').text()).toContain('Archive')
  })

  it('keeps an explicitly undefined controlled value empty', async () => {
    const wrapper = mountTreeSelect({ props: { treeData, modelValue: undefined, defaultValue: 'archive' } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('[data-tree-key="workspace"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['workspace']])
    expect(wrapper.get('.aheart-tree-select__trigger').text()).toContain('请选择')
  })

  it('does not open when disabled', async () => {
    const wrapper = mountTreeSelect({ props: { treeData, disabled: true } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')

    expect(wrapper.find('.aheart-tree-select__panel').exists()).toBe(false)
  })

  it('filters visible tree data by search text', async () => {
    const wrapper = mountTreeSelect({ props: { treeData, showSearch: true } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('input[type="search"]').setValue('over')

    expect(wrapper.text()).toContain('Workspace')
    expect(wrapper.text()).toContain('Overview')
    expect(wrapper.text()).not.toContain('Archive')
  })

  it('announces when search has no matching tree nodes', async () => {
    const wrapper = mountTreeSelect({ props: { treeData, showSearch: true } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('input[type="search"]').setValue('missing')

    expect(wrapper.get('[role="status"]').text()).toBe('暂无匹配节点')
  })

  it('restores a visible keyboard focus target after filtering', async () => {
    const wrapper = mountTreeSelect({ props: { treeData, showSearch: true } })

    await wrapper.get('.aheart-tree-select__trigger').trigger('click')
    await wrapper.get('[data-tree-key="workspace"]').trigger('keydown', { key: 'ArrowDown' })
    await wrapper.get('input[type="search"]').setValue('over')

    expect(wrapper.get('[data-tree-key="workspace"]').attributes('tabindex')).toBe('0')
  })

  it('supports controlled open, placement, clear, and keyboard closing', async () => {
    const controlled = mountTreeSelect({ props: { treeData, open: false } })
    await controlled.get('.aheart-tree-select__trigger').trigger('click')
    expect(controlled.emitted('openChange')?.[0]).toEqual([true])
    expect(controlled.find('.aheart-tree-select__panel').exists()).toBe(false)

    const wrapper = mountTreeSelect({
      attachTo: document.body,
      props: { treeData, defaultOpen: true, defaultValue: 'archive', allowClear: true, placement: 'topRight' }
    })
    expect(wrapper.get('.aheart-tree-select__panel').classes()).toContain('aheart-floating--topRight')
    await wrapper.get('.aheart-tree-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])

    await wrapper.get('.aheart-tree-select__trigger').trigger('keydown', { key: 'Escape' })
    expect(wrapper.get('.aheart-tree-select__trigger').attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})
