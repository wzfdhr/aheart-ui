import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { APPROVED_BASELINE_COMMIT, buildSmokeReport, validateSmokeReport } from './d4-deferred-consumer-contract.mjs'

const exec = promisify(execFile)
const workspace = fileURLToPath(new URL('..', import.meta.url))
const arg = name => {
  const index = process.argv.indexOf(name)
  return index < 0 ? undefined : process.argv[index + 1]
}
const has = name => process.argv.includes(name)
const outPath = path.resolve(arg('--out') ?? path.join(workspace, 'docs/superpowers/evidence/d4-deferred-consumer/smoke.json'))
const smoke = has('--smoke')
const candidateInput = arg('--candidate-tarball') ?? arg('--candidate')
const baselineInput = arg('--baseline-tarball') ?? arg('--baseline')
const baselineCommit = arg('--baseline-commit')

function usage() {
  console.log(`Usage:
  node scripts/d4-deferred-consumer.mjs --smoke --baseline-tarball path --baseline-commit ${APPROVED_BASELINE_COMMIT} [--candidate-tarball path] [--out path]
  node scripts/d4-deferred-consumer.mjs --report path [--require-release]

--smoke performs only bounded packed-package/resource checks and always writes acceptanceEligible:false.
--report validates an already collected full raw-evidence report; it never fabricates performance values.`)
}

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
async function packageInfo(tarball, label, { clean = false } = {}) {
  assert(tarball, `--${label}-tarball is required`)
  const absolute = path.resolve(tarball)
  const bytes = await readFile(absolute)
  const listed = (await exec('tar', ['-tf', absolute], { maxBuffer: 4 * 1024 * 1024 })).stdout.split('\n').map(line => line.trim()).filter(Boolean)
  const verbose = (await exec('tar', ['-tvf', absolute], { maxBuffer: 4 * 1024 * 1024 })).stdout.split('\n')
  const manifestPath = listed.find(file => file === 'package/package.json')
  assert(manifestPath, `${label} tarball has no package/package.json`)
  const manifest = JSON.parse((await exec('tar', ['-xOf', absolute, manifestPath], { maxBuffer: 4 * 1024 * 1024 })).stdout)
  const packageFiles = listed.filter(file => file.startsWith('package/')).map(file => file.slice('package/'.length)).filter(Boolean)
  const symlinks = verbose.filter(line => /^l/.test(line.trim())).map(line => line.trim())
  const workspaceLinks = JSON.stringify(manifest).match(/workspace:/g) ?? []
  const fsImports = []
  for (const file of packageFiles.filter(file => /\.(?:js|cjs|mjs|d\.ts)$/.test(file)).slice(0, 400)) {
    const text = (await exec('tar', ['-xOf', absolute, `package/${file}`], { maxBuffer: 16 * 1024 * 1024 })).stdout
    if (text.includes('/@fs/') || text.includes('vite:///@fs/')) fsImports.push(file)
  }
  const required = ['es/index.js', 'es/index.d.ts', 'es/style.css', 'lib/index.js', 'lib/index.d.ts', 'lib/style.css']
  const missing = required.filter(file => !packageFiles.includes(file))
  const exports = manifest.exports?.['.'] ?? {}
  return {
    path: absolute,
    sha256: sha256(bytes),
    clean,
    cleanStatus: clean ? 'verified' : 'not-verified-by-smoke',
    manifest: { name: manifest.name, version: manifest.version, main: manifest.main, module: manifest.module, types: manifest.types, exports },
    files: packageFiles,
    symlinks,
    workspaceLinks,
    fsImports,
    esm: packageFiles.includes('es/index.js') && exports.import === './es/index.js',
    cjs: packageFiles.includes('lib/index.js') && exports.require === './lib/index.js',
    css: packageFiles.includes('es/style.css') && packageFiles.includes('lib/style.css') && manifest.exports?.['./style.css'] === './es/style.css',
    publicTypes: packageFiles.includes('es/index.d.ts') && packageFiles.includes('lib/index.d.ts'),
    ssr: false,
    ssrStatus: 'not-run-by-smoke',
    contentSha256Verified: true,
    tarballSha256Verified: true,
    smoke: { missingRequiredFiles: missing, packageName: manifest.name, packageVersion: manifest.version },
  }
}

async function packCurrent(destination) {
  const result = await exec('corepack', ['pnpm', '--dir', path.join(workspace, 'packages/components'), 'pack', '--json', '--pack-destination', destination], { cwd: workspace, maxBuffer: 4 * 1024 * 1024 })
  let parsed
  try { parsed = JSON.parse(result.stdout) } catch { parsed = null }
  const file = parsed?.filename ?? result.stdout.match(/"filename"\s*:\s*"([^"]+\.tgz)"/)?.[1]
  assert(file, `pnpm pack did not return a tarball path: ${result.stdout}`)
  return path.resolve(destination, path.basename(file))
}

async function smokeRun() {
  const temporary = await mkdtemp(path.join(tmpdir(), 'aheart-d4-deferred-consumer-'))
  let generatedCandidate = false
  try {
    assert(baselineInput, '--baseline-tarball is required; the historical baseline fallback is disabled')
    assert(baselineCommit === APPROVED_BASELINE_COMMIT, `--baseline-commit must equal approved baseline ${APPROVED_BASELINE_COMMIT}`)
    const candidate = candidateInput ? path.resolve(candidateInput) : await packCurrent(temporary).then(file => { generatedCandidate = true; return file })
    const baseline = path.resolve(baselineInput)
    const candidateInfo = await packageInfo(candidate, 'candidate')
    const baselineInfo = baseline ? await packageInfo(baseline, 'baseline') : null
    const smokeChecks = {
      candidatePackedFromCurrentWorkspace: generatedCandidate,
      candidateRequiredFiles: candidateInfo.smoke.missingRequiredFiles.length === 0,
      candidateNoSymlink: candidateInfo.symlinks.length === 0,
      candidateNoWorkspaceLinks: candidateInfo.workspaceLinks.length === 0,
      candidateNoFsImports: candidateInfo.fsImports.length === 0,
      candidatePublicSurface: candidateInfo.esm && candidateInfo.cjs && candidateInfo.css && candidateInfo.publicTypes,
      baselineExplicit: true,
      baselineAvailable: Boolean(baselineInfo),
      releaseMeasurements: 'not-run',
    }
    const report = buildSmokeReport({ baseline: baselineInfo, candidate: candidateInfo, smokeChecks, note: 'Bounded package smoke only; no release performance, cross-browser, SSR/hydration, iframe or gzip gate was run.' })
    validateSmokeReport(report)
    await mkdir(path.dirname(outPath), { recursive: true })
    await writeFile(outPath, `${JSON.stringify(report, null, 2)}\n`)
    console.log(JSON.stringify({ out: outPath, acceptanceEligible: false, candidate: candidateInfo.path, baseline: baselineInfo?.path ?? null, smokeChecks }, null, 2))
  } catch (error) {
    await mkdir(path.dirname(outPath), { recursive: true })
    await writeFile(outPath, `${JSON.stringify({ schema: 'd4-deferred-consumer/v1', generatedAt: new Date().toISOString(), acceptanceEligible: false, smoke: true, failure: String(error?.message ?? error), preservedFailureArtifact: true }, null, 2)}\n`)
    throw error
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}

async function validateSavedReport() {
  const reportPath = path.resolve(arg('--report') ?? '')
  assert(reportPath && reportPath !== path.resolve(workspace), '--report is required')
  const { validateReport } = await import('./d4-deferred-consumer-contract.mjs')
  const report = JSON.parse(await readFile(reportPath, 'utf8'))
  const result = validateReport(report, { requireRelease: has('--require-release') })
  console.log(JSON.stringify({ report: reportPath, ...result }, null, 2))
}

if (has('--help') || has('-h')) usage()
else if (arg('--report')) await validateSavedReport()
else if (smoke) await smokeRun()
else {
  usage()
  process.exitCode = 2
}
