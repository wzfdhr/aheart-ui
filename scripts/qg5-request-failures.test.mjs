import assert from 'node:assert/strict'
import test from 'node:test'
import { isIgnorableCancelledVitePressPrefetch, normalizeRoute } from '../e2e/qg5-request-failures.mjs'

const request = (url, resourceType = 'xhr') => ({ url: () => url, resourceType: () => resourceType })
const current = 'http://127.0.0.1:5173/assets/components_select.md.abc123.js'
const other = 'http://127.0.0.1:5173/assets/components_modal.md.def456.js'
const metadata = (overrides = {}) => ({ frame: true, method: 'GET', resourceType: 'xhr', secFetchDest: 'empty', referer: '/components/select', activeRoute: '/components/select', ...overrides })

test('normalizes route paths before ownership checks', () => {
  assert.equal(normalizeRoute('/components/select.html?x=1#hash'), '/components/select')
  assert.equal(normalizeRoute('/components/select/'), '/components/select')
})

test('VitePress cancellation classifier requires trace-backed prefetch evidence', () => {
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', undefined, request(other), 'Load request cancelled'), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-chromium', metadata(), request(other), 'Load request cancelled'), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', metadata({ frame: false }), request(other), 'Load request cancelled'), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', metadata({ referer: '' }), request(other), 'Load request cancelled'), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', metadata(), request(other), 'Load request cancelled'), true)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', metadata(), request(current), 'Load request cancelled'), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', metadata(), request(current), 'Load request cancelled', new Set([current])), true)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', metadata(), request(current), 'Load request cancelled', new Set()), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', metadata(), request(current), 'Load request cancelled '), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', metadata(), request('http://127.0.0.1:5173/assets/app.abc123.js'), 'Load request cancelled', new Set([current])), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', metadata(), request(current), 'Load request cancelled', new Set()), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', metadata({ method: 'POST' }), request(other), 'Load request cancelled'), false)
})
