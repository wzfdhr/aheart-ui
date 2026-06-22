import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import Breadcrumb from '../breadcrumb.vue'

describe('Breadcrumb', () => {
  it('renders linked items and marks the last item as current page', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [
          { title: 'Home', href: '/' },
          { title: 'Components', href: '/components' },
          { title: 'Breadcrumb' }
        ]
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('breadcrumb')
    expect(wrapper.findAll('.aheart-breadcrumb__item')).toHaveLength(3)
    expect(wrapper.find('a[href="/"]').text()).toBe('Home')
    expect(wrapper.find('[aria-current="page"]').text()).toContain('Breadcrumb')
  })

  it('supports custom separators and disabled items', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        separator: '>',
        items: [
          { title: 'Home', href: '/' },
          { title: 'Admin', href: '/admin', disabled: true },
          { title: 'Users' }
        ]
      }
    })

    expect(wrapper.findAll('.aheart-breadcrumb__separator').map((item) => item.text())).toEqual(['>', '>'])
    expect(wrapper.find('.is-disabled').text()).toContain('Admin')
    expect(wrapper.findAll('a')).toHaveLength(1)
  })

  it('renders vnode title and separator with semantic class/style hooks', () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        items: [{ title: h('span', { class: 'custom-home' }, 'Home'), href: '/' }, { title: 'Current' }],
        separator: h('span', { class: 'custom-separator' }, '>'),
        className: 'custom-breadcrumb',
        style: { marginTop: '4px' },
        classNames: {
          root: 'semantic-root',
          list: 'semantic-list',
          item: 'semantic-item',
          link: 'semantic-link',
          text: 'semantic-text',
          separator: 'semantic-separator'
        },
        styles: {
          root: { color: 'red' },
          list: { gap: '2px' },
          separator: { marginInline: '12px' }
        }
      }
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom-breadcrumb', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-breadcrumb__list').classes()).toContain('semantic-list')
    expect(wrapper.find('.aheart-breadcrumb__list').attributes('style')).toContain('gap: 2px')
    expect(wrapper.find('.aheart-breadcrumb__item').classes()).toContain('semantic-item')
    expect(wrapper.find('.aheart-breadcrumb__link').classes()).toContain('semantic-link')
    expect(wrapper.find('.aheart-breadcrumb__text').classes()).toContain('semantic-text')
    expect(wrapper.find('.custom-home').text()).toBe('Home')
    expect(wrapper.find('.custom-separator').text()).toBe('>')
    expect(wrapper.find('.aheart-breadcrumb__separator').classes()).toContain('semantic-separator')
    expect(wrapper.find('.aheart-breadcrumb__separator').attributes('style')).toContain('margin-inline: 12px')
  })

  it('uses itemRender with params, all items, cumulative paths, and index', () => {
    const calls: unknown[] = []
    const items = [
      { title: 'Project', path: 'projects/:projectId' },
      { title: 'Settings', path: 'settings' }
    ]

    const wrapper = mount(Breadcrumb, {
      props: {
        items,
        params: { projectId: 42 },
        itemRender: (item, params, allItems, paths, index) => {
          calls.push({ item, params, allItems, paths, index })
          return h('span', { class: 'custom-render', 'data-paths': paths.join('|') }, `${index}:${params.projectId}:${item.title}`)
        }
      }
    })

    const rendered = wrapper.findAll('.custom-render')
    expect(rendered).toHaveLength(2)
    expect(rendered[0].text()).toBe('0:42:Project')
    expect(rendered[1].text()).toBe('1:42:Settings')
    expect(rendered[1].attributes('data-paths')).toBe('projects/42|settings')
    expect(calls).toHaveLength(2)
    expect(calls[1]).toMatchObject({
      params: { projectId: 42 },
      allItems: items,
      paths: ['projects/42', 'settings'],
      index: 1
    })
  })

  it('resolves path params and invokes enabled item click handlers', async () => {
    const handleClick = vi.fn((event: MouseEvent) => event.preventDefault())
    const disabledClick = vi.fn()
    const wrapper = mount(Breadcrumb, {
      props: {
        params: { projectId: 'aheart' },
        items: [
          {
            title: 'Project',
            path: '/projects/:projectId',
            className: 'project-crumb',
            style: { fontWeight: '700' },
            onClick: handleClick
          },
          { title: 'Admin', path: '/admin', disabled: true, onClick: disabledClick },
          { title: 'Details' }
        ]
      }
    })

    const link = wrapper.find('a[href="/projects/aheart"]')
    expect(link.exists()).toBe(true)
    expect(wrapper.find('.project-crumb').attributes('style')).toContain('font-weight: 700')

    await link.trigger('click')
    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick.mock.calls[0][1]).toMatchObject({ title: 'Project' })
    expect(handleClick.mock.calls[0][2]).toBe(0)

    expect(wrapper.find('a[href="/admin"]').exists()).toBe(false)
    await wrapper.find('.is-disabled').trigger('click')
    expect(disabledClick).not.toHaveBeenCalled()
  })
})
