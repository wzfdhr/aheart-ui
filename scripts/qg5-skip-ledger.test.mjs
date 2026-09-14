import test from 'node:test'
import assert from 'node:assert/strict'
import { validateSkipLedger } from './qg5-skip-ledger.mjs'

test('D9 skip ledger registers every static e2e skip with owner, issue and expiry', async () => {
  assert.deepEqual(await validateSkipLedger(), { ok: true, count: 38, missing: [], stale: [] })
})
