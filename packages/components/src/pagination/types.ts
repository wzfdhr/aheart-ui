import type { ExtractPropTypes, PropType, StyleValue } from 'vue'
import type { AheartSize } from '../config'

export type PaginationAlign = 'start' | 'center' | 'end'
export type PaginationItemType = 'page' | 'prev' | 'next'
export type PaginationItemRender = (
  page: number,
  type: PaginationItemType,
  originalElement: string
) => string | number
export type PaginationShowTotal = (total: number, range: [number, number]) => string | number
export type PaginationSemanticPart =
  | 'root'
  | 'total'
  | 'prev'
  | 'next'
  | 'page'
  | 'activePage'
  | 'sizeChanger'
  | 'quickJumper'
export type PaginationClassNames = Partial<Record<PaginationSemanticPart, string>>
export type PaginationStyles = Partial<Record<PaginationSemanticPart, StyleValue>>

export const paginationProps = {
  total: {
    type: Number,
    default: 0
  },
  current: Number,
  defaultCurrent: {
    type: Number,
    default: 1
  },
  pageSize: Number,
  defaultPageSize: {
    type: Number,
    default: 10
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  size: String as PropType<AheartSize>,
  simple: Boolean,
  hideOnSinglePage: Boolean,
  showTotal: {
    type: [Boolean, Function] as PropType<boolean | PaginationShowTotal>,
    default: false
  },
  align: String as PropType<PaginationAlign>,
  showLessItems: Boolean,
  showSizeChanger: Boolean,
  pageSizeOptions: {
    type: Array as PropType<Array<number | string>>,
    default: () => [10, 20, 50, 100]
  },
  showQuickJumper: Boolean,
  itemRender: Function as PropType<PaginationItemRender>,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<PaginationClassNames>,
  styles: Object as PropType<PaginationStyles>
} as const

export const paginationEmits = {
  'update:current': (current: number) => Number.isInteger(current),
  'update:pageSize': (pageSize: number) => Number.isInteger(pageSize),
  change: (current: number, pageSize: number) => Number.isInteger(current) && Number.isInteger(pageSize),
  showSizeChange: (current: number, pageSize: number) => Number.isInteger(current) && Number.isInteger(pageSize)
}

export type PaginationProps = ExtractPropTypes<typeof paginationProps>
