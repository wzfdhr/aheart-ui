# D8 独立开发经理审查

审查日期：2026-09-10（Asia/Shanghai）
最新结论：P0/P1/P2 = **0/0/0**。浏览器、设计、AI 构建最小化、包级 Vue peer 发布契约、跨里程碑兼容及 Linux 视觉基线增量均已完成下述复审，放行继续当前候选的 CI 复验；不代表失败的旧 CI 或剩余发布门禁已经通过。

## 候选与审查范围

- 仓库：`/Users/start/.codex/worktrees/091b/aheart-ui`。
- 分支：`codex/d8-ai`。
- 架构基线：`ff243fffc2a3c8e7d7d1b169e77d7c3914cf0f1e`。跨里程碑复审时 HEAD 为 `00285e80c61dc2371a9a0991b6b7750c60e0d0ff`；本次 Linux 基线增量复审时 HEAD 为 `793b27c173517a13f393151cf5db955cc9a58f1a`。HEAD 是各次未提交增量的载体，不是包含本次全部变化的最终候选 SHA。
- 本报告审查的最终候选是第七轮源码收敛后，包含 D7 拒绝事件桥、真实浏览器 fixture、hydration/设计修复及 AI 构建最小化的**当前未提交工作树**，不是上述基线提交本身；候选尚无独立提交 SHA，不以基线 SHA 冒充候选身份。
- 依据：`docs/superpowers/specs/2026-09-09-d8-ai-architecture.md`。
- 职责：独立只读源码审查、定向验证与反例复测。审查期间未实施修复；本报告是审查者唯一创建、更新的文件，未回退其他工作者的改动。

最新候选范围指纹（SHA-256）：`93399fa14914346c37457105684b4cef9818d1e0176b8ca7158f34d164136a32`，共 **160 个文件**。本次在158文件范围新增两份 Linux desktop 尺寸 Workbench snapshot；对应前一轮158文件指纹为 `638c0a29441ade48547c06d53db7c7b85478b28d4c68ca7982b7c9efdac357ba`。范围包含 `e2e/a11y-visual.spec.ts`、`e2e/q5-ai-product-suite.spec.ts` 及两种OS×两种project的四份desktop尺寸Workbench snapshot。发布契约阶段154文件指纹为 `12332a191960c406a6c3ccb62f8302401803fc5c782afec470448bdcee287a01`；构建最小化阶段152文件指纹为 `a7ad7e0dc1c36de8caee0b1bd00f78df249cfff6260990f1252925cc3cb392ed`；设计修复通过候选的旧151文件指纹为 `30b1d0072b82cc977573df4dd8c9042538bb7c3bcfb01c903c23818f1a2328ec`。其余范围仍为 `packages/ai/src/`、`packages/ai/es/`、`packages/ai/lib/`、`packages/ai/package.json`、AI Vite 配置、两个发布契约脚本、三份 AI 文档、`e2e/d8-ai.spec.ts`、`playwright.config.ts`、`pnpm-lock.yaml` 及 D8 架构合同。取该范围中 Git 跟踪和未忽略的未跟踪文件，按仓库相对路径排序；每行是文件内容 SHA-256、两个空格、相对路径，以 LF 结尾，再对整份清单求 SHA-256。报告自身与持续增长的证据目录不计入指纹，避免自引用。此指纹用于识别审查范围，不冒充 Git 提交 SHA。

审查覆盖 V2 reducer 的序号、版本、重放、检查点、恢复及终态；ChatPanel 的父层权威、请求身份、epoch、abort、ownerDocument；Workbench 的组件单实例、移动入口、事务幂等与生命周期、排序依赖与实例隔离；AIForm 的 core Form 适配、异步取消、隐藏值、重置与 schema；工具摘要默认显示边界以及公开类型、SSR 和 Vue peer 声明。

## 七轮收敛记录

以下数字是各轮独立审查当时的未解决发现，不是累计发现数。后续轮次包含复查原反例、组合边界与新发现；不能用单测数量增长代替缺陷关闭。

| 轮次 | P0/P1/P2 | 收敛摘要 | 当轮决定 |
| --- | --- | --- | --- |
| 第一轮 | 0/6/14 | 发现 V2 消息未发布、目标消息身份覆盖、恢复出口不完整、移动端仅有占位、事务锁及幂等缺口，以及 reducer、排序、AIForm 和 lockfile 问题。工作树仍在变动；独立定向测试为 38 通过、8 失败。 | 不放行 |
| 第二轮 | 0/6/8 | 定向测试 78/78，但独立反例仍复现 buffer revision 被重写、final 被缓冲事件复活、EOF 留在 streaming、错误业务动作重试、reset 显示与提交不一致等问题。 | 不放行 |
| 第三轮 | 0/3/4 | 完整 AI 170/170；仍发现旧 revision 污染、恢复非终态出口、reset 后旧异步仍提交，以及普通任务重试、旧 epoch、比较类型和隐藏默认值问题。 | 不放行 |
| 第四轮 | 0/1/4 | 完整 AI 185/185；较大预算的无 resume throw、旧 V1 epoch、隐藏默认值问题仍在，并发现 prototype rule kind 异常及区间 format 组合矛盾。 | 不放行 |
| 第五轮 | 0/0/4 | 完整 AI 191/191；此前 P1 反例通过。剩余旧 epoch、删除候选确认、继承 validator 注册项及嵌套 checkpoint 身份检查问题。 | 不放行 |
| 第六轮 | 0/0/1 | 完整 AI 195/195；原始反例通过，但父层以等值副本接受删除候选时仍回填默认值。 | 不放行 |
| 第七轮 | 0/0/0 | 完整 AI 196/196；原对象与等值副本接受、拒绝后的无关更新均通过，历史反例抽样及源码回查未发现回退。 | 放行浏览器阶段 |

## 第七轮独立验证

### 自动检查

- `corepack pnpm --filter @aheart-ui/ai test -- --reporter dot`：10 个测试文件、**196/196 通过**。
- 第七轮测试输出未出现 Vue warning、未处理异常或未处理 Promise rejection。输出中的 Vite CJS Node API 弃用提示不属于 Vue warning。
- `corepack pnpm --filter @aheart-ui/ai typecheck`：独立执行通过，退出码 0。
- `git diff --check`：独立执行通过。
- `git diff --numstat -- pnpm-lock.yaml`：无输出，lockfile 无 diff。

这些检查验证 AI 包及本轮 diff，不代表完整工作区 release chain、实际打包消费者或跨浏览器验收已经完成。

### 独立反例与源码回查

反例使用内存 TypeScript/SFC 编译及挂载执行，没有为审查修改源码或新增测试文件。最后一轮确认：

- **删除候选接受与拒绝**：父层接受原候选对象或 `{ ...candidate }` 等值副本后，立即提交均不再包含已删除字段；拒绝候选后重新显示、再修改无关字段，仍保留 `DEFAULT`。
- **旧 revision 缓冲**：`snapshot(seq1, rev2, A)`、缓冲 `delta(seq3, rev1, OLD)`、`delta(seq2, rev2, B)` 后输出 `AB`，不再输出 `ABOLD`。
- **终态不可复活**：先缓冲后续 delta，再接收 final，结果保持 `completed` 和权威 `DONE` 内容。
- **恢复失败**：无 resume、`maxReconnectAttempts: 3`、delta 后 throw，消息进入 error，`retryable: true`，不再停在 streaming/reconnecting。
- **epoch 屏障**：旧 V1 请求悬挂，切换会话并完成新请求后再拒绝旧请求，`update:messages` 数量保持 4→4。
- **reset 与异步提交**：pending submit 后 reset，再完成旧异步校验，没有旧 submit 事件。
- **事务行为回查**：unknown/遗漏 outcome 保持原业务动作和逻辑幂等键；新会话或 handler 生命周期清理身份；无 approval 错误任务允许再次 retry；pending/success 冲突锁和 task/approval/artifact 失效条件仍在。
- **布局与排序回查**：真实单实例 Teleport 路径仍在；移动 Drawer 转桌面时关闭并释放生命周期；排序共享 validator、依赖与锁定索引检查、实例 scope 和合法 `move-task` 兼容事件未回退。
- **schema 与注册表回查**：prototype rule kind 安全拒绝；异步 validator 要求自有函数属性；混合 date/time canonical 比较拒绝；不支持的 range-format 组合在 schema 阶段拒绝。
- **检查点与公共接口回查**：嵌套 message 不再绕过外层身份检查；公开 `targetMessageId`、Workbench 的 `AITransport | AITransportV2`、工具摘要路径及 AI 包 Vue peer `>=3.5.0 <4` 保持。

## 浏览器增量与最终独立复审

第七轮之后，浏览器工作新增 D7 `moveReject` 映射、fixture 样式、文档场景和 E2E。增量审查曾给出 **0/0/3**：lockfile overrides 再次漂移、V2 浏览器场景仅断言手工 marker、全部 project 被强制移动尺寸。最终复审逐项关闭如下。

| 原 P2 | 最终源码与证据 | 结果 |
| --- | --- | --- |
| lockfile 无关漂移 | `git diff --numstat -- pnpm-lock.yaml` 无输出；根覆盖配置未被本候选移除。 | 关闭 |
| V2 场景未驱动生产 ChatPanel | 文档通过真实 `AIChatPanel` 的 `AITransportV2.send/resume` queue 投递乱序与重复事件，通过 queue throw 触发生产恢复；E2E 使用真实 composer、bubble、conversation 按钮并断言 resume 调用次数、final 内容及更新日志无 late-event。 | 关闭 |
| 缺少真实 desktop 与跨断点连续性 | `openFixture` 不再统一覆盖 viewport；Workbench 测试从 1280×900 的真实桌面三栏进入 390×844，断言桌面/移动显隐、ChatPanel/Execution 单实例和 draft 持续，再操作真实 Drawer 与事务按钮。 | 关闭 |

### 当前命令与产物结果

- 本审查者再次执行 `corepack pnpm --filter @aheart-ui/ai test -- --reporter dot`：**197/197，10 个测试文件**，未观察到 Vue warning 或 unhandled error。
- 本审查者再次执行 `corepack pnpm --filter @aheart-ui/ai typecheck`：通过，退出码 0。
- 本审查者执行 `git diff --check`：通过；lockfile diff 检查无输出。
- 本审查者核验已执行的五浏览器原始证据，没有把旧目录的失败记录当作最终成功：`docs/superpowers/evidence/d8/browser/02-five-browser-final.log` 末行是 **25 passed (30.3s)**；`browser/final-run/.last-run.json` 为 `status: passed`、`failedTests: []`。对应说明是 `browser/02-five-browser-final.md`，各 project 5/5：desktop、mobile、desktop-firefox、desktop-webkit、mobile-webkit。此前失败保留于 `final-run-red-p2/` 与 `final-run-previous/`，不是本次最终结果。
- 五浏览器最终执行使用独占端口 5340；复核的命令为 `AHEART_E2E_PORT=5340 corepack pnpm exec playwright test e2e/d8-ai.spec.ts --project=desktop --project=mobile --project=desktop-firefox --project=desktop-webkit --project=mobile-webkit --reporter=line --output=docs/superpowers/evidence/d8/browser/final-run`。本报告对该次运行做源码及原始日志/状态核验，未声称本审查者重新运行了 Playwright。
- 最终浏览器 25 项均执行 `runtimeErrors` 空断言，其收集范围为 pageerror 与 console error；不把这一断言扩大为所有 console warning 均被采集。Mobile WebKit 仍不等于物理 iOS 验收。

### 生产与生成物回查

- D7 `moveReject` → Vue `@move-reject` → AgentExecution `move-task-reject` → Workbench `task-move-reject` 事件名连接正确。当前 11 个合法 D7 reason 均有固定中文映射。独立内存执行映射函数，确认只发拒绝事件，不产生 `update:tasks` 或成功 `move-task`，不输出额外 payload。
- ESM/CJS 产物均包含 `onMoveReject` 和 Workbench 转发，声明文件包含公开事件；`targetMessageId`、V2 transport 联合类型及 Vue peer `>=3.5.0 <4` 同步存在。
- `cmp packages/ai/src/style.css packages/ai/es/style.css` 与对应 lib 比较均通过。新增 CSS 限定于 `.d8-*` fixture 选择器，未发现对公共组件全局选择器的覆盖。
- 内存加载 src reducer、实际 es reducer、实际 lib reducer，独立比较乱序/去重、旧 revision 和 final 终态三组历史轨迹，三种产物状态输出一致。另抽查 ChatPanel 恢复、等值副本删除候选与拒绝事件桥的 src/es/lib 同步。完整确定性双构建和提交后的 generated gate 仍属于后续 release 检查，未由这些抽样代替。
- 文档 hydration 修复将 query 读取移到 onMounted，首树 `d8Mode=null`、`d8ClientReady=false`，D8Fixture 在 SSR 和客户端首次渲染均返回 null；挂载后才显示场景。真实生产组件实例由 fixture 承载，恢复/abort 状态不再由独立展示 marker 伪造。
- 本次未发现超出 D8 AI、对应文档/测试及生成产物范围的生产修改；未将其他阶段、npm 发布或 v2 扩展纳入本报告。

浏览器增量阶段开发经理结论：**P0/P1/P2 = 0/0/0**。当时三项浏览器增量 P2 均已关闭，没有以单测数量或旧版浏览器报告替代关闭证据。后续设计增量的最新结论如下。

## 设计增量首次开发复审（历史拒绝记录）

本轮仅审查并更新本报告，未修改实现、测试、fixture、生成物或 lockfile。范围为 ChatPanel 的统一 streamStatus 与可见重连、AIBubble 的工具详情语义及样式、相应新增测试和设计报告。

### 当前检查结果

- 独立执行完整 AI：**198/198，10 个测试文件**，无 Vue warning、unhandled error。
- 独立 AI typecheck、`git diff --check` 均通过；lockfile 无 diff。
- 最新五浏览器原始 log 为 **25 passed (29.0s)**，`final-run/.last-run.json` 为 passed、空 failedTests。其真实 ChatPanel/Workbench 路径仍在。
- src/es/lib CSS 字节一致；ESM/CJS 均包含本轮 streamStatus、可见重连和 tool-details 模板。同步产物也包含下述待修行为，同步不等于行为正确。
- 重连期间可见状态使用单独 role=status，隐藏 announcement 返回空串；现有正常恢复截图场景下，没有重复的同文案非空 live region。工具详情使用 dl/dt/dd，未知额外字段未新增到模板；token、minmax(0,1fr)、min-inline-size:0 和 overflow-wrap 支持窄屏排布。

### 当时未关闭的三个 P2

1. **streamStatus 转换不一致，活动请求可上报 idle。** `packages/ai/src/chat-panel.vue:189` 无条件发布状态；276 发布初始 streaming，314 又直接转发 reducer 的初始 idle 或重复 streaming。独立内存挂载实测：V1 正常请求事件为 `[streaming, completed]`；V2 正常请求为 `[streaming, streaming, completed]`；V2 首包 sequence=2、sequence=1 尚未到达时为 `[streaming, idle]`，但生成仍进行。381 又在 finally 把本地 terminal 状态改为 idle/streaming，未与已发出的 terminal 状态保持同一生命周期。需要定义统一的状态转换，不能将等待缺口的活动请求报为空闲，也不应依赖每条事件重复发布同一状态。

2. **合法的状态独立字段在工具详情中不可见。** `packages/ai/src/bubble.vue:11` 和14以 inputSummary/resultSummary 为整个 dt/dd 的条件，导致只有 inputStatus/resultStatus 时不显示。实测 `toolCall={id:'t',name:'lookup',summary:'查找资料',inputStatus:'redacted',resultStatus:'pending'}`，页面只有工具名和摘要，dt/dd 数量均为0。公开类型允许状态与摘要独立存在；等待结果时通常尚无 resultSummary。应在任一摘要或状态存在时显示对应语义项，并覆盖状态独立、摘要独立两种合法输入。

3. **新增“成功恢复后清理横幅”单测使用错误请求身份。** `packages/ai/src/__tests__/d8-chat-stream.test.ts:527` 的 send 用真实 request identity，但 resume 在539用固定 `requestIdentity`（request-1/message-1）生成 final，与组件创建的身份不符。该测试只断言横幅消失，没有断言 completed、最终内容及无协议错误，实际可经 protocol-error 清理后通过。浏览器成功恢复覆盖是真实的，但不能据此保留错误命名且验证了另一条路径的新增单测；应让 resume 回显其 request，明确断言成功终态，并将错误身份作为独立拒绝案例。

### 对设计报告的核对

已阅读 `docs/superpowers/reviews/2026-09-10-d8-design-review.md`。其可见重连和带摘要工具详情的截图结论与模板相符，且明确不代替完整行为验收；但截图范围没有覆盖上述首包乱序状态、状态独立工具字段及单测错误身份。因此设计报告的0/0/0不能替代本轮开发复审。若修复改变工具模板或公共状态文案，应按设计报告自身约定重新截图受影响状态。

该次结论：**P0/P1/P2 = 0/0/3，暂不放行独立测试**。三个问题都给出具体输入或源码路径，不能仅通过重复执行已有198/198和25/25关闭。以下为修复后的最终复验。

## 设计增量最终复验（最新结论）

本审查者再次只读检查实现、测试和生成物，并独立内存编译挂载当前组件复现三个问题，未修改实现或测试。

| 原 P2 | 独立复验结果 | 决定 |
| --- | --- | --- |
| 首包乱序上报 idle、正常 V2 重复 streaming | sequence=2 首包到达且 sequence=1 未到时，公开事件仅为 `[streaming]`；补齐后完成的同一请求为 `[streaming, completed]`，无 idle 或重复 streaming。 | 关闭 |
| status-only 工具数据不可见 | 只有 inputStatus=redacted、resultStatus=pending 时，dt 为“输入”“结果”，对应 dd 为 redacted、pending；legacy content 和未知 secret 字段不显示。 | 关闭 |
| 重连单测 final 身份错误 | resume 现在接收真实 request 并回显 requestId/messageId；独立真实恢复运行输出 `[streaming, reconnecting, completed]`、最终内容 done，无 error 或 stream-reject。横幅消失来自成功完成，而非协议错误。 | 关闭 |

补充状态与无障碍边界检查：

- 重连期间 role=status 文本列表为 `['正在恢复连接', '']`，只有一处非空同文案 live 状态；恢复完成后横幅消失。
- 旧会话请求在新会话完成后 reject，不追加 stream-status 事件；两次新请求各自可发布 streaming，这是不同 epoch 的合法开始，不按跨请求重复事件误判。
- 完成/错误/取消按公开 stream-status 事件和消息终态核验。finally 的局部视图清理不发布 idle 事件，没有观察到公开 terminal→idle/streaming 回退；新 epoch 仍能正常进入 streaming。
- helper 的相同状态去重、活动请求 idle 抑制，及 accepted delta 才更新播报内容的逻辑，在 src/es/lib 均存在。
- 工具 dl/dt/dd 条件现在对“摘要或状态存在”成立；窄屏布局 CSS 未回退，src/es/lib CSS 逐字一致。

最新独立命令结果：`corepack pnpm --filter @aheart-ui/ai test -- --reporter dot` 为 **200/200，10 files**，无 Vue warning、unhandled error；AI typecheck、`git diff --check` 通过；lockfile 无 diff。两种生成模块包含 status 去重/idle guard 与 status-only 模板。上节25/25是已核验的上一浏览器执行证据，本轮未声称重新运行五浏览器；后续独立测试应针对本节新指纹进行验证。

最新开发经理决定：**P0/P1/P2 = 0/0/0，放行独立测试**。该决定不替代设计报告要求的受影响状态复拍，也不把单测与开发审查作为产品或发布验收。

## AI 构建最小化与 gzip 最终增量复审

本次实现差异是 `packages/ai/vite.config.ts:25` 的 `minify: false` 改为 `minify: 'esbuild'`，以及对应生成 JS；未改变已审核的源码功能、外部依赖、preserveModules、包导出布局或 consumer 的压缩参数。该范围属于 D8 体积门禁收敛，不是拆包、运行时懒加载、SDK 引入或其他阶段扩展。

### 真实 tarball 与公共契约

- 独立对 `/tmp/d8-ai-pack2.2yCNbD/aheart-ui-ai-1.0.0.tgz` 计算完整 SHA-256：**`f23a7504a328c5f5cd7c8addcdaee241cbe3a3c1c9057954be33d750bbc35f27`**。文件为 **74,371 bytes，115 个包文件**；不能使用消息中漏字符的 SHA。
- 将该 tarball 解包到本审查者临时目录，112 个 es/lib 生成文件与共享候选逐字一致。
- 直接从解包后的绝对 ESM 路径和 CJS 路径导入，development、production 两种 NODE_ENV 下导出键集合一致；AIChatPanel、AIAgentWorkbench、AIForm、AIBubble 的显式 name 分别保持 AAIChatPanel、AAIAgentWorkbench、AAIForm、AAIBubble，plugin 注册通过。
- `main/module/types/exports`、独立 style.css 路径和 CSS sideEffects 声明未改变。最小化没有把内部属性名当成可改写的公开字段，也没有以运行时函数名代替组件显式名称。
- source reducer、tarball ESM reducer、tarball CJS reducer 的乱序、去重、冲突、final、terminal-no-op 轨迹一致；冲突仍返回 `conflicting sequence`，不是吞掉协议错误。
- 私有生成变量名和 CJS 栈行的可读性会降低，本报告不声称压缩后内部函数名或栈文本逐字不变。公开组件名、异常类型/消息、协议诊断和业务安全错误语义保持；此前配置本来没有启用 sourcemap，本次未关闭已有 sourcemap 能力。内部生成符号与原样栈文本不是已声明的发布契约。

### 构建、确定性与运行时

为遵守只修改本报告的边界，AI 源码、配置和 tsconfig 复制到 `/tmp/d8-dev-minify-review.msgVJM/packages/ai`，依赖复用已安装工具；在此隔离位置执行 `NODE_ENV=production .../vite build`，不覆写共享生成物。

- 隔离 AI build 通过（Vite 5.4.21）；相同目录重复构建的112个输出文件完全一致，输出清单 SHA-256 为 `262300f2798a414ae9a7d450a1e6663a3ae38b918107d6f4906edb5c5518706f`。
- 隔离输出的 JS/CSS 与共享候选逐字相同。d.ts 因隔离依赖解析而将 `import("@vue/runtime-core")` 写为其 `import("vue")` 重导出别名；正规化这一别名后声明完全等价。真实 tarball 的声明文件则与共享候选逐字相同，真实 consumer public typecheck 通过。
- 本审查者新建的无 workspace symlink consumer 使用该精确 tarball，输出 `/tmp/d8-dev-minify-review.msgVJM/consumer-prod/results.json` 为 passed；consumerRoot 为 `/private/var/folders/r6/2s10_vtx00l5g5kwbl5hkxw00000gn/T/aheart-d8-ai-oF3aX7`。验证 public types、CJS/CSS、plugin、reducer、SSR、真实 Chromium hydration、Chat lifecycle、Workbench、AIForm 与 primitive bundle。
- consumer runner 的裸 ESM import 相对脚本根解析，因此不单独依赖该字段证明 packed ESM；本审查另外执行前述解包绝对 ESM 路径探针补足此边界。
- 对 tarball ESM 另做 development、production 两种环境的 SSR→hydrate（JSDOM）：warning/error 列表均为空，chat/execution/form 各一实例；两次 SSR 输出一致。这里的 JSDOM 探针不冒充五浏览器或物理设备复验。
- fresh consumer 的 primitive AIForm bundle 中未发现 agent-workbench、SortableList 或 `@aheart-ui/dnd`，primitive isolation 通过；其 gzip 为243,999 bytes，未以整个根插件导入替代 primitive 路径。
- 独立完整 AI 为 **200/200**、typecheck通过；最终 `git diff --check` 通过，lockfile无diff。

首次独立 consumer 安装因系统 ENOSPC 中断，未记录为通过；释放可重建临时空间后重新安装并完整运行成功。中途被清理的临时依赖根造成的 module-not-found 也未归为产品失败或成功证据；以上结论使用恢复后的明确根路径。共享实现、测试及 lockfile 未由本审查者更改。

### 固定工具链的独立 gzip 复算

主比较固定 Node v24.17.0、Vue 3.5.38、**Vite 5.0.12**、`NODE_ENV=production`、`mode=production`、consumer `minify:false`、同一 `import * as AI; export default AI` 入口、同一依赖与 gzip level 9。只改变被消费的 AI 包构建，不额外缩小 consumer 的导出面或压缩设置。

| 固定生产比较 | Raw bytes | Gzip bytes |
| --- | ---: | ---: |
| D8 baseline | 1,557,320 | 299,787 |
| 本次精确 minified tarball | 1,578,894 | 309,305 |
| 增量 | 21,574 | **9,518** |

9,518 ≤ 12,288 bytes，余量 **2,770 bytes**。产物保留在本审查临时目录的 `gzip-vite5012-baseline/ai-consumer.js` 与 `gzip-vite5012-current/ai-consumer.js`，SHA-256 分别为 `a8f2fd0c69f5470dcb6468cd862757d74352d3689dfec30c5e87a9fdd4230cfb`、`0fff7f253b5a3552130d68d767643871cfd4370a020257de34995d0926d4e021`。

对历史313,422必须作环境校正：本审查用 Vite 5.4.21 可重现旧包313,422，而同一旧包在固定 Vite 5.0.12 + production 下是311,951。不能用5.0.12生成的299,787基线与5.4.21候选直接相减，继而把13,635视为同环境产品增量；也不能简单断言该差异全由 NODE_ENV 引起。即使 NODE_ENV 固定production，不同Vite仍产生差异。作为交叉核查，同为5.4.21生产构建的baseline/current为301,394/310,757，增量9,363，也通过。主门禁采用上表统一5.0.12的9,518。

因此，本次既确认新的最小化候选通过固定环境体积上限，也明确历史未统一环境的313,422差值不能沿用为精确失败证据。后续独立测试应锁定工具版本、NODE_ENV、mode、入口与 consumer minify 参数后复算，不混用这些数字。

本次增量结论：**P0/P1/P2 = 0/0/0，放行独立测试**。源码单测不替代新 tarball 的后续五浏览器/产品/发布门禁；未将此前浏览器运行认定为本次最小化 tarball 的完整矩阵复验。

## 包级 Vue peer 发布契约增量复审

本轮仅审查 `scripts/release-contract.mjs` 和对应 `.test.mjs` 的变化并更新本报告，未修改实现。架构合同第10行明确只允许 AI 包提高到 `>=3.5.0 <4`，其他包保持原范围。

- `packageContracts` 仅为 `@aheart-ui/ai` 添加 `expectedVuePeer: '>=3.5.0 <4'`；components 与 DnD 未设置覆盖，继续使用默认 `>=3.4.0 <4`，与三份 manifest 一致。
- `validatePackageContract` 从可信的仓库 contract 读取期望值，并保持 manifest Vue peer 的严格字符串相等校验；没有从待验证 manifest 接受期望值，没有关闭 Vue 校验，也没有改变 workspace 协议、依赖版本、导出、必要文件或源码排除检查。
- 正式 CLI 遍历上述固定 `packageContracts`，tarball manifest 只是验证输入。向 manifest 注入同名 `expectedVuePeer` 不会覆盖受信 contract，不构成降低 peer floor 的入口。
- 新增测试覆盖 AI 3.5接受及3.4拒绝；原无覆盖契约的3.4接受测试仍在。本审查者独立执行 `node --test scripts/release-contract.test.mjs`：**7/7通过**。
- 另独立对三个真实 contract 做15项矩阵探针：3.4、3.5、3.3、`*`、缺失 peer，且同时向 manifest 注入期望字段。components/DnD仅接受3.4，AI仅接受3.5；没有错误放宽其他包或 manifest 自行选择 floor 的绕过。
- 本审查者独立执行正式入口 `node scripts/release-contract.mjs`：**aheart-ui 995 files、DnD 79 files、AI 115 files 全部通过**，退出码0。该脚本只生成并清理自己的临时 tarballs，未改变共享实现或 lockfile；`git diff --check` 与 lockfile无diff核验通过。

本轮结论：**P0/P1/P2 = 0/0/0，放行继续候选门禁**。这是发布验证脚本与已批准包级架构的对齐，不是整体提高其他包的Vue要求，也不替代真实最低Vue版本consumer或后续CI/发布验证。

## 全仓 E2E 后跨里程碑兼容增量复审

本轮仅更新本报告，未修改生产、fixture、测试断言、snapshot、发布脚本或 lockfile。

源码与契约核对：

- Workbench 文档移除包住整篇 Markdown 的 raw div；本审查独立构建的 HTML 已包含真正的 `<h1 id="ai-agent-工作台-已完成">AI Agent 工作台`。D8Fixture 继续按 query 在客户端挂载，正常文档本身恢复 Markdown 页面结构。
- 正常文档 tasks 补 revision=r1，artifacts 补 revision=a1，与公共数据模型一致；它们用于示例身份完整性，没有放宽生产的锁定逻辑或令 waiting-approval 可排序。
- D8 iframe 中新增 `frameFixture` 限定实际操作目标，避免正常文档与测试场景同时存在时选择错 Workbench；Drawer 仍在 iframe 内选择实际 visible 实例，并在关闭后检查 body 滚动锁释放，未绕过真实交互。
- 移动 CSS 从 `.aheart-ai-workbench__mobile-panel > .aheart-ai-chat-panel` 改为后代选择器，准确覆盖单 owner Teleport 目标容器增加的嵌套层。该规则仍限制在移动 Workbench 内，仅清除内层聊天的重复边框/圆角。src/es/lib CSS 比较完全一致。
- 旧 AIForm E2E 从“请完成1个必填项”迁移为“请解决1个校验问题”，符合 D8 对范围、跨字段、异步与服务端错误的统一语义；没有删除焦点或字段验证断言。
- 审批 priority 仍断言“已批准”，任务状态改断言“已完成”，与正常示例 approveTask 同时更新 approval.status=approved、task.status=complete 一致，没有再用审批状态冒充任务完成。

视觉基线复核：本审查分别从 HEAD 提取旧图，并逐张打开两组旧/新图片。只修改 `ai-agent-workbench-desktop-1440x900-desktop-darwin.png` 和 `ai-agent-workbench-desktop-1440x900-mobile-darwin.png`；文件名末尾是执行 project，二者均为 desktop 尺寸场景，mobile尺寸基线无diff。两组均确认 waiting-approval任务的“上移”从可用变disabled，符合D8锁定契约；布局、主要文案、审批与产物结构未出现截断。mobile-project的desktop图另外可见批准按钮蓝色深浅变化，因此本报告不声称像素仅一处变化；本次没有改动公共Button颜色代码。截图比较阈值和项目skip条件没有被本次改动放宽。

独立执行：

```text
AHEART_E2E_PORT=5371 corepack pnpm exec playwright test \
  e2e/q5-ai-product-suite.spec.ts e2e/a11y-visual.spec.ts \
  --project=desktop --project=mobile \
  --grep 'AIForm groups fields|AI Workbench exposes the execution|desktop component surface screenshots|mobile component surface screenshots' \
  --reporter=line --output=/tmp/d8-dev-snapshot-review.UdkjCA/targeted
```

结果：**7 passed / 1 skipped（31.4s），0 failed**；独占5371端口，真实完成docs构建与渲染，没有使用update-snapshots。唯一skip为既有的mobile Drawer场景在desktop project不执行，不是新增跳过。两类desktop/mobile截图在两个project均完成当前基线比较。

另独立执行发布契约定向 **7/7** 和正式 `node scripts/release-contract.mjs`：**995/79/115 files**通过。最初发现最终浏览器日志的一行reporter尾随空格，已由主线程清理；本审查随后再次确认 `git diff --check`通过、lockfile无diff，未自行改日志。

主线程完整775项E2E执行记录为 **648 passed / 127既有skip / 0 failed**。本审查未重跑整套775项，而是独立核验 `/tmp/d8-final-full-e2e-green/.last-run.json` 为passed、failedTests为空，并执行上面的受影响场景复验。主线程原targeted结果目录 `/tmp/d8-cross-milestone-final/.last-run.json` 也为passed。上述结果不把skip算作通过；本次断言/fixture/snapshot差异中没有新增skip、only、fixme或超时放宽。

本次增量结论：**P0/P1/P2 = 0/0/0，放行继续最终候选门禁**。此处更新包含CSS与文档，早期tarball SHA仅证明其当时包内容，不能冒充这一新指纹候选的最终发布包身份。

## Linux CI 视觉基线增量复审

本轮审查开始时工作树仅有两份 Linux PNG 变化，代码、测试、阈值、发布脚本、生成CSS和lockfile均无diff；本审查者只更新本报告，未替换图片。

核验本地下载的 CI `e2e-evidence` artifact，根路径 `/tmp/d8-ci-fail-push`：

- 两份 `error-context.md` 对应 `desktop component surface screenshots match baselines`，project分别是desktop和mobile，均明确记录 **55 pixels** 的视觉差异。此计数是Playwright报告的差异像素，不用于声称所有原始PNG字节只差55处。
- 本审查逐张打开两个project的expected与actual四张图片。实际图中的waiting-approval任务“上移”为disabled，与D8锁定契约及已审Darwin行为一致；没有发现通过截图替换掩盖正文缺失、错误提示、双实例、布局截断、审批或产物内容丢失。其他可见渲染差异属于该Linux场景中的细小字形/抗锯齿表现，不修改跨平台字体假设。
- `cmp`确认artifact的两份expected分别与HEAD中的旧Linux基线逐字相同；两份新基线分别与该CI实际产生的actual逐字相同，未使用Darwin截图冒充Linux截图。
- 该test-results目录仅有上述两份失败context。主线程CI运行记录为646其余通过、127既有skip、2个上述视觉失败；本报告不把这一失败运行改记为通过。
- snapshot目录对HEAD的diff仅包含以下两份Linux基线；Darwin两份已在前一轮审查，本轮不变，mobile尺寸基线也未变。`git diff --check`通过。

| Desktop尺寸截图的OS/project范围 | 本轮状态 | 当前文件SHA-256 |
| --- | --- | --- |
| desktop-darwin | 前轮已审，本轮不变 | `916717846a5f7e6a4e5f8f6151cd278e90811adf4932629dda3ab7cc2803ae47` |
| mobile-darwin | 前轮已审，本轮不变 | `b4590f2d5be749cca2cabcf4847a5fea85176b97b465d9e837734728c8f95d7d` |
| desktop-linux | 本轮CI actual一致 | `45bfaeadedf97abb19eff2ef3566f6ac732dd8c090d57870d8f7418e09efe6bf` |
| mobile-linux | 本轮CI actual一致 | `dd54eaacd916360824215fe81913ef5d971fa82ab7315a6b5413c84406c10761` |

四份文件均位于 `e2e/a11y-visual.spec.ts-snapshots/`，统一前缀为 `ai-agent-workbench-desktop-1440x900-`、后缀为上表OS/project标识加 `.png`。这里是两种OS与两种执行project的四份desktop尺寸截图，不是四种设备平台，也不代表更新了mobile尺寸期望。

本次视觉基线增量审查：**P0/P1/P2 = 0/0/0，放行提交后精确head的CI复验**。这是经实际图像审查确认的契约变化同步，未通过放宽阈值或跳过测试消除失败；更新后的Linux CI尚须重新运行，不能沿用先前失败运行的状态。

## 放行边界

第七轮0/0/0仅放行browser，随后浏览器增量0/0/0放行设计审查；设计增量首次0/0/3曾暂停后续门禁，最终修复复验现为 **0/0/0，放行独立测试**。无论哪个阶段放行，都**不是 D8 产品完成或发布批准**。

本报告不替代以下独立门禁：

- 截图优先的设计审查和真实桌面/移动浏览器交互验证；
- 实际 packed consumer、ESM/CJS、CSS、SSR/hydration、Vue peer floor、体积及 primitive import 隔离验证；
- 独立测试经理和产品经理验收；
- 完整工作区构建、生成产物、文档及 release/E2E 检查；
- 精确候选提交的 PR 与 CI、merge 后 master CI、Pages 部署和线上交互验证。

后续实现若改变本报告涉及的行为，应对变化后的候选补充验证；不能将这份未提交工作树审查结论直接作为后续不同提交的验收证据。
