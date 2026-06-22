import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Table from '../table.vue'
import type { TableColumn } from '../types'

interface Person {
  key: string
  name: string
  age: number
  role: string
}

const columns: TableColumn<Person>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a, b) => a.age - b.age },
  { title: 'Role', dataIndex: 'role', key: 'role' }
]

const dataSource: Person[] = [
  { key: 'ada', name: 'Ada', age: 36, role: 'Architect' },
  { key: 'grace', name: 'Grace', age: 28, role: 'Engineer' },
  { key: 'linus', name: 'Linus', age: 42, role: 'Maintainer' }
]

describe('Table', () => {
  it('renders columns and rows from dataSource', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource }
    })

    expect(wrapper.classes()).toContain('aheart-table')
    expect(wrapper.findAll('th').map((cell) => cell.text())).toEqual(['Name', 'Age', 'Role'])
    expect(wrapper.text()).toContain('Ada')
    expect(wrapper.text()).toContain('Maintainer')
  })

  it('renders custom empty text when no data is available', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: [], emptyText: 'No records' }
    })

    expect(wrapper.find('.aheart-table__empty').text()).toBe('No records')
  })

  it('sorts local data when a sortable header is clicked', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource }
    })

    await wrapper.findAll('th')[1].find('button').trigger('click')

    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('Grace')
    expect(wrapper.emitted('change')?.[0]?.[2]).toMatchObject({ columnKey: 'age', order: 'ascend' })
  })

  it('selects checkbox rows and emits selected keys', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        rowSelection: { defaultSelectedRowKeys: ['ada'] }
      }
    })

    const checkboxes = wrapper.findAll('tbody input[type="checkbox"]')
    expect((checkboxes[0].element as HTMLInputElement).checked).toBe(true)

    await checkboxes[1].setValue(true)

    expect(wrapper.emitted('update:selectedRowKeys')?.[0]).toEqual([['ada', 'grace']])
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('grace')
  })

  it('supports radio row selection', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        rowSelection: { type: 'radio' }
      }
    })

    await wrapper.findAll('tbody input[type="radio"]')[2].setValue(true)

    expect(wrapper.emitted('update:selectedRowKeys')?.[0]).toEqual([['linus']])
  })

  it('expands rows with custom expanded content', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        expandable: {
          expandedRowRender: (record) => `${record.name} details`
        }
      }
    })

    await wrapper.find('.aheart-table__expand-button').trigger('click')

    expect(wrapper.find('.aheart-table__expanded-cell').text()).toContain('Ada details')
    expect(wrapper.emitted('expand')?.[0]).toEqual([true, dataSource[0], 'ada'])
  })

  it('paginates local data', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        pagination: { current: 1, pageSize: 2 }
      }
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)

    await wrapper.find('.aheart-pagination__next').trigger('click')

    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ current: 2, pageSize: 2 })
  })

  it('uses ConfigProvider size and disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small', disabled: true },
      slots: {
        default: {
          render() {
            return h(Table, { columns, dataSource, rowSelection: {} })
          }
        }
      }
    })

    const table = wrapper.findComponent(Table)
    expect(table.classes()).toContain('aheart-table--small')
    expect(table.find('tbody input[type="checkbox"]').attributes()).toHaveProperty('disabled')
  })
})
