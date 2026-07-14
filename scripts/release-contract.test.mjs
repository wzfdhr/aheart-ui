import assert from 'node:assert/strict'
import test from 'node:test'
import { validatePackageContract } from './release-contract.mjs'

const contract = {
  name: '@aheart-ui/example',
  version: '1.0.0',
  requiredFiles: [
    'README.md',
    'LICENSE',
    'package.json',
    'es/package.json',
    'es/index.js',
    'es/index.d.ts',
    'es/style.css',
    'lib/package.json',
    'lib/index.js'
  ]
}

const manifest = {
  name: '@aheart-ui/example',
  version: '1.0.0',
  description: 'Example package.',
  license: 'MIT',
  repository: {
    type: 'git',
    url: 'git+https://github.com/wzfdhr/aheart-ui.git'
  },
  homepage: 'https://github.com/wzfdhr/aheart-ui#readme',
  bugs: {
    url: 'https://github.com/wzfdhr/aheart-ui/issues'
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/'
  },
  exports: {
    '.': {
      types: './es/index.d.ts',
      import: './es/index.js',
      require: './lib/index.js'
    },
    './style.css': './es/style.css',
    './package.json': './package.json'
  },
  peerDependencies: {
    vue: '>=3.4.0 <4'
  }
}

const files = [...contract.requiredFiles]

test('accepts a complete packed package contract', () => {
  assert.deepEqual(validatePackageContract(contract, manifest, files), [])
})

test('reports missing public metadata and required files', () => {
  const errors = validatePackageContract(contract, { ...manifest, description: '' }, files.filter((file) => file !== 'LICENSE'))

  assert.ok(errors.includes('@aheart-ui/example: description is required'))
  assert.ok(errors.includes('@aheart-ui/example: packed file LICENSE is required'))
})

test('rejects unresolved workspace dependency protocols', () => {
  const errors = validatePackageContract(
    contract,
    { ...manifest, dependencies: { '@aheart-ui/dnd': 'workspace:^' } },
    files
  )

  assert.ok(errors.some((error) => error.includes('workspace: protocol')))
})

test('rejects unexpected packed dependency ranges', () => {
  const errors = validatePackageContract(
    {
      ...contract,
      expectedDependencies: { '@aheart-ui/dnd': '^1.0.0' },
      expectedPeerDependencies: { 'aheart-ui': '^1.0.0' }
    },
    {
      ...manifest,
      dependencies: { '@aheart-ui/dnd': '^0.9.0' },
      peerDependencies: { ...manifest.peerDependencies, 'aheart-ui': '^0.9.0' }
    },
    files
  )

  assert.ok(errors.includes('@aheart-ui/example: dependency @aheart-ui/dnd must be ^1.0.0'))
  assert.ok(errors.includes('@aheart-ui/example: peer dependency aheart-ui must be ^1.0.0'))
})

test('rejects source and test files from the tarball', () => {
  const errors = validatePackageContract(contract, manifest, [...files, 'src/index.ts', '__tests__/contract.test.ts'])

  assert.ok(errors.includes('@aheart-ui/example: tarball must not include src/index.ts'))
  assert.ok(errors.includes('@aheart-ui/example: tarball must not include __tests__/contract.test.ts'))
})
