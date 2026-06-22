import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'
import { useAheartConfig } from '../../config'
import ConfigProvider from '../config-provider.vue'

const ConfigReader = defineComponent({
  setup() {
    const config = useAheartConfig()

    return () =>
      h('div', {
        class: 'config-reader',
        'data-size': config.value.size,
        'data-disabled': String(config.value.disabled),
        'data-empty': config.value.locale?.empty?.description
      })
  }
})

describe('ConfigProvider', () => {
  it('provides size disabled and locale to descendants', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        size: 'large',
        disabled: true,
        locale: {
          empty: {
            description: '暂无内容'
          }
        }
      },
      slots: {
        default: ConfigReader
      }
    })

    const reader = wrapper.find('.config-reader')
    expect(reader.attributes('data-size')).toBe('large')
    expect(reader.attributes('data-disabled')).toBe('true')
    expect(reader.attributes('data-empty')).toBe('暂无内容')
  })

  it('applies theme tokens as scoped CSS variables', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        theme: {
          primaryColor: '#0958d9',
          borderRadius: '4px',
          fontSize: '13px'
        }
      },
      slots: {
        default: 'content'
      }
    })

    expect(wrapper.classes()).toContain('aheart-config-provider')
    expect(wrapper.attributes('style')).toContain('--aheart-color-primary: #0958d9')
    expect(wrapper.attributes('style')).toContain('--aheart-radius: 4px')
    expect(wrapper.attributes('style')).toContain('--aheart-font-size: 13px')
  })
})
