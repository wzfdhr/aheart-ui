import { expect, test } from '@playwright/test'

test('AIChatPanel supports prompts, failure recovery, editing, and conversation switching', async ({ page }, testInfo) => {
  await page.goto('/components/ai')

  const panel = page.locator('.aheart-ai-chat-panel').first()
  await expect(panel.getByText('你好，我能为你做些什么？')).toBeVisible()
  await expect(panel.locator('.aheart-ai-prompts li').first()).toHaveCSS('list-style-type', 'none')
  const activeConversation = panel.getByRole('button', { name: '会话一' })
  await activeConversation.focus()
  await expect(activeConversation).toHaveCSS('outline-style', 'solid')
  if (testInfo.project.name === 'mobile') {
    const conversationBox = await activeConversation.boundingBox()
    const senderBox = await panel.getByRole('button', { name: '发送消息' }).boundingBox()
    const attachmentBox = await panel.getByRole('button', { name: '移除 产品简报.md' }).boundingBox()
    expect(conversationBox!.height).toBeGreaterThanOrEqual(44)
    expect(senderBox!.height).toBeGreaterThanOrEqual(44)
    expect(attachmentBox!.height).toBeGreaterThanOrEqual(44)
  }
  await panel.getByRole('button', { name: '会话二' }).click()
  await expect(page.locator('[data-demo-active-conversation]')).toHaveText('会话二')

  await panel.getByRole('button', { name: '模拟失败并重试' }).click()
  await expect(panel.locator('.aheart-ai-bubble__error')).toHaveText('模拟服务暂不可用')
  await panel.locator('[data-action="retry"]').click()
  await expect(panel.getByText(/连接已恢复/)).toBeVisible()

  const userMessage = panel.locator('[data-message-id]').filter({ hasText: '模拟失败并重试' }).first()
  await userMessage.locator('[data-action="edit"]').click()
  await panel.getByRole('textbox', { name: '消息内容' }).fill('编辑后的恢复请求')
  await panel.getByRole('button', { name: '发送消息' }).click()
  await expect(panel.getByText('编辑后的恢复请求')).toBeVisible()
  await expect(panel.locator('[data-action="copy"]').first()).toBeVisible()
})

test('AIChatPanel stops a live stream without accepting late output', async ({ page }) => {
  await page.goto('/components/ai')

  const panel = page.locator('.aheart-ai-chat-panel').first()
  await panel.getByRole('button', { name: '生成产品发布摘要' }).click()
  await expect(panel.locator('.aheart-ai-bubble__content').filter({ hasText: '正在分析产品目标' })).toBeVisible()
  await panel.getByRole('button', { name: '停止生成' }).click()

  await expect(panel.getByRole('status')).toHaveText('已停止生成')
  await expect(panel.getByText('这段内容不应在停止后出现')).toHaveCount(0)
})

test('AIForm groups fields, focuses validation, and exposes async submission states', async ({ page }) => {
  await page.goto('/components/ai-form')

  const form = page.locator('.aheart-ai-form').first()
  await expect(form.locator('fieldset')).toHaveCount(2)
  const switchBox = await form.locator('.aheart-switch').boundingBox()
  const formBox = await form.boundingBox()
  expect(switchBox).not.toBeNull()
  expect(formBox).not.toBeNull()
  expect(switchBox!.width).toBeLessThan(formBox!.width / 2)
  await form.getByRole('button', { name: '创建研究任务' }).click()
  await expect(form.getByRole('alert').filter({ hasText: '请完成' })).toContainText('1 个必填项')
  await expect(form.locator('[data-field-key="title"]')).toBeFocused()

  await form.locator('#title').fill('Aheart UI 质量研究')
  await form.getByRole('button', { name: '创建研究任务' }).click()
  await expect(form).toHaveAttribute('aria-busy', 'true')
  await expect(page.locator('[data-ai-form-success]')).toContainText('任务已创建')
})

test('Agent workbench completes approval and controlled artifact preview workflows', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop')
  await page.goto('/components/ai-agent-workbench')

  const workbench = page.locator('.aheart-ai-workbench').first()
  const workbenchBox = await workbench.boundingBox()
  const executionBox = await workbench.locator('.aheart-ai-workbench__execution').boundingBox()
  expect(workbenchBox).not.toBeNull()
  expect(executionBox).not.toBeNull()
  expect(executionBox!.x + executionBox!.width).toBeLessThanOrEqual(workbenchBox!.x + workbenchBox!.width + 1)
  await expect(workbench.locator('.aheart-ai-workbench__eyebrow').first()).toHaveCSS('color', 'rgb(14, 116, 144)')
  await expect(workbench.locator('[data-workbench-status]')).toContainText('需要处理')
  await workbench.locator('[data-task-id="summary"] [data-action="retry"]').click()
  await expect(workbench.locator('[data-task-id="summary"]')).toContainText('已完成')
  await expect(workbench.locator('[data-workbench-status]')).toContainText('等待人工审批')
  await workbench.locator('[data-approval-id="publish-approval"] [data-action="approve"]').click()
  await expect(workbench.locator('[data-approval-id="publish-approval"]')).toContainText('已批准')
  await expect(workbench.locator('[data-workbench-status]')).toContainText('已完成')

  await workbench.locator('[data-artifact-id="source-data"] button').click()
  await expect(workbench.locator('.aheart-ai-workbench__artifact-preview')).toContainText('来源数据.csv')
})

test('AI product surfaces remain operable on mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile')
  await page.goto('/components/ai-agent-workbench')

  const workbench = page.locator('.aheart-ai-workbench').first()
  await expect(workbench.locator('.aheart-ai-workbench__desktop')).toBeHidden()
  await workbench.getByRole('tab', { name: '会话' }).click()
  const workbenchConversationBox = await workbench.getByRole('button', { name: '产品方案' }).boundingBox()
  expect(workbenchConversationBox!.height).toBeGreaterThanOrEqual(44)
  expect(workbenchConversationBox!.width).toBeGreaterThanOrEqual(44)
  await workbench.getByRole('tab', { name: '执行' }).click()
  await workbench.getByRole('button', { name: '查看执行与产物' }).click()
  await expect(page.getByRole('dialog', { name: '执行与产物' })).toBeVisible()
  const drawer = page.getByRole('dialog', { name: '执行与产物' })
  const closeButtonBox = await drawer.getByRole('button', { name: 'Close' }).boundingBox()
  await expect(drawer.locator('.aheart-ai-workbench__timeline-item').first()).toBeVisible()
  const moveButtonBox = await drawer.getByRole('button', { name: /下\s*移/ }).first().boundingBox()
  expect(closeButtonBox!.height).toBeGreaterThanOrEqual(44)
  expect(closeButtonBox!.width).toBeGreaterThanOrEqual(44)
  expect(moveButtonBox!.height).toBeGreaterThanOrEqual(44)
  expect(moveButtonBox!.width).toBeGreaterThanOrEqual(44)
})
