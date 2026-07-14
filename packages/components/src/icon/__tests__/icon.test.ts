import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import Icon from '../icon.vue'

describe('Icon', () => {
  it('renders known names as SVG icons instead of fallback text', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'search'
      }
    })

    expect(wrapper.classes()).toContain('aheart-icon')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('svg.lucide-search').exists()).toBe(true)
    expect(wrapper.text()).toBe('')
  })

  it.each(['setting', 'settings'])("supports the '%s' settings alias", (name) => {
    const wrapper = mount(Icon, { props: { name } })

    expect(wrapper.find('svg.lucide-settings').exists()).toBe(true)
  })

  it('renders a supplied component before a named icon', () => {
    const CustomIcon = defineComponent(() => () => h('svg', { 'data-custom-icon': '' }))
    const wrapper = mount(Icon, {
      props: {
        component: CustomIcon,
        name: 'search'
      }
    })

    expect(wrapper.find('[data-custom-icon]').exists()).toBe(true)
    expect(wrapper.find('.lucide-search').exists()).toBe(false)
  })

  it('accepts functional icon components without prop warnings', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const FunctionalIcon = () => h('svg', { 'data-functional-icon': '' })
    const wrapper = mount(Icon, { props: { component: FunctionalIcon } })

    expect(wrapper.find('[data-functional-icon]').exists()).toBe(true)
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('gives the default slot priority over component and name', () => {
    const CustomIcon = defineComponent(() => () => h('svg', { 'data-custom-icon': '' }))
    const wrapper = mount(Icon, {
      props: {
        component: CustomIcon,
        name: 'search'
      },
      slots: {
        default: '<svg data-slot-icon></svg>'
      }
    })

    expect(wrapper.find('[data-slot-icon]').exists()).toBe(true)
    expect(wrapper.find('[data-custom-icon]').exists()).toBe(false)
    expect(wrapper.find('.lucide-search').exists()).toBe(false)
  })

  it('warns once for an unknown name and renders empty content', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const first = mount(Icon, { props: { name: 'missing-q1-icon' } })
    const second = mount(Icon, { props: { name: 'missing-q1-icon' } })

    expect(first.find('svg').exists()).toBe(false)
    expect(second.find('svg').exists()).toBe(false)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0]?.[0])).toContain('[Aheart UI] Unknown icon name: missing-q1-icon')
    warn.mockRestore()
  })

  it('renders custom slot and size color styles', () => {
    const wrapper = mount(Icon, {
      props: {
        size: 20,
        color: '#1677ff'
      },
      slots: {
        default: '<svg viewBox="0 0 16 16"><path d="M1 1h14v14H1z" /></svg>'
      }
    })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.attributes('style')).toContain('--aheart-icon-size: 20px')
    expect(wrapper.attributes('style')).toContain('--aheart-icon-color: #1677ff')
  })

  it('adds spin class when spin is true', () => {
    const wrapper = mount(Icon, {
      props: {
        spin: true
      }
    })

    expect(wrapper.classes()).toContain('aheart-icon--spin')
  })
})
