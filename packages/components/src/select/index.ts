import select from './select.vue'
import { withInstall } from '../utils/install'

const Select = withInstall(select, 'ASelect')

export type * from './types'
export default Select
