import { mount } from '@vue/test-utils'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'
import { enUS, useAheartConfig } from '../../config'
import ConfigProvider from '../config-provider.vue'

const ConfigReader = defineComponent({
  setup() {
    const config = useAheartConfig()

    return () =>
      h('div', {
        class: 'config-reader',
        'data-size': config.value.size,
        'data-disabled': String(config.value.disabled),
        'data-empty': config.value.locale?.empty?.description,
        'data-pagination-total': config.value.locale?.pagination?.total?.(42, [1, 10]),
        'data-modal-ok': config.value.locale?.modal?.okText
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

  it('uses Simplified Chinese locale defaults', () => {
    const wrapper = mount(ConfigReader)
    const reader = wrapper.find('.config-reader')

    expect(reader.attributes('data-empty')).toBe('暂无数据')
    expect(reader.attributes('data-pagination-total')).toBe('共 42 条')
    expect(reader.attributes('data-modal-ok')).toBe('确定')
  })

  it('deeply merges a nested locale override with its parent locale', () => {
    const NestedProvider = defineComponent({
      setup() {
        return () =>
          h(
            ConfigProvider,
            { locale: enUS },
            {
              default: () =>
                h(
                  ConfigProvider,
                  { locale: { modal: { okText: 'Proceed' } } },
                  { default: () => h(ConfigReader) }
                )
            }
          )
      }
    })

    const wrapper = mount(NestedProvider)
    const reader = wrapper.find('.config-reader')

    expect(reader.attributes('data-empty')).toBe('No Data')
    expect(reader.attributes('data-pagination-total')).toBe('Total 42 items')
    expect(reader.attributes('data-modal-ok')).toBe('Proceed')
  })

  it('deeply merges date and time picker locale copy', () => {
    const Consumer = defineComponent({
      setup() {
        const config = useAheartConfig()
        return () =>
          h('span', [
            config.value.locale?.datePicker?.today,
            '|',
            config.value.locale?.datePicker?.selectDate,
            '|',
            config.value.locale?.timePicker?.now,
            '|',
            config.value.locale?.datePicker?.weekStartsOn,
            '|',
            config.value.locale?.datePicker?.weekdaysShort?.join(',')
          ])
      }
    })
    const wrapper = mount(ConfigProvider, {
      props: { locale: { datePicker: { today: '本日' } } },
      slots: { default: () => h(Consumer) }
    })

    expect(wrapper.text()).toBe('本日|请选择日期|此刻|1|一,二,三,四,五,六,日')
  })

  it('renders locale defaults during SSR without browser globals', async () => {
    const app = createSSRApp({
      render: () => h(ConfigProvider, null, { default: () => h(ConfigReader) })
    })

    const html = await renderToString(app)

    expect(html).toContain('data-empty="暂无数据"')
    expect(html).toContain('data-pagination-total="共 42 条"')
    expect(html).toContain('data-modal-ok="确定"')
  })
})
