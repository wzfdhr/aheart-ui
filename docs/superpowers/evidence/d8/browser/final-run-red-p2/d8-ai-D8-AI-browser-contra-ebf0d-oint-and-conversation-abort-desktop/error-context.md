# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: d8-ai.spec.ts >> D8 AI browser contract >> V2 stream applies reorder, deduplication, reconnect, final checkpoint, and conversation abort
- Location: e2e/d8-ai.spec.ts:28:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 4

- Array []
+ Array [
+   "Hydration completed but contains mismatches.",
+   "Hydration completed but contains mismatches.",
+ ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "跳至正文" [ref=e4] [cursor=pointer]:
    - /url: "#VPContent"
  - banner:
    - generic:
      - generic:
        - generic:
          - link "Aheart UI" [ref=e6] [cursor=pointer]:
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
      - link "组件总览" [ref=e31] [cursor=pointer]:
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
          - link "AIChatPanel AI 智能对话" [ref=e93] [cursor=pointer]:
            - /url: /components/ai.html
            - paragraph [ref=e94]: AIChatPanel AI 智能对话
          - link "AIForm AI 智能表单" [ref=e98] [cursor=pointer]:
            - /url: /components/ai-form.html
            - paragraph [ref=e99]: AIForm AI 智能表单
          - link "AIAgentWorkbench AI Agent 工作台" [ref=e103] [cursor=pointer]:
            - /url: /components/ai-agent-workbench.html
            - paragraph [ref=e104]: AIAgentWorkbench AI Agent 工作台
  - generic [ref=e109]:
    - navigation "组件定位" [ref=e110]:
      - generic [ref=e111]: 智能产品能力
      - generic [ref=e112]: 任务组 · 对话与协作
      - generic [ref=e113]: "@aheart-ui/ai"
      - generic [ref=e114]:
        - generic [ref=e115]: 相关组件
        - link "AIChatPanel" [ref=e116] [cursor=pointer]:
          - /url: /components/ai
        - link "AIForm" [ref=e117] [cursor=pointer]:
          - /url: /components/ai-form
    - main [ref=e118]:
      - generic [ref=e121]:
        - region "D8 V2 stream" [ref=e122]:
          - generic [ref=e123]:
            - button "乱序" [ref=e124] [cursor=pointer]
            - button "重复" [ref=e125] [cursor=pointer]
            - button "恢复" [ref=e126] [cursor=pointer]
            - button "完成" [ref=e127] [cursor=pointer]
          - region "AI 对话" [ref=e128]:
            - navigation "会话列表" [ref=e129]:
              - button "会话一" [ref=e130] [cursor=pointer]
              - button "会话二" [active] [ref=e131] [cursor=pointer]
            - generic [ref=e132]:
              - log [ref=e133]:
                - article [ref=e134]:
                  - generic [ref=e135]: 你
                  - paragraph [ref=e136]: 真实 V2 请求
                  - generic "消息操作" [ref=e137]:
                    - button "复制问题" [ref=e138] [cursor=pointer]: 复制
                    - button "编辑" [ref=e139] [cursor=pointer]
                - article [ref=e140]:
                  - generic [ref=e141]: AI 助手
                  - paragraph [ref=e142]: 先到的片段后到的片段服务端最终版本
                  - generic "消息操作" [ref=e143]:
                    - button "复制回答" [ref=e144] [cursor=pointer]: 复制
                    - button "重新生成" [ref=e145] [cursor=pointer]
                - article [ref=e146]:
                  - generic [ref=e147]: 你
                  - paragraph [ref=e148]: 第二次真实请求
                  - generic "消息操作" [ref=e149]:
                    - button "复制问题" [ref=e150] [cursor=pointer]: 复制
                    - button "编辑" [ref=e151] [cursor=pointer]
                - article [ref=e152]:
                  - generic [ref=e153]: AI 助手
                  - paragraph
                  - generic "消息操作" [ref=e154]
              - generic [ref=e156]:
                - textbox "消息内容" [ref=e157]:
                  - /placeholder: 输入消息
                - button "发送消息" [disabled] [ref=e158]: 发送
            - status [ref=e159]: 正在生成
          - status [ref=e160]: streaming
          - status [ref=e161]: "1"
          - status [ref=e162]: "|||先到的片段后到的片段|先到的片段后到的片段|先到的片段后到的片段服务端最终版本||"
        - region "D8 工作台" [ref=e163]:
          - region "AI 工作台" [ref=e164]:
            - generic [ref=e165]:
              - generic [ref=e166]:
                - generic [ref=e167]: 智能工作区
                - heading "D8 工作台" [level=2] [ref=e168]
              - generic [ref=e169]:
                - generic [ref=e170]: 等待人工审批
                - generic [ref=e171]: 0 / 3 已完成
                - button "待审批：D8 产物" [ref=e172] [cursor=pointer]
            - generic [ref=e173]:
              - generic [ref=e174]:
                - tablist [ref=e176]:
                  - tab "会话" [ref=e177] [cursor=pointer]:
                    - generic [ref=e178]: 会话
                  - tab "对话" [selected] [ref=e179] [cursor=pointer]:
                    - generic [ref=e180]: 对话
                  - tab "执行 1 项待审批" [ref=e181] [cursor=pointer]:
                    - generic [ref=e183]:
                      - generic [ref=e184]: 执行
                      - generic "1 项待审批" [ref=e185]: "1"
                - tabpanel "对话" [ref=e186]
              - region "AI 对话" [ref=e190]:
                - generic [ref=e191]:
                  - generic [ref=e192]:
                    - text: AI
                    - generic [ref=e193]:
                      - heading "你好，我能为你做些什么？" [level=2] [ref=e194]
                      - paragraph [ref=e195]: 描述目标、补充上下文，或从建议任务开始。
                    - list "建议任务"
                  - generic [ref=e197]:
                    - textbox "消息内容" [ref=e198]:
                      - /placeholder: 输入消息
                    - button "发送消息" [disabled] [ref=e199]: 发送
                - status [ref=e200]
          - generic [ref=e201]:
            - status [ref=e202]: idle
            - status
            - status
            - button "未知" [ref=e203] [cursor=pointer]
            - button "未应用" [ref=e204] [cursor=pointer]
            - button "成功" [ref=e205] [cursor=pointer]
            - button "更新版本" [ref=e206] [cursor=pointer]
        - generic [ref=e207]:
          - generic [ref=e208]:
            - generic [ref=e209]:
              - generic [ref=e210]:
                - generic [ref=e211]: 数量 *
                - generic [ref=e212]:
                  - spinbutton "数量" [ref=e213]: "5"
                  - generic [ref=e214]:
                    - button "Increase" [ref=e215] [cursor=pointer]: ↑
                    - button "Decrease" [ref=e216] [cursor=pointer]: ↓
              - generic [ref=e217]:
                - generic [ref=e218]: 邮箱 *
                - textbox "邮箱" [ref=e220]
              - generic [ref=e221]:
                - generic [ref=e222]: 确认值
                - textbox "确认值" [ref=e224]
              - generic [ref=e225]:
                - generic [ref=e226]: 异步值
                - textbox "异步值" [ref=e228]
            - button "提 交" [ref=e230] [cursor=pointer]:
              - generic [ref=e231]: 提 交
          - button "服务端错误" [ref=e232] [cursor=pointer]
          - button "重置" [ref=e233] [cursor=pointer]
        - article [ref=e235]:
          - generic [ref=e236]: AI 助手
          - paragraph
          - region "工具调用摘要" [ref=e237]:
            - strong [ref=e238]: search
            - text: 查找资料安全输入完成
        - iframe [ref=e239]:
          - generic [ref=f1e3]:
            - link "跳至正文" [ref=f1e4] [cursor=pointer]:
              - /url: "#VPContent"
            - banner:
              - generic:
                - generic:
                  - generic:
                    - link "Aheart UI" [ref=f1e6] [cursor=pointer]:
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
                - link "组件总览" [ref=f1e31] [cursor=pointer]:
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
                    - link "AIChatPanel AI 智能对话" [ref=f1e93] [cursor=pointer]:
                      - /url: /components/ai.html
                      - paragraph [ref=f1e94]: AIChatPanel AI 智能对话
                    - link "AIForm AI 智能表单" [ref=f1e98] [cursor=pointer]:
                      - /url: /components/ai-form.html
                      - paragraph [ref=f1e99]: AIForm AI 智能表单
                    - link "AIAgentWorkbench AI Agent 工作台" [ref=f1e103] [cursor=pointer]:
                      - /url: /components/ai-agent-workbench.html
                      - paragraph [ref=f1e104]: AIAgentWorkbench AI Agent 工作台
            - generic [ref=f1e109]:
              - navigation "组件定位" [ref=f1e110]:
                - generic [ref=f1e111]: 智能产品能力
                - generic [ref=f1e112]: 任务组 · 对话与协作
                - generic [ref=f1e113]: "@aheart-ui/ai"
                - generic [ref=f1e114]:
                  - generic [ref=f1e115]: 相关组件
                  - link "AIChatPanel" [ref=f1e116] [cursor=pointer]:
                    - /url: /components/ai
                  - link "AIForm" [ref=f1e117] [cursor=pointer]:
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
                  - link "上一页 AIForm AI 智能表单" [ref=f1e170] [cursor=pointer]:
                    - /url: /components/ai-form.html
                    - generic [ref=f1e171]: 上一页
                    - generic [ref=f1e172]: AIForm AI 智能表单
    - contentinfo [ref=e240]:
      - paragraph [ref=e243]:
        - text: "最后更新:"
        - time [ref=e244]: 8/12/26, 6:46 PM
      - navigation "Pager" [ref=e245]:
        - generic [ref=e246]: Pager
        - link "上一页 AIForm AI 智能表单" [ref=e248] [cursor=pointer]:
          - /url: /components/ai-form.html
          - generic [ref=e249]: 上一页
          - generic [ref=e250]: AIForm AI 智能表单
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
  33  |     await expect(chat).toHaveCount(1)
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
  59  |     const bubbleTexts = await chat.locator('.aheart-ai-bubble__content').allTextContents()
  60  |     expect(bubbleTexts.join('\n')).not.toContain('late-event')
  61  |     await expect(stream.getByTestId('d8-update-log')).not.toContainText('late-event')
> 62  |     expect(runtimeErrors).toEqual([])
      |                           ^ Error: expect(received).toEqual(expected) // deep equality
  63  |   })
  64  |
  65  |   test('Workbench keeps one responsive owner and locks transactional operations with retry idempotency', async ({ page }) => {
  66  |     await page.setViewportSize({ width: 1280, height: 900 })
  67  |     const { fixture, runtimeErrors } = await openFixture(page)
  68  |     const workbench = fixture.getByTestId('d8-workbench')
  69  |
  70  |     const desktop = workbench.locator('.aheart-ai-workbench__desktop')
  71  |     const mobile = workbench.locator('.aheart-ai-workbench__mobile')
  72  |     await expect(desktop).toBeVisible()
  73  |     await expect(desktop.locator('.aheart-ai-workbench__sidebar')).toBeVisible()
  74  |     await expect(desktop.locator('.aheart-ai-workbench__chat')).toBeVisible()
  75  |     await expect(desktop.locator('.aheart-ai-workbench__execution')).toBeVisible()
  76  |     await expect(mobile).toBeHidden()
  77  |     await expect(workbench.locator('.aheart-ai-chat-panel')).toHaveCount(1)
  78  |     await expect(workbench.locator('.aheart-ai-workbench__execution-content')).toHaveCount(1)
  79  |     const draft = workbench.locator('.aheart-ai-chat-panel textarea[aria-label="消息内容"]')
  80  |     await draft.fill('跨布局 draft')
  81  |
  82  |     await page.setViewportSize({ width: 390, height: 844 })
  83  |     await expect(mobile).toBeVisible()
  84  |     await expect(desktop).toBeHidden()
  85  |     await expect(workbench.locator('.aheart-ai-chat-panel')).toHaveCount(1)
  86  |     await expect(workbench.locator('.aheart-ai-workbench__execution-content')).toHaveCount(1)
  87  |     await expect(draft).toHaveValue('跨布局 draft')
  88  |     await mobile.getByRole('tab', { name: '执行' }).click()
  89  |     await mobile.locator('[data-action="open-execution-drawer"]').click()
  90  |     const drawer = page.getByRole('dialog', { name: '执行与产物' })
  91  |     await expect(drawer).toBeVisible()
  92  |     await expect(page.locator('.aheart-drawer.is-entered')).toHaveCount(1)
  93  |     await expect(workbench.locator('.aheart-ai-chat-panel')).toHaveCount(1)
  94  |     await expect(workbench.locator('.aheart-ai-workbench__execution-content')).toHaveCount(1)
  95  |
  96  |     const approve = drawer.locator('[data-action="approve"]:visible').first()
  97  |     await approve.click()
  98  |     await expect(workbench.getByTestId('d8-operation-state')).toHaveText('pending')
  99  |     await expect(drawer.locator('[data-action="reject"]:visible').first()).toBeDisabled()
  100 |     await workbench.getByTestId('d8-operation-settle-unknown').evaluate((element) => (element as HTMLButtonElement).click())
  101 |     await expect(workbench.getByTestId('d8-operation-state')).toHaveText('error:unknown')
  102 |     await expect(drawer.locator('[data-action="retry"]:visible').first()).toBeEnabled()
  103 |
  104 |     const firstKey = await workbench.getByTestId('d8-operation-idempotency').getAttribute('data-key')
  105 |     await drawer.locator('[data-action="retry"]:visible').first().click()
  106 |     await expect(workbench.getByTestId('d8-operation-state')).toHaveText('pending')
  107 |     await expect(workbench.getByTestId('d8-operation-idempotency')).toHaveAttribute('data-key', firstKey ?? '')
  108 |     await workbench.getByTestId('d8-operation-settle-not-applied').evaluate((element) => (element as HTMLButtonElement).click())
  109 |     await expect(workbench.getByTestId('d8-operation-state')).toHaveText('error:not-applied')
  110 |     await expect(drawer.locator('[data-action="retry"]:visible').first()).toBeEnabled()
  111 |     await drawer.locator('[data-action="retry"]:visible').first().click()
  112 |     await workbench.getByTestId('d8-operation-settle-success').evaluate((element) => (element as HTMLButtonElement).click())
  113 |     await expect(workbench.getByTestId('d8-operation-state')).toHaveText('success')
  114 |     await expect(drawer.locator('[data-action="approve"]:visible').first()).toBeDisabled()
  115 |     expect(runtimeErrors).toEqual([])
  116 |   })
  117 |
  118 |   test('Workbench enforces dependency order, locked tasks, and stale revision rejection', async ({ page }) => {
  119 |     await page.setViewportSize({ width: 390, height: 844 })
  120 |     const { fixture, runtimeErrors } = await openFixture(page)
  121 |     const workbench = fixture.getByTestId('d8-workbench')
  122 |
  123 |     const mobile = workbench.locator('.aheart-ai-workbench__mobile')
  124 |     await mobile.getByRole('tab', { name: '执行' }).click()
  125 |     await mobile.locator('[data-action="open-execution-drawer"]').click()
  126 |     const drawer = page.getByRole('dialog', { name: '执行与产物' })
  127 |     await expect(drawer).toBeVisible()
  128 |     await expect(page.locator('.aheart-drawer.is-entered')).toHaveCount(1)
  129 |     const drawerTaskList = drawer.locator('.aheart-ai-workbench__execution-content')
  130 |
  131 |     await expect(drawerTaskList.locator('[data-task-id]')).toHaveCount(3)
  132 |     const prepare = drawerTaskList.locator('[data-task-id="prepare"]')
  133 |     await expect(prepare.locator('[data-action="move-down"]')).toBeEnabled()
  134 |     await prepare.locator('[data-action="move-down"]').click()
  135 |     await expect(workbench.getByTestId('d8-task-rejection')).toHaveText('依赖任务必须排在前面')
  136 |
  137 |     const locked = drawerTaskList.locator('[data-task-id="run"]')
  138 |     await expect(locked.locator('[data-action="move-up"]')).toBeDisabled()
  139 |     await expect(locked.locator('.aheart-ai-workbench__task-lock-reason[role="status"]')).toBeVisible()
  140 |     await expect(locked.locator('.aheart-ai-workbench__task-lock-reason[role="status"]')).toContainText('任务当前不可排序')
  141 |
  142 |     const sortableItem = prepare.locator('xpath=ancestor::li[contains(@class,"aheart-dnd-sortable-item")]')
  143 |     const targetList = drawerTaskList.locator('.aheart-dnd-sortable-list').first()
  144 |     const sourceBox = await sortableItem.boundingBox()
  145 |     const targetBox = await targetList.boundingBox()
  146 |     expect(sourceBox).not.toBeNull()
  147 |     expect(targetBox).not.toBeNull()
  148 |     const sourcePoint = { x: (sourceBox?.x ?? 0) + (sourceBox?.width ?? 0) / 2, y: (sourceBox?.y ?? 0) + (sourceBox?.height ?? 0) / 2 }
  149 |     const targetPoint = { x: (targetBox?.x ?? 0) + (targetBox?.width ?? 0) / 2, y: (targetBox?.y ?? 0) + Math.min((targetBox?.height ?? 0) / 2, 48) }
  150 |     await page.mouse.move(sourcePoint.x, sourcePoint.y)
  151 |     await page.mouse.down()
  152 |     await page.mouse.move(sourcePoint.x + 32, sourcePoint.y + 32, { steps: 4 })
  153 |     await workbench.getByTestId('d8-task-update-revision').evaluate((element) => (element as HTMLButtonElement).click())
  154 |     await page.mouse.move(targetPoint.x, targetPoint.y, { steps: 8 })
  155 |     await page.mouse.up()
  156 |     await expect(workbench.getByTestId('d8-task-rejection')).toHaveText('任务版本已变化，排序已拒绝')
  157 |     expect(runtimeErrors).toEqual([])
  158 |   })
  159 |
  160 |   test('AIForm validates range, format, compare, async, reset, and server errors through the form surface', async ({ page }) => {
  161 |     await page.setViewportSize({ width: 390, height: 844 })
  162 |     const { fixture, runtimeErrors } = await openFixture(page)
```