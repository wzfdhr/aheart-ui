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
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
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
})
