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

  it('supports root hooks custom component and CSS-compatible layout values', () => {
    const wrapper = mount(Flex, {
      props: {
        component: 'section',
        orientation: 'horizontal',
        vertical: true,
        wrap: 'wrap-reverse',
        justify: 'space-between',
        align: 'flex-start',
        gap: '2rem',
        flex: '1 1 auto',
        className: 'flex-class',
        rootClassName: 'flex-root',
        style: { marginTop: '4px' }
      },
      slots: {
        default: '<span>One</span><span>Two</span>'
      }
    })

    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.classes()).toContain('flex-class')
    expect(wrapper.classes()).toContain('flex-root')
    expect(wrapper.classes()).toContain('aheart-flex--horizontal')
    expect(wrapper.classes()).not.toContain('is-vertical')
    expect(wrapper.attributes('style')).toContain('--aheart-flex-gap: 2rem')
    expect(wrapper.attributes('style')).toContain('flex-wrap: wrap-reverse')
    expect(wrapper.attributes('style')).toContain('justify-content: space-between')
    expect(wrapper.attributes('style')).toContain('align-items: flex-start')
    expect(wrapper.attributes('style')).toContain('flex: 1 1 auto')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
  })

  it('supports Ant medium gap and keeps local justify aliases', () => {
    const wrapper = mount(Flex, {
      props: {
        justify: 'between',
        align: 'center',
        gap: 'medium',
        wrap: 'reverse'
      }
    })

    expect(wrapper.classes()).toContain('aheart-flex--justify-between')
    expect(wrapper.classes()).toContain('aheart-flex--align-center')
    expect(wrapper.classes()).toContain('is-wrap-reverse')
    expect(wrapper.attributes('style')).toContain('--aheart-flex-gap: var(--aheart-spacing-md)')
    expect(wrapper.attributes('style')).toContain('justify-content: space-between')
    expect(wrapper.attributes('style')).toContain('align-items: center')
    expect(wrapper.attributes('style')).toContain('flex-wrap: wrap-reverse')
  })
})
