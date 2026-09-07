import { describe, expect, it } from 'vitest'
import { closestVisibleTreeKey, createTreeIndex, filterTreeIndex, getVisibleTreeNodes, treeKeyToken } from '../tree-index'
import type { TreeNodeData } from '../types'

describe('tree index', () => {
  const data: TreeNodeData[] = [
    { key: 0, title: 'Root', children: [{ key: 1, title: 'Numeric' }, { key: '1', title: 'String', children: [{ key: 'leaf', title: 'Leaf' }] }] },
    { key: 'other', title: 'Other' }
  ]

  it('preserves typed keys, parent links, and sibling metadata', () => {
    const index = createTreeIndex(data)
    expect(index.order).toEqual([0, 1, '1', 'leaf', 'other'])
    expect(index.nodes.get(1)?.node.title).toBe('Numeric')
    expect(index.nodes.get('1')?.node.title).toBe('String')
    expect(index.nodes.get('1')).toMatchObject({ parentKey: 0, level: 2, position: 2, setSize: 2 })
    expect(index.nodes.get('leaf')).toMatchObject({ parentKey: '1', level: 3, position: 1, setSize: 1 })
  })

  it('exposes only nodes below accepted expanded ancestors', () => {
    const index = createTreeIndex(data)
    expect(getVisibleTreeNodes(index, ['1']).map((node) => node.key)).toEqual([0, 'other'])
    expect(getVisibleTreeNodes(index, [0]).map((node) => node.key)).toEqual([0, 1, '1', 'other'])
    expect(getVisibleTreeNodes(index, [0, '1']).map((node) => node.key)).toEqual(index.order)
  })

  it('recovers numeric-key focus to the closest visible ancestor', () => {
    const index = createTreeIndex(data)
    expect(closestVisibleTreeKey('leaf', index, new Set([0, 1, '1']))).toBe('1')
    expect(closestVisibleTreeKey(1, index, new Set([0]))).toBe(0)
  })

  it('inherits disabled state through a subtree without changing input nodes', () => {
    const data = [{ key: 'root', title: 'Root', disabled: true, children: [{ key: 'leaf', title: 'Leaf' }] }]
    expect(createTreeIndex(data).nodes.get('leaf')?.disabled).toBe(true)
    expect(data[0].children[0]).not.toHaveProperty('disabled')
  })

  it('indexes deep data without recursive stack overflow', () => {
    const root: TreeNodeData = { key: 0, title: '0' }
    let node = root
    for (let key = 1; key < 10000; key += 1) {
      const child = { key, title: String(key) }
      node.children = [child]
      node = child
    }
    const index = createTreeIndex([root])
    expect(index.nodes.size).toBe(10000)
    expect(getVisibleTreeNodes(index, index.order)).toHaveLength(10000)
    const filtered = filterTreeIndex(index, (current) => current.key === 0)
    expect(filtered).toEqual([{ key: 0, title: '0', children: [] }])
  })

  it('rejects duplicate keys and cycles instead of traversing forever', () => {
    expect(() => createTreeIndex([{ key: 'x', title: 'A' }, { key: 'x', title: 'B' }])).toThrow(/unique/)
    const root: TreeNodeData = { key: 'root', title: 'Root' }
    root.children = [root]
    expect(() => createTreeIndex([root])).toThrow(/unique/)
  })

  it('generates collision-free DOM tokens for typed and punctuation-containing keys', () => {
    const keys = [1, '1', 'a b', 'a-b', 'a/b', 'a_2fb', '中文']
    expect(new Set(keys.map(treeKeyToken)).size).toBe(keys.length)
    expect(keys.map(treeKeyToken).every((token) => /^[a-z0-9-]+$/.test(token))).toBe(true)
  })
})
