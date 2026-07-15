import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { checkGeneratedOutput, GENERATED_PATHS } from './check-generated.mjs'

const comparePaths = (first, second) => (first < second ? -1 : first > second ? 1 : 0)
const toPosixPath = (path) => path.split(sep).join('/')

const listFiles = (directory) => {
  const files = []

  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => comparePaths(a.name, b.name))) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...listFiles(path))
    else if (entry.isFile()) files.push(path)
  }

  return files
}

export { GENERATED_PATHS }

export const snapshotGeneratedFiles = (rootDirectory = process.cwd()) => {
  const entries = []

  for (const generatedPath of GENERATED_PATHS) {
    for (const file of listFiles(join(rootDirectory, generatedPath))) {
      const path = toPosixPath(relative(rootDirectory, file))
      const hash = createHash('sha256').update(readFileSync(file)).digest('hex')
      entries.push([path, hash])
    }
  }

  return Object.fromEntries(entries)
}

export const compareSnapshots = (first, second) => {
  const added = Object.keys(second)
    .filter((path) => !Object.hasOwn(first, path))
    .sort(comparePaths)
    .map((path) => ({ status: 'added', path }))
  const removed = Object.keys(first)
    .filter((path) => !Object.hasOwn(second, path))
    .sort(comparePaths)
    .map((path) => ({ status: 'removed', path }))
  const changed = Object.keys(first)
    .filter((path) => Object.hasOwn(second, path) && first[path] !== second[path])
    .sort(comparePaths)
    .map((path) => ({ status: 'changed', path }))

  return [...added, ...removed, ...changed]
}

export const assertSnapshotsEqual = (first, second) => {
  const differences = compareSnapshots(first, second)
  if (differences.length === 0) return

  const report = differences.map(({ status, path }) => `${status.toUpperCase()} ${path}`).join('\n')
  throw new Error(`Generated output differs between consecutive builds:\n${report}`)
}

const formatManifest = (snapshot, unavailableReason) => {
  if (!snapshot) return `# unavailable: ${unavailableReason}\n`

  return `${Object.entries(snapshot)
    .sort(([firstPath], [secondPath]) => comparePaths(firstPath, secondPath))
    .map(([path, hash]) => `${hash}  ${path}`)
    .join('\n')}\n`
}

const formatComparison = (first, second) => {
  if (!first || !second) return 'Snapshot comparison unavailable because both builds did not complete.'

  const differences = compareSnapshots(first, second)
  if (differences.length === 0) return 'No differences between build snapshots.'

  return differences.map(({ status, path }) => `${status.toUpperCase()} ${path}`).join('\n')
}

export const writeBuildDiagnostics = ({ rootDirectory, first, second, error }) => {
  const diagnosticsDirectory = join(rootDirectory, 'test-results/build-generated-diagnostics')
  mkdirSync(diagnosticsDirectory, { recursive: true })
  writeFileSync(
    join(diagnosticsDirectory, 'build-1.sha256.txt'),
    formatManifest(first, 'build 1 did not complete')
  )
  writeFileSync(
    join(diagnosticsDirectory, 'build-2.sha256.txt'),
    formatManifest(second, 'build 2 did not complete')
  )
  writeFileSync(
    join(diagnosticsDirectory, 'comparison.txt'),
    [
      'Generated output determinism diagnostics',
      `Failure: ${error instanceof Error ? error.message : String(error)}`,
      '',
      'Snapshot comparison:',
      formatComparison(first, second),
      ''
    ].join('\n')
  )
}

export const checkBuildDeterminism = (rootDirectory = process.cwd()) => {
  const diagnosticsDirectory = join(rootDirectory, 'test-results/build-generated-diagnostics')
  let first
  let second

  rmSync(diagnosticsDirectory, { recursive: true, force: true })

  try {
    checkGeneratedOutput(rootDirectory)

    execFileSync('corepack', ['pnpm', 'build'], { cwd: rootDirectory, stdio: 'inherit' })
    first = snapshotGeneratedFiles(rootDirectory)

    execFileSync('corepack', ['pnpm', 'build'], { cwd: rootDirectory, stdio: 'inherit' })
    second = snapshotGeneratedFiles(rootDirectory)

    assertSnapshotsEqual(first, second)
    checkGeneratedOutput(rootDirectory)
  } catch (error) {
    writeBuildDiagnostics({ rootDirectory, first, second, error })
    throw error
  }
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isCli) {
  try {
    checkBuildDeterminism()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
