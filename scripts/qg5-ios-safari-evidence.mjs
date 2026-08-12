import { createHash } from 'node:crypto'
import { lstat, readFile, realpath, stat } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const schemaVersion = 'qg5-ios-safari-evidence.v1'
const fullSha = /^[0-9a-f]{40}$/
const allowedTouchMethods = new Set(['physical-finger-touch', 'physical-apple-pencil-touch', 'physical-interruption'])
const artifactMimeTypes = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.mov': 'video/quicktime',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.webm': 'video/webm',
  '.webp': 'image/webp'
}

const requireValue = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required`)
}

const requireTrue = (value, label) => {
  if (value !== true) throw new Error(`${label} must be true`)
}

const requirePassedTask = (task, name) => {
  if (!task || task.status !== 'passed') throw new Error(`${name} must be present and passed`)
  requireValue(task.route, `${name}.route`)
  if (!allowedTouchMethods.has(task.method)) throw new Error(`${name}.method must be a physical touch method`)
  if (!Array.isArray(task.artifacts) || task.artifacts.length === 0) throw new Error(`${name}.artifacts is required`)
}

const requireTaskMedia = (task, name, artifactsByPath) => {
  const media = task.artifacts.map((artifactPath) => artifactsByPath.get(artifactPath))
  const screenshots = new Set(media.filter((artifact) => artifact?.kind === 'screenshot').map((artifact) => artifact.path))
  const videos = new Set(media.filter((artifact) => artifact?.kind === 'video').map((artifact) => artifact.path))
  if (screenshots.size < 2 || videos.size < 1) throw new Error(`${name} requires at least two distinct screenshots and one video`)
}

const resolveArtifact = (artifactRoot, artifactPath) => {
  if (path.isAbsolute(artifactPath)) throw new Error(`artifact path must be relative: ${artifactPath}`)
  const resolvedRoot = path.resolve(artifactRoot)
  const resolved = path.resolve(resolvedRoot, artifactPath)
  const relative = path.relative(resolvedRoot, resolved)
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`artifact escapes evidence directory: ${artifactPath}`)
  return resolved
}

const validateArtifact = async (artifact, artifactRoot) => {
  requireValue(artifact?.path, 'artifact.path')
  if (!['screenshot', 'video'].includes(artifact.kind)) throw new Error(`${artifact.path}.kind is invalid`)
  const expectedMimeType = artifactMimeTypes[path.extname(artifact.path).toLowerCase()]
  const expectedKind = expectedMimeType?.startsWith('image/') ? 'screenshot' : expectedMimeType?.startsWith('video/') ? 'video' : undefined
  if (!expectedMimeType || artifact.mimeType !== expectedMimeType || artifact.kind !== expectedKind) throw new Error(`${artifact.path}.mimeType does not match its kind and extension`)
  if (!Number.isInteger(artifact.bytes) || artifact.bytes <= 0) throw new Error(`${artifact.path}.bytes must be positive`)
  if (!/^[0-9a-f]{64}$/.test(artifact.sha256 ?? '')) throw new Error(`${artifact.path}.sha256 is invalid`)
  const resolved = resolveArtifact(artifactRoot, artifact.path)
  const linkMetadata = await lstat(resolved).catch(() => null)
  if (linkMetadata?.isSymbolicLink()) throw new Error(`artifact must not be a symbolic link: ${artifact.path}`)
  const [realRoot, realArtifact] = await Promise.all([realpath(artifactRoot), realpath(resolved).catch(() => null)])
  if (!realArtifact) throw new Error(`artifact is missing: ${artifact.path}`)
  const realRelative = path.relative(realRoot, realArtifact)
  if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) throw new Error(`artifact escapes evidence directory: ${artifact.path}`)
  const metadata = await stat(resolved).catch(() => null)
  if (!metadata?.isFile()) throw new Error(`artifact is missing: ${artifact.path}`)
  if (metadata.size !== artifact.bytes) throw new Error(`${artifact.path} byte size mismatch`)
  const content = await readFile(resolved)
  const digest = createHash('sha256').update(content).digest('hex')
  if (digest !== artifact.sha256) throw new Error(`${artifact.path} SHA-256 mismatch`)
}

export const validateIosSafariEvidence = async (evidence, { expectedCommit, expectedRepository, expectedBranch, artifactRoot }) => {
  if (evidence?.schemaVersion !== schemaVersion) throw new Error(`unsupported schemaVersion: ${evidence?.schemaVersion ?? 'missing'}`)
  requireValue(evidence.evidenceId, 'evidenceId')
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(evidence.evidenceId)) throw new Error('evidenceId must be a safe single-path identifier')
  if (evidence.status !== 'passed') throw new Error('evidence status must be passed')
  if (!fullSha.test(expectedCommit ?? '')) throw new Error('expectedCommit must be a full 40-character SHA')
  if (!fullSha.test(evidence.commit?.sha ?? '')) throw new Error('commit.sha must be a full 40-character SHA')
  if (evidence.commit.sha !== expectedCommit) throw new Error('evidence commit does not match reviewed commit')
  requireValue(expectedRepository, 'expectedRepository')
  requireValue(expectedBranch, 'expectedBranch')
  if (evidence.commit.repository !== expectedRepository) throw new Error('evidence repository does not match reviewed repository')
  if (evidence.commit.branch !== expectedBranch) throw new Error('evidence branch does not match reviewed branch')

  const environment = evidence.environment ?? {}
  if (environment.browserMode !== 'physical-device') throw new Error('environment.browserMode must be physical-device')
  if (environment.osName !== 'iOS') throw new Error('environment.osName must be iOS')
  if (environment.browserName !== 'Safari') throw new Error('environment.browserName must be Safari')
  for (const field of ['deviceModel', 'deviceIdentifier', 'osVersion', 'osBuild', 'browserVersion', 'baseUrl', 'timezone']) {
    requireValue(environment[field], `environment.${field}`)
  }

  const session = evidence.session ?? {}
  const startedAt = Date.parse(session.startedAt)
  const endedAt = Date.parse(session.endedAt)
  if (!Number.isFinite(startedAt) || !Number.isFinite(endedAt) || !/[+-]\d\d:\d\d$|Z$/.test(session.startedAt ?? '') || !/[+-]\d\d:\d\d$|Z$/.test(session.endedAt ?? '')) {
    throw new Error('session timestamps must be ISO 8601 values with timezone')
  }
  if (endedAt < startedAt) throw new Error('session.endedAt must not precede session.startedAt')
  requireValue(session.operator?.name, 'session.operator.name')
  requireValue(session.operator?.account, 'session.operator.account')
  requireValue(session.procedureVersion, 'session.procedureVersion')

  const tasks = evidence.tasks ?? {}
  requirePassedTask(tasks.dndTrustedTouchSort, 'dndTrustedTouchSort')
  if (tasks.dndTrustedTouchSort.method !== 'physical-finger-touch') throw new Error('dndTrustedTouchSort.method must be physical-finger-touch')
  if (!Array.isArray(tasks.dndTrustedTouchSort.beforeOrder) || !Array.isArray(tasks.dndTrustedTouchSort.afterOrder)) {
    throw new Error('dndTrustedTouchSort beforeOrder and afterOrder are required')
  }
  if (JSON.stringify(tasks.dndTrustedTouchSort.beforeOrder) === JSON.stringify(tasks.dndTrustedTouchSort.afterOrder)) {
    throw new Error('dndTrustedTouchSort must record an observable order change')
  }
  for (const field of ['handleUsed', 'sortCommitted', 'overlayVisibleDuringDrag', 'overlayRemovedAfterTouchEnd']) {
    requireTrue(tasks.dndTrustedTouchSort.observed?.[field], `dndTrustedTouchSort.${field}`)
  }

  requirePassedTask(tasks.bodyScroll, 'bodyScroll')
  if (tasks.bodyScroll.method !== 'physical-finger-touch') throw new Error('bodyScroll.method must be physical-finger-touch')
  if (!Number.isFinite(tasks.bodyScroll.beforeScrollTop) || !Number.isFinite(tasks.bodyScroll.afterScrollTop) || tasks.bodyScroll.afterScrollTop <= tasks.bodyScroll.beforeScrollTop) {
    throw new Error('bodyScroll must record an increased scrollTop')
  }
  requireTrue(tasks.bodyScroll.orderUnchanged, 'bodyScroll.orderUnchanged')

  requirePassedTask(tasks.splitterResize, 'splitterResize')
  if (tasks.splitterResize.method !== 'physical-finger-touch') throw new Error('splitterResize.method must be physical-finger-touch')
  if (!Array.isArray(tasks.splitterResize.beforeSizes) || !Array.isArray(tasks.splitterResize.afterSizes) || tasks.splitterResize.beforeSizes.length !== tasks.splitterResize.afterSizes.length) {
    throw new Error('splitterResize beforeSizes and afterSizes must have matching lengths')
  }
  if (JSON.stringify(tasks.splitterResize.beforeSizes) === JSON.stringify(tasks.splitterResize.afterSizes)) {
    throw new Error('splitterResize must record an observable size change')
  }
  requireTrue(tasks.splitterResize.adjustmentCommitted, 'splitterResize.adjustmentCommitted')

  requirePassedTask(tasks.cancelCleanup, 'cancelCleanup')
  for (const field of ['resizeNotCommitted', 'dragShieldRemoved', 'bodyCursorRestored', 'bodyUserSelectRestored', 'subsequentResizeWorks']) {
    requireTrue(tasks.cancelCleanup.observed?.[field], `cancelCleanup.${field}`)
  }

  if (!Array.isArray(evidence.artifacts) || evidence.artifacts.length === 0) throw new Error('artifacts are required')
  if (new Set(evidence.artifacts.map((artifact) => artifact.path)).size !== evidence.artifacts.length) throw new Error('artifact paths must be globally unique')
  const artifactsByPath = new Map(evidence.artifacts.map((artifact) => [artifact.path, artifact]))
  const referenced = Object.values(tasks).flatMap((task) => task.artifacts)
  for (const artifactPath of referenced) {
    if (!artifactsByPath.has(artifactPath)) throw new Error(`task references undeclared artifact: ${artifactPath}`)
  }
  for (const [name, task] of Object.entries(tasks)) requireTaskMedia(task, name, artifactsByPath)
  if (!evidence.artifacts.some((artifact) => artifact.kind === 'video')) throw new Error('at least one session video is required')
  await Promise.all(evidence.artifacts.map((artifact) => validateArtifact(artifact, artifactRoot)))

  requireValue(evidence.review?.reviewer, 'review.reviewer')
  if (!Number.isFinite(Date.parse(evidence.review?.reviewedAt))) throw new Error('review.reviewedAt is invalid')
  requireValue(evidence.review?.notes, 'review.notes')

  return {
    ok: true,
    evidenceId: evidence.evidenceId,
    commit: evidence.commit.sha,
    taskCount: 4,
    artifactCount: evidence.artifacts.length
  }
}

const runCli = async () => {
  const args = process.argv.slice(2)
  const inputIndex = args.indexOf('--input')
  const shaIndex = args.indexOf('--sha')
  const repositoryIndex = args.indexOf('--repository')
  const branchIndex = args.indexOf('--branch')
  if ([inputIndex, shaIndex, repositoryIndex, branchIndex].some((index) => index < 0) || !args[inputIndex + 1] || !args[shaIndex + 1] || !args[repositoryIndex + 1] || !args[branchIndex + 1]) {
    throw new Error('usage: node scripts/qg5-ios-safari-evidence.mjs --input <evidence.json> --sha <commit-sha> --repository <owner/repo> --branch <branch>')
  }
  const input = path.resolve(args[inputIndex + 1])
  const evidence = JSON.parse(await readFile(input, 'utf8'))
  const result = await validateIosSafariEvidence(evidence, {
    expectedCommit: args[shaIndex + 1],
    expectedRepository: args[repositoryIndex + 1],
    expectedBranch: args[branchIndex + 1],
    artifactRoot: path.join(path.dirname(input), evidence.evidenceId)
  })
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  runCli().catch((error) => {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  })
}
