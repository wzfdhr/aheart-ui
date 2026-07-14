import { expect, test, type Page } from '@playwright/test'

const collectRuntimeErrors = (page: Page) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  return errors
}

test('Form waits for async validation, reports errors, succeeds, and resets', async ({ page }) => {
  const errors = collectRuntimeErrors(page)
  await page.goto('/components/form')

  const demo = page.locator('.q4-form-async-demo')
  const input = demo.getByRole('textbox', { name: '工作邮箱' })
  await expect(input).toHaveValue('taken@example.com')

  await demo.getByRole('button', { name: '异步校验' }).click()
  await expect(demo.locator('.aheart-form-item[data-name="email"]')).toHaveClass(/aheart-form-item--validating/)
  await expect(demo).toContainText('该邮箱已被占用')
  await expect(demo).toContainText('异步校验未通过')

  await input.fill('free@example.com')
  await demo.getByRole('button', { name: '异步校验' }).click()
  await expect(demo).toContainText('校验通过，可以提交')

  await demo.getByRole('button', { name: /重\s*置/ }).click()
  await expect(input).toHaveValue('taken@example.com')
  await expect(demo).toContainText('已恢复初始值')
  expect(errors).toEqual([])
})

test('Table supports sorting, selection, expansion, pagination, and server page records', async ({ page }) => {
  const errors = collectRuntimeErrors(page)
  await page.goto('/components/table')

  const sortDemo = page.locator('.q4-table-sort-demo')
  await sortDemo.getByRole('button', { name: /Age/ }).click()
  await expect(sortDemo.locator('tbody tr').first()).toContainText('Linus')

  const selectionDemo = page.locator('.q4-table-selection-demo')
  const graceCheckbox = selectionDemo.getByRole('checkbox', { name: 'Select row grace' })
  await graceCheckbox.check()
  await expect(graceCheckbox).toBeChecked()
  await expect(selectionDemo.locator('tbody tr').nth(1)).toHaveClass(/is-selected/)

  const expandDemo = page.locator('.q4-table-expand-demo')
  await expandDemo.locator('.aheart-table__expand-button').first().click()
  await expect(expandDemo.locator('.aheart-table__expanded-row')).toContainText('Owns design system architecture')

  const paginationDemo = page.locator('.q4-table-pagination-demo')
  await paginationDemo.locator('.aheart-pagination__next').click()
  await expect(paginationDemo.locator('tbody')).toContainText('Linus')

  const serverDemo = page.locator('.q4-table-server-demo')
  await expect(serverDemo.locator('tbody')).toContainText('Page 5 record')
  await expect(serverDemo.locator('.aheart-pagination__page.is-active')).toHaveText('5')
  expect(errors).toEqual([])
})

test('Pagination updates current, page size, and quick jump state without baseline drift', async ({ page }) => {
  const errors = collectRuntimeErrors(page)
  await page.goto('/components/pagination')

  const basic = page.locator('.q4-pagination-basic-demo')
  await basic.getByRole('button', { name: '4', exact: true }).click()
  await expect(basic.getByRole('button', { name: '4', exact: true })).toHaveAttribute('aria-current', 'page')

  const size = page.locator('.q4-pagination-size-demo')
  await size.getByRole('combobox').selectOption('20')
  await expect(size.getByRole('combobox')).toHaveValue('20')

  const quick = page.locator('.q4-pagination-quick-demo')
  await quick.getByRole('spinbutton').fill('8')
  await quick.getByRole('spinbutton').press('Enter')
  await expect(quick.getByRole('button', { name: '8', exact: true })).toHaveAttribute('aria-current', 'page')

  const heights = await basic.locator('button').evaluateAll((buttons) =>
    buttons.map((button) => Math.round(button.getBoundingClientRect().height))
  )
  expect(new Set(heights).size).toBe(1)
  expect(errors).toEqual([])
})

test('Q4 layouts remain readable and keyboard-visible on narrow screens', async ({ page }) => {
  await page.goto('/components/table')
  const tableContainer = page.locator('.q4-table-basic-demo .aheart-table__container')
  await expect(tableContainer).toBeVisible()
  expect(await tableContainer.evaluate((element) => element.scrollWidth >= element.clientWidth)).toBe(true)

  await page.goto('/components/pagination')
  const pagination = page.locator('.q4-pagination-basic-demo .aheart-pagination')
  const firstButton = pagination.locator('button').first()
  await firstButton.focus()
  await expect(firstButton).toBeFocused()
  const outline = await firstButton.evaluate((element) => getComputedStyle(element).outlineStyle)
  expect(outline).not.toBe('none')

  await page.goto('/components/form')
  const asyncDemo = page.locator('.q4-form-async-demo')
  const bounds = await asyncDemo.evaluate((element) => {
    const demo = element.getBoundingClientRect()
    const input = element.querySelector('input')!.getBoundingClientRect()
    return { demoLeft: demo.left, demoRight: demo.right, inputLeft: input.left, inputRight: input.right }
  })
  expect(bounds.inputLeft).toBeGreaterThanOrEqual(bounds.demoLeft)
  expect(bounds.inputRight).toBeLessThanOrEqual(bounds.demoRight)
})
