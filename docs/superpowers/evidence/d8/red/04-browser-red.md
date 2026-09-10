# D8 浏览器验收 RED

日期：2026-09-10

## 范围

新增的 `e2e/d8-ai.spec.ts` 是 D8 的独立五浏览器验收入口，没有条件 `skip`、`only`、`force` 或超时放宽。`data-testid` 只用于 fixture 场景控制、事务状态/幂等键和可观测 harness 状态；行为断言使用真实组件 DOM、公开角色/名称、表单 label、`.aheart-ai-chat-panel`、`.aheart-ai-workbench__execution-content`、`[data-task-id] [data-action]` 和 AIBubble/Agent task 节点。测试覆盖：

- V2 乱序、重复、重连、final checkpoint、会话切换与 abort；
- Workbench 桌面/移动端单一 ChatPanel/Execution owner、Drawer、pending、unknown、not-applied、success、重试和幂等键；
- 依赖顺序、锁定任务和 stale revision 拒绝；
- AIForm range、format、compare、async、reset 和 server error；
- 工具摘要白名单、隐藏 reasoning/raw payload；
- iframe ownerDocument、Drawer cleanup、窄屏和 200% zoom；所有测试都捕获 `pageerror` 与 console error。

## 真实 RED 复验

执行命令（独占端口，所有测试先以 390×844 视口启动；当前共享工作树已提供 D8 fixture）：

```text
AHEART_E2E_PORT=5330 corepack pnpm exec playwright test e2e/d8-ai.spec.ts --project=desktop --reporter=line --output=/tmp/aheart-d8-browser-red-final2
```

前一轮 pointer-session 版本的真实 RED（`1 failed, 4 passed`）保留在 `/tmp/aheart-d8-browser-red-final2`：旧实现没有产生生产映射“任务版本已变化，排序已拒绝”的 `task-move-reject` 状态。

本轮按修复要求改为真实 native mouse drag：从 `prepare` 所属 sortable `<li>` 中心按下并移动到真实 sortable list，按下期间通过 revision harness 更新，释放后等待 Workbench 的中文 `task-move-reject` 映射。复验命令：

```text
AHEART_E2E_PORT=5331 corepack pnpm exec playwright test e2e/d8-ai.spec.ts --project=desktop --reporter=line --output=/tmp/aheart-d8-browser-red-mouse
```

复验结果：**5 passed, 0 failed**（Chromium desktop，退出码 0）。该结果证明当前共享工作树的真实 native drag/revision/rejection 路径已通过；原始 RED 证据仍保留，未被改写为绿色。

失败日志、截图、视频和 trace 保留在 `/tmp/aheart-d8-browser-red-final2`；native mouse 复验输出保留在 `/tmp/aheart-d8-browser-red-mouse`。此前 fixture 尚未就绪时的 `5 failed, 0 passed` 运行保留在 `/tmp/aheart-d8-browser-red-real`。

## 约束检查

- Workbench owner、移动 Tab/Drawer、审批/重试/锁定与任务排序均通过真实组件节点交互；外部 controls 只注入/settle 可复现事务状态和 revision harness。
- 本轮只新增 `e2e/d8-ai.spec.ts`、注册 D8 五浏览器矩阵，以及本证据文件。
- 未修改 docs 页面、生产代码或既有 E2E。
- `git diff --check` 应在提交前通过；fixture 未就绪前不得宣称 D8 浏览器门禁通过。

## P2 浏览器复写 RED（2026-09-10）

本轮移除了 `openFixture` 的全局 viewport 设置，并把 viewport 归属到各测试：Workbench 先以 `1280×900` 验证真实桌面三栏、移动布局隐藏、draft 连续性，再独立切到 `390×844` 验证同一 ChatPanel/Execution owner；stream、task、AIForm、tool/iframe 测试各自显式设置 `390×844`。stream 断言已改为真实 `.aheart-ai-chat-panel`、textarea、submit、AIBubble、conversation DOM，并要求 transport queue/reconnect/resume/update-log fixture 合约；没有通过本地 status 或恒定 late 计数伪造状态。

桌面 RED 命令：

```text
AHEART_E2E_PORT=5334 corepack pnpm exec playwright test e2e/d8-ai.spec.ts --project=desktop --reporter=line --output=/tmp/aheart-d8-p2-desktop-red
```

结果：首次运行时 stream 已找到真实 `.aheart-ai-chat-panel` 并完成交互，但最终 `runtimeErrors` 断言捕获两条 `Hydration completed but contains mismatches.`；随后 desktop 5 项复验为 **0 passed, 5 failed**，五项均完成主要交互后在相同 console-error 门禁失败。stream 独立 artifact 保留在 `/tmp/aheart-d8-p2-stream-final`，desktop 复验 artifact 保留在 `/tmp/aheart-d8-p2-desktop-final2`。

完整五项目 stdout 和 artifacts 使用新路径保存：

- stdout：[02-five-browser-final.log](../browser/02-five-browser-final.log)
- output：`docs/superpowers/evidence/d8/browser/final-run/`
- 结果：**0 passed, 25 failed, 0 skipped**，耗时约 **31s**；五个 project 的五项测试均因真实 hydration console error 门禁失败。原始 stdout 已写入 `02-five-browser-final.log`，全新 artifacts 在 `final-run/`；未重跑掩盖，也未修改 docs/production/lock。

随后 docs hydration 修复后，使用全新端口 `5340` 和全新 `final-run/` 完成最终绿色复验：**25 passed / 0 failed / 0 skipped**，耗时 **30.3s**；五个 project 各 5/5，所有 `runtimeErrors` 均为空。hydration RED 历史明确保留在 `final-run-red-p2/` 和此前的 `final-run-previous/`。

设计 P2 浏览器门禁追加后，使用全新端口 `5343` 再次完成最终复验：**25 passed / 0 failed / 0 skipped**，耗时 **29.0s**。新增 reconnect 可见 live 文案唯一性/消失、工具摘要“输入/结果/安全输入/完成”可见性和敏感字段排除断言均通过；所有 `runtimeErrors` 为空。该轮 artifacts 在 `docs/superpowers/evidence/d8/browser/final-run/`，前一轮绿色结果保留在 `final-run-green-history/`。

ChatPanel 状态 helper 与 status-only toolCall 生产增量后，未修改 E2E，仅用全新端口 `5345` 重跑：**25 passed / 0 failed / 0 skipped**，耗时 **26.9s**；五个 project 各 5/5，所有 `runtimeErrors` 为空。最终 artifacts 在 `final-run/`，5343 结果保留在 `final-run-5343-history/`。

AI `es/lib` 改为 esbuild minified 生成物后，仍未修改 E2E，仅用全新端口 `5347` 重跑并确认 docs 实际消费 minified ESM：**25 passed / 0 failed / 0 skipped**，耗时 **32.3s**；五个 project 各 5/5，所有 `runtimeErrors` 为空。最终 artifacts 在 `final-run/`，5345 结果保留在 `final-run-5345-history/`。

普通 docs Markdown wrapper 移除并将 iframe fixture/drawer 选择器收窄后，独立全五项目使用全新端口 `5354` 复验：**25 passed / 0 failed / 0 skipped**，耗时 **29.0s**；普通 `agent-workbench` 内容与 iframe fixture 共存，未发生 duplicate-owner 误报，所有 `runtimeErrors` 为空。最终 artifacts 在 `final-run/`，5347 结果保留在 `final-run-5347-history/`；5352/5353 RED 历史按此前记录保留。
