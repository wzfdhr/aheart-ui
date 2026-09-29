import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('GitHub Pages v2 product information architecture', () => {
  test('desktop top navigation separates product areas and landing pages', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop')
    await page.goto('/')

    const nav = page.locator('.VPNavBarMenu')
    for (const label of ['开始', '基础组件', '组合组件', 'AI 产品', '工程质量', 'v2（暂停）']) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible()
    }
    await expect(nav.getByText('扩展能力', { exact: true })).toBeVisible()
    await nav.getByText('扩展能力', { exact: true }).hover()
    for (const label of ['Motion', 'DND', 'Icons']) {
      await expect(page.getByRole('link', { name: label, exact: true })).toBeVisible()
    }
    await expect(nav.getByRole('link', { name: 'AI 产品', exact: true })).toHaveAttribute('href', /\/ai\/overview/)
    await expect(nav.getByRole('link', { name: 'v2（暂停）', exact: true })).toHaveAttribute('href', /\/roadmap\/v2/)

    await page.goto('/components/overview')
    await expect(page.getByRole('heading', { name: '基础组件' })).toBeVisible()
    await expect(page.locator('[data-catalog="core"]')).toBeVisible()
    await expect(page.locator('[data-domain="ai"]')).toHaveCount(0)
    await expect(page.locator('[data-domain="advanced"]')).toHaveCount(0)
    await expect(page.locator('a[href*="/components/form"]')).toHaveCount(0)
    await expect(page.locator('.aheart-component-overview__release')).toContainText('已发布')
  })

  test('each new product area has an independent landing and explicit state copy', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop')
    const pages = [
      { path: '/composed/overview', heading: '组合组件', text: 'Combobox' },
      { path: '/ai/overview', heading: 'AI 产品', text: 'Chat' },
      { path: '/motion/overview', heading: 'Motion', text: 'Presence' },
      { path: '/dnd/overview', heading: 'DND', text: '仓库预览' },
      { path: '/icons/overview', heading: 'Icons', text: '@aheart-ui/icons' },
      { path: '/roadmap/v2', heading: 'v2 路线图', text: 'M0' }
    ]

    for (const item of pages) {
      await page.goto(item.path)
      await expect(page.getByRole('heading', { name: item.heading, exact: true })).toBeVisible()
      await expect(page.locator('body')).toContainText(item.text)
    }

    await page.goto('/roadmap/v2')
    await expect(page.locator('body')).toContainText('v2 当前保持暂停')
    await expect(page.locator('body')).toContainText('M0–M8 均未启动')

    await page.goto('/ai/overview')
    await expect(page.locator('body')).toContainText('尚未公共 npm 发布')
    await expect(page.locator('body')).toContainText('M6')
    await page.goto('/dnd/overview')
    await expect(page.locator('body')).toContainText('尚未公共 npm 发布')
    await page.goto('/motion/overview')
    await expect(page.locator('body')).toContainText('Later')
  })

  test('legacy component routes remain compatible and use the matching domain sidebar', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop')
    await page.goto('/components/ai-agent-workbench')
    await expect(page.getByRole('heading', { level: 1, name: /AI Agent 工作台/ })).toBeVisible()
    await expect(page.locator('.aheart-component-context')).toContainText('@aheart-ui/ai')
    await expect(page.locator('.aheart-component-context')).toContainText('AI 产品')
    await expect(page.locator('.VPSidebar')).toContainText('AI')

    await page.goto('/components/dnd')
    await expect(page.getByRole('heading', { level: 1, name: /DnD 拖拽/ })).toBeVisible()
    await expect(page.locator('.VPSidebar')).toContainText('高级交互与工作区')
    await expect(page.locator('.VPSidebar')).toContainText('DnD 拖拽')

    await page.goto('/components/table')
    await expect(page.getByRole('heading', { level: 1, name: /Table/ })).toBeVisible()
    await expect(page.locator('.VPSidebar')).toContainText('组合组件')
    await expect(page.locator('.VPSidebar')).not.toContainText('基础组件总览')
    await expect(page.locator('.aheart-component-context')).toContainText('组合组件')

    await page.goto('/components/button')
    await expect(page.getByRole('heading', { level: 1, name: /Button/ })).toBeVisible()
    await expect(page.locator('.VPSidebar')).toContainText('基础组件')
  })

  test('mobile product landing keeps cards inside the viewport', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile')
    await page.goto('/ai/overview')
    const viewport = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    }))
    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
    await expect(page.getByRole('heading', { name: 'AI 产品' })).toBeVisible()
    await expect(page.locator('#chat').getByRole('heading', { name: 'Chat', exact: true })).toBeVisible()
  })

  test('product navigation does not overflow at compact desktop widths', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop')
    await page.setViewportSize({ width: 800, height: 900 })
    await page.goto('/ai/overview')

    const viewport = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    }))
    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
  })

  test('Chinese shell and state copy stay localized', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile shell copy check')
    await page.goto('/components/overview')
    await expect(page.locator('.aheart-component-overview__eyebrow')).toHaveText('基础组件 / 中文站')
    await expect(page.locator('.aheart-component-item .aheart-status').first()).toHaveText('当前可用 / 已验证')
    await expect(page.getByText('菜单', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: '返回顶部' })).toBeVisible()
    await expect(page.getByRole('link', { name: '跳至正文' })).toBeAttached()
  })

  test('product landing pages have no blocking automated accessibility findings', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop')
    const paths = ['/components/overview', '/composed/overview', '/ai/overview', '/motion/overview', '/dnd/overview', '/icons/overview', '/roadmap/v2']

    for (const path of paths) {
      await page.goto(path)
      const contentSelector = path === '/components/overview'
        ? '.aheart-component-overview'
        : path === '/roadmap/v2'
          ? '.aheart-roadmap'
          : '.aheart-product-area'
      const results = await new AxeBuilder({ page }).include(contentSelector).analyze()
      const blocking = results.violations.filter((violation) => violation.impact === 'critical' || violation.impact === 'serious')
      expect(blocking, `Blocking accessibility findings on ${path}`).toEqual([])
    }
  })
})
