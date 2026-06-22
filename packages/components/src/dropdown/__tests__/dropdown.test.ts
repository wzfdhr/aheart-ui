import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Dropdown from '../dropdown.vue'

const menu = {
  items: [
    { key: 'edit', label: 'Edit' },
    { key: 'archive', label: 'Archive' }
  ]
}

describe('Dropdown', () => {
  it('renders trigger slot and opens on click', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu },
      slots: { default: '<button>Actions</button>' }
    })

    expect(wrapper.text()).toContain('Actions')
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)

    await wrapper.find('.aheart-dropdown__trigger').trigger('click')

    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Edit')
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true])
  })

  it('opens on hover when trigger includes hover', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, trigger: ['hover'] },
      slots: { default: '<button>More</button>' }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('mouseenter')

    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(true)
  })

  it('supports controlled open state', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, open: false },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('click')

    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('emits menu click and closes after item click', async () => {
    const wrapper = mount(Dropdown, {
      props: { menu, defaultOpen: true },
      slots: { default: '<button>Actions</button>' }
    })

    await wrapper.find('[data-menu-key="edit"]').trigger('click')

    expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({ key: 'edit' })
    expect(wrapper.find('.aheart-dropdown__overlay').exists()).toBe(false)
  })

  it('uses ConfigProvider disabled fallback', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: {
          render() {
            return h(Dropdown, { menu }, () => h('button', 'Actions'))
          }
        }
      }
    })

    const dropdown = wrapper.findComponent(Dropdown)
    await dropdown.find('.aheart-dropdown__trigger').trigger('click')

    expect(dropdown.classes()).toContain('is-disabled')
    expect(dropdown.find('.aheart-dropdown__overlay').exists()).toBe(false)
  })
})
