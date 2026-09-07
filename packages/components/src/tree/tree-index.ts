import type { TreeKey, TreeNodeData } from './types'

export interface IndexedTreeNode {
  key: TreeKey
  node: TreeNodeData
  parentKey: TreeKey | undefined
  children: TreeKey[]
  level: number
  position: number
  setSize: number
  disabled: boolean
}

export interface TreeIndex {
  nodes: Map<TreeKey, IndexedTreeNode>
  roots: TreeKey[]
  order: TreeKey[]
}

/** One typed-key index shared by tree rendering, keyboard navigation and selection. */
export const createTreeIndex = (treeData: readonly TreeNodeData[], disabled = false): TreeIndex => {
  const nodes = new Map<TreeKey, IndexedTreeNode>()
  const order: TreeKey[] = []
  const roots = treeData.map((node) => node.key)
  type Pending = { node: TreeNodeData; parentKey?: TreeKey; level: number; position: number; setSize: number; disabled: boolean }
  const pending: Pending[] = treeData.map((node, index) => ({ node, level: 1, position: index + 1, setSize: treeData.length, disabled })).reverse()

  while (pending.length) {
    const entry = pending.pop()!
    const { node } = entry
    if (nodes.has(node.key)) throw new Error(`Tree keys must be unique: ${String(node.key)}`)
    const children = node.children ?? []
    const record: IndexedTreeNode = {
      key: node.key,
      node,
      parentKey: entry.parentKey,
      children: children.map((child) => child.key),
      level: entry.level,
      position: entry.position,
      setSize: entry.setSize,
      disabled: entry.disabled || Boolean(node.disabled)
    }
    nodes.set(record.key, record)
    order.push(record.key)
    for (let index = children.length - 1; index >= 0; index -= 1) {
      pending.push({ node: children[index], parentKey: node.key, level: entry.level + 1, position: index + 1, setSize: children.length, disabled: record.disabled })
    }
  }
  return { nodes, roots, order }
}

export const getVisibleTreeNodes = (index: TreeIndex, expandedKeys: readonly TreeKey[]): IndexedTreeNode[] => {
  const expanded = new Set(expandedKeys)
  const pending = [...index.roots].reverse()
  const visible: IndexedTreeNode[] = []
  while (pending.length) {
    const key = pending.pop()!
    const record = index.nodes.get(key)
    if (!record) continue
    visible.push(record)
    if (expanded.has(key)) {
      for (let child = record.children.length - 1; child >= 0; child -= 1) pending.push(record.children[child])
    }
  }
  return visible
}

/** Builds an ancestor-preserving filtered tree without recursively walking deep input data. */
export const filterTreeIndex = (index: TreeIndex, matches: (node: TreeNodeData) => boolean): TreeNodeData[] => {
  const filtered = new Map<TreeKey, TreeNodeData>()
  for (let position = index.order.length - 1; position >= 0; position -= 1) {
    const key = index.order[position]
    const record = index.nodes.get(key)!
    const children = record.children.flatMap((childKey) => {
      const child = filtered.get(childKey)
      return child ? [child] : []
    })
    if (matches(record.node) || children.length) filtered.set(key, { ...record.node, children })
  }
  return index.roots.flatMap((key) => {
    const node = filtered.get(key)
    return node ? [node] : []
  })
}

export const closestVisibleTreeKey = (key: TreeKey | undefined, index: TreeIndex, visible: ReadonlySet<TreeKey>): TreeKey | undefined => {
  let current = key
  while (current !== undefined) {
    if (visible.has(current)) return current
    current = index.nodes.get(current)?.parentKey
  }
}

export const treeKeyToken = (key: TreeKey) =>
  `${typeof key === 'number' ? 'n' : 's'}-${Array.from(String(key), (character) => character.codePointAt(0)!.toString(16)).join('-')}`
