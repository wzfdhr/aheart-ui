import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('quality matrix registers every Ready component exactly once with release evidence', async () => {
  const [{ qualityMatrix, validateQualityMatrix }, { parseReadyComponentKeys, validateEvidence }, componentMetadata] = await Promise.all([
    import(path.join(root, 'docs/.vitepress/data/quality-matrix.mjs')),
    import(path.join(root, 'scripts/quality-matrix.mjs')),
    readFile(path.join(root, 'docs/.vitepress/data/components.ts'), 'utf8')
  ])
  const readyKeys = parseReadyComponentKeys(componentMetadata)

  assert.equal(new Set(readyKeys).size, 48, 'the Ready component baseline changed; update the quality matrix intentionally')
  assert.equal(qualityMatrix.length, readyKeys.length)
  assert.deepEqual(new Set(qualityMatrix.map((record) => record.component)), new Set(readyKeys))
  assert.doesNotThrow(() => validateQualityMatrix(readyKeys))
  assert.deepEqual(
    parseReadyComponentKeys("{ key: 'without-zh-name', name: 'Example', description: {}, status: 'Ready' }"),
    ['without-zh-name']
  )
  assert.deepEqual(
    parseReadyComponentKeys('{ key: "double-quoted", name: "Example", description: {}, status: "Ready" }'),
    ['double-quoted']
  )

  for (const record of qualityMatrix) {
    assert.match(record.package, /^(aheart-ui|@aheart-ui\/(dnd|ai))$/)
    assert.match(record.risk, /^R[123]$/)
    assert.ok(record.owner.trim())
    assert.doesNotThrow(() => validateEvidence(record, root))
  }

  const sample = qualityMatrix.find((record) => record.component === 'button')
  assert.throws(
    () => validateEvidence({ ...sample, unit: [{ kind: 'file', path: 'packages/ai/src/__tests__/package.test.ts' }] }, root),
    /crosses package boundary/
  )
  assert.throws(
    () => validateEvidence({ ...sample, visual: [{ kind: 'file', path: 'e2e/does-not-exist.spec.ts' }] }, root),
    /evidence is missing/
  )
  assert.throws(
    () => validateEvidence({ ...sample, a11y: [{ kind: 'planned', milestone: 'QG4' }] }, root),
    /invalid planned evidence item/
  )
  assert.throws(
    () => validateEvidence({ ...sample, visual: [{ kind: 'planned', milestone: 'QG5', reason: 'hypothetical' }] }, root),
    /invalid planned evidence item/
  )
})
