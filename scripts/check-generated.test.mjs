import assert from 'node:assert/strict'
import test from 'node:test'
import { assertNoUntrackedGeneratedFiles } from './check-generated.mjs'

test('accepts an empty generated-file list', () => {
  assert.doesNotThrow(() => assertNoUntrackedGeneratedFiles(''))
})

test('rejects untracked generated files', () => {
  assert.throws(
    () => assertNoUntrackedGeneratedFiles('packages/dnd/es/package.json\n'),
    /Untracked generated files/
  )
})
