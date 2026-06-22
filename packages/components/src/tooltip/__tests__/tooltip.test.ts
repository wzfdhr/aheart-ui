import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tooltip from '../tooltip.vue'

describe('Tooltip', () => {
  it('renders title from hover trigger', async () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'Helpful text' },
      slots: { default: '<button>Help</button>' }
    })

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(false)

    await wrapper.find('.aheart-tooltip__trigger').trigger('mouseenter')

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(true)
    expect(wrapper.text()).toContain('Helpful text')
  })

  it('applies placement color arrow and zIndex', () => {
    const wrapper = mount(Tooltip, {
      props: { open: true, title: 'Colored', placement: 'bottomRight', color: '#111827', zIndex: 2000 },
      slots: { default: '<button>Help</button>' }
    })

    const popup = wrapper.find('.aheart-tooltip__popup')
    expect(popup.classes()).toContain('aheart-floating--bottomRight')
    expect(popup.attributes('style')).toContain('background: rgb(17, 24, 39)')
    expect(popup.attributes('style')).toContain('z-index: 2000')
    expect(wrapper.find('.aheart-tooltip__arrow').exists()).toBe(true)
  })

  it('toggles from click trigger and emits open events', async () => {
    const wrapper = mount(Tooltip, {
      props: { title: 'Clickable', trigger: 'click' },
      slots: { default: '<button>Help</button>' }
    })

    await wrapper.find('.aheart-tooltip__trigger').trigger('click')

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(true)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true])
  })

  it('respects controlled open state', async () => {
    const wrapper = mount(Tooltip, {
      props: { open: false, title: 'Controlled', trigger: 'click' },
      slots: { default: '<button>Help</button>' }
    })

    await wrapper.find('.aheart-tooltip__trigger').trigger('click')

    expect(wrapper.find('.aheart-tooltip__popup').exists()).toBe(false)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })
})
