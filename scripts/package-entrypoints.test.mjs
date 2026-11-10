import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import test from 'node:test'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const packages = ['components', 'dnd', 'ai']
const workspaceRoot = fileURLToPath(new URL('..', import.meta.url))
const run = promisify(execFile)

test('Card exports preserve consumer prop, slot, alias and install types', async () => {
  const fixtureDir = path.join(workspaceRoot, 'scripts/fixtures/strict-consumer')
  const config = JSON.parse(await readFile(path.join(fixtureDir, 'tsconfig.json'), 'utf8'))
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, fixtureDir)
  const program = ts.createProgram(parsed.fileNames, {
    ...parsed.options,
    // The build compiler is TS 5.3; strict-consumer.mjs audits library declarations
    // with TS 5.9, including Vue's NoInfer intrinsic (added in TS 5.4).
    skipLibCheck: true,
    paths: {
      'aheart-ui': [path.join(workspaceRoot, 'packages/components/es/index.d.ts')],
      'aheart-ui/button': [path.join(workspaceRoot, 'packages/components/es/button/index.d.ts')],
      'aheart-ui/modal': [path.join(workspaceRoot, 'packages/components/es/modal/index.d.ts')],
      'aheart-ui/select': [path.join(workspaceRoot, 'packages/components/es/select/index.d.ts')],
      'aheart-ui/full': [path.join(workspaceRoot, 'packages/components/es/full.d.ts')],
      'aheart-ui/es/*': [path.join(workspaceRoot, 'packages/components/es/*')],
      '@aheart-ui/dnd': [path.join(workspaceRoot, 'packages/dnd/es/index.d.ts')],
      '@aheart-ui/ai': [path.join(workspaceRoot, 'packages/ai/es/index.d.ts')],
      vue: [path.join(workspaceRoot, 'packages/components/node_modules/vue/dist/vue.d.ts')]
    }
  })
  const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)]
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: file => file,
    getCurrentDirectory: () => workspaceRoot,
    getNewLine: () => '\n'
  }))
})

for (const packageDir of packages) {
  test(`${packageDir} loads through ESM and CommonJS entrypoints`, async () => {
    const esm = await import(`../packages/${packageDir}/es/index.js`)
    const cjs = require(`../packages/${packageDir}/lib/index.js`)

    assert.ok(Object.keys(esm).length > 0)
    assert.ok(Object.keys(cjs).length > 0)
    if (packageDir === 'dnd') {
      assert.equal(typeof esm.SortableList, 'object')
    }
  })
}

test('components generated module roots retain CSS side effects while JavaScript can tree shake', async () => {
  const esmPackage = JSON.parse(await readFile(path.join(workspaceRoot, 'packages/components/es/package.json'), 'utf8'))
  const cjsPackage = JSON.parse(await readFile(path.join(workspaceRoot, 'packages/components/lib/package.json'), 'utf8'))
  assert.deepEqual(esmPackage.sideEffects, ['**/*.css'])
  assert.deepEqual(cjsPackage.sideEffects, ['**/*.css'])
})

test('dnd package exports resolve consumer types for business records and standalone values', async (t) => {
  const fixtureDir = await mkdtemp(path.join(tmpdir(), 'aheart-dnd-types-'))
  t.after(() => rm(fixtureDir, { recursive: true, force: true }))
  const fixtureModules = path.join(fixtureDir, 'node_modules')
  await mkdir(path.join(fixtureModules, '@aheart-ui'), { recursive: true })
  await symlink(path.join(workspaceRoot, 'packages/dnd'), path.join(fixtureModules, '@aheart-ui/dnd'), 'dir')
  await symlink(path.join(workspaceRoot, 'packages/dnd/node_modules/vue'), path.join(fixtureModules, 'vue'), 'dir')
  await writeFile(path.join(fixtureDir, 'consumer.vue'), `<script setup lang="ts">
import { SortableItem, SortableList, type SortableHandleProps } from '@aheart-ui/dnd'
import { ref } from 'vue'

interface Task {
  id: string
  title: string
}

type SortableItemInstance = InstanceType<typeof SortableItem>
const items = ref<Task[]>([{ id: 'task-1', title: 'Task' }])
const sortableItemRef = ref<SortableItemInstance>()
const useHandle = (_props: SortableHandleProps) => undefined
const handleChange = (_items: Task[]) => undefined
</script>

<template>
  <SortableList v-model:items="items" item-key="id" @change="handleChange">
    <template #item="{ item, handleProps }">
      <button v-bind="handleProps" @click="useHandle(handleProps)">{{ item.title }}</button>
    </template>
  </SortableList>
  <SortableItem ref="sortableItemRef" :item="items[0]!" :index="0">
    <template #default="{ item }">{{ item }}</template>
  </SortableItem>
  <SortableItem item="legacy-value" :index="0">
    <template #default="{ item }">{{ item }}</template>
  </SortableItem>
</template>
`)
  await writeFile(path.join(fixtureDir, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      baseUrl: '.',
      lib: ['ESNext', 'DOM'],
      module: 'ESNext',
      moduleResolution: 'Bundler',
      skipLibCheck: true,
      strict: true,
      target: 'ES2020'
    },
    files: ['consumer.vue']
  }))

  await run(path.join(workspaceRoot, 'node_modules/.bin/vue-tsc'), ['--noEmit', '-p', path.join(fixtureDir, 'tsconfig.json')])
})
