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

  await workbench.getByRole('button', { name: 'Success', exact: true }).click()
  await expect(page.getByRole('status', { name: 'Message: Success' })).toBeVisible()

  await workbench.getByRole('button', { name: 'Start keyed', exact: true }).click()
  await workbench.getByRole('button', { name: 'Finish keyed', exact: true }).click()
  await expect(page.getByRole('status', { name: 'Message: Uploaded' })).toHaveCount(1)
  await expect(page.getByRole('status', { name: 'Message: Uploading' })).toHaveCount(0)

  await workbench.getByRole('button', { name: 'Stack threshold', exact: true }).click()
  await expect(workbench.getByText('+2', { exact: true })).toBeVisible()

  await workbench.getByRole('button', { name: 'Close one', exact: true }).click()
  await expect(workbench.getByText('One message', { exact: true })).toHaveCount(0)
  await workbench.getByRole('button', { name: 'Close all', exact: true }).click()
  await expect(page.getByRole('status')).toHaveCount(0)

  await workbench.getByRole('button', { name: 'Configured message', exact: true }).click()
  await expect(page.getByRole('status').last().locator('..')).toHaveCSS('top', '32px')
  await workbench.getByRole('button', { name: 'Reset config', exact: true }).click()
  await expect(page.getByRole('status').last().locator('..')).toHaveCSS('top', '8px')
  await expectNoRuntimeErrors(page)
})

test('Modal workbench covers async success, failure recovery, Escape focus, and controlled close rejection', async ({ page }) => {
  await page.goto('/components/modal')
  const workbench = page.getByRole('region', { name: '对话框交互工作台' })
  await expect(workbench).toBeVisible()

  const opener = workbench.getByRole('button', { name: 'Open async modal', exact: true })
  await opener.click()
  const dialog = page.getByRole('dialog', { name: 'Async confirm' })
  await expect(dialog).toBeVisible()

  await dialog.getByRole('button', { name: /确\s*定/ }).click()
  await expect(dialog.getByRole('button', { name: /确\s*定/ })).toBeDisabled()
  await expect(dialog.getByRole('button', { name: /确\s*定/ })).toHaveAttribute('aria-busy', 'true')
  await workbench.getByRole('button', { name: 'Resolve success', exact: true }).click()
  await expect(dialog).toBeHidden()

  await workbench.getByRole('button', { name: 'Open async modal', exact: true }).click()
  const failedDialog = page.getByRole('dialog', { name: 'Async confirm' })
  await failedDialog.getByRole('button', { name: /确\s*定/ }).click()
  await workbench.getByRole('button', { name: 'Reject failure', exact: true }).click()
  await expect(failedDialog.getByRole('alert')).toContainText('保存失败')
  await expect(failedDialog.getByRole('button', { name: /确\s*定/ })).toBeEnabled()
  await expect(failedDialog.getByRole('button', { name: /确\s*定/ })).not.toHaveAttribute('aria-busy', 'true')

  await page.keyboard.press('Escape')
  await expect(failedDialog).toBeHidden()
  await expect(opener).toBeFocused()

  const guardedOpener = workbench.getByRole('button', { name: 'Open guarded modal', exact: true })
  await guardedOpener.click()
  const guardedDialog = page.getByRole('dialog', { name: 'Guarded modal' })
  await page.keyboard.press('Escape')
  await expect(guardedDialog).toBeVisible()
  await expect(guardedDialog).toContainText('受控关闭已拒绝')
  await expect(guardedDialog).toBeFocused()
  await expectNoRuntimeErrors(page)
})
