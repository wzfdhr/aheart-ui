import { expect, test, type Page } from '@playwright/test'

const unhandledRejectionsKey = '__qg3FeedbackUnhandledRejections__'
const runtimeErrors = new WeakMap<Page, string[]>()

const collectRuntimeErrors = async (page: Page) => {
  const errors: string[] = []
  runtimeErrors.set(page, errors)

  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error' || (message.type() === 'warning' && message.text().includes('[Vue warn]'))) {
      errors.push(`console ${message.type()}: ${message.text()}`)
    }
  })
  await page.addInitScript((key) => {
    window.addEventListener('unhandledrejection', (event) => {
      const target = window as typeof window & { [unhandledRejectionsKey]?: string[] }
      target[key] ??= []
      target[key].push(String(event.reason))
    })
  }, unhandledRejectionsKey)
}

const expectNoRuntimeErrors = async (page: Page) => {
  const errors = runtimeErrors.get(page) ?? []
  const unhandledRejections = await page.evaluate((key) => {
    const target = window as typeof window & { [unhandledRejectionsKey]?: string[] }
    return target[key] ?? []
  }, unhandledRejectionsKey)

  expect([...errors, ...unhandledRejections]).toEqual([])
}

test.beforeEach(async ({ page }) => {
  await collectRuntimeErrors(page)
})

test.afterEach(async ({ page }) => {
  await expectNoRuntimeErrors(page)
})

test('Message workbench exercises real service entry, updates, stacking, destroy, and reset', async ({ page }) => {
  await page.goto('/components/message')
  const workbench = page.getByRole('region', { name: '消息服务交互工作台' })
  await expect(workbench).toBeVisible()

  await workbench.getByRole('button', { name: '成功', exact: true }).click()
  await expect(page.getByTestId('message-service-container').getByRole('status').filter({ hasText: '成功' })).toBeVisible()

  await workbench.getByRole('button', { name: '开始任务', exact: true }).click()
  await workbench.getByRole('button', { name: '完成任务', exact: true }).click()
  await expect(page.getByTestId('message-service-container').getByRole('status').filter({ hasText: '已上传' })).toHaveCount(1)
  await expect(page.getByTestId('message-service-container').getByRole('status').filter({ hasText: '上传中' })).toHaveCount(0)

  await workbench.getByRole('button', { name: '堆叠阈值', exact: true }).click()
  await expect(workbench.getByText('+2', { exact: true })).toBeVisible()

  await workbench.getByRole('button', { name: '准备单条', exact: true }).click()
  const messageContainer = page.getByTestId('message-service-container')
  await expect(messageContainer.getByRole('status').filter({ hasText: '第一条提示' })).toBeVisible()
  await expect(messageContainer.getByRole('status').filter({ hasText: '第二条提示' })).toBeVisible()
  await workbench.getByRole('button', { name: '关闭单条', exact: true }).click()
  await expect(workbench.getByText('第一条提示', { exact: true })).toHaveCount(0)
  await expect(messageContainer.getByRole('status').filter({ hasText: '第二条提示' })).toBeVisible()
  await workbench.getByRole('button', { name: '关闭全部', exact: true }).click()
  await expect(messageContainer.getByRole('status')).toHaveCount(0)

  await workbench.getByRole('button', { name: '已配置提示', exact: true }).click()
  const configuredMessage = messageContainer.getByRole('status').filter({ hasText: '已配置提示' })
  await expect(configuredMessage).toBeVisible()
  await expect(configuredMessage.locator('..')).toHaveCSS('top', '32px')
  await workbench.getByRole('button', { name: '重置配置', exact: true }).click()
  const resetMessage = messageContainer.getByRole('status').filter({ hasText: '已重置提示' })
  await expect(resetMessage).toBeVisible()
  await expect(resetMessage.locator('..')).toHaveCSS('top', '8px')
  await expectNoRuntimeErrors(page)
})

test('Modal workbench covers async success, failure recovery, Escape focus, and controlled close rejection', async ({ page }) => {
  await page.goto('/components/modal')
  const workbench = page.getByRole('region', { name: '对话框交互工作台' })
  await expect(workbench).toBeVisible()

  const opener = workbench.getByRole('button', { name: '打开异步对话框', exact: true })
  await opener.click()
  const dialog = page.getByRole('dialog', { name: '异步确认' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('button').first()).toBeFocused()
  await expect(dialog.getByRole('button', { name: '模拟失败', exact: true })).toHaveCSS('border-style', 'solid')
  await expect(dialog.getByRole('button', { name: '模拟失败', exact: true })).toHaveCSS('min-height', '40px')

  await dialog.getByRole('button', { name: /确\s*定/ }).click()
  await expect(dialog.getByRole('button', { name: /确\s*定/ })).toBeDisabled()
  await expect(dialog.getByRole('button', { name: /确\s*定/ })).toHaveAttribute('aria-busy', 'true')

  await dialog.getByRole('button', { name: '模拟失败', exact: true }).press('Escape')
  await expect(dialog).toBeHidden()
  await expect(opener).toBeFocused()
  await expect(workbench.getByText('准备就绪：等待一次真实对话框操作', { exact: true })).toBeVisible()

  await opener.click()
  const reopenedDialog = page.getByRole('dialog', { name: '异步确认' })
  await expect(reopenedDialog).toBeVisible()
  await expect(reopenedDialog.getByRole('button', { name: /确\s*定/ })).toBeEnabled()
  await expect(reopenedDialog.getByRole('button', { name: /确\s*定/ })).not.toHaveAttribute('aria-busy', 'true')
  await reopenedDialog.getByRole('button', { name: /确\s*定/ }).click()
  await expect(reopenedDialog.getByRole('button', { name: /确\s*定/ })).toBeDisabled()
  await reopenedDialog.getByRole('button', { name: /Close|关闭/ }).click()
  await expect(reopenedDialog).toBeHidden()
  await expect(opener).toBeFocused()

  await opener.click()
  const resolvedDialog = page.getByRole('dialog', { name: '异步确认' })
  await expect(resolvedDialog).toBeVisible()
  await resolvedDialog.getByRole('button', { name: /确\s*定/ }).click()
  await expect(resolvedDialog.getByRole('button', { name: /确\s*定/ })).toBeDisabled()
  await expect(resolvedDialog.getByRole('button', { name: /确\s*定/ })).toHaveAttribute('aria-busy', 'true')
  await page.getByRole('button', { name: '模拟成功', exact: true }).click()
  await expect(resolvedDialog).toBeHidden()

  await workbench.getByRole('button', { name: '打开异步对话框', exact: true }).click()
  const failedDialog = page.getByRole('dialog', { name: '异步确认' })
  await failedDialog.getByRole('button', { name: /确\s*定/ }).click()
  await page.getByRole('button', { name: '模拟失败', exact: true }).click()
  await expect(failedDialog.getByRole('alert')).toContainText('保存失败，请重试或关闭对话框。')
  await expect(failedDialog.getByRole('button', { name: /确\s*定/ })).toBeEnabled()
  await expect(failedDialog.getByRole('button', { name: /确\s*定/ })).not.toHaveAttribute('aria-busy', 'true')
  const retryButton = failedDialog.getByRole('button', { name: '重试保存', exact: true })
  await expect(retryButton).toBeVisible()
  await retryButton.click()
  await expect(failedDialog.getByRole('button', { name: /确\s*定/ })).toBeDisabled()
  await expect(failedDialog.getByRole('button', { name: /确\s*定/ })).toHaveAttribute('aria-busy', 'true')
  await page.getByRole('button', { name: '模拟成功', exact: true }).click()
  await expect(failedDialog).toBeHidden()

  await opener.click()
  const cancelledDialog = page.getByRole('dialog', { name: '异步确认' })
  await cancelledDialog.getByRole('button', { name: /确\s*定/ }).click()
  await expect(cancelledDialog.getByRole('button', { name: /确\s*定/ })).toBeDisabled()
  await cancelledDialog.getByRole('button', { name: '模拟失败', exact: true }).press('Escape')
  await expect(cancelledDialog).toBeHidden()
  await expect(opener).toBeFocused()

  const guardedOpener = workbench.getByRole('button', { name: '打开受控对话框', exact: true })
  await guardedOpener.click()
  const guardedDialog = page.getByRole('dialog', { name: '受控对话框' })
  await expect(guardedDialog.locator('button').first()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(guardedDialog).toBeVisible()
  await expect(guardedDialog).toContainText('受控关闭已拒绝')
  await expect(guardedDialog.locator('button').first()).toBeFocused()
  await expectNoRuntimeErrors(page)
})
