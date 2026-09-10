import { expect, test, type Page } from '@playwright/test'

/**
 * D8 browser contract fixture.
 *
 * The fixture contract exposes only scenario controls and observable state via
 * data-testid. Behaviour assertions use the real component DOM (roles,
 * labels, and public classes/data-action hooks), so a marker cannot make a
 * browser gate green without the component actually rendering the behaviour.
 * This suite has no conditional skips: every browser project must exercise the
 * same stream, workbench, form, tool-summary, and owner-document paths.
 */
const fixtureUrl = '/components/ai-agent-workbench?fixture=d8'

async function openFixture(page: Page) {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text())
  })
  await page.goto(fixtureUrl)
  const fixture = page.getByTestId('d8-ai-fixture')
  await expect(fixture).toBeVisible()
  return { fixture, runtimeErrors }
}

test.describe('D8 AI browser contract', () => {
  test('V2 stream applies reorder, deduplication, reconnect, final checkpoint, and conversation abort', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    const { fixture, runtimeErrors } = await openFixture(page)
    const stream = fixture.getByTestId('d8-v2-stream')
    const chat = stream.locator('.aheart-ai-chat-panel')
    await expect(chat).toHaveCount(1)
    const composer = chat.locator('textarea[aria-label="消息内容"]')
    const send = chat.locator('form.aheart-ai-sender button[type="submit"]')

    await composer.fill('真实 V2 请求')
    await send.click()
    await expect(stream.getByTestId('d8-stream-status')).toHaveText('streaming')
    await expect(chat.locator('.aheart-ai-bubble').first()).toBeVisible()
    await stream.getByTestId('d8-v2-dispatch-out-of-order').click()
    await expect(chat.locator('.aheart-ai-bubble__content').last()).toHaveText('先到的片段后到的片段')
    await stream.getByTestId('d8-v2-dispatch-duplicate').click()
    await expect(chat.locator('.aheart-ai-bubble__content').last()).toHaveText('先到的片段后到的片段')

    await stream.getByTestId('d8-v2-trigger-reconnect').click()
    await expect(stream.getByTestId('d8-stream-status')).toHaveText('reconnecting')
    const reconnectingStatus = chat.locator('.aheart-ai-chat-panel__stream-reconnecting[role="status"]')
    await expect(reconnectingStatus).toBeVisible()
    await expect(reconnectingStatus).toContainText('正在恢复连接')
    await expect(reconnectingStatus).not.toHaveClass(/visually-hidden/)
    await expect(chat.locator('.aheart-ai-chat-panel__stream-reconnecting[role="status"]:visible')).toHaveCount(1)
    await expect(stream.getByTestId('d8-resume-call-count')).toHaveText('1')
    await stream.getByTestId('d8-v2-resume').click()
    await expect(stream.getByTestId('d8-stream-status')).toHaveText('completed')
    await expect(reconnectingStatus).toBeHidden()
    await expect(chat.locator('.aheart-ai-bubble__content').last()).toContainText('服务端最终版本')

    await composer.fill('第二次真实请求')
    await send.click()
    const conversations = chat.locator('.aheart-ai-conversations')
    await expect(conversations).toBeVisible()
    await conversations.getByRole('button').nth(1).click()
    await expect(conversations.getByRole('button').nth(1)).toHaveAttribute('aria-current', 'page')
    const bubbleTexts = await chat.locator('.aheart-ai-bubble__content').allTextContents()
    expect(bubbleTexts.join('\n')).not.toContain('late-event')
    await expect(stream.getByTestId('d8-update-log')).not.toContainText('late-event')
    expect(runtimeErrors).toEqual([])
  })

  test('Workbench keeps one responsive owner and locks transactional operations with retry idempotency', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    const { fixture, runtimeErrors } = await openFixture(page)
    const workbench = fixture.getByTestId('d8-workbench')

    const desktop = workbench.locator('.aheart-ai-workbench__desktop')
    const mobile = workbench.locator('.aheart-ai-workbench__mobile')
    await expect(desktop).toBeVisible()
    await expect(desktop.locator('.aheart-ai-workbench__sidebar')).toBeVisible()
    await expect(desktop.locator('.aheart-ai-workbench__chat')).toBeVisible()
    await expect(desktop.locator('.aheart-ai-workbench__execution')).toBeVisible()
    await expect(mobile).toBeHidden()
    await expect(workbench.locator('.aheart-ai-chat-panel')).toHaveCount(1)
    await expect(workbench.locator('.aheart-ai-workbench__execution-content')).toHaveCount(1)
    const draft = workbench.locator('.aheart-ai-chat-panel textarea[aria-label="消息内容"]')
    await draft.fill('跨布局 draft')

    await page.setViewportSize({ width: 390, height: 844 })
    await expect(mobile).toBeVisible()
    await expect(desktop).toBeHidden()
    await expect(workbench.locator('.aheart-ai-chat-panel')).toHaveCount(1)
    await expect(workbench.locator('.aheart-ai-workbench__execution-content')).toHaveCount(1)
    await expect(draft).toHaveValue('跨布局 draft')
    await mobile.getByRole('tab', { name: '执行' }).click()
    await mobile.locator('[data-action="open-execution-drawer"]').click()
    const drawer = page.getByRole('dialog', { name: '执行与产物' })
    await expect(drawer).toBeVisible()
    await expect(page.locator('.aheart-drawer.is-entered')).toHaveCount(1)
    await expect(workbench.locator('.aheart-ai-chat-panel')).toHaveCount(1)
    await expect(workbench.locator('.aheart-ai-workbench__execution-content')).toHaveCount(1)

    const approve = drawer.locator('[data-action="approve"]:visible').first()
    await approve.click()
    await expect(workbench.getByTestId('d8-operation-state')).toHaveText('pending')
    await expect(drawer.locator('[data-action="reject"]:visible').first()).toBeDisabled()
    await workbench.getByTestId('d8-operation-settle-unknown').evaluate((element) => (element as HTMLButtonElement).click())
    await expect(workbench.getByTestId('d8-operation-state')).toHaveText('error:unknown')
    await expect(drawer.locator('[data-action="retry"]:visible').first()).toBeEnabled()

    const firstKey = await workbench.getByTestId('d8-operation-idempotency').getAttribute('data-key')
    await drawer.locator('[data-action="retry"]:visible').first().click()
    await expect(workbench.getByTestId('d8-operation-state')).toHaveText('pending')
    await expect(workbench.getByTestId('d8-operation-idempotency')).toHaveAttribute('data-key', firstKey ?? '')
    await workbench.getByTestId('d8-operation-settle-not-applied').evaluate((element) => (element as HTMLButtonElement).click())
    await expect(workbench.getByTestId('d8-operation-state')).toHaveText('error:not-applied')
    await expect(drawer.locator('[data-action="retry"]:visible').first()).toBeEnabled()
    await drawer.locator('[data-action="retry"]:visible').first().click()
    await workbench.getByTestId('d8-operation-settle-success').evaluate((element) => (element as HTMLButtonElement).click())
    await expect(workbench.getByTestId('d8-operation-state')).toHaveText('success')
    await expect(drawer.locator('[data-action="approve"]:visible').first()).toBeDisabled()
    expect(runtimeErrors).toEqual([])
  })

  test('Workbench enforces dependency order, locked tasks, and stale revision rejection', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    const { fixture, runtimeErrors } = await openFixture(page)
    const workbench = fixture.getByTestId('d8-workbench')

    const mobile = workbench.locator('.aheart-ai-workbench__mobile')
    await mobile.getByRole('tab', { name: '执行' }).click()
    await mobile.locator('[data-action="open-execution-drawer"]').click()
    const drawer = page.getByRole('dialog', { name: '执行与产物' })
    await expect(drawer).toBeVisible()
    await expect(page.locator('.aheart-drawer.is-entered')).toHaveCount(1)
    const drawerTaskList = drawer.locator('.aheart-ai-workbench__execution-content')

    await expect(drawerTaskList.locator('[data-task-id]')).toHaveCount(3)
    const prepare = drawerTaskList.locator('[data-task-id="prepare"]')
    await expect(prepare.locator('[data-action="move-down"]')).toBeEnabled()
    await prepare.locator('[data-action="move-down"]').click()
    await expect(workbench.getByTestId('d8-task-rejection')).toHaveText('依赖任务必须排在前面')

    const locked = drawerTaskList.locator('[data-task-id="run"]')
    await expect(locked.locator('[data-action="move-up"]')).toBeDisabled()
    await expect(locked.locator('.aheart-ai-workbench__task-lock-reason[role="status"]')).toBeVisible()
    await expect(locked.locator('.aheart-ai-workbench__task-lock-reason[role="status"]')).toContainText('任务当前不可排序')

    const sortableItem = prepare.locator('xpath=ancestor::li[contains(@class,"aheart-dnd-sortable-item")]')
    const targetList = drawerTaskList.locator('.aheart-dnd-sortable-list').first()
    const sourceBox = await sortableItem.boundingBox()
    const targetBox = await targetList.boundingBox()
    expect(sourceBox).not.toBeNull()
    expect(targetBox).not.toBeNull()
    const sourcePoint = { x: (sourceBox?.x ?? 0) + (sourceBox?.width ?? 0) / 2, y: (sourceBox?.y ?? 0) + (sourceBox?.height ?? 0) / 2 }
    const targetPoint = { x: (targetBox?.x ?? 0) + (targetBox?.width ?? 0) / 2, y: (targetBox?.y ?? 0) + Math.min((targetBox?.height ?? 0) / 2, 48) }
    await page.mouse.move(sourcePoint.x, sourcePoint.y)
    await page.mouse.down()
    await page.mouse.move(sourcePoint.x + 32, sourcePoint.y + 32, { steps: 4 })
    await workbench.getByTestId('d8-task-update-revision').evaluate((element) => (element as HTMLButtonElement).click())
    await page.mouse.move(targetPoint.x, targetPoint.y, { steps: 8 })
    await page.mouse.up()
    await expect(workbench.getByTestId('d8-task-rejection')).toHaveText('任务版本已变化，排序已拒绝')
    expect(runtimeErrors).toEqual([])
  })

  test('AIForm validates range, format, compare, async, reset, and server errors through the form surface', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    const { fixture, runtimeErrors } = await openFixture(page)
    const form = fixture.getByTestId('d8-ai-form')
    const nativeForm = form.locator('form')

    await nativeForm.locator('button[type="submit"]').click()
    await expect(form.locator('.aheart-ai-form__error-summary[role="alert"]')).toContainText('校验问题')
    await form.getByLabel('数量').fill('101')
    await form.getByLabel('邮箱').fill('not-an-email')
    await form.getByLabel('确认值').fill('different')
    await nativeForm.locator('button[type="submit"]').click()
    await expect(form.locator('[data-field-key="number"] .aheart-ai-form__field-error[role="alert"]')).toContainText('范围')
    await expect(form.locator('[data-field-key="email"] .aheart-ai-form__field-error[role="alert"]')).toContainText('邮箱')
    await expect(form.locator('[data-field-key="confirm"] .aheart-ai-form__field-error[role="alert"]')).toContainText('一致')

    await form.getByLabel('数量').fill('10')
    await form.getByLabel('邮箱').fill('user@example.com')
    await form.getByLabel('确认值').fill('user@example.com')
    await form.getByLabel('异步值').fill('already-taken')
    await nativeForm.locator('button[type="submit"]').click()
    await expect(form.locator('[data-field-key="asyncValue"] .aheart-ai-form__field-error[role="alert"]')).toContainText('已存在')
    await form.getByTestId('d8-form-server-error').click()
    await expect(form.locator('.aheart-ai-form__error-summary[role="alert"]')).toContainText('服务端')
    await form.getByTestId('d8-form-reset').click()
    await expect(form.getByLabel('数量')).toHaveValue('5')
    await expect(form.locator('.aheart-ai-form__error-summary[role="alert"]')).toHaveCount(0)
    expect(runtimeErrors).toEqual([])
  })

  test('tool summary is whitelist-only and iframe owner-document cleanup survives narrow 200% layout', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    const { fixture, runtimeErrors } = await openFixture(page)
    const tool = fixture.locator('.aheart-ai-bubble .aheart-ai-bubble__tool-call, .aheart-ai-workbench__tool-call').first()
    await expect(tool).toBeVisible()
    await expect(tool.getByText('输入', { exact: true })).toBeVisible()
    await expect(tool.getByText('结果', { exact: true })).toBeVisible()
    await expect(tool.getByText('安全输入', { exact: true })).toBeVisible()
    await expect(tool.getByText('完成', { exact: true })).toBeVisible()
    await expect(tool).toContainText('查找资料')
    await expect(tool).toContainText('完成')
    await expect(tool).not.toContainText('reasoning')
    await expect(tool).not.toContainText('chain-of-thought')
    await expect(tool).not.toContainText('raw-arguments')
    await expect(tool).not.toContainText('secret-payload')

    const iframe = fixture.locator('iframe[data-testid="d8-owner-document-iframe"]')
    await expect(iframe).toBeVisible()
    const frame = page.frameLocator('iframe[data-testid="d8-owner-document-iframe"]')
    const frameFixture = frame.getByTestId('d8-ai-fixture')
    await expect(frameFixture.getByTestId('d8-iframe-chat')).toBeVisible()
    await frameFixture.locator('.aheart-ai-workbench__mobile').getByRole('tab', { name: '执行' }).click()
    await frameFixture.locator('.aheart-ai-workbench__mobile [data-action="open-execution-drawer"]').click()
    const frameDrawer = frame.locator('.aheart-drawer:visible')
    await expect(frameDrawer).toHaveCount(1)
    await frameDrawer.locator('.aheart-drawer__close').click()
    await expect(frame.locator('.aheart-drawer:visible')).toHaveCount(0)
    await expect(frame.locator('body')).not.toHaveCSS('overflow', 'hidden')
    await frameFixture.getByTestId('d8-iframe-unmount').click()
    await expect(frameFixture.getByTestId('d8-iframe-cleanup-count')).toHaveText('1')

    await page.evaluate(() => {
      document.documentElement.style.zoom = '200%'
    })
    await expect(fixture).toHaveAttribute('data-overflow-x', 'false')
    expect(runtimeErrors).toEqual([])
  })
})
