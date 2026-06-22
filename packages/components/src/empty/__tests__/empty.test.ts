import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Empty from '../empty.vue'

describe('Empty', () => {
  it('renders default description', () => {
    const wrapper = mount(Empty)

    expect(wrapper.classes()).toContain('aheart-empty')
    expect(wrapper.text()).toContain('No Data')
  })

  it('uses description prop before locale', () => {
    const wrapper = mount(Empty, {
      props: {
        description: 'Nothing here'
      }
    })

    expect(wrapper.text()).toContain('Nothing here')
  })

  it('uses ConfigProvider empty locale fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        locale: {
          empty: {
            description: '暂无内容'
          }
        }
      },
      slots: {
        default: {
          render() {
            return h(Empty)
          }
        }
      }
    })

    expect(wrapper.text()).toContain('暂无内容')
  })

  it('renders image and default action slots', () => {
    const wrapper = mount(Empty, {
      slots: {
        image: '<span class="custom-image">image</span>',
        default: '<button>Create</button>'
      }
    })

    expect(wrapper.find('.custom-image').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Create')
  })
})
