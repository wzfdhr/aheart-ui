import pagination from './pagination.vue'
import { withInstall } from '../utils/install'

const Pagination = withInstall(pagination, 'APagination')

export default Pagination
export type * from './types'
