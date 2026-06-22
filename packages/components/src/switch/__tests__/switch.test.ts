import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Switch from '../switch.vue'

describe('Switch', () => {
  it('renders role switch, checked state, and checked label', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true, checkedChildren: 'On', unCheckedChildren: 'Off' }
    })

    expect(wrapper.classes()).toContain('aheart-switch')
    expect(wrapper.attributes('role')).toBe('switch')
    expect(wrapper.attributes('aria-checked')).toBe('true')
    expect(wrapper.text()).toContain('On')
  })

  it('emits model update and change when clicked', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
    expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(MouseEvent)
  })

  it('does not emit when loading', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false, loading: true }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('uses ConfigProvider size and disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small', disabled: true },
      slots: {
        default: {
          render() {
            return h(Switch)
          }
        }
      }
    })

    const control = wrapper.findComponent(Switch)
    expect(control.classes()).toContain('aheart-switch--small')
    expect(control.attributes()).toHaveProperty('disabled')
  })

  it('prefers checked and value aliases over modelValue', () => {
    const checkedWrapper = mount(Switch, {
      props: { modelValue: false, value: false, checked: true }
    })
    const valueWrapper = mount(Switch, {
      props: { modelValue: false, value: true }
    })

    expect(checkedWrapper.attributes('aria-checked')).toBe('true')
    expect(valueWrapper.attributes('aria-checked')).toBe('true')
  })

  it('emits Ant-style alias updates, change, and click payloads', async () => {
    const wrapper = mount(Switch, {
      props: { checked: false }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:checked')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:value')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
    expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(MouseEvent)
    expect(wrapper.emitted('click')?.[0]?.[0]).toBe(true)
    expect(wrapper.emitted('click')?.[0]?.[1]).toBeInstanceOf(MouseEvent)
  })

  it('supports uncontrolled defaultChecked and defaultValue', async () => {
    const checkedWrapper = mount(Switch, {
      props: { defaultChecked: true, checkedChildren: 'On', unCheckedChildren: 'Off' }
    })
    const valueWrapper = mount(Switch, {
      props: { defaultValue: true }
    })

    expect(checkedWrapper.attributes('aria-checked')).toBe('true')
    expect(checkedWrapper.text()).toContain('On')
    expect(valueWrapper.attributes('aria-checked')).toBe('true')

    await checkedWrapper.trigger('click')

    expect(checkedWrapper.attributes('aria-checked')).toBe('false')
    expect(checkedWrapper.text()).toContain('Off')
  })

  it('applies semantic classes and styles', () => {
    const wrapper = mount(Switch, {
      props: {
        checked: true,
        className: 'switch-class',
        rootClassName: 'switch-root',
        style: { marginTop: '4px' },
        classNames: {
          root: 'semantic-root',
          indicator: 'semantic-indicator',
          content: 'semantic-content'
        },
        styles: {
          root: { width: '70px' },
          indicator: { backgroundColor: 'red' },
          content: { color: 'yellow' }
        }
      }
    })

    expect(wrapper.classes()).toContain('switch-class')
    expect(wrapper.classes()).toContain('switch-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.attributes('style')).toContain('width: 70px')
    expect(wrapper.find('.aheart-switch__handle').classes()).toContain('semantic-indicator')
    expect(wrapper.find('.aheart-switch__handle').attributes('style')).toContain('background-color: red')
    expect(wrapper.find('.aheart-switch__label').classes()).toContain('semantic-content')
    expect(wrapper.find('.aheart-switch__label').attributes('style')).toContain('color: yellow')
  })

  it('renders checked and unchecked content slots', async () => {
    const wrapper = mount(Switch, {
      props: { defaultChecked: true },
      slots: {
        checkedChildren: '<span class="checked-slot">Yes</span>',
        unCheckedChildren: '<span class="unchecked-slot">No</span>'
      }
    })

    expect(wrapper.find('.checked-slot').exists()).toBe(true)

    await wrapper.trigger('click')

    expect(wrapper.find('.unchecked-slot').exists()).toBe(true)
  })
})
