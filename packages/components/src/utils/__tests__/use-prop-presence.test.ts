import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import { usePropPresence } from '../use-prop-presence'

describe('usePropPresence', () => {
  it('reacts when a parent adds an explicitly undefined controlled prop', async () => {
    const Fixture = defineComponent({
      props: { modelValue: String },
      setup() {
        return { controlled: usePropPresence('modelValue', 'model-value') }
      },
      template: '<span>{{ controlled }}</span>'
    })
    const wrapper = mount(Fixture)

    expect(wrapper.text()).toBe('false')
    await wrapper.setProps({ modelValue: undefined })
    expect(wrapper.text()).toBe('true')
  })
})
