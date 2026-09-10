import Tree from './tree.vue'
import { withInstall } from '../utils/install'

export type { TreeKey, TreeNodeData, TreeLoadContext, TreeLoadData, TreeCheckInfo, TreeVirtual, TreeVirtualConfig } from './types'
export default withInstall(Tree, 'ATree')
