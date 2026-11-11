import { execFile } from 'node:child_process'
import { cp, lstat, mkdir, mkdtemp, readFile, realpath, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import assert from 'node:assert/strict'
import { packageContracts } from './release-contract.mjs'

const run = promisify(execFile)
const arg = name => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1] }
const packDir = path.resolve(arg('--pack-dir') ?? 'test-results/release-tarballs')
const out = path.resolve(arg('--out') ?? 'test-results/m3-consumer')
await mkdir(out, { recursive: true })
const consumer = await mkdtemp(path.join(tmpdir(), 'aheart-m3-consumer-'))
const require = createRequire(import.meta.url)
const dependencies = {
  vue: '3.5.44',
  vite: '5.0.12',
  '@vitejs/plugin-vue': '5.0.3',
  '@playwright/test': require('@playwright/test/package.json').version,
  'unplugin-vue-components': '0.28.0'
}

const capture = async (log, command, args) => {
  try {
    const result = await run(command, args, { cwd: consumer, timeout: 180000, maxBuffer: 10 * 1024 * 1024 })
    await writeFile(path.join(out, log), result.stdout + result.stderr)
    return result.stdout
  } catch (error) {
    await writeFile(path.join(out, log), (error.stdout ?? '') + (error.stderr ?? error.message))
    throw error
  }
}

for (const { name, version } of packageContracts) {
  const filename = `${name.replace(/^@/, '').replaceAll('/', '-')}-${version}.tgz`
  await cp(await realpath(path.join(packDir, filename)), path.join(consumer, filename))
  dependencies[name] = `file:./${filename}`
}
await writeFile(path.join(consumer, 'package.json'), JSON.stringify({ name: 'aheart-m3-consumer', private: true, type: 'module', dependencies }))
await cp(fileURLToPath(new URL('./fixtures/m3-consumer/', import.meta.url)), consumer, { recursive: true })
await capture('install.log', 'npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'])
for (const { name, version } of packageContracts) {
  const installed = path.join(consumer, 'node_modules', name)
  assert.equal((await lstat(installed)).isSymbolicLink(), false)
  assert.equal(JSON.parse(await readFile(path.join(installed, 'package.json'), 'utf8')).version, version)
}
await capture('probe.log', process.execPath, ['probe.mjs'])
await cp(path.join(consumer, 'results.json'), path.join(out, 'results.json'))
console.log(`M3 tarball consumer passed. Evidence at ${out}`)
