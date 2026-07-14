import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

const require = createRequire(import.meta.url)
const packages = ['components', 'dnd', 'ai']

for (const packageDir of packages) {
  test(`${packageDir} loads through ESM and CommonJS entrypoints`, async () => {
    const esm = await import(`../packages/${packageDir}/es/index.js`)
    const cjs = require(`../packages/${packageDir}/lib/index.js`)

    assert.ok(Object.keys(esm).length > 0)
    assert.ok(Object.keys(cjs).length > 0)
  })
}
