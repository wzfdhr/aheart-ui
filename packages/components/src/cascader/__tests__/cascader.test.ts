import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Cascader from '../cascader.vue'

enableAutoUnmount(afterEach)

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
  it('aborts when switching to an already loaded branch and when replacing loadData', async () => {
    let signal!: AbortSignal
    let resolve!: (data: any[]) => void
    const loadData = (_node: unknown, context: { signal: AbortSignal }) => {
      signal = context.signal
      return new Promise<any[]>(done => { resolve = done })
    }
    const wrapper = mountCascader({ props: {
      options: [{ value: 'pending', label: 'Pending', isLeaf: false }, { value: 'ready', label: 'Ready', children: [{ value: 'child', label: 'Child' }] }], loadData
    } })
    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="pending"]').trigger('click')
    await wrapper.get('[data-cascader-value="ready"]').trigger('click')
    expect(signal.aborted).toBe(true)
    resolve([{ value: 'late', label: 'Late' }])
    await flushPromises()
    expect(wrapper.find('[data-cascader-value="late"]').exists()).toBe(false)
    await wrapper.get('[data-cascader-value="pending"]').trigger('click')
    const second = signal
    await wrapper.setProps({ loadData: async () => [] })
    expect(second.aborted).toBe(true)
  })
  it('keeps iframe focus, restores it on Escape, and clears unmounted overlay behavior', async () => {
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    const ownerDocument = iframe.contentDocument!
    const ownerWindow = iframe.contentWindow! as Window & typeof globalThis
    const openChanges: boolean[] = []
    const wrapper = mount(Cascader, {
      attachTo: ownerDocument.body,
      props: { options, onOpenChange: (open: boolean) => openChanges.push(open) }
    })
    try {
      const trigger = wrapper.get('.aheart-cascader__trigger').element as HTMLElement
      trigger.focus()
      expect(ownerDocument.activeElement).toBe(trigger)
      expect(document.activeElement).toBe(iframe)
      trigger.click()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      const panel = ownerDocument.querySelector<HTMLElement>('.aheart-cascader__panel')!
      expect(panel).toBeTruthy()
      expect(panel.parentElement).toBe(ownerDocument.body)
      expect(document.querySelector('.aheart-cascader__panel')).toBeNull()
      const innerTarget = panel.querySelector<HTMLElement>('.aheart-cascader__option')!
      innerTarget.focus()
      expect(ownerDocument.activeElement).toBe(innerTarget)
      const foreignEscape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
      document.dispatchEvent(foreignEscape)
      await wrapper.vm.$nextTick()
      expect(trigger.getAttribute('aria-expanded')).toBe('true')

      const escape = new ownerWindow.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
      ownerDocument.activeElement!.dispatchEvent(escape)
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      expect(escape.defaultPrevented).toBe(true)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(ownerDocument.activeElement).toBe(trigger)
      expect(wrapper.emitted('openChange')).toEqual([[true], [false]])

      trigger.click()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      expect(ownerDocument.querySelector('.aheart-cascader__panel')).toBeTruthy()
      const callsBeforeUnmount = openChanges.length
      wrapper.unmount()
      expect(ownerDocument.querySelector('.aheart-cascader__panel')).toBeNull()
      expect(document.querySelector('.aheart-cascader__panel')).toBeNull()

      const outside = ownerDocument.createElement('button')
      ownerDocument.body.appendChild(outside)
      outside.focus()
      const afterUnmount = new ownerWindow.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
      outside.dispatchEvent(afterUnmount)
      outside.dispatchEvent(new ownerWindow.MouseEvent('pointerdown', { bubbles: true, cancelable: true }))
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      expect(afterUnmount.defaultPrevented).toBe(false)
      expect(ownerDocument.activeElement).toBe(outside)
      expect(openChanges.length).toBe(callsBeforeUnmount)
      expect(ownerDocument.querySelector('.aheart-cascader__panel')).toBeNull()
    } finally {
      if (wrapper.exists()) wrapper.unmount()
      iframe.remove()
    }
  })

  it('connects the combobox to its panel and visible active option', async () => {
    const wrapper = mountCascader({ attrs: { 'aria-labelledby': 'country-label', 'aria-describedby': 'country-help' }, props: { options } })
    const trigger = wrapper.get('.aheart-cascader__trigger')
    await trigger.trigger('click')
    const panel = wrapper.get('.aheart-cascader__panel')
    expect(trigger.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(trigger.attributes('aria-labelledby')).toBe('country-label')
    expect(trigger.attributes('aria-describedby')).toBe('country-help')
    const first = wrapper.get('[data-cascader-value="zhejiang"]')
    await first.trigger('focus')
    const activeId = trigger.attributes('aria-activedescendant')
    expect(activeId).toBe(first.attributes('id'))
    expect(panel.element.querySelector(`#${activeId}`)).toBe(first.element)
  })

  it('supports Home/End and left/right column navigation', async () => {
    const wrapper = mount(Cascader, { attachTo: document.body, props: { options } })
    const getOption = (value: string) =>
      document.querySelector<HTMLElement>(`.aheart-cascader__option[data-cascader-value="${value}"]`)!
    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    getOption('zhejiang').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await wrapper.vm.$nextTick()
    await Promise.resolve()
    await wrapper.vm.$nextTick()
    const city = getOption('hangzhou')
    expect(wrapper.get('.aheart-cascader__trigger').attributes('aria-activedescendant')).toBe(city.id)
    city.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    const currentProvince = getOption('zhejiang')
    expect(document.activeElement).toBe(currentProvince)
    currentProvince.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    expect(document.activeElement).toBe(currentProvince)
    wrapper.unmount()
  })

  it('uses Enter to expand branches and select leaves', async () => {
    const wrapper = mountCascader({ props: { options } })
    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="zhejiang"]').trigger('keydown', { key: 'Enter' })
    await wrapper.vm.$nextTick()
    await wrapper.get('[data-cascader-value="ningbo"]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toEqual([[['zhejiang', 'ningbo']]])
  })

  it('preserves typed key identity during keyboard navigation and selection', async () => {
    const wrapper = mountCascader({
      attachTo: document.body,
      props: { options: [{ value: 1, label: 'Numeric' }, { value: '1', label: 'String' }] }
    })
    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    const nodes = wrapper.findAll('.aheart-cascader__option')
    expect(nodes[0].attributes('data-cascader-token')).not.toBe(nodes[1].attributes('data-cascader-token'))
    await nodes[0].trigger('focus')
    expect(wrapper.get('.aheart-cascader__trigger').attributes('aria-activedescendant')).toBe(nodes[0].attributes('id'))
    await nodes[1].trigger('focus')
    expect(wrapper.get('.aheart-cascader__trigger').attributes('aria-activedescendant')).toBe(nodes[1].attributes('id'))
    await nodes[1].trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toEqual([[['1']]])
  })

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

  it('exposes lazy failures and allows click retry', async () => {
    let calls = 0
    const loadData = async () => {
      calls += 1
      throw new Error('offline')
    }
    const wrapper = mountCascader({
      props: { options: [{ value: 'province', label: '省份', isLeaf: false }], loadData }
    })
    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    const option = wrapper.get('[data-cascader-value="province"]')
    await option.trigger('click')
    await flushPromises()
    const failedOption = wrapper.get('[data-cascader-value="province"]')
    expect(failedOption.classes()).toContain('is-error')
    expect(failedOption.attributes('aria-label')).toContain('加载失败')
    expect(failedOption.text()).toContain('重试')

    await failedOption.trigger('click')
    await flushPromises()
    expect(calls).toBe(2)
  })

  it('discards a lazy response after options are replaced', async () => {
    let resolveChildren: ((children: { value: string; label: string }[]) => void) | undefined
    const loadData = () => new Promise<{ value: string; label: string }[]>((resolve) => {
      resolveChildren = resolve
    })
    const wrapper = mountCascader({
      props: { options: [{ value: 'province', label: '省份', isLeaf: false }], loadData }
    })
    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="province"]').trigger('click')
    await wrapper.setProps({ options: [{ value: 'replacement', label: '替换项' }] })
    resolveChildren?.([{ value: 'stale-city', label: '过期城市' }])
    await Promise.resolve()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-cascader-value="stale-city"]').exists()).toBe(false)
    expect(wrapper.get('[data-cascader-value="replacement"]').text()).toContain('替换项')
  })

  it('discards a lazy response after the active branch changes', async () => {
    let resolveFirst: ((children: { value: string; label: string }[]) => void) | undefined
    const loadData = (option: { value: string | number }) => option.value === 'first'
      ? new Promise<{ value: string; label: string }[]>((resolve) => { resolveFirst = resolve })
      : Promise.resolve([{ value: 'second-child', label: '第二分支子项' }])
    const wrapper = mountCascader({
      props: {
        options: [
          { value: 'first', label: '第一分支', isLeaf: false },
          { value: 'second', label: '第二分支', isLeaf: false }
        ],
        loadData
      }
    })
    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="first"]').trigger('click')
    await wrapper.get('[data-cascader-value="second"]').trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-cascader-value="second-child"]').text()).toContain('第二分支子项')

    resolveFirst?.([{ value: 'stale-child', label: '过期子项' }])
    await flushPromises()
    expect(wrapper.find('[data-cascader-value="stale-child"]').exists()).toBe(false)
  })

  it('passes an AbortSignal and aborts stale work when options are replaced', async () => {
    let resolveChildren: ((children: { value: string; label: string }[]) => void) | undefined
    let receivedSignal: AbortSignal | undefined
    const loadData = (_option: { value: string }, context?: { signal: AbortSignal }) => {
      receivedSignal = context?.signal
      return new Promise<{ value: string; label: string }[]>((resolve) => { resolveChildren = resolve })
    }
    const wrapper = mountCascader({
      props: { options: [{ value: 'province', label: '省份', isLeaf: false }], loadData }
    })

    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="province"]').trigger('click')
    expect(receivedSignal?.aborted).toBe(false)
    await wrapper.setProps({ options: [{ value: 'replacement', label: '替换项' }] })
    expect(receivedSignal?.aborted).toBe(true)
    resolveChildren?.([{ value: 'stale-city', label: '过期城市' }])
    await flushPromises()
    expect(wrapper.find('[data-cascader-value="stale-city"]').exists()).toBe(false)
  })

  it('aborts an away branch request and starts a fresh task when returning', async () => {
    const signals: AbortSignal[] = []
    const resolvers: Array<(children: { value: string; label: string }[]) => void> = []
    let firstCalls = 0
    const loadData = (option: { value: string }, context?: { signal: AbortSignal }) => {
      signals.push(context!.signal)
      if (option.value === 'first') {
        firstCalls += 1
        return new Promise<{ value: string; label: string }[]>((resolve) => { resolvers.push(resolve) })
      }
      return Promise.resolve([{ value: 'second-child', label: '第二分支子项' }])
    }
    const wrapper = mountCascader({
      props: {
        options: [
          { value: 'first', label: '第一分支', isLeaf: false },
          { value: 'second', label: '第二分支', isLeaf: false }
        ],
        loadData
      }
    })

    await wrapper.get('.aheart-cascader__trigger').trigger('click')
    await wrapper.get('[data-cascader-value="first"]').trigger('click')
    await wrapper.get('[data-cascader-value="second"]').trigger('click')
    await flushPromises()
    await wrapper.get('[data-cascader-value="first"]').trigger('click')
    expect(firstCalls).toBe(2)
    expect(signals[0]?.aborted).toBe(true)
    expect(signals[1]?.aborted).toBe(false)
    resolvers[0]?.([{ value: 'late-child', label: '迟到子项' }])
    await flushPromises()
    expect(wrapper.find('[data-cascader-value="late-child"]').exists()).toBe(false)
    resolvers[1]?.([{ value: 'fresh-child', label: '新任务子项' }])
    await flushPromises()
    expect(wrapper.find('[data-cascader-value="fresh-child"]').exists()).toBe(true)
  })

  it('aborts lazy work on controlled close, disabled state, and unmount', async () => {
    let resolveChildren: ((children: { value: string; label: string }[]) => void) | undefined
    let receivedSignal: AbortSignal | undefined
    const loadData = (_option: { value: string }, context?: { signal: AbortSignal }) => {
      receivedSignal = context?.signal
      return new Promise<{ value: string; label: string }[]>((resolve) => { resolveChildren = resolve })
    }
    const wrapper = mountCascader({
      props: { open: true, options: [{ value: 'province', label: '省份', isLeaf: false }], loadData }
    })
    await wrapper.get('[data-cascader-value="province"]').trigger('click')
    await wrapper.setProps({ open: false })
    expect(receivedSignal?.aborted).toBe(true)
    resolveChildren?.([{ value: 'stale-city', label: '过期城市' }])
    await flushPromises()
    expect(wrapper.find('[data-cascader-value="stale-city"]').exists()).toBe(false)

    await wrapper.setProps({ open: true, disabled: false })
    await wrapper.get('[data-cascader-value="province"]').trigger('click')
    const signalBeforeDisable = receivedSignal
    await wrapper.setProps({ disabled: true })
    expect(signalBeforeDisable?.aborted).toBe(true)

    await wrapper.setProps({ disabled: false, open: true })
    await wrapper.get('[data-cascader-value="province"]').trigger('click')
    const signalBeforeUnmount = receivedSignal
    wrapper.unmount()
    expect(signalBeforeUnmount?.aborted).toBe(true)
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
