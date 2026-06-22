import popconfirm from './popconfirm.vue'
import { withInstall } from '../utils/install'

const Popconfirm = withInstall(popconfirm, 'APopconfirm')

export default Popconfirm
export type { PopconfirmProps } from './types'
