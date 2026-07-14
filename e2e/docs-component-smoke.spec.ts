import { expect, test, type Page } from '@playwright/test'
import { getComponentDomains } from '../docs/.vitepress/data/components'

const readyComponentLinks = getComponentDomains('zh').flatMap((domain) =>
  domain.components.flatMap((component) =>
    component.status === 'Ready' && component.link ? [component.link] : []
  )
)

const collectRuntimeErrors = (page: Page) => {
  const errors: string[] = []

  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  return errors
}

test('component lists and tables are isolated from VitePress content styles', async ({ page }) => {
  const errors = collectRuntimeErrors(page)
  await page.goto('/components/menu')

  const horizontalDemo = page.locator('.menu-horizontal-dark-demo')
  const horizontalItem = horizontalDemo.locator('.aheart-menu__item').first()
  await expect(horizontalItem).toBeVisible()
  await expect(horizontalItem).toHaveCSS('list-style-type', 'none')
  await expect(horizontalItem).toHaveCSS('margin-top', '0px')
  await expect(horizontalDemo.locator('.aheart-menu')).toHaveCSS('background-color', 'rgb(0, 21, 41)')
  await expect(horizontalDemo.locator('.aheart-menu__list')).toHaveCSS('flex-direction', 'row')

  await page.goto('/components/tree')
  const treeNode = page.locator('.aheart-demo-panel .aheart-tree__treeitem').first()
  await expect(treeNode).toBeVisible()
  await expect(treeNode).toHaveCSS('list-style-type', 'none')

  await page.goto('/components/tree-select')
  await expect(page.locator('.aheart-demo-panel .aheart-tree-select').first()).toBeVisible()

  await page.goto('/components/table')
  const table = page.locator('.aheart-demo-panel .aheart-table table').first()
  await expect(table).toBeVisible()
  await expect(table).toHaveCSS('display', 'table')
  expect(errors).toEqual([])
})

test('form control demos update their visible state', async ({ page }) => {
  const errors = collectRuntimeErrors(page)

  await page.goto('/components/input-number')
  const numberDemo = page.locator('.aheart-demo-panel').first()
  const numberInput = numberDemo.locator('input').first()
  await expect(numberInput).toHaveValue('4')
  await numberDemo.getByRole('button', { name: 'Increase' }).first().click()
  await expect(numberInput).toHaveValue('5')

  await page.goto('/components/select')
  const selectDemo = page.locator('.aheart-demo-panel').first()
  const selector = selectDemo.getByRole('combobox')
  await selector.click()
  await page.getByRole('option', { name: 'Apple', exact: true }).click()
  await expect(selectDemo.locator('.aheart-select__selection')).toContainText('Apple')
  await expect(selectDemo.locator('select')).toHaveCount(0)

  await page.goto('/components/checkbox')
  const checkbox = page.locator('.aheart-demo-panel').first().getByRole('checkbox').first()
  await checkbox.click()
  await expect(checkbox).not.toBeChecked()

  await page.goto('/components/switch')
  const switchControl = page.locator('.aheart-demo-panel').first().getByRole('switch').first()
  await switchControl.click()
  await expect(switchControl).not.toBeChecked()

  await page.goto('/components/pagination')
  const pagination = page.locator('.aheart-demo-panel').first()
  await pagination.getByRole('button', { name: '3', exact: true }).click()
  await expect(pagination.getByRole('button', { name: '3', exact: true })).toHaveAttribute('aria-current', 'page')

  expect(errors).toEqual([])
})

test('feedback demos execute instead of throwing runtime errors', async ({ page }) => {
  const errors = collectRuntimeErrors(page)

  await page.goto('/components/message')
  await page.locator('.aheart-demo-panel').first().getByRole('button', { name: 'Success', exact: true }).click()
  await expect(page.locator('.aheart-message:not(.demo-message-host)').filter({ hasText: 'Saved' })).toBeVisible()

  await page.goto('/components/modal')
  await page.getByRole('button', { name: 'Open modal', exact: true }).first().click()
  await expect(page.getByRole('dialog')).toBeVisible()

  expect(errors).toEqual([])
})

test('icon documentation loads without runtime errors', async ({ page }) => {
  const errors = collectRuntimeErrors(page)
  await page.goto('/components/icon')
  await expect(page.getByRole('heading', { name: /Icon 图标/ })).toBeVisible()
  const basicDemo = page.locator('.aheart-demo-panel').first()
  await expect(basicDemo.locator('svg.lucide')).toHaveCount(3)
  await expect(basicDemo).not.toContainText(/search|setting|loading/)
  expect(errors).toEqual([])
})

test.describe('Chinese Ready component routes', () => {
  for (const link of readyComponentLinks) {
    test(`${link} loads without runtime errors`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'The desktop crawl is the canonical runtime smoke check.')

      const errors = collectRuntimeErrors(page)
      await page.goto(link, { waitUntil: 'networkidle' })
      await expect(page.locator('.vp-doc h1'), `Missing component heading on ${link}`).toBeVisible()
      expect(errors, `Runtime errors on ${link}`).toEqual([])
    })
  }
})
