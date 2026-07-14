import { expect, test } from '@playwright/test'

test('desktop docs organizes components into eight capability domains', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop')
  await page.goto('/components/overview')

  await expect(page.getByRole('heading', { name: '组件总览' })).toBeVisible()
  await expect(page.locator('.aheart-component-domain')).toHaveCount(8)
  await expect(page.locator('[data-domain="advanced"]')).toContainText('Splitter')
  await expect(page.locator('[data-domain="ai"]')).toContainText('AI Agent 工作台')

  const forms = page.locator('.VPSidebarItem').filter({ hasText: '表单与选择' }).first()
  await expect(forms.locator('a').first()).toBeHidden()
  await forms.getByLabel('toggle section').click()
  await expect(forms.locator('.items')).toBeVisible()
})

test('component pages show product context and package ownership', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop')
  await page.goto('/components/ai-agent-workbench')

  const context = page.locator('.aheart-component-context')
  await expect(context).toContainText('智能产品能力')
  await expect(context).toContainText('任务组 · 对话与协作')
  await expect(context).toContainText('@aheart-ui/ai')
  await expect(context.getByRole('link')).toHaveCount(2)
})

test('mobile overview keeps capability domains readable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile')
  await page.goto('/components/overview')

  await expect(page.locator('.aheart-component-domain')).toHaveCount(8)
  const itemBoxes = await page.locator('.aheart-component-domain__items').first().locator('.aheart-component-item').evaluateAll(
    (items) => items.slice(0, 2).map((item) => item.getBoundingClientRect().top)
  )
  expect(itemBoxes[1]).toBeGreaterThan(itemBoxes[0])
})
