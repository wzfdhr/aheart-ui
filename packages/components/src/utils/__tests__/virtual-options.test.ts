import { describe, expect, it } from 'vitest'
import { runInNewContext } from 'node:vm'
import { normalizeTreeVirtual } from '../../tree/virtual-options'
import { normalizeTreeSelectVirtual } from '../../tree-select/virtual-options'
import { normalizeCascaderVirtual } from '../../cascader/virtual-options'

describe.each([
  ['ATree', normalizeTreeVirtual, 320, 28, false],
  ['ATreeSelect', normalizeTreeSelectVirtual, 256, 28, false],
  ['ACascader', normalizeCascaderVirtual, 256, 32, true]
] as const)('%s virtual option equivalence', (name, normalize, height, estimateSize, compact) => {
  it('preserves defaults, caller immutability and result isolation', () => {
    expect(normalize(false)).toBeNull()
    expect(normalize(undefined)).toBeNull()
    const first = normalize(true)!
    expect(first).toEqual({ height, estimateSize, overscan: 4 })
    first.height = 1
    expect(normalize(true)?.height).toBe(height)
    const source = Object.freeze({ height: 12.5, estimateSize: .5, overscan: 0, ignored: 'yes' })
    expect(normalize(source)).toEqual({ height: 12.5, estimateSize: .5, overscan: 0 })
    expect(normalize(Object.assign(Object.create(null), source))).toEqual({ height: 12.5, estimateSize: .5, overscan: 0 })
  })
  it('retains exact per-field warning order and text', () => {
    for (const bad of [NaN, Infinity, -Infinity, -1, 0, '1', null]) {
      const warnings: string[] = []
      const result = normalize({ height: bad, estimateSize: bad, overscan: -1 } as never, message => warnings.push(message))
      expect(result).toEqual({ height, estimateSize, overscan: 4 })
      const positive = compact ? 'positive; using default.' : 'a positive number; using the default.'
      const integer = compact ? 'non-negative safe integer; using default.' : 'a non-negative safe integer; using the default.'
      expect(warnings).toEqual([`[${name}] virtual.height must be ${positive}`, `[${name}] virtual.estimateSize must be ${positive}`, `[${name}] virtual.overscan must be ${integer}`])
    }
  })
  it('rejects nonrecords and unsafe overscan while allowing safe boundaries', () => {
    for (const value of [[], new Date(), new (class Options {})(), null]) {
      const warnings: string[] = []
      expect(normalize(value as never, message => warnings.push(message))).toBeNull()
      expect(warnings).toEqual([`[${name}] invalid virtual options; virtualization is disabled.`])
    }
    expect(normalize({ overscan: Number.MAX_SAFE_INTEGER })?.overscan).toBe(Number.MAX_SAFE_INTEGER)
    for (const overscan of [.5, Number.MAX_SAFE_INTEGER + 1, Infinity]) expect(normalize({ overscan })?.overscan).toBe(4)
  })
  it('accepts cross-realm records and preserves accessor read counts', () => {
    expect(normalize(runInNewContext('({ height: 22.5, estimateSize: 11, overscan: 0 })'))).toEqual({ height: 22.5, estimateSize: 11, overscan: 0 })
    const reads = { height: 0, estimateSize: 0, overscan: 0 }
    const source = {
      get height() { reads.height++; return 22.5 },
      get estimateSize() { reads.estimateSize++; return 11 },
      get overscan() { reads.overscan++; return 0 }
    }
    expect(normalize(source)).toEqual({ height: 22.5, estimateSize: 11, overscan: 0 })
    expect(reads).toEqual({ height: compact ? 5 : 3, estimateSize: compact ? 5 : 3, overscan: 5 })
  })
})
