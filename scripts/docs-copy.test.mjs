import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docsRoot = path.join(root, 'docs')

test('Chinese docs shell and component status copy stay localized', async () => {
  const [config, overview, workbench, execution, componentFiles] = await Promise.all([
    readFile(path.join(docsRoot, '.vitepress/config.ts'), 'utf8'),
    readFile(path.join(docsRoot, '.vitepress/theme/ComponentOverview.vue'), 'utf8'),
    readFile(path.join(root, 'packages/ai/src/agent-workbench.vue'), 'utf8'),
    readFile(path.join(root, 'packages/ai/src/agent-execution.vue'), 'utf8'),
    readdir(path.join(docsRoot, 'components'))
  ])
  const componentDocs = await Promise.all(componentFiles.filter((file) => file.endsWith('.md') && file !== 'overview.md').map(async (file) => ({
    file,
    content: await readFile(path.join(docsRoot, 'components', file), 'utf8')
  })))

  assert.match(config, /outline:\s*\{\s*label:\s*'本页内容'\s*\}/)
  assert.match(config, /sidebarMenuLabel:\s*'菜单'/)
  assert.match(config, /returnToTopLabel:\s*'返回顶部'/)
  assert.match(config, /skipToContentLabel:\s*'跳至正文'/)
  assert.match(config, /lastUpdated:\s*\{\s*text:\s*'最后更新'\s*\}/)
  assert.match(config, /docFooter:\s*\{\s*prev:\s*'上一页',\s*next:\s*'下一页'\s*\}/)
  assert.match(overview, />组件系统\s*\/\s*中文站</)
  assert.doesNotMatch(overview, /COMPONENT SYSTEM\s*\/\s*CN/)
  assert.match(workbench, />智能工作区</)
  assert.doesNotMatch(workbench, />AGENT WORKSPACE</)
  assert.match(execution, />执行流程</)
  assert.match(execution, />产物输出</)
  assert.doesNotMatch(execution, />EXECUTION</)
  assert.doesNotMatch(execution, />OUTPUTS</)

  for (const { file, content } of componentDocs) {
    const title = content.split('\n').find((line) => line.startsWith('# ')) ?? ''
    assert.doesNotMatch(title, /aheart-status--ready">Ready<\/span>/, file)
    assert.match(title, /aheart-status--ready">已完成<\/span>/, file)
  }
})
