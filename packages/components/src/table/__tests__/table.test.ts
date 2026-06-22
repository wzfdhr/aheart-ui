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

  it('renders vnode column titles custom cells and expanded content', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          {
            title: h('span', { class: 'title-node' }, 'Name node'),
            dataIndex: 'name',
            key: 'name',
            customRender: ({ text }) => h('strong', { class: 'cell-node' }, String(text))
          }
        ],
        dataSource,
        expandable: {
          expandedRowRender: (record) => h('span', { class: 'expanded-node' }, `${record.name} details`)
        }
      }
    })

    expect(wrapper.find('.title-node').text()).toBe('Name node')
    expect(wrapper.find('.cell-node').text()).toBe('Ada')

    await wrapper.find('.aheart-table__expand-button').trigger('click')

    expect(wrapper.find('.expanded-node').text()).toBe('Ada details')
  })

  it('omits hidden columns from headers body cells and column count', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Secret', dataIndex: 'role', key: 'secret', hidden: true },
          { title: 'Age', dataIndex: 'age', key: 'age' }
        ],
        dataSource: [dataSource[0]],
        expandable: {
          defaultExpandedRowKeys: ['ada'],
          expandedRowRender: () => 'Expanded'
        }
      }
    })

    expect(wrapper.findAll('th').map((cell) => cell.text())).toEqual(['', 'Name', 'Age'])
    expect(wrapper.find('tbody tr').text()).not.toContain('Architect')
    expect(wrapper.find('.aheart-table__expanded-cell').attributes('colspan')).toBe('3')
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

  it('applies defaultSortOrder on initial render', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a, b) => a.age - b.age, defaultSortOrder: 'descend' }
        ],
        dataSource
      }
    })

    expect(wrapper.find('tbody tr').text()).toContain('Linus')
  })

  it('lets controlled sortOrder override internal sort state', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Age', dataIndex: 'age', key: 'age', sorter: true, sortOrder: 'descend' }
        ],
        dataSource
      }
    })

    expect(wrapper.find('tbody tr').text()).toContain('Linus')

    await wrapper.findAll('th')[1].find('button').trigger('click')

    expect(wrapper.find('tbody tr').text()).toContain('Linus')
    expect(wrapper.emitted('change')?.[0]).toBeTruthy()
  })

  it('filters rows from column filters and emits change metadata', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', key: 'name' },
          {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: [
              { text: 'Architect', value: 'Architect' },
              { text: 'Engineer', value: 'Engineer' }
            ]
          }
        ],
        dataSource
      }
    })

    const engineerFilter = wrapper.findAll('.aheart-table__filter-option').find((button) => button.text() === 'Engineer')
    expect(engineerFilter).toBeTruthy()

    await engineerFilter!.trigger('click')

    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.find('tbody tr').text()).toContain('Grace')
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ role: ['Engineer'] })
    expect(wrapper.emitted('change')?.[0]?.[3]).toMatchObject({
      action: 'filter',
      currentDataSource: [dataSource[1]]
    })
  })

  it('supports single-value filters with filterMultiple false', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', key: 'name' },
          {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filterMultiple: false,
            filters: [
              { text: 'Architect', value: 'Architect' },
              { text: 'Engineer', value: 'Engineer' }
            ]
          }
        ],
        dataSource
      }
    })

    const filters = wrapper.findAll('.aheart-table__filter-option')
    await filters.find((button) => button.text() === 'Architect')!.trigger('click')
    await filters.find((button) => button.text() === 'Engineer')!.trigger('click')

    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.find('tbody tr').text()).toContain('Grace')
    expect(wrapper.emitted('change')?.[1]?.[1]).toEqual({ role: ['Engineer'] })
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

  it('emits filters, sorter, and currentDataSource when pagination changes', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Age', dataIndex: 'age', key: 'age', sorter: true, defaultSortOrder: 'ascend' },
          {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            defaultFilteredValue: ['Engineer', 'Maintainer'],
            filters: [
              { text: 'Engineer', value: 'Engineer' },
              { text: 'Maintainer', value: 'Maintainer' }
            ]
          }
        ],
        dataSource,
        pagination: { current: 1, pageSize: 1 }
      }
    })

    expect(wrapper.find('tbody tr').text()).toContain('Grace')

    await wrapper.find('.aheart-pagination__next').trigger('click')

    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual({ current: 2, pageSize: 1, total: 2 })
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ role: ['Engineer', 'Maintainer'] })
    expect(wrapper.emitted('change')?.[0]?.[2]).toMatchObject({ columnKey: 'age', field: 'age', order: 'ascend' })
    expect(wrapper.emitted('change')?.[0]?.[3]).toMatchObject({
      action: 'paginate',
      currentDataSource: [dataSource[1], dataSource[2]]
    })
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
