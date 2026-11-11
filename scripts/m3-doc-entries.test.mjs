import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { qualityMatrix } from '../docs/.vitepress/data/quality-matrix.mjs'
import { getComponentEntries } from '../packages/build/package-entries.mjs'
import { packageContracts } from './release-contract.mjs'

const read = (name) => readFile(new URL(`../${name}`, import.meta.url), 'utf8')

test('M3 public import examples match the shared release entry contract', async () => {
  for (const file of ['docs/guide/m3-migration.md', 'docs/guide/on-demand.md', 'packages/ai/README.md', 'packages/dnd/README.md']) {
    const text = await read(file)
    for (const [, request] of text.matchAll(/(?:from|import)\s+['"]([^'"]+)['"]/g)) {
      const contract = packageContracts.find(({ name }) => request.startsWith(`${name}/`))
      if (!contract) continue
      const entry = `.${request.slice(contract.name.length)}`
      const legacyStyle = entry === './style.css'
      assert.ok(legacyStyle || Object.hasOwn(contract.expectedExports, entry), `${file}: missing ${request}`)
    }
  }
})

test('candidate navigation links to the migration guide and its scenario anchors', async () => {
  const [config, guide, ai, dnd] = await Promise.all([
    read('docs/.vitepress/config.ts'), read('docs/guide/m3-migration.md'),
    read('docs/ai/overview.md'), read('docs/dnd/overview.md')
  ])
  assert.match(config, /link: '\/guide\/m3-migration'/)
  for (const [page, name] of [[ai, 'AI'], [dnd, 'DND']]) {
    assert.ok(page.includes(`../guide/m3-migration#${name.toLowerCase()}`))
    assert.ok(guide.split('\n').includes(`## ${name}`))
  }
})

test('documented component and scenario subpaths have quality matrix coverage', async () => {
  const examples = [
    ...getComponentEntries('base').map(({ subpath }) => ['aheart-ui', subpath, subpath]),
    ['@aheart-ui/ai', 'chat', 'ai'],
    ['@aheart-ui/ai', 'agent', 'ai-form'],
    ['@aheart-ui/ai', 'workbench', 'ai-agent-workbench'],
    ['@aheart-ui/dnd', 'sortable', 'dnd']
  ]
  for (const [packageName, subpath, component] of examples) {
    const { expectedExports } = packageContracts.find(({ name }) => name === packageName)
    assert.ok(Object.hasOwn(expectedExports, `./${subpath}`), `${packageName}/${subpath}`)
    assert.ok(qualityMatrix.some(record => record.component === component && record.package === packageName), component)
    assert.ok(await read(`docs/components/${component}.md`))
  }
})
