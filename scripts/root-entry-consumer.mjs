import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, realpath, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { execFile } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const fixture = path.join(root, 'docs/superpowers/experiments/root-entry-consumer')
const arg = name => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1] }
const tarball = arg('--tarball')
const output = arg('--out')
assert.ok(tarball, '--tarball is required')
assert.ok(output, '--out is required')

const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const jsFiles = async directory => {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await jsFiles(target))
    else if (entry.isFile() && target.endsWith('.js')) files.push(target)
  }
  return files
}

await mkdir(output, { recursive: true })
const consumerRoot = await realpath(await mkdtemp('/tmp/aheart-root-entry-consumer-'))
for (const file of ['package.json', 'index.html', 'main.js', 'types.ts']) await cp(path.join(fixture, file), path.join(consumerRoot, file))
await cp(await realpath(tarball), path.join(consumerRoot, 'aheart-ui.tgz'))

const result = { status: 'failed', consumerRoot, tarballSHA256: hash(await readFile(tarball)), symlink: undefined, bundleGzipBytes: 0, unrelated: [] }
try {
  await run('npm', ['install', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 })
  await run('npm', ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 })
  result.symlink = (await lstat(path.join(consumerRoot, 'node_modules/aheart-ui'))).isSymbolicLink()
  assert.equal(result.symlink, false)
  await run(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsc', '--noEmit', '--strict', '--skipLibCheck', '--moduleResolution', 'Bundler', '--module', 'ESNext', '--target', 'ES2022', 'types.ts'], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 })
  await run(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['vite', 'build'], { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 })
  const javascript = await Promise.all((await jsFiles(path.join(consumerRoot, 'dist/assets'))).map(file => readFile(file)))
  result.bundleGzipBytes = javascript.reduce((sum, bytes) => sum + gzipSync(bytes).byteLength, 0)
  const source = Buffer.concat(javascript).toString('utf8')
  result.unrelated = ['aheart-table', 'aheart-cascader', 'aheart-tree-select', 'aheart-upload'].filter(marker => source.includes(marker))
  assert.deepEqual(result.unrelated, [], `root named import retained unrelated markers: ${result.unrelated.join(', ')}`)
  assert.ok(result.bundleGzipBytes > 0)
  result.status = 'passed'
} catch (error) {
  result.error = { name: error.name, message: error.message }
  await writeFile(path.join(output, 'results.json'), `${JSON.stringify(result, null, 2)}\n`)
  throw error
}
await writeFile(path.join(output, 'results.json'), `${JSON.stringify(result, null, 2)}\n`)
console.log(JSON.stringify(result, null, 2))
