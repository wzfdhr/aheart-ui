import assert from 'node:assert/strict'
import test from 'node:test'
import { isIgnorableCancelledVitePressPrefetch } from '../e2e/qg5-request-failures.mjs'

const request = (url, resourceType = 'script') => ({ url: () => url, resourceType: () => resourceType })
const current = 'http://127.0.0.1:5173/assets/components_select.md.abc123.js'
const other = 'http://127.0.0.1:5173/assets/components_modal.md.def456.js'
const snapshot = route => ({ route })

test('VitePress cancellation classifier requires exact ownership and completion', () => {
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', undefined, request(current), 'Load request cancelled'), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-chromium', snapshot('/components/select'), request(current), 'Load request cancelled', new Set([current])), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', snapshot('/components/select'), request(other), 'Load request cancelled'), true)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', snapshot('/components/select'), request(current), 'Load request cancelled'), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', snapshot('/components/select'), request(current), 'Load request cancelled', new Set([current])), true)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', snapshot('/components/select'), request(current), 'Load request cancelled', new Set()), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', snapshot('/components/select'), request(current), 'Load request cancelled '), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', snapshot('/components/select'), request('http://127.0.0.1:5173/assets/app.abc123.js'), 'Load request cancelled', new Set([current])), false)
})
