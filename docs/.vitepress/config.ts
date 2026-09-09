import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { getComponentCatalogs, getCoreComponentSidebar } from './data/components'
import { getProductAreaSidebar } from './data/product-areas'

const githubLink = 'https://github.com/wzfdhr/aheart-ui'
// Local body from @iconify-json/simple-icons@1.2.86 keeps the docs offline and avoids Iconify CORS.
const githubSvg = fs.readFileSync(fileURLToPath(new URL('../public/github.svg', import.meta.url)), 'utf8')

const zhComponentItems = getCoreComponentSidebar('zh')
const composedSidebar = getProductAreaSidebar('composed')
const aiSidebar = getProductAreaSidebar('ai')
const dndSidebar = getProductAreaSidebar('dnd')
const composedDetailSidebars = Object.fromEntries(
  getComponentCatalogs('zh').composed.map((component) => [`/components/${component.key}`, composedSidebar])
)

export default defineConfig({
  base: process.env.AHEART_DOCS_BASE || '/',
  title: 'Aheart UI',
  lang: 'zh-CN',
  description: '面向 Vue 3 AI 产品与专业后台的组件体系',
  srcExclude: ['superpowers/**', 'en/**'],
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#1677ff' }],
    ['meta', { property: 'og:title', content: 'Aheart UI' }],
    ['meta', { property: 'og:description', content: '从基础组件到 Agent 工作台，构建可靠的 Vue 3 产品界面' }]
  ],
  vite: {
    ssr: {
      noExternal: ['@aheart-ui/ai', '@aheart-ui/dnd', '@atlaskit/pragmatic-drag-and-drop']
    }
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Aheart UI',
      description: '面向 Vue 3 AI 产品与专业后台的组件体系',
      themeConfig: {
        logo: '/logo.svg',
        outline: { label: '本页内容' },
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        skipToContentLabel: '跳至正文',
        lastUpdated: { text: '最后更新' },
        docFooter: { prev: '上一页', next: '下一页' },
        nav: [
          { text: '开始', link: '/guide/introduction' },
          { text: '基础组件', link: '/components/overview' },
          { text: '组合组件', link: '/composed/overview' },
          { text: 'AI 产品', link: '/ai/overview' },
          {
            text: '扩展能力',
            items: [
              { text: 'Motion', link: '/motion/overview' },
              { text: 'DND', link: '/dnd/overview' },
              { text: 'Icons', link: '/icons/overview' }
            ]
          },
          { text: '工程质量', link: '/guide/quality-matrix' },
          { text: 'v2 路线图', link: '/roadmap/v2' }
        ],
        sidebar: {
          '/guide/': [
            {
              text: '指南',
              items: [
                { text: '介绍', link: '/guide/introduction' },
                { text: '安装', link: '/guide/installation' },
                { text: '使用', link: '/guide/usage' },
                { text: '主题 Token', link: '/guide/theme' },
                { text: '质量矩阵', link: '/guide/quality-matrix' },
                { text: 'QG5 证据', link: '/guide/qg5-evidence' },
                { text: '发布', link: '/guide/releasing' }
              ]
            }
          ],
          '/components/ai': aiSidebar,
          '/components/dnd': dndSidebar,
          ...composedDetailSidebars,
          '/components/': [{ text: '基础组件总览', link: '/components/overview' }, ...zhComponentItems],
          '/composed/': composedSidebar,
          '/ai/': aiSidebar,
          '/motion/': getProductAreaSidebar('motion'),
          '/dnd/': dndSidebar,
          '/icons/': getProductAreaSidebar('icons'),
          '/roadmap/': [{ text: 'v2 路线图', link: '/roadmap/v2' }]
        },
        socialLinks: [
          { icon: { svg: githubSvg }, ariaLabel: 'GitHub', link: githubLink }
        ],
        search: {
          provider: 'local'
        }
      }
    }
  }
})
