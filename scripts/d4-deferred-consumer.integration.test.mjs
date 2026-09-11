import assert from 'node:assert/strict'
import test from 'node:test'
import { execFile } from 'node:child_process'
import { cp, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import path from 'node:path'

const run = promisify(execFile)
const workspace = process.cwd()
const baseline = path.join(workspace, 'docs/superpowers/evidence/d4-c/consumer/baseline.tgz')
const approvedBaseline = '4a7511f9594d0a74906e427e158d02343ba33a22'
const hash = bytes => createHash('sha256').update(bytes).digest('hex')

async function packCurrent(directory) {
  const result = await run('corepack', ['pnpm', '--dir', path.join(workspace, 'packages/components'), 'pack', '--json', '--pack-destination', directory], { cwd: workspace, maxBuffer: 4 * 1024 * 1024 })
  return JSON.parse(result.stdout).filename
}

test('packed production smoke has an absolute preview baseURL and authentic collector output', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'd4-deferred-integration-red-'))
  const candidate = await packCurrent(root)
  const baselineBytes = await readFile(baseline)
  const candidateBytes = await readFile(candidate)
  const baselineManifest = path.join(root, 'baseline-manifest.json')
  const candidateManifest = path.join(root, 'candidate-manifest.json')
  await writeFile(baselineManifest, JSON.stringify({ clean: true, commit: approvedBaseline, tarballSha256: hash(baselineBytes) }))
  await writeFile(candidateManifest, JSON.stringify({ clean: true, commit: 'candidate-from-clean-checkout', tarballSha256: hash(candidateBytes) }))
  const out = path.join(root, 'collector.json')
  const log = path.join(root, 'collector.log')
  const result = await run(process.execPath, [
    path.join(workspace, 'docs/superpowers/experiments/d4-deferred-consumer/collect.mjs'),
    '--baseline-tarball', baseline,
    '--candidate-tarball', candidate,
    '--baseline-commit', approvedBaseline,
    '--candidate-commit', 'candidate-from-clean-checkout',
    '--baseline-manifest', baselineManifest,
    '--candidate-manifest', candidateManifest,
    '--base-url', 'http://127.0.0.1:0',
    '--out', out,
  ], { cwd: workspace, maxBuffer: 8 * 1024 * 1024 }).then(value => ({ code: 0, output: `${value.stdout}\n${value.stderr}` }), error => ({ code: error.code ?? 1, output: `${error.stdout ?? ''}\n${error.stderr ?? ''}` }))
  await writeFile(log, result.output)
  assert.equal(result.code, 0, `collector integration failed; preserved log ${log}\n${result.output}`)
  const report = JSON.parse(await readFile(out, 'utf8'))
  assert.equal(report.acceptanceEligible, false, 'one-case smoke must remain release-ineligible')
  assert.equal(report.preview.baseURL, 'http://127.0.0.1:0')
  assert.equal(report.authenticEvidence, true)
})
