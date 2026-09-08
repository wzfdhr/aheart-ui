import assert from 'node:assert/strict'
import test from 'node:test'
import { isIgnorableCancelledVitePressPrefetch } from '../e2e/qg5-request-failures.mjs'

const request = (url, resourceType = 'script') => ({ url: () => url, resourceType: () => resourceType })
const asset = 'http://127.0.0.1:5173/assets/components-select.md.abc123.js'

test('VitePress cancellation classifier keeps negative cases fatal', () => {
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-chromium', '/components/select', request(asset), 'Load request cancelled', new Map([[asset, '/components/select']])), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', '/components/select', request(asset), 'Load request cancelled'), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', '/components/select', request(asset), 'Load request cancelled', new Map()), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', '/components/select', request(asset), 'Load request cancelled', new Map([[asset, '/components/select']])), true)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', '/components/modal', request(asset), 'Load request cancelled', new Map([[asset, '/components/select']])), true)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', '/components/select', request('http://127.0.0.1:5173/assets/app.abc123.js'), 'Load request cancelled', new Map([[asset, '/components/select']])), false)
  assert.equal(isIgnorableCancelledVitePressPrefetch('desktop-webkit', '/components/select', request(asset), 'net::ERR_ABORTED', new Map([[asset, '/components/select']])), false)
})
