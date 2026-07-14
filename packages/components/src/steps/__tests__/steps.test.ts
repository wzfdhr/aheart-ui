import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Steps from '../steps.vue'

const items = [
  { title: 'Finished', description: 'This step is complete.' },
  { title: 'In Progress', description: 'This step is active.' },
  { title: 'Waiting', description: 'This step is upcoming.' }
]

describe('Steps', () => {
  it('derives finish, process, and wait statuses from current', () => {
    const wrapper = mount(Steps, {
      props: { items, current: 1 }
    })

    const steps = wrapper.findAll('.aheart-steps__item')
    expect(wrapper.attributes('role')).toBe('list')
    expect(steps[0].classes()).toContain('aheart-steps__item--finish')
    expect(steps[1].classes()).toContain('aheart-steps__item--process')
    expect(steps[1].attributes('aria-current')).toBe('step')
    expect(steps[2].classes()).toContain('aheart-steps__item--wait')
  })

  it('emits change when an enabled non-current step is clicked', async () => {
    const wrapper = mount(Steps, {
      props: { items, current: 0 }
    })

    await wrapper.findAll('.aheart-steps__button')[1].trigger('click')

    expect(wrapper.emitted('change')?.[0]).toEqual([1])
  })

  it('respects disabled items and explicit error status', async () => {
    const wrapper = mount(Steps, {
      props: {
        current: 1,
        items: [
          { title: 'Account' },
          { title: 'Billing', status: 'error' },
          { title: 'Confirm', disabled: true }
        ]
      }
    })

    await wrapper.findAll('.aheart-steps__button')[2].trigger('click')

    expect(wrapper.findAll('.aheart-steps__item')[1].classes()).toContain('aheart-steps__item--error')
    expect(wrapper.findAll('.aheart-steps__item')[2].classes()).toContain('is-disabled')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('uses vertical direction and ConfigProvider size fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small' },
      slots: {
        default: {
          render() {
            return h(Steps, { items, current: 1, direction: 'vertical' })
          }
        }
      }
    })

    const steps = wrapper.findComponent(Steps)
    expect(steps.classes()).toContain('aheart-steps--vertical')
    expect(steps.classes()).toContain('aheart-steps--small')
  })

  it('renders type orientation title placement initial and percent controls', () => {
    const wrapper = mount(Steps, {
      props: {
        items,
        current: 1,
        type: 'dot',
        orientation: 'vertical',
        titlePlacement: 'vertical',
        initial: 3,
        percent: 65
      }
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'aheart-steps--dot',
        'aheart-steps--vertical',
        'aheart-steps--title-vertical'
      ])
    )
    expect(wrapper.findAll('.aheart-steps__icon')[0].text()).toBe('')
    expect(wrapper.findAll('.aheart-steps__icon')[1].text()).toContain('65%')
    expect(wrapper.findAll('.aheart-steps__icon')[1].attributes('style')).toContain('--aheart-steps-percent: 65')
  })

  it('uses initial for generated numeric indicators in non-dot mode', () => {
    const wrapper = mount(Steps, {
      props: {
        items,
        initial: 3
      }
    })

    expect(wrapper.findAll('.aheart-steps__icon')[0].text()).toBe('3')
  })

  it('renders item icons subtitles and content', () => {
    const wrapper = mount(Steps, {
      props: {
        type: 'panel',
        current: 1,
        items: [
          { title: 'Account', icon: 'A', subTitle: 'Ready', content: 'Account content' },
          { title: 'Billing', icon: 'B', subTitle: 'Now', description: 'Add card', content: 'Billing content' }
        ]
      }
    })

    expect(wrapper.classes()).toContain('aheart-steps--panel')
    expect(wrapper.findAll('.aheart-steps__icon').map((icon) => icon.text())).toEqual(['A', 'B'])
    expect(wrapper.findAll('.aheart-steps__subtitle').map((subtitle) => subtitle.text())).toEqual(['Ready', 'Now'])
    expect(wrapper.findAll('.aheart-steps__extra-content').map((content) => content.text())).toEqual([
      'Account content',
      'Billing content'
    ])
  })

  it('renders vnode item title description icon subtitle and content', () => {
    const wrapper = mount(Steps, {
      props: {
        current: 1,
        items: [
          {
            title: h('span', { class: 'title-node' }, 'Account node'),
            icon: h('span', { class: 'icon-node' }, 'A'),
            subTitle: h('span', { class: 'subtitle-node' }, 'Ready'),
            description: h('span', { class: 'description-node' }, 'Account description'),
            content: h('span', { class: 'content-node' }, 'Account content')
          }
        ]
      }
    })

    expect(wrapper.find('.title-node').text()).toBe('Account node')
    expect(wrapper.find('.icon-node').text()).toBe('A')
    expect(wrapper.find('.subtitle-node').text()).toBe('Ready')
    expect(wrapper.find('.description-node').text()).toBe('Account description')
    expect(wrapper.find('.content-node').text()).toBe('Account content')
  })

  it('renders dot type without generated numeric text', () => {
    const wrapper = mount(Steps, {
      props: {
        type: 'dot',
        current: 1,
        initial: 3,
        items
      }
    })

    expect(wrapper.findAll('.aheart-steps__icon-text')).toHaveLength(0)
    expect(wrapper.findAll('.aheart-steps__icon').map((icon) => icon.text())).toEqual(['', '', ''])
  })

  it('keeps explicit item icons in dot type', () => {
    const wrapper = mount(Steps, {
      props: {
        type: 'dot',
        current: 0,
        items: [{ title: 'Custom', icon: h('span', { class: 'dot-icon-node' }, 'C') }]
      }
    })

    expect(wrapper.find('.dot-icon-node').text()).toBe('C')
  })

  it('applies root and semantic class and style hooks', () => {
    const wrapper = mount(Steps, {
      props: {
        items,
        current: 1,
        className: 'steps-class',
        rootClassName: 'steps-root',
        style: 'color: red;',
        classNames: {
          root: 'semantic-root',
          item: 'semantic-item',
          activeItem: 'semantic-active-item',
          button: 'semantic-button',
          indicator: 'semantic-indicator',
          icon: 'semantic-icon',
          content: 'semantic-content',
          title: 'semantic-title',
          subTitle: 'semantic-subtitle',
          description: 'semantic-description',
          connector: 'semantic-connector'
        },
        styles: {
          root: { backgroundColor: 'blue' },
          item: { minWidth: '80px' },
          activeItem: { fontWeight: 700 },
          button: { gap: '4px' },
          indicator: { marginRight: '4px' },
          icon: { color: 'green' },
          content: { paddingRight: '12px' },
          title: { letterSpacing: '1px' },
          subTitle: { color: 'purple' },
          description: { marginTop: '6px' },
          connector: { backgroundColor: 'orange' }
        }
      }
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['steps-class', 'steps-root', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.attributes('style')).toContain('background-color: blue')
    expect(wrapper.find('.aheart-steps__item').classes()).toContain('semantic-item')
    expect(wrapper.find('.aheart-steps__item--process').classes()).toContain('semantic-active-item')
    expect(wrapper.find('.aheart-steps__button').classes()).toContain('semantic-button')
    expect(wrapper.find('.aheart-steps__indicator').classes()).toContain('semantic-indicator')
    expect(wrapper.find('.aheart-steps__icon').classes()).toContain('semantic-icon')
    expect(wrapper.find('.aheart-steps__content').classes()).toContain('semantic-content')
    expect(wrapper.find('.aheart-steps__title').classes()).toContain('semantic-title')
    expect(wrapper.find('.aheart-steps__description').classes()).toContain('semantic-description')
    expect(wrapper.find('.aheart-steps__connector').classes()).toContain('semantic-connector')
    expect(wrapper.find('.aheart-steps__connector').attributes('style')).toContain('background-color: orange')
  })

  it('does not nest interactive step content inside the step trigger', () => {
    const wrapper = mount(Steps, {
      props: {
        current: 1,
        items: [
          {
            title: 'Review',
            content: h('button', { class: 'step-content-action', type: 'button' }, 'Details')
          },
          { title: 'Publish' }
        ]
      }
    })

    expect(wrapper.find('.aheart-steps__button .step-content-action').exists()).toBe(false)
    expect(wrapper.find('.aheart-steps__extra-content .step-content-action').exists()).toBe(true)
  })
})
