import type { PropType } from 'vue'

export type TreeKey = string | number

export interface TreeNodeData {
  key: TreeKey
  title: string
  disabled?: boolean
  children?: TreeNodeData[]
}

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
  disabled: Boolean
}
