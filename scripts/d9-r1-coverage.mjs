import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = path.join(root, 'docs/superpowers/evidence/d9-r1-coverage-manifest.json')
const packageCoverage = (file) => path.join(root, 'packages', file.split('/')[1], 'coverage/coverage-final.json')

export const collectR1Coverage = async ({ today = new Date().toISOString().slice(0, 10) } = {}) => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  assert.equal(manifest.schemaVersion, 'd9-r1-coverage.v1')
  assert.ok(Number.isFinite(manifest.branchThreshold) && manifest.branchThreshold >= 80)
  assert.ok(Array.isArray(manifest.files) && manifest.files.length > 0)
  const coverageByPackage = new Map()
  const result = []
  for (const file of manifest.files) {
    const packageName = file.split('/')[1]
    if (!coverageByPackage.has(packageName)) {
      coverageByPackage.set(packageName, JSON.parse(await readFile(packageCoverage(file), 'utf8')))
    }
    const coverage = coverageByPackage.get(packageName)[path.join(root, file)]
    if (!coverage) throw new Error(`R1 coverage is missing for ${file}`)
    const total = Object.keys(coverage.b ?? {}).length
    const covered = Object.values(coverage.b ?? {}).filter((hits) => Array.isArray(hits) ? hits.some((hit) => hit > 0) : hits > 0).length
    const pct = total ? covered / total * 100 : 100
    if (pct < manifest.branchThreshold) throw new Error(`${file} branch coverage ${pct.toFixed(2)}% is below ${manifest.branchThreshold}%`)
    result.push({ file, total, covered, pct: Number(pct.toFixed(2)) })
  }
  const total = result.reduce((sum, item) => sum + item.total, 0)
  const covered = result.reduce((sum, item) => sum + item.covered, 0)
  const branchPct = total ? covered / total * 100 : 100
  if (branchPct < manifest.branchThreshold) throw new Error(`R1 aggregate branch coverage ${branchPct.toFixed(2)}% is below ${manifest.branchThreshold}%`)
  return { ok: true, reviewedAt: today, threshold: manifest.branchThreshold, files: result, aggregate: { total, covered, pct: Number(branchPct.toFixed(2)) } }
}

if (import.meta.url === pathToFileURL(path.resolve(process.argv[1] ?? '')).href) {
  collectR1Coverage().then((result) => process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)).catch((error) => {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  })
}
