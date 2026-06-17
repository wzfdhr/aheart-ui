import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Aheart UI',
  description: 'Vue 3 component library',
  srcExclude: ['superpowers/**'],
  themeConfig: {
    nav: [{ text: '组件', link: '/components/button' }],
    sidebar: [
      {
        text: '组件',
        items: [{ text: 'Button 按钮', link: '/components/button' }]
      }
    ]
  }
})
