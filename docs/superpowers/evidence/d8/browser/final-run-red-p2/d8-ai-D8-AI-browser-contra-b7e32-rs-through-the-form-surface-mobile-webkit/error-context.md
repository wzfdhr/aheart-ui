# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: d8-ai.spec.ts >> D8 AI browser contract >> AIForm validates range, format, compare, async, reset, and server errors through the form surface
- Location: e2e/d8-ai.spec.ts:160:7

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
            - button "乱序" [ref=e124] [cursor=pointer]
            - button "重复" [ref=e125] [cursor=pointer]
            - button "恢复" [ref=e126] [cursor=pointer]
            - button "完成" [ref=e127] [cursor=pointer]
          - region "AI 对话" [ref=e128]:
            - navigation "会话列表" [ref=e129]:
              - button "会话一" [ref=e130] [cursor=pointer]
              - button "会话二" [ref=e131] [cursor=pointer]
            - generic [ref=e132]:
              - generic [ref=e133]:
                - text: AI
                - generic [ref=e134]:
                  - heading "你好，我能为你做些什么？" [level=2] [ref=e135]
                  - paragraph [ref=e136]: 描述目标、补充上下文，或从建议任务开始。
                - list "建议任务"
              - generic [ref=e138]:
                - textbox "消息内容" [ref=e139]:
                  - /placeholder: 输入消息
                - button "发送消息" [disabled] [ref=e140]: 发送
            - status [ref=e141]
          - status [ref=e142]: idle
          - status [ref=e143]: "0"
          - status
        - region "D8 工作台" [ref=e144]:
          - region "AI 工作台" [ref=e145]:
            - generic [ref=e146]:
              - generic [ref=e147]:
                - generic [ref=e148]: 智能工作区
                - heading "D8 工作台" [level=2] [ref=e149]
              - generic [ref=e150]:
                - generic [ref=e151]: 等待人工审批
                - generic [ref=e152]: 0 / 3 已完成
                - button "待审批：D8 产物" [ref=e153] [cursor=pointer]
            - generic [ref=e154]:
              - generic [ref=e155]:
                - tablist [ref=e157]:
                  - tab "会话" [ref=e158] [cursor=pointer]:
                    - generic [ref=e159]: 会话
                  - tab "对话" [selected] [ref=e160] [cursor=pointer]:
                    - generic [ref=e161]: 对话
                  - tab "执行 1 项待审批" [ref=e162] [cursor=pointer]:
                    - generic [ref=e164]:
                      - generic [ref=e165]: 执行
                      - generic "1 项待审批" [ref=e166]: "1"
                - tabpanel "对话" [ref=e167]
              - region "AI 对话" [ref=e171]:
                - generic [ref=e172]:
                  - generic [ref=e173]:
                    - text: AI
                    - generic [ref=e174]:
                      - heading "你好，我能为你做些什么？" [level=2] [ref=e175]
                      - paragraph [ref=e176]: 描述目标、补充上下文，或从建议任务开始。
                    - list "建议任务"
                  - generic [ref=e178]:
                    - textbox "消息内容" [ref=e179]:
                      - /placeholder: 输入消息
                    - button "发送消息" [disabled] [ref=e180]: 发送
                - status [ref=e181]
          - generic [ref=e182]:
            - status [ref=e183]: idle
            - status
            - status
            - button "未知" [ref=e184] [cursor=pointer]
            - button "未应用" [ref=e185] [cursor=pointer]
            - button "成功" [ref=e186] [cursor=pointer]
            - button "更新版本" [ref=e187] [cursor=pointer]
        - generic [ref=e188]:
          - generic [ref=e189]:
            - generic [ref=e190]:
              - generic [ref=e191]:
                - generic [ref=e192]: 数量 *
                - generic [ref=e193]:
                  - spinbutton "数量" [ref=e194]: "5"
                  - generic [ref=e195]:
                    - button "Increase" [ref=e196] [cursor=pointer]: ↑
                    - button "Decrease" [ref=e197] [cursor=pointer]: ↓
              - generic [ref=e198]:
                - generic [ref=e199]: 邮箱 *
                - textbox "邮箱" [ref=e201]
              - generic [ref=e202]:
                - generic [ref=e203]: 确认值
                - textbox "确认值" [ref=e205]
              - generic [ref=e206]:
                - generic [ref=e207]: 异步值
                - textbox "异步值" [ref=e209]
            - button "提 交" [ref=e211] [cursor=pointer]:
              - generic [ref=e212]: 提 交
          - button "服务端错误" [ref=e213] [cursor=pointer]
          - button "重置" [ref=e214] [cursor=pointer]
        - article [ref=e216]:
          - generic [ref=e217]: AI 助手
          - paragraph
          - region "工具调用摘要" [ref=e218]:
            - strong [ref=e219]: search
            - text: 查找资料安全输入完成
        - iframe [ref=e220]:
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
    - contentinfo [ref=e221]:
      - paragraph [ref=e224]:
        - text: "最后更新:"
        - time [ref=e225]: 8/12/26, 6:46 PM
      - navigation "Pager" [ref=e226]:
        - generic [ref=e227]: Pager
        - link "上一页 AIForm AI 智能表单" [ref=e229]:
          - /url: /components/ai-form.html
          - generic [ref=e230]: 上一页
          - generic [ref=e231]: AIForm AI 智能表单
```

# Test source

```ts
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
  163 |     const form = fixture.getByTestId('d8-ai-form')
  164 |     const nativeForm = form.locator('form')
  165 |
  166 |     await nativeForm.locator('button[type="submit"]').click()
  167 |     await expect(form.locator('.aheart-ai-form__error-summary[role="alert"]')).toContainText('校验问题')
  168 |     await form.getByLabel('数量').fill('101')
  169 |     await form.getByLabel('邮箱').fill('not-an-email')
  170 |     await form.getByLabel('确认值').fill('different')
  171 |     await nativeForm.locator('button[type="submit"]').click()
  172 |     await expect(form.locator('[data-field-key="number"] .aheart-ai-form__field-error[role="alert"]')).toContainText('范围')
  173 |     await expect(form.locator('[data-field-key="email"] .aheart-ai-form__field-error[role="alert"]')).toContainText('邮箱')
  174 |     await expect(form.locator('[data-field-key="confirm"] .aheart-ai-form__field-error[role="alert"]')).toContainText('一致')
  175 |
  176 |     await form.getByLabel('数量').fill('10')
  177 |     await form.getByLabel('邮箱').fill('user@example.com')
  178 |     await form.getByLabel('确认值').fill('user@example.com')
  179 |     await form.getByLabel('异步值').fill('already-taken')
  180 |     await nativeForm.locator('button[type="submit"]').click()
  181 |     await expect(form.locator('[data-field-key="asyncValue"] .aheart-ai-form__field-error[role="alert"]')).toContainText('已存在')
  182 |     await form.getByTestId('d8-form-server-error').click()
  183 |     await expect(form.locator('.aheart-ai-form__error-summary[role="alert"]')).toContainText('服务端')
  184 |     await form.getByTestId('d8-form-reset').click()
  185 |     await expect(form.getByLabel('数量')).toHaveValue('5')
  186 |     await expect(form.locator('.aheart-ai-form__error-summary[role="alert"]')).toHaveCount(0)
> 187 |     expect(runtimeErrors).toEqual([])
      |                           ^ Error: expect(received).toEqual(expected) // deep equality
  188 |   })
  189 |
  190 |   test('tool summary is whitelist-only and iframe owner-document cleanup survives narrow 200% layout', async ({ page }) => {
  191 |     await page.setViewportSize({ width: 390, height: 844 })
  192 |     const { fixture, runtimeErrors } = await openFixture(page)
  193 |     const tool = fixture.locator('.aheart-ai-bubble .aheart-ai-bubble__tool-call, .aheart-ai-workbench__tool-call').first()
  194 |     await expect(tool).toContainText('查找资料')
  195 |     await expect(tool).toContainText('完成')
  196 |     await expect(tool).not.toContainText('reasoning')
  197 |     await expect(tool).not.toContainText('chain-of-thought')
  198 |     await expect(tool).not.toContainText('raw-arguments')
  199 |     await expect(tool).not.toContainText('secret-payload')
  200 |
  201 |     const iframe = fixture.locator('iframe[data-testid="d8-owner-document-iframe"]')
  202 |     await expect(iframe).toBeVisible()
  203 |     const frame = page.frameLocator('iframe[data-testid="d8-owner-document-iframe"]')
  204 |     await expect(frame.getByTestId('d8-iframe-chat')).toBeVisible()
  205 |     await frame.locator('.aheart-ai-workbench__mobile').getByRole('tab', { name: '执行' }).click()
  206 |     await frame.locator('.aheart-ai-workbench__mobile [data-action="open-execution-drawer"]').click()
  207 |     await expect(frame.getByRole('dialog', { name: '执行与产物' })).toBeVisible()
  208 |     await expect(frame.locator('.aheart-drawer.is-entered')).toHaveCount(1)
  209 |     await frame.locator('.aheart-drawer__close').click()
  210 |     await expect(frame.locator('.aheart-drawer.is-entered')).toHaveCount(0)
  211 |     await expect(frame.locator('.aheart-drawer.is-hidden, .aheart-drawer[aria-hidden="true"]')).toHaveCount(1)
  212 |     await expect(frame.locator('body')).not.toHaveCSS('overflow', 'hidden')
  213 |     await frame.getByTestId('d8-iframe-unmount').click()
  214 |     await expect(frame.getByTestId('d8-iframe-cleanup-count')).toHaveText('1')
  215 |
  216 |     await page.evaluate(() => {
  217 |       document.documentElement.style.zoom = '200%'
  218 |     })
  219 |     await expect(fixture).toHaveAttribute('data-overflow-x', 'false')
  220 |     expect(runtimeErrors).toEqual([])
  221 |   })
  222 | })
  223 |
```