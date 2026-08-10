import { mount } from '@vue/test-utils'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { enUS, useAheartConfig } from '../../config'
import Button from '../../button/button.vue'
import ConfigProvider from '../config-provider.vue'
import Empty from '../../empty/empty.vue'
import Pagination from '../../pagination/pagination.vue'

const ConfigReader = defineComponent({
  props: {
    label: {
      type: String,
      default: 'default'
    }
  },
  setup(props) {
    const config = useAheartConfig()

    return () =>
      h('div', {
        class: 'config-reader',
        'data-label': props.label,
        'data-size': config.value.size,
        'data-disabled': String(config.value.disabled),
        'data-empty': config.value.locale?.empty?.description,
        'data-pagination-total': config.value.locale?.pagination?.total?.(42, [1, 10]),
        'data-modal-ok': config.value.locale?.modal?.okText,
        'data-theme-primary': config.value.theme?.primaryColor
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

  it('propagates runtime locale size disabled and theme updates to mounted descendants', async () => {
    const App = defineComponent({
      setup() {
        return () => h('div', { class: 'runtime-fixtures' }, [
          h(Button, { type: 'primary' }, { default: () => '主要操作' }),
          h(Empty),
          h(Pagination, { total: 42, pageSize: 10, showTotal: true }),
          h(ConfigReader)
        ])
      }
    })
    const wrapper = mount(ConfigProvider, {
      props: {
        size: 'small',
        disabled: false,
        locale: { empty: { description: '初始空状态' } },
        theme: { primaryColor: '#1677ff' }
      },
      slots: { default: () => h(App) }
    })

    expect(wrapper.find('button.aheart-button').classes()).toContain('aheart-button--small')
    expect(wrapper.find('.aheart-button').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.aheart-empty__description').text()).toBe('初始空状态')
    expect(wrapper.find('.aheart-pagination').attributes('aria-label')).toBe('分页')
    expect(wrapper.find('.aheart-pagination__total').text()).toBe('共 42 条')

    await wrapper.setProps({
      size: 'large',
      disabled: true,
      locale: enUS,
      theme: { primaryColor: '#0958d9' }
    })

    const button = wrapper.find('button.aheart-button')
    const empty = wrapper.find('.aheart-empty__description')
    const pagination = wrapper.find('.aheart-pagination')
    const reader = wrapper.find('.config-reader')
    expect(button.classes()).toContain('aheart-button--large')
    expect(button.attributes('disabled')).toBeDefined()
    expect(empty.text()).toBe('No Data')
    expect(pagination.attributes('aria-label')).toBe('pagination')
    expect(pagination.find('.aheart-pagination__total').text()).toBe('Total 42 items')
    expect(reader.attributes('data-size')).toBe('large')
    expect(reader.attributes('data-disabled')).toBe('true')
    expect(reader.attributes('data-empty')).toBe('No Data')
    expect(reader.attributes('data-theme-primary')).toBe('#0958d9')
    expect(wrapper.attributes('style')).toContain('--aheart-color-primary: #0958d9')
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

  it('uses the nearest nested provider override without leaking to an outer sibling', () => {
    const NestedProviders = defineComponent({
      setup() {
        return () =>
          h(
            ConfigProvider,
            {
              size: 'large',
              disabled: true,
              locale: enUS,
              theme: { primaryColor: '#1677ff' }
            },
            {
              default: () => [
                h(ConfigProvider, { locale: { empty: { description: '中层空状态' } } }, {
                  default: () =>
                    h(ConfigProvider, { size: 'small', disabled: false, theme: { primaryColor: '#0958d9' } }, {
                      default: () => h('section', { 'data-label': 'inner' }, [
                        h(ConfigReader, { label: 'inner' }),
                        h(Button, { type: 'primary' }, { default: () => '内层操作' }),
                        h(Empty),
                        h(Pagination, { total: 42, pageSize: 10, showTotal: true })
                      ])
                    })
                }),
                h('section', { 'data-label': 'outer-sibling' }, [
                  h(ConfigReader, { label: 'outer-sibling' }),
                  h(Button, { type: 'primary' }, { default: () => '外层操作' }),
                  h(Empty),
                  h(Pagination, { total: 42, pageSize: 10, showTotal: true })
                ])
              ]
            }
          )
      }
    })

    const wrapper = mount(NestedProviders)
    const innerRegion = wrapper.find('[data-label="inner"]')
    const siblingRegion = wrapper.find('[data-label="outer-sibling"]')
    const inner = innerRegion.find('.config-reader')
    const sibling = siblingRegion.find('.config-reader')

    expect(inner.attributes('data-size')).toBe('small')
    expect(inner.attributes('data-disabled')).toBe('false')
    expect(inner.attributes('data-empty')).toBe('中层空状态')
    expect(inner.attributes('data-theme-primary')).toBe('#0958d9')
    expect(sibling.attributes('data-size')).toBe('large')
    expect(sibling.attributes('data-disabled')).toBe('true')
    expect(sibling.attributes('data-empty')).toBe('No Data')
    expect(sibling.attributes('data-theme-primary')).toBe('#1677ff')

    expect(innerRegion.find('.aheart-button').classes()).toContain('aheart-button--small')
    expect(innerRegion.find('.aheart-button').attributes('disabled')).toBeUndefined()
    expect(innerRegion.find('.aheart-empty__description').text()).toBe('中层空状态')
    expect(innerRegion.find('.aheart-pagination').attributes('aria-label')).toBe('pagination')
    expect(siblingRegion.find('.aheart-button').classes()).toContain('aheart-button--large')
    expect(siblingRegion.find('.aheart-button').attributes('disabled')).toBeDefined()
    expect(siblingRegion.find('.aheart-empty__description').text()).toBe('No Data')
    expect(siblingRegion.find('.aheart-pagination').attributes('aria-label')).toBe('pagination')
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

  it('hydrates Chinese HTML without Vue warnings and remains reactive after locale and theme switches', async () => {
    const state = ref({
      locale: undefined,
      size: 'middle' as const,
      disabled: false,
      theme: { primaryColor: '#1677ff' }
    })
    const App = defineComponent({
      setup() {
        return () => h(ConfigProvider, state.value, {
          default: () => h('div', { class: 'hydration-fixtures' }, [
            h(Button, { type: 'primary' }, { default: () => '主要操作' }),
            h(Empty),
            h(Pagination, { total: 42, pageSize: 10, showTotal: true })
          ])
        })
      }
    })

    const html = await renderToString(createSSRApp(App))
    const host = document.createElement('div')
    host.innerHTML = html
    document.body.replaceChildren(host)

    const warnings: string[] = []
    const warn = vi.spyOn(console, 'warn').mockImplementation((...args) => warnings.push(`console.warn: ${args.join(' ')}`))
    const error = vi.spyOn(console, 'error').mockImplementation((...args) => warnings.push(`console.error: ${args.join(' ')}`))
    const clientApp = createSSRApp(App)
    clientApp.config.warnHandler = (message) => warnings.push(`app.warnHandler: ${message}`)
    clientApp.mount(host, true)

    expect(host.querySelector('.aheart-empty__description')?.textContent).toBe('暂无数据')
    expect(host.querySelector('.aheart-button')?.classList).toContain('aheart-button--normal')
    expect(host.querySelector('.aheart-button')?.hasAttribute('disabled')).toBe(false)
    expect(host.querySelector('.aheart-pagination')?.getAttribute('aria-label')).toBe('分页')
    expect(host.querySelector('.aheart-pagination__total')?.textContent).toBe('共 42 条')
    expect(warnings).toEqual([])

    state.value = {
      locale: enUS,
      size: 'large',
      disabled: true,
      theme: { primaryColor: '#0958d9' }
    }
    await nextTick()

    const provider = document.querySelector('.aheart-config-provider') as HTMLElement
    const button = document.querySelector('.hydration-fixtures .aheart-button') as HTMLButtonElement
    const pagination = document.querySelector('.hydration-fixtures .aheart-pagination') as HTMLElement
    expect(document.querySelector('.aheart-empty__description')?.textContent).toBe('No Data')
    expect(button.classList).toContain('aheart-button--large')
    expect(button.disabled).toBe(true)
    expect(pagination.getAttribute('aria-label')).toBe('pagination')
    expect(pagination.querySelector('.aheart-pagination__total')?.textContent).toBe('Total 42 items')
    expect(provider.getAttribute('style')).toContain('--aheart-color-primary: #0958d9')
    expect(warnings).toEqual([])
    clientApp.unmount()
    warn.mockRestore()
    error.mockRestore()
  })
})
