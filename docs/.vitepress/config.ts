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
  { text: 'DatePicker 日期选择器', link: '/components/date-picker' },
  { text: 'TimePicker 时间选择器', link: '/components/time-picker' },
  { text: 'Upload 上传', link: '/components/upload' },
  { text: 'Tree 树形控件', link: '/components/tree' },
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
    }
  }
})
