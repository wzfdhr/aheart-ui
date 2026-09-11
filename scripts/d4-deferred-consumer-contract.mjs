import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { cp, mkdir, readFile, readdir, rename, stat, writeFile } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value)
    for (const child of Object.values(value)) freeze(child)
  }
  return value
}

export const RELEASE_MATRIX = freeze({
  counts: [1000, 5000, 10000],
  rowModes: ['fixed', 'coarse', 'dynamic'],
  measuredRuns: 5,
  warmupRuns: 1,
  scrollSteps: 40,
  maxVirtualRows: 24,
  maxFirstInteractionMs: 500,
  maxVirtualRatio: 0.5,
  maxLongTaskMs: 100,
  maxCls: 0.1,
  maxGzipDeltaBytes: 12 * 1024,
})

export const PINNED_VERSIONS = freeze({
  node: '24.17.0',
  pnpm: '9.15.4',
  vue: '3.5.38',
  vite: '5.0.12',
  playwright: '1.61.1',
  typescript: '5.3.3',
})

export const COMPONENTS = freeze(['Tree', 'TreeSelect', 'Cascader'])
export const BROWSERS = freeze(['chromium', 'firefox', 'webkit'])
export const APPROVED_BASELINE_COMMIT = '4a7511f9594d0a74906e427e158d02343ba33a22'
export function expectedAlternatingOrder() { return Array.from({ length: RELEASE_MATRIX.measuredRuns }, (_, round) => round % 2 === 0 ? ['full', 'virtual'] : ['virtual', 'full']).flat() }

const keyFor = (component, count, rowMode) => `${component}/${count}/${rowMode}`
const median = values => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const json = value => JSON.stringify(value)

async function durableFileManifest(directory, destination) {
  const files = []
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) await walk(full)
      else files.push(full)
    }
  }
  await walk(directory)
  const descriptors = []
  for (const file of files.sort()) {
    const bytes = await readFile(file)
    descriptors.push({ path: file, relativePath: path.relative(directory, file).split(path.sep).join('/'), bytes: bytes.length, sha256: sha256(bytes) })
  }
  await writeFile(destination, `${JSON.stringify({ files: descriptors }, null, 2)}\n`)
  const lines = descriptors.map(file => `${file.relativePath}=${file.sha256}`).sort().join('\n')
  return { descriptors, fingerprint: sha256(Buffer.from(lines)) }
}

/**
 * Copy all release inputs into durable evidence and bind every descriptor to
 * bytes that can be reopened after the temporary consumer is removed.  The
 * helper is deliberately data-oriented so preflight and full collection share
 * exactly the same artifact contract.
 */
export async function prepareFullArtifactBindings(report, options = {}) {
  const {
    artifactDirectory,
    runDir,
    baselineTarball,
    candidateTarball,
    baselineManifestPath,
    candidateManifestPath,
    candidateBuildDirectory,
    baselineBuildDirectory,
    candidateModulePath,
    baselineModulePath,
    candidateLockPath,
    baselineLockPath,
    collectorSourcePath,
  } = options
  assert(artifactDirectory && runDir, 'durable artifactDirectory and runDir are required')
  assert(baselineTarball && candidateTarball, 'baseline and candidate tarballs are required')
  assert(baselineManifestPath && candidateManifestPath, 'baseline and candidate manifests are required')
  assert(candidateBuildDirectory && candidateModulePath && candidateLockPath, 'candidate build/module/lock paths are required')
  assert(baselineBuildDirectory && baselineModulePath && baselineLockPath, 'baseline build/module/lock paths are required')
  await mkdir(artifactDirectory, { recursive: true })
  await mkdir(runDir, { recursive: true })
  const copy = async (source, name) => {
    const destination = path.join(artifactDirectory, name)
    await cp(source, destination, { recursive: true })
    return destination
  }
  const baselinePackagePath = await copy(baselineTarball, 'baseline.tgz')
  const candidatePackagePath = await copy(candidateTarball, 'candidate.tgz')
  const baselineManifest = await copy(baselineManifestPath, 'baseline-manifest.json')
  const candidateManifest = await copy(candidateManifestPath, 'candidate-manifest.json')
  const buildDirectory = path.join(artifactDirectory, 'dist')
  await cp(candidateBuildDirectory, buildDirectory, { recursive: true })
  const buildManifestPath = path.join(artifactDirectory, 'dist-files.json')
  const build = await durableFileManifest(buildDirectory, buildManifestPath)
  const baselineBuildDirectoryDurable = path.join(artifactDirectory, 'baseline-dist')
  await cp(baselineBuildDirectory, baselineBuildDirectoryDurable, { recursive: true })
  const baselineBuildManifestPath = path.join(artifactDirectory, 'baseline-dist-files.json')
  const baselineBuild = await durableFileManifest(baselineBuildDirectoryDurable, baselineBuildManifestPath)
  const modulePath = await copy(candidateModulePath, 'module-index.js')
  const baselineModulePathDurable = await copy(baselineModulePath, 'baseline-module-index.js')
  const lockPath = await copy(candidateLockPath, 'pnpm-lock.yaml')
  const baselineLockPathDurable = await copy(baselineLockPath, 'baseline-pnpm-lock.yaml')
  const moduleHash = sha256(await readFile(modulePath))
  const baselineModuleHash = sha256(await readFile(baselineModulePathDurable))
  const lockHash = sha256(await readFile(lockPath))
  const baselineLockHash = sha256(await readFile(baselineLockPathDurable))
  const sourcePath = collectorSourcePath ? path.resolve(collectorSourcePath) : report.collectorSourcePath
  assert(sourcePath, 'collectorSourcePath is required')
  const sourceHash = sha256(await readFile(sourcePath))
  report.artifactDirectory = path.resolve(artifactDirectory)
  report.runDir = path.resolve(runDir)
  report.collectorSourcePath = sourcePath
  report.collectorSourceSha256 = sourceHash
  report.packages ??= {}
  report.packages.baseline ??= {}
  report.packages.candidate ??= {}
  report.packages.baseline.path = baselinePackagePath
  report.packages.baseline.manifestPath = baselineManifest
  report.packages.baseline.sha256 = sha256(await readFile(baselinePackagePath))
  report.packages.baseline.manifestSha256 = sha256(await readFile(baselineManifest))
  report.packages.baseline.modulePath = baselineModulePathDurable
  report.packages.baseline.lockPath = baselineLockPathDurable
  report.packages.baseline.lockfileSha256 = baselineLockHash
  report.packages.baseline.lockfileAfterSha256 = baselineLockHash
  report.packages.baseline.afterHashes = { ...(report.packages.baseline.afterHashes ?? {}), 'es/index.js': baselineModuleHash }
  report.packages.candidate.path = candidatePackagePath
  report.packages.candidate.manifestPath = candidateManifest
  report.packages.candidate.sha256 = sha256(await readFile(candidatePackagePath))
  report.packages.candidate.manifestSha256 = sha256(await readFile(candidateManifest))
  report.packages.candidate.modulePath = modulePath
  report.packages.candidate.lockPath = lockPath
  report.packages.candidate.lockfileSha256 = lockHash
  report.packages.candidate.lockfileAfterSha256 = lockHash
  report.packages.candidate.afterHashes = { ...(report.packages.candidate.afterHashes ?? {}), 'es/index.js': moduleHash }
  report.realEvidenceBinding ??= {}
  report.realEvidenceBinding.buildDirectory = buildDirectory
  report.realEvidenceBinding.buildManifestPath = buildManifestPath
  report.realEvidenceBinding.buildFingerprint = { before: build.fingerprint, after: build.fingerprint }
  report.realEvidenceBinding.baselineBuildDirectory = baselineBuildDirectoryDurable
  report.realEvidenceBinding.baselineBuildManifestPath = baselineBuildManifestPath
  report.realEvidenceBinding.baselineBuildFingerprint = { before: baselineBuild.fingerprint, after: baselineBuild.fingerprint }
  report.realEvidenceBinding.moduleFingerprint = { before: moduleHash, after: moduleHash }
  report.realEvidenceBinding.baselineModuleFingerprint = { before: baselineModuleHash, after: baselineModuleHash }
  report.realEvidenceBinding.lockFingerprint = { before: lockHash, after: lockHash }
  report.realEvidenceBinding.baselineLockFingerprint = { before: baselineLockHash, after: baselineLockHash }
  report.realEvidenceBinding.artifactDirectory = report.artifactDirectory
  report.realEvidenceBinding.sourceKind = 'collected'
  report.gzip ??= { consumer: {} }
  report.gzip.consumer ??= {}
  report.gzip.consumer.moduleProvenance = { baseline: { path: baselineModulePathDurable, sha256: baselineModuleHash }, candidate: { path: modulePath, sha256: moduleHash } }
  return report
}

export function buildFullReportShell({ baseline, candidate, baselineCommit, candidateCommit, runId, preflight = false } = {}) {
  assert(baseline?.packageManifest && candidate?.packageManifest, 'baseline and candidate side results are required')
  return {
    schema: 'd4-deferred-consumer/v1',
    generatedAt: new Date().toISOString(),
    preflight,
    smoke: false,
    acceptanceEligible: false,
    benchmarkExecuted: false,
    syntheticEvidence: false,
    sourceKind: 'collected',
    runId: runId ?? `${preflight ? 'preflight' : 'full'}-${Date.now()}`,
    environment: { ...(candidate.packageManifest.versions ?? {}) },
    matrix: RELEASE_MATRIX,
    fixtures: { deterministic: true, noSourcePreviewCopies: true, tree: { roots: 100, childrenPerRoot: 99, expandedRoots: 100 }, treeSelect: { count: 5000, checkable: true, searchMatchesAtLeast: 5000 }, cascader: { siblings: 10000, deepColumns: 5, optionsPerColumn: 2000, flattenedSearchLeaves: 10000, lazy: true } },
    provenance: { baselineCommit, baselineCommitExpected: APPROVED_BASELINE_COMMIT, candidateCommit, baselineCommitVerified: baselineCommit === APPROVED_BASELINE_COMMIT, candidateCommitVerified: Boolean(candidateCommit), baselineTarballSha256: baseline.packageManifest.sha256, candidateTarballSha256: candidate.packageManifest.sha256 },
    packages: { baseline: baseline.packageManifest, candidate: candidate.packageManifest, sameConsumer: true, installedWithoutWorkspaceLinks: true, lockfileDrift: baseline.packageManifest.lockDependenciesSha256 !== candidate.packageManifest.lockDependenciesSha256, newDependencies: [] },
    performance: { firstInteraction: { full: {}, virtual: {} }, cases: {} },
    cases: {}, browsers: {}, ssrHydration: candidate.ssrHydration ?? { count: 8, combinations: {}, deterministicDoubleRender: true },
    iframe: candidate.iframe ?? { sameOrigin: true, ownerDocument: true, focusTransfer: true, unmountCleanup: true, postUnmountInteractions: 0 },
    gzip: { level: 9, consumer: { components: [...COMPONENTS], publicCss: true, externalizedVue: true, minifier: 'vite/esbuild', entry: 'bundle-entry.mjs', config: { vite: PINNED_VERSIONS.vite, mode: 'production' }, moduleProvenance: { baseline: { path: baseline.packageManifest.modulePath, sha256: baseline.packageManifest.afterHashes?.['es/index.js'] }, candidate: { path: candidate.packageManifest.modulePath, sha256: candidate.packageManifest.afterHashes?.['es/index.js'] } } }, baseline: { files: [], rawBytes: 0, gzipBytes: 0 }, candidate: { files: [], rawBytes: 0, gzipBytes: 0 }, deltaBytes: 0, limitBytes: RELEASE_MATRIX.maxGzipDeltaBytes },
    familyCoverage: candidate.familyCoverage ?? {},
  }
}

export async function validateFullPreflightReport(report, options = {}) {
  assert.equal(report?.preflight, true, 'full preflight report must set preflight=true')
  assert.equal(report?.smoke, false, 'full preflight report must not be smoke')
  assert.equal(report?.acceptanceEligible, false, 'full preflight report is release-ineligible')
  assert.equal(report?.benchmarkExecuted, false, 'full preflight must not execute benchmark matrix')
  assert.equal(report?.performance?.status, 'notRun', 'full preflight performance must be notRun')
  assert.deepEqual(Object.keys(report?.cases ?? {}), [], 'full preflight must not carry benchmark cases')
  assert.deepEqual(Object.keys(report?.performance?.cases ?? {}), [], 'full preflight must not carry performance cases')
  assert.deepEqual(Object.keys(report?.browsers ?? {}), [], 'full preflight must not carry browser benchmark evidence')
  assert.equal(report?.sourceKind, 'collected', 'full preflight report must come from collected evidence')
  assert(report?.artifactDirectory && report?.runDir, 'full preflight durable descriptors are required')
  assert(report?.realEvidenceBinding?.buildManifestPath, 'full preflight build manifest is required')
  assert(report?.packages?.baseline?.path && report?.packages?.candidate?.path, 'full preflight package descriptors are required')
  await verifyArtifactBindings(report, options)
  return { status: report.releaseFormat?.validatorStatus ?? 'validated-ineligible', acceptanceEligible: report.acceptanceEligible, performance: report.performance.status }
}

export async function verifyArtifactBindings(report, { reportPath } = {}) {
  const failures = []
  const base = reportPath ? path.dirname(path.resolve(reportPath)) : process.cwd()
  const resolve = value => value && (path.isAbsolute(value) ? value : path.resolve(base, value))
  const verifyHash = async (label, file, expected) => {
    try { const bytes = await readFile(resolve(file)); ensure(Boolean(expected) && sha256(bytes) === expected, `${label} reopened hash mismatch`, failures) } catch (error) { failures.push(error.code === 'ENOENT' ? `${label} artifact path does not exist` : `${label} artifact cannot be reopened: ${error.message}`) }
  }
  await verifyHash('collector source', report.collectorSourcePath, report.collectorSourceSha256)
  for (const side of ['baseline', 'candidate']) {
    const pkg = report.packages?.[side]
    await verifyHash(`${side} tarball`, pkg?.path, pkg?.sha256)
    await verifyHash(`${side} manifest`, pkg?.manifestPath, pkg?.manifestSha256)
    if (pkg?.modulePath) {
      const moduleFingerprint = side === 'candidate' ? report.realEvidenceBinding?.moduleFingerprint : report.realEvidenceBinding?.baselineModuleFingerprint
      await verifyHash(`${side} module`, pkg.modulePath, pkg?.afterHashes?.['es/index.js'])
      if (moduleFingerprint) { const moduleHash = sha256(await readFile(resolve(pkg.modulePath))); ensure(moduleHash === moduleFingerprint.before && moduleHash === moduleFingerprint.after, `${side} module fingerprint before/after mismatch`, failures) }
    }
    if (pkg?.lockPath) {
      await verifyHash(`${side} lock`, pkg.lockPath, pkg.lockfileSha256)
      const lockFingerprint = side === 'candidate' ? report.realEvidenceBinding?.lockFingerprint : report.realEvidenceBinding?.baselineLockFingerprint
      if (lockFingerprint) { const lockHash = sha256(await readFile(resolve(pkg.lockPath))); ensure(lockHash === lockFingerprint.before && lockHash === lockFingerprint.after, `${side} lock fingerprint before/after mismatch`, failures) }
    }
  }
  const moduleProvenance = report.gzip?.consumer?.moduleProvenance
  const moduleProvenanceSha256 = report.gzip?.consumer?.moduleProvenanceSha256
  const requireModuleProvenance = report.preflight === true || (report.acceptanceEligible === true && String(report.runId ?? '').startsWith('full-'))
  if (moduleProvenance && requireModuleProvenance) {
    for (const side of ['baseline', 'candidate']) {
      const descriptor = moduleProvenance[side]
      try {
        const descriptorPath = typeof descriptor === 'string' ? descriptor : descriptor?.path
        const descriptorHash = typeof descriptor === 'string' ? moduleProvenanceSha256?.[side] : descriptor?.sha256
        ensure(descriptorPath && descriptorHash, `${side} gzip module provenance is incomplete`, failures)
        const moduleHash = sha256(await readFile(resolve(descriptorPath)))
        ensure(moduleHash === descriptorHash, `${side} gzip module provenance hash mismatch`, failures)
        ensure(moduleHash === sha256(await readFile(resolve(report.packages?.[side]?.modulePath))), `${side} gzip module provenance path mismatch`, failures)
      } catch (error) { failures.push(`${side} gzip module provenance cannot be reopened: ${error.message}`) }
    }
  }
  for (const prefix of ['baseline', 'candidate']) {
    const manifestPath = report.realEvidenceBinding?.[`${prefix}BuildManifestPath`]
    const buildDirectory = report.realEvidenceBinding?.[`${prefix}BuildDirectory`]
    const fingerprintPair = report.realEvidenceBinding?.[`${prefix}BuildFingerprint`]
    if (manifestPath || buildDirectory || fingerprintPair) {
      try {
        ensure(manifestPath && buildDirectory && fingerprintPair, `${prefix} build manifest descriptors are incomplete`, failures)
        const manifest = JSON.parse(await readFile(resolve(manifestPath), 'utf8'))
        const listed = new Set()
        const lines = []
        for (const file of manifest.files ?? []) { ensure(!listed.has(file.relativePath), `duplicate ${prefix} build file in manifest: ${file.relativePath}`, failures); listed.add(file.relativePath); const bytes = await readFile(resolve(file.path)); const hash = sha256(bytes); ensure(hash === file.sha256 && bytes.length === file.bytes, `${prefix} build file hash/bytes mismatch: ${file.relativePath}`, failures); lines.push(`${file.relativePath}=${hash}`) }
        const actual = []
        async function walk(dir) { for (const entry of await readdir(dir, { withFileTypes: true })) { const full = path.join(dir, entry.name); if (entry.isDirectory()) await walk(full); else actual.push(path.relative(resolve(buildDirectory), full).split(path.sep).join('/')) } }
        await walk(resolve(buildDirectory))
        ensure(JSON.stringify(actual.sort()) === JSON.stringify([...listed].sort()), `${prefix} build manifest file set does not exactly cover durable dist`, failures)
        const fingerprint = sha256(Buffer.from(lines.sort().join('\n')))
        ensure(fingerprint === fingerprintPair.before && fingerprint === fingerprintPair.after, `${prefix} build fingerprint before/after mismatch`, failures)
      } catch (error) { failures.push(`${prefix} build manifest cannot be reopened: ${error.message}`) }
    }
  }
  const buildManifestPath = report.realEvidenceBinding?.buildManifestPath
  if (!buildManifestPath) {
    failures.push('build manifest path is required for collected artifact verification')
  } else {
    try {
      const manifest = JSON.parse(await readFile(resolve(buildManifestPath), 'utf8'))
      const lines = []
      const listed = new Set()
      for (const file of manifest.files ?? []) { ensure(!listed.has(file.relativePath), `duplicate build file in manifest: ${file.relativePath}`, failures); listed.add(file.relativePath); const bytes = await readFile(resolve(file.path)); const hash = sha256(bytes); ensure(hash === file.sha256 && bytes.length === file.bytes, `build file hash/bytes mismatch: ${file.relativePath}`, failures); lines.push(`${file.relativePath}=${hash}`) }
      const actual = []
      async function walk(dir) { for (const entry of await readdir(dir, { withFileTypes: true })) { const full = path.join(dir, entry.name); if (entry.isDirectory()) await walk(full); else actual.push(path.relative(resolve(report.realEvidenceBinding.buildDirectory), full).split(path.sep).join('/')) } }
      await walk(resolve(report.realEvidenceBinding.buildDirectory))
      ensure(JSON.stringify(actual.sort()) === JSON.stringify([...listed].sort()), 'build manifest file set does not exactly cover durable dist', failures)
      const fingerprint = sha256(Buffer.from(lines.sort().join('\n')))
      ensure(fingerprint === report.realEvidenceBinding.buildFingerprint?.before && fingerprint === report.realEvidenceBinding.buildFingerprint?.after, 'build fingerprint before/after mismatch', failures)
    } catch (error) { failures.push(`build manifest cannot be reopened: ${error.message}`) }
  }
  ensure(report.realEvidenceBinding?.moduleFingerprint?.before === report.realEvidenceBinding?.moduleFingerprint?.after, 'module fingerprint before/after mismatch', failures)
  ensure(report.packages?.candidate?.lockfileSha256 === report.packages?.candidate?.lockfileAfterSha256, 'lock fingerprint before/after mismatch', failures)
  if (report.packages?.baseline?.lockfileSha256 || report.packages?.baseline?.lockfileAfterSha256) ensure(report.packages?.baseline?.lockfileSha256 === report.packages?.baseline?.lockfileAfterSha256, 'baseline lock fingerprint before/after mismatch', failures)
  if (report.runDir) { try { ensure((await stat(resolve(report.runDir))).isDirectory(), 'collector runDir is not durable', failures) } catch (error) { failures.push(`collector runDir cannot be reopened: ${error.message}`) } }
  if (failures.length) { const error = new Error(`D4 artifact binding verification failed: ${failures.join('; ')}`); error.failures = failures; throw error }
  return { status: 'passed', failures: [] }
}

export async function finalizeFullReport(report, output) {
  report.releaseFormat ??= { collectorSourcePath: report.collectorSourcePath }
  report.releaseFormat.validatorStatus = 'validating'
  await mkdir(path.dirname(output), { recursive: true })
  const validating = `${output}.validating`
  await writeFile(validating, `${JSON.stringify(report, null, 2)}\n`)
  await verifyArtifactBindings(report, { reportPath: validating })
  validateReport(report, { requireRelease: true, allowValidationPhase: true })
  report.releaseFormat.validatorStatus = 'passed'
  await writeFile(validating, `${JSON.stringify(report, null, 2)}\n`)
  await rename(validating, output)
  const reopened = JSON.parse(await readFile(output, 'utf8'))
  await verifyArtifactBindings(reopened, { reportPath: output })
  validateReport(reopened, { requireRelease: true })
  return reopened
}

function deterministicSeed(value) {
  let hash = 2166136261
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/**
 * The production fixture intentionally does not mirror any source-preview
 * fixture. It is a data generator for the packed consumer only: the actual
 * browser runner mounts these records through the public package API.
 */
export function generateTree(count, { expandedRoots = 100 } = {}) {
  assert(Number.isSafeInteger(count) && count >= 1)
  const nodes = []
  if (count === 10000) {
    for (let root = 0; root < expandedRoots; root++) {
      const rootKey = `tree-root-${root}`
      nodes.push({ key: rootKey, label: `Tree root ${root}`, children: Array.from({ length: 99 }, (_, child) => ({ key: `${rootKey}/child-${child}`, label: `Child ${root}.${child}` })) })
    }
    return nodes
  }
  const rootCount = Math.min(count, Math.max(1, Math.ceil(count / 20)))
  for (let root = 0; root < rootCount && nodes.length < count; root++) {
    const rootKey = `tree-${count}-root-${root}`
    nodes.push({ key: rootKey, label: `Tree ${count} root ${root}` })
  }
  return nodes
}

export function generateTreeSelect(count) {
  return { nodes: generateTree(count), checkable: true, query: `Tree ${count}` }
}

export function generateCascader(count) {
  const siblings = Array.from({ length: count }, (_, index) => ({ value: `cascade-${count}-sibling-${index}`, label: `Sibling ${index}` }))
  const columns = Array.from({ length: 5 }, (_, depth) => Array.from({ length: 2000 }, (_, index) => ({ value: `cascade-depth-${depth}-option-${index}`, label: `Depth ${depth} option ${index}` })))
  const searchLeaves = Array.from({ length: 10000 }, (_, index) => ({ path: [`search-${Math.floor(index / 100)}`, `leaf-${index}`], label: `Search leaf ${index}` }))
  return { siblings, columns, searchLeaves }
}

export function generateFixture(component, count, rowMode) {
  assert(COMPONENTS.includes(component))
  assert(RELEASE_MATRIX.counts.includes(count))
  assert(RELEASE_MATRIX.rowModes.includes(rowMode))
  const seed = deterministicSeed(`${component}:${count}:${rowMode}`)
  const rowHeight = rowMode === 'coarse' ? 44 : rowMode === 'dynamic' ? undefined : 28
  const rows = Array.from({ length: Math.min(count, 120) }, (_, index) => ({
    key: `${component.toLowerCase()}-${count}-${rowMode}-${index}`,
    label: rowMode === 'dynamic' && index % 10 === 0 ? `${component} row ${index} wrapped label ${seed}` : `${component} row ${index}`,
    expectedHeight: rowHeight ?? (index % 10 === 0 ? 56 : 28),
  }))
  return {
    component,
    count,
    rowMode,
    rows,
    data: component === 'Tree' ? generateTree(count) : component === 'TreeSelect' ? generateTreeSelect(count) : generateCascader(count),
    semantics: component === 'TreeSelect' ? { checkable: true, searchMatchesAtLeast: 5000 } : component === 'Cascader' ? { deepColumns: 5, searchLeaves: 10000 } : { expandedRoots: count === 10000 ? 100 : 0 },
  }
}

function packageManifest(label, packagePath) {
  const content = Buffer.from(`d4-${label}-manifest\n`)
  return {
    path: packagePath,
    manifestPath: `${packagePath}.manifest.json`,
    manifestSha256: sha256(content),
    modulePath: `${packagePath}.module.js`,
    lockPath: `${packagePath}.lock.yaml`,
    lockfileSha256: sha256(content),
    lockfileAfterSha256: sha256(content),
    buildManifestPath: `${packagePath}.dist-files.json`,
    exists: true,
    sha256: sha256(content),
    clean: true,
    symlinks: [],
    workspaceLinks: [],
    fsImports: [],
    files: ['dist/index.js', 'dist/index.cjs', 'dist/style.css', 'dist/index.d.ts'],
    esm: true,
    cjs: true,
    css: true,
    publicTypes: true,
    ssr: true,
    contentSha256Verified: true,
    tarballSha256Verified: true,
    sourceCommit: label === 'baseline' ? APPROVED_BASELINE_COMMIT : 'candidate-commit',
    afterHashes: { 'es/index.js': sha256(content) },
  }
}

function makeBundle(label, files) {
  return files.map((name, index) => {
    const content = Buffer.from(`d4-${label}-${name}-${index}\n`)
    const compressed = gzipSync(content, { level: 9 })
    return {
      path: name,
      contentBase64: content.toString('base64'),
      rawBytes: content.length,
      rawSha256: sha256(content),
      gzipBytes: compressed.length,
      gzipSha256: sha256(compressed),
    }
  })
}

function makeMode(component, count, rowMode, mode) {
  const base = mode === 'virtual' ? 90 + (count / 10000) * 20 : 300 + (count / 10000) * 70
  const samples = Array.from({ length: RELEASE_MATRIX.measuredRuns }, (_, index) => Math.round(base + ((index * 7 + deterministicSeed(`${component}/${rowMode}`)) % 9) - 4))
  const scroll = Array.from({ length: RELEASE_MATRIX.scrollSteps }, (_, index) => ({
    index,
    direction: index < 20 ? 'forward' : 'reverse',
    offset: index < 20 ? index / 19 : (39 - index) / 19,
    elapsedMs: mode === 'virtual' ? 2 + (index % 3) : 4 + (index % 5),
    mountedRows: mode === 'virtual' ? 18 + (index % 3) : count,
    noBlankGap: true,
    vueFlushed: true,
    animationFrames: 2,
    actualOffset: index < 20 ? index / 19 : (39 - index) / 19,
    timestamp: index + 1,
    rowKeys: [`${component}-${index}`],
    rect: { top: 0, bottom: 38, height: 38 },
    rowRects: [{ top: 0, bottom: 38, height: 38, key: `${component}-${index}`, intersectsViewport: true, pointerEvents: 'auto', nextTickAt: index + 1, rafAt: [index + 2, index + 3] }],
    viewportRect: { top: 0, bottom: 38, height: 38 },
    coverageComplete: true,
  }))
  return {
    warmup: [{ firstInteractionMs: Math.round(base + 20), discarded: true }],
    measured: samples.map(firstInteractionMs => ({ firstInteractionMs })),
    medianMs: median(samples),
    maxRows: mode === 'virtual' ? 21 : count,
    actionableRows: mode === 'virtual' ? 20 : count,
    scroll,
  }
}

function makePerformance() {
  const firstInteraction = { full: {}, virtual: {} }
  const cases = {}
  for (const component of COMPONENTS) {
    firstInteraction.full[component] = {}
    firstInteraction.virtual[component] = {}
    for (const count of RELEASE_MATRIX.counts) {
      firstInteraction.full[component][count] = {}
      firstInteraction.virtual[component][count] = {}
      for (const rowMode of RELEASE_MATRIX.rowModes) {
        const full = makeMode(component, count, rowMode, 'full')
        const virtual = makeMode(component, count, rowMode, 'virtual')
        firstInteraction.full[component][count][rowMode] = { medianMs: full.medianMs }
        firstInteraction.virtual[component][count][rowMode] = { medianMs: virtual.medianMs }
        cases[keyFor(component, count, rowMode)] = {
          component,
          count,
          rowMode,
          alternatingOrder: expectedAlternatingOrder(),
          full,
          virtual,
        }
      }
    }
  }
  return { firstInteraction, cases }
}

function makeBrowsers() {
  return {
    chromium: { browserVersion: 'Chromium (pinned Playwright browser)', ownerRealm: true, twoRaf: true, observersStartedBeforeFirstWrite: true, observersStoppedAfterFinal: true, observersStartedAt: 1, observersStoppedAt: 100, consoleErrors: 0, pageErrors: 0, scrollSteps: 40, resources: { status: 'recorded', scripts: ['aheart-ui/es/index.js'], styles: ['aheart-ui/es/style.css'] }, longTasks: { status: 'recorded', maxMs: 42, entries: [{ startTime: 10, duration: 42 }] }, layoutShifts: { status: 'recorded', cls: 0.02, entries: [{ startTime: 10, value: 0.02 }] } },
    firefox: { browserVersion: 'Firefox (pinned Playwright browser)', ownerRealm: true, twoRaf: true, observersStartedBeforeFirstWrite: true, observersStoppedAfterFinal: true, observersStartedAt: 1, observersStoppedAt: 100, consoleErrors: 0, pageErrors: 0, scrollSteps: 40, resources: { status: 'recorded', scripts: ['aheart-ui/es/index.js'], styles: ['aheart-ui/es/style.css'] }, longTasks: { status: 'unsupported', reason: 'PerformanceObserver longtask is not exposed by this engine' }, layoutShifts: { status: 'unsupported', reason: 'PerformanceObserver layout-shift is not exposed by this engine' } },
    webkit: { browserVersion: 'WebKit (pinned Playwright browser)', ownerRealm: true, twoRaf: true, observersStartedBeforeFirstWrite: true, observersStoppedAfterFinal: true, observersStartedAt: 1, observersStoppedAt: 100, consoleErrors: 0, pageErrors: 0, scrollSteps: 40, resources: { status: 'recorded', scripts: ['aheart-ui/es/index.js'], styles: ['aheart-ui/es/style.css'] }, longTasks: { status: 'unsupported', reason: 'PerformanceObserver longtask is not exposed by this engine' }, layoutShifts: { status: 'unsupported', reason: 'PerformanceObserver layout-shift is not exposed by this engine' } },
  }
}

function makeSsr() {
  const combinations = {}
  for (let mask = 0; mask < 8; mask++) {
    const virtual = COMPONENTS.map((component, index) => [component, Boolean(mask & (1 << index))])
    const key = virtual.map(([component, enabled]) => `${component}=${enabled}`).join(',')
    combinations[key] = { virtual: Object.fromEntries(virtual), deterministic: true, hydrationWarnings: 0, hydrationErrors: 0, bounded: true }
  }
  return { combinations, count: 8, deterministicDoubleRender: true }
}

export function buildAcceptanceFixture({ baselinePackage, candidatePackage, generatedAt = new Date(0).toISOString(), smoke = false } = {}) {
  const performance = makePerformance()
  const baselineFiles = makeBundle('baseline', ['assets/tree.js', 'assets/tree-select.js', 'assets/cascader.js', 'assets/style.css'])
  const candidateFiles = makeBundle('candidate', ['assets/tree.js', 'assets/tree-select.js', 'assets/cascader.js', 'assets/style.css'])
  const total = files => files.reduce((sum, file) => sum + file.gzipBytes, 0)
  const baseline = packageManifest('baseline', baselinePackage ?? '/tmp/d4-baseline.tgz')
  const candidate = packageManifest('candidate', candidatePackage ?? '/tmp/d4-candidate.tgz')
  return {
    schema: 'd4-deferred-consumer/v1',
    generatedAt,
    acceptanceEligible: !smoke,
    smoke,
    syntheticEvidence: true,
    sourceKind: 'collected',
    runId: 'full-test-fixture',
    collectorSourcePath: '/tmp/d4-collector.mjs',
    collectorSourceSha256: 'a'.repeat(64),
    artifactDirectory: '/tmp/d4-artifacts',
    releaseFormat: { validatorStatus: 'passed', collectorSourcePath: '/tmp/d4-collector.mjs' },
    realEvidenceBinding: { tarballReopened: true, buildManifestPath: '/tmp/d4-artifacts.dist-files.json', buildFingerprint: { before: 'b'.repeat(64), after: 'b'.repeat(64) }, moduleFingerprint: { before: 'c'.repeat(64), after: 'c'.repeat(64) }, lockFingerprint: { before: 'd'.repeat(64), after: 'd'.repeat(64) } },
    environment: { ...PINNED_VERSIONS, node: process.version === `v${PINNED_VERSIONS.node}` ? PINNED_VERSIONS.node : PINNED_VERSIONS.node, cpu: 'fixture', concurrency: 1 },
    matrix: RELEASE_MATRIX,
    fixtures: { deterministic: true, noSourcePreviewCopies: true, tree: { roots: 100, childrenPerRoot: 99, expandedRoots: 100 }, treeSelect: { sharedTree: true, checkable: true, queryMatches: 5000 }, cascader: { siblings: 10000, deepColumns: 5, optionsPerColumn: 2000, flattenedSearchLeaves: 10000 }, rowHeights: { fixed: 28, coarse: 44, dynamicEvery: 10 } },
    provenance: { baselineCommit: APPROVED_BASELINE_COMMIT, baselineCommitExpected: APPROVED_BASELINE_COMMIT, candidateCommit: 'candidate-commit', baselineTarballSha256: baseline.sha256, candidateTarballSha256: candidate.sha256, baselineCommitVerified: true, candidateCommitVerified: true },
    packages: { baseline, candidate, sameConsumer: true, installedWithoutWorkspaceLinks: true, lockfileDrift: false, newDependencies: [] },
    performance,
    browsers: makeBrowsers(),
    ssrHydration: makeSsr(),
    iframe: { sameOrigin: true, ownerDocument: true, focusTransfer: true, unmountCleanup: true, postUnmountInteractions: 0 },
    gzip: { level: 9, consumer: { components: [...COMPONENTS], publicCss: true, externalizedVue: true, minifier: 'vite/esbuild', entry: 'bundle-entry.mjs', config: { vite: PINNED_VERSIONS.vite, mode: 'production' }, moduleProvenance: { baseline: '/tmp/baseline/aheart-ui/es/index.js', candidate: '/tmp/candidate/aheart-ui/es/index.js' } }, baseline: { files: baselineFiles, rawBytes: baselineFiles.reduce((sum, file) => sum + file.rawBytes, 0), gzipBytes: total(baselineFiles) }, candidate: { files: candidateFiles, rawBytes: candidateFiles.reduce((sum, file) => sum + file.rawBytes, 0), gzipBytes: total(candidateFiles) }, deltaBytes: total(candidateFiles) - total(baselineFiles), limitBytes: RELEASE_MATRIX.maxGzipDeltaBytes },
    cases: performance.cases,
  }
}

export function buildSmokeReport({ baseline, candidate, generatedAt = new Date().toISOString(), smokeChecks = {}, note = 'Bounded package smoke only; release matrix was not executed.' } = {}) {
  return {
    schema: 'd4-deferred-consumer/v1',
    generatedAt,
    acceptanceEligible: false,
    smoke: true,
    syntheticEvidence: false,
    smokeReason: note,
    environment: { ...PINNED_VERSIONS, cpu: 'recorded by smoke runner', concurrency: 1 },
    matrix: RELEASE_MATRIX,
    fixtures: { deterministic: true, noSourcePreviewCopies: true, status: 'not-run' },
    provenance: { status: 'notRun', baselineCommit: null, candidateCommit: null, baselineTarballSha256: baseline?.sha256 ?? null, candidateTarballSha256: candidate?.sha256 ?? null },
    packages: { baseline: baseline ?? null, candidate: candidate ?? null, sameConsumer: 'notRun', installedWithoutWorkspaceLinks: 'notRun', lockfileDrift: 'notRun', newDependencies: 'notRun' },
    performance: { status: 'not-run', firstInteraction: null, cases: {} },
    browsers: { status: 'not-run' },
    ssrHydration: { status: 'not-run', count: 0, combinations: {} },
    iframe: { status: 'not-run' },
    gzip: { status: 'not-run', level: 9, deltaBytes: null, limitBytes: RELEASE_MATRIX.maxGzipDeltaBytes },
    cases: {},
    smokeChecks,
  }
}

function expectedCaseKeys() {
  return COMPONENTS.flatMap(component => RELEASE_MATRIX.counts.flatMap(count => RELEASE_MATRIX.rowModes.map(rowMode => keyFor(component, count, rowMode))))
}

function ensure(condition, message, failures) {
  if (!condition) failures.push(message)
}

export function recomputeViewportCoverage(step) {
  const viewport = step?.viewportRect
  const rows = [...(step?.rowRects ?? [])].filter(row => Number.isFinite(row.top) && Number.isFinite(row.bottom) && row.bottom > row.top).sort((a, b) => a.top - b.top)
  if (!viewport || !rows.length) return { complete: false, rows: 0 }
  const visible = rows.filter(row => row.bottom >= viewport.top && row.top <= viewport.bottom)
  const complete = visible.length > 0 && visible[0].top <= viewport.top + 1 && visible.at(-1).bottom >= viewport.bottom - 1 && visible.every((row, index) => index === 0 || row.top <= visible[index - 1].bottom + 1)
  return { complete, rows: visible.length, first: visible[0], last: visible.at(-1) }
}

export function recomputeActionability(timing) {
  const rect = timing?.targetRect
  const viewport = timing?.targetViewportRect
  const intersects = rect && viewport && rect.bottom > viewport.top && rect.top < viewport.bottom && rect.right > viewport.left && rect.left < viewport.right
  return Boolean(timing && timing.startedAt < timing.triggerAt && timing.triggerAt < timing.actionableAt && timing.actionableAt <= timing.nextTickAt && timing.nextTickAt <= timing.rafAt?.[0] && timing.rafAt?.[0] <= timing.rafAt?.[1] && timing.endAt === timing.rafAt?.[1] && timing.targetSelectorIncludesTrigger === false && intersects && rect.enabled === true && rect.pointerEvents !== 'none')
}

export function recomputeObserverRounds(rounds) {
  return Array.isArray(rounds) && rounds.length > 0 && rounds.every(round => round.startedAt < round.firstWriteAt && round.lastWriteAt < round.takeRecordsAt && round.takeRecordsAt <= round.drainedAt && round.drainedAt <= round.disconnectedAt && (round.entries ?? []).every(entry => entry.startTime >= round.startedAt && entry.startTime <= round.drainedAt))
}

function recomputeMode(mode, path) {
  const samples = mode?.measured?.map(sample => sample.firstInteractionMs)
  if (!Array.isArray(samples) || samples.length !== RELEASE_MATRIX.measuredRuns || samples.some(value => !Number.isFinite(value))) return { errors: [`${path} measured samples must contain exactly five finite values`] }
  const errors = []
  ensure(mode.warmup?.length === RELEASE_MATRIX.warmupRuns && mode.warmup[0]?.discarded === true, `${path} must have one discarded warmup`, errors)
  ensure(mode.medianMs === median(samples), `${path} median is not recomputed from raw samples`, errors)
  ensure(samples.every(value => value > 0), `${path} measured timings must be positive`, errors)
  ensure(Array.isArray(mode.scroll) && mode.scroll.length === RELEASE_MATRIX.scrollSteps, `${path} must have forty scroll samples`, errors)
  if (Array.isArray(mode.scroll)) {
    ensure(mode.scroll.slice(0, 20).every(step => step.direction === 'forward'), `${path} must have twenty forward scroll steps`, errors)
    ensure(mode.scroll.slice(20).every(step => step.direction === 'reverse'), `${path} must have twenty reverse scroll steps`, errors)
    ensure(mode.scroll.every((step, index) => {
      const expected = index < 20 ? index / 19 : (39 - index) / 19
      return step.vueFlushed === true && step.animationFrames >= 2 && step.noBlankGap === true && recomputeViewportCoverage(step).complete && Number.isFinite(step.offset) && Math.abs(step.offset - expected) < 1e-9 && Number.isFinite(step.actualOffset) && Number.isFinite(step.timestamp) && step.timestamp >= 0 && Array.isArray(step.rowKeys) && step.rowKeys.length > 0 && step.rect && Number.isFinite(step.rect.height) && step.rect.height > 0 && step.elapsedMs > 0 && step.mountedRows > 0 && (mode.maxRows > 24 || step.mountedRows <= RELEASE_MATRIX.maxVirtualRows)
    }), `${path} scroll steps must prove exact endpoints, positive timing and bounded mounted rows`, errors)
  }
  return { errors, medianMs: median(samples) }
}

export function recomputeEvidence(report) {
  const errors = []
  const firstInteraction = { full: {}, virtual: {} }
  for (const key of expectedCaseKeys()) {
    const item = report.cases?.[key]
    ensure(item, `missing matrix case ${key}`, errors)
    if (!item) continue
    ensure(JSON.stringify(item.alternatingOrder) === JSON.stringify(expectedAlternatingOrder()), `${key} measured order is not alternating`, errors)
    for (const modeName of ['full', 'virtual']) {
      const result = recomputeMode(item[modeName], `${key}/${modeName}`)
      errors.push(...result.errors)
      firstInteraction[modeName][item.component] ??= {}
      firstInteraction[modeName][item.component][item.count] ??= {}
      firstInteraction[modeName][item.component][item.count][item.rowMode] = { medianMs: result.medianMs }
    }
  }
  const gzip = {}
  for (const side of ['baseline', 'candidate']) {
    const bundle = report.gzip?.[side]
    ensure(Array.isArray(bundle?.files) && bundle.files.length > 0, `${side} gzip evidence must list files`, errors)
    const files = bundle?.files ?? []
    const names = files.map(file => file.path)
    ensure(new Set(names).size === names.length, `${side} gzip evidence contains duplicate assets`, errors)
    ensure(names.some(name => name.endsWith('.js')) && names.some(name => name.endsWith('.css')) && names.some(name => name.includes('/')), `${side} gzip evidence must include recursive JS/CSS assets`, errors)
    ensure(names.every(name => /\.(?:js|css)$/.test(name) && !name.startsWith('/')), `${side} gzip evidence contains a non-JS/CSS asset`, errors)
    let rawBytes = 0, gzipBytes = 0
    for (const file of files) {
      const content = Buffer.from(file.contentBase64 ?? '', 'base64')
      const compressed = gzipSync(content, { level: 9 })
      ensure(file.rawBytes === content.length && file.rawSha256 === sha256(content), `${side}/${file.path} raw evidence hash mismatch`, errors)
      ensure(file.gzipBytes === compressed.length && file.gzipSha256 === sha256(compressed), `${side}/${file.path} gzip evidence hash mismatch`, errors)
      rawBytes += content.length
      gzipBytes += compressed.length
    }
    ensure(bundle?.rawBytes === rawBytes && bundle?.gzipBytes === gzipBytes, `${side} gzip totals are not recomputed from raw evidence`, errors)
    gzip[side] = { rawBytes, gzipBytes, files: files.map(file => ({ path: file.path, rawBytes: file.rawBytes, gzipBytes: file.gzipBytes, rawSha256: file.rawSha256, gzipSha256: file.gzipSha256 })) }
  }
  gzip.deltaBytes = (gzip.candidate?.gzipBytes ?? 0) - (gzip.baseline?.gzipBytes ?? 0)
  return { firstInteraction, gzip, errors }
}

export function validateReport(report, { requireRelease = false, requireSmokeChecks = false, allowValidationPhase = false } = {}) {
  if (report?.smoke === true && requireSmokeChecks) return validateSmokeReport(report)
  const failures = []
  if (requireRelease && (report?.smoke === true || report?.acceptanceEligible !== true)) {
    throw new Error('D4 deferred consumer contract failed: smoke, ineligible or synthetic provenance reports cannot pass release validation')
  }
  ensure(report?.schema === 'd4-deferred-consumer/v1', 'schema must be d4-deferred-consumer/v1', failures)
  if (requireRelease) {
    const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value)
    ensure(report.releaseFormat?.validatorStatus === 'passed' || (allowValidationPhase && report.releaseFormat?.validatorStatus === 'validating'), 'release validator status must be passed', failures)
    ensure(report.runId !== 'full-test-fixture', 'synthetic full fixture runId cannot pass release validation', failures)
    ensure(report.artifactDirectory, 'durable artifactDirectory is required for release validation', failures)
    ensure(report.releaseFormat?.collectorSourcePath === report.collectorSourcePath, 'collectorSourcePath is required in release format', failures)
    ensure(report.collectorSourcePath, 'collectorSourcePath is required for release validation', failures)
    ensure(report.realEvidenceBinding?.buildManifestPath, 'build manifest is required for release validation', failures)
    ensure(report?.sourceKind === 'collected' && /^(bounded|full)-/.test(report.runId ?? '') && hash(report.collectorSourceSha256) && report?.realEvidenceBinding?.tarballReopened === true && report.realEvidenceBinding.buildManifestPath && hash(report.realEvidenceBinding.buildFingerprint?.before) && hash(report.realEvidenceBinding.buildFingerprint?.after) && hash(report.realEvidenceBinding.moduleFingerprint?.before) && hash(report.realEvidenceBinding.moduleFingerprint?.after), 'release report must carry collected source/run/artifact bindings', failures)
  }
  ensure(report?.syntheticEvidence !== true || requireRelease !== true, 'synthetic fixture provenance cannot pass release validation', failures)
  ensure(report?.provenance?.baselineCommit === APPROVED_BASELINE_COMMIT && report?.provenance?.baselineCommitExpected === APPROVED_BASELINE_COMMIT && report?.provenance?.baselineCommitVerified === true && report?.provenance?.candidateCommitVerified === true, 'baseline/candidate commit provenance is missing or does not match the approved baseline', failures)
  ensure(report?.provenance?.baselineTarballSha256 === report?.packages?.baseline?.sha256 && report?.provenance?.candidateTarballSha256 === report?.packages?.candidate?.sha256, 'tarball hash provenance does not match package manifests', failures)
  ensure(report?.environment && JSON.stringify({ ...PINNED_VERSIONS }) === JSON.stringify(Object.fromEntries(Object.keys(PINNED_VERSIONS).map(key => [key, report.environment[key]]))), 'pinned Node/pnpm/Vue/Vite/Playwright/TypeScript versions are required', failures)
  ensure(typeof report.environment?.cpu === 'string' && report.environment.cpu.trim().length > 0, 'CPU model is required', failures)
  ensure(Number.isSafeInteger(report.environment?.concurrency) && report.environment.concurrency >= 1 && report.environment.concurrency <= 32, 'concurrency must be a positive bounded integer', failures)
  ensure(report?.matrix && JSON.stringify(report.matrix) === JSON.stringify(RELEASE_MATRIX), 'release matrix differs from the approved fixed matrix', failures)
  ensure(report?.fixtures?.deterministic === true && report.fixtures.noSourcePreviewCopies === true, 'fixtures must be deterministic and independent of source-preview fixture shapes', failures)
  ensure(report?.packages?.sameConsumer === true && report.packages.installedWithoutWorkspaceLinks === true, 'baseline and candidate must use the same consumer without workspace links', failures)
  ensure(report.packages.lockfileDrift === false && Array.isArray(report.packages.newDependencies) && report.packages.newDependencies.length === 0, 'consumer lockfile drift or new dependencies are not allowed', failures)
  for (const side of ['baseline', 'candidate']) {
    const pkg = report.packages?.[side]
    ensure(pkg?.clean === true, `${side} package must come from a clean manifest`, failures)
    ensure(pkg?.exists === true, `${side} tarball path must exist and be verified`, failures)
    ensure(pkg?.sha256 && pkg.sha256.length === 64, `${side} tarball SHA-256 is required`, failures)
    ensure(Array.isArray(pkg?.symlinks) && pkg.symlinks.length === 0, `${side} package contains symlinks`, failures)
    ensure(Array.isArray(pkg?.workspaceLinks) && pkg.workspaceLinks.length === 0, `${side} package contains workspace links`, failures)
    ensure(Array.isArray(pkg?.fsImports) && pkg.fsImports.length === 0, `${side} package contains @fs imports`, failures)
    for (const field of ['esm', 'cjs', 'css', 'publicTypes', 'ssr', 'contentSha256Verified', 'tarballSha256Verified']) ensure(pkg?.[field] === true, `${side} package is missing ${field} evidence`, failures)
    ensure(pkg?.sourceCommit === (side === 'baseline' ? APPROVED_BASELINE_COMMIT : report.provenance?.candidateCommit), `${side} package source commit provenance is missing`, failures)
    if (requireRelease) {
      ensure(pkg?.path && pkg?.manifestPath && pkg?.modulePath && pkg?.lockPath && /^[a-f0-9]{64}$/i.test(pkg?.manifestSha256 ?? '') && /^[a-f0-9]{64}$/i.test(pkg?.afterHashes?.['es/index.js'] ?? '') && /^[a-f0-9]{64}$/i.test(pkg?.lockfileSha256 ?? '') && /^[a-f0-9]{64}$/i.test(pkg?.lockfileAfterSha256 ?? ''), `${side} release artifact descriptors are incomplete`, failures)
      ensure(/^[a-f0-9]{64}$/i.test(pkg?.lockfileAfterSha256 ?? ''), `${side} lockfileAfter fingerprint is required`, failures)
      if (String(report.runId).startsWith('full-')) ensure(existsSync(pkg?.path) && existsSync(pkg?.manifestPath) && existsSync(pkg?.modulePath) && existsSync(pkg?.lockPath), `${side} release artifact path does not exist`, failures)
    }
  }
  const recomputed = recomputeEvidence(report)
  failures.push(...recomputed.errors)
  ensure(JSON.stringify(recomputed.firstInteraction) === JSON.stringify(report.performance?.firstInteraction), 'first interaction evidence differs from recomputed raw samples', failures)
  ensure(JSON.stringify(recomputed.gzip) === JSON.stringify({ baseline: report.gzip?.baseline && { rawBytes: report.gzip.baseline.rawBytes, gzipBytes: report.gzip.baseline.gzipBytes, files: report.gzip.baseline.files.map(file => ({ path: file.path, rawBytes: file.rawBytes, gzipBytes: file.gzipBytes, rawSha256: file.rawSha256, gzipSha256: file.gzipSha256 })) }, candidate: report.gzip?.candidate && { rawBytes: report.gzip.candidate.rawBytes, gzipBytes: report.gzip.candidate.gzipBytes, files: report.gzip.candidate.files.map(file => ({ path: file.path, rawBytes: file.rawBytes, gzipBytes: file.gzipBytes, rawSha256: file.rawSha256, gzipSha256: file.gzipSha256 })) }, deltaBytes: report.gzip?.deltaBytes }), 'gzip evidence differs from recomputed raw files', failures)
  for (const key of expectedCaseKeys()) {
    const item = report.cases?.[key]
    if (!item) continue
    const virtual = item.virtual
    ensure(virtual.maxRows <= RELEASE_MATRIX.maxVirtualRows && virtual.actionableRows <= RELEASE_MATRIX.maxVirtualRows, `${key} virtual window exceeds 24 actionable rows`, failures)
    ensure(virtual.medianMs <= RELEASE_MATRIX.maxFirstInteractionMs, `${key} virtual first interaction exceeds 500ms`, failures)
    if (item.count === 10000) ensure(virtual.medianMs <= item.full.medianMs * RELEASE_MATRIX.maxVirtualRatio, `${key} virtual median is above fifty percent of full path`, failures)
  }
  for (const browser of BROWSERS) {
    const item = report.browsers?.[browser]
    if (!item) {
      ensure(false, `${browser} browser evidence is missing`, failures)
      continue
    }
    ensure(item?.browserVersion, `${browser} browser build is missing`, failures)
    ensure(item?.ownerRealm === true && item.twoRaf === true && item.observersStartedBeforeFirstWrite === true && item.observersStoppedAfterFinal === true && item.scrollSteps === 40 && item.consoleErrors === 0 && item.pageErrors === 0, `${browser} scroll/realm/error observer contract is incomplete`, failures)
    ensure(Number.isFinite(item.observersStartedAt) && Number.isFinite(item.observersStoppedAt) && item.observersStoppedAt >= item.observersStartedAt, `${browser} observer lifecycle timestamps are missing`, failures)
    ensure(item.resources?.status === 'recorded' && item.resources.scripts?.length > 0 && item.resources.styles?.length > 0, `${browser} resource evidence is missing`, failures)
    if (browser === 'chromium') {
      ensure(item.longTasks?.status === 'recorded' && item.longTasks.maxMs <= RELEASE_MATRIX.maxLongTaskMs && Array.isArray(item.longTasks.entries) && item.longTasks.entries.every(entry => Number.isFinite(entry.startTime) && Number.isFinite(entry.duration)), 'Chromium long-task observer is missing raw timestamp entries or over 100ms', failures)
      ensure(item.layoutShifts?.status === 'recorded' && item.layoutShifts.cls <= RELEASE_MATRIX.maxCls && Array.isArray(item.layoutShifts.entries) && item.layoutShifts.entries.every(entry => Number.isFinite(entry.startTime) && Number.isFinite(entry.value)), 'Chromium layout-shift observer is missing raw timestamp entries or over 0.1', failures)
    } else {
      ensure(item.longTasks?.status === 'unsupported' && item.longTasks.reason, `${browser} long-task metrics must be explicitly unsupported`, failures)
      ensure(item.layoutShifts?.status === 'unsupported' && item.layoutShifts.reason, `${browser} layout-shift metrics must be explicitly unsupported`, failures)
    }
  }
  ensure(report.ssrHydration?.count === 8 && Object.keys(report.ssrHydration.combinations ?? {}).length === 8 && report.ssrHydration.deterministicDoubleRender === true, 'SSR/hydration must cover eight deterministic boolean combinations', failures)
  const ssrItems = Object.values(report.ssrHydration?.combinations ?? {})
  ensure(new Set(ssrItems.map(item => JSON.stringify(item.virtual))).size === 8, 'SSR/hydration combinations must contain eight distinct false/true assignments', failures)
  for (const item of ssrItems) ensure(item.deterministic === true && item.hydrationWarnings === 0 && item.hydrationErrors === 0 && item.bounded === true, 'SSR/hydration combination has warnings, errors or unbounded output', failures)
  ensure(report.iframe?.sameOrigin === true && report.iframe.ownerDocument === true && report.iframe.focusTransfer === true && report.iframe.unmountCleanup === true && report.iframe.postUnmountInteractions === 0, 'same-origin iframe owner/focus/unmount evidence is incomplete', failures)
  ensure(report.gzip?.level === 9 && report.gzip.consumer?.entry === 'bundle-entry.mjs' && report.gzip.consumer?.config?.vite === PINNED_VERSIONS.vite && report.gzip.consumer?.config?.mode === 'production' && report.gzip.consumer?.moduleProvenance?.baseline && report.gzip.consumer?.moduleProvenance?.candidate && JSON.stringify(report.gzip.consumer.components) === JSON.stringify([...COMPONENTS]) && report.gzip.consumer.publicCss === true && report.gzip.consumer.externalizedVue === true && report.gzip.consumer.minifier === 'vite/esbuild' && report.gzip?.deltaBytes <= RELEASE_MATRIX.maxGzipDeltaBytes, 'gzip level-9 consumer comparison or delta is invalid', failures)
  if (requireRelease) ensure(report.acceptanceEligible === true && report.smoke === false, 'smoke reports are not release eligible', failures)
  if (failures.length) {
    const error = new Error(`D4 deferred consumer contract failed: ${failures.join('; ')}`)
    error.failures = failures
    throw error
  }
  return { status: 'passed', acceptanceEligible: report.acceptanceEligible === true, failures: [] }
}

export function validateSmokeReport(report) {
  const failures = []
  ensure(report?.schema === 'd4-deferred-consumer/v1' && report.smoke === true && report.acceptanceEligible === false, 'smoke must be explicitly ineligible', failures)
  ensure(report.authenticEvidence === true && report.preview?.productionBuild === true && report.preview.absoluteNavigation === true && /^https?:\/\//.test(report.preview.baseURL ?? '') && Array.isArray(report.preview.errors) && report.preview.errors.length === 0, 'smoke must contain authentic production preview evidence', failures)
  ensure(Array.isArray(report.case?.scroll) && report.case.scroll.length === 40 && report.case.scroll.every(step => step.rect && Array.isArray(step.rowKeys) && step.rowRects?.length > 0 && step.viewportRect?.height > 0 && step.coverageComplete === true && Number.isFinite(step.timestamp)), 'smoke must collect one authentic forty-step geometry case', failures)
  const timing = report.case?.timing
  ensure(recomputeActionability(timing), 'smoke first-interaction timing is not ordered around actionable row, Vue nextTick and two owner-realm RAFs', failures)
  ensure(report.ssrHydration?.status === 'recorded' && report.ssrHydration.count === 8 && Object.keys(report.ssrHydration.combinations ?? {}).length === 8 && Object.values(report.ssrHydration.combinations).every(item => item.deterministic === true && item.cjsRender === true && (Object.values(item.virtual).every(value => value === false) || item.boundedRows <= 24) && item.hydrationErrors === 0 && item.hydrationWarnings === 0 && item.interacted === true && item.postHydrationStateChanged === true), 'smoke must record eight clean SSR/hydration cases', failures)
  ensure(report.iframe?.sameOrigin === true && report.iframe.ownerDocument === true && report.iframe.focusTransfer === true && report.iframe.popupReopened === true && report.iframe.resourceCounts?.before > 0 && report.iframe.resourceCounts?.after === 0 && report.iframe.unmountCleanup === true && report.iframe.postUnmountInteractions === 0, `smoke iframe popup/focus/resource/unmount evidence is incomplete: ${JSON.stringify(report.iframe)}`, failures)
  ensure(Array.isArray(report.packages?.candidate?.moduleRealpaths) && report.packages.candidate.moduleRealpaths.length > 0 && report.packages.candidate.afterHashes && report.packages.candidate.versions, 'smoke package realpath/version/after-hash evidence is missing', failures)
  ensure(report.packages?.candidate?.versions && JSON.stringify(report.packages.candidate.versions) === JSON.stringify({ ...PINNED_VERSIONS }), 'smoke consumer versions are not the pinned release versions', failures)
  ensure(report.case?.observers?.startedBeforeFirstWrite === true && report.case.observers.drainedAfterLastWrite === true && report.case.observers.disconnected === true && report.case.observers.rawRecomputed === true && report.case.observers.longTasks.every(entry => Number.isFinite(entry.startTime) && Number.isFinite(entry.duration)) && report.case.observers.layoutShifts.every(entry => Number.isFinite(entry.startTime) && Number.isFinite(entry.value)), 'smoke observer evidence is not drained/raw/recomputed', failures)
  ensure(report.familyCoverage && Object.values(report.familyCoverage).every(item => item.realData && item.scenarios?.every(scenario => scenario.executed === true && scenario.eventCount > 0)), 'smoke family scenarios are not real executed records', failures)
  ensure(report.realEvidenceBinding?.tarballReopened === true && report.realEvidenceBinding.buildFingerprint?.before && report.realEvidenceBinding.buildFingerprint?.after && report.realEvidenceBinding.moduleFingerprint?.before === report.realEvidenceBinding.moduleFingerprint?.after, 'smoke evidence is not bound to reopened tarball/build/module fingerprints', failures)
  ensure(report.packages?.sameConsumer === 'notRun' && report.packages?.installedWithoutWorkspaceLinks === 'notRun', 'smoke must not claim installed same-consumer verification', failures)
  ensure(report.smokeChecks?.baselineExplicit === true && report.smokeChecks?.baselineAvailable === true, 'smoke requires an explicit available baseline', failures)
  for (const field of ['candidateRequiredFiles', 'candidateNoSymlink', 'candidateNoWorkspaceLinks', 'candidateNoFsImports', 'candidatePublicSurface']) ensure(report.smokeChecks?.[field] === true, `smoke package check failed: ${field}`, failures)
  if (failures.length) {
    const error = new Error(`D4 smoke contract failed: ${failures.join('; ')}`)
    error.failures = failures
    throw error
  }
  return { status: 'passed', acceptanceEligible: false, failures: [] }
}

/** Validate the bounded, release-shaped subset using the same raw evidence rules as full release. */
export function validateBoundedReleaseReport(report) {
  const failures = []
  ensure(report?.schema === 'd4-deferred-consumer/v1' && report.smoke === true && report.acceptanceEligible === false, 'bounded report must be smoke=true and acceptanceEligible=false', failures)
  ensure(report?.sourceKind === 'collected' && report.runId && report.collectorSourceSha256, 'bounded report collector provenance is missing', failures)
  const reopen = (label, file, expected) => { if (!file || !existsSync(file)) { failures.push(`${label} artifact path does not exist`); return } try { ensure(Boolean(expected) && sha256(readFileSync(file)) === expected, `${label} reopened hash mismatch`, failures) } catch (error) { failures.push(`${label} artifact cannot be reopened: ${error.message}`) } }
  reopen('collector source', report.collectorSourcePath, report.collectorSourceSha256)
  for (const side of ['baseline', 'candidate']) {
    const pkg = report.packages?.[side]
    reopen(`${side} tarball`, pkg?.path, pkg?.sha256)
    reopen(`${side} manifest`, pkg?.manifestPath, pkg?.manifestSha256)
    if (side === 'candidate') { reopen(`${side} module`, pkg?.modulePath, pkg?.afterHashes?.['es/index.js']); reopen(`${side} lock`, pkg?.lockPath, pkg?.lockfileSha256) }
  }
  ensure(report?.realEvidenceBinding?.tarballReopened === true, 'bounded artifact binding is missing', failures)
  ensure(report.realEvidenceBinding?.buildFingerprint?.before && report.realEvidenceBinding.buildFingerprint.before === report.realEvidenceBinding.buildFingerprint.after, 'build fingerprint mismatch', failures)
  ensure(report.realEvidenceBinding?.moduleFingerprint?.before && report.realEvidenceBinding.moduleFingerprint.before === report.realEvidenceBinding.moduleFingerprint.after, 'module fingerprint mismatch', failures)
  ensure(report?.packages?.candidate?.path && report.packages.candidate.sha256 && report.provenance?.candidateTarballSha256 === report.packages.candidate.sha256, 'bounded candidate artifact binding is missing', failures)
  const timing = report.case?.timing
  ensure(recomputeActionability(timing), 'bounded first interaction raw timing/target evidence is invalid', failures)
  const steps = report.case?.scroll
  ensure(Array.isArray(steps) && steps.length === RELEASE_MATRIX.scrollSteps, 'bounded report must contain forty raw scroll steps', failures)
  if (Array.isArray(steps)) {
    ensure(steps.every((step, index) => step.offset === (index < 20 ? index / 19 : (39 - index) / 19) && step.actualOffset >= 0 && step.timestamp >= 0 && recomputeViewportCoverage(step).complete && step.viewportRect?.height > 0 && step.rowRects?.length > 0 && step.rowRects.every(row => row.height > 0 && row.intersectsViewport !== false && row.nextTickAt <= row.rafAt?.[0] && row.rafAt?.[0] <= row.rafAt?.[1])), 'bounded raw geometry cannot be recomputed from rowRects/viewport', failures)
  }
  const observerRounds = report.case?.observers?.rawRounds ?? []
  const roundWindow = observerRounds[0]
  const longTasks = report.case?.observers?.longTasks ?? []
  const shifts = report.case?.observers?.layoutShifts ?? []
  ensure(report.case?.observers?.disconnected === true && report.case.observers.rawRecomputed === true && roundWindow && recomputeObserverRounds(observerRounds) && longTasks.every(entry => entry.startTime >= roundWindow.startedAt && entry.startTime <= roundWindow.drainedAt && entry.duration <= RELEASE_MATRIX.maxLongTaskMs) && shifts.every(entry => entry.startTime >= roundWindow.startedAt && entry.startTime <= roundWindow.drainedAt) && shifts.reduce((sum, entry) => sum + entry.value, 0) <= RELEASE_MATRIX.maxCls, 'bounded observer raw rounds are not drained/recomputed', failures)
  ensure(report.familyCoverage && Object.values(report.familyCoverage).every(item => item.scenarios?.every(scenario => scenario.executed === true && scenario.eventRecords?.length > 0 && scenario.beforeStateHash !== scenario.afterStateHash)), 'bounded family evidence is missing raw event/state records', failures)
  ensure(report.ssrHydration?.status === 'recorded' && Object.values(report.ssrHydration.combinations ?? {}).length === 8 && Object.values(report.ssrHydration.combinations).every(item => item.cjsRender === true && item.initialIdSha256 === item.hydratedIdSha256 && item.postHydrationInteraction === true && item.postHydrationStateChanged === true && item.businessEventsAfterHydration > 0), 'bounded SSR/hydration raw evidence is incomplete', failures)
  ensure(report.iframe?.ownerDocument === true && report.iframe.teleportOwnerDocument === true && report.iframe.resourceCounts?.before > 0 && report.iframe.resourceCounts.after === 0 && report.iframe.postUnmountInteractions === 0, 'bounded iframe lifecycle evidence is incomplete', failures)
  if (failures.length) { const error = new Error(`D4 bounded release contract failed: ${failures.join('; ')}`); error.failures = failures; throw error }
  return { status: 'passed-ineligible', acceptanceEligible: false, failures: [] }
}
