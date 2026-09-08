import type { ExtractPropTypes, PropType, VNodeChild } from 'vue'
import type { AheartSize } from '../config'
import type { PaginationQuickJumperConfig } from '../pagination/types'

export type TableKey = string | number
export type TableRecord = Record<string, unknown>
export type TableSize = AheartSize
export type TableSortOrder = 'ascend' | 'descend'
export type TableSelectionType = 'checkbox' | 'radio'
export type TableColumnAlign = 'left' | 'center' | 'right'
export type TableDataMode = 'local' | 'server'
export type TableDataIndex = string | number | Array<string | number>
export type TableFilterValue = string | number | boolean
export type TableChangeAction = 'paginate' | 'sort' | 'filter'
export type TableRenderable = VNodeChild
export type TableColumnFixed = 'left' | 'right'
export type TableScroll = { x?: true | number | string; y?: number | string }
export type TableSticky = boolean | { offsetHeader?: number }
export interface TableVirtualConfig {
  height?: number
  estimateSize?: number
  overscan?: number
}
export type TableVirtual = boolean | TableVirtualConfig
export type TableFilterDropdownContext = {
  selectedKeys: TableFilterValue[]
  setSelectedKeys: (keys: TableFilterValue[]) => void
  confirm: () => void
  clearFilters: () => void
  close: () => void
}

export interface TableColumnFilter {
  text: TableRenderable
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
  sortOrder?: TableSortOrder | null
  defaultSortOrder?: TableSortOrder
  filters?: TableColumnFilter[]
  filteredValue?: TableFilterValue[]
  defaultFilteredValue?: TableFilterValue[]
  filterMultiple?: boolean
  filterDropdown?: (context: TableFilterDropdownContext) => VNodeChild
  filterDropdownOpen?: boolean
  defaultFilterDropdownOpen?: boolean
  fixed?: TableColumnFixed
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
  showSizeChanger?: boolean
  totalBoundaryShowSizeChanger?: number
  pageSizeOptions?: Array<number | string>
  showQuickJumper?: boolean | PaginationQuickJumperConfig
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

export interface TableRowSelection<T extends TableRecord = TableRecord> {
  selectedRowKeys?: TableKey[]
  defaultSelectedRowKeys?: TableKey[]
  type?: TableSelectionType
  disabled?: boolean
  getCheckboxProps?: (record: T) => { disabled?: boolean }
  preserveSelectedRowKeys?: boolean
}

export interface TableExpandable<T extends TableRecord = TableRecord> {
  expandedRowKeys?: TableKey[]
  defaultExpandedRowKeys?: TableKey[]
  expandedRowRender?: (record: T, index: number) => VNodeChild
  rowExpandable?: (record: T) => boolean
}

// Vue's runtime PropType boundary cannot carry the component's row generic;
// keep that boundary permissive while preserving the exported typed interfaces.
type TableComponentColumn = any
type TableComponentRowSelection = any
type TableComponentExpandable = any

export const tableProps = {
  columns: Array as PropType<TableComponentColumn[]>,
  dataSource: Array as PropType<TableRecord[]>,
  dataMode: String as PropType<TableDataMode>,
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
  rowSelection: Object as PropType<TableComponentRowSelection>,
  expandable: Object as PropType<TableComponentExpandable>,
  scroll: Object as PropType<TableScroll>,
  sticky: [Boolean, Object] as PropType<TableSticky>,
  virtual: {
    type: [Boolean, Object] as PropType<TableVirtual>,
    default: false
  },
  error: [Boolean, Object] as PropType<boolean | { message?: TableRenderable; retryText?: TableRenderable }>,
  getPopupContainer: Function as PropType<(triggerNode: HTMLElement) => HTMLElement | false>,
  showHeader: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: [String, Number, Boolean, Object, Array] as PropType<TableRenderable>,
    default: undefined
  }
} as const

export const tableEmits = {
  change: (_pagination: TableChangePagination, _filters: TableFilters, _sorter: TableSorter, _extra: TableChangeExtra) => true,
  'update:selectedRowKeys': (keys: TableKey[]) => Array.isArray(keys),
  'update:expandedRowKeys': (keys: TableKey[]) => Array.isArray(keys),
  select: (_key: TableKey, _selected: boolean, _record: TableRecord, _selectedRowKeys: TableKey[]) => true,
  selectAll: (_selected: boolean, keys: TableKey[], rows: TableRecord[]) => Array.isArray(keys) && Array.isArray(rows),
  expand: (_expanded: boolean, _record: TableRecord, _key: TableKey) => true,
  filterDropdownOpenChange: (_columnKey: string, _open: boolean) => true,
  retry: () => true
}

export type TableProps = ExtractPropTypes<typeof tableProps>
