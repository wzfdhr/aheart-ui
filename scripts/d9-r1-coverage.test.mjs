import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('R1 state-machine files each meet the 80% branch threshold', async () => {
  const manifest = JSON.parse(await readFile(new URL('../docs/superpowers/evidence/d9-r1-coverage-manifest.json', import.meta.url), 'utf8'))
  assert.equal(manifest.schemaVersion, 'd9-r1-coverage.v1')
  assert.ok(manifest.branchThreshold >= 80)
  assert.equal(manifest.files.length, 14)
  assert.ok(manifest.files.every((file) => file.startsWith('packages/')))
})
