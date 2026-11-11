import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { Plugin } from 'vitepress'
import ai from '../../packages/ai/package.json'
import core from '../../packages/components/package.json'
import dnd from '../../packages/dnd/package.json'
import { getComponentCategories, getComponentDocumentContext } from './data/components'

const indexPath = 'ai/search-index.json'
const skillPath = 'ai/aheart-ui/SKILL.md'

function getAssets() {
  const assets = new Map<string, string | URL>()
  const englishByKey = new Map(getComponentCategories('en').flatMap(({ components }) =>
    components.map((component) => [component.key, component] as const)))
  const components = getComponentCategories('zh').flatMap((category) => category.components
    .filter(({ status }) => status === 'Ready')
    .map((component) => {
      const { key, name, zhName, description, link } = component
      const context = link && getComponentDocumentContext(link, 'zh')
      if (!link || !context) throw new Error(`Missing documentation for AI index entry: ${key}`)

      const markdownPath = `components/${key}.md`
      assets.set(`ai/${markdownPath}`, new URL(`..${link}.md`, import.meta.url))
      return {
        key,
        name,
        zhName,
        description,
        descriptionEn: englishByKey.get(key)?.description,
        category: category.name,
        packageName: context.packageName,
        docsPath: `..${link}.html`,
        markdownPath
      }
    }))

  assets.set(indexPath, `${JSON.stringify({
    schemaVersion: 1,
    framework: 'Vue 3',
    packages: Object.fromEntries([core, ai, dnd].map(({ name, version }) => [name, {
      documentedVersion: version,
      styleImport: `${name}/style.css`
    }])),
    components
  }, null, 2)}\n`)
  assets.set(skillPath, new URL('../../skills/aheart-ui/SKILL.md', import.meta.url))
  assets.set('llms.txt', `# Aheart UI

> 面向 Vue 3 AI 产品与专业后台的组件体系。

## AI 接入

- [AI 接入指南](guide/ai-integration.html)
- [组件检索索引](ai/search-index.json): 组件名称、用途、所属 npm 包和 Markdown 文档路径。
- [Aheart UI Skill](ai/aheart-ui/SKILL.md)

## 使用文档

- [安装](guide/installation.html)
- [使用](guide/usage.html)
- [主题 Token](guide/theme.html)
`)
  return assets
}

export async function writeAiAssets(outDir: string) {
  await Promise.all([...getAssets()].map(async ([path, source]) => {
    const target = join(outDir, path)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, typeof source === 'string' ? source : await readFile(source))
  }))
}

export function serveAiAssets(): Plugin {
  return {
    name: 'aheart-ai-assets',
    apply: 'serve',
    configureServer(server) {
      const assets = getAssets()
      const base = server.config.base
      server.middlewares.use(async (request, response, next) => {
        const pathname = request.url?.split('?')[0] ?? ''
        if (!pathname.startsWith(base) || (request.method !== 'GET' && request.method !== 'HEAD')) return next()

        const path = pathname.slice(base.length)
        const source = assets.get(path)
        if (source === undefined) return next()

        try {
          const body = typeof source === 'string' ? source : await readFile(source)
          const mime = path.endsWith('.json') ? 'application/json' : path.endsWith('.md') ? 'text/markdown' : 'text/plain'
          response.setHeader('Content-Type', `${mime}; charset=utf-8`)
          response.end(request.method === 'HEAD' ? undefined : body)
        } catch (error) {
          next(error)
        }
      })
    }
  }
}
