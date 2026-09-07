import { describe, expect, it } from 'vitest'
import { createTreeIndex } from '../tree-index'
import { deriveTreeCheckState, toggleTreeCheck } from '../tree-check'

const makeIndex = () => createTreeIndex([
  { key: 'root', title: 'Root', children: [
    { key: 'a', title: 'A', children: [{ key: 'a1', title: 'A1' }, { key: 'a2', title: 'A2' }] },
    { key: 'b', title: 'B', disabled: true, children: [{ key: 'b1', title: 'B1' }] },
    { key: 'c', title: 'C' }
  ] }
])

describe('tree check model', () => {
  it('keeps strict keys independent and preserves unknown and typed keys', () => {
    const index = makeIndex()
    expect(deriveTreeCheckState(index, ['a', 1, '1'], true)).toEqual({ checkedKeys: ['a', 1, '1'], halfCheckedKeys: [] })
  })

  it('propagates enabled parent checks, aggregates children, and reports half checks', () => {
    const index = makeIndex()
    expect(deriveTreeCheckState(index, ['a'], false)).toEqual({ checkedKeys: ['a', 'a1', 'a2'], halfCheckedKeys: ['root'] })
    expect(deriveTreeCheckState(index, ['a1'], false)).toEqual({ checkedKeys: ['a1'], halfCheckedKeys: ['root', 'a'] })
    expect(deriveTreeCheckState(index, ['a1', 'a2', 'c'], false)).toEqual({ checkedKeys: ['root', 'a', 'a1', 'a2', 'c'], halfCheckedKeys: [] })
  })

  it('isolates disabled subtrees while retaining explicit disabled keys', () => {
    const index = makeIndex()
    expect(deriveTreeCheckState(index, ['b', 'b1'], false)).toEqual({ checkedKeys: ['b', 'b1'], halfCheckedKeys: [] })
    expect(deriveTreeCheckState(index, ['a1', 'b'], false)).toEqual({ checkedKeys: ['a1', 'b'], halfCheckedKeys: ['root', 'a'] })
  })

  it('toggles a subtree and removes stale ancestor markers', () => {
    const index = makeIndex()
    expect(toggleTreeCheck(index, ['root'], 'a', false)).toEqual({ checkedKeys: ['c'], halfCheckedKeys: ['root'] })
    expect(toggleTreeCheck(index, ['root', 'a', 'a1', 'a2'], 'a', false)).toEqual({ checkedKeys: ['c'], halfCheckedKeys: ['root'] })
    expect(toggleTreeCheck(index, ['a1'], 'a1', false)).toEqual({ checkedKeys: [], halfCheckedKeys: [] })
    expect(toggleTreeCheck(index, ['root', 'b', 'b1'], 'a', false)).toEqual({ checkedKeys: ['b', 'b1', 'c'], halfCheckedKeys: ['root'] })
  })

  it('does not toggle disabled targets and handles deep trees iteratively', () => {
    const index = makeIndex()
    expect(toggleTreeCheck(index, ['b'], 'b', false)).toEqual({ checkedKeys: ['b'], halfCheckedKeys: [] })
    const data: { key: number; title: string; children?: any[] } = { key: 0, title: '0' }
    let node = data
    for (let key = 1; key < 10_000; key += 1) {
      node.children = [{ key, title: String(key) }]
      node = node.children[0]
    }
    const deep = createTreeIndex([data])
    expect(deriveTreeCheckState(deep, [0], false).checkedKeys).toHaveLength(10_000)
    expect(toggleTreeCheck(deep, [0], 9_999, false)).toEqual({ checkedKeys: [], halfCheckedKeys: [] })
  })
})
