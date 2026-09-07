import { createSSRApp, h } from 'vue'
import { Table } from 'aheart-ui'

const localRows = [
  { key: 'ada', name: 'Ada', age: 36 },
  { key: 'grace', name: 'Grace', age: 28 },
  { key: 'linus', name: 'Linus', age: 42 },
  { key: 'margaret', name: 'Margaret', age: 31 }
]

const serverRows = [localRows[2], localRows[0]]
const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' }
]

export const settingsFor = mode => mode === 'local'
  ? {
      mode,
      rows: localRows,
      pagination: { current: 2, pageSize: 2, total: 1 },
      selection: { defaultSelectedRowKeys: ['grace'] }
    }
  : {
      mode,
      rows: serverRows,
      pagination: { current: 3, pageSize: 1, total: 40 }
    }

export const makeConsumerApp = settings => {
  const props = {
    columns,
    dataSource: settings.rows,
    dataMode: settings.mode,
    pagination: settings.pagination,
    rowSelection: settings.selection
  }
  return { render: () => h(Table, props) }
}

export const createConsumerApp = settings => createSSRApp(makeConsumerApp(settings))
