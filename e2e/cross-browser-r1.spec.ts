import { expect, test, type Page } from '@playwright/test'

const unhandledRejectionsKey = '__qg5R1UnhandledRejections__'

const collectProductionErrors = async (page: Page) => {
  const errors: string[] = []

  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error' || /\[Vue warn\]|hydration|mismatch/i.test(message.text())) {
      errors.push(`console ${message.type()}: ${message.text()}`)
    }
  })
  page.on('response', (response) => {
    const url = new URL(response.url())
    if (url.hostname === '127.0.0.1' && response.status() >= 400) {
      errors.push(`response ${response.status()}: ${url.pathname}`)
    }
  })
  page.on('requestfailed', (request) => {
    const url = new URL(request.url())
    const errorText = request.failure()?.errorText ?? 'unknown'
    if (url.hostname === '127.0.0.1' && !/ABORTED/i.test(errorText)) {
      errors.push(`requestfailed: ${url.pathname} (${errorText})`)
    }
  })
  await page.addInitScript((key) => {
    const failures: string[] = []
    ;(window as typeof window & Record<string, string[]>)[key] = failures
    window.addEventListener('unhandledrejection', (event) => failures.push(String(event.reason)))
  }, unhandledRejectionsKey)

  return errors
}

const expectProductionRoute = async (page: Page, route: string) => {
  await page.goto(`/components/${route}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => Boolean((document.querySelector('#app') as HTMLElement & { __vue_app__?: unknown } | null)?.__vue_app__))
  await expect(page.locator('.vp-doc h1')).toBeVisible()
  await page.waitForLoadState('networkidle')
}

const expectNoProductionErrors = async (page: Page, errors: string[]) => {
  const unhandledRejections = await page.evaluate((key) =>
    (window as typeof window & Record<string, string[] | undefined>)[key] ?? [],
  unhandledRejectionsKey)
  expect([...errors, ...unhandledRejections]).toEqual([])
}

const item = (list: ReturnType<Page['getByTestId']>, name: string) =>
  list.locator('.aheart-dnd-sortable-item').filter({ hasText: name }).first()

const itemHandle = (list: ReturnType<Page['getByTestId']>, name: string) =>
  item(list, name).getByRole('button', { name: `拖动 ${name}` })

test.describe('QG5 R1 production cross-browser smoke', () => {
  test.afterEach(async ({ page }, testInfo) => {
    const errors = (testInfo as typeof testInfo & { __qg5Errors?: string[] }).__qg5Errors ?? []
    await expectNoProductionErrors(page, errors)
  })

  test('Form completes async validation, correction, and reset', async ({ page }, testInfo) => {
    const errors = await collectProductionErrors(page)
    ;(testInfo as typeof testInfo & { __qg5Errors?: string[] }).__qg5Errors = errors
    await expectProductionRoute(page, 'form')

    const demo = page.locator('.q4-form-async-demo')
    const input = demo.getByRole('textbox', { name: '工作邮箱' })
    await expect(input).toHaveValue('taken@example.com')
    await demo.getByRole('button', { name: '异步校验' }).click()
    await expect(demo.locator('.aheart-form-item[data-name="email"]')).toHaveClass(/aheart-form-item--validating/)
    await expect(demo).toContainText('异步校验未通过')
    await input.fill('free@example.com')
    await demo.getByRole('button', { name: '异步校验' }).click()
    await expect(demo).toContainText('校验通过，可以提交')
    await demo.getByRole('button', { name: /重\s*置/ }).click()
    await expect(input).toHaveValue('taken@example.com')
  })

  test('Select selects, clears multiple values, and closes by keyboard', async ({ page }, testInfo) => {
    const errors = await collectProductionErrors(page)
    ;(testInfo as typeof testInfo & { __qg5Errors?: string[] }).__qg5Errors = errors
    await expectProductionRoute(page, 'select')

    const select = page.locator('.aheart-demo-panel').first().getByRole('combobox')
    await select.click()
    const dropdown = page.getByRole('listbox').first()
    await expect(dropdown).toBeVisible()
    await dropdown.getByRole('option', { name: 'Apple', exact: true }).click()
    await expect(page.locator('.aheart-demo-panel').first().locator('.aheart-select__selection')).toContainText('Apple')

    const multiple = page.locator('.aheart-demo-panel').nth(1)
    await expect(multiple.locator('.aheart-select__tag')).toHaveCount(2)
    await multiple.getByRole('button', { name: '移除 Apple' }).click()
    await expect(multiple.locator('.aheart-select__tag')).toHaveCount(1)
    await multiple.getByRole('button', { name: '清除' }).click()
    await expect(multiple.locator('.aheart-select__tag')).toHaveCount(0)

    await select.click()
    await page.keyboard.press('Escape')
    await expect(dropdown).toBeHidden()
  })

  test('DatePicker commits a date-time draft and cancels a later edit', async ({ page }, testInfo) => {
    const errors = await collectProductionErrors(page)
    ;(testInfo as typeof testInfo & { __qg5Errors?: string[] }).__qg5Errors = errors
    await expectProductionRoute(page, 'date-picker')

    const picker = page.locator('.vp-doc .aheart-date-picker').nth(7)
    const input = picker.locator('input').first()
    await input.click()
    const panel = page.locator('.aheart-date-picker__panel.is-entered')
    await panel.locator('[data-value="2026-07-20"]').click()
    await panel.locator('[data-time-part="hour"]').fill('11')
    await panel.locator('.aheart-date-picker__ok').click()
    await expect(input).toHaveValue('2026-07-20 11:30:00 中午')
    await input.click()
    await panel.locator('[data-value="2026-07-21"]').click()
    await page.keyboard.press('Escape')
    await expect(input).toHaveValue('2026-07-20 11:30:00 中午')
  })

  test('Table sorts, selects, expands, and paginates records', async ({ page }, testInfo) => {
    const errors = await collectProductionErrors(page)
    ;(testInfo as typeof testInfo & { __qg5Errors?: string[] }).__qg5Errors = errors
    await expectProductionRoute(page, 'table')

    const sortDemo = page.locator('.q4-table-sort-demo')
    await sortDemo.getByRole('button', { name: /Age/ }).click()
    await expect(sortDemo.locator('tbody tr').first()).toContainText('Linus')
    const selectionDemo = page.locator('.q4-table-selection-demo')
    const checkbox = selectionDemo.getByRole('checkbox', { name: 'Select row grace' })
    await checkbox.check()
    await expect(checkbox).toBeChecked()
    await page.locator('.q4-table-expand-demo .aheart-table__expand-button').first().click()
    await expect(page.locator('.q4-table-expand-demo .aheart-table__expanded-row')).toContainText('Owns design system architecture')
    await page.locator('.q4-table-pagination-demo .aheart-pagination__next').click()
    await expect(page.locator('.q4-table-pagination-demo tbody')).toContainText('Linus')
  })

  test('Upload reports progress, recovers a failure, and enforces disabled state', async ({ page }, testInfo) => {
    const errors = await collectProductionErrors(page)
    ;(testInfo as typeof testInfo & { __qg5Errors?: string[] }).__qg5Errors = errors
    await expectProductionRoute(page, 'upload')

    const file = (name: string) => ({ name, mimeType: 'text/plain', buffer: Buffer.from(`QG5 R1 ${name}`) })
    const progress = page.getByRole('region', { name: '进度与成功' })
    await progress.getByLabel('选择文件').setInputFiles(file('r1-progress.txt'))
    await expect(progress.getByTestId('upload-progress-status')).toHaveText('上传进度：50%')
    await progress.getByRole('button', { name: '完成上传' }).click()
    await expect(progress.getByTestId('upload-progress-status')).toHaveText('上传成功')

    const failure = page.getByRole('region', { name: '失败与重试' })
    await failure.getByLabel('选择文件').setInputFiles(file('r1-failure.txt'))
    await expect(failure.getByTestId('upload-retry-status')).toHaveText('上传失败')
    await failure.getByRole('button', { name: '重试 r1-failure.txt' }).click()
    await failure.getByRole('button', { name: '上传' }).click()
    await expect(failure.getByTestId('upload-retry-status')).toHaveText('上传成功')

    const disabled = page.getByRole('region', { name: '禁用上传' })
    await expect(disabled.getByLabel('选择文件')).toBeDisabled()
  })

  test('Modal opens, cancels by keyboard, and restores its trigger', async ({ page }, testInfo) => {
    const errors = await collectProductionErrors(page)
    ;(testInfo as typeof testInfo & { __qg5Errors?: string[] }).__qg5Errors = errors
    await expectProductionRoute(page, 'modal')

    const trigger = page.getByRole('button', { name: 'Open modal', exact: true }).first()
    await trigger.focus()
    await trigger.press('Enter')
    const modal = page.locator('.aheart-modal').first()
    await expect(modal).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(modal).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('DnD sorts by keyboard and Splitter resizes by keyboard', async ({ page }, testInfo) => {
    const errors = await collectProductionErrors(page)
    ;(testInfo as typeof testInfo & { __qg5Errors?: string[] }).__qg5Errors = errors
    await expectProductionRoute(page, 'dnd')

    const todo = page.getByTestId('dnd-todo-list')
    await itemHandle(todo, '整理需求').focus()
    await page.keyboard.press('Alt+ArrowDown')
    await expect(todo.locator('.aheart-dnd-sortable-item').first()).toContainText('产品审核')
    await expect(page.locator('.aheart-dnd-live-region')).toContainText('已移动到第 2 项')

    await expectProductionRoute(page, 'splitter')
    const splitter = page.getByTestId('splitter-horizontal')
    const separator = splitter.getByRole('separator')
    await separator.focus()
    const before = await separator.getAttribute('aria-valuenow')
    await page.keyboard.press('ArrowRight')
    await expect(separator).not.toHaveAttribute('aria-valuenow', before ?? '')
    await expect(page.getByTestId('splitter-status')).toContainText('键盘')
  })

  test('AI Workbench retries a task, completes approval, and previews an artifact', async ({ page }, testInfo) => {
    const errors = await collectProductionErrors(page)
    ;(testInfo as typeof testInfo & { __qg5Errors?: string[] }).__qg5Errors = errors
    await expectProductionRoute(page, 'ai-agent-workbench')

    const workbench = page.locator('.aheart-ai-workbench').first()
    if (testInfo.project.name.includes('mobile')) {
      await workbench.getByRole('tab', { name: '执行' }).click()
      await workbench.getByRole('button', { name: '查看执行与产物', exact: true }).click()
      const drawer = page.getByRole('dialog', { name: '执行与产物' })
      await expect(drawer).toBeVisible()
      await expect(drawer).toContainText('上次执行失败')
      await drawer.locator('[data-task-id="summary"] [data-action="retry"]').click()
      await expect(drawer.locator('[data-task-id="summary"]')).toContainText('已完成')
      const priority = drawer.getByRole('region', { name: '移动端优先处理' })
      await priority.locator('[data-action="approve"]').click()
      await expect(priority).toContainText('已批准')
      await drawer.locator('[data-artifact-id="source-data"] button').click()
      await expect(drawer.locator('.aheart-ai-workbench__artifact-preview')).toContainText('来源数据.csv')
    } else {
      await workbench.locator('[data-task-id="summary"] [data-action="retry"]').click()
      await expect(workbench.locator('[data-task-id="summary"]')).toContainText('已完成')
      await workbench.locator('[data-approval-id="publish-approval"] [data-action="approve"]').click()
      await expect(workbench.locator('[data-approval-id="publish-approval"]')).toContainText('已批准')
      await workbench.locator('[data-artifact-id="source-data"] button').click()
      await expect(workbench.locator('.aheart-ai-workbench__artifact-preview')).toContainText('来源数据.csv')
    }
  })
})
