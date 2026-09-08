import { h } from 'vue'
import { Table } from 'aheart-ui'

const rows = Array.from({ length: 10000 }, (_, index) => ({ key: `row-${index + 1}`, name: `Row ${index + 1}` }))
export const makeConsumerApp = () => ({
  render: () => h(Table, {
    columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
    dataSource: rows,
    rowKey: 'key',
    virtual: { height: 320, overscan: 4 },
    pagination: false
  })
})
