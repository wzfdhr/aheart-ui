# Aheart UI v2 整体任务流程清单

> 状态：已批准（Approved），2026-11-05 由 wzfdhr（单人项目，产品、技术、设计/文档、发布负责人均由其担任） 批准；批准不勾选任何任务。所有 checkbox 初始为未完成；勾选必须附证据链接和日期，不得用“已完成”替代验证。
>
> 产品/技术主方案：[Aheart UI 产品与技术总体方案](./2026-09-08-aheart-ui-product-and-technical-master-plan.md)  
> 技术 RFC：[Aheart UI v2 架构与产品体系优化设计](./2026-09-08-aheart-ui-v2-architecture-optimization-design.md)  
> 阶段验收标准：[Aheart UI v2 阶段验收标准](./2026-09-08-aheart-ui-v2-phase-acceptance-criteria.md)

## 使用规则

- 每个任务是一个可独立创建的 issue；任务完成后必须填写输出物与证据路径。
- 角色缩写：PM 产品经理、TM 技术经理、DEV 开发、QA 测试、DOC 设计文档、REL 发布/生态。
- “进入条件”是开工门槛；“退出条件”是阶段 Go 条件。任何一项退出条件未满足，阶段只能标记 `Blocked` 或 `Needs decision`。
- 代码、自动化、视觉、包消费、发布和用户验收分开记录；Pages 部署、CI 通过或源码完成不等于用户验收。
- 默认试点项目：`ai-review-gate`（AI/桌面）、`muxu-todo`（普通业务）、`clean consumer`（干净 Vite/Nuxt 消费者）。三个试点都必须从发布 tarball 或明确的本地包安装验证。

## 总体依赖与并行关系

```text
M0 冻结
  ├─ M1 按需基础设施 ─────> M3 Primitive + Combobox ─> M4 浮层/Dialog
  │                                  ├─> M5 Motion Preview
  │                                  └─> M6 AI/DND 产品化
  ├─ M2 Icons 供应链 ────────────────────────────────> M8 发布决策
  └─ 试点基线 ───────────────────────────────────────> M8 发布决策
M7 文档/Resolver/生态：可从 M1 开始，M3 后完成推荐示例
M8 v2 决策：等待 M1–M7 的决策数据，不以代码完成数替代
```

- 可并行：M1 与 M2；M1 的基础包工作与 M7 的信息架构；M5 的设计探索与 M4 的 API 评审；M6 的场景 PRD 与 M3/M4。
- 不可并行：同一包、同一构建入口、同一端口或同一试点项目只能有一个写入 owner。
- 依赖原则：M3 不得在 M1 的 subpath/CSS 契约未冻结前开始实现；M2 可并行且允许以 Lucide fallback 支持 M3，但默认图标切换必须在 M2 通过后进行；M4 不得在 M3 的 Presence/Primitive 契约未验收前批量迁移；M8 不得提前承诺 v2 stable。

## M0：产品与契约冻结

### 目标与用户价值

把“基础组件 + AI 产品能力 + 动效 + 图标”收敛成可验证的产品边界、采用路径、版本策略和指标，避免技术蓝图直接变成无期限大重构。

### 前置依赖与 Owner

- 前置：现有主方案、仓库当前状态、`aheart-ui@1.0.0` 消费情况可读取。
- Owner：PM（决策）；TM（技术契约）；DEV/QA/DOC/REL 为评审角色。

### 任务清单

- [ ] **M0-PM-01** 写定第一优先用户、JTBD、替代方案和产品定位；输出 PRD 章节与非目标清单。
- [ ] **M0-PM-02** 访谈/复盘三个试点负责人，记录安装、样式、API、升级和文档阻塞；输出问题台账，不能用猜测替代反馈。
- [ ] **M0-PM-03** 冻结产品指标：10 分钟首次成功、三项目试点、升级回归、包安装成功、P0/P1 数量等目标值。
- [ ] **M0-TM-01** 冻结包边界、subpath、根入口、`/full`、CSS、Icons、AI/DND、Motion 和兼容周期契约。
- [ ] **M0-TM-02** 建立版本/兼容矩阵，列出 v1.x、preview、v2 beta/RC/stable 的 breaking change 和回滚方式。
- [ ] **M0-DEV-01** 采集仓库基线：构建、测试、包体、CSS、导出、Node/pnpm 版本和 dirty worktree 记录。
- [ ] **M0-QA-01** 建立三试点基线脚本，至少能安装、启动、截图、运行关键交互和记录失败原因。
- [ ] **M0-DOC-01** 建立产品 PRD、技术 RFC、阶段验收标准、决策日志的索引与模板。
- [ ] **M0-REL-01** 核对 npm scope、许可证、发布权限、公共/私有包状态和回滚账号；不得把未授权发布标记为可用。

### 输出物、进入/退出条件

- 输出物：PRD、技术 RFC、验收标准、基线报告、风险/决策台账、试点运行记录。
- 进入：主方案可读；当前分支、依赖和已有改动已登记。
- 退出：PM/TM/QA/REL 共同签字；三个试点均有 baseline；指标和版本策略已冻结；所有 P0 风险有 owner 与处理路径。

### 降级/停止与证据

- 若无法获得真实试点反馈：降级为 discovery，不启动实现。
- 若许可证、scope 或发布权限未解决：停止 M2/M8 的发布承诺，允许做本地技术验证。
- 证据占位：`evidence/M0/decision-log.md`、`evidence/M0/baseline/`、`evidence/M0/pilot-*.md`。

## M1：v1.1 真实按需引入

### 目标与用户价值

让用户能从干净项目稳定导入单个组件，得到正确 JS、CSS、类型和主题；不因导入 Button 而解析 Table、AI 或全量插件。

### 前置依赖与 Owner

- 前置：M0 的入口、包体预算和三试点基线。
- Owner：TM；DEV 负责构建，QA 负责消费验证，REL 负责 tarball。

### 任务清单

- [ ] **M1-PM-01** 选定首批验证组件 Button、Modal、Select，并写明用户任务与不支持边界；Combobox 固定留在 M3。
- [ ] **M1-TM-01** 设计并冻结 exports、`/full`、兼容 facade、`theme.css`、组件 CSS 和 `sideEffects` 规则。
- [ ] **M1-TM-02** 定义 bundle/CSS/SSR/类型/样式冲突预算及失败阈值。
- [ ] **M1-DEV-01** 实现 Button/Modal/Select 的 subpath、ESM/CJS、类型和样式入口。
- [ ] **M1-DEV-02** 建立消费 fixture，验证根 named import、subpath、`/full` 与旧 v1 兼容入口。
- [ ] **M1-DEV-03** 实现仅覆盖 Button/Modal/Select 的 Resolver Preview；M7 再扩展为 manifest 驱动的全生态 Stable。
- [ ] **M1-QA-01** 对三试点运行安装、构建、SSR hydration、样式和关键交互；记录每个入口结果。
- [ ] **M1-QA-02** 做 bundle 分析，确认未引入无关组件；失败时保留报告而非调高预算掩盖问题。
- [ ] **M1-DOC-01** 写唯一推荐安装路径、迁移指南和故障排查；高级入口单独归档。
- [ ] **M1-REL-01** 生成干净 tarball、校验 files/exports/license，并在隔离 registry 或本地 pack 流程验证。

### 输出物、验收与降级

- 输出物：v1.1 预发布包、消费 fixture、bundle 报告、迁移文档、三试点验证报告。
- 退出：三入口可安装；JS/CSS/类型和 SSR 通过；预算达标；三个试点都完成推荐路径或兼容路径验证，`ai-review-gate` 与 `muxu-todo` 的迁移不要求改写业务逻辑；无 P0/P1 回归。
- 降级：若完整 CSS 拆分阻塞，先发布 subpath + 明确全量 CSS 的 v1.1 preview，不宣称 CSS 完全按需。
- 停止：消费项目出现不可逆运行时回归、导出契约不稳定或无法回滚。
- 证据占位：`evidence/M1/consumer/`、`evidence/M1/bundle/`、`evidence/M1/tarball/`、`evidence/M1/visual/`。

## M2：Icons 公共供应链

### 目标与用户价值

让基础组件默认使用 Aheart 图标，普通用户不需要 GitHub PAT；单图标可 tree-shake，且旧图标包有兼容和回滚路径。

### 前置依赖与 Owner

- 前置：M0 的许可证/发布决策；M1 的 exports 与样式消费规则。
- Owner：REL（供应链）；TM（适配）；DEV/QA/DOC/PM 协同。

### 任务清单

- [ ] **M2-PM-01** 冻结图标命名、视觉语义、旧包兼容周期和默认图标变更告知策略。
- [ ] **M2-TM-01** 评审 `@aheart-ui/icons` 包名、npm 发布、exports、单图标入口、许可证和来源清单。
- [ ] **M2-DEV-01** 为 aheart-icon 增加 ESM/CJS、类型、单图标 subpath、`sideEffects` 和构建验证。
- [ ] **M2-DEV-02** 将 AIcon 默认适配到 Aheart Icons，保留 component/slot/用户覆盖和 fallback。
- [ ] **M2-QA-01** 在 clean consumer、ai-review-gate、muxu-todo 验证无凭据安装、tree-shaking、SSR、图标缺失与主题色。
- [ ] **M2-DOC-01** 写图标安装、命名、替换、旧包迁移、许可证和自定义图标文档。
- [ ] **M2-REL-01** 完成 npm dry-run、公共安装、版本 tag、变更日志和撤回/回滚演练；未通过不得发布 stable。

### 输出物、验收与降级

- 输出物：Icons 包、AIcon 适配、来源/许可证清单、迁移文档、供应链报告。
- 退出：干净环境无需 PAT；组件默认图标正确；单图标导入不拉全量；三个试点无视觉/交互回归；回滚可执行。
- 降级：公共包受阻时保留现有图标适配，发布独立 preview，不阻塞 M1。
- 停止：许可证来源不清、发布权限不可审计或安装必须依赖私有凭据。
- 证据占位：`evidence/M2/package/`、`evidence/M2/license-inventory.md`、`evidence/M2/pilots/`。

## M3：Primitive + Combobox 旗舰试点

### 目标与用户价值

用一个复杂组件验证受控/非受控、Compound/Namespaced、Primitive、键盘无障碍、状态属性、Presence 和按需分发的完整闭环。

### 前置依赖与 Owner

- 前置：M1 的 subpath/CSS；M2 不是启动阻塞项，未通过时继续使用 Lucide fallback 且不得改变 AIcon 公共 API。
- Owner：TM；DEV 主责实现，QA 负责无障碍与浏览器，PM/DOC 负责可用性。

### 任务清单

- [ ] **M3-PM-01** 冻结普通 API 与高级 `Root/Control/Input/Trigger/Content/Item` API 的用户场景和非目标。
- [ ] **M3-TM-01** 设计 `useControllableState`、`APrimitive/asChild`、Collection、Focus、data-scope/part/state 契约。
- [ ] **M3-TM-02** 冻结首发支持矩阵：单选、自定义对象、分组、async loading、disabled、empty、SSR 为 Must；multiple/tags、creatable、virtualization、远程分页明确列为 Should/Later，不得静默扩入首发。
- [ ] **M3-DEV-01** 实现 Combobox 普通 API和 namespaced API，保持旧 API 可迁移。
- [ ] **M3-DEV-02** 实现键盘导航、ARIA、受控/非受控、过滤、选中和焦点恢复。
- [ ] **M3-QA-01** 覆盖鼠标/键盘/触屏、RTL、SSR、iframe/custom teleport、axe 和浏览器视觉验收。
- [ ] **M3-QA-02** 在 clean consumer 与 muxu-todo 完成真实业务接入；ai-review-gate 验证 AI 输入场景。
- [ ] **M3-DOC-01** 输出 Anatomy、迁移、API、状态属性、组合示例和可访问性说明。
- [ ] **M3-REL-01** 验证 root/subpath/namespaced 的 tarball exports、包体和版本兼容。

### 输出物、验收与降级

- 输出物：Combobox、Primitive 内部设施、API/ARIA 矩阵、浏览器证据、消费示例。
- 退出：主场景无 P0/P1；键盘和 axe 通过；controlled/uncontrolled 与 SSR 通过；三入口和 bundle 通过；至少一个真实业务试点接受。
- 降级：先发布普通 API + 内部 Primitive，延后 `asChild` 或 virtualization；不得把未实现能力写进文档。
- 停止：焦点陷阱、SSR hydration 或 API 兼容问题无法在本阶段修复。
- 证据占位：`evidence/M3/browser/`、`evidence/M3/a11y/`、`evidence/M3/consumer/`、`evidence/M3/api-matrix.md`。

## M4：浮层/Dialog 内核迁移

### 目标与用户价值

统一 Modal、Drawer、Popover、Select 等浮层的 Portal、Dismiss、Focus、scroll lock、退出卸载和自定义容器，减少行为差异。

### 前置依赖与 Owner

- 前置：M3 的 Primitive/Presence 契约及现有浮层回归基线。
- Owner：TM；DEV 按组件族单独迁移，QA 每族验收。

### 任务清单

- [ ] **M4-PM-01** 按风险排序 Modal、Drawer、Popover、Select 的迁移批次和保持不变的 API。
- [ ] **M4-TM-01** 冻结 Portal、Dismissable Layer、Focus Scope、scrollBody、teleportTo、useId 和 nonce 契约。
- [ ] **M4-DEV-01** 先迁移 Popover/Tooltip/Dropdown 浮层族，验证 Anchor、Portal、Dismiss 和 hover/click/contextmenu。
- [ ] **M4-DEV-02** 再迁移 Modal/Drawer Dialog 族，保留 focus trigger、after close、mask、responsive 与 custom container 行为。
- [ ] **M4-DEV-03** 最后迁移 Select；TreeSelect、Cascader、DatePicker、TimePicker 分批进入后续 M4 增量，不混入首个出口门。
- [ ] **M4-QA-01** 验证 Escape 最上层关闭、点击外部、焦点恢复、滚动锁、iframe/SSR/RTL 和退出动画卸载。
- [ ] **M4-DOC-01** 更新浮层配置、迁移限制、组合 API 和故障排查。
- [ ] **M4-REL-01** 对每个组件族做独立 preview 包与变更日志，未完成族不混入 stable。

### 输出物、验收与降级

- 退出：每个已迁移组件族有独立代码、自动化、视觉、消费和回滚证据；旧组件无回归。
- 降级：保留旧实现并关闭新内核 feature flag；只发布已验收族。
- 停止：出现跨族焦点/滚动回归且无法隔离。
- 证据占位：`evidence/M4/modal/`、`evidence/M4/overlay/`、`evidence/M4/regression/`。

## M5：Motion Preview

### 目标与用户价值

提供可选的 Presence 与少量通用过渡，让复杂交互有一致的进入/退出体验，同时基础包不依赖 Motion，且尊重 reduced-motion。

### 前置依赖与 Owner

- 前置：M3 Presence；M4 至少一个浮层族的退出生命周期。
- Owner：TM/设计；DEV 实现，QA 视觉与可访问性，DOC/REL 发布 preview。

### 任务清单

- [ ] **M5-PM-01** 冻结 Preview 首发范围：Presence、Fade、Slide、Collapse、reduced-motion；明确延期的 Effects。
- [ ] **M5-TM-01** 设计 CSS/Web Animations API 适配、生命周期、时长、状态属性和 SSR 行为。
- [ ] **M5-DEV-01** 实现 `@aheart-ui/motion` preview，基础包保持可脱离安装和运行。
- [ ] **M5-QA-01** 验证 enter/leave、快速切换、卸载时机、prefers-reduced-motion、SSR 与帧率可接受。
- [ ] **M5-DOC-01** 提供组件 motion preset、禁用动画、无障碍和自定义 CSS 示例。
- [ ] **M5-REL-01** 发布 preview tag，记录 API 稳定性和升级风险，不标 stable。

### 输出物、验收与降级

- 退出：关闭 Motion 后基础组件功能完全可用；退出动画不会截断内容；reduced-motion 通过；至少 Modal/Popover 一条真实链路。
- 降级：只发布 Presence + CSS preset；延期复杂 JS 动效。
- 停止：动画造成焦点、hydration、测试稳定性或性能回归。
- 证据占位：`evidence/M5/visual/`、`evidence/M5/a11y/`、`evidence/M5/performance/`。

## M6：AI/DND 产品化

### 目标与用户价值

把 AI 包从组件清单收敛为 Chat、Agent、Workbench 三个可运行场景；普通 AI 组件不加载 DND，Workbench 按需加载 DND。

### 前置依赖与 Owner

- 前置：M1 按需边界；M5 可选 Motion；M0 的用户反馈和 AI 场景 PRD。
- Owner：PM（场景）；TM（依赖边界）；DEV/QA/DOC/REL 协同。

### 任务清单

- [ ] **M6-PM-01** 冻结 Chat、Agent、Workbench 的用户任务、数据模型、状态流转和无厂商绑定的接入方式。
- [ ] **M6-TM-01** 冻结 AI subpath、根入口不静态引用 Workbench/DND 的依赖图和 breaking change。
- [ ] **M6-DEV-01** 完成 Chat 场景：Bubble、Sender、Actions、Sources 的可运行 demo。
- [ ] **M6-DEV-02** 完成 Agent 场景：ThoughtChain、Process、AgentStatus、ToolCall 的可运行 demo。
- [ ] **M6-DEV-03** 完成 Workbench 场景：Artifact、Approval、DND 和错误/恢复状态。
- [ ] **M6-QA-01** 在 ai-review-gate 验证 AI 交互；在 muxu-todo 验证普通业务包不解析 DND；clean consumer 验证 subpath。
- [ ] **M6-DOC-01** 输出三场景指南、类型/事件契约、迁移和组合示例。
- [ ] **M6-REL-01** 生成 AI 与 DND 分离 tarball，检查安装、exports、许可证、bundle 和回滚。

### 输出物、验收与降级

- 退出：三个场景均有真实可操作 demo；AISender/AIBubble 无 DND；Workbench 可独立安装；AI 关键状态有自动化和视觉证据。
- 降级：先发布 Chat + Agent preview，Workbench/DND 延后；不把未完成场景标为 stable。
- 停止：AI 根入口继续拉入 DND、试点无法安装或状态模型未稳定。
- 证据占位：`evidence/M6/ai-review-gate/`、`evidence/M6/muxu-todo/`、`evidence/M6/clean-consumer/`。

## M7：文档、Resolver 与生态

### 目标与用户价值

让新用户沿一条推荐路径在 10 分钟内完成安装和首个组件；让文档示例从真实产物验证，Resolver 与包导出保持一致。

### 前置依赖与 Owner

- 前置：M1 exports；M3/4 的稳定 API；M6 场景清单可读取。
- Owner：DOC；TM/DEV 负责契约同步，QA 验证示例，REL 负责生态发布。

### 任务清单

- [ ] **M7-PM-01** 冻结首页推荐路径：Resolver + theme.css；把 `/full`、subpath、namespaced 放入分层指南。
- [ ] **M7-TM-01** 让单一 manifest 驱动 exports、Resolver、文档导航、质量矩阵和发布清单。
- [ ] **M7-DEV-01** 实现并验证 `aheart-ui/resolver`，组件、样式和图标解析不产生隐式全量依赖。
- [ ] **M7-QA-01** 从 tarball 运行全部推荐示例、Vite/Nuxt/SSR/iframe 和三试点冒烟。
- [ ] **M7-DOC-01** 完成安装、按需、主题、Icons、Motion、基础、AI、迁移和 FAQ 文档；删除未实现示例。
- [ ] **M7-REL-01** 建立 release checklist、变更日志、弃用告警、版本 tag 和生态 smoke workflow。

### 输出物、验收与降级

- 退出：文档代码不依赖源码路径；Resolver、exports、示例和实际 tarball 一致；新用户测试达到 M0 指标。
- 降级：Resolver 延后，保留 subpath + 手动安装文档；不伪称自动按需。
- 停止：文档与包产物持续漂移、示例无法从干净环境运行。
- 证据占位：`evidence/M7/docs/`、`evidence/M7/resolver/`、`evidence/M7/consumer/`。

## M8：v2 决策、Beta/RC/Stable

### 目标与用户价值

根据采用和质量证据决定是否进入 v2，而不是按计划自动发布；提供可回滚、可沟通的 Beta/RC/Stable 发布路径。

### 前置依赖与 Owner

- 前置：M0–M7 各阶段退出报告、三个试点反馈、许可证/供应链审计和未关闭缺陷清单。
- Owner：PM（Go/No-Go）；TM（技术签字）；REL（发布）；QA/DOC/DEV 提供证据。

### 任务清单

- [ ] **M8-PM-01** 汇总采用率、首次成功时间、升级成本、试点留存、用户反馈和未满足 JTBD。
- [ ] **M8-PM-02** 主持 v2 Decision Gate，明确 Go、延期、缩 scope 或停止四种结果与决策记录。
- [ ] **M8-PM-03** 在 Stable 前建立 D+30/D+60/D+90 复盘模板、Owner、指标口径和到期提醒；发布后按期形成复盘结论。
- [ ] **M8-TM-01** 审核 breaking changes、包体/性能、SSR、a11y、API/类型、回滚和安全供应链。
- [ ] **M8-DEV-01** 只修复已批准的 Beta/RC 阻塞项；不得在 RC 阶段增加新能力。
- [ ] **M8-QA-01** 执行全量回归、三个试点、浏览器视觉、包安装、bundle、SSR、axe 和升级测试。
- [ ] **M8-QA-02** 定义并验证安装失败、运行错误、文档任务、包体和试点回归的数据源，确保 30/60/90 天可持续采集。
- [ ] **M8-DOC-01** 完成版本迁移、弃用、已知问题和发布说明，所有声明对应证据。
- [ ] **M8-REL-01** 依次发布 preview/beta、RC、stable；每阶段保留产物、签名、日志和回滚演练记录。
- [ ] **M8-REL-02** 记录发布版本、dist-tag、下载/安装信号、回滚次数和支持事件，为 D+30/D+60/D+90 复盘提供发布数据。

### 发布门槛

- Beta 发布：M1 的公共安装与契约可用；P0 为零；Beta 范围内 P1 为零；至少两个试点准备加入。M2 未通过时不得默认切换 Icons。
- Beta 退出/RC 进入：完成至少 14 天观察；三试点通过；文档与 tarball 一致；无未关闭 P0/P1；回滚演练完成。
- Stable：PM/TM/QA/REL 联签；成功指标达到 M0 冻结值；用户验收明确通过；变更日志和支持路径可用。
- 任一门槛未满足：保持当前稳定版本，发布延期或缩 scope；不得用“代码已合并”替代 Go。

### 输出物、降级/停止与证据

- 输出物：Decision Gate 记录、全量验收报告、版本产物、迁移指南、回滚记录、用户验收记录。
- 降级：维持 v1.x stable，将未达标模块继续以 preview 发布；重新排期而非扩大范围。
- 停止：许可证/供应链、严重安全问题、不可回滚数据/运行时回归或三试点全部拒绝采用。
- 证据占位：`evidence/M8/decision/`、`evidence/M8/release/`、`evidence/M8/rollback/`、`evidence/M8/user-acceptance/`。

## 统一阶段报告模板

每个阶段结束时复制以下模板，分别填写“代码、自动化、视觉、包消费、发布、用户验收”，不能合并为一个绿色状态。

```md
### [阶段] 验收报告
- 状态：Not started / In progress / Blocked / Needs decision / Accepted
- 范围：
- 未完成任务：任务编号 + 原因 + owner + 下一步
- 代码证据：
- 自动化证据：
- 视觉/运行时证据：
- 包消费证据：
- 发布/供应链证据：
- 用户验收证据：
- 已知风险与回滚点：
- PM 决策：Go / No-Go / 缩 scope / 延期
- TM 签字：
- QA 签字：
- DOC/REL 签字：
```

## 当前启动顺序

- [ ] 先完成 M0，不直接创建 M1–M8 的“实现完成”状态。
- [ ] M0 退出后，建立独立工作树/分支：`codex/m1-on-demand`、`codex/m2-icons`、`codex/m3-combobox`，避免共享写入。
- [ ] 每个阶段只创建本清单中已有编号的 issue；新增范围先回到 M0 决策台账。
- [ ] 阶段验收通过后才允许进入下一阶段；并行任务必须使用不同文件、包、端口或工作树。
