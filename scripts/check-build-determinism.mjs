import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { StringDecoder } from 'node:string_decoder'
import { pathToFileURL } from 'node:url'
import { checkGeneratedOutput, GENERATED_PATHS } from './check-generated.mjs'

const comparePaths = (first, second) => (first < second ? -1 : first > second ? 1 : 0)
const toPosixPath = (path) => path.split(sep).join('/')
const defaultBuildCommand = { command: 'corepack', args: ['pnpm', 'build'] }

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

const formatComparison = (first, second, buildResults) => {
  if (!first && !second) {
    if (buildResults[0].stage === 'completed') {
      return 'Snapshot comparison unavailable because snapshot 1 was not captured and snapshot 2 was not captured.'
    }
    return 'Snapshot comparison unavailable because build 1 and build 2 did not complete.'
  }
  if (!first) {
    return buildResults[0].stage === 'completed'
      ? 'Snapshot comparison unavailable because snapshot 1 was not captured after build 1 completed.'
      : 'Snapshot comparison unavailable because build 1 did not complete.'
  }
  if (!second) {
    return buildResults[1].stage === 'completed'
      ? 'Snapshot comparison unavailable because snapshot 2 was not captured after build 2 completed.'
      : 'Snapshot comparison unavailable because build 2 did not complete.'
  }

  const differences = compareSnapshots(first, second)
  if (differences.length === 0) return 'No differences between build snapshots.'

  return differences.map(({ status, path }) => `${status.toUpperCase()} ${path}`).join('\n')
}

const formatFailureStage = (stage) => {
  switch (stage) {
    case 'preflight':
      return 'Preflight generated-output check failed before build 1 started.'
    case 'build-1':
      return 'Build 1 failed before its snapshot was captured; build 2 was not started.'
    case 'snapshot-1':
      return 'Build 1 completed successfully, but snapshot 1 capture failed; build 2 was not started.'
    case 'build-2':
      return 'Build 2 failed after build 1 snapshot completed; build 2 snapshot was not captured.'
    case 'snapshot-2':
      return 'Build 2 completed successfully after snapshot 1 was captured, but snapshot 2 capture failed.'
    case 'snapshot-comparison':
      return 'Both build snapshots completed, but their generated output differs.'
    case 'postflight':
      return 'Both build snapshots completed and matched; postflight generated-output check failed.'
    default:
      return 'Build determinism gate failed at an unknown stage.'
  }
}

const notStartedBuild = (buildNumber) => ({
  buildNumber,
  command: undefined,
  stage: 'not-started',
  status: undefined,
  signal: undefined,
  stdout: '',
  stderr: ''
})

const formatBuildResult = (result) =>
  [
    `Build: ${result.buildNumber}`,
    `Stage: ${result.stage}`,
    `Exit status: ${result.stage === 'not-started' ? 'not-run' : (result.status ?? 'null')}`,
    `Signal: ${result.signal ?? 'none'}`,
    `Command: ${result.command ? JSON.stringify(result.command) : 'not-run'}`,
    ''
  ].join('\n')

const readBuildCommand = () => {
  const serializedCommand = process.env.AHEART_BUILD_DETERMINISM_COMMAND
  if (!serializedCommand) return defaultBuildCommand

  const commandParts = JSON.parse(serializedCommand)
  if (
    !Array.isArray(commandParts) ||
    commandParts.length === 0 ||
    commandParts.some((part) => typeof part !== 'string' || part.length === 0)
  ) {
    throw new Error('AHEART_BUILD_DETERMINISM_COMMAND must be a JSON array of non-empty strings')
  }

  return { command: commandParts[0], args: commandParts.slice(1) }
}

const runBuild = ({ rootDirectory, buildNumber, buildCommand }) =>
  new Promise((resolveBuild) => {
    const child = spawn(buildCommand.command, buildCommand.args, {
      cwd: rootDirectory,
      stdio: ['inherit', 'pipe', 'pipe']
    })
    let stdout = ''
    let stderr = ''
    let spawnError
    const stdoutDecoder = new StringDecoder('utf8')
    const stderrDecoder = new StringDecoder('utf8')

    child.stdout.on('data', (chunk) => {
      stdout += stdoutDecoder.write(chunk)
      process.stdout.write(chunk)
    })
    child.stderr.on('data', (chunk) => {
      stderr += stderrDecoder.write(chunk)
      process.stderr.write(chunk)
    })
    child.once('error', (error) => {
      spawnError = error
      const message = `${error.message}\n`
      stderr += message
      process.stderr.write(message)
    })
    child.once('close', (status, signal) => {
      stdout += stdoutDecoder.end()
      stderr += stderrDecoder.end()
      resolveBuild({
        buildNumber,
        command: [buildCommand.command, ...buildCommand.args],
        stage: spawnError || status !== 0 || signal ? 'failed' : 'completed',
        status,
        signal,
        stdout,
        stderr,
        spawnError
      })
    })
  })

const assertBuildCompleted = (result) => {
  if (result.stage === 'completed') return

  const exitDescription = result.signal
    ? `signal ${result.signal}`
    : result.status === null
      ? 'no exit status'
      : `exit status ${result.status}`
  throw new Error(`Build ${result.buildNumber} failed with ${exitDescription}.`)
}

export const writeBuildDiagnostics = ({
  rootDirectory,
  first,
  second,
  error,
  failureStage,
  buildResults
}) => {
  const diagnosticsDirectory = join(rootDirectory, 'test-results/build-generated-diagnostics')
  mkdirSync(diagnosticsDirectory, { recursive: true })
  writeFileSync(
    join(diagnosticsDirectory, 'build-1.sha256.txt'),
    formatManifest(
      first,
      buildResults[0].stage === 'completed'
        ? 'build 1 completed but snapshot unavailable'
        : 'build 1 did not complete'
    )
  )
  writeFileSync(
    join(diagnosticsDirectory, 'build-2.sha256.txt'),
    formatManifest(
      second,
      buildResults[1].stage === 'completed'
        ? 'build 2 completed but snapshot unavailable'
        : 'build 2 did not complete'
    )
  )
  for (const result of buildResults) {
    writeFileSync(join(diagnosticsDirectory, `build-${result.buildNumber}.stdout.log`), result.stdout)
    writeFileSync(join(diagnosticsDirectory, `build-${result.buildNumber}.stderr.log`), result.stderr)
    writeFileSync(
      join(diagnosticsDirectory, `build-${result.buildNumber}.result.txt`),
      formatBuildResult(result)
    )
  }
  writeFileSync(
    join(diagnosticsDirectory, 'comparison.txt'),
    [
      'Generated output determinism diagnostics',
      `Failure stage: ${failureStage}`,
      `Failure: ${error instanceof Error ? error.message : String(error)}`,
      `Stage summary: ${formatFailureStage(failureStage)}`,
      '',
      'Snapshot comparison:',
      formatComparison(first, second, buildResults),
      ''
    ].join('\n')
  )
}

export const checkBuildDeterminism = async (rootDirectory = process.cwd()) => {
  const diagnosticsDirectory = join(rootDirectory, 'test-results/build-generated-diagnostics')
  const buildCommand = readBuildCommand()
  const buildResults = [notStartedBuild(1), notStartedBuild(2)]
  let first
  let second
  let failureStage = 'preflight'

  rmSync(diagnosticsDirectory, { recursive: true, force: true })

  try {
    checkGeneratedOutput(rootDirectory)

    failureStage = 'build-1'
    buildResults[0] = await runBuild({ rootDirectory, buildNumber: 1, buildCommand })
    assertBuildCompleted(buildResults[0])

    failureStage = 'snapshot-1'
    first = snapshotGeneratedFiles(rootDirectory)

    failureStage = 'build-2'
    buildResults[1] = await runBuild({ rootDirectory, buildNumber: 2, buildCommand })
    assertBuildCompleted(buildResults[1])

    failureStage = 'snapshot-2'
    second = snapshotGeneratedFiles(rootDirectory)

    failureStage = 'snapshot-comparison'
    assertSnapshotsEqual(first, second)

    failureStage = 'postflight'
    checkGeneratedOutput(rootDirectory)
  } catch (error) {
    writeBuildDiagnostics({ rootDirectory, first, second, error, failureStage, buildResults })
    throw error
  }
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isCli) {
  try {
    await checkBuildDeterminism()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
