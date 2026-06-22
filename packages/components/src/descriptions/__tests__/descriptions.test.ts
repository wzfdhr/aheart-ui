import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Descriptions from '../descriptions.vue'

const items = [
  { label: 'User', content: 'Ada' },
  { label: 'Role', content: 'Admin' },
  { label: 'Status', content: 'Active', span: 2 }
]

describe('Descriptions', () => {
  it('renders title, extra, items, and table semantics', () => {
    const wrapper = mount(Descriptions, {
      props: { title: 'Profile', extra: 'Updated', items }
    })

    expect(wrapper.classes()).toContain('aheart-descriptions')
    expect(wrapper.find('[role="table"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="row"]').length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('Profile')
    expect(wrapper.text()).toContain('Updated')
    expect(wrapper.text()).toContain('Ada')
    expect(wrapper.text()).toContain('Active')
  })

  it('applies bordered, vertical, column, and ConfigProvider size classes', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large' },
      slots: {
        default: {
          render() {
            return h(Descriptions, { items, bordered: true, layout: 'vertical', column: 2 })
          }
        }
      }
    })

    const descriptions = wrapper.findComponent(Descriptions)
    expect(descriptions.classes()).toContain('aheart-descriptions--large')
    expect(descriptions.classes()).toContain('is-bordered')
    expect(descriptions.classes()).toContain('aheart-descriptions--vertical')
    expect(descriptions.attributes('style')).toContain('--aheart-descriptions-column: 2')
  })
})
