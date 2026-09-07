import Tree from './tree.vue'
import { withInstall } from '../utils/install'

export type { TreeKey, TreeNodeData, TreeLoadContext, TreeLoadData, TreeCheckInfo } from './types'
export default withInstall(Tree, 'ATree')
