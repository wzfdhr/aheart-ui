import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import Table from '../table.vue'
import Pagination from '../../pagination/pagination.vue'

interface MatrixRow {
  key: string
  name: string
}

const rows: MatrixRow[] = Array.from({ length: 10 }, (_, index) => ({
  key: `row-${index + 1}`,
  name: `Row ${index + 1}`
}))
const columns = [{ title: 'Name', dataIndex: 'name', key: 'name' }]

describe('D5-A Table/Pagination pagination matrix', () => {
  it.each([
    ['neither controlled', { defaultCurrent: 10, defaultPageSize: 10 }, 5, 20, 5, 20],
    ['current controlled', { current: 10, defaultPageSize: 10 }, 5, 20, 5, 20],
    ['pageSize controlled', { defaultCurrent: 10, pageSize: 10 }, 5, 20, 10, 10],
    ['both controlled', { current: 10, pageSize: 10 }, 5, 20, 10, 10]
  ])(
    'covers size change for the %s combination',
    async (_label, initial, requestedCurrent, requestedSize, acceptedCurrent, acceptedSize) => {
      const wrapper = mount(Table, {
        props: {
          columns,
          dataSource: rows,
          dataMode: 'server',
          pagination: { ...initial, total: 95, showSizeChanger: true, pageSizeOptions: [10, 20] }
        }
      })

      const sizeChanger = wrapper.find('.aheart-pagination__size-changer')
      expect(sizeChanger.element).toHaveProperty('value', '10')
      await sizeChanger.setValue('20')
      expect(wrapper.emitted('change')?.[0]?.[0]).toEqual({ current: requestedCurrent, pageSize: requestedSize, total: 95 })

      expect(wrapper.find('.aheart-pagination__size-changer').element).toHaveProperty('value', String(acceptedSize))
      expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe(String(acceptedCurrent))
    }
  )

  it('does not permanently retain a rejected candidate clamp, accepts size/current partially, and distinguishes current authority', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        dataMode: 'server',
        pagination: { current: 10, pageSize: 10, total: 95, showSizeChanger: true, pageSizeOptions: [10, 20] }
      }
    })
    const select = wrapper.find('.aheart-pagination__size-changer')
    await select.setValue('20')
    expect(select.element).toHaveProperty('value', '10')
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('10')
    expect(wrapper.emitted('change')).toHaveLength(1)

    await wrapper.setProps({
      pagination: { current: 10, pageSize: 20, total: 95, showSizeChanger: true, pageSizeOptions: [10, 20] }
    })
    await nextTick()
    expect(wrapper.find('.aheart-pagination__size-changer').element).toHaveProperty('value', '20')
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('5')
    expect(wrapper.emitted('change')).toHaveLength(1)

    await wrapper.setProps({
      pagination: { current: 2, pageSize: 20, total: 95, showSizeChanger: true, pageSizeOptions: [10, 20] }
    })
    await nextTick()
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('2')

    await wrapper.find('.aheart-pagination__size-changer').setValue('10')
    expect(wrapper.emitted('change')?.[1]?.[0]).toEqual({ current: 2, pageSize: 10, total: 95 })
    expect(wrapper.emitted('change')).toHaveLength(2)
  })

  it('keeps standalone Pagination candidate size/current separate until the parent accepts it', async () => {
    const wrapper = mount(Pagination, {
      props: { current: 10, pageSize: 10, total: 95, showSizeChanger: true, pageSizeOptions: [10, 20] }
    })
    await wrapper.find('.aheart-pagination__size-changer').setValue('20')
    expect(wrapper.emitted('change')).toEqual([[5, 20]])
    expect(wrapper.find('.aheart-pagination__size-changer').element).toHaveProperty('value', '10')
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('10')

    await wrapper.setProps({ current: 10, pageSize: 20, total: 95, showSizeChanger: true, pageSizeOptions: [10, 20] })
    await nextTick()
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('5')
    expect(wrapper.emitted('change')).toHaveLength(1)

    await wrapper.setProps({ current: 2, pageSize: 20, total: 95, showSizeChanger: true, pageSizeOptions: [10, 20] })
    expect(wrapper.find('.aheart-pagination__page.is-active').text()).toBe('2')
  })

  it('select-all cancellation removes only current-page enabled keys and preserves other-page keys', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows.slice(0, 4),
        pagination: { defaultCurrent: 1, pageSize: 2 },
        rowSelection: {
          defaultSelectedRowKeys: ['row-3'],
          getCheckboxProps: (record: MatrixRow) => ({ disabled: record.key === 'row-2' })
        }
      }
    })
    const selectAll = wrapper.find('.aheart-table__select-all')
    await selectAll.setValue(true)
    expect(wrapper.emitted('update:selectedRowKeys')?.[0]).toEqual([['row-3', 'row-1']])
    expect(wrapper.emitted('selectAll')?.[0]).toEqual([true, ['row-3', 'row-1'], [rows[0]]])

    await selectAll.setValue(false)
    expect(wrapper.emitted('update:selectedRowKeys')?.[1]).toEqual([['row-3']])
    expect(wrapper.emitted('selectAll')?.[1]).toEqual([false, ['row-3'], [rows[0]]])
    expect(wrapper.findAll('tbody input[type="checkbox"]')[1].element).toHaveProperty('disabled', true)
  })

  it('preserve=false controlled selection is parent-owned and data replacement emits no clipping event', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows.slice(0, 3),
        rowSelection: { selectedRowKeys: ['row-2', 'row-3'], preserveSelectedRowKeys: false }
      }
    })
    await wrapper.setProps({ dataSource: rows.slice(0, 2) })
    await nextTick()
    expect(wrapper.emitted('update:selectedRowKeys')).toBeUndefined()
    expect(wrapper.findAll('tbody input[type="checkbox"]').map((input) => (input.element as HTMLInputElement).checked))
      .toEqual([false, true])
  })
})
