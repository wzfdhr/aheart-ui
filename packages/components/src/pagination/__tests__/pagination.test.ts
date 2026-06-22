import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Pagination from '../pagination.vue'

describe('Pagination', () => {
  it('renders page buttons and total text', () => {
    const wrapper = mount(Pagination, {
      props: { total: 42, pageSize: 10, current: 2, showTotal: true }
    })

    expect(wrapper.attributes('aria-label')).toBe('pagination')
    expect(wrapper.text()).toContain('Total 42 items')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('2')
    expect(wrapper.findAll('.aheart-pagination__page')).toHaveLength(5)
  })

  it('emits current updates when page and next buttons are clicked', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, defaultCurrent: 1, pageSize: 10 }
    })

    await wrapper.findAll('.aheart-pagination__page')[1].trigger('click')
    await wrapper.find('.aheart-pagination__next').trigger('click')

    expect(wrapper.emitted('update:current')?.[0]).toEqual([2])
    expect(wrapper.emitted('change')?.[0]).toEqual([2, 10])
    expect(wrapper.emitted('update:current')?.[1]).toEqual([3])
  })

  it('renders simple mode and respects ConfigProvider disabled and size', () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true, size: 'small' },
      slots: {
        default: {
          render() {
            return h(Pagination, { total: 20, current: 1, pageSize: 10, simple: true })
          }
        }
      }
    })

    const pagination = wrapper.findComponent(Pagination)
    expect(pagination.classes()).toContain('aheart-pagination--small')
    expect(pagination.find('.aheart-pagination__simple').text()).toBe('1 / 2')
    expect(pagination.find('button').attributes()).toHaveProperty('disabled')
  })

  it('hides on single page when hideOnSinglePage is true', () => {
    const wrapper = mount(Pagination, {
      props: { total: 5, pageSize: 10, hideOnSinglePage: true }
    })

    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('renders a page-size changer and emits size-change events', async () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 95,
        current: 5,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, '50']
      }
    })

    const sizeChanger = wrapper.find('.aheart-pagination__size-changer')
    expect(sizeChanger.exists()).toBe(true)
    expect(sizeChanger.findAll('option').map((option) => option.attributes('value'))).toEqual(['10', '20', '50'])

    await sizeChanger.setValue('20')

    expect(wrapper.emitted('update:pageSize')?.[0]).toEqual([20])
    expect(wrapper.emitted('showSizeChange')?.[0]).toEqual([5, 20])
    expect(wrapper.emitted('change')?.[0]).toEqual([5, 20])
  })

  it('shows the size changer automatically when total exceeds the boundary', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 80,
        pageSize: 10
      }
    })

    expect(wrapper.find('.aheart-pagination__size-changer').exists()).toBe(true)
  })

  it('lets explicit showSizeChanger false override automatic boundary behavior', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 80,
        pageSize: 10,
        showSizeChanger: false
      }
    })

    expect(wrapper.find('.aheart-pagination__size-changer').exists()).toBe(false)
  })

  it('uses totalBoundaryShowSizeChanger to control automatic size changer display', () => {
    const hiddenWrapper = mount(Pagination, {
      props: {
        total: 80,
        pageSize: 10,
        totalBoundaryShowSizeChanger: 100
      }
    })
    const shownWrapper = mount(Pagination, {
      props: {
        total: 80,
        pageSize: 10,
        totalBoundaryShowSizeChanger: 70
      }
    })

    expect(hiddenWrapper.find('.aheart-pagination__size-changer').exists()).toBe(false)
    expect(shownWrapper.find('.aheart-pagination__size-changer').exists()).toBe(true)
  })

  it('quick jumper normalizes input from Enter and Go button', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 95, defaultCurrent: 1, pageSize: 10, showQuickJumper: true }
    })

    await wrapper.find('.aheart-pagination__quick-jumper-input').setValue('99')
    await wrapper.find('.aheart-pagination__quick-jumper-input').trigger('keydown.enter')

    expect(wrapper.emitted('update:current')?.[0]).toEqual([10])
    expect(wrapper.emitted('change')?.[0]).toEqual([10, 10])

    await wrapper.find('.aheart-pagination__quick-jumper-input').setValue('3')
    await wrapper.find('.aheart-pagination__quick-jumper-go').trigger('click')

    expect(wrapper.emitted('update:current')?.[1]).toEqual([3])
    expect(wrapper.emitted('change')?.[1]).toEqual([3, 10])
  })

  it('renders object quick jumper custom go button content', async () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 95,
        defaultCurrent: 1,
        pageSize: 10,
        showQuickJumper: { goButton: 'Jump' }
      }
    })

    await wrapper.find('.aheart-pagination__quick-jumper-input').setValue('4')

    const goButton = wrapper.find('.aheart-pagination__quick-jumper-go')
    expect(goButton.text()).toBe('Jump')

    await goButton.trigger('click')

    expect(wrapper.emitted('update:current')?.[0]).toEqual([4])
    expect(wrapper.emitted('change')?.[0]).toEqual([4, 10])
  })

  it('renders alignment compact pages and functional total text', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 200,
        current: 10,
        pageSize: 10,
        align: 'center',
        showLessItems: true,
        showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total}`
      }
    })

    expect(wrapper.classes()).toContain('aheart-pagination--align-center')
    expect(wrapper.find('.aheart-pagination__total').text()).toBe('91-100 of 200')
    expect(wrapper.findAll('.aheart-pagination__page')).toHaveLength(5)
    expect(wrapper.findAll('.aheart-pagination__ellipsis')).toHaveLength(2)
  })

  it('uses itemRender for previous next and page labels', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 30,
        current: 2,
        pageSize: 10,
        itemRender: (page: number, type: string, originalElement: string) => {
          if (type === 'prev') return 'Previous'
          if (type === 'next') return 'Next'
          return `${originalElement}-${page}`
        }
      }
    })

    expect(wrapper.find('.aheart-pagination__prev').text()).toBe('Previous')
    expect(wrapper.find('.aheart-pagination__next').text()).toBe('Next')
    expect(wrapper.findAll('.aheart-pagination__page').map((page) => page.text())).toEqual(['1-1', '2-2', '3-3'])
  })

  it('applies root and semantic class and style hooks', () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 30,
        current: 2,
        pageSize: 10,
        showTotal: true,
        showSizeChanger: true,
        showQuickJumper: true,
        className: 'pagination-class',
        rootClassName: 'pagination-root',
        style: 'color: red;',
        classNames: {
          root: 'semantic-root',
          total: 'semantic-total',
          prev: 'semantic-prev',
          next: 'semantic-next',
          page: 'semantic-page',
          activePage: 'semantic-active-page',
          sizeChanger: 'semantic-size-changer',
          quickJumper: 'semantic-quick-jumper'
        },
        styles: {
          root: { backgroundColor: 'blue' },
          total: { minWidth: '120px' },
          prev: { order: 1 },
          next: { order: 2 },
          page: { minWidth: '32px' },
          activePage: { fontWeight: 700 },
          sizeChanger: { width: '96px' },
          quickJumper: { gap: '4px' }
        }
      }
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['pagination-class', 'pagination-root', 'semantic-root']))
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.attributes('style')).toContain('background-color: blue')
    expect(wrapper.find('.aheart-pagination__total').classes()).toContain('semantic-total')
    expect(wrapper.find('.aheart-pagination__total').attributes('style')).toContain('min-width: 120px')
    expect(wrapper.find('.aheart-pagination__prev').classes()).toContain('semantic-prev')
    expect(wrapper.find('.aheart-pagination__next').classes()).toContain('semantic-next')
    expect(wrapper.find('.aheart-pagination__page').classes()).toContain('semantic-page')
    expect(wrapper.find('.aheart-pagination__page.is-active').classes()).toContain('semantic-active-page')
    expect(wrapper.find('.aheart-pagination__size-changer').classes()).toContain('semantic-size-changer')
    expect(wrapper.find('.aheart-pagination__quick-jumper').classes()).toContain('semantic-quick-jumper')
  })
})
