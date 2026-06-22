import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import Skeleton from '../skeleton.vue'

describe('Skeleton', () => {
  it('renders default title and paragraph placeholders', () => {
    const wrapper = mount(Skeleton)

    expect(wrapper.classes()).toContain('aheart-skeleton')
    expect(wrapper.find('.aheart-skeleton__title').exists()).toBe(true)
    expect(wrapper.findAll('.aheart-skeleton__paragraph-row')).toHaveLength(3)
  })

  it('renders active avatar title paragraph and round variants', () => {
    const wrapper = mount(Skeleton, {
      props: {
        active: true,
        round: true,
        avatar: { size: 40, shape: 'circle' },
        title: { width: '60%' },
        paragraph: { rows: 2, width: ['80%', '50%'] }
      }
    })

    expect(wrapper.classes()).toContain('is-active')
    expect(wrapper.classes()).toContain('is-round')
    expect(wrapper.find('.aheart-skeleton__avatar').attributes('style')).toContain('width: 40px')
    expect(wrapper.find('.aheart-skeleton__title').attributes('style')).toContain('width: 60%')
    expect(wrapper.findAll('.aheart-skeleton__paragraph-row')).toHaveLength(2)
  })

  it('renders slot content when loading is false', () => {
    const wrapper = mount(Skeleton, {
      props: { loading: false },
      slots: { default: '<div class="loaded">Loaded</div>' }
    })

    expect(wrapper.find('.loaded').text()).toBe('Loaded')
    expect(wrapper.find('.aheart-skeleton__title').exists()).toBe(false)
  })

  it('applies root and semantic class/style hooks', () => {
    const wrapper = mount(Skeleton, {
      props: {
        className: 'custom-skeleton',
        rootClassName: 'root-skeleton',
        style: { marginTop: '4px' },
        avatar: true,
        classNames: {
          root: 'semantic-root',
          avatar: 'semantic-avatar',
          content: 'semantic-content',
          title: 'semantic-title',
          paragraph: 'semantic-paragraph',
          paragraphRow: 'semantic-row'
        },
        styles: {
          root: { padding: '8px' },
          title: { width: '44%' },
          paragraphRow: { height: '18px' }
        }
      }
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom-skeleton', 'root-skeleton', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.attributes('style')).toContain('padding: 8px')
    expect(wrapper.find('.aheart-skeleton__avatar').classes()).toContain('semantic-avatar')
    expect(wrapper.find('.aheart-skeleton__content').classes()).toContain('semantic-content')
    expect(wrapper.find('.aheart-skeleton__title').classes()).toContain('semantic-title')
    expect(wrapper.find('.aheart-skeleton__title').attributes('style')).toContain('width: 44%')
    expect(wrapper.find('.aheart-skeleton__paragraph').classes()).toContain('semantic-paragraph')
    expect(wrapper.find('.aheart-skeleton__paragraph-row').classes()).toContain('semantic-row')
    expect(wrapper.find('.aheart-skeleton__paragraph-row').attributes('style')).toContain('height: 18px')
  })

  it('renders button input image and node placeholders', () => {
    const wrapper = mount(Skeleton, {
      props: {
        title: false,
        paragraph: false,
        button: { block: true, shape: 'round', size: 'large', width: 160 },
        input: { size: 'small', width: '70%' },
        image: { width: 96, height: 72 },
        node: { width: 48, height: 48, children: h('span', { class: 'node-child' }, 'N') }
      }
    })

    expect(wrapper.find('.aheart-skeleton__button').classes()).toEqual(
      expect.arrayContaining(['is-block', 'aheart-skeleton__button--round', 'aheart-skeleton__button--large'])
    )
    expect(wrapper.find('.aheart-skeleton__button').attributes('style')).toContain('width: 160px')
    expect(wrapper.find('.aheart-skeleton__input').classes()).toContain('aheart-skeleton__input--small')
    expect(wrapper.find('.aheart-skeleton__input').attributes('style')).toContain('width: 70%')
    expect(wrapper.find('.aheart-skeleton__image').attributes('style')).toContain('width: 96px')
    expect(wrapper.find('.aheart-skeleton__image').attributes('style')).toContain('height: 72px')
    expect(wrapper.find('.aheart-skeleton__node').attributes('style')).toContain('width: 48px')
    expect(wrapper.find('.node-child').text()).toBe('N')
    expect(wrapper.find('.aheart-skeleton__title').exists()).toBe(false)
  })

  it('supports local active overrides on sub placeholders', () => {
    const wrapper = mount(Skeleton, {
      props: {
        active: false,
        title: false,
        paragraph: false,
        button: { active: true },
        input: true,
        image: { active: true },
        node: { active: true }
      }
    })

    expect(wrapper.classes()).not.toContain('is-active')
    expect(wrapper.find('.aheart-skeleton__button').classes()).toContain('is-active')
    expect(wrapper.find('.aheart-skeleton__input').classes()).not.toContain('is-active')
    expect(wrapper.find('.aheart-skeleton__image').classes()).toContain('is-active')
    expect(wrapper.find('.aheart-skeleton__node').classes()).toContain('is-active')
  })
})
