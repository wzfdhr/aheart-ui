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

  it('applies root hooks to typography wrapper', () => {
    const wrapper = mount(Typography, {
      props: {
        className: 'legacy-typography',
        rootClassName: 'root-typography',
        style: { marginTop: '4px' },
        classNames: {
          root: 'semantic-typography-root'
        },
        styles: {
          root: { padding: '8px' }
        }
      },
      slots: {
        default: 'Content'
      }
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['legacy-typography', 'root-typography', 'semantic-typography-root'])
    )
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.attributes('style')).toContain('padding: 8px')
  })

  it('applies title type disabled mark and root hooks', () => {
    const wrapper = mount(Title, {
      props: {
        level: 4,
        type: 'warning',
        disabled: true,
        mark: true,
        className: 'title-class',
        rootClassName: 'title-root',
        style: { marginBottom: '2px' },
        classNames: {
          root: 'semantic-title-root'
        },
        styles: {
          root: { color: 'rgb(250, 173, 20)' }
        }
      },
      slots: {
        default: 'Heading'
      }
    })

    expect(wrapper.element.tagName).toBe('H4')
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'aheart-typography-title--warning',
        'is-disabled',
        'is-mark',
        'title-class',
        'title-root',
        'semantic-title-root'
      ])
    )
    expect(wrapper.attributes('style')).toContain('margin-bottom: 2px')
    expect(wrapper.attributes('style')).toContain('color: rgb(250, 173, 20)')
  })

  it('renders marked text with semantic root hooks', () => {
    const wrapper = mount(Text, {
      props: {
        mark: true,
        strong: true,
        className: 'text-class',
        rootClassName: 'text-root',
        classNames: ({ props }) => ({
          root: props.mark ? 'semantic-marked-text' : 'semantic-text'
        }),
        styles: {
          root: { letterSpacing: '0px' }
        }
      },
      slots: {
        default: 'Marked'
      }
    })

    expect(wrapper.element.tagName).toBe('MARK')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['is-mark', 'is-strong', 'text-class', 'text-root']))
    expect(wrapper.classes()).toContain('semantic-marked-text')
    expect(wrapper.attributes('style')).toContain('letter-spacing: 0px')
  })

  it('supports paragraph ellipsis rows and root hooks', () => {
    const wrapper = mount(Paragraph, {
      props: {
        ellipsis: { rows: 2 },
        mark: true,
        className: 'paragraph-class',
        rootClassName: 'paragraph-root',
        style: { marginTop: '6px' },
        classNames: {
          root: 'semantic-paragraph-root'
        },
        styles: {
          root: { maxWidth: '240px' }
        }
      },
      slots: {
        default: 'Long content'
      }
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'is-ellipsis',
        'is-ellipsis-multiline',
        'is-mark',
        'paragraph-class',
        'paragraph-root',
        'semantic-paragraph-root'
      ])
    )
    expect(wrapper.attributes('style')).toContain('--aheart-typography-ellipsis-rows: 2')
    expect(wrapper.attributes('style')).toContain('margin-top: 6px')
    expect(wrapper.attributes('style')).toContain('max-width: 240px')
  })

  it('applies link root hooks while preserving disabled href behavior', () => {
    const wrapper = mount(Link, {
      props: {
        href: 'https://example.com',
        disabled: true,
        className: 'link-class',
        rootClassName: 'link-root',
        style: { marginInlineStart: '4px' },
        classNames: {
          root: 'semantic-link-root'
        },
        styles: {
          root: { color: 'rgb(22, 119, 255)' }
        }
      },
      slots: {
        default: 'Open'
      }
    })

    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['is-disabled', 'link-class', 'link-root', 'semantic-link-root'])
    )
    expect(wrapper.attributes('style')).toContain('margin-inline-start: 4px')
    expect(wrapper.attributes('style')).toContain('color: rgb(22, 119, 255)')
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
