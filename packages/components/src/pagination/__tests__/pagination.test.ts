import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Pagination from '../pagination.vue'

describe('Pagination', () => {
  it('renders page buttons and total text', () => {
    const wrapper = mount(Pagination, {
      props: { total: 42, pageSize: 10, current: 2, showTotal: true }
    })

    expect(wrapper.attributes('aria-label')).toBe('pagination')
    expect(wrapper.text()).toContain('Total 42 items')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('2')
    expect(wrapper.findAll('.aheart-pagination__page')).toHaveLength(5)
  })

  it('emits current updates when page and next buttons are clicked', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, defaultCurrent: 1, pageSize: 10 }
    })

    await wrapper.findAll('.aheart-pagination__page')[1].trigger('click')
    await wrapper.find('.aheart-pagination__next').trigger('click')

    expect(wrapper.emitted('update:current')?.[0]).toEqual([2])
    expect(wrapper.emitted('change')?.[0]).toEqual([2, 10])
    expect(wrapper.emitted('update:current')?.[1]).toEqual([3])
  })

  it('renders simple mode and respects ConfigProvider disabled and size', () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true, size: 'small' },
      slots: {
        default: {
          render() {
            return h(Pagination, { total: 20, current: 1, pageSize: 10, simple: true })
          }
        }
      }
    })

    const pagination = wrapper.findComponent(Pagination)
    expect(pagination.classes()).toContain('aheart-pagination--small')
    expect(pagination.find('.aheart-pagination__simple').text()).toBe('1 / 2')
    expect(pagination.find('button').attributes()).toHaveProperty('disabled')
  })

  it('hides on single page when hideOnSinglePage is true', () => {
    const wrapper = mount(Pagination, {
      props: { total: 5, pageSize: 10, hideOnSinglePage: true }
    })

    expect(wrapper.html()).toBe('<!--v-if-->')
  })
})
