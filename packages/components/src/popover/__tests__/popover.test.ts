import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Popover from '../popover.vue'

describe('Popover', () => {
  it('renders title and content props when open', () => {
    const wrapper = mount(Popover, {
      props: { open: true, title: 'Card title', content: 'Card content', placement: 'rightTop' },
      slots: { default: '<button>Details</button>' }
    })

    expect(wrapper.find('.aheart-popover__popup').exists()).toBe(true)
    expect(wrapper.find('.aheart-popover__popup').classes()).toContain('aheart-floating--rightTop')
    expect(wrapper.text()).toContain('Card title')
    expect(wrapper.text()).toContain('Card content')
  })

  it('renders title and content slots', () => {
    const wrapper = mount(Popover, {
      props: { open: true },
      slots: {
        default: '<button>Details</button>',
        title: '<strong class="custom-title">Slot title</strong>',
        content: '<div class="custom-content">Slot content</div>'
      }
    })

    expect(wrapper.find('.custom-title').text()).toBe('Slot title')
    expect(wrapper.find('.custom-content').text()).toBe('Slot content')
  })

  it('toggles from click trigger and emits open events', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Clickable', trigger: 'click' },
      slots: { default: '<button>Details</button>' }
    })

    await wrapper.find('.aheart-popover__trigger').trigger('click')

    expect(wrapper.find('.aheart-popover__popup').exists()).toBe(true)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true])
  })
})
