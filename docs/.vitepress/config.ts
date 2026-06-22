import { defineConfig } from 'vitepress'

const githubLink = 'https://github.com/wzfdhr/aheart-ui'

export default defineConfig({
  title: 'Aheart UI',
  description: '面向产品界面的 Vue 3 组件库',
  srcExclude: ['superpowers/**'],
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#1677ff' }],
    ['meta', { property: 'og:title', content: 'Aheart UI' }],
    ['meta', { property: 'og:description', content: '面向产品界面的 Vue 3 组件库' }]
  ],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Aheart UI',
      description: '面向产品界面的 Vue 3 组件库',
      themeConfig: {
        logo: '/logo.svg',
        nav: [
          { text: '指南', link: '/guide/introduction' },
          { text: '组件', link: '/components/overview' },
          { text: 'English', link: '/en/' },
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
                { text: '主题 Token', link: '/guide/theme' }
              ]
            }
          ],
          '/components/': [
            {
              text: '组件',
              items: [
                { text: '组件总览', link: '/components/overview' },
                { text: 'Button 按钮', link: '/components/button' }
              ]
            }
          ]
        },
        socialLinks: [
          { icon: 'github', link: githubLink }
        ],
        search: {
          provider: 'local'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'Aheart UI',
      description: 'A Vue 3 component library for product interfaces',
      themeConfig: {
        logo: '/logo.svg',
        nav: [
          { text: 'Guide', link: '/en/guide/introduction' },
          { text: 'Components', link: '/en/components/overview' },
          { text: '简体中文', link: '/' },
          { text: 'GitHub', link: githubLink },
          { text: 'v1.0.0', link: '/en/guide/installation' }
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'Introduction', link: '/en/guide/introduction' },
                { text: 'Installation', link: '/en/guide/installation' },
                { text: 'Usage', link: '/en/guide/usage' },
                { text: 'Theme Tokens', link: '/en/guide/theme' }
              ]
            }
          ],
          '/en/components/': [
            {
              text: 'Components',
              items: [
                { text: 'Overview', link: '/en/components/overview' },
                { text: 'Button', link: '/en/components/button' }
              ]
            }
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
