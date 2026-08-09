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
    await page.goto('/components/dnd', { waitUntil: 'domcontentloaded' })
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
    await empty.scrollIntoViewIfNeeded()
    await drag(page, item(done, '准备发布'), empty.locator('.aheart-dnd-sortable-list'))
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
    await expect(todo.locator('.aheart-dnd-sortable-item')).toHaveCount(3)
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

  test('keeps the mobile workbench readable and its states explicit', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'Responsive workbench assertions only apply to mobile projects.')

    const fixture = page.getByTestId('dnd-fixture')
    const primaryGrid = fixture.locator('.qg2-dnd-primary-grid')
    const secondaryGrid = fixture.locator('.qg2-dnd-secondary-grid')
    await fixture.scrollIntoViewIfNeeded()

    await expect(primaryGrid).toBeVisible()
    await expect(secondaryGrid).toBeVisible()
    expect(await primaryGrid.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').length)).toBe(1)
    expect(await secondaryGrid.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').length)).toBe(1)
    expect(await fixture.locator('.aheart-dnd-sortable-list').first().evaluate((node) => getComputedStyle(node).listStyleType)).toBe('none')
    expect(await fixture.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
    await expect(page.getByTestId('dnd-disabled-hint')).toContainText('不接收')
    await expect(page.getByTestId('dnd-reject-hint')).toContainText('仅接收')
  })

  test('auto-scrolls a nested region and cancels without moving', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Playwright does not synthesize continuing native drag events outside desktop Chromium, so nested auto-scroll cannot run under automation.')

    const region = page.getByTestId('dnd-scroll-region')
    const source = item(page.getByTestId('dnd-scroll-source'), '滚动任务 1')
    await region.scrollIntoViewIfNeeded()
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
    await page.mouse.move(0, 0)
    await page.mouse.up()

    await expect.poll(() => itemOrder(page.getByTestId('dnd-scroll-source'))).toEqual(beforeOrder)
    await expect(page.locator('.aheart-dnd-overlay')).toHaveCount(0)
  })

  test('hands auto-scroll from an exhausted inner region to its outer ancestor', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Continuous native drag auto-scroll is verified in desktop Chromium.')

    const outer = page.getByTestId('dnd-scroll-outer')
    const inner = page.getByTestId('dnd-scroll-region')
    const source = item(page.getByTestId('dnd-scroll-source'), '滚动任务 12')
    await outer.scrollIntoViewIfNeeded()
    await inner.evaluate((node) => ((node as HTMLElement).scrollTop = (node as HTMLElement).scrollHeight))
    await outer.evaluate((node) => ((node as HTMLElement).scrollTop = 0))
    const sourceBox = await source.boundingBox()
    const outerBox = await outer.boundingBox()
    expect(sourceBox).not.toBeNull()
    expect(outerBox).not.toBeNull()

    await page.mouse.move(sourceBox!.x + 12, sourceBox!.y + 12)
    await page.mouse.down()
    await page.mouse.move(outerBox!.x + outerBox!.width / 2, outerBox!.y + outerBox!.height - 3, { steps: 18 })
    await expect.poll(() => outer.evaluate((node) => (node as HTMLElement).scrollTop)).toBeGreaterThan(0)
    await page.keyboard.press('Escape')
    await page.mouse.move(0, 0)
    await page.mouse.up()
    await expect(page.locator('.aheart-dnd-overlay')).toHaveCount(0)
  })

  test('unmounts and remounts without stale drag state', async ({ page }) => {
    const fixture = page.getByTestId('dnd-fixture')
    const region = page.getByTestId('dnd-scroll-region')
    const source = item(page.getByTestId('dnd-scroll-source'), '滚动任务 1')
    await region.scrollIntoViewIfNeeded()
    await region.evaluate((node) => ((node as HTMLElement).scrollTop = 0))
    await expect.poll(() => region.evaluate((node) => (node as HTMLElement).scrollTop)).toBe(0)
    const freshSourceBox = await source.boundingBox()
    expect(freshSourceBox).not.toBeNull()
    await page.mouse.move(freshSourceBox!.x + 12, freshSourceBox!.y + 12)
    await page.mouse.down()
    await page.mouse.move(freshSourceBox!.x + 36, freshSourceBox!.y + 24, { steps: 4 })
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
    await page.goto('/components/splitter', { waitUntil: 'domcontentloaded' })
  })

  test.afterEach(async ({ page }) => {
    expectNoRuntimeErrors(page)
  })

  test('renders horizontal, vertical, and three-panel splitters with state output', async ({ page }, testInfo) => {
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

    if (testInfo.project.name.includes('mobile')) {
      const grip = await handle.evaluate((node) => {
        const style = getComputedStyle(node, '::before')
        return { content: style.content, width: Number.parseFloat(style.width), height: Number.parseFloat(style.height) }
      })
      expect(grip.content).not.toBe('none')
      expect(grip.width).toBeGreaterThanOrEqual(4)
      expect(grip.height).toBeGreaterThanOrEqual(24)
      await handle.blur()
      await page.mouse.move(0, 0)
      await handle.evaluate((node) => {
        const splitter = node.closest<HTMLElement>('.aheart-splitter')
        splitter?.style.setProperty('--aheart-color-text-secondary', '#123456')
        splitter?.style.setProperty('--aheart-color-bg', '#0b0c0d')
      })
      const themedGrip = await handle.evaluate((node) => {
        const style = getComputedStyle(node, '::before')
        return { background: style.backgroundColor, shadow: style.boxShadow }
      })
      expect(themedGrip.background).toBe('rgb(18, 52, 86)')
      expect(themedGrip.shadow).toContain('rgb(11, 12, 13)')
      return
    }

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
    const splitterWidth = (await splitter.boundingBox())!.width
    await expect.poll(async () =>
      splitter.locator('.aheart-splitter__panel').evaluateAll((nodes) =>
        nodes.reduce((total, node) => total + (node as HTMLElement).getBoundingClientRect().width, 0)
      )
    ).toBeGreaterThan(splitterWidth - 16)
  })

  test('keeps lazy values unchanged while dragging and commits on pointerup', async ({ page }) => {
    const lazy = page.getByTestId('splitter-lazy')
    const handle = lazy.getByRole('separator')
    const panel = lazy.locator('.aheart-splitter__panel').first()
    await lazy.scrollIntoViewIfNeeded()
    const handleBox = await handle.boundingBox()
    const beforeBox = await panel.boundingBox()
    const beforeValues = await page.getByTestId('splitter-lazy-values').textContent()
    const beforeSizes = JSON.parse(beforeValues ?? '[]') as number[]
    expect(handleBox).not.toBeNull()
    expect(beforeBox).not.toBeNull()

    await beginPointerResize(page, handle, handleBox!.x + 48, handleBox!.y + handleBox!.height / 2)
    await expect.poll(async () => (await panel.boundingBox())!.width).toBeGreaterThan(beforeBox!.width + 20)
    await expect(page.getByTestId('splitter-lazy-values')).toHaveText(beforeValues ?? '')
    await expect(page.getByTestId('splitter-lazy-update-count')).toHaveText('0')

    await page.mouse.up()
    await expect(page.getByTestId('splitter-lazy-values')).not.toHaveText(beforeValues ?? '')
    await expect(page.getByTestId('splitter-lazy-update-count')).toHaveText('1')
    await expect(page.getByTestId('splitter-lazy-left')).not.toHaveText(String(beforeSizes[0]))
    await expect(page.getByTestId('splitter-lazy-right')).not.toHaveText(String(beforeSizes[1]))
    await expect(page.locator('[data-aheart-drag-shield]')).toHaveCount(0)
  })

  test('synthesizes a touch drag for lazy values with Chromium CDP', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Chromium CDP touch synthesis is limited to the mobile project; native DnD touch is intentionally not covered.')

    const lazy = page.getByTestId('splitter-lazy')
    const handle = lazy.getByRole('separator')
    const panel = lazy.locator('.aheart-splitter__panel').first()
    await lazy.scrollIntoViewIfNeeded()
    const handleBox = await handle.boundingBox()
    const beforeBox = await panel.boundingBox()
    const beforeValues = await page.getByTestId('splitter-lazy-values').textContent()
    expect(handleBox).not.toBeNull()
    expect(beforeBox).not.toBeNull()

    const touch = await page.context().newCDPSession(page)
    const startX = handleBox!.x + handleBox!.width / 2
    const startY = handleBox!.y + handleBox!.height / 2
    await touch.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: startX, y: startY }]
    })
    await expect(page.locator('[data-aheart-drag-shield]')).toBeVisible()

    for (const x of [startX + 16, startX + 32, startX + 48]) {
      await touch.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x, y: startY }]
      })
    }

    await expect.poll(async () => (await panel.boundingBox())!.width).toBeGreaterThan(beforeBox!.width + 20)
    await expect(page.getByTestId('splitter-lazy-values')).toHaveText(beforeValues ?? '')
    await expect(page.getByTestId('splitter-lazy-update-count')).toHaveText('0')

    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect(page.getByTestId('splitter-lazy-values')).not.toHaveText(beforeValues ?? '')
    await expect(page.getByTestId('splitter-lazy-update-count')).toHaveText('1')
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

  test('cleans up on pointercancel and commits a subsequent pointer drag', async ({ page }) => {
    const splitter = page.getByTestId('splitter-horizontal')
    const handle = splitter.getByRole('separator')
    const panel = splitter.locator('.aheart-splitter__panel').first()
    await splitter.scrollIntoViewIfNeeded()
    const handleBox = await handle.boundingBox()
    const beforePanel = await panel.boundingBox()
    const bodyStyle = await page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))
    const beforeStatus = await page.getByTestId('splitter-status').textContent()
    expect(handleBox).not.toBeNull()
    expect(beforePanel).not.toBeNull()

    const pointerIdPromise = page.evaluate(() => new Promise<number>((resolve) => {
      document.addEventListener('pointerdown', (event) => resolve(event.pointerId), { once: true, capture: true })
    }))
    await beginPointerResize(page, handle, handleBox!.x + 40, handleBox!.y + handleBox!.height / 2)
    const pointerId = await pointerIdPromise
    await expect(page.locator('[data-aheart-drag-shield]')).toBeVisible()
    await expect(page.locator('[data-aheart-drag-shield]')).toHaveCSS('pointer-events', 'all')
    await expect.poll(() => page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))).toEqual({ cursor: 'col-resize', userSelect: 'none' })

    await page.evaluate((pointerId) => document.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId })), pointerId)
    await expect(page.locator('[data-aheart-drag-shield]')).toHaveCount(0)
    await expect.poll(() => page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))).toEqual(bodyStyle)
    await expect(page.getByTestId('splitter-status')).toHaveText(beforeStatus ?? '')
    await page.mouse.up()

    await beginPointerResize(page, handle, handleBox!.x + 48, handleBox!.y + handleBox!.height / 2)
    await expect(page.locator('[data-aheart-drag-shield]')).toBeVisible()
    await page.mouse.up()
    await expect(page.getByTestId('splitter-status')).toContainText('已提交')
    await expect(page.locator('[data-aheart-drag-shield]')).toHaveCount(0)
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
    await page.mouse.up()

    await beginPointerResize(page, handle, handleBox!.x + 48, handleBox!.y + handleBox!.height / 2)
    await expect(page.locator('[data-aheart-drag-shield]')).toBeVisible()
    await page.getByRole('button', { name: '卸载 Splitter' }).evaluate((button: HTMLButtonElement) => button.click())
    await expect(page.getByTestId('splitter-fixture')).toHaveAttribute('data-mounted', 'false')
    await expect(page.locator('[data-aheart-drag-shield]')).toHaveCount(0)
    await expect.poll(() => page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))).toEqual(bodyStyle)
    await page.mouse.up()
  })

  test('cleans global drag state when navigating between Splitter and DnD', async ({ page }) => {
    const handle = page.getByTestId('splitter-horizontal').getByRole('separator')
    const handleBox = await handle.boundingBox()
    const initialBodyStyle = await page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))
    expect(handleBox).not.toBeNull()

    await beginPointerResize(page, handle, handleBox!.x + 40, handleBox!.y + handleBox!.height / 2)
    await expect(page.locator('[data-aheart-drag-shield]')).toBeVisible()
    await page.goto('/components/dnd', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('[data-aheart-drag-shield]')).toHaveCount(0)
    await expect.poll(() => page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))).toEqual(initialBodyStyle)
    await page.mouse.up()

    const source = item(page.getByTestId('dnd-todo-list'), '整理需求')
    await source.scrollIntoViewIfNeeded()
    const sourceBox = await source.boundingBox()
    expect(sourceBox).not.toBeNull()
    await page.mouse.move(sourceBox!.x + 12, sourceBox!.y + 12)
    await page.mouse.down()
    await page.mouse.move(sourceBox!.x + 36, sourceBox!.y + 24, { steps: 4 })
    await expect(page.locator('.aheart-dnd-overlay')).toBeVisible()

    await page.goto('/components/splitter', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.aheart-dnd-overlay')).toHaveCount(0)
    await expect(page.locator('[data-aheart-drag-shield]')).toHaveCount(0)
    await expect.poll(() => page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))).toEqual(initialBodyStyle)
    await page.mouse.up()

    await page.goto('/components/dnd', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('dnd-todo-count')).toHaveText('3')
    await expect(page.getByTestId('dnd-todo-events')).toHaveText('update 0 / change 0')
    await expect(page.getByTestId('dnd-status')).toHaveText('可拖拽；禁用或分组不匹配时保持原位')
    await expect(page.locator('.aheart-dnd-overlay')).toHaveCount(0)
    await expect(page.locator('[data-aheart-drag-shield]')).toHaveCount(0)
    await expect.poll(() => page.locator('body').evaluate((body) => ({ cursor: body.style.cursor, userSelect: body.style.userSelect }))).toEqual(initialBodyStyle)
  })

  test('updates from external InputNumber and keeps a visible iframe in the splitter', async ({ page }, testInfo) => {
    const input = page.getByTestId('splitter-input').locator('input').first()
    const initialValue = testInfo.project.name.includes('mobile') ? 120 : 260
    await expect(input).toHaveValue(String(initialValue))
    await page.getByTestId('splitter-input').getByRole('button', { name: 'Increase' }).click()
    await expect(input).toHaveValue(String(initialValue + 1))
    await expect(page.getByTestId('splitter-input-output')).toContainText(`${initialValue + 1} px`)
    await expect(page.getByTestId('splitter-iframe').locator('iframe')).toBeVisible()
  })

  test('clamps mobile external sizes to the measured splitter container', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'Measured mobile bounds only apply to mobile projects.')

    const fixture = page.getByTestId('splitter-fixture')
    const controlled = page.getByTestId('splitter-input')
    const input = controlled.locator('input').first()
    await controlled.scrollIntoViewIfNeeded()

    await input.fill('480')
    await input.press('Enter')

    const firstSize = Number((await page.getByTestId('splitter-input-output').textContent())?.replace(/\D/g, ''))
    const containerWidth = await controlled.locator('.aheart-splitter').evaluate((node) => node.getBoundingClientRect().width)
    expect(firstSize).toBeLessThanOrEqual(Math.floor(containerWidth - 160))
    expect(await fixture.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)

    const controlledFrame = controlled.locator('.aheart-splitter').locator('..')
    await controlledFrame.evaluate((node) => ((node as HTMLElement).style.width = '240px'))
    await expect.poll(async () => Number(await input.getAttribute('aria-valuemax'))).toBeLessThan(240)
    await input.fill('480')
    await input.press('Enter')
    await expect.poll(async () => controlled.locator('.aheart-splitter__panel').evaluateAll((nodes) =>
      nodes.reduce((total, node) => total + (node as HTMLElement).getBoundingClientRect().width, 0)
    )).toBeLessThanOrEqual(240)
    await expect.poll(async () => controlled.locator('.aheart-splitter').evaluate((node) => {
      const occupied = [...node.children].reduce(
        (total, child) => total + (child as HTMLElement).getBoundingClientRect().width,
        0
      )
      return occupied <= node.getBoundingClientRect().width
    })).toBe(true)
  })

  test('renders the panel API table and keeps mobile controlled sizes inside the fixture', async ({ page }, testInfo) => {
    await expect(page.locator('h3#splitterpanel + table')).toBeVisible()
    if (!testInfo.project.name.includes('mobile')) return

    const fixture = page.getByTestId('splitter-fixture')
    await fixture.scrollIntoViewIfNeeded()
    expect(await fixture.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
    await expect(page.getByTestId('splitter-input').locator('input').first()).toHaveValue('120')
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
