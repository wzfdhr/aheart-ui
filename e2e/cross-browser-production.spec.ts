import { expect, test, type Page, type TestInfo } from '@playwright/test'

const collectProductionErrors = (page: Page) => {
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

  return errors
}

const attachProductionErrors = async (testInfo: TestInfo, errors: string[]) => {
  await testInfo.attach('production-console.json', {
    body: Buffer.from(JSON.stringify(errors, null, 2)),
    contentType: 'application/json'
  })
}

const expectInsideViewport = async (locator: ReturnType<Page['locator']>, page: Page) => {
  const viewport = page.viewportSize()
  expect(viewport).not.toBeNull()
  await expect.poll(async () => {
    const box = await locator.boundingBox()
    return Boolean(
      box &&
      box.x >= -1 &&
      box.y >= -1 &&
      box.x + box.width <= viewport!.width + 1 &&
      box.y + box.height <= viewport!.height + 1
    )
  }).toBe(true)
}

test.describe('QG5 production cross-browser gates', () => {
  test('production assets load and interactive routes hydrate without runtime errors', async ({ page }, testInfo) => {
    const errors = collectProductionErrors(page)

    for (const route of ['select', 'modal', 'ai-agent-workbench'] as const) {
      await page.goto(`/components/${route}`, { waitUntil: 'domcontentloaded' })
      await page.waitForFunction(() => Boolean((document.querySelector('#app') as HTMLElement & { __vue_app__?: unknown } | null)?.__vue_app__))
      await expect(page.locator('.vp-doc h1')).toBeVisible()
      await expect(page.locator('.aheart-demo-panel, .aheart-ai-workbench').first()).toBeVisible()
    }

    await attachProductionErrors(testInfo, errors)
    expect(errors).toEqual([])
  })

  test('Floating UI remains visible after scrolling, resizing, and edge adjustment', async ({ page }, testInfo) => {
    const errors = collectProductionErrors(page)
    await page.goto('/components/select')

    const select = page.locator('.aheart-demo-panel').first().getByRole('combobox')
    await select.scrollIntoViewIfNeeded()
    await select.click()
    const popup = page.getByRole('listbox').first()
    await expect(popup).toBeVisible()
    await expect(popup.evaluate((element) => element.parentElement === document.body)).resolves.toBe(true)
    await expectInsideViewport(popup, page)

    await page.evaluate(() => window.scrollBy(0, 120))
    await expectInsideViewport(popup, page)
    const currentViewport = page.viewportSize()!
    await page.setViewportSize({ width: Math.max(390, currentViewport.width - 120), height: currentViewport.height })
    await expectInsideViewport(popup, page)
    await attachProductionErrors(testInfo, errors)
    expect(errors).toEqual([])
  })

  test('Teleport overlays close cleanly and restore focus', async ({ page }, testInfo) => {
    const errors = collectProductionErrors(page)
    await page.goto('/components/modal')

    const trigger = page.getByRole('button', { name: 'Open modal', exact: true }).first()
    await trigger.focus()
    await expect(trigger).toBeFocused()
    await trigger.press('Enter')
    const modal = page.locator('.aheart-modal').first()
    await expect(modal).toBeVisible()
    await expect(modal.evaluate((element) => element.parentElement === document.body)).resolves.toBe(true)
    await expectInsideViewport(modal.locator('.aheart-modal__dialog'), page)

    await page.keyboard.press('Escape')
    await expect(modal).toBeHidden()
    await expect(trigger).toBeFocused()
    await attachProductionErrors(testInfo, errors)
    expect(errors).toEqual([])
  })

  test('mobile production surfaces stay within the viewport', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'Mobile containment belongs to mobile projects.')
    const errors = collectProductionErrors(page)
    await page.goto('/components/ai-agent-workbench')

    const workbench = page.locator('.aheart-ai-workbench').first()
    await expect(workbench).toBeVisible()
    const overflow = await workbench.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth
    }))
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth)

    await workbench.getByRole('tab', { name: '执行' }).click()
    await workbench.getByRole('button', { name: '查看执行与产物', exact: true }).click()
    const drawer = page.getByRole('dialog', { name: '执行与产物' })
    await expect(drawer.locator('xpath=..')).toHaveClass(/is-entered/)
    await expectInsideViewport(drawer, page)
    await attachProductionErrors(testInfo, errors)
    expect(errors).toEqual([])
  })
})
