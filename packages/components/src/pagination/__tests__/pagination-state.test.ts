import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  getPageCount,
  normalizeCurrent,
  normalizePageSize,
  normalizeTotal
} from '../pagination-state'
import Pagination from '../pagination.vue'

describe('pagination state normalization', () => {
  it('normalizes totals and page sizes without producing invalid values', () => {
    expect(normalizeTotal(42)).toBe(42)
    expect(normalizeTotal(4.9)).toBe(0)
    expect(normalizeTotal(-1)).toBe(0)
    expect(normalizeTotal(Number.NaN)).toBe(0)
    expect(normalizeTotal(Number.POSITIVE_INFINITY)).toBe(0)
    expect(normalizePageSize(20)).toBe(20)
    expect(normalizePageSize(4.9)).toBe(4)
    expect(normalizePageSize(0)).toBe(1)
    expect(normalizePageSize(-2)).toBe(1)
    expect(normalizePageSize(Number.NaN)).toBe(1)
  })

  it('uses at least one page and clamps current to the normalized page count', () => {
    expect(getPageCount(0, 10)).toBe(1)
    expect(getPageCount(25, 10)).toBe(3)
    expect(getPageCount(Number.NaN, 0)).toBe(1)
    expect(normalizeCurrent(2.9, 25, 10)).toBe(2)
    expect(normalizeCurrent(0, 25, 10)).toBe(1)
    expect(normalizeCurrent(Number.NaN, 25, 10)).toBe(1)
    expect(normalizeCurrent(99, 25, 10)).toBe(3)
  })

  it('normalizes props for display without emitting requests', () => {
    const wrapper = mount(Pagination, {
      props: { total: 25.9, current: 99.4, pageSize: 4.9, simple: true, showTotal: true }
    })

    expect(wrapper.find('.aheart-pagination__simple').text()).toBe('1 / 1')
    expect(wrapper.find('.aheart-pagination__total').text()).toContain('共 0 条')
    expect(wrapper.emitted()).toEqual({})
  })

  it('keeps an uncontrolled current request stable when controlled size is rejected', async () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 95,
        defaultCurrent: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: [10, 20]
      }
    })
    const sizeChanger = wrapper.find('.aheart-pagination__size-changer')

    await sizeChanger.setValue('20')
    await sizeChanger.setValue('10')
    await sizeChanger.setValue('10')

    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('10')
    expect(wrapper.emitted('update:pageSize')).toEqual([[20]])
    expect(wrapper.emitted('update:current')).toEqual([[5]])
    expect(wrapper.emitted('change')).toEqual([[5, 20]])
  })

  it('updates both uncontrolled dimensions once and clamps after a smaller page count', async () => {
    const wrapper = mount(Pagination, {
      props: {
        total: 95,
        defaultCurrent: 10,
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: [10, 20]
      }
    })

    await wrapper.find('.aheart-pagination__size-changer').setValue('20')

    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('5')
    expect(wrapper.emitted('update:pageSize')).toEqual([[20]])
    expect(wrapper.emitted('update:current')).toEqual([[5]])
    expect(wrapper.emitted('showSizeChange')).toEqual([[5, 20]])
    expect(wrapper.emitted('change')).toEqual([[5, 20]])

    await wrapper.find('.aheart-pagination__size-changer').setValue('20')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })
})
