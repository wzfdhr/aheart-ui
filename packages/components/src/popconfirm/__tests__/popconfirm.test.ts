import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Popconfirm from '../popconfirm.vue'

describe('Popconfirm', () => {
  it('opens from click trigger with title description icon and buttons', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Delete item?', description: 'This cannot be undone.' },
      slots: { default: '<button>Delete</button>' }
    })

    await wrapper.find('.aheart-popconfirm__trigger').trigger('click')

    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(true)
    expect(wrapper.text()).toContain('Delete item?')
    expect(wrapper.text()).toContain('This cannot be undone.')
    expect(wrapper.text()).toContain('OK')
    expect(wrapper.text()).toContain('Cancel')
    expect(wrapper.find('.aheart-popconfirm__icon').exists()).toBe(true)
  })

  it('emits confirm and closes from OK', async () => {
    const wrapper = mount(Popconfirm, {
      props: { defaultOpen: true, title: 'Delete item?' },
      slots: { default: '<button>Delete</button>' }
    })

    await wrapper.find('.aheart-popconfirm__ok').trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.emitted('openChange')?.[0]).toEqual([false])
    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(false)
  })

  it('emits cancel and closes from Cancel', async () => {
    const wrapper = mount(Popconfirm, {
      props: { defaultOpen: true, title: 'Delete item?' },
      slots: { default: '<button>Delete</button>' }
    })

    await wrapper.find('.aheart-popconfirm__cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.find('.aheart-popconfirm__popup').exists()).toBe(false)
  })

  it('respects disabled and showCancel options', async () => {
    const disabled = mount(Popconfirm, {
      props: { disabled: true, title: 'Delete item?' },
      slots: { default: '<button>Delete</button>' }
    })

    await disabled.find('.aheart-popconfirm__trigger').trigger('click')
    expect(disabled.find('.aheart-popconfirm__popup').exists()).toBe(false)

    const withoutCancel = mount(Popconfirm, {
      props: { defaultOpen: true, title: 'Delete item?', showCancel: false },
      slots: { default: '<button>Delete</button>' }
    })

    expect(withoutCancel.find('.aheart-popconfirm__cancel').exists()).toBe(false)
    expect(withoutCancel.find('.aheart-popconfirm__ok').exists()).toBe(true)
  })
})
