import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('quality matrix registers every Ready component exactly once with release evidence', async () => {
  const [{ qualityMatrix, validateQualityMatrix }, componentMetadata] = await Promise.all([
    import(path.join(root, 'docs/.vitepress/data/quality-matrix.mjs')),
    readFile(path.join(root, 'docs/.vitepress/data/components.ts'), 'utf8')
  ])
  const readyKeys = [...componentMetadata.matchAll(/key:\s*'([^']+)',\s*name:\s*'[^']+',\s*zhName:\s*'[^']+'[\s\S]*?status:\s*'Ready'/g)].map((match) => match[1])

  assert.equal(new Set(readyKeys).size, 48, 'the Ready component baseline changed; update the quality matrix intentionally')
  assert.equal(qualityMatrix.length, readyKeys.length)
  assert.deepEqual(new Set(qualityMatrix.map((record) => record.component)), new Set(readyKeys))
  assert.doesNotThrow(() => validateQualityMatrix(readyKeys))

  for (const record of qualityMatrix) {
    assert.match(record.package, /^(aheart-ui|@aheart-ui\/(dnd|ai))$/)
    assert.match(record.risk, /^R[123]$/)
    assert.ok(record.owner.trim())
    assert.ok(record.unit.length > 0)
    assert.ok(record.e2e.length > 0)
    assert.ok(record.ssr.length > 0)
    assert.ok(record.a11y.length > 0)
    assert.ok(record.visual.length > 0)
  }
})
