import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsRoot = path.join(root, 'docs')

test('Chinese docs shell and component status copy stay localized', async () => {
  const [config, overview, workbench, componentFiles] = await Promise.all([
    readFile(path.join(docsRoot, '.vitepress/config.ts'), 'utf8'),
    readFile(path.join(docsRoot, '.vitepress/theme/ComponentOverview.vue'), 'utf8'),
    readFile(path.join(root, 'packages/ai/src/agent-workbench.vue'), 'utf8'),
    readdir(path.join(docsRoot, 'components'))
  ])
  const componentDocs = await Promise.all(componentFiles.filter((file) => file.endsWith('.md')).map(async (file) => ({
    file,
    content: await readFile(path.join(docsRoot, 'components', file), 'utf8')
  })))

  assert.match(config, /outline:\s*\{\s*label:\s*'本页内容'\s*\}/)
  assert.match(config, /sidebarMenuLabel:\s*'菜单'/)
  assert.match(overview, />组件系统\s*\/\s*中文站</)
  assert.doesNotMatch(overview, /COMPONENT SYSTEM\s*\/\s*CN/)
  assert.match(workbench, />智能工作区</)
  assert.doesNotMatch(workbench, />AGENT WORKSPACE</)
  assert.doesNotMatch(workbench, />EXECUTION</)
  assert.doesNotMatch(workbench, />OUTPUTS</)

  for (const { file, content } of componentDocs) {
    const title = content.split('\n', 1)[0] ?? ''
    assert.doesNotMatch(title, /aheart-status--ready">Ready<\/span>/, file)
    assert.match(title, /aheart-status--ready">已完成<\/span>/, file)
  }
})
