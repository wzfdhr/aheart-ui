import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Link from '../link.vue'
import Paragraph from '../paragraph.vue'
import Text from '../text.vue'
import Title from '../title.vue'
import Typography from '../typography.vue'

describe('Typography', () => {
  it('renders the root typography wrapper', () => {
    const wrapper = mount(Typography, {
      slots: {
        default: 'Content'
      }
    })

    expect(wrapper.classes()).toContain('aheart-typography')
    expect(wrapper.text()).toContain('Content')
  })

  it('renders title with semantic heading level', () => {
    const wrapper = mount(Title, {
      props: {
        level: 3
      },
      slots: {
        default: 'Heading'
      }
    })

    expect(wrapper.element.tagName).toBe('H3')
    expect(wrapper.classes()).toContain('aheart-typography-title--3')
  })

  it('renders text modifiers', () => {
    const wrapper = mount(Text, {
      props: {
        type: 'success',
        strong: true,
        code: true
      },
      slots: {
        default: 'Done'
      }
    })

    expect(wrapper.element.tagName).toBe('CODE')
    expect(wrapper.classes()).toContain('aheart-typography-text--success')
    expect(wrapper.classes()).toContain('is-strong')
  })

  it('renders paragraph with ellipsis-ready class', () => {
    const wrapper = mount(Paragraph, {
      props: {
        ellipsis: true
      },
      slots: {
        default: 'Long content'
      }
    })

    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.classes()).toContain('is-ellipsis')
  })

  it('renders link and handles disabled state', () => {
    const wrapper = mount(Link, {
      props: {
        href: 'https://example.com',
        disabled: true
      },
      slots: {
        default: 'Open'
      }
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.classes()).toContain('is-disabled')
  })
})
