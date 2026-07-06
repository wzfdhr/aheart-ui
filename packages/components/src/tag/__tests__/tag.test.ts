import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import CheckableTag from '../checkable-tag.vue'
import Tag from '../tag.vue'
import TagGroup from '../tag-group.vue'

describe('Tag', () => {
  it('renders slot content with color class', () => {
    const wrapper = mount(Tag, {
      props: {
        color: 'success'
      },
      slots: {
        default: 'Active'
      }
    })

    expect(wrapper.classes()).toContain('aheart-tag')
    expect(wrapper.classes()).toContain('aheart-tag--success')
    expect(wrapper.text()).toContain('Active')
  })

  it('emits close when closable close button is clicked', async () => {
    const wrapper = mount(Tag, {
      props: {
        closable: true
      },
      slots: {
        default: 'Closable'
      }
    })

    await wrapper.find('.aheart-tag__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('supports variant bordered link disabled and semantic styles', () => {
    const wrapper = mount(Tag, {
      props: {
        color: 'processing',
        variant: 'solid',
        href: 'https://example.com',
        target: '_blank',
        title: 'Linked tag',
        className: 'tag-class',
        rootClassName: 'tag-root',
        style: { marginTop: '4px' },
        classNames: {
          root: 'semantic-root',
          icon: 'semantic-icon',
          content: 'semantic-content'
        },
        styles: {
          root: { color: 'red' },
          icon: { fontSize: '12px' },
          content: { fontWeight: 600 }
        },
        icon: '!'
      },
      slots: {
        default: 'Linked'
      }
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.attributes('title')).toBe('Linked tag')
    expect(wrapper.classes()).toContain('tag-class')
    expect(wrapper.classes()).toContain('tag-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.classes()).toContain('aheart-tag--solid')
    expect(wrapper.classes()).toContain('aheart-tag--processing')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-tag__icon').classes()).toContain('semantic-icon')
    expect(wrapper.find('.aheart-tag__icon').attributes('style')).toContain('font-size: 12px')
    expect(wrapper.find('.aheart-tag__content').classes()).toContain('semantic-content')
    expect(wrapper.find('.aheart-tag__content').attributes('style')).toContain('font-weight: 600')
  })

  it('supports custom close icon and hides close icon when false', async () => {
    const wrapper = mount(Tag, {
      props: {
        closable: true,
        closeIcon: 'close',
        classNames: { close: 'semantic-close' },
        styles: { close: { color: 'blue' } }
      },
      slots: { default: 'Closable' }
    })
    const hiddenWrapper = mount(Tag, {
      props: {
        closable: true,
        closeIcon: false
      },
      slots: { default: 'Hidden' }
    })

    expect(wrapper.find('.aheart-tag__close').text()).toBe('close')
    expect(wrapper.find('.aheart-tag__close').classes()).toContain('semantic-close')
    expect(wrapper.find('.aheart-tag__close').attributes('style')).toContain('color: blue')
    expect(hiddenWrapper.find('.aheart-tag__close').exists()).toBe(false)

    await wrapper.find('.aheart-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('does not emit close or render anchor when disabled', async () => {
    const wrapper = mount(Tag, {
      props: {
        closable: true,
        disabled: true,
        href: 'https://example.com'
      },
      slots: { default: 'Disabled' }
    })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('is-disabled')

    await wrapper.find('.aheart-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toBeUndefined()
  })

  it('renders controlled checkable tag events and disabled state', async () => {
    const wrapper = mount(CheckableTag, {
      props: {
        checked: false,
        icon: '*'
      },
      slots: { default: 'Choice' }
    })

    expect(wrapper.classes()).not.toContain('is-checked')
    expect(wrapper.find('.aheart-tag__icon').text()).toBe('*')

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:checked')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
    expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(MouseEvent)
  })

  it('supports TagGroup single default value primitive options and option metadata', async () => {
    const wrapper = mount(TagGroup, {
      props: {
        defaultValue: 'b',
        options: [
          'a',
          { label: 'Bee', value: 'b', className: 'option-class', style: { color: 'green' }, title: 'Bee title' }
        ],
        className: 'group-class',
        rootClassName: 'group-root',
        style: { gap: '8px' },
        classNames: { root: 'semantic-group', item: 'semantic-item', activeItem: 'semantic-active' },
        styles: { root: { color: 'red' }, item: { marginRight: '4px' }, activeItem: { fontWeight: 600 } }
      }
    })

    expect(wrapper.classes()).toContain('group-class')
    expect(wrapper.classes()).toContain('group-root')
    expect(wrapper.classes()).toContain('semantic-group')
    expect(wrapper.attributes('style')).toContain('gap: 8px')
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.text()).toContain('a')

    const tags = wrapper.findAllComponents(CheckableTag)
    expect(tags[1].classes()).toContain('is-checked')
    expect(tags[1].classes()).toContain('option-class')
    expect(tags[1].classes()).toContain('semantic-item')
    expect(tags[1].classes()).toContain('semantic-active')
    expect(tags[1].attributes('style')).toContain('color: green')
    expect(tags[1].attributes('style')).toContain('font-weight: 600')
    expect(tags[1].attributes('title')).toBe('Bee title')

    await tags[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
    expect(wrapper.emitted('update:value')?.[0]).toEqual(['a'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['a'])
    expect(tags[0].classes()).toContain('is-checked')
  })

  it('supports TagGroup multiple controlled value alias', async () => {
    const wrapper = mount(TagGroup, {
      props: {
        multiple: true,
        value: ['a'],
        modelValue: ['b'],
        options: ['a', 'b']
      }
    })

    const tags = wrapper.findAllComponents(CheckableTag)

    expect(tags[0].classes()).toContain('is-checked')
    expect(tags[1].classes()).not.toContain('is-checked')

    await tags[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])
    expect(wrapper.emitted('update:value')?.[0]).toEqual([['a', 'b']])
    expect(wrapper.emitted('change')?.[0]).toEqual([['a', 'b']])
  })

  it('renders TagGroup option labels as renderable nodes', () => {
    const wrapper = mount(TagGroup, {
      props: {
        defaultValue: 'custom',
        options: [
          {
            label: h('span', { class: 'tag-option-node' }, 'Custom tag'),
            value: 'custom'
          }
        ]
      }
    })

    expect(wrapper.find('.tag-option-node').text()).toBe('Custom tag')
    expect(wrapper.findComponent(CheckableTag).classes()).toContain('is-checked')
  })
})
