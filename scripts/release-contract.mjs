import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))

export const packageContracts = [
  {
    name: 'aheart-ui',
    version: '1.0.0',
    packageDir: 'packages/components',
    requiredFiles: ['README.md', 'LICENSE', 'package.json', 'es/package.json', 'es/index.js', 'es/index.d.ts', 'es/style.css', 'lib/package.json', 'lib/index.js', 'lib/index.d.ts', 'lib/style.css']
  },
  {
    name: '@aheart-ui/dnd',
    version: '1.0.0',
    packageDir: 'packages/dnd',
    expectedDependencies: { '@atlaskit/pragmatic-drag-and-drop': '2.0.1' },
    requiredFiles: ['README.md', 'LICENSE', 'package.json', 'es/package.json', 'es/index.js', 'es/index.d.ts', 'es/style.css', 'lib/package.json', 'lib/index.js', 'lib/index.d.ts', 'lib/style.css']
  },
  {
    name: '@aheart-ui/ai',
    version: '1.0.0',
    packageDir: 'packages/ai',
    expectedDependencies: { '@aheart-ui/dnd': '^1.0.0' },
    expectedPeerDependencies: { 'aheart-ui': '^1.0.0' },
    requiredFiles: ['README.md', 'LICENSE', 'package.json', 'es/package.json', 'es/index.js', 'es/index.d.ts', 'es/style.css', 'lib/package.json', 'lib/index.js', 'lib/index.d.ts', 'lib/style.css']
  }
]

const hasWorkspaceProtocol = (value) => {
  if (typeof value === 'string') return value.startsWith('workspace:')
  if (Array.isArray(value)) return value.some(hasWorkspaceProtocol)
  if (value && typeof value === 'object') return Object.values(value).some(hasWorkspaceProtocol)
  return false
}

export const validatePackageContract = (contract, manifest, packedFiles) => {
  const errors = []
  const prefix = `${contract.name}:`
  const files = new Set(packedFiles)

  if (manifest.name !== contract.name) errors.push(`${prefix} packed name must be ${contract.name}`)
  if (manifest.version !== contract.version) errors.push(`${prefix} packed version must be ${contract.version}`)

  for (const field of ['description', 'license', 'homepage']) {
    if (typeof manifest[field] !== 'string' || !manifest[field].trim()) errors.push(`${prefix} ${field} is required`)
  }

  if (!manifest.repository?.url) errors.push(`${prefix} repository.url is required`)
  if (!manifest.bugs?.url) errors.push(`${prefix} bugs.url is required`)
  if (manifest.publishConfig?.access !== 'public') errors.push(`${prefix} publishConfig.access must be public`)
  if (manifest.publishConfig?.registry !== 'https://registry.npmjs.org/') {
    errors.push(`${prefix} publishConfig.registry must be https://registry.npmjs.org/`)
  }

  const rootExport = manifest.exports?.['.']
  if (rootExport?.types !== './es/index.d.ts') errors.push(`${prefix} exports["."].types must be ./es/index.d.ts`)
  if (rootExport?.import !== './es/index.js') errors.push(`${prefix} exports["."].import must be ./es/index.js`)
  if (rootExport?.require !== './lib/index.js') errors.push(`${prefix} exports["."].require must be ./lib/index.js`)
  if (manifest.exports?.['./style.css'] !== './es/style.css') errors.push(`${prefix} style export must be ./es/style.css`)
  if (manifest.exports?.['./package.json'] !== './package.json') errors.push(`${prefix} package.json export is required`)
  if (manifest.peerDependencies?.vue !== '>=3.4.0 <4') errors.push(`${prefix} Vue peer range must be >=3.4.0 <4`)

  if (hasWorkspaceProtocol(manifest)) errors.push(`${prefix} packed manifest contains an unresolved workspace: protocol`)

  for (const [name, range] of Object.entries(contract.expectedDependencies ?? {})) {
    if (manifest.dependencies?.[name] !== range) errors.push(`${prefix} dependency ${name} must be ${range}`)
  }

  for (const [name, range] of Object.entries(contract.expectedPeerDependencies ?? {})) {
    if (manifest.peerDependencies?.[name] !== range) errors.push(`${prefix} peer dependency ${name} must be ${range}`)
  }

  for (const file of contract.requiredFiles) {
    if (!files.has(file)) errors.push(`${prefix} packed file ${file} is required`)
  }

  for (const file of files) {
    if (file.startsWith('src/') || file.includes('/src/') || file.startsWith('__tests__/') || file.includes('/__tests__/')) {
      errors.push(`${prefix} tarball must not include ${file}`)
    }
  }

  return errors
}

const readPackedManifest = (tarball) => {
  const output = execFileSync('tar', ['-xOf', tarball, 'package/package.json'], { encoding: 'utf8' })
  return JSON.parse(output)
}

const packPackage = (contract, destination) => {
  const output = execFileSync(
    'corepack',
    ['pnpm', '--dir', contract.packageDir, 'pack', '--json', '--pack-destination', destination],
    { cwd: repositoryRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
  )
  const result = JSON.parse(output)
  const tarball = resolve(result.filename)
  const manifest = readPackedManifest(tarball)
  const files = result.files.map((file) => file.path)
  return { manifest, files, tarball }
}

export const verifyReleasePackages = () => {
  const destination = mkdtempSync(resolve(tmpdir(), 'aheart-ui-release-'))
  const summaries = []
  const errors = []

  try {
    for (const contract of packageContracts) {
      try {
        const packed = packPackage(contract, destination)
        errors.push(...validatePackageContract(contract, packed.manifest, packed.files))
        summaries.push(`${contract.name}@${contract.version}: ${packed.files.length} files`)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        errors.push(`${contract.name}: pack failed: ${message}`)
      }
    }
  } finally {
    rmSync(destination, { recursive: true, force: true })
  }

  if (errors.length) throw new Error(`Release contract failed:\n- ${errors.join('\n- ')}`)
  return summaries
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href

if (isCli) {
  try {
    for (const summary of verifyReleasePackages()) console.log(`✓ ${summary}`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
