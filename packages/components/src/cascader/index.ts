import Cascader from './cascader.vue'
import { withInstall } from '../utils/install'

export type { CascaderKey, CascaderOption, CascaderPath, CascaderValue, CascaderLoadContext } from './types'
export default withInstall(Cascader, 'ACascader')
