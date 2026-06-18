import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Aheart UI',
  description: 'A Vue 3 component library for product interfaces',
  srcExclude: ['superpowers/**'],
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#1677ff' }],
    ['meta', { property: 'og:title', content: 'Aheart UI' }],
    ['meta', { property: 'og:description', content: 'A Vue 3 component library for product interfaces' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/overview' },
      { text: 'GitHub', link: 'https://github.com/wzfdhr/aheart-ui' },
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
      { icon: 'github', link: 'https://github.com/wzfdhr/aheart-ui' }
    ],
    search: {
      provider: 'local'
    }
  }
})
