import test from 'node:test'
import assert from 'node:assert/strict'
import { validateSkipLedger } from './qg5-skip-ledger.mjs'

test('D9 skip ledger registers every static e2e skip with owner, issue and expiry', async () => {
  assert.deepEqual(await validateSkipLedger({ today: '2026-09-29' }), { ok: true, count: 41, missing: [], stale: [] })
})

test('D9 skip ledger rejects an expiry date before the execution date', async () => {
  await assert.rejects(() => validateSkipLedger({ today: '2027-01-01' }), /expired/)
})
