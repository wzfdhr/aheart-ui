import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Select from '../select.vue'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true }
]

const mountSelect = (options: Record<string, any> = {}) => mount(Select, {
  ...options,
  global: {
    ...options.global,
    stubs: { ...options.global?.stubs, Teleport: true }
  }
})

describe('Select', () => {
  it('renders an interactive combobox and opens a listbox instead of a native select', async () => {
    const wrapper = mountSelect({ props: { options, placeholder: 'Choose fruit' } })

    expect(wrapper.find('select').exists()).toBe(false)
    expect(wrapper.get('.aheart-select__value').text()).toBe('Choose fruit')
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('false')

    await wrapper.get('[role="combobox"]').trigger('click')

    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[role="listbox"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toEqual(['Apple', 'Banana', 'Cherry'])
    expect(wrapper.findAll('[role="option"]')[2].attributes('aria-disabled')).toBe('true')
  })

  it('selects from the popup while a controlled owner remains the source of truth', async () => {
    const wrapper = mountSelect({ props: { options, modelValue: 'apple' } })

    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['banana'])
    expect(wrapper.get('.aheart-select__selection').text()).toContain('Apple')
  })

  it('keeps an explicitly undefined controlled value empty when the owner rejects selection', async () => {
    const wrapper = mountSelect({
      props: { options, modelValue: undefined, defaultValue: 'apple', placeholder: 'Choose fruit' }
    })

    expect(wrapper.get('.aheart-select__value').text()).toBe('Choose fruit')
    await wrapper.get('[role="combobox"]').trigger('click')
    await wrapper.findAll('[role="option"]')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
    expect(wrapper.get('.aheart-select__value').text()).toBe('Choose fruit')
  })

  it('allows a parent to take control after an uncontrolled mount', async () => {
    const wrapper = mountSelect({ props: { options, defaultValue: 'banana' } })

    await wrapper.setProps({ modelValue: 'apple' })

    expect(wrapper.get('.aheart-select__selection').text()).toContain('Apple')
  })

  it('keeps an explicitly undefined controlled search value empty', async () => {
    const wrapper = mountSelect({ props: { options, showSearch: true, searchValue: undefined } })
    const search = wrapper.get('.aheart-select__search')

    await search.setValue('ban')

    expect(wrapper.emitted('search')?.[0]).toEqual(['ban'])
    expect((search.element as HTMLInputElement).value).toBe('')
  })

  it('supports keyboard navigation, selection, escape, and focus restoration', async () => {
    const wrapper = mountSelect({ attachTo: document.body, props: { options } })
    const combobox = wrapper.get<HTMLElement>('[role="combobox"]')
    combobox.element.focus()

    await combobox.trigger('keydown', { key: 'ArrowDown' })
    await combobox.trigger('keydown', { key: 'ArrowDown' })
    await combobox.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])

    await combobox.trigger('keydown', { key: 'ArrowDown' })
    await combobox.trigger('keydown', { key: 'Escape' })
    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(combobox.element)
    wrapper.unmount()
  })

  it('renders removable multiple tags and clears the complete value', async () => {
    const wrapper = mountSelect({
      props: { options, modelValue: ['apple', 'banana'], mode: 'multiple', allowClear: true }
    })

    expect(wrapper.findAll('.aheart-select__tag')).toHaveLength(2)
    await wrapper.findAll('.aheart-select__tag-remove')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['banana']])

    await wrapper.get('.aheart-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('keeps a controlled popup closed when its owner rejects the open request', async () => {
    const wrapper = mountSelect({ props: { options, open: false } })

    await wrapper.get('[role="combobox"]').trigger('click')

    expect(wrapper.emitted('openChange')?.[0]).toEqual([true])
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('supports uncontrolled defaultOpen and defaultValue', async () => {
    const wrapper = mountSelect({ props: { options, defaultValue: 'banana', defaultOpen: true } })

    expect(wrapper.get('.aheart-select__value').text()).toBe('Banana')
    expect(wrapper.get('[role="listbox"]').exists()).toBe(true)

    await wrapper.findAll('[role="option"]')[0].trigger('click')
    expect(wrapper.get('.aheart-select__value').text()).toBe('Apple')
  })

  it('emits focus and blur and exposes imperative focus methods', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = mountSelect({ attachTo: host, props: { options } })
    const vm = wrapper.vm as unknown as { focus: () => void; blur: () => void }
    const combobox = wrapper.get<HTMLElement>('[role="combobox"]')

    vm.focus()
    await nextTick()
    expect(document.activeElement).toBe(combobox.element)
    await combobox.trigger('focusin')
    expect(wrapper.emitted('focus')).toHaveLength(1)

    vm.blur()
    await nextTick()
    expect(wrapper.emitted('blur')).toHaveLength(1)
    wrapper.unmount()
    host.remove()
  })

  it('focuses the search combobox when showSearch is enabled', async () => {
    const wrapper = mountSelect({ attachTo: document.body, props: { options, showSearch: true } })
    const vm = wrapper.vm as unknown as { focus: () => void }

    vm.focus()
    await nextTick()

    expect(document.activeElement).toBe(wrapper.get('.aheart-select__search').element)
    wrapper.unmount()
  })

  it('filters visible listbox options and renders the empty state', async () => {
    const wrapper = mountSelect({
      props: { options, showSearch: true, notFoundContent: 'No fruit' }
    })
    const search = wrapper.get('.aheart-select__search')

    await search.setValue('ban')
    expect(wrapper.emitted('search')?.[0]).toEqual(['ban'])
    expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toEqual(['Banana'])

    await search.setValue('zzz')
    expect(wrapper.findAll('[role="option"]')).toHaveLength(0)
    expect(wrapper.get('.aheart-select__empty').text()).toBe('No fruit')
  })

  it('passes the original search value to custom filters and sorters', async () => {
    const receivedFilterValues: string[] = []
    const receivedSortValues: string[] = []
    const wrapper = mountSelect({
      props: {
        options,
        showSearch: true,
        filterOption: (inputValue: string) => {
          receivedFilterValues.push(inputValue)
          return true
        },
        filterSort: (_left: unknown, _right: unknown, info: { searchValue: string }) => {
          receivedSortValues.push(info.searchValue)
          return 0
        }
      }
    })

    await wrapper.get('.aheart-select__search').setValue('  BAN ')

    expect(receivedFilterValues).toContain('  BAN ')
    expect(receivedSortValues).toContain('  BAN ')
  })

  it('creates tags from search text and respects maxCount', async () => {
    const wrapper = mountSelect({
      props: { options, mode: 'tags', showSearch: true, defaultValue: ['apple'], maxCount: 2 }
    })
    const search = wrapper.get('.aheart-select__search')

    await search.setValue('dragonfruit')
    await search.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple', 'dragonfruit']])

    await search.setValue('pear')
    await search.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })

  it('makes tags mode searchable without requiring showSearch', async () => {
    const wrapper = mountSelect({ props: { options, mode: 'tags' } })
    const search = wrapper.get('.aheart-select__search')

    await search.setValue('dragonfruit')
    await search.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['dragonfruit']])
  })

  it('maps custom fields, filter property, sorting, and numeric values', async () => {
    const wrapper = mountSelect({
      props: {
        showSearch: true,
        optionFilterProp: 'code',
        fieldNames: { label: 'name', value: 'id', disabled: 'locked' },
        filterSort: (a: any, b: any) => a.label.localeCompare(b.label),
        options: [
          { name: 'Beta', id: 2, code: 'match', locked: false },
          { name: 'Alpha', id: 1, code: 'match', locked: true },
          { name: 'Gamma', id: 3, code: 'skip', locked: false }
        ]
      }
    })

    await wrapper.get('.aheart-select__search').setValue('match')
    expect(wrapper.findAll('[role="option"]').map((option) => option.text())).toEqual(['Alpha', 'Beta'])
    expect(wrapper.findAll('[role="option"]')[0].attributes('aria-disabled')).toBe('true')

    await wrapper.findAll('[role="option"]')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('uses ConfigProvider size and disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large', disabled: true },
      slots: { default: () => h(Select, { options }) },
      global: { stubs: { Teleport: true } }
    })
    const select = wrapper.findComponent(Select)

    expect(select.classes()).toContain('aheart-select--large')
    expect(select.get('.aheart-select__selector').attributes('aria-disabled')).toBe('true')
  })

  it('renders variants, prefix, suffix, form name, and selected numeric label', () => {
    const wrapper = mountSelect({
      props: {
        options: [{ label: 'One', value: 1 }, { label: 'Two', value: 2 }],
        modelValue: 2,
        id: 'level',
        name: 'level',
        prefix: 'Level',
        suffixIcon: '⌄',
        variant: 'filled'
      }
    })

    expect(wrapper.classes()).toContain('aheart-select--filled')
    expect(wrapper.get('.aheart-select__prefix').text()).toBe('Level')
    expect(wrapper.get('.aheart-select__suffix').text()).toBe('⌄')
    expect(wrapper.get('[role="combobox"]').attributes('id')).toBe('level')
    expect(wrapper.get('input[type="hidden"]').attributes('name')).toBe('level')
    expect(wrapper.get('.aheart-select__value').text()).toBe('Two')
  })

  it('renders loading feedback without exposing an inert native selector', () => {
    const wrapper = mountSelect({
      props: { options, loading: true, loadingIcon: h('span', { class: 'custom-loading' }, 'Loading') }
    })

    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.get('.custom-loading').text()).toBe('Loading')
    expect(wrapper.find('select').exists()).toBe(false)
  })

  it('opens an empty loading popup so users can see pending feedback', async () => {
    const wrapper = mountSelect({ props: { loading: true } })

    await wrapper.get('[role="combobox"]').trigger('click')

    expect(wrapper.get('[role="combobox"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('.aheart-select__empty').text()).toBe('Loading')
  })

  it('announces loading state from the combobox', () => {
    const wrapper = mountSelect({ props: { options, loading: true } })

    expect(wrapper.get('[role="combobox"]').attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[role="status"]').text()).toBe('Loading')
  })

  it('does not submit values after an open popup becomes disabled', async () => {
    const wrapper = mountSelect({ props: { options, defaultOpen: true } })

    await wrapper.setProps({ disabled: true })
    await wrapper.findAll('[role="option"]')[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('prioritizes loading feedback over clear and uses the standard spinner', () => {
    const wrapper = mountSelect({
      props: { options, modelValue: 'apple', allowClear: true, loading: true }
    })

    expect(wrapper.find('.aheart-select__clear').exists()).toBe(false)
    expect(wrapper.get('.aheart-select__loading .aheart-icon').classes()).toContain('aheart-icon--spin')
  })

  it('supports custom clear icons and semantic classes and styles', () => {
    const wrapper = mountSelect({
      props: {
        options,
        modelValue: 'apple',
        allowClear: { clearIcon: h('span', { class: 'custom-clear' }, 'Clear') },
        className: 'outer-select',
        rootClassName: 'root-select',
        style: { width: '240px' },
        classNames: { root: 'semantic-root', selector: 'semantic-selector', clear: 'semantic-clear' },
        styles: { root: { minWidth: '220px' }, selector: { borderColor: 'red' }, clear: { color: 'purple' } }
      }
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['outer-select', 'root-select', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('width: 240px')
    expect(wrapper.get('.aheart-select__selector').classes()).toContain('semantic-selector')
    expect(wrapper.get('.aheart-select__selector').attributes('style')).toContain('border-color: red')
    expect(wrapper.get('.aheart-select__clear').classes()).toContain('semantic-clear')
    expect(wrapper.get('.custom-clear').text()).toBe('Clear')
  })

  it('supports optionRender, tagRender, and maxTagCount', async () => {
    const wrapper = mountSelect({
      props: {
        options,
        modelValue: ['apple', 'banana'],
        mode: 'multiple',
        defaultOpen: true,
        maxTagCount: 1,
        optionRender: (option: any) => h('strong', { class: 'custom-option' }, option.label),
        tagRender: ({ label }: any) => h('em', { class: 'custom-tag' }, label)
      }
    })

    expect(wrapper.findAll('.custom-tag')).toHaveLength(1)
    expect(wrapper.findAll('.aheart-select__tag-label')).toHaveLength(1)
    expect(wrapper.get('.aheart-select__tag--rest').text()).toBe('+1')
    expect(wrapper.findAll('.custom-option')).toHaveLength(3)
  })

  it('maps bordered false to the borderless variant', () => {
    const wrapper = mountSelect({ props: { options, bordered: false } })
    expect(wrapper.classes()).toContain('aheart-select--borderless')
  })

  it('uses custom popup width and keeps placement classes on the floating surface', async () => {
    const wrapper = mountSelect({ props: { options, defaultOpen: true, popupMatchSelectWidth: 280, placement: 'topRight' } })
    const popup = wrapper.get('.aheart-select__popup')

    expect(popup.attributes('style')).toContain('width: 280px')
    expect(popup.classes()).toContain('aheart-floating--topRight')
  })
})
