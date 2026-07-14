import { defineConfig } from 'vitepress'

const githubLink = 'https://github.com/wzfdhr/aheart-ui'

const zhComponentItems = [
  { text: '组件总览', link: '/components/overview' },
  { text: 'Button 按钮', link: '/components/button' },
  { text: 'ConfigProvider 全局配置', link: '/components/config-provider' },
  { text: 'Icon 图标', link: '/components/icon' },
  { text: 'Typography 排版', link: '/components/typography' },
  { text: 'Space 间距', link: '/components/space' },
  { text: 'Divider 分割线', link: '/components/divider' },
  { text: 'Splitter 分割面板', link: '/components/splitter' },
  { text: 'Flex 弹性布局', link: '/components/flex' },
  { text: 'Grid 栅格', link: '/components/grid' },
  { text: 'Tag 标签', link: '/components/tag' },
  { text: 'Badge 徽标', link: '/components/badge' },
  { text: 'Alert 警告提示', link: '/components/alert' },
  { text: 'Message 全局提示', link: '/components/message' },
  { text: 'Modal 对话框', link: '/components/modal' },
  { text: 'Drawer 抽屉', link: '/components/drawer' },
  { text: 'Tooltip 文字提示', link: '/components/tooltip' },
  { text: 'Popover 气泡卡片', link: '/components/popover' },
  { text: 'Popconfirm 气泡确认框', link: '/components/popconfirm' },
  { text: 'Spin 加载中', link: '/components/spin' },
  { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
  { text: 'Empty 空状态', link: '/components/empty' },
  { text: 'Tabs 标签页', link: '/components/tabs' },
  { text: 'Breadcrumb 面包屑', link: '/components/breadcrumb' },
  { text: 'Dropdown 下拉菜单', link: '/components/dropdown' },
  { text: 'Menu 导航菜单', link: '/components/menu' },
  { text: 'Steps 步骤条', link: '/components/steps' },
  { text: 'Input 输入框', link: '/components/input' },
  { text: 'Textarea 文本域', link: '/components/textarea' },
  { text: 'InputNumber 数字输入框', link: '/components/input-number' },
  { text: 'Checkbox 多选框', link: '/components/checkbox' },
  { text: 'Radio 单选框', link: '/components/radio' },
  { text: 'Switch 开关', link: '/components/switch' },
  { text: 'Card 卡片', link: '/components/card' },
  { text: 'Descriptions 描述列表', link: '/components/descriptions' },
  { text: 'Table 表格', link: '/components/table' },
  { text: 'Pagination 分页', link: '/components/pagination' },
  { text: 'Select 选择器', link: '/components/select' },
  { text: 'Form 表单', link: '/components/form' }
]

const enComponentItems = [
  { text: 'Overview', link: '/en/components/overview' },
  { text: 'Button', link: '/en/components/button' },
  { text: 'ConfigProvider', link: '/en/components/config-provider' },
  { text: 'Icon', link: '/en/components/icon' },
  { text: 'Typography', link: '/en/components/typography' },
  { text: 'Space', link: '/en/components/space' },
  { text: 'Divider', link: '/en/components/divider' },
  { text: 'Splitter', link: '/en/components/splitter' },
  { text: 'Flex', link: '/en/components/flex' },
  { text: 'Grid', link: '/en/components/grid' },
  { text: 'Tag', link: '/en/components/tag' },
  { text: 'Badge', link: '/en/components/badge' },
  { text: 'Alert', link: '/en/components/alert' },
  { text: 'Message', link: '/en/components/message' },
  { text: 'Modal', link: '/en/components/modal' },
  { text: 'Drawer', link: '/en/components/drawer' },
  { text: 'Tooltip', link: '/en/components/tooltip' },
  { text: 'Popover', link: '/en/components/popover' },
  { text: 'Popconfirm', link: '/en/components/popconfirm' },
  { text: 'Spin', link: '/en/components/spin' },
  { text: 'Skeleton', link: '/en/components/skeleton' },
  { text: 'Empty', link: '/en/components/empty' },
  { text: 'Tabs', link: '/en/components/tabs' },
  { text: 'Breadcrumb', link: '/en/components/breadcrumb' },
  { text: 'Dropdown', link: '/en/components/dropdown' },
  { text: 'Menu', link: '/en/components/menu' },
  { text: 'Steps', link: '/en/components/steps' },
  { text: 'Input', link: '/en/components/input' },
  { text: 'Textarea', link: '/en/components/textarea' },
  { text: 'InputNumber', link: '/en/components/input-number' },
  { text: 'Checkbox', link: '/en/components/checkbox' },
  { text: 'Radio', link: '/en/components/radio' },
  { text: 'Switch', link: '/en/components/switch' },
  { text: 'Card', link: '/en/components/card' },
  { text: 'Descriptions', link: '/en/components/descriptions' },
  { text: 'Table', link: '/en/components/table' },
  { text: 'Pagination', link: '/en/components/pagination' },
  { text: 'Select', link: '/en/components/select' },
  { text: 'Form', link: '/en/components/form' }
]

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
                { text: '主题 Token', link: '/guide/theme' },
                { text: '发布', link: '/guide/releasing' }
              ]
            }
          ],
          '/components/': [
            {
              text: '组件',
              items: zhComponentItems
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
                { text: 'Theme Tokens', link: '/en/guide/theme' },
                { text: 'Release', link: '/en/guide/releasing' }
              ]
            }
          ],
          '/en/components/': [
            {
              text: 'Components',
              items: enComponentItems
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
