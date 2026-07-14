import table from './table.vue'
import { withInstall } from '../utils/install'

const Table = withInstall(table, 'ATable')

export default Table
export type * from './types'
