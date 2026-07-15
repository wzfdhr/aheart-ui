import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
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

const gateScript = resolve('scripts/check-build-determinism.mjs')

const writeFixture = (root, path, contents) => {
  const absolutePath = join(root, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
}

const runGit = (root, args, options = {}) =>
  spawnSync('git', args, { cwd: root, encoding: 'utf8', ...options })

const createGateRepository = (t, { gitignore = '', buildBody = '' } = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'aheart-build-gate-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))

  assert.equal(runGit(root, ['init', '--quiet']).status, 0)
  writeFixture(root, 'package.json', JSON.stringify({ scripts: { build: 'node build-fixture.mjs' } }))
  writeFixture(
    root,
    'build-fixture.mjs',
    [
      "import { appendFileSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'",
      "const countPath = '.build-count'",
      "const count = existsSync(countPath) ? Number(readFileSync(countPath, 'utf8')) + 1 : 1",
      "writeFileSync(countPath, String(count))",
      "appendFileSync('.build-events.jsonl', `${JSON.stringify({ count, cwd: process.cwd(), execPath: process.execPath, initCwd: process.env.INIT_CWD, lifecycle: process.env.npm_lifecycle_event, userAgent: process.env.npm_config_user_agent })}\\n`)",
      buildBody
    ].join('\n')
  )
  if (gitignore) writeFixture(root, '.gitignore', gitignore)
  for (const [index, directory] of generatedPaths.entries()) {
    writeFixture(root, `${directory}/baseline-${index}.d.ts`, `baseline-${index}\n`)
  }

  assert.equal(runGit(root, ['add', '.']).status, 0)
  assert.equal(
    runGit(root, [
      '-c',
      'user.name=Aheart Test',
      '-c',
      'user.email=test@aheart.local',
      'commit',
      '--quiet',
      '-m',
      'baseline'
    ]).status,
    0
  )

  return root
}

const runGate = (root) =>
  spawnSync(process.execPath, [gateScript], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, CI: 'true' }
  })

const gateOutput = (result) => `${result.stdout ?? ''}\n${result.stderr ?? ''}`

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

test('preflight rejects a staged change even when the worktree is restored to HEAD', (t) => {
  const generatedFile = 'packages/components/es/baseline-0.d.ts'
  const root = createGateRepository(t, {
    buildBody: `writeFileSync(${JSON.stringify(generatedFile)}, 'baseline-0\\n')`
  })

  writeFixture(root, generatedFile, 'staged\n')
  assert.equal(runGit(root, ['add', generatedFile]).status, 0)
  writeFixture(root, generatedFile, 'baseline-0\n')

  const result = runGate(root)

  assert.notEqual(result.status, 0, gateOutput(result))
  assert.match(gateOutput(result), /Generated output index differs from HEAD/)
  assert.equal(existsSync(join(root, '.build-count')), false, 'build must not run after a failed preflight')
})

test('preflight rejects a staged new file before a build can delete it', (t) => {
  const generatedFile = 'packages/components/es/staged-new.d.ts'
  const root = createGateRepository(t, {
    buildBody: `rmSync(${JSON.stringify(generatedFile)}, { force: true })`
  })

  writeFixture(root, generatedFile, 'staged new output\n')
  assert.equal(runGit(root, ['add', generatedFile]).status, 0)

  const result = runGate(root)

  assert.notEqual(result.status, 0, gateOutput(result))
  assert.match(gateOutput(result), /Generated output index differs from HEAD/)
  assert.equal(existsSync(join(root, '.build-count')), false, 'build must not erase staged evidence')
})

test('preflight rejects an ignored generated file before a build can delete it', (t) => {
  const ignoredFile = 'packages/components/es/ignored-before-build.d.ts'
  const root = createGateRepository(t, {
    gitignore: `${ignoredFile}\n`,
    buildBody: `rmSync(${JSON.stringify(ignoredFile)}, { force: true })`
  })

  writeFixture(root, ignoredFile, 'ignored generated output\n')

  const result = runGate(root)

  assert.notEqual(result.status, 0, gateOutput(result))
  assert.match(gateOutput(result), new RegExp(`Untracked generated files:\\s+${ignoredFile.replaceAll('.', '\\.')}`))
  assert.equal(existsSync(join(root, '.build-count')), false, 'build must not erase ignored evidence')
})

test('writes sorted SHA-256 manifests and a readable comparison when builds differ', (t) => {
  const generatedFile = 'packages/components/es/baseline-0.d.ts'
  const root = createGateRepository(t, {
    buildBody: [
      `writeFileSync(${JSON.stringify(generatedFile)}, count === 1 ? 'build-one\\n' : 'build-two\\n')`
    ].join('\n')
  })

  const result = runGate(root)
  const diagnostics = join(root, 'test-results/build-generated-diagnostics')
  const firstPath = join(diagnostics, 'build-1.sha256.txt')
  const secondPath = join(diagnostics, 'build-2.sha256.txt')
  const reportPath = join(diagnostics, 'comparison.txt')

  assert.notEqual(result.status, 0, gateOutput(result))
  assert.equal(existsSync(firstPath), true, 'build 1 manifest is missing')
  assert.equal(existsSync(secondPath), true, 'build 2 manifest is missing')
  assert.equal(existsSync(reportPath), true, 'comparison report is missing')

  const firstLines = readFileSync(firstPath, 'utf8').trim().split('\n')
  const secondLines = readFileSync(secondPath, 'utf8').trim().split('\n')
  const firstHash = createHash('sha256').update('build-one\n').digest('hex')
  const secondHash = createHash('sha256').update('build-two\n').digest('hex')
  const firstPaths = firstLines.map((line) => line.slice(66))
  const secondPaths = secondLines.map((line) => line.slice(66))
  const failureEvidence = [
    `build events:\n${readFileSync(join(root, '.build-events.jsonl'), 'utf8')}`,
    `build 1 manifest:\n${firstLines.join('\n')}`,
    `build 2 manifest:\n${secondLines.join('\n')}`,
    `gate output:\n${gateOutput(result)}`
  ].join('\n\n')

  assert.deepEqual(firstPaths, [...firstPaths].sort())
  assert.deepEqual(secondPaths, [...secondPaths].sort())
  assert.ok(firstLines.includes(`${firstHash}  ${generatedFile}`), failureEvidence)
  assert.ok(secondLines.includes(`${secondHash}  ${generatedFile}`), failureEvidence)
  assert.match(readFileSync(reportPath, 'utf8'), new RegExp(`CHANGED ${generatedFile.replaceAll('.', '\\.')}`))
})
