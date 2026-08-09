import { expect, test, type Locator, type Page } from '@playwright/test'

const item = (list: Locator, name: string) => list.locator('.aheart-dnd-sortable-item').filter({ hasText: name }).first()
const runtimeErrors = new WeakMap<Page, string[]>()

const collectRuntimeErrors = (page: Page) => {
  const errors: string[] = []
  runtimeErrors.set(page, errors)
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error' || (message.type() === 'warning' && message.text().includes('[Vue warn]'))) {
      errors.push(`${message.type()}: ${message.text()}`)
    }
  })
}

const expectNoRuntimeErrors = (page: Page) => expect(runtimeErrors.get(page) ?? []).toEqual([])

const beginPointerResize = async (page: Page, handle: Locator, x: number, y: number) => {
  const box = await handle.boundingBox()
  expect(box).not.toBeNull()
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
  await page.mouse.down()
  await page.mouse.move(x, y, { steps: 8 })
}

const drag = async (_page: Page, source: Locator, target: Locator) => {
  await source.dragTo(target)
}

const itemOrder = (list: Locator) => list.locator('[data-item-id]').evaluateAll((nodes) =>
  nodes.map((node) => (node as HTMLElement).dataset.itemId ?? '')
)

const pointerResizeBy = async (page: Page, handle: Locator, deltaX: number, deltaY: number) => {
  const box = await handle.boundingBox()
  expect(box).not.toBeNull()
  const startX = box!.x + box!.width / 2
  const startY = box!.y + box!.height / 2
  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(startX + deltaX, startY + deltaY, { steps: 8 })
  await page.mouse.up()
}

test.describe('QG2 中文 DnD fixture', () => {
  test.beforeEach(async ({ page }) => {
    collectRuntimeErrors(page)
    await page.goto('/components/dnd', { waitUntil: 'networkidle' })
  })

  test.afterEach(async ({ page }) => {
    expectNoRuntimeErrors(page)
  })

  test('exposes same-list keyboard sorting, counts, status, and live region', async ({ page }) => {
    const fixture = page.getByTestId('dnd-fixture')
    const todo = page.getByTestId('dnd-todo-list')
    await expect(fixture).toBeVisible()
    await expect(todo.locator('.aheart-dnd-sortable-item')).toHaveCount(3)
    await expect(page.getByTestId('dnd-todo-count')).toHaveText('3')

    await item(todo, '整理需求').focus()
    await page.keyboard.press('Alt+ArrowDown')
    await expect(todo.locator('.aheart-dnd-sortable-item').first()).toContainText('产品审核')
    await expect(item(todo, '整理需求')).toBeFocused()
    await expect(page.getByTestId('dnd-status')).toContainText('同列表')
    await expect(todo.locator('.aheart-dnd-live-region')).toContainText('已移动到第 2 项')
  })

  test('reorders a list once with a real pointer drag', async ({ page }) => {
    const todo = page.getByTestId('dnd-todo-list')

    await drag(page, item(todo, '整理需求'), item(todo, '准备发布'))

    await expect.poll(() => itemOrder(todo)).toEqual(['review', 'release', 'plan'])
    await expect(page.getByTestId('dnd-todo-events')).toHaveText('update 1 / change 1')
  })

  test('moves across lists and accepts an empty destination with a real pointer drag', async ({ page }) => {
    const todo = page.getByTestId('dnd-todo-list')
    const done = page.getByTestId('dnd-done-list')
    const empty = page.getByTestId('dnd-empty-list')

    await drag(page, item(todo, '准备发布'), item(done, '发布复盘'))
    await expect(done).toContainText('准备发布')
    await expect(page.getByTestId('dnd-status')).toContainText('跨列表')
    await drag(page, item(done, '准备发布'), empty)
    await expect(empty).toContainText('准备发布')
    await expect(page.getByTestId('dnd-empty-count')).toHaveText('1')
    await expect(page.getByTestId('dnd-todo-events')).toHaveText('update 1 / change 1')
    await expect(page.getByTestId('dnd-done-events')).toHaveText('update 2 / change 2')
    await expect(page.getByTestId('dnd-empty-events')).toHaveText('update 1 / change 1')

    const ids = await page.locator('[data-testid^="dnd-"][data-testid$="-list"] [data-item-id]').evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLElement).dataset.itemId ?? '')
    )
    expect(ids.filter((id) => id === 'release')).toHaveLength(1)
  })

  test('keeps disabled and rejected destinations unchanged', async ({ page }) => {
    const todo = page.getByTestId('dnd-todo-list')
    const disabled = page.getByTestId('dnd-disabled-list')
    const rejected = page.getByTestId('dnd-reject-list')
    const beforeTodo = await todo.locator('.aheart-dnd-sortable-item').allTextContents()
    const beforeDisabled = await disabled.locator('.aheart-dnd-sortable-item').allTextContents()
    const beforeRejected = await rejected.locator('.aheart-dnd-sortable-item').allTextContents()
    const beforeCounts = await Promise.all([
      page.getByTestId('dnd-todo-count').textContent(),
      page.getByTestId('dnd-done-count').textContent(),
      page.getByTestId('dnd-empty-count').textContent(),
      disabled.locator('.aheart-dnd-sortable-item').count(),
      rejected.locator('.aheart-dnd-sortable-item').count()
    ])
    const beforeStatus = await page.getByTestId('dnd-status').textContent()
    expect(beforeStatus ?? '').not.toContain('拒绝')

    await expect(item(disabled, '锁定任务')).toHaveAttribute('aria-disabled', 'true')
    await drag(page, item(todo, '产品审核'), item(disabled, '锁定任务'))
    await drag(page, item(todo, '产品审核'), rejected)
    await expect(todo.locator('.aheart-dnd-sortable-item')).toHaveText(beforeTodo)
    await expect(disabled.locator('.aheart-dnd-sortable-item')).toHaveText(beforeDisabled)
    await expect(rejected.locator('.aheart-dnd-sortable-item')).toHaveText(beforeRejected)
    await expect(page.getByTestId('dnd-todo-count')).toHaveText(beforeCounts[0] ?? '')
    await expect(page.getByTestId('dnd-done-count')).toHaveText(beforeCounts[1] ?? '')
    await expect(page.getByTestId('dnd-empty-count')).toHaveText(beforeCounts[2] ?? '')
    await expect(disabled.locator('.aheart-dnd-sortable-item')).toHaveCount(beforeCounts[3] as number)
    await expect(rejected.locator('.aheart-dnd-sortable-item')).toHaveCount(beforeCounts[4] as number)
    await expect(page.getByTestId('dnd-status')).toHaveText(beforeStatus ?? '')
    await expect(page.getByTestId('dnd-todo-events')).toHaveText('update 0 / change 0')
    await expect(page.getByTestId('dnd-disabled-events')).toHaveText('update 0 / change 0')
    await expect(page.getByTestId('dnd-reject-events')).toHaveText('update 0 / change 0')
  })

  test('auto-scrolls a nested region, cancels without moving, and remounts without stale drag state', async ({ page }) => {
    const fixture = page.getByTestId('dnd-fixture')
    const region = page.getByTestId('dnd-scroll-region')
    const source = item(page.getByTestId('dnd-scroll-source'), '滚动任务 1')
    const sourceBox = await source.boundingBox()
    const regionBox = await region.boundingBox()
    const beforeOrder = await itemOrder(page.getByTestId('dnd-scroll-source'))
    expect(sourceBox).not.toBeNull()
    expect(regionBox).not.toBeNull()
    await page.mouse.move(sourceBox!.x + 12, sourceBox!.y + 12)
    await page.mouse.down()
    await page.mouse.move(regionBox!.x + regionBox!.width / 3, regionBox!.y + regionBox!.height - 3, { steps: 16 })
    await expect.poll(() => region.evaluate((node) => (node as HTMLElement).scrollTop)).toBeGreaterThan(0)
    await page.keyboard.press('Escape')
    await page.mouse.up()

    await expect.poll(() => itemOrder(page.getByTestId('dnd-scroll-source'))).toEqual(beforeOrder)
    await expect(page.locator('.aheart-dnd-overlay')).toHaveCount(0)

    await page.mouse.move(sourceBox!.x + 12, sourceBox!.y + 12)
    await page.mouse.down()
    await page.mouse.move(sourceBox!.x + 36, sourceBox!.y + 24, { steps: 4 })
    await expect(page.locator('.aheart-dnd-overlay')).toBeVisible()
    await page.getByRole('button', { name: '卸载 DnD' }).evaluate((button: HTMLButtonElement) => button.click())
    await page.mouse.up()
    await expect(fixture).toHaveAttribute('data-mounted', 'false')
    await page.getByRole('button', { name: '重新挂载 DnD' }).click()
    await expect(fixture).toHaveAttribute('data-mounted', 'true')
    await expect(page.getByTestId('dnd-todo-count')).toHaveText('3')
    await expect(page.locator('.aheart-dnd-overlay')).toHaveCount(0)
  })
})

test.describe('QG2 中文 Splitter fixture', () => {
  test.beforeEach(async ({ page }) => {
    collectRuntimeErrors(page)
    await page.goto('/components/splitter', { waitUntil: 'networkidle' })
  })

  test.afterEach(async ({ page }) => {
    expectNoRuntimeErrors(page)
  })

  test('renders horizontal, vertical, and three-panel splitters with state output', async ({ page }) => {
    const fixture = page.getByTestId('splitter-fixture')
    await expect(fixture).toBeVisible()
    await expect(page.getByTestId('splitter-horizontal').getByRole('separator')).toHaveCount(1)
    await expect(page.getByTestId('splitter-vertical').getByRole('separator')).toHaveCount(1)
    await expect(page.getByTestId('splitter-triple').getByRole('separator')).toHaveCount(2)

    const handle = page.getByTestId('splitter-horizontal').getByRole('separator')
    const initial = await handle.getAttribute('aria-valuenow')
    await handle.focus()
    await page.keyboard.press('ArrowRight')
    await expect(handle).not.toHaveAttribute('aria-valuenow', initial ?? '')
    await expect(page.getByTestId('splitter-status')).toContainText('键盘')

    const vertical = page.getByTestId('splitter-vertical')
    const verticalPanel = vertical.locator('.aheart-splitter__panel').first()
    const beforeHeight = (await verticalPanel.boundingBox())!.height
    await pointerResizeBy(page, vertical.getByRole('separator'), 0, 28)
    await expect.poll(async () => (await verticalPanel.boundingBox())!.height).toBeGreaterThan(beforeHeight + 15)

    const triple = page.getByTestId('splitter-triple')
    const panels = triple.locator('.aheart-splitter__panel')
    const beforeWidths = await panels.evaluateAll((nodes) => nodes.map((node) => (node as HTMLElement).getBoundingClientRect().width))
    const secondHandle = triple.getByRole('separator').nth(1)
    await secondHandle.focus()
    await page.keyboard.press('Shift+ArrowRight')
    await expect.poll(async () => (await panels.nth(1).boundingBox())!.width).toBeGreaterThan(beforeWidths[1] + 20)
    const afterWidths = await panels.evaluateAll((nodes) => nodes.map((node) => (node as HTMLElement).getBoundingClientRect().width))
    expect(afterWidths[0]).toBeCloseTo(beforeWidths[0], 0)
    expect(afterWidths[1]).toBeGreaterThan(beforeWidths[1] + 20)
    expect(afterWidths[2]).toBeLessThan(beforeWidths[2] - 20)
  })

  test('enforces percentage bounds and recomputes them after container resize', async ({ page }) => {
    const fixture = page.getByTestId('splitter-percent')
    const splitter = fixture.locator('.aheart-splitter')
    const handle = fixture.getByRole('separator')
    await fixture.scrollIntoViewIfNeeded()

    await handle.focus()
    for (let index = 0; index < 10; index += 1) await page.keyboard.press('Shift+ArrowRight')
    await expect(handle).toHaveAttribute('aria-valuenow', await handle.getAttribute('aria-valuemax') ?? '')
    for (let index = 0; index < 10; index += 1) await page.keyboard.press('Shift+ArrowLeft')
    await expect(handle).toHaveAttribute('aria-valuenow', await handle.getAttribute('aria-valuemin') ?? '')

    const beforeMax = Number(await handle.getAttribute('aria-valuemax'))
    await fixture.evaluate((node) => ((node as HTMLElement).style.width = '520px'))
    await expect.poll(async () => Number(await handle.getAttribute('aria-valuemax'))).not.toBe(beforeMax)
    const panelsWidth = await splitter.locator('.aheart-splitter__panel').evaluateAll((nodes) =>
      nodes.reduce((total, node) => total + (node as HTMLElement).getBoundingClientRect().width, 0)
    )
    expect(panelsWidth).toBeGreaterThan(400)
  })

  test('keeps lazy values unchanged while dragging and commits on pointerup', async ({ page }) => {
    const lazy = page.getByTestId('splitter-lazy')
    const handle = lazy.getByRole('separator')
    const panel = lazy.locator('.aheart-splitter__panel').first()
    await lazy.scrollIntoViewIfNeeded()
    const handleBox = await handle.boundingBox()
    const beforeBox = await panel.boundingBox()
    const beforeValues = await page.getByTestId('splitter-lazy-values').textContent()
    expect(handleBox).not.toBeNull()
    expect(beforeBox).not.toBeNull()

    await beginPointerResize(page, handle, handleBox!.x + 48, handleBox!.y + handleBox!.height / 2)
    await expect.poll(async () => (await panel.boundingBox())!.width).toBeGreaterThan(beforeBox!.width + 20)
    await expect(page.getByTestId('splitter-lazy-values')).toHaveText(beforeValues ?? '')
    await expect(page.getByTestId('splitter-lazy-update-count')).toHaveText('0')

    await page.mouse.up()
    await expect(page.getByTestId('splitter-lazy-values')).not.toHaveText(beforeValues ?? '')
    await expect(page.getByTestId('splitter-lazy-update-count')).toHaveText('1')
    await expect(page.getByTestId('splitter-lazy-left')).not.toHaveText('260')
    await expect(page.getByTestId('splitter-lazy-right')).not.toHaveText('420')
    await expect(page.locator('[data-aheart-drag-shield]')).toHaveCount(0)
  })

  test('drags across the iframe and restores the document after pointerup', async ({ page }) => {
    const fixture = page.getByTestId('splitter-iframe')
    const handle = fixture.getByRole('separator')
    const panel = fixture.locator('.aheart-splitter__panel').first()
    const iframe = fixture.locator('iframe')
    await fixture.scrollIntoViewIfNeeded()
    const iframeBox = await iframe.boundingBox()
    const beforePanel = await panel.boundingBox()
    const iframeStyle = await iframe.getAttribute('style')
    const bodyStyle = await page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))
    expect(iframeBox).not.toBeNull()
    expect(beforePanel).not.toBeNull()

    await beginPointerResize(page, handle, iframeBox!.x + iframeBox!.width / 2, iframeBox!.y + iframeBox!.height / 2)
    await expect.poll(async () => (await panel.boundingBox())!.width).toBeGreaterThan(beforePanel!.width + 20)
    await page.mouse.up()

    await expect(page.locator('[data-aheart-drag-shield]')).toHaveCount(0)
    await expect.poll(() => page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))).toEqual(bodyStyle)
    await expect(iframe).toHaveAttribute('style', iframeStyle ?? '')
  })

  test('cancels on window blur and cleans up when unmounted during a resize', async ({ page }) => {
    const fixture = page.getByTestId('splitter-iframe')
    const handle = fixture.getByRole('separator')
    await fixture.scrollIntoViewIfNeeded()
    const bodyStyle = await page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))
    const handleBox = await handle.boundingBox()
    expect(handleBox).not.toBeNull()

    await beginPointerResize(page, handle, handleBox!.x + 40, handleBox!.y + handleBox!.height / 2)
    await expect(page.locator('[data-aheart-drag-shield]')).toBeVisible()
    await page.evaluate(() => window.dispatchEvent(new Event('blur')))
    await expect(page.locator('[data-aheart-drag-shield]')).toHaveCount(0)
    await expect.poll(() => page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))).toEqual(bodyStyle)

    await beginPointerResize(page, handle, handleBox!.x + 48, handleBox!.y + handleBox!.height / 2)
    await expect(page.locator('[data-aheart-drag-shield]')).toBeVisible()
    await page.getByRole('button', { name: '卸载 Splitter' }).evaluate((button: HTMLButtonElement) => button.click())
    await expect(page.getByTestId('splitter-fixture')).toHaveAttribute('data-mounted', 'false')
    await expect(page.locator('[data-aheart-drag-shield]')).toHaveCount(0)
    await expect.poll(() => page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))).toEqual(bodyStyle)
    await page.mouse.up()
  })

  test('updates from external InputNumber and keeps a visible iframe in the splitter', async ({ page }) => {
    const input = page.getByTestId('splitter-input').locator('input').first()
    await expect(input).toHaveValue('260')
    await page.getByTestId('splitter-input').getByRole('button', { name: 'Increase' }).click()
    await expect(input).toHaveValue('261')
    await expect(page.getByTestId('splitter-input-output')).toContainText('261 px')
    await expect(page.getByTestId('splitter-iframe').locator('iframe')).toBeVisible()
  })

  test('cleans up and remounts the splitter demos', async ({ page }) => {
    const fixture = page.getByTestId('splitter-fixture')
    await page.getByRole('button', { name: '卸载 Splitter' }).click()
    await expect(fixture).toHaveAttribute('data-mounted', 'false')
    await page.getByRole('button', { name: '重新挂载 Splitter' }).click()
    await expect(fixture).toHaveAttribute('data-mounted', 'true')
    await expect(page.getByTestId('splitter-horizontal').getByRole('separator')).toBeVisible()
  })
})
