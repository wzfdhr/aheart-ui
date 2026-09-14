import TreeSelect from './tree-select.vue'
import { withInstall } from '../utils/install'
export type { TreeSelectVirtual, TreeSelectVirtualConfig } from './virtual-options'

export default withInstall(TreeSelect, 'ATreeSelect')
