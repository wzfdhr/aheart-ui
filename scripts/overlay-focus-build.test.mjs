import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const root = new URL('..', import.meta.url)
const internalHelpers = ['overlay-controller', 'use-trigger-aria']

test('D2 overlay helpers stay internal and ship paired ESM and CommonJS files', () => {
  const publicEntry = readFileSync(new URL('./packages/components/src/index.ts', root), 'utf8')

  for (const helper of internalHelpers) {
    assert.doesNotMatch(publicEntry, new RegExp(`utils/${helper}`))
    for (const format of ['es', 'lib']) {
      assert.equal(existsSync(new URL(`./packages/components/${format}/utils/${helper}.d.ts`, root)), true)
      assert.equal(existsSync(new URL(`./packages/components/${format}/utils/${helper}.js`, root)), true)
    }
  }

  for (const format of ['es', 'lib']) {
    const dismiss = readFileSync(new URL(`./packages/components/${format}/utils/use-floating-dismiss.js`, root), 'utf8')
    assert.match(dismiss, /overlay-controller/)
  }
})
