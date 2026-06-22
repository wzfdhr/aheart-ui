import table from './table.vue'
import { withInstall } from '../utils/install'

const Table = withInstall(table, 'ATable')

export default Table
export type {
  TableChangePagination,
  TableColumn,
  TableDataIndex,
  TableExpandable,
  TableKey,
  TablePaginationConfig,
  TableProps,
  TableRecord,
  TableRowSelection,
  TableSorter
} from './types'
