import { expect, test } from '@playwright/test'

test('desktop workbench renders resizable three-pane layout', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop')
  await page.goto('/components/ai-agent-workbench')

  await expect(page.getByRole('heading', { name: 'AI Agent 工作台' })).toBeVisible()
  await expect(page.locator('.aheart-ai-workbench__desktop .aheart-splitter')).toBeVisible()
  await expect(page.locator('.aheart-ai-workbench__desktop [role="separator"]')).toHaveCount(2)
})

test('mobile workbench opens execution drawer from tabs', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile')
  await page.goto('/components/ai-agent-workbench')

  const mobile = page.locator('.aheart-ai-workbench__mobile')
  await mobile.getByRole('tab', { name: '执行' }).click()
  await mobile.getByRole('button', { name: '查看执行与产物' }).click()
  await expect(page.getByRole('dialog', { name: '执行与产物' })).toBeVisible()
})
