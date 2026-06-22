import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
})
