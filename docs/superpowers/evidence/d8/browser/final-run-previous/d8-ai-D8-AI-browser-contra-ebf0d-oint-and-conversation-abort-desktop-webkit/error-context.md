# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: d8-ai.spec.ts >> D8 AI browser contract >> V2 stream applies reorder, deduplication, reconnect, final checkpoint, and conversation abort
- Location: e2e/d8-ai.spec.ts:28:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByTestId('d8-ai-fixture').getByTestId('d8-v2-stream').locator('.aheart-ai-chat-panel')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for getByTestId('d8-ai-fixture').getByTestId('d8-v2-stream').locator('.aheart-ai-chat-panel')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "跳至正文" [ref=e4]:
    - /url: "#VPContent"
  - banner:
    - generic:
      - generic:
        - generic:
          - link "Aheart UI" [ref=e6]:
            - /url: /
            - generic [ref=e7]: Aheart UI
          - button "mobile navigation" [ref=e9] [cursor=pointer]
  - generic [ref=e15]:
    - button "菜单" [ref=e16] [cursor=pointer]:
      - generic [ref=e18]: 菜单
    - button "本页内容" [ref=e20] [cursor=pointer]: 本页内容
  - complementary [ref=e22]:
    - navigation "Sidebar Navigation" [ref=e23]:
      - generic [ref=e24]: Sidebar Navigation
      - link "组件总览" [ref=e31]:
        - /url: /components/overview.html
        - paragraph [ref=e32]: 组件总览
      - button "设计基础 · 3 toggle section" [ref=e35] [cursor=pointer]:
        - heading "设计基础 · 3" [level=2] [ref=e37]
        - button "toggle section" [ref=e38]
      - button "通用构建 · 5 toggle section" [ref=e42] [cursor=pointer]:
        - heading "通用构建 · 5" [level=2] [ref=e44]
        - button "toggle section" [ref=e45]
      - button "导航与流程 · 5 toggle section" [ref=e49] [cursor=pointer]:
        - heading "导航与流程 · 5" [level=2] [ref=e51]
        - button "toggle section" [ref=e52]
      - button "表单与选择 · 13 toggle section" [ref=e56] [cursor=pointer]:
        - heading "表单与选择 · 13" [level=2] [ref=e58]
        - button "toggle section" [ref=e59]
      - button "数据与状态 · 11 toggle section" [ref=e63] [cursor=pointer]:
        - heading "数据与状态 · 11" [level=2] [ref=e65]
        - button "toggle section" [ref=e66]
      - button "浮层与反馈 · 6 toggle section" [ref=e70] [cursor=pointer]:
        - heading "浮层与反馈 · 6" [level=2] [ref=e72]
        - button "toggle section" [ref=e73]
      - button "高级交互与工作区 · 2 toggle section" [ref=e77] [cursor=pointer]:
        - heading "高级交互与工作区 · 2" [level=2] [ref=e79]
        - button "toggle section" [ref=e80]
      - generic [ref=e83]:
        - button "智能产品能力 · 3 toggle section" [ref=e84] [cursor=pointer]:
          - heading "智能产品能力 · 3" [level=2] [ref=e86]
          - button "toggle section" [ref=e87]
        - generic [ref=e89]:
          - link "AIChatPanel AI 智能对话" [ref=e93]:
            - /url: /components/ai.html
            - paragraph [ref=e94]: AIChatPanel AI 智能对话
          - link "AIForm AI 智能表单" [ref=e98]:
            - /url: /components/ai-form.html
            - paragraph [ref=e99]: AIForm AI 智能表单
          - link "AIAgentWorkbench AI Agent 工作台" [ref=e103]:
            - /url: /components/ai-agent-workbench.html
            - paragraph [ref=e104]: AIAgentWorkbench AI Agent 工作台
  - generic [ref=e109]:
    - navigation "组件定位" [ref=e110]:
      - generic [ref=e111]: 智能产品能力
      - generic [ref=e112]: 任务组 · 对话与协作
      - generic [ref=e113]: "@aheart-ui/ai"
      - generic [ref=e114]:
        - generic [ref=e115]: 相关组件
        - link "AIChatPanel" [ref=e116]:
          - /url: /components/ai
        - link "AIForm" [ref=e117]:
          - /url: /components/ai-form
    - main [ref=e118]:
      - generic [ref=e121]:
        - region "D8 V2 stream" [ref=e122]:
          - generic [ref=e123]:
            - button "发送" [ref=e124] [cursor=pointer]
            - button "乱序" [ref=e125] [cursor=pointer]
            - button "重复" [ref=e126] [cursor=pointer]
            - button "恢复" [ref=e127] [cursor=pointer]
            - button "完成" [ref=e128] [cursor=pointer]
            - button "切换会话" [ref=e129] [cursor=pointer]
          - status [ref=e130]: idle
          - paragraph
          - status [ref=e131]: "0"
        - region "D8 工作台" [ref=e132]:
          - region "AI 工作台" [ref=e133]:
            - generic [ref=e134]:
              - generic [ref=e135]:
                - generic [ref=e136]: 智能工作区
                - heading "D8 工作台" [level=2] [ref=e137]
              - generic [ref=e138]:
                - generic [ref=e139]: 等待人工审批
                - generic [ref=e140]: 0 / 3 已完成
                - button "待审批：D8 产物" [ref=e141] [cursor=pointer]
            - generic [ref=e142]:
              - generic [ref=e143]:
                - tablist [ref=e145]:
                  - tab "会话" [ref=e146] [cursor=pointer]:
                    - generic [ref=e147]: 会话
                  - tab "对话" [selected] [ref=e148] [cursor=pointer]:
                    - generic [ref=e149]: 对话
                  - tab "执行 1 项待审批" [ref=e150] [cursor=pointer]:
                    - generic [ref=e152]:
                      - generic [ref=e153]: 执行
                      - generic "1 项待审批" [ref=e154]: "1"
                - tabpanel "对话" [ref=e155]
              - region "AI 对话" [ref=e159]:
                - generic [ref=e160]:
                  - generic [ref=e161]:
                    - text: AI
                    - generic [ref=e162]:
                      - heading "你好，我能为你做些什么？" [level=2] [ref=e163]
                      - paragraph [ref=e164]: 描述目标、补充上下文，或从建议任务开始。
                    - list "建议任务"
                  - generic [ref=e166]:
                    - textbox "消息内容" [ref=e167]:
                      - /placeholder: 输入消息
                    - button "发送消息" [disabled] [ref=e168]: 发送
                - status [ref=e169]
          - generic [ref=e170]:
            - status [ref=e171]: idle
            - status
            - status
            - button "未知" [ref=e172] [cursor=pointer]
            - button "未应用" [ref=e173] [cursor=pointer]
            - button "成功" [ref=e174] [cursor=pointer]
            - button "更新版本" [ref=e175] [cursor=pointer]
        - generic [ref=e176]:
          - generic [ref=e177]:
            - generic [ref=e178]:
              - generic [ref=e179]:
                - generic [ref=e180]: 数量 *
                - generic [ref=e181]:
                  - spinbutton "数量" [ref=e182]: "5"
                  - generic [ref=e183]:
                    - button "Increase" [ref=e184] [cursor=pointer]: ↑
                    - button "Decrease" [ref=e185] [cursor=pointer]: ↓
              - generic [ref=e186]:
                - generic [ref=e187]: 邮箱 *
                - textbox "邮箱" [ref=e189]
              - generic [ref=e190]:
                - generic [ref=e191]: 确认值
                - textbox "确认值" [ref=e193]
              - generic [ref=e194]:
                - generic [ref=e195]: 异步值
                - textbox "异步值" [ref=e197]
            - button "提 交" [ref=e199] [cursor=pointer]:
              - generic [ref=e200]: 提 交
          - button "服务端错误" [ref=e201] [cursor=pointer]
          - button "重置" [ref=e202] [cursor=pointer]
        - article [ref=e204]:
          - generic [ref=e205]: AI 助手
          - paragraph
          - region "工具调用摘要" [ref=e206]:
            - strong [ref=e207]: search
            - text: 查找资料安全输入完成
        - iframe [ref=e208]:
          - generic [ref=f1e3]:
            - link "跳至正文" [ref=f1e4]:
              - /url: "#VPContent"
            - banner:
              - generic:
                - generic:
                  - generic:
                    - link "Aheart UI" [ref=f1e6]:
                      - /url: /
                      - generic [ref=f1e7]: Aheart UI
                    - button "mobile navigation" [ref=f1e9] [cursor=pointer]
            - generic [ref=f1e15]:
              - button "菜单" [ref=f1e16] [cursor=pointer]:
                - generic [ref=f1e18]: 菜单
              - button "本页内容" [ref=f1e20] [cursor=pointer]: 本页内容
            - complementary [ref=f1e22]:
              - navigation "Sidebar Navigation" [ref=f1e23]:
                - generic [ref=f1e24]: Sidebar Navigation
                - link "组件总览" [ref=f1e31]:
                  - /url: /components/overview.html
                  - paragraph [ref=f1e32]: 组件总览
                - button "设计基础 · 3 toggle section" [ref=f1e35] [cursor=pointer]:
                  - heading "设计基础 · 3" [level=2] [ref=f1e37]
                  - button "toggle section" [ref=f1e38]
                - button "通用构建 · 5 toggle section" [ref=f1e42] [cursor=pointer]:
                  - heading "通用构建 · 5" [level=2] [ref=f1e44]
                  - button "toggle section" [ref=f1e45]
                - button "导航与流程 · 5 toggle section" [ref=f1e49] [cursor=pointer]:
                  - heading "导航与流程 · 5" [level=2] [ref=f1e51]
                  - button "toggle section" [ref=f1e52]
                - button "表单与选择 · 13 toggle section" [ref=f1e56] [cursor=pointer]:
                  - heading "表单与选择 · 13" [level=2] [ref=f1e58]
                  - button "toggle section" [ref=f1e59]
                - button "数据与状态 · 11 toggle section" [ref=f1e63] [cursor=pointer]:
                  - heading "数据与状态 · 11" [level=2] [ref=f1e65]
                  - button "toggle section" [ref=f1e66]
                - button "浮层与反馈 · 6 toggle section" [ref=f1e70] [cursor=pointer]:
                  - heading "浮层与反馈 · 6" [level=2] [ref=f1e72]
                  - button "toggle section" [ref=f1e73]
                - button "高级交互与工作区 · 2 toggle section" [ref=f1e77] [cursor=pointer]:
                  - heading "高级交互与工作区 · 2" [level=2] [ref=f1e79]
                  - button "toggle section" [ref=f1e80]
                - generic [ref=f1e83]:
                  - button "智能产品能力 · 3 toggle section" [ref=f1e84] [cursor=pointer]:
                    - heading "智能产品能力 · 3" [level=2] [ref=f1e86]
                    - button "toggle section" [ref=f1e87]
                  - generic [ref=f1e89]:
                    - link "AIChatPanel AI 智能对话" [ref=f1e93]:
                      - /url: /components/ai.html
                      - paragraph [ref=f1e94]: AIChatPanel AI 智能对话
                    - link "AIForm AI 智能表单" [ref=f1e98]:
                      - /url: /components/ai-form.html
                      - paragraph [ref=f1e99]: AIForm AI 智能表单
                    - link "AIAgentWorkbench AI Agent 工作台" [ref=f1e103]:
                      - /url: /components/ai-agent-workbench.html
                      - paragraph [ref=f1e104]: AIAgentWorkbench AI Agent 工作台
            - generic [ref=f1e109]:
              - navigation "组件定位" [ref=f1e110]:
                - generic [ref=f1e111]: 智能产品能力
                - generic [ref=f1e112]: 任务组 · 对话与协作
                - generic [ref=f1e113]: "@aheart-ui/ai"
                - generic [ref=f1e114]:
                  - generic [ref=f1e115]: 相关组件
                  - link "AIChatPanel" [ref=f1e116]:
                    - /url: /components/ai
                  - link "AIForm" [ref=f1e117]:
                    - /url: /components/ai-form
              - main [ref=f1e118]:
                - generic [ref=f1e121]:
                  - region "AI 工作台" [ref=f1e122]:
                    - generic [ref=f1e123]:
                      - generic [ref=f1e124]:
                        - generic [ref=f1e125]: 智能工作区
                        - heading "D8 iframe" [level=2] [ref=f1e126]
                      - generic [ref=f1e127]:
                        - generic [ref=f1e128]: 等待人工审批
                        - generic [ref=f1e129]: 0 / 3 已完成
                        - button "1 项待审批" [ref=f1e130] [cursor=pointer]
                    - generic [ref=f1e131]:
                      - generic [ref=f1e132]:
                        - tablist [ref=f1e134]:
                          - tab "会话" [ref=f1e135] [cursor=pointer]:
                            - generic [ref=f1e136]: 会话
                          - tab "对话" [selected] [ref=f1e137] [cursor=pointer]:
                            - generic [ref=f1e138]: 对话
                          - tab "执行 1 项待审批" [ref=f1e139] [cursor=pointer]:
                            - generic [ref=f1e141]:
                              - generic [ref=f1e142]: 执行
                              - generic "1 项待审批" [ref=f1e143]: "1"
                        - tabpanel "对话" [ref=f1e144]
                      - region "AI 对话" [ref=f1e148]:
                        - generic [ref=f1e149]:
                          - generic [ref=f1e150]:
                            - text: AI
                            - generic [ref=f1e151]:
                              - heading "你好，我能为你做些什么？" [level=2] [ref=f1e152]
                              - paragraph [ref=f1e153]: 描述目标、补充上下文，或从建议任务开始。
                            - list "建议任务"
                          - generic [ref=f1e155]:
                            - textbox "消息内容" [ref=f1e156]:
                              - /placeholder: 输入消息
                            - button "发送消息" [disabled] [ref=f1e157]: 发送
                        - status [ref=f1e158]
                  - generic [ref=f1e159]: iframe ready
                  - button "卸载" [ref=f1e160] [cursor=pointer]
                  - status [ref=f1e161]: "0"
              - contentinfo [ref=f1e162]:
                - paragraph [ref=f1e165]:
                  - text: "最后更新:"
                  - time [ref=f1e166]: 8/12/26, 6:46 PM
                - navigation "Pager" [ref=f1e167]:
                  - generic [ref=f1e168]: Pager
                  - link "上一页 AIForm AI 智能表单" [ref=f1e170]:
                    - /url: /components/ai-form.html
                    - generic [ref=f1e171]: 上一页
                    - generic [ref=f1e172]: AIForm AI 智能表单
    - contentinfo [ref=e209]:
      - paragraph [ref=e212]:
        - text: "最后更新:"
        - time [ref=e213]: 8/12/26, 6:46 PM
      - navigation "Pager" [ref=e214]:
        - generic [ref=e215]: Pager
        - link "上一页 AIForm AI 智能表单" [ref=e217]:
          - /url: /components/ai-form.html
          - generic [ref=e218]: 上一页
          - generic [ref=e219]: AIForm AI 智能表单
```

# Test source

```ts
  1   | import { expect, test, type Page } from '@playwright/test'
  2   |
  3   | /**
  4   |  * D8 browser contract fixture.
  5   |  *
  6   |  * The fixture contract exposes only scenario controls and observable state via
  7   |  * data-testid. Behaviour assertions use the real component DOM (roles,
  8   |  * labels, and public classes/data-action hooks), so a marker cannot make a
  9   |  * browser gate green without the component actually rendering the behaviour.
  10  |  * This suite has no conditional skips: every browser project must exercise the
  11  |  * same stream, workbench, form, tool-summary, and owner-document paths.
  12  |  */
  13  | const fixtureUrl = '/components/ai-agent-workbench?fixture=d8'
  14  |
  15  | async function openFixture(page: Page) {
  16  |   const runtimeErrors: string[] = []
  17  |   page.on('pageerror', (error) => runtimeErrors.push(error.message))
  18  |   page.on('console', (message) => {
  19  |     if (message.type() === 'error') runtimeErrors.push(message.text())
  20  |   })
  21  |   await page.goto(fixtureUrl)
  22  |   const fixture = page.getByTestId('d8-ai-fixture')
  23  |   await expect(fixture).toBeVisible()
  24  |   return { fixture, runtimeErrors }
  25  | }
  26  |
  27  | test.describe('D8 AI browser contract', () => {
  28  |   test('V2 stream applies reorder, deduplication, reconnect, final checkpoint, and conversation abort', async ({ page }) => {
  29  |     await page.setViewportSize({ width: 390, height: 844 })
  30  |     const { fixture, runtimeErrors } = await openFixture(page)
  31  |     const stream = fixture.getByTestId('d8-v2-stream')
  32  |     const chat = stream.locator('.aheart-ai-chat-panel')
> 33  |     await expect(chat).toHaveCount(1)
      |                        ^ Error: expect(locator).toHaveCount(expected) failed
  34  |     const composer = chat.locator('textarea[aria-label="消息内容"]')
  35  |     const send = chat.locator('form.aheart-ai-sender button[type="submit"]')
  36  |
  37  |     await composer.fill('真实 V2 请求')
  38  |     await send.click()
  39  |     await expect(stream.getByTestId('d8-stream-status')).toHaveText('streaming')
  40  |     await expect(chat.locator('.aheart-ai-bubble').first()).toBeVisible()
  41  |     await stream.getByTestId('d8-v2-dispatch-out-of-order').click()
  42  |     await expect(chat.locator('.aheart-ai-bubble__content').last()).toHaveText('先到的片段后到的片段')
  43  |     await stream.getByTestId('d8-v2-dispatch-duplicate').click()
  44  |     await expect(chat.locator('.aheart-ai-bubble__content').last()).toHaveText('先到的片段后到的片段')
  45  |
  46  |     await stream.getByTestId('d8-v2-trigger-reconnect').click()
  47  |     await expect(stream.getByTestId('d8-stream-status')).toHaveText('reconnecting')
  48  |     await expect(stream.getByTestId('d8-resume-call-count')).toHaveText('1')
  49  |     await stream.getByTestId('d8-v2-resume').click()
  50  |     await expect(stream.getByTestId('d8-stream-status')).toHaveText('completed')
  51  |     await expect(chat.locator('.aheart-ai-bubble__content').last()).toContainText('服务端最终版本')
  52  |
  53  |     await composer.fill('第二次真实请求')
  54  |     await send.click()
  55  |     const conversations = chat.locator('.aheart-ai-conversations')
  56  |     await expect(conversations).toBeVisible()
  57  |     await conversations.getByRole('button').nth(1).click()
  58  |     await expect(conversations.getByRole('button').nth(1)).toHaveAttribute('aria-current', 'page')
  59  |     await expect(chat.locator('.aheart-ai-bubble__content')).not.toContainText('late-event')
  60  |     await expect(stream.getByTestId('d8-update-log')).not.toContainText('late-event')
  61  |     expect(runtimeErrors).toEqual([])
  62  |   })
  63  |
  64  |   test('Workbench keeps one responsive owner and locks transactional operations with retry idempotency', async ({ page }) => {
  65  |     await page.setViewportSize({ width: 1280, height: 900 })
  66  |     const { fixture, runtimeErrors } = await openFixture(page)
  67  |     const workbench = fixture.getByTestId('d8-workbench')
  68  |
  69  |     const desktop = workbench.locator('.aheart-ai-workbench__desktop')
  70  |     const mobile = workbench.locator('.aheart-ai-workbench__mobile')
  71  |     await expect(desktop).toBeVisible()
  72  |     await expect(desktop.locator('.aheart-ai-workbench__sidebar')).toBeVisible()
  73  |     await expect(desktop.locator('.aheart-ai-workbench__chat')).toBeVisible()
  74  |     await expect(desktop.locator('.aheart-ai-workbench__execution')).toBeVisible()
  75  |     await expect(mobile).toBeHidden()
  76  |     await expect(fixture.locator('.aheart-ai-chat-panel')).toHaveCount(1)
  77  |     await expect(fixture.locator('.aheart-ai-workbench__execution-content')).toHaveCount(1)
  78  |     const draft = fixture.locator('.aheart-ai-chat-panel textarea[aria-label="消息内容"]')
  79  |     await draft.fill('跨布局 draft')
  80  |
  81  |     await page.setViewportSize({ width: 390, height: 844 })
  82  |     await expect(mobile).toBeVisible()
  83  |     await expect(desktop).toBeHidden()
  84  |     await expect(fixture.locator('.aheart-ai-chat-panel')).toHaveCount(1)
  85  |     await expect(fixture.locator('.aheart-ai-workbench__execution-content')).toHaveCount(1)
  86  |     await expect(draft).toHaveValue('跨布局 draft')
  87  |     await mobile.getByRole('tab', { name: '执行' }).click()
  88  |     await mobile.locator('[data-action="open-execution-drawer"]').click()
  89  |     const drawer = page.getByRole('dialog', { name: '执行与产物' })
  90  |     await expect(drawer).toBeVisible()
  91  |     await expect(page.locator('.aheart-drawer.is-entered')).toHaveCount(1)
  92  |     await expect(fixture.locator('.aheart-ai-chat-panel')).toHaveCount(1)
  93  |     await expect(fixture.locator('.aheart-ai-workbench__execution-content')).toHaveCount(1)
  94  |
  95  |     const approve = drawer.locator('[data-action="approve"]:visible').first()
  96  |     await approve.click()
  97  |     await expect(workbench.getByTestId('d8-operation-state')).toHaveText('pending')
  98  |     await expect(drawer.locator('[data-action="reject"]:visible').first()).toBeDisabled()
  99  |     await workbench.getByTestId('d8-operation-settle-unknown').evaluate((element) => (element as HTMLButtonElement).click())
  100 |     await expect(workbench.getByTestId('d8-operation-state')).toHaveText('error:unknown')
  101 |     await expect(drawer.locator('[data-action="retry"]:visible').first()).toBeEnabled()
  102 |
  103 |     const firstKey = await workbench.getByTestId('d8-operation-idempotency').getAttribute('data-key')
  104 |     await drawer.locator('[data-action="retry"]:visible').first().click()
  105 |     await expect(workbench.getByTestId('d8-operation-state')).toHaveText('pending')
  106 |     await expect(workbench.getByTestId('d8-operation-idempotency')).toHaveAttribute('data-key', firstKey ?? '')
  107 |     await workbench.getByTestId('d8-operation-settle-not-applied').evaluate((element) => (element as HTMLButtonElement).click())
  108 |     await expect(workbench.getByTestId('d8-operation-state')).toHaveText('error:not-applied')
  109 |     await expect(drawer.locator('[data-action="retry"]:visible').first()).toBeEnabled()
  110 |     await drawer.locator('[data-action="retry"]:visible').first().click()
  111 |     await workbench.getByTestId('d8-operation-settle-success').evaluate((element) => (element as HTMLButtonElement).click())
  112 |     await expect(workbench.getByTestId('d8-operation-state')).toHaveText('success')
  113 |     await expect(drawer.locator('[data-action="approve"]:visible').first()).toBeDisabled()
  114 |     expect(runtimeErrors).toEqual([])
  115 |   })
  116 |
  117 |   test('Workbench enforces dependency order, locked tasks, and stale revision rejection', async ({ page }) => {
  118 |     await page.setViewportSize({ width: 390, height: 844 })
  119 |     const { fixture, runtimeErrors } = await openFixture(page)
  120 |     const workbench = fixture.getByTestId('d8-workbench')
  121 |
  122 |     const mobile = workbench.locator('.aheart-ai-workbench__mobile')
  123 |     await mobile.getByRole('tab', { name: '执行' }).click()
  124 |     await mobile.locator('[data-action="open-execution-drawer"]').click()
  125 |     const drawer = page.getByRole('dialog', { name: '执行与产物' })
  126 |     await expect(drawer).toBeVisible()
  127 |     await expect(page.locator('.aheart-drawer.is-entered')).toHaveCount(1)
  128 |     const drawerTaskList = drawer.locator('.aheart-ai-workbench__execution-content')
  129 |
  130 |     await expect(drawerTaskList.locator('[data-task-id]')).toHaveCount(3)
  131 |     const prepare = drawerTaskList.locator('[data-task-id="prepare"]')
  132 |     await expect(prepare.locator('[data-action="move-down"]')).toBeEnabled()
  133 |     await prepare.locator('[data-action="move-down"]').click()
```