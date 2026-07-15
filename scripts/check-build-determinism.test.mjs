import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import {
  GENERATED_PATHS,
  assertSnapshotsEqual,
  compareSnapshots,
  snapshotGeneratedFiles
} from './check-build-determinism.mjs'

const generatedPaths = [
  'packages/components/es',
  'packages/components/lib',
  'packages/dnd/es',
  'packages/dnd/lib',
  'packages/ai/es',
  'packages/ai/lib'
]

test('snapshots every file in all generated directories with relative paths and SHA-256', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'aheart-build-snapshot-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))

  const files = generatedPaths.map((directory, index) => [
    `${directory}/nested/file-${index}.d.ts`,
    index === 0 ? 'alpha' : `content-${index}`
  ])

  for (const [relativePath, contents] of files) {
    const absolutePath = join(root, relativePath)
    mkdirSync(dirname(absolutePath), { recursive: true })
    writeFileSync(absolutePath, contents)
  }

  assert.deepEqual(GENERATED_PATHS, generatedPaths)
  assert.deepEqual(Object.keys(snapshotGeneratedFiles(root)), files.map(([path]) => path))
  assert.equal(
    snapshotGeneratedFiles(root)['packages/components/es/nested/file-0.d.ts'],
    '8ed3f6ad685b959ead7022518e1af76cd816f8e8ec7ccdda1ed4018e8f2223f8'
  )
})

test('identical snapshots produce no differences regardless of insertion order', () => {
  const first = {
    'packages/components/es/z.d.ts': 'hash-z',
    'packages/components/es/a.d.ts': 'hash-a'
  }
  const second = {
    'packages/components/es/a.d.ts': 'hash-a',
    'packages/components/es/z.d.ts': 'hash-z'
  }

  assert.deepEqual(compareSnapshots(first, second), [])
  assert.doesNotThrow(() => assertSnapshotsEqual(first, second))
})

test('identifies added, removed, and changed files in deterministic order', () => {
  const first = {
    'packages/dnd/lib/z-removed.d.ts': 'old-z',
    'packages/components/es/b-changed.d.ts': 'old-b',
    'packages/dnd/lib/a-removed.d.ts': 'old-a',
    'packages/ai/es/unchanged.d.ts': 'same'
  }
  const second = {
    'packages/components/lib/z-added.d.ts': 'new-z',
    'packages/components/es/b-changed.d.ts': 'new-b',
    'packages/components/lib/a-added.d.ts': 'new-a',
    'packages/ai/es/unchanged.d.ts': 'same'
  }

  assert.deepEqual(compareSnapshots(first, second), [
    { status: 'added', path: 'packages/components/lib/a-added.d.ts' },
    { status: 'added', path: 'packages/components/lib/z-added.d.ts' },
    { status: 'removed', path: 'packages/dnd/lib/a-removed.d.ts' },
    { status: 'removed', path: 'packages/dnd/lib/z-removed.d.ts' },
    { status: 'changed', path: 'packages/components/es/b-changed.d.ts' }
  ])
})

test('mismatched snapshots throw a readable status report with paths', () => {
  const first = {
    'packages/components/es/changed.d.ts': 'before',
    'packages/components/es/removed.d.ts': 'before'
  }
  const second = {
    'packages/components/es/added.d.ts': 'after',
    'packages/components/es/changed.d.ts': 'after'
  }

  assert.throws(
    () => assertSnapshotsEqual(first, second),
    {
      message: [
        'Generated output differs between consecutive builds:',
        'ADDED packages/components/es/added.d.ts',
        'REMOVED packages/components/es/removed.d.ts',
        'CHANGED packages/components/es/changed.d.ts'
      ].join('\n')
    }
  )
})
