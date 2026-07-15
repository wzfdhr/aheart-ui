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

test('mobile workbench tabs provide 40px targets and arrow-key activation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile')
  await page.goto('/components/ai-agent-workbench')

  const mobile = page.locator('.aheart-ai-workbench__mobile')
  const tabs = mobile.getByRole('tab')
  for (const tab of await tabs.all()) {
    const box = await tab.boundingBox()
    expect(box?.height).toBeGreaterThanOrEqual(40)
  }

  const chat = mobile.getByRole('tab', { name: '对话' })
  const execution = mobile.getByRole('tab', { name: '执行' })
  await chat.focus()
  await chat.press('ArrowRight')
  await expect(execution).toBeFocused()
  await expect(execution).toHaveAttribute('aria-selected', 'true')
  await expect(mobile.getByRole('button', { name: '查看执行与产物' })).toBeVisible()
  await mobile.getByRole('button', { name: '查看执行与产物' }).click()
  const drawer = page.getByRole('dialog', { name: '执行与产物' })
  await expect(drawer).toBeVisible()
  await expect(drawer).not.toContainText('EXECUTION')
  await expect(drawer).not.toContainText('OUTPUTS')

  await execution.press('ArrowLeft')
  await expect(chat).toBeFocused()
  await expect(chat).toHaveAttribute('aria-selected', 'true')
})
