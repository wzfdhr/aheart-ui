import { mount } from '@vue/test-utils'
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
})
