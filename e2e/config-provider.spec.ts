import { expect, test } from '@playwright/test'

const unhandledRejectionsKey = '__qg3ConfigProviderUnhandledRejections__'

test('ConfigProvider workbench updates real descendants across locale, size, disabled, theme, and nesting', async ({ page }) => {
  const runtimeErrors: string[] = []

  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error' || (message.type() === 'warning' && message.text().includes('[Vue warn]'))) {
      runtimeErrors.push(`console ${message.type()}: ${message.text()}`)
    }
  })
  await page.addInitScript((key) => {
    window.addEventListener('unhandledrejection', (event) => {
      const target = window as typeof window & { [unhandledRejectionsKey]?: string[] }
      target[key] = [...(target[key] ?? []), String(event.reason)]
    })
  }, unhandledRejectionsKey)

  await page.goto('/components/config-provider')

  const workbench = page.getByRole('region', { name: '全局配置交互工作台', exact: true })
  await expect(workbench).toBeVisible()

  await expect(workbench.getByRole('button', { name: '主要操作', exact: true })).toBeVisible()
  await expect(workbench.getByText('暂无数据', { exact: true })).toBeVisible()
  await expect(workbench.getByRole('navigation', { name: '分页', exact: true })).toBeVisible()

  const primaryButton = workbench.getByRole('button', { name: '主要操作', exact: true })
  const initialButtonBox = await primaryButton.boundingBox()
  expect(initialButtonBox).not.toBeNull()

  await workbench.getByRole('button', { name: 'English', exact: true }).click()
  await expect(workbench.getByText('No Data', { exact: true })).toBeVisible()
  await expect(workbench.getByRole('navigation', { name: 'pagination', exact: true })).toContainText('Total 42 items')

  await workbench.getByRole('combobox', { name: '组件尺寸', exact: true }).selectOption('small')
  await expect(workbench.getByTestId('config-state')).toContainText('size=small')
  await expect(primaryButton).toHaveClass(/aheart-button--small/)
  const smallButtonBox = await primaryButton.boundingBox()
  expect(smallButtonBox).not.toBeNull()
  expect(smallButtonBox!.height).toBeLessThan(initialButtonBox!.height)

  await workbench.getByRole('checkbox', { name: '全局禁用', exact: true }).check()
  await expect(primaryButton).toBeDisabled()

  const primaryBackgroundBeforeTheme = await primaryButton.evaluate((element) => getComputedStyle(element).backgroundColor)
  await workbench.getByRole('checkbox', { name: '自定义主题', exact: true }).check()
  await expect(workbench.getByTestId('config-state')).toContainText('theme=custom')
  await expect.poll(() => primaryButton.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(primaryBackgroundBeforeTheme)

  const outer = workbench.getByRole('region', { name: '外层配置', exact: true })
  const inner = workbench.getByRole('region', { name: '内层覆盖', exact: true })
  const sibling = workbench.getByRole('region', { name: '外层同级', exact: true })
  await expect(inner).toContainText('inner-size=small')
  await expect(inner).toContainText('inner-locale=English')
  await expect(sibling).toContainText('outer-locale=English')
  await expect(inner.locator('.aheart-empty__description')).toHaveText('No Data')
  await expect(inner.locator('.aheart-button')).toHaveClass(/aheart-button--small/)
  await expect(inner.locator('.aheart-button')).toBeEnabled()
  await expect(inner.locator('.aheart-pagination')).toHaveAttribute('aria-label', 'pagination')
  await expect(sibling.locator('.aheart-empty__description')).toHaveText('No Data')
  await expect(sibling.locator('.aheart-button')).toHaveClass(/aheart-button--large/)
  await expect(sibling.locator('.aheart-button')).toBeDisabled()
  await expect(sibling.locator('.aheart-pagination')).toHaveAttribute('aria-label', 'pagination')
  await expect(outer).toBeVisible()

  const unhandledRejections = await page.evaluate((key) => {
    const target = window as typeof window & { [unhandledRejectionsKey]?: string[] }
    return target[key] ?? []
  }, unhandledRejectionsKey)
  expect([...runtimeErrors, ...unhandledRejections]).toEqual([])
})
