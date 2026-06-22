import type { ExtractPropTypes, PropType } from 'vue'
import type { AheartSize } from '../config'

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
  showTotal: Boolean
} as const

export const paginationEmits = {
  'update:current': (current: number) => Number.isInteger(current),
  'update:pageSize': (pageSize: number) => Number.isInteger(pageSize),
  change: (current: number, pageSize: number) => Number.isInteger(current) && Number.isInteger(pageSize)
}

export type PaginationProps = ExtractPropTypes<typeof paginationProps>
