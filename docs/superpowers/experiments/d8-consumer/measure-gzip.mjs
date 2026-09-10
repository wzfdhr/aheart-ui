import assert from 'node:assert/strict'
import { gzip as gzipBytes } from 'node:zlib'
import { promisify } from 'node:util'
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const gzip = promisify(gzipBytes)
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1] }
const baseline = arg('--baseline')
const current = arg('--current')
const output = arg('--out')
const limit = Number(arg('--limit') ?? 12 * 1024)
assert.ok(baseline, '--baseline is required')
assert.ok(current, '--current is required')
assert.ok(output, '--out is required')
assert.ok(Number.isFinite(limit) && limit > 0, '--limit must be positive')

const bytes = async input => {
  const info = await stat(input)
  if (info.isFile()) return readFile(input)
  const files = (await readdir(input, { recursive: true, withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => path.join(entry.parentPath ?? input, entry.name))
    .sort()
  return Buffer.concat(await Promise.all(files.map(file => readFile(file))))
}
const measure = async input => {
  const raw = await bytes(input)
  const compressed = await gzip(raw, { level: 9 })
  return { input: path.resolve(input), raw: raw.length, gzip: compressed.length }
}
const result = { generatedAt: new Date().toISOString(), limit, baseline: await measure(baseline), current: await measure(current) }
result.delta = { raw: result.current.raw - result.baseline.raw, gzip: result.current.gzip - result.baseline.gzip }
result.status = result.delta.gzip <= limit ? 'passed' : 'failed'
await writeFile(output, `${JSON.stringify(result, null, 2)}\n`)
console.log(JSON.stringify(result, null, 2))
if (result.status !== 'passed') process.exitCode = 1
