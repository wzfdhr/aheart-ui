import test from 'node:test'
import assert from 'node:assert/strict'
import { collectR1Coverage } from './d9-r1-coverage.mjs'

test('R1 state-machine files each meet the 80% branch threshold', async () => {
  const result = await collectR1Coverage()
  assert.equal(result.ok, true)
  assert.ok(result.files.length >= 14)
  assert.ok(result.aggregate.pct >= 80)
})
