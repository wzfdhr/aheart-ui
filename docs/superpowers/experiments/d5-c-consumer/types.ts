import type { TableProps } from 'aheart-ui'

const virtual: NonNullable<TableProps['virtual']> = {
  height: 320,
  overscan: 4,
  estimatedRowHeight: 40
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
  expandable: { expandedRowRender: row => `Details for ${row.name}` }
}

void [local, server, fixedExpanded]
