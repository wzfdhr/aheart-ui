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
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'ConfigProvider 全局配置', link: '/components/config-provider' },
            { text: 'Icon 图标', link: '/components/icon' },
            { text: 'Typography 排版', link: '/components/typography' },
            { text: 'Space 间距', link: '/components/space' },
            { text: 'Divider 分割线', link: '/components/divider' },
            { text: 'Flex 弹性布局', link: '/components/flex' },
            { text: 'Tag 标签', link: '/components/tag' },
            { text: 'Badge 徽标', link: '/components/badge' },
            { text: 'Alert 警告提示', link: '/components/alert' },
            { text: 'Spin 加载中', link: '/components/spin' },
            { text: 'Empty 空状态', link: '/components/empty' },
            { text: 'Tabs 标签页', link: '/components/tabs' },
            { text: 'Breadcrumb 面包屑', link: '/components/breadcrumb' },
            { text: 'Steps 步骤条', link: '/components/steps' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Textarea 文本域', link: '/components/textarea' },
            { text: 'InputNumber 数字输入框', link: '/components/input-number' },
            { text: 'Checkbox 多选框', link: '/components/checkbox' },
            { text: 'Radio 单选框', link: '/components/radio' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Card 卡片', link: '/components/card' },
            { text: 'Descriptions 描述列表', link: '/components/descriptions' },
            { text: 'Pagination 分页', link: '/components/pagination' }
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
