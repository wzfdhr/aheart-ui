import type { ExtractPropTypes, PropType, VNodeChild } from 'vue'
import type { AheartSize } from '../config'

export type TableKey = string | number
export type TableRecord = Record<string, unknown>
export type TableSize = AheartSize
export type TableSortOrder = 'ascend' | 'descend'
export type TableSelectionType = 'checkbox' | 'radio'
export type TableColumnAlign = 'left' | 'center' | 'right'
export type TableDataIndex = string | number | Array<string | number>
export type TableFilterValue = string | number | boolean
export type TableChangeAction = 'paginate' | 'sort' | 'filter'
export type TableRenderable = VNodeChild

export interface TableColumnFilter {
  text: string
  value: TableFilterValue
}

export interface TableColumn<T extends TableRecord = TableRecord> {
  title: TableRenderable
  dataIndex?: keyof T | TableDataIndex
  key?: string
  align?: TableColumnAlign
  width?: string | number
  className?: string
  hidden?: boolean
  sorter?: boolean | ((a: T, b: T) => number)
  sortOrder?: TableSortOrder
  defaultSortOrder?: TableSortOrder
  filters?: TableColumnFilter[]
  filteredValue?: TableFilterValue[]
  defaultFilteredValue?: TableFilterValue[]
  filterMultiple?: boolean
  ellipsis?: boolean
  customRender?: (context: { text: unknown; record: T; index: number; column: TableColumn<T> }) => VNodeChild
}

export interface TablePaginationConfig {
  current?: number
  defaultCurrent?: number
  pageSize?: number
  defaultPageSize?: number
  total?: number
  simple?: boolean
  hideOnSinglePage?: boolean
  showTotal?: boolean
}

export interface TableSorter<T extends TableRecord = TableRecord> {
  column?: TableColumn<T>
  columnKey?: string
  field?: TableDataIndex
  order?: TableSortOrder
}

export interface TableChangePagination {
  current: number
  pageSize: number
  total: number
}

export type TableFilters = Record<string, TableFilterValue[]>

export interface TableChangeExtra<T extends TableRecord = TableRecord> {
  currentDataSource: T[]
  action: TableChangeAction
}

export interface TableRowSelection {
  selectedRowKeys?: TableKey[]
  defaultSelectedRowKeys?: TableKey[]
  type?: TableSelectionType
  disabled?: boolean
}

export interface TableExpandable<T extends TableRecord = TableRecord> {
  expandedRowKeys?: TableKey[]
  defaultExpandedRowKeys?: TableKey[]
  expandedRowRender?: (record: T, index: number) => VNodeChild
  rowExpandable?: (record: T) => boolean
}

export const tableProps = {
  columns: Array as PropType<TableColumn[]>,
  dataSource: Array as PropType<TableRecord[]>,
  rowKey: {
    type: [String, Function] as PropType<string | ((record: TableRecord) => TableKey)>,
    default: 'key'
  },
  bordered: Boolean,
  loading: Boolean,
  size: String as PropType<TableSize>,
  disabled: {
    type: Boolean,
    default: undefined
  },
  pagination: {
    type: [Boolean, Object] as PropType<false | TablePaginationConfig>,
    default: undefined
  },
  rowSelection: Object as PropType<TableRowSelection>,
  expandable: Object as PropType<TableExpandable>,
  showHeader: {
    type: Boolean,
    default: true
  },
  emptyText: String
} as const

export const tableEmits = {
  change: (_pagination: TableChangePagination, _filters: TableFilters, _sorter: TableSorter, _extra: TableChangeExtra) => true,
  'update:selectedRowKeys': (keys: TableKey[]) => Array.isArray(keys),
  select: (_key: TableKey, _selected: boolean, _record: TableRecord, _selectedRowKeys: TableKey[]) => true,
  expand: (_expanded: boolean, _record: TableRecord, _key: TableKey) => true
}

export type TableProps = ExtractPropTypes<typeof tableProps>
