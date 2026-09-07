import type { TableDataMode, TablePaginationConfig, TableRecord, TableRowSelection } from 'aheart-ui'

interface Row extends TableRecord {
  key: string
  name: string
  age: number
}

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
