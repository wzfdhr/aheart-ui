import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createPickerTransaction } from '../transaction'

describe('picker transaction policy', () => {
  it('is consumed by every production picker', () => {
    for (const file of ['date-picker/date-picker.vue', 'date-picker/date-range-picker.vue', 'time-picker/time-picker.vue', 'time-picker/time-range-picker.vue']) {
      const source = readFileSync(resolve(import.meta.dirname, '../../', file), 'utf8')
      expect(source).toContain('createPickerTransaction')
      expect(source).not.toContain('needConfirm: false')
      expect(source).toMatch(/shouldCommit\(\)|shouldStage\(\)/)
    }
  })

  it('keeps confirm-mode actions in draft and commits exactly once', () => {
    const tx = createPickerTransaction<string>({ needConfirm: true, committed: 'old' })

    tx.begin('new')
    expect(tx.snapshot()).toMatchObject({ committed: 'old', draft: 'new' })
    expect(tx.commit()).toEqual('new')
    expect(tx.snapshot()).toMatchObject({ committed: 'new', draft: 'new' })
  })

  it('discards escape/cancel without committing and gates disabled actions', () => {
    const tx = createPickerTransaction<string>({ needConfirm: true, committed: 'old' })

    tx.begin('new')
    tx.discard()
    expect(tx.snapshot()).toMatchObject({ committed: 'old', draft: 'old' })
    expect(tx.canAct({ disabled: true, readOnly: false })).toBe(false)
    expect(tx.canAct({ disabled: false, readOnly: true })).toBe(false)
  })

  it('commits immediately once for non-confirm actions', () => {
    const tx = createPickerTransaction<string>({ needConfirm: false, committed: 'old' })
    expect(tx.apply('new')).toEqual('new')
    expect(tx.snapshot()).toMatchObject({ committed: 'new', draft: 'new' })
  })

  it('resolves a dynamic confirmation policy and syncs controlled commits', () => {
    let needConfirm = true
    const tx = createPickerTransaction<string>({ needConfirm: () => needConfirm, committed: 'old' })
    expect(tx.shouldStage()).toBe(true)
    expect(tx.shouldCommit()).toBe(false)
    tx.begin('draft')
    tx.syncCommitted('parent')
    expect(tx.discard()).toBe('parent')
    expect(tx.snapshot()).toMatchObject({ committed: 'parent', draft: 'parent' })
    needConfirm = false
    expect(tx.shouldCommit()).toBe(true)
  })
})
