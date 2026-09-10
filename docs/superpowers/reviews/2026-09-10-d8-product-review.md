# D8 AI 独立产品经理验收

验收日期：2026-09-10（Asia/Shanghai）
验收分支：`codex/d8-ai`
当前候选标识：`bcdaef5`（完整提交为 `bcdaef57283d0410aeaa3cc010effd091e587dc0`）。本报告更新后会 amend，因此该 SHA 仅用于绑定本轮审查证据，**不是最终 PR head SHA**。
验收对象：D8 八项 AI 优化及其 SSR、iframe、真实消费者、体积、正常文档、跨里程碑兼容和跨浏览器交付边界。
验收依据：D8 架构合同、交付计划、独立开发经理报告、minified 候选设计复拍报告、独立测试经理报告及本轮完整回归记录。

## 最终结论

**产品验收通过，P0/P1/P2 = 0/0/0，放行 PR 冻结。**

本次验收只采用 `bcdaef5` 跨里程碑修复后的候选证据，不沿用旧候选结论。功能、视觉、正常文档、真实消费者、SSR/hydration、生成物、完整回归和发布包门禁均已覆盖；开发经理、设计审核与独立测试经理最终均为 0/0/0。

## 八项 D8 产品任务

| 产品要求 | 当前证据 | 判定 |
| --- | --- | --- |
| V2 version/request/sequence/revision | AI 单测 **200/200**、typecheck 通过；packed ESM/CJS reducer 轨迹与源码一致 | 通过 |
| 乱序、去重、重连、服务端 final | 新端口 5360 五浏览器 **25/25**，真实 ChatPanel 覆盖乱序、重复、reconnect、final、会话切换；runtime errors 为空 | 通过 |
| abort、会话切换、卸载与迟到隔离 | 五浏览器 iframe ownerDocument/cleanup 和会话场景通过；packed consumer Chat lifecycle 通过 | 通过 |
| approve/cancel/retry 状态与幂等 | 五浏览器、Q5 定向和 consumer 覆盖 pending/success/error、retry、幂等与父层权威结果 | 通过 |
| 桌面/移动单一 owner | 桌面→移动断点场景通过；设计 IAB minified 复拍确认单 owner、移动单层边框和状态连续 | 通过 |
| reorder/dependency/lockedReason 与 D7 拒绝桥 | 五浏览器覆盖依赖、锁定、旧 revision；开发经理核验 `moveReject` 仅发拒绝事件，不产生成功更新 | 通过 |
| AIForm range/format/compare/async/reset/validate/core Form | AI 单测、D8/Q5 浏览器、packed consumer、SSR 覆盖规则、异步、重置、公开 Form API | 通过 |
| 安全工具摘要、输入/结果状态、无 hidden reasoning | minified IAB 复拍和五浏览器验证标签、换行、live status 及 raw/secret/reasoning 排除 | 通过 |

## 跨里程碑产品意图复核

- **AIForm 文案**：旧 E2E 的“请完成1个必填项”已迁移为“请解决1个校验问题”，覆盖范围、跨字段、异步和服务端错误的统一错误语义；没有删除字段验证、焦点或错误摘要断言。该迁移符合 D8 将错误呈现为可行动的校验问题，而不是虚构单一必填错误的产品意图。
- **审批与 task status**：审批 priority 仍显示“已批准”；任务状态迁移为“已完成”，仅在 `approveTask` 同时将 `approval.status=approved` 与 `task.status=complete` 时成立。测试和 Q5/视觉断言不再用审批状态冒充任务完成；`waiting-approval` 未批准时仍保持等待态。
- **normal docs**：正常文档 legacy 回归 **54 passed / 2 existing project skips**；Workbench 页面恢复真正 Markdown H1、product context、Ready route `/components/ai-agent-workbench` 和其他页面加载/无 runtime error。D8 fixture 仍按客户端 query 挂载，不再包住整篇 Markdown 破坏文档结构。
- **移动单层边框**：移动 ChatPanel CSS 已改为针对 Teleport 后代节点的限定选择器 `.aheart-ai-workbench__mobile-panel .aheart-ai-chat-panel`，src/es/lib 一致；IAB 与 QG4 复拍确认无重复卡片边框、无横向溢出，且没有扩大公共组件全局样式影响。
- **waiting-approval 锁定**：等待审批任务的“上移”在桌面基线中改为 disabled，任务保持原索引；批准按钮仍表达 approval 结果，task status 只在权威任务数据更新后变为 complete。该行为与 D8 的 reorder/dependency/lockedReason 契约一致。

## 独立证据分层

### 代码、自动化与回归

- 架构审核：P0/P1/P2=`0/0/0`。
- 开发经理最终复审：P0/P1/P2=`0/0/0`，包含 minify、生成物、跨里程碑修复及公共导出。
- 设计审核：minified ESM 新 IAB tab 复拍移动重连、工具摘要、normal Workbench 与移动单层边框；console error/warning 为空，P0/P1/P2=`0/0/0`。
- 独立测试经理最终复审：P0/P1/P2=`0/0/0`。
- AI：**200/200** + typecheck。
- normal docs：**54 passed / 2 existing project skips**。
- D8 五浏览器：**25/25 passed**，无新增 skip。
- Q5 定向：**7 passed / 1 existing project skip**。
- QG4 定向：**8 passed / 2 existing project skips**；仅两份 desktop Workbench baseline 按审核结果变化，mobile baseline 未变化。
- 全 scripts：**89/89**；release pack：`aheart-ui` **995 files**、`@aheart-ui/dnd` **79 files**、`@aheart-ui/ai` **115 files**。
- 完整 E2E：**648 passed / 127 existing skips / 0 failed**；既有 skip 总数未扩大。
- `check:generated`、`git diff --check`、lockfile 无漂移均通过。

### 消费者、SSR 与包交付

此前独立测试的 fresh 无 workspace symlink tgz consumer 已通过 public types、ESM/CJS、CSS、Vue peer、plugin、reducer、SSR deterministic output、hydration、Chat lifecycle、Workbench operations/reorder、AIForm 和 primitive-only bundle isolation。AI tarball SHA `f23a7504a328c5f5cd7c8addcdaee241cbe3a3c1c9057954be33d750bbc35f27` 绑定的是 minified consumer 候选；跨里程碑修复后的本轮生成门禁、release pack 和完整回归已重新通过。临时 SHA 不被当作最终 PR head 或最终发布包身份。

### 体积与 minified 调试可用性

同一 Vite 5.0.12 production 工具链、相同入口和 consumer `minify:false` 下，gzip 增量为 **9,476 bytes ≤ 12,288 bytes**。esbuild minify 未改变源码 API、依赖、preserveModules、导出布局、显式组件名、异常类型/消息、协议诊断或业务安全错误语义；source、tarball ESM、tarball CJS reducer 轨迹一致，冲突仍报告协议错误。内部变量名和 CJS 栈行可读性会降低，但此前未声明 sourcemap、内部函数名或逐字栈文本为发布契约，因此不构成产品 P2；公开调试与错误语义仍可用。

### PR、合并与部署边界

产品验收批准冻结当前候选并进入 PR 流程，但 `bcdaef5` 会因本报告更新 amend，不能直接作为最终 PR head。后续必须以 amend 后实际 head SHA 执行 Ready PR、exact-head PR CI、squash merge、master CI、Pages 和线上 AI 验证；本报告不把这些尚未执行的门禁宣称为完成。若合并后任一门禁失败，必须回到修复和独立审核循环。

### 远端旧 head verify 与 snapshot 复验

远端旧 head 的两组 verify 结果为 **646 passed / 127 existing skips / 2 visual failures**；两项失败均为 Linux desktop Workbench snapshot 各 **55 px** 的像素差异，五浏览器功能门禁全绿，没有代码错误、阈值放宽或新增 skip。已下载并逐张审查实际旧/新图片，确认差异对应 waiting-approval 任务的“上移”被正确置为 disabled，符合已批准的锁定产品契约；其他布局、审批、task status、移动单层边框和交互语义未出现产品回归。

仅更新了对应的两份 Linux desktop baseline；开发经理与独立测试经理复审确认未修改生产代码、测试阈值或 skip。该 snapshot 修复属于基线校准，不改变功能验收结论。产品验收继续保持 **0/0/0**，批准以报告更新后的实际 amend head 启动新的 exact-head CI；旧 head 的两项 snapshot 失败不被冒充为新 head 通过。

## 范围边界

本验收不启动 D4 延期的 Tree/TreeSelect/Cascader 虚拟化、D0-D3 最终复核、D9 发布/物理设备/npm 门禁，也不启动 aheart-ui v2。

最终产品决定：**D8 产品验收 0/0/0，通过并放行 PR 冻结；`bcdaef5` 仅为本轮审查绑定候选标识，最终 PR head 必须使用报告更新后的 amend SHA。**
