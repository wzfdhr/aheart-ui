import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'

test('picker core loads through native ESM with external Dayjs plugins', async () => {
  const entry = new URL('../packages/components/es/picker-core/index.js', import.meta.url)
  assert.equal(existsSync(entry), true)
  const runtime = await import(entry.href)
  assert.equal(runtime.formatPickerValue(runtime.parsePickerValue('2026-W29', 'GGGG-[W]WW'), 'GGGG-[W]WW'), '2026-W29')
})

test('public picker types do not expose internal Dayjs helpers', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../packages/components/package.json', import.meta.url), 'utf8'))
  const rootTypes = readFileSync(new URL('../packages/components/es/index.d.ts', import.meta.url), 'utf8')

  assert.equal(packageJson.exports['./es/picker-core/*'], null)
  assert.equal(packageJson.exports['./lib/picker-core/*'], null)
  assert.equal(rootTypes.includes('PickerDateCell'), false)
  assert.equal(rootTypes.includes("export type * from './picker-core'"), false)
})
