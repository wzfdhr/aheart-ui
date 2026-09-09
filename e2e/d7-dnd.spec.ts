import { expect, test, type Frame, type Locator, type Page } from '@playwright/test'

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

const dispatchPointer = async (target: Locator, type: 'pointerdown' | 'pointermove' | 'pointerup', init: { pointerId: number; clientX: number; clientY: number }) => {
  await target.evaluate((node, payload) => {
    node.dispatchEvent(new PointerEvent(payload.type, {
      ...payload.init,
      bubbles: true,
      cancelable: true,
      composed: true,
      isPrimary: true,
      pointerType: 'touch',
      button: 0,
      buttons: payload.type === 'pointerup' ? 0 : 1,
      pressure: payload.type === 'pointerup' ? 0 : 0.5
    }))
  }, { type, init })
}

const dispatchIframePointer = async (frame: Frame, type: 'pointerdown' | 'pointermove' | 'pointerup', init: { pointerId: number; clientX: number; clientY: number }) => {
  await frame.evaluate((payload) => {
    const target = document.elementFromPoint(payload.init.clientX, payload.init.clientY) ?? document.body
    target.dispatchEvent(new PointerEvent(payload.type, {
      ...payload.init,
      bubbles: true,
      cancelable: true,
      composed: true,
      isPrimary: true,
      pointerType: 'touch',
      button: 0,
      buttons: payload.type === 'pointerup' ? 0 : 1,
      pressure: payload.type === 'pointerup' ? 0 : 0.5
    }))
  }, { type, init })
}

test.describe('D7 DnD browser contract', () => {
  test.beforeEach(async ({ page }) => {
    collectRuntimeErrors(page)
    await page.goto('/components/dnd', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('d7-fixture')).toBeVisible()
  })

  test.afterEach(async ({ page }) => {
    expectNoRuntimeErrors(page)
  })

  test('generic Draggable and DropZone support keyboard grab, compatible drop, mismatch, disabled target, and Escape restore', async ({ page }) => {
    const source = page.getByTestId('d7-generic-source')
    const accepted = page.getByTestId('d7-generic-accepted')
    const mismatch = page.getByTestId('d7-generic-mismatch')
    const disabled = page.getByTestId('d7-generic-disabled')
    const live = page.locator('.aheart-dnd-live-region')

    await source.focus()
    await page.keyboard.press('Space')
    await expect(source).toHaveAttribute('data-aheart-dnd-keyboard-state', 'grabbed')
    await expect(live).toContainText('任务源，已抓取')
    await accepted.focus()
    await expect(accepted).toHaveAttribute('data-aheart-dnd-keyboard-state', 'compatible')
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('d7-generic-drop-count')).toContainText('成功放置：1 次')
    await expect(page.getByTestId('d7-generic-keyboard-drop-count')).toContainText('键盘放置：1 次')
    await expect(live).toContainText('已放置到任务收件箱')

    await source.focus()
    await page.keyboard.press('Enter')
    await mismatch.focus()
    await expect(mismatch).toHaveAttribute('data-aheart-dnd-keyboard-state', 'incompatible')
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('d7-generic-drop-count')).toContainText('成功放置：1 次')
    await expect(live).toContainText('类型不匹配，拒绝放置')

    await source.focus()
    await page.keyboard.press('Space')
    await disabled.focus()
    await page.getByTestId('d7-generic-disable-toggle').click()
    await expect(disabled).toHaveAttribute('tabindex', '-1')
    await disabled.focus()
    await page.keyboard.press('Enter')
    await expect(disabled).toContainText('备用收件箱（已禁用）')
    await expect(page.getByTestId('d7-generic-drop-count')).toContainText('成功放置：1 次')
    await expect(live).toContainText('目标已禁用')

    await source.focus()
    await page.keyboard.press('Space')
    await page.keyboard.press('Escape')
    await expect(source).toHaveAttribute('data-aheart-dnd-keyboard-state', 'idle')
    await expect(source).toBeFocused()
    await expect(page.getByTestId('d7-generic-cancel-reason')).toContainText('取消状态：已取消')
    await expect(page.getByTestId('d7-generic-cancel-reason-code')).toHaveText('cancelled')
  })

  test('SortableList rejects stale revision, reports stable event payload, and rolls back a one-sided parent rejection', async ({ page }) => {
    const staleSource = page.getByTestId('d7-stale-source').getByRole('button').first()
    const staleTarget = page.getByTestId('d7-stale-target').locator('.aheart-dnd-sortable-list')
    const staleSourceBox = await staleSource.boundingBox()
    const staleTargetBox = await staleTarget.boundingBox()
    expect(staleSourceBox).not.toBeNull()
    expect(staleTargetBox).not.toBeNull()
    await staleSource.focus()
    await dispatchPointer(staleSource, 'pointerdown', { pointerId: 71, clientX: staleSourceBox!.x + 8, clientY: staleSourceBox!.y + 8 })
    await dispatchPointer(staleSource, 'pointermove', { pointerId: 71, clientX: staleSourceBox!.x + 20, clientY: staleSourceBox!.y + 20 })
    await page.getByTestId('d7-stale-refresh').click()
    await dispatchPointer(staleTarget, 'pointerup', { pointerId: 71, clientX: staleTargetBox!.x + 12, clientY: staleTargetBox!.y + 12 })
    await expect(page.getByTestId('d7-stale-reject-reason')).toContainText('过期拒绝原因：stale-revision')
    await expect(page.getByTestId('d7-stale-update-count')).toContainText('过期更新次数：0')

    const rollbackSource = page.getByTestId('d7-rollback-source')
    const rollbackTarget = page.getByTestId('d7-rollback-target')
    await rollbackSource.getByRole('listitem').first().focus()
    await page.keyboard.press('Alt+ArrowRight')
    await expect.poll(() => rollbackSource.locator('[data-item-id]').evaluateAll((nodes) => nodes.map((node) => (node as HTMLElement).dataset.itemId))).toEqual(['rollback-source'])
    await expect.poll(() => rollbackTarget.locator('[data-item-id]').evaluateAll((nodes) => nodes.map((node) => (node as HTMLElement).dataset.itemId))).toEqual(['rollback-target'])
    await expect(page.getByTestId('d7-rollback-reject-reason')).toHaveText('parent-rejected')
    await expect(page.getByTestId('d7-rollback-field')).toHaveText('并发字段：已保留')
    await expect(page.getByTestId('d7-rollback-reject-count')).toHaveText('2')
    await expect(page.getByTestId('d7-rollback-events')).toContainText('candidate,rollback')
    await expect(page.getByTestId('d7-rollback-payload')).toContainText('itemKey')
    await expect(page.getByTestId('d7-rollback-payload')).toContainText('transactionId')

    const duplicate = page.getByTestId('d7-duplicate-list')
    await duplicate.getByRole('listitem').first().focus()
    await page.keyboard.press('Alt+ArrowDown')
    await expect(page.getByTestId('d7-duplicate-reject-reason')).toContainText('重复键结果：已安全拒绝（键重复）')
    await expect(page.getByTestId('d7-duplicate-reject-reason-code')).toHaveText('duplicate-key')
    await expect(page.getByTestId('d7-duplicate-update-count')).toContainText('重复键更新次数：0')

    await page.getByTestId('d7-late-drop-start').click()
    await page.getByTestId('d7-late-drop-unmount').click()
    await page.getByTestId('d7-late-drop-finish').click()
    await expect(page.getByTestId('d7-late-drop-result')).toHaveText('迟到 drop 结果：更新 0 次；drop 0 次')
  })

  test('scopeKey navigation cancels a keyboard session and pending sortable work', async ({ page }) => {
    const source = page.getByTestId('d7-scope-source')
    await source.focus()
    await page.keyboard.press('Space')
    await expect(source).toHaveAttribute('data-aheart-dnd-keyboard-state', 'grabbed')
    await page.getByTestId('d7-scope-navigate').click()
    await expect(source).toHaveAttribute('data-aheart-dnd-keyboard-state', 'idle')
    await expect(page.getByTestId('d7-scope-cancel-reason')).toContainText('路由取消状态：已因页面切换取消')
    await expect(page.getByTestId('d7-scope-cancel-reason-code')).toHaveText('scope-changed')
    await expect(page.locator('.aheart-dnd-live-region')).toContainText('页面已切换，拖动已取消')
    await expect(page.getByTestId('d7-scope-update-count')).toContainText('路由更新次数：0')
  })

  test('iframe owner realm performs nested auto-scroll and releases on frame detach', async ({ page }) => {
    const iframe = page.getByTestId('d7-owner-iframe')
    const iframeHandle = await iframe.elementHandle()
    const frame = await iframeHandle?.contentFrame()
    expect(frame).not.toBeNull()
    await expect(frame!.getByTestId('d7-iframe-scroll').first()).toBeVisible()
    const scroll = frame!.getByTestId('d7-iframe-scroll').first()
    const handle = frame!.getByTestId('d7-iframe-handle').first()
    const handleBox = await handle.evaluate((node) => {
      const rect = node.getBoundingClientRect()
      return { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
    })
    const box = await scroll.evaluate((node) => {
      const rect = node.getBoundingClientRect()
      return { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
    })
    expect(box).not.toBeNull()
    await dispatchIframePointer(frame!, 'pointerdown', { pointerId: 91, clientX: handleBox.x + handleBox.width / 2, clientY: handleBox.y + handleBox.height / 2 })
    await dispatchIframePointer(frame!, 'pointermove', { pointerId: 91, clientX: handleBox.x + handleBox.width / 2 + 12, clientY: handleBox.y + handleBox.height / 2 + 12 })
    for (let index = 0; index < 8; index += 1) {
      await dispatchIframePointer(frame!, 'pointermove', { pointerId: 91, clientX: box!.x + 20, clientY: box!.y + box!.height - 2 })
    }
    await expect.poll(() => scroll.evaluate((node) => (node as HTMLElement).scrollTop)).toBeGreaterThan(0)
    await dispatchIframePointer(frame!, 'pointerup', { pointerId: 91, clientX: handleBox.x + handleBox.width / 2, clientY: handleBox.y + handleBox.height / 2 })
    await expect(handle).toBeVisible()
    await page.getByTestId('d7-owner-unmount').click()
    await expect(page.getByTestId('d7-owner-state')).toContainText('iframe 状态：已分离')
    await expect(page.getByTestId('d7-owner-state-code')).toHaveText('detached')
    await expect(page.getByTestId('d7-owner-live-count')).toContainText('owner live region：已释放')
    await expect(page.locator('.aheart-dnd-overlay')).toHaveCount(0)
  })

  test('desktop and mobile layouts remain within the viewport with zero runtime errors', async ({ page, isMobile }) => {
    const fixture = page.getByTestId('d7-fixture')
    await fixture.scrollIntoViewIfNeeded()
    expect(await fixture.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
    const columns = await fixture.locator('.d7-generic-grid').evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').length)
    expect(columns).toBe(isMobile ? 1 : 2)
    await expect(page.getByTestId('d7-generic-source')).toBeVisible()
    await expect(page.getByTestId('d7-rollback-source')).toBeVisible()
    await expect(page.getByTestId('d7-owner-iframe')).toBeVisible()
    expectNoRuntimeErrors(page)
  })
})
