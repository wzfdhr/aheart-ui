import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Flex from '../flex.vue'

describe('Flex', () => {
  it('renders flex layout classes and numeric gap variable', () => {
    const wrapper = mount(Flex, {
      props: {
        justify: 'between',
        align: 'center',
        gap: 12,
        wrap: true
      },
      slots: {
        default: '<span>One</span><span>Two</span>'
      }
    })

    expect(wrapper.classes()).toContain('aheart-flex')
    expect(wrapper.classes()).toContain('aheart-flex--justify-between')
    expect(wrapper.classes()).toContain('aheart-flex--align-center')
    expect(wrapper.classes()).toContain('is-wrap')
    expect(wrapper.attributes('style')).toContain('--aheart-flex-gap: 12px')
  })

  it('supports vertical direction and token gap', () => {
    const wrapper = mount(Flex, {
      props: {
        vertical: true,
        gap: 'large'
      }
    })

    expect(wrapper.classes()).toContain('is-vertical')
    expect(wrapper.attributes('style')).toContain('--aheart-flex-gap: var(--aheart-spacing-lg)')
  })
})
