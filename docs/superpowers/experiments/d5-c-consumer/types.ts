import { Table } from 'aheart-ui'
type TableProps = InstanceType<typeof Table>['$props']
type TableRecord = Record<string, unknown>

const virtual: NonNullable<TableProps['virtual']> = {
  height: 320,
  overscan: 4,
  estimateSize: 40
}
const local: TableProps = {
  columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
  dataSource: [{ key: 'one', name: 'One' }],
  virtual,
  dataMode: 'local'
}
const server: TableProps = {
  ...local,
  dataMode: 'server',
  pagination: { current: 2, pageSize: 20, total: 10000 }
}

const fixedExpanded: TableProps = {
  ...local,
  virtual,
  columns: [{ title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' }, { title: 'Status', dataIndex: 'status', key: 'status', fixed: 'right' }],
  expandable: { expandedRowRender: (row: TableRecord) => `Details for ${String(row.name)}` }
}

void [local, server, fixedExpanded]
