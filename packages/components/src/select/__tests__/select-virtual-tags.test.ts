import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Select from '../select.vue'

enableAutoUnmount(afterEach)

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' }
]

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
    return this.classList.contains('aheart-select__popup') ? 286 : 32
  })
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300)
})

afterEach(() => vi.restoreAllMocks())

const create = (props: Record<string, unknown> = {}) => mount(Select, {
  props: { options, defaultOpen: true, virtual: true, mode: 'tags', showSearch: true, ...props } as any,
  global: { stubs: { Teleport: true } }
})

describe('Select virtual tags integration', () => {
  it('creates one tag from virtual search and emits one Enter update without mutating inputs', async () => {
    const sourceOptions = options.map((option) => ({ ...option }))
    const sourceValue = ['apple']
    const wrapper = create({ options: sourceOptions, defaultValue: sourceValue })
    const search = wrapper.get<HTMLInputElement>('.aheart-select__search')

    await search.setValue('dragonfruit')
    await search.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[['apple', 'dragonfruit']]])
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.findAll('.aheart-select__tag-label').map(tag => tag.text())).toEqual(['Apple', 'dragonfruit'])
    expect(sourceOptions).toEqual(options)
    expect(sourceValue).toEqual(['apple'])
  })

  it('removes a tag, creates a new tag, and clears the virtual tags value', async () => {
    const wrapper = create({ defaultValue: ['apple', 'banana'], allowClear: true })
    const search = wrapper.get<HTMLInputElement>('.aheart-select__search')

    await wrapper.findAll('.aheart-select__tag-remove')[0].trigger('click')
    expect(wrapper.findAll('.aheart-select__tag-label').map(tag => tag.text())).toEqual(['Banana'])
    await search.setValue('dragonfruit')
    await search.trigger('keydown', { key: 'Enter' })
    await wrapper.get('.aheart-select__clear').trigger('click')
    expect(wrapper.findAll('.aheart-select__tag')).toHaveLength(0)

    expect(wrapper.emitted('update:modelValue')).toEqual([
      [['banana']],
      [['banana', 'dragonfruit']],
      [[]]
    ])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('keeps rejected controlled tags authoritative while emitting remove and clear payloads', async () => {
    const sourceOptions = options.map((option) => ({ ...option }))
    const sourceValue = ['apple']
    const wrapper = create({ options: sourceOptions, modelValue: sourceValue, allowClear: true })
    const search = wrapper.get<HTMLInputElement>('.aheart-select__search')

    await search.setValue('dragonfruit')
    await search.trigger('keydown', { key: 'Enter' })
    expect(wrapper.findAll('.aheart-select__tag-label').map(tag => tag.text())).toEqual(['Apple'])
    await wrapper.get('.aheart-select__tag-remove').trigger('click')
    expect(wrapper.findAll('.aheart-select__tag-label').map(tag => tag.text())).toEqual(['Apple'])
    await wrapper.get('.aheart-select__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([
      [['apple', 'dragonfruit']],
      [[]],
      [[]]
    ])
    expect(wrapper.get('.aheart-select__tag').text()).toContain('Apple')
    expect(wrapper.findAll('.aheart-select__tag')).toHaveLength(1)
    expect(sourceOptions).toEqual(options)
    expect(sourceValue).toEqual(['apple'])
  })
})
