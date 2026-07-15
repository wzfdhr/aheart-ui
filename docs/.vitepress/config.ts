import { defineConfig } from 'vitepress'
import { getComponentSidebar } from './data/components'

const githubLink = 'https://github.com/wzfdhr/aheart-ui'

const zhComponentItems = getComponentSidebar('zh')

export default defineConfig({
  title: 'Aheart UI',
  description: '面向产品界面的 Vue 3 组件库',
  srcExclude: ['superpowers/**', 'en/**'],
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#1677ff' }],
    ['meta', { property: 'og:title', content: 'Aheart UI' }],
    ['meta', { property: 'og:description', content: '面向产品界面的 Vue 3 组件库' }]
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
      description: '面向产品界面的 Vue 3 组件库',
      themeConfig: {
        logo: '/logo.svg',
        outline: { label: '本页内容' },
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        skipToContentLabel: '跳至正文',
        lastUpdated: { text: '最后更新' },
        docFooter: { prev: '上一页', next: '下一页' },
        nav: [
          { text: '指南', link: '/guide/introduction' },
          { text: '组件', link: '/components/overview' },
          { text: 'GitHub', link: githubLink },
          { text: 'v1.0.0', link: '/guide/installation' }
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
                { text: '发布', link: '/guide/releasing' }
              ]
            }
          ],
          '/components/': [
            { text: '组件总览', link: '/components/overview' },
            ...zhComponentItems
          ]
        },
        socialLinks: [
          { icon: 'github', link: githubLink }
        ],
        search: {
          provider: 'local'
        }
      }
    }
  }
})
