import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import InputNumber from '../input-number.vue'

describe('InputNumber', () => {
  it('renders numeric value and size class', () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 4, size: 'small' }
    })

    expect(wrapper.classes()).toContain('aheart-input-number')
    expect(wrapper.classes()).toContain('aheart-input-number--small')
    expect(wrapper.find('input').element.value).toBe('4')
  })

  it('exposes spinbutton ARIA metadata on the inner input', () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 4, min: 1, max: 10 }
    })
    const input = wrapper.find('input')

    expect(input.attributes('role')).toBe('spinbutton')
    expect(input.attributes('aria-valuemin')).toBe('1')
    expect(input.attributes('aria-valuemax')).toBe('10')
    expect(input.attributes('aria-valuenow')).toBe('4')
  })

  it('omits aria-valuenow when the current value is empty', () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: '', stringMode: true }
    })

    expect(wrapper.find('input').attributes('aria-valuenow')).toBeUndefined()
  })

  it('defaults autocomplete off while preserving explicit native overrides', () => {
    const wrapper = mount(InputNumber)
    const explicit = mount(InputNumber, {
      attrs: {
        autocomplete: 'on'
      }
    })

    expect(wrapper.find('input').attributes('autocomplete')).toBe('off')
    expect(explicit.find('input').attributes('autocomplete')).toBe('on')
  })

  it('passes native input attributes and listeners to the inner input', async () => {
    const handleInput = vi.fn()
    const handleBlur = vi.fn()
    const wrapper = mount(InputNumber, {
      attrs: {
        class: 'custom-root',
        name: 'amount',
        autocomplete: 'off',
        pattern: '[0-9]*',
        type: 'number',
        inputmode: 'numeric',
        'aria-label': 'Amount',
        onInput: handleInput,
        onBlur: handleBlur
      }
    })
    const input = wrapper.find('input')

    expect(wrapper.classes()).toContain('custom-root')
    expect(wrapper.attributes('name')).toBeUndefined()
    expect(input.attributes('name')).toBe('amount')
    expect(input.attributes('autocomplete')).toBe('off')
    expect(input.attributes('pattern')).toBe('[0-9]*')
    expect(input.attributes('type')).toBe('number')
    expect(input.attributes('inputmode')).toBe('numeric')
    expect(input.attributes('aria-label')).toBe('Amount')

    await input.setValue('12')
    await input.trigger('blur')

    expect(handleInput).toHaveBeenCalledTimes(1)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('routes Ant-compatible mouse listeners to the root element', async () => {
    const handleClick = vi.fn()
    const handleMouseDown = vi.fn()
    const handleMouseMove = vi.fn()
    const handleFocus = vi.fn()
    const wrapper = mount(InputNumber, {
      attrs: {
        onClick: handleClick,
        onMousedown: handleMouseDown,
        onMousemove: handleMouseMove,
        onFocus: handleFocus
      }
    })

    await wrapper.trigger('click')
    await wrapper.trigger('mousedown')
    await wrapper.trigger('mousemove')
    await wrapper.find('input').trigger('focus')

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleMouseDown).toHaveBeenCalledTimes(1)
    expect(handleMouseMove).toHaveBeenCalledTimes(1)
    expect(handleFocus).toHaveBeenCalledTimes(1)
  })

  it('focuses the inner input when the root receives mousedown', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const handleMouseDown = vi.fn()

    const wrapper = mount(InputNumber, {
      attachTo: host,
      attrs: {
        onMousedown: handleMouseDown
      }
    })
    const input = wrapper.find('input').element

    await wrapper.trigger('mousedown')

    expect(document.activeElement).toBe(input)
    expect(handleMouseDown).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    host.remove()
  })

  it('prevents default before root mousedown listeners run', async () => {
    const defaultPreventedStates: boolean[] = []
    const wrapper = mount(InputNumber, {
      attrs: {
        onMousedown: (event: MouseEvent) => {
          defaultPreventedStates.push(event.defaultPrevented)
        }
      }
    })

    await wrapper.trigger('mousedown')

    expect(defaultPreventedStates).toEqual([true])
  })

  it('uses defaultValue as uncontrolled initial value', async () => {
    const wrapper = mount(InputNumber, {
      props: { defaultValue: 4, step: 2 }
    })

    const input = wrapper.find('input')

    expect(input.element.value).toBe('4')

    await wrapper.find('.aheart-input-number__increase').trigger('click')

    expect(input.element.value).toBe('6')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
    expect(wrapper.emitted('change')?.[0]).toEqual([6])
  })

  it('uses value as a controlled value alias', async () => {
    const wrapper = mount(InputNumber, {
      props: { value: 5, step: 2 }
    })

    expect(wrapper.find('input').element.value).toBe('5')

    await wrapper.find('.aheart-input-number__increase').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7])
    expect(wrapper.emitted('change')?.[0]).toEqual([7])
    expect(wrapper.emitted('step')?.[0]).toEqual([7, { offset: 2, type: 'up', emitter: 'handler' }])
  })

  it('emits string values when stringMode is enabled', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        stringMode: true,
        changeOnBlur: false,
        modelValue: '1.000000000000000001',
        step: '0.000000000000000001'
      }
    })

    expect(wrapper.find('input').element.value).toBe('1.000000000000000001')

    await wrapper.find('input').setValue('2.000000000000000001')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2.000000000000000001'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['2.000000000000000001'])

    await wrapper.find('.aheart-input-number__increase').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['1.000000000000000002'])
    expect(wrapper.emitted('change')?.[1]).toEqual(['1.000000000000000002'])
    expect(wrapper.emitted('step')?.[0]).toEqual([
      '1.000000000000000002',
      { offset: '0.000000000000000001', type: 'up', emitter: 'handler' }
    ])
  })

  it('uses string defaultValue as uncontrolled initial value', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        stringMode: true,
        defaultValue: '3.000000000000000001',
        step: '0.000000000000000001'
      }
    })
    const input = wrapper.find('input')

    expect(input.element.value).toBe('3.000000000000000001')

    await wrapper.find('.aheart-input-number__increase').trigger('click')

    expect(input.element.value).toBe('3.000000000000000002')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['3.000000000000000002'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['3.000000000000000002'])
  })

  it('defers typed changes until blur by default', async () => {
    const wrapper = mount(InputNumber, {
      props: { defaultValue: 1 }
    })
    const input = wrapper.find('input')

    await input.setValue('5')

    expect(input.element.value).toBe('5')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()

    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([5])
    expect(wrapper.emitted('change')?.[0]).toEqual([5])
    expect(input.element.value).toBe('5')
  })

  it('emits raw input text while typed changes are deferred', async () => {
    const wrapper = mount(InputNumber, {
      props: { defaultValue: 1 }
    })
    const input = wrapper.find('input')

    await input.setValue('5.5')

    expect(wrapper.emitted('input')?.[0]).toEqual(['5.5'])
    expect(wrapper.emitted('change')).toBeUndefined()

    await input.trigger('blur')

    expect(wrapper.emitted('change')?.[0]).toEqual([5.5])
  })

  it('emits typed changes immediately when changeOnBlur is false', async () => {
    const wrapper = mount(InputNumber, {
      props: { defaultValue: 1, changeOnBlur: false }
    })

    await wrapper.find('input').setValue('5')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([5])
    expect(wrapper.emitted('change')?.[0]).toEqual([5])
  })

  it('defers typed value parsing until composition input ends', async () => {
    const wrapper = mount(InputNumber, {
      props: { defaultValue: 1, changeOnBlur: false }
    })
    const input = wrapper.find('input')

    await input.trigger('compositionstart')
    input.element.value = '5'
    await input.trigger('input')

    expect(wrapper.emitted('input')?.[0]).toEqual(['5'])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()

    await input.trigger('compositionend')

    expect(wrapper.emitted('input')?.[1]).toEqual(['5'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([5])
    expect(wrapper.emitted('change')?.[0]).toEqual([5])
  })

  it('clamps typed values to min and max', async () => {
    const wrapper = mount(InputNumber, {
      props: { min: 1, max: 10, changeOnBlur: false }
    })

    await wrapper.find('input').setValue('20')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
    expect(wrapper.emitted('change')?.[0]).toEqual([10])
  })

  it('increments and decrements by step controls', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, step: 2, controls: true }
    })

    await wrapper.find('.aheart-input-number__increase').trigger('click')
    await wrapper.find('.aheart-input-number__decrease').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0])
  })

  it('treats string step values as numeric offsets', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 1, step: '0.5' }
    })

    await wrapper.find('.aheart-input-number__increase').trigger('click')
    await wrapper.find('.aheart-input-number__decrease').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1.5])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0.5])
    expect(wrapper.emitted('step')?.[0]).toEqual([1.5, { offset: '0.5', type: 'up', emitter: 'handler' }])
    expect(wrapper.emitted('step')?.[1]).toEqual([0.5, { offset: '0.5', type: 'down', emitter: 'handler' }])
  })

  it('uses decimal arithmetic for numeric step values', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 0.2, step: 0.1 }
    })

    await wrapper.find('.aheart-input-number__increase').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0.3])
    expect(wrapper.emitted('step')?.[0]).toEqual([0.3, { offset: 0.1, type: 'up', emitter: 'handler' }])
  })

  it('focuses the inner input after control stepping', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(InputNumber, {
      attachTo: host,
      props: { modelValue: 2, step: 1 }
    })
    const input = wrapper.find('input').element

    await wrapper.find('.aheart-input-number__increase').trigger('click')
    await nextTick()

    expect(document.activeElement).toBe(input)

    wrapper.unmount()
    host.remove()
  })

  it('disables and ignores boundary steps', async () => {
    const maxWrapper = mount(InputNumber, {
      props: { modelValue: 10, min: 0, max: 10, step: 1 }
    })
    const minWrapper = mount(InputNumber, {
      props: { modelValue: 0, min: 0, max: 10, step: 1 }
    })

    expect(maxWrapper.find('.aheart-input-number__increase').attributes()).toHaveProperty('disabled')
    expect(maxWrapper.find('.aheart-input-number__decrease').attributes()).not.toHaveProperty('disabled')
    expect(minWrapper.find('.aheart-input-number__decrease').attributes()).toHaveProperty('disabled')
    expect(minWrapper.find('.aheart-input-number__increase').attributes()).not.toHaveProperty('disabled')

    await maxWrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    await minWrapper.find('input').trigger('keydown', { key: 'ArrowDown' })

    expect(maxWrapper.emitted('update:modelValue')).toBeUndefined()
    expect(maxWrapper.emitted('step')).toBeUndefined()
    expect(minWrapper.emitted('update:modelValue')).toBeUndefined()
    expect(minWrapper.emitted('step')).toBeUndefined()
  })

  it('uses ConfigProvider size and disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large', disabled: true },
      slots: {
        default: {
          render() {
            return h(InputNumber, { modelValue: 8 })
          }
        }
      }
    })

    const inputNumber = wrapper.findComponent(InputNumber)
    expect(inputNumber.classes()).toContain('aheart-input-number--large')
    expect(inputNumber.find('input').attributes()).toHaveProperty('disabled')
  })

  it('supports prefix suffix status variant readonly id and formatted display', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 1200,
        prefix: '$',
        suffix: 'USD',
        status: 'warning',
        variant: 'filled',
        id: 'amount',
        readOnly: true,
        formatter: (value?: number) => (value === undefined ? '' : `${value.toLocaleString()}`)
      }
    })

    expect(wrapper.classes()).toContain('aheart-input-number--warning')
    expect(wrapper.classes()).toContain('aheart-input-number--filled')
    expect(wrapper.find('.aheart-input-number__prefix').text()).toBe('$')
    expect(wrapper.find('.aheart-input-number__suffix').text()).toBe('USD')
    expect(wrapper.find('input').element.value).toBe('1,200')
    expect(wrapper.find('input').attributes('id')).toBe('amount')
    expect(wrapper.find('input').attributes()).toHaveProperty('readonly')
  })

  it('parses input applies precision and emits pressEnter', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        precision: 2,
        parser: (value: string) => Number(value.replace('$', ''))
      }
    })

    await wrapper.find('input').setValue('$12.345')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([12.35])
    expect(wrapper.emitted('pressEnter')).toHaveLength(1)
  })

  it('uses decimalSeparator for default display and parsing', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 12.5,
        decimalSeparator: ',',
        changeOnBlur: false
      }
    })

    expect(wrapper.find('input').element.value).toBe('12,5')

    await wrapper.find('input').setValue('3,75')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3.75])
    expect(wrapper.emitted('change')?.[0]).toEqual([3.75])
  })

  it('uses precision for default display formatting', () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 12.5, precision: 2 }
    })
    const commaWrapper = mount(InputNumber, {
      props: { modelValue: 12.5, precision: 2, decimalSeparator: ',' }
    })

    expect(wrapper.find('input').element.value).toBe('12.50')
    expect(commaWrapper.find('input').element.value).toBe('12,50')
  })

  it('infers default display precision from step', () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 1, step: 0.01 }
    })
    const stringStepWrapper = mount(InputNumber, {
      props: { modelValue: 1.2, step: '0.01' }
    })

    expect(wrapper.find('input').element.value).toBe('1.00')
    expect(stringStepWrapper.find('input').element.value).toBe('1.20')
  })

  it('strips formatted characters with the default parser', async () => {
    const wrapper = mount(InputNumber, {
      props: { changeOnBlur: false }
    })

    await wrapper.find('input').setValue('$ 1,234.50')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1234.5])
    expect(wrapper.emitted('change')?.[0]).toEqual([1234.5])
  })

  it('treats Chinese decimal punctuation as a decimal point with the default parser', async () => {
    const wrapper = mount(InputNumber, {
      props: { changeOnBlur: false }
    })

    await wrapper.find('input').setValue('1。5')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1.5])
    expect(wrapper.emitted('change')?.[0]).toEqual([1.5])
  })

  it('supports keyboard suppression and step events', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, keyboard: false }
    })

    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.find('.aheart-input-number__increase').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    expect(wrapper.emitted('step')?.[0]).toEqual([3, { offset: 1, type: 'up', emitter: 'handler' }])
  })

  it('renders custom controls icon content and hides controls when controls is false', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 2,
        controls: {
          upIcon: 'up',
          downIcon: 'down'
        }
      }
    })

    expect(wrapper.find('.aheart-input-number__increase').text()).toBe('up')
    expect(wrapper.find('.aheart-input-number__decrease').text()).toBe('down')

    const withoutControls = mount(InputNumber, {
      props: { modelValue: 2, controls: false }
    })

    expect(withoutControls.find('.aheart-input-number__controls').exists()).toBe(false)
  })

  it('hides controls when disabled or readonly', () => {
    const disabled = mount(InputNumber, {
      props: { modelValue: 2, disabled: true }
    })
    const readonly = mount(InputNumber, {
      props: { modelValue: 2, readOnly: true }
    })
    const inheritedDisabled = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: () => h(InputNumber, { modelValue: 2 })
      }
    })

    expect(disabled.find('.aheart-input-number__controls').exists()).toBe(false)
    expect(readonly.find('.aheart-input-number__controls').exists()).toBe(false)
    expect(inheritedDisabled.find('.aheart-input-number__controls').exists()).toBe(false)
  })

  it('supports spinner mode defaults and custom control overrides', () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, mode: 'spinner' }
    })

    expect(wrapper.classes()).toContain('aheart-input-number--mode-spinner')
    expect(wrapper.find('.aheart-input-number__increase').text()).toBe('+')
    expect(wrapper.find('.aheart-input-number__decrease').text()).toBe('-')

    const custom = mount(InputNumber, {
      props: {
        modelValue: 2,
        mode: 'spinner',
        controls: {
          upIcon: 'more',
          downIcon: 'less'
        }
      }
    })

    expect(custom.find('.aheart-input-number__increase').text()).toBe('more')
    expect(custom.find('.aheart-input-number__decrease').text()).toBe('less')
  })

  it('renders vnode prefix suffix and controls icon content', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 8,
        prefix: h('span', { class: 'prefix-node' }, '$'),
        suffix: h('span', { class: 'suffix-node' }, 'USD'),
        controls: {
          upIcon: h('span', { class: 'up-node' }, 'plus'),
          downIcon: h('span', { class: 'down-node' }, 'minus')
        }
      }
    })

    expect(wrapper.find('.prefix-node').text()).toBe('$')
    expect(wrapper.find('.suffix-node').text()).toBe('USD')
    expect(wrapper.find('.up-node').text()).toBe('plus')
    expect(wrapper.find('.down-node').text()).toBe('minus')
  })

  it('renders addon content before and after the input control', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 8,
        addonBefore: h('span', { class: 'addon-before-node' }, '$'),
        addonAfter: 'USD'
      }
    })
    const before = wrapper.find('.aheart-input-number__addon-before')
    const after = wrapper.find('.aheart-input-number__addon-after')
    const input = wrapper.find('input')

    expect(before.find('.addon-before-node').text()).toBe('$')
    expect(after.text()).toBe('USD')
    expect(before.element.compareDocumentPosition(input.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(input.element.compareDocumentPosition(after.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders numeric zero addon content', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 8,
        addonBefore: 0,
        addonAfter: 0
      }
    })

    expect(wrapper.find('.aheart-input-number__addon-before').text()).toBe('0')
    expect(wrapper.find('.aheart-input-number__addon-after').text()).toBe('0')
  })

  it('lets slots override renderable prefix suffix and controls icons', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 8,
        prefix: h('span', { class: 'prop-prefix' }, 'prop prefix'),
        suffix: h('span', { class: 'prop-suffix' }, 'prop suffix'),
        controls: {
          upIcon: h('span', { class: 'prop-up' }, 'prop up'),
          downIcon: h('span', { class: 'prop-down' }, 'prop down')
        }
      },
      slots: {
        prefix: '<span class="slot-prefix">slot prefix</span>',
        suffix: '<span class="slot-suffix">slot suffix</span>',
        increaseIcon: '<span class="slot-up">slot up</span>',
        decreaseIcon: '<span class="slot-down">slot down</span>'
      }
    })

    expect(wrapper.find('.slot-prefix').text()).toBe('slot prefix')
    expect(wrapper.find('.slot-suffix').text()).toBe('slot suffix')
    expect(wrapper.find('.slot-up').text()).toBe('slot up')
    expect(wrapper.find('.slot-down').text()).toBe('slot down')
    expect(wrapper.find('.prop-prefix').exists()).toBe(false)
    expect(wrapper.find('.prop-suffix').exists()).toBe(false)
    expect(wrapper.find('.prop-up').exists()).toBe(false)
    expect(wrapper.find('.prop-down').exists()).toBe(false)
  })

  it('renders numeric zero prefix and suffix as renderable content', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 8,
        prefix: 0,
        suffix: 0
      }
    })

    expect(wrapper.find('.aheart-input-number__prefix').text()).toBe('0')
    expect(wrapper.find('.aheart-input-number__suffix').text()).toBe('0')
  })

  it('steps with mouse wheel only when changeOnWheel is enabled', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, step: 2, changeOnWheel: true }
    })
    const input = wrapper.find('input')

    await input.trigger('wheel', { deltaY: -100 })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await input.trigger('focus')

    await input.trigger('wheel', { deltaY: -99 })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await input.trigger('wheel', { deltaY: -1 })
    await input.trigger('wheel', { deltaY: 100 })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0])

    await input.trigger('blur')
    await input.trigger('wheel', { deltaY: -100 })

    expect(wrapper.emitted('update:modelValue')).toHaveLength(2)

    const disabledWheel = mount(InputNumber, {
      props: { modelValue: 2 }
    })

    await disabledWheel.find('input').trigger('wheel', { deltaY: -1 })
    expect(disabledWheel.emitted('update:modelValue')).toBeUndefined()
  })

  it('includes the step emitter source for keyboard and wheel interactions', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, step: 2, changeOnWheel: true }
    })
    const input = wrapper.find('input')

    await input.trigger('keydown', { key: 'ArrowUp' })
    await input.trigger('focus')
    await input.trigger('wheel', { deltaY: 100 })

    expect(wrapper.emitted('step')?.[0]).toEqual([4, { offset: 2, type: 'up', emitter: 'keyboard' }])
    expect(wrapper.emitted('step')?.[1]).toEqual([0, { offset: 2, type: 'down', emitter: 'wheel' }])
  })

  it('uses a decuple step when Shift is held for keyboard stepping', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, step: 2 }
    })

    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp', shiftKey: true })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([22])
    expect(wrapper.emitted('step')?.[0]).toEqual([22, { offset: '20', type: 'up', emitter: 'keyboard' }])
  })

  it('supports legacy Up and Down key names for keyboard stepping', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, step: 2 }
    })

    await wrapper.find('input').trigger('keydown', { key: 'Up' })
    await wrapper.find('input').trigger('keydown', { key: 'Down' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0])
    expect(wrapper.emitted('step')?.[0]).toEqual([4, { offset: 2, type: 'up', emitter: 'keyboard' }])
    expect(wrapper.emitted('step')?.[1]).toEqual([0, { offset: 2, type: 'down', emitter: 'keyboard' }])
  })

  it('skips keyboard stepping while composition input is active', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, step: 2 }
    })
    const input = wrapper.find('input')

    await input.trigger('compositionstart')
    await input.trigger('keydown', { key: 'ArrowUp' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('step')).toBeUndefined()

    await input.trigger('compositionend')
    await input.trigger('keydown', { key: 'ArrowUp' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('step')?.[0]).toEqual([4, { offset: 2, type: 'up', emitter: 'keyboard' }])
  })

  it('repeats control stepping while a control is held', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mount(InputNumber, {
        props: { defaultValue: 2, step: 2 }
      })
      const input = wrapper.find('input')
      const increase = wrapper.find('.aheart-input-number__increase')

      await increase.trigger('mousedown')
      await nextTick()

      expect(input.element.value).toBe('4')
      expect(wrapper.emitted('step')).toHaveLength(1)
      expect(wrapper.emitted('step')?.[0]).toEqual([4, { offset: 2, type: 'up', emitter: 'handler' }])

      await vi.advanceTimersByTimeAsync(599)
      await nextTick()

      expect(input.element.value).toBe('4')
      expect(wrapper.emitted('step')).toHaveLength(1)

      await vi.advanceTimersByTimeAsync(1)
      await nextTick()

      expect(input.element.value).toBe('6')
      expect(wrapper.emitted('step')).toHaveLength(2)

      await vi.advanceTimersByTimeAsync(200)
      await nextTick()

      expect(input.element.value).toBe('8')
      expect(wrapper.emitted('step')).toHaveLength(3)

      await increase.trigger('mouseup')
      await vi.advanceTimersByTimeAsync(400)
      await nextTick()

      expect(input.element.value).toBe('8')
      expect(wrapper.emitted('step')).toHaveLength(3)
    } finally {
      vi.useRealTimers()
    }
  })

  it('exposes focus blur and nativeElement methods', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(InputNumber, {
      attachTo: host,
      props: { modelValue: 1234 }
    })
    const inputNumberVm = wrapper.vm as unknown as {
      focus: (options?: { preventScroll?: boolean; cursor?: 'start' | 'end' | 'all' }) => void
      blur: () => void
      nativeElement?: HTMLElement
    }
    const input = wrapper.find('input').element

    expect(inputNumberVm.focus).toBeTypeOf('function')
    expect(inputNumberVm.blur).toBeTypeOf('function')
    expect(inputNumberVm.nativeElement).toBe(wrapper.element)

    inputNumberVm.focus({ cursor: 'all' })
    await nextTick()
    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(input.value.length)

    inputNumberVm.focus({ cursor: 'end' })
    await nextTick()
    expect(input.selectionStart).toBe(input.value.length)
    expect(input.selectionEnd).toBe(input.value.length)

    inputNumberVm.blur()
    await nextTick()
    expect(document.activeElement).not.toBe(input)

    wrapper.unmount()
    host.remove()
  })

  it('focuses the inner input on mount when autoFocus is true', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(InputNumber, {
      attachTo: host,
      props: { modelValue: 8, autoFocus: true }
    })
    const input = wrapper.find('input').element

    await nextTick()

    expect(document.activeElement).toBe(input)

    wrapper.unmount()
    host.remove()
  })

  it('passes formatter info to formatter', () => {
    const calls: Array<{ value: number | undefined; userTyping?: boolean; input?: string }> = []
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 1200,
        formatter: (value, info) => {
          calls.push({ value, ...info })
          return `${info.userTyping}:${info.input}`
        }
      }
    })

    expect(wrapper.find('input').element.value).toBe('false:1200')
    expect(calls[0]).toEqual({ value: 1200, userTyping: false, input: '1200' })
  })

  it('applies root class and style hooks', () => {
    const wrapper = mount(InputNumber, {
      props: {
        className: 'input-number-class',
        rootClassName: 'input-number-root',
        style: { width: '320px' },
        classNames: {
          root: 'semantic-root'
        },
        styles: {
          root: { marginTop: '6px' }
        }
      }
    })

    expect(wrapper.classes()).toContain('input-number-class')
    expect(wrapper.classes()).toContain('input-number-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('width: 320px')
    expect(wrapper.attributes('style')).toContain('margin-top: 6px')
  })

  it('applies semantic class and style hooks to InputNumber parts', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 2,
        prefix: '$',
        suffix: 'USD',
        classNames: {
          input: 'semantic-input',
          prefix: 'semantic-prefix',
          suffix: 'semantic-suffix',
          actions: 'semantic-actions',
          action: 'semantic-action'
        },
        styles: {
          input: { color: 'red' },
          prefix: { color: 'blue' },
          suffix: { color: 'green' },
          actions: { color: 'purple' },
          action: { color: 'orange' }
        }
      }
    })

    expect(wrapper.find('input').classes()).toContain('semantic-input')
    expect(wrapper.find('input').attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-input-number__prefix').classes()).toContain('semantic-prefix')
    expect(wrapper.find('.aheart-input-number__prefix').attributes('style')).toContain('color: blue')
    expect(wrapper.find('.aheart-input-number__suffix').classes()).toContain('semantic-suffix')
    expect(wrapper.find('.aheart-input-number__suffix').attributes('style')).toContain('color: green')
    expect(wrapper.find('.aheart-input-number__controls').classes()).toContain('semantic-actions')
    expect(wrapper.find('.aheart-input-number__controls').attributes('style')).toContain('color: purple')
    expect(wrapper.find('.aheart-input-number__increase').classes()).toContain('semantic-action')
    expect(wrapper.find('.aheart-input-number__increase').attributes('style')).toContain('color: orange')
    expect(wrapper.find('.aheart-input-number__decrease').classes()).toContain('semantic-action')
    expect(wrapper.find('.aheart-input-number__decrease').attributes('style')).toContain('color: orange')
  })

  it('supports semantic classNames and styles functions', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 2,
        status: 'warning',
        prefix: '$',
        suffix: 'USD',
        classNames: ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
          root: props.status === 'warning' ? 'semantic-fn-warning-root' : 'semantic-fn-root',
          input: 'semantic-fn-input',
          prefix: 'semantic-fn-prefix',
          suffix: 'semantic-fn-suffix',
          actions: 'semantic-fn-actions',
          action: props.readOnly ? 'semantic-fn-action-readonly' : 'semantic-fn-action'
        }),
        styles: ({ props }: { props: Readonly<Record<string, unknown>> }) => ({
          root: { marginTop: props.status === 'warning' ? '8px' : '4px' },
          input: { color: 'red' },
          prefix: { color: 'blue' },
          suffix: { color: 'green' },
          actions: { color: 'purple' },
          action: { color: props.readOnly ? 'gray' : 'orange' }
        })
      }
    })

    expect(wrapper.classes()).toContain('semantic-fn-warning-root')
    expect(wrapper.attributes('style')).toContain('margin-top: 8px')
    expect(wrapper.find('input').classes()).toContain('semantic-fn-input')
    expect(wrapper.find('input').attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-input-number__prefix').classes()).toContain('semantic-fn-prefix')
    expect(wrapper.find('.aheart-input-number__prefix').attributes('style')).toContain('color: blue')
    expect(wrapper.find('.aheart-input-number__suffix').classes()).toContain('semantic-fn-suffix')
    expect(wrapper.find('.aheart-input-number__suffix').attributes('style')).toContain('color: green')
    expect(wrapper.find('.aheart-input-number__controls').classes()).toContain('semantic-fn-actions')
    expect(wrapper.find('.aheart-input-number__controls').attributes('style')).toContain('color: purple')
    expect(wrapper.find('.aheart-input-number__increase').classes()).toContain('semantic-fn-action')
    expect(wrapper.find('.aheart-input-number__increase').attributes('style')).toContain('color: orange')
    expect(wrapper.find('.aheart-input-number__decrease').classes()).toContain('semantic-fn-action')
    expect(wrapper.find('.aheart-input-number__decrease').attributes('style')).toContain('color: orange')
  })
})
