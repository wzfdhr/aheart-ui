import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { APPROVED_BASELINE_COMMIT } from './d4-deferred-consumer-contract.mjs'

const exec = promisify(execFile)
const workspace = fileURLToPath(new URL('..', import.meta.url))
const arg = name => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1] }
const has = name => process.argv.includes(name)

function usage() {
  console.log(`Usage:
  node scripts/d4-deferred-consumer.mjs --smoke --baseline-tarball path --baseline-commit ${APPROVED_BASELINE_COMMIT} --baseline-manifest path --candidate-commit SHA --candidate-manifest path [--candidate-tarball path] [--out path]
  node scripts/d4-deferred-consumer.mjs --preflight-full --baseline-tarball path --baseline-commit ${APPROVED_BASELINE_COMMIT} --baseline-manifest path --candidate-commit SHA --candidate-manifest path --candidate-tarball path [--out path]
  node scripts/d4-deferred-consumer.mjs --report path --require-release

--smoke delegates to the real production Vite/preview collector and always writes acceptanceEligible:false.
--report validates an already collected raw report and reopens package artifacts for release validation.`)
}

async function runCollector(mode) {
  const required = ['--baseline-tarball', '--baseline-commit', '--baseline-manifest', '--candidate-commit', '--candidate-manifest']
  for (const flag of required) assert(arg(flag), `${flag} is required for the real collector`)
  if (mode === '--preflight-full') assert(arg('--candidate-tarball'), '--candidate-tarball is required for preflight-full')
  assert.equal(arg('--baseline-commit'), APPROVED_BASELINE_COMMIT, `--baseline-commit must equal approved baseline ${APPROVED_BASELINE_COMMIT}`)
  const collector = path.join(workspace, 'docs/superpowers/experiments/d4-deferred-consumer/collect.mjs')
  const args = [collector, mode]
  for (const flag of [...required, '--candidate-tarball', '--base-url', '--out']) if (arg(flag)) args.push(flag, arg(flag))
  const result = await exec(process.execPath, args, { cwd: workspace, maxBuffer: 16 * 1024 * 1024 })
  process.stdout.write(result.stdout)
  process.stderr.write(result.stderr)
}

async function validateSavedReport() {
  const reportPath = path.resolve(arg('--report') ?? '')
  assert(reportPath && reportPath !== path.resolve(workspace), '--report is required')
  const { validateReport, verifyArtifactBindings } = await import('./d4-deferred-consumer-contract.mjs')
  const report = JSON.parse(await readFile(reportPath, 'utf8'))
  if (has('--require-release')) {
    await verifyArtifactBindings(report, { reportPath })
  }
  const result = validateReport(report, { requireRelease: has('--require-release') })
  console.log(JSON.stringify({ report: reportPath, ...result }, null, 2))
}

if (has('--help') || has('-h')) usage()
else if (arg('--report')) await validateSavedReport()
else if (has('--smoke')) await runCollector('--smoke')
else if (has('--preflight-full')) await runCollector('--preflight-full')
else { usage(); process.exitCode = 2 }
