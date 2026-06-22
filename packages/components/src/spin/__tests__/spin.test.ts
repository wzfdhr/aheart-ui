import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Spin from '../spin.vue'

describe('Spin', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders spinner with aria busy and tip', () => {
    const wrapper = mount(Spin, {
      props: {
        tip: 'Loading',
        size: 'large'
      }
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.classes()).toContain('aheart-spin--large')
    expect(wrapper.text()).toContain('Loading')
  })

  it('wraps default content and marks container loading', () => {
    const wrapper = mount(Spin, {
      props: {
        spinning: true
      },
      slots: {
        default: '<section>Content</section>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-spin-nested')
    expect(wrapper.find('.aheart-spin-container').classes()).toContain('is-blur')
    expect(wrapper.text()).toContain('Content')
  })

  it('hides spinner when spinning is false', () => {
    const wrapper = mount(Spin, {
      props: {
        spinning: false
      }
    })

    expect(wrapper.find('.aheart-spin__indicator').exists()).toBe(false)
  })

  it('applies root and semantic classes and styles', () => {
    const wrapper = mount(Spin, {
      props: {
        tip: 'Loading',
        percent: 45,
        className: 'outer-class',
        rootClassName: 'root-class',
        wrapperClassName: 'wrapper-class',
        style: { marginTop: '4px' },
        classNames: {
          root: 'semantic-root',
          section: 'semantic-section',
          container: 'semantic-container',
          indicator: 'semantic-indicator',
          dot: 'semantic-dot',
          tip: 'semantic-tip',
          percent: 'semantic-percent'
        },
        styles: {
          root: { color: 'rgb(1, 2, 3)' },
          section: { minHeight: '24px' },
          container: { padding: '8px' },
          indicator: { background: 'rgba(0, 0, 0, 0.1)' },
          dot: { fontSize: '20px' },
          tip: { color: 'rgb(4, 5, 6)' },
          percent: { fontWeight: '600' }
        }
      },
      slots: {
        default: '<section>Content</section>'
      }
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['outer-class', 'root-class', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.attributes('style')).toContain('color: rgb(1, 2, 3)')
    expect(wrapper.find('.aheart-spin-section').classes()).toEqual(
      expect.arrayContaining(['wrapper-class', 'semantic-section'])
    )
    expect(wrapper.find('.aheart-spin-section').attributes('style')).toContain('min-height: 24px')
    expect(wrapper.find('.aheart-spin-container').classes()).toContain('semantic-container')
    expect(wrapper.find('.aheart-spin-container').attributes('style')).toContain('padding: 8px')
    expect(wrapper.find('.aheart-spin__indicator').classes()).toContain('semantic-indicator')
    expect(wrapper.find('.aheart-spin__indicator').attributes('style')).toContain('background: rgba(0, 0, 0, 0.1)')
    expect(wrapper.find('.aheart-spin__dot').classes()).toContain('semantic-dot')
    expect(wrapper.find('.aheart-spin__dot').attributes('style')).toContain('font-size: 20px')
    expect(wrapper.find('.aheart-spin__tip').classes()).toContain('semantic-tip')
    expect(wrapper.find('.aheart-spin__tip').attributes('style')).toContain('color: rgb(4, 5, 6)')
    expect(wrapper.find('.aheart-spin__percent').classes()).toContain('semantic-percent')
    expect(wrapper.find('.aheart-spin__percent').attributes('style')).toContain('font-weight: 600')
    expect(wrapper.find('.aheart-spin__percent').text()).toBe('45%')
  })

  it('renders custom indicator and fullscreen state', () => {
    const wrapper = mount(Spin, {
      props: {
        fullscreen: true,
        indicator: () => h('span', { class: 'custom-indicator' }, 'Loading icon')
      }
    })

    expect(wrapper.classes()).toContain('aheart-spin-fullscreen')
    expect(wrapper.find('.custom-indicator').text()).toBe('Loading icon')
    expect(wrapper.find('.aheart-spin__dot').exists()).toBe(false)
  })

  it('delays indicator visibility', async () => {
    vi.useFakeTimers()

    const wrapper = mount(Spin, {
      props: {
        delay: 200,
        tip: 'Loading'
      }
    })

    expect(wrapper.find('.aheart-spin__indicator').exists()).toBe(false)

    vi.advanceTimersByTime(199)
    await nextTick()
    expect(wrapper.find('.aheart-spin__indicator').exists()).toBe(false)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(wrapper.find('.aheart-spin__indicator').exists()).toBe(true)
  })

  it('leaves wrapped content clear when spinning is false', () => {
    const wrapper = mount(Spin, {
      props: {
        spinning: false
      },
      slots: {
        default: '<section>Content</section>'
      }
    })

    expect(wrapper.find('.aheart-spin__indicator').exists()).toBe(false)
    expect(wrapper.find('.aheart-spin-container').classes()).not.toContain('is-blur')
    expect(wrapper.text()).toContain('Content')
  })
})
