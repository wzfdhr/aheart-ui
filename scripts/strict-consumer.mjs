import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, realpath, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { packageContracts } from './release-contract.mjs'
import { collectDeclarations } from './collect-declarations.mjs'

const run = promisify(execFile)
const root = fileURLToPath(new URL('..', import.meta.url))
const fixture = path.join(root, 'scripts/fixtures/strict-consumer')
const componentRequire = createRequire(path.join(root, 'packages/components/package.json'))
const vueVersions = [...new Set([componentRequire('vue/package.json').version, '3.5.44'])]
// Vue 3.5 uses the NoInfer intrinsic, which is unavailable in the build's TS 5.3.
const typescriptVersion = '5.9.3'
const arg = name => { const index = process.argv.indexOf(name); return index < 0 ? undefined : process.argv[index + 1] }
const packDir = path.resolve(arg('--pack-dir') ?? 'test-results/release-tarballs')
const output = path.resolve(arg('--out') ?? 'test-results/d9-consumers/strict')
// Optional offline Vue fixtures: <directory>/<version>/*.tgz, packed from the
// installed Vue packages. The library packages always come from --pack-dir.
const vuePackDir = arg('--vue-pack-dir')
await mkdir(output, { recursive: true })
const results = { status: 'failed', typescriptVersion, tarballs: {}, consumers: [] }
try {
  for (const contract of packageContracts) {
    const filename = `${contract.name.replace(/^@/, '').replaceAll('/', '-')}-${contract.version}.tgz`
    const tarball = await realpath(path.join(packDir, filename))
    results.tarballs[contract.name] = { tarball, sha256: createHash('sha256').update(await readFile(tarball)).digest('hex') }
  }
  for (const vueVersion of vueVersions) {
    const consumerRoot = await realpath(await mkdtemp(path.join(output, `vue-${vueVersion}-`)))
    const result = { vueVersion, consumerRoot, status: 'failed', packages: {}, checks: {} }
    results.consumers.push(result)
    try {
      const dependencies = { vue: vueVersion, typescript: typescriptVersion }
      const overrides = {}
      for (const [name, { tarball }] of Object.entries(results.tarballs)) {
        const filename = path.basename(tarball)
        await cp(tarball, path.join(consumerRoot, filename))
        dependencies[name] = `file:./${filename}`
      }
      if (vuePackDir) {
        const directory = path.resolve(vuePackDir, vueVersion)
        const filenames = await readdir(directory).catch(error => { if (error.code === 'ENOENT') return []; throw error })
        result.vueTarballs = {}
        for (const filename of filenames.filter(file => file.endsWith('.tgz')).sort()) {
          const tarball = path.join(directory, filename)
          const { stdout } = await run('tar', ['-xOf', tarball, 'package/package.json'])
          const manifest = JSON.parse(stdout)
          assert.ok(manifest.name === 'vue' || manifest.name.startsWith('@vue/'), 'Offline overrides are limited to Vue packages')
          assert.equal(manifest.version, vueVersion)
          await cp(tarball, path.join(consumerRoot, filename))
          const specifier = `file:./${filename}`
          if (manifest.name === 'vue') dependencies.vue = specifier
          else overrides[manifest.name] = specifier
          result.vueTarballs[manifest.name] = { tarball, sha256: createHash('sha256').update(await readFile(tarball)).digest('hex') }
        }
      }
      await writeFile(path.join(consumerRoot, 'package.json'), JSON.stringify({ name: 'aheart-strict-consumer', private: true, type: 'module', dependencies, overrides }, null, 2))
      await cp(path.join(fixture, 'types.ts'), path.join(consumerRoot, 'types.ts'))
      await cp(path.join(fixture, 'tsconfig.json'), path.join(consumerRoot, 'tsconfig.json'))
      const options = { cwd: consumerRoot, maxBuffer: 30 * 1024 * 1024 }
      const install = await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'], options)
      await writeFile(path.join(consumerRoot, 'install.log'), install.stdout + install.stderr)
      const allDeclarations = []
      for (const contract of packageContracts) {
        const installed = path.join(consumerRoot, 'node_modules', contract.name)
        assert.equal((await lstat(installed)).isSymbolicLink(), false, `${contract.name} must be installed from its tarball`)
        assert.equal(await realpath(installed), installed, `${contract.name} must not resolve into the workspace`)
        const ignoredMetadata = []
        const files = [...await collectDeclarations(path.join(installed, 'es'), ignoredMetadata), ...await collectDeclarations(path.join(installed, 'lib'), ignoredMetadata)]
        assert.ok(files.length > 0, `${contract.name} must contain declarations`)
        const manifest = JSON.parse(await readFile(path.join(installed, 'package.json'), 'utf8'))
        assert.equal(manifest.version, contract.version)
        result.packages[contract.name] = { version: manifest.version, symlink: false, declarations: files.length, ignoredMetadata: ignoredMetadata.map(file => path.relative(installed, file)) }
        allDeclarations.push(...files)
      }
      assert.equal(JSON.parse(await readFile(path.join(consumerRoot, 'node_modules/vue/package.json'), 'utf8')).version, vueVersion)
      // Audit every shipped declaration, including declarations not reachable from a root import.
      const config = JSON.parse(await readFile(path.join(fixture, 'tsconfig.json'), 'utf8'))
      config.files.push(...allDeclarations.map(file => path.relative(consumerRoot, file)))
      await writeFile(path.join(consumerRoot, 'tsconfig.audit.json'), JSON.stringify(config, null, 2))
      await writeFile(path.join(consumerRoot, 'repro.ts'), "import { Button } from 'aheart-ui'; export const c = [Button];\n")
      await writeFile(path.join(consumerRoot, 'tsconfig.repro.json'), JSON.stringify({ compilerOptions: config.compilerOptions, files: ['repro.ts'] }, null, 2))
      for (const [check, configFile] of [['roots', 'tsconfig.json'], ['all-declarations', 'tsconfig.audit.json'], ['repro', 'tsconfig.repro.json']]) {
        try {
          const checked = await run(process.execPath, ['node_modules/typescript/bin/tsc', '-p', configFile, '--pretty', 'false'], options)
          await writeFile(path.join(consumerRoot, `${check}.log`), checked.stdout + checked.stderr)
          result.checks[check] = 0
        } catch (error) {
          result.checks[check] = error.code ?? 1
          await writeFile(path.join(consumerRoot, `${check}.log`), (error.stdout ?? '') + (error.stderr ?? error.message))
          console.error(`Vue ${vueVersion} ${check}:\n${error.stdout ?? error.message}`)
        }
      }
      assert.ok(Object.values(result.checks).every(code => code === 0), `Vue ${vueVersion} strict checks failed`)
      result.status = 'passed'
      console.log(`✓ Vue ${vueVersion}: root imports, ${allDeclarations.length} declarations, and Button repro (skipLibCheck: false)`)
    } catch (error) {
      result.error = { message: error.message, stdout: error.stdout, stderr: error.stderr }
      console.error(error.message)
    }
  }
  assert.ok(results.consumers.every(result => result.status === 'passed'), 'Strict packed consumer checks failed')
  results.status = 'passed'
} catch (error) {
  results.error = error.message
  console.error(error.message)
  process.exitCode = 1
} finally {
  await writeFile(path.join(output, 'results.json'), `${JSON.stringify(results, null, 2)}\n`)
}
