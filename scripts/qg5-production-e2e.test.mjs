import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const suite = readFileSync(new URL('../e2e/cross-browser-production.spec.ts', import.meta.url), 'utf8')

test('QG5 production suite guards resources, hydration, overlays, and viewport containment', () => {
  assert.match(suite, /response/)
  assert.match(suite, /pageerror/)
  assert.match(suite, /hydration|mismatch/)
  assert.match(suite, /getByRole\('listbox'\)/)
  assert.match(suite, /aheart-modal/)
  assert.match(suite, /scrollWidth/)
  assert.match(suite, /production-console\.json/)
})

test('collects production errors through a teardown fixture that always attaches evidence', () => {
  assert.match(suite, /(?:test|base)\.extend/)
  assert.match(suite, /productionErrors/)
  assert.match(suite, /try\s*\{\s*await use\(errors\)\s*\}\s*finally/s)
  assert.match(suite, /testInfo\.attach\(['"]production-console\.json['"]/)
  assert.match(suite, /page\.on\(['"]console['"]/)
  assert.match(suite, /page\.on\(['"]pageerror['"]/)
  assert.match(suite, /page\.on\(['"]response['"]/)
  assert.match(suite, /page\.on\(['"]requestfailed['"]/)
  assert.doesNotMatch(suite, /attachProductionErrors\(/)
})
