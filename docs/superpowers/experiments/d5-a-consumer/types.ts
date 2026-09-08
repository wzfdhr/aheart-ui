import { h } from 'vue'
import { Table } from 'aheart-ui'
import type {
  TableColumn,
  TableDataMode,
  TableExpandable,
  TablePaginationConfig,
  TableRecord,
  TableRowSelection,
  TableScroll
} from 'aheart-ui'

interface Row extends TableRecord {
  key: string
  name: string
  age: number
}

interface User extends TableRecord {
  key: string
  name: string
  age: number
  role: 'admin' | 'member'
}

const users: User[] = [
  { key: 'u-1', name: 'Ada', age: 36, role: 'admin' },
  { key: 'u-2', name: 'Grace', age: 28, role: 'member' }
]

const userColumns: TableColumn<User>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (left, right) => left.name.localeCompare(right.name),
    customRender: ({ record, text }) => `${record.name}:${String(text)}`
  },
  { title: 'Age', dataIndex: 'age', key: 'age' }
]

const userSelection: TableRowSelection<User> = {
  getCheckboxProps: user => ({ disabled: user.role !== 'admin' })
}

const userExpandable: TableExpandable<User> = {
  expandedRowRender: (user) => `User ${user.name} (${user.age})`
}

const typedTable = h(Table, {
  columns: userColumns,
  dataSource: users,
  rowSelection: userSelection,
  expandable: userExpandable,
  scroll: { x: true },
  sticky: { offsetHeader: 8 },
  error: { message: 'Unavailable', retryText: 'Retry' }
})

// @ts-expect-error scroll.x accepts true, number, or string; false is invalid.
const invalidScroll: TableScroll = { x: false }
void invalidScroll

const mode: TableDataMode = 'server'
const pagination: TablePaginationConfig = {
  current: 2,
  pageSize: 10,
  total: 40,
  pageSizeOptions: [10, 20],
  showQuickJumper: true
}
const selection: TableRowSelection<Row> = {
  preserveSelectedRowKeys: true,
  getCheckboxProps: row => ({ disabled: row.age < 18 })
}

void mode
void pagination
void selection
void typedTable
