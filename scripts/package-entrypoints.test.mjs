import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdtemp, rm, symlink, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import test from 'node:test'

const require = createRequire(import.meta.url)
const packages = ['components', 'dnd', 'ai']
const workspaceRoot = fileURLToPath(new URL('..', import.meta.url))
const run = promisify(execFile)

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

test('dnd root types expose handles, type list records, and accept standalone values', async (t) => {
  const fixtureDir = await mkdtemp(path.join(tmpdir(), 'aheart-dnd-types-'))
  t.after(() => rm(fixtureDir, { recursive: true, force: true }))
  await symlink(path.join(workspaceRoot, 'node_modules'), path.join(fixtureDir, 'node_modules'), 'dir')
  await writeFile(path.join(fixtureDir, 'consumer.vue'), `<script setup lang="ts">
import { SortableItem, SortableList, type SortableHandleProps } from '@aheart-ui/dnd'

const items: Record<string, unknown>[] = [{ id: 'task-1', title: 'Task' }]
const useHandle = (_props: SortableHandleProps) => undefined
</script>

<template>
  <SortableList :items="items" item-key="id">
    <template #item="{ item, handleProps }">
      <button v-bind="handleProps" @click="useHandle(handleProps)">{{ item['title'] }}</button>
    </template>
  </SortableList>
  <SortableItem :item="items[0]" :index="0">
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
      moduleResolution: 'Node',
      paths: {
        '@aheart-ui/dnd': [path.join(workspaceRoot, 'packages/dnd/es/index.d.ts')]
      },
      skipLibCheck: true,
      strict: true,
      target: 'ES2020'
    },
    files: ['consumer.vue']
  }))

  await run(path.join(workspaceRoot, 'node_modules/.bin/vue-tsc'), ['--noEmit', '-p', path.join(fixtureDir, 'tsconfig.json')])
})
