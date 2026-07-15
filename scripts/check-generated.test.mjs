import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { assertNoUntrackedGeneratedFiles, checkGeneratedOutput } from './check-generated.mjs'

const writeFixture = (root, path, contents) => {
  const absolutePath = join(root, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
}

const runGit = (root, args, options = {}) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', ...options })

const createGitRepository = (t, files) => {
  const root = mkdtempSync(join(tmpdir(), 'aheart-generated-gate-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))

  runGit(root, ['init', '--quiet'])
  for (const [path, contents] of Object.entries(files)) writeFixture(root, path, contents)
  runGit(root, ['add', '.'])
  runGit(root, [
    '-c',
    'user.name=Aheart Test',
    '-c',
    'user.email=test@aheart.local',
    'commit',
    '--quiet',
    '-m',
    'baseline'
  ])

  return root
}

test('accepts an empty generated-file list', () => {
  assert.doesNotThrow(() => assertNoUntrackedGeneratedFiles(''))
})

test('rejects untracked generated files', () => {
  assert.throws(
    () => assertNoUntrackedGeneratedFiles('packages/dnd/es/package.json\n'),
    /Untracked generated files/
  )
})

test('rejects staged tracked changes in generated directories', (t) => {
  const generatedFile = 'packages/components/es/index.d.ts'
  const root = createGitRepository(t, { [generatedFile]: 'before\n' })

  writeFixture(root, generatedFile, 'after\n')
  runGit(root, ['add', generatedFile])

  assert.equal(runGit(root, ['diff', '--name-only']).trim(), '')
  assert.equal(runGit(root, ['diff', '--cached', '--name-only']).trim(), generatedFile)
  assert.throws(() => checkGeneratedOutput(root))
})

test('rejects ignored untracked files in generated directories', (t) => {
  const ignoredFile = 'packages/components/es/ignored.d.ts'
  const root = createGitRepository(t, { '.gitignore': `${ignoredFile}\n` })

  writeFixture(root, ignoredFile, 'ignored generated output\n')

  assert.equal(runGit(root, ['check-ignore', ignoredFile]).trim(), ignoredFile)
  assert.throws(
    () => checkGeneratedOutput(root),
    new RegExp(`Untracked generated files:\\n${ignoredFile.replaceAll('.', '\\.')}`)
  )
})
