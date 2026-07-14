import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Cascader from '../cascader.vue'

const mountCascader = (options: Record<string, any> = {}) => mount(Cascader, {
  ...options,
  global: { ...options.global, stubs: { ...options.global?.stubs, Teleport: true } }
})

const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州', children: [{ value: 'xihu', label: '西湖' }] },
      { value: 'ningbo', label: '宁波' }
    ]
  },
  { value: 'disabled', label: '不可用', disabled: true }
]

describe('Cascader', () => {
  it('emits a selected leaf path', async () => {
    const wrapper = mountCascader({ props: { options } })

    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="zhejiang"]').trigger('click')
    await wrapper.get('[data-cascader-value="hangzhou"]').trigger('click')
    await wrapper.get('[data-cascader-value="xihu"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[['zhejiang', 'hangzhou', 'xihu']]])
    expect(wrapper.get('.aheart-cascader__panel').classes()).toContain('is-leave')
  })

  it('keeps multiple selected paths in an uncontrolled value', async () => {
    const wrapper = mountCascader({ props: { options, multiple: true } })

    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="zhejiang"]').trigger('click')
    await wrapper.get('[data-cascader-value="ningbo"]').trigger('click')
    await wrapper.get('[data-cascader-value="zhejiang"]').trigger('click')
    await wrapper.get('[data-cascader-value="hangzhou"]').trigger('click')
    await wrapper.get('[data-cascader-value="xihu"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[['zhejiang', 'ningbo'], ['zhejiang', 'hangzhou', 'xihu']]])
    expect(wrapper.find('.aheart-cascader__panel').exists()).toBe(true)
  })

  it('renders removable multiple tags and aggregates tags beyond maxTagCount', async () => {
    const wrapper = mountCascader({
      props: {
        options,
        multiple: true,
        defaultValue: [['zhejiang', 'ningbo'], ['zhejiang', 'hangzhou', 'xihu']],
        maxTagCount: 1
      }
    })

    expect(wrapper.findAll('.aheart-cascader__tag')).toHaveLength(2)
    expect(wrapper.get('.aheart-cascader__tag--rest').text()).toBe('+1')
    await wrapper.get('.aheart-cascader__tag-remove').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[['zhejiang', 'hangzhou', 'xihu']]])
  })

  it('does not expose removable tag actions when disabled', () => {
    const wrapper = mountCascader({
      props: { options, multiple: true, defaultValue: [['zhejiang', 'ningbo']], disabled: true }
    })

    expect(wrapper.find('.aheart-cascader__tag-remove').exists()).toBe(false)
  })

  it('emits a controlled path without changing its displayed value', async () => {
    const wrapper = mountCascader({ props: { options, modelValue: ['zhejiang', 'ningbo'] } })

    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="zhejiang"]').trigger('click')
    await wrapper.get('[data-cascader-value="hangzhou"]').trigger('click')
    await wrapper.get('[data-cascader-value="xihu"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[['zhejiang', 'hangzhou', 'xihu']]])
    expect(wrapper.get('.aheart-cascader__trigger').text()).toContain('浙江 / 宁波')
  })

  it('searches leaf paths and selects a result', async () => {
    const wrapper = mountCascader({ props: { options, showSearch: true } })

    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('input[type="search"]').setValue('西湖')
    await wrapper.get('[data-cascader-path="zhejiang/hangzhou/xihu"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[['zhejiang', 'hangzhou', 'xihu']]])
  })

  it('announces an empty search result', async () => {
    const wrapper = mountCascader({ props: { options, showSearch: true } })

    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('input[type="search"]').setValue('不存在')

    expect(wrapper.get('[role="status"]').text()).toBe('暂无匹配选项')
  })

  it('does not select disabled options', async () => {
    const wrapper = mountCascader({ props: { options } })

    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="disabled"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('does not select values after an open panel becomes disabled', async () => {
    const wrapper = mountCascader({ props: { options } })

    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="zhejiang"]').trigger('click')
    await wrapper.setProps({ disabled: true })
    await wrapper.get('[data-cascader-value="ningbo"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('does not let search bypass a disabled parent option', async () => {
    const wrapper = mountCascader({
      props: {
        showSearch: true,
        options: [{ value: 'locked', label: '已禁用', disabled: true, children: [{ value: 'child', label: '子项' }] }]
      }
    })

    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('input[type="search"]').setValue('子项')

    expect(wrapper.get('[data-cascader-path="locked/child"]').attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('loads a branch through the application callback', async () => {
    const loadData = async () => [{ value: 'city', label: '城市' }]
    const wrapper = mountCascader({
      props: { options: [{ value: 'province', label: '省份', isLeaf: false }], loadData }
    })

    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="province"]').trigger('click')
    await Promise.resolve()

    expect(wrapper.get('[data-cascader-value="city"]').text()).toContain('城市')
  })

  it('does not start duplicate loads for the same branch', async () => {
    let resolveChildren: ((children: { value: string; label: string }[]) => void) | undefined
    let calls = 0
    const loadData = () => new Promise<{ value: string; label: string }[]>((resolve) => {
      calls += 1
      resolveChildren = resolve
    })
    const wrapper = mountCascader({
      props: { options: [{ value: 'province', label: '省份', isLeaf: false }], loadData }
    })

    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="province"]').trigger('click')
    expect(wrapper.get('[data-cascader-value="province"]').classes()).toContain('is-loading')
    expect(wrapper.get('[data-cascader-value="province"]').attributes('aria-busy')).toBe('true')
    expect(wrapper.get('[data-cascader-value="province"] .aheart-icon').classes()).toContain('aheart-icon--spin')
    await wrapper.get('[data-cascader-value="province"]').trigger('click')
    resolveChildren?.([{ value: 'city', label: '城市' }])
    await Promise.resolve()

    expect(calls).toBe(1)
  })

  it('supports controlled open, placement, keyboard closing, and clear', async () => {
    const controlled = mountCascader({ props: { options, open: false } })
    await controlled.get('.aheart-cascader__trigger').trigger('click')
    expect(controlled.emitted('openChange')?.[0]).toEqual([true])
    expect(controlled.find('.aheart-cascader__panel').exists()).toBe(false)

    const wrapper = mountCascader({
      attachTo: document.body,
      props: { options, defaultOpen: true, defaultValue: ['zhejiang', 'ningbo'], allowClear: true, placement: 'topRight' }
    })
    expect(wrapper.get('.aheart-cascader__panel').classes()).toContain('aheart-floating--topRight')
    await wrapper.get('.aheart-cascader__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])

    await wrapper.get('.aheart-cascader__trigger').trigger('keydown', { key: 'Escape' })
    expect(wrapper.get('.aheart-cascader__trigger').attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})
