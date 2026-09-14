import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { cp, mkdir, readFile, readdir, realpath, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'
import { persistGzipArtifacts, verifyGzipArtifacts, verifyGzipSupplement } from './d4-gzip-artifacts.mjs'

const run = promisify(execFile)
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const [reportArgument, destinationArgument] = process.argv.slice(2)
assert(reportArgument && destinationArgument, 'Usage: node scripts/d4-gzip-recollect.mjs <full-report.json> <new-output-directory>')
const reportPath = path.resolve(reportArgument)
const sourceBytes = await readFile(reportPath)
const source = JSON.parse(sourceBytes)
assert.equal(process.versions.node, '24.17.0')
assert.equal(source.sourceKind, 'collected')
const destination = path.resolve(destinationArgument)
await mkdir(destination) // Evidence directories are never overwritten.
const result = { kind: 'd4-gzip-supplement', status: 'running', sourceReport: { path: reportPath, sha256: hash(sourceBytes) }, sides: {} }
const entryText = "import {Tree,TreeSelect,Cascader} from 'aheart-ui'; import 'aheart-ui/style.css'; export {Tree,TreeSelect,Cascader};\n"
try {
  for (const side of ['baseline', 'candidate']) {
    const root = path.join(destination, side)
    await mkdir(root)
    const packageEvidence = source.packages[side]
    const tarball = await readFile(packageEvidence.path)
    assert.equal(hash(tarball), packageEvidence.sha256, `${side} source tarball hash`)
    await cp(packageEvidence.path, path.join(root, 'aheart-ui.tgz'))
    const lock = await readFile(packageEvidence.lockPath)
    assert.equal(hash(lock), packageEvidence.lockfileSha256, `${side} original lock hash`)
    await writeFile(path.join(root, 'pnpm-lock.yaml'), lock)
    await cp(new URL('../docs/superpowers/experiments/d4-deferred-consumer/package.json', import.meta.url), path.join(root, 'package.json'))
    const install = await run('corepack', ['pnpm@9.15.4', 'install', '--frozen-lockfile', '--ignore-scripts', '--config.node-linker=hoisted', '--prod=false'], { cwd: root, maxBuffer: 8 * 1024 * 1024 })
    assert.equal(hash(await readFile(path.join(root, 'pnpm-lock.yaml'))), hash(lock), 'install changed source lock')
    const modulePath = await realpath(path.join(root, 'node_modules/aheart-ui/es/index.js'))
    assert(modulePath.startsWith(`${await realpath(root)}${path.sep}`), 'component resolved outside isolated consumer')
    assert.equal(hash(await readFile(modulePath)), packageEvidence.afterHashes['es/index.js'], 'installed component module mismatch')
    await writeFile(path.join(root, 'install.log'), install.stdout + install.stderr)
    const entry = path.join(root, 'bundle-entry.mjs')
    await writeFile(entry, entryText)
    const { build } = await import(pathToFileURL(path.join(root, 'node_modules/vite/dist/node/index.js')).href)
    const bundle = path.join(root, 'bundle')
    const buildOptions = { root, configFile: false, logLevel: 'error', build: { outDir: bundle, minify: 'esbuild', sourcemap: false, commonjsOptions: { strictRequires: true }, rollupOptions: { input: entry, preserveEntrySignatures: 'strict', external: ['vue'] } } }
    const built = await build(buildOptions)
    const chunks = (Array.isArray(built) ? built : [built]).flatMap(item => item.output)
    const entryChunk = chunks.find(item => item.type === 'chunk' && item.isEntry)
    assert(entryChunk && ['Tree', 'TreeSelect', 'Cascader'].every(name => entryChunk.exports.includes(name)), 'missing component exports')
    const files = []
    async function walk(prefix = '') {
      for (const item of await readdir(path.join(bundle, prefix), { withFileTypes: true })) {
        const relative = prefix ? `${prefix}/${item.name}` : item.name
        if (item.isDirectory()) await walk(relative)
        else {
          const bytes = await readFile(path.join(bundle, relative))
          files.push({ path: relative, contentBase64: bytes.toString('base64'), rawBytes: bytes.length, rawSha256: hash(bytes), gzipBytes: gzipSync(bytes, { level: 9 }).length })
        }
      }
    }
    await walk()
    const binding = await persistGzipArtifacts(bundle, path.join(root, 'evidence'), files)
    await verifyGzipArtifacts(binding, files)
    await build(buildOptions)
    const firstFiles = [...files]
    files.length = 0
    await walk()
    assert.deepEqual([...files].sort((a, b) => a.path.localeCompare(b.path)), [...firstFiles].sort((a, b) => a.path.localeCompare(b.path)), 'gzip repeat build differs')
    const repeatBinding = await persistGzipArtifacts(bundle, path.join(root, 'repeat-evidence'), files)
    result.sides[side] = { tarballSha256: hash(tarball), entry: entryChunk.fileName, exports: entryChunk.exports, lockSha256: hash(await readFile(path.join(root, 'pnpm-lock.yaml'))), files, binding, repeatBinding, strictRequires: true, gzipBytes: files.reduce((sum, file) => sum + file.gzipBytes, 0) }
  }
  result.deltaBytes = result.sides.candidate.gzipBytes - result.sides.baseline.gzipBytes
  result.limitBytes = 12 * 1024
  assert(result.deltaBytes <= result.limitBytes, `gzip delta ${result.deltaBytes} exceeds ${result.limitBytes}`)
  result.status = 'passed'
  await verifyGzipSupplement(result)
} catch (error) {
  result.status = 'failed'
  result.failure = error.stack
  process.exitCode = 1
} finally {
  await writeFile(path.join(destination, 'gzip-supplement.json'), `${JSON.stringify(result, null, 2)}\n`)
  console.log(JSON.stringify({ status: result.status, deltaBytes: result.deltaBytes, failure: result.failure, destination }))
}
