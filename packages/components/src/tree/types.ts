import type { PropType } from 'vue'

export type TreeKey = string | number

export interface TreeNodeData {
  key: TreeKey
  title: string
  disabled?: boolean
  isLeaf?: boolean
  children?: TreeNodeData[]
}

export interface TreeLoadContext { signal: AbortSignal }
export type TreeLoadData = (node: TreeNodeData, context: TreeLoadContext) => Promise<TreeNodeData[] | void>
export interface TreeCheckInfo { halfCheckedKeys: TreeKey[] }

export const treeProps = {
  treeData: {
    type: Array as PropType<TreeNodeData[]>,
    default: () => []
  },
  expandedKeys: Array as PropType<TreeKey[]>,
  defaultExpandedKeys: {
    type: Array as PropType<TreeKey[]>,
    default: () => []
  },
  selectedKeys: Array as PropType<TreeKey[]>,
  defaultSelectedKeys: {
    type: Array as PropType<TreeKey[]>,
    default: () => []
  },
  checkedKeys: Array as PropType<TreeKey[]>,
  defaultCheckedKeys: {
    type: Array as PropType<TreeKey[]>,
    default: () => []
  },
  defaultExpandAll: Boolean,
  selectable: {
    type: Boolean,
    default: true
  },
  multiple: Boolean,
  checkable: Boolean,
  checkStrictly: { type: Boolean, default: true },
  loadData: Function as PropType<TreeLoadData>,
  // `undefined` preserves ConfigProvider inheritance when the prop is omitted.
  disabled: {
    type: Boolean,
    default: undefined
  }
}
