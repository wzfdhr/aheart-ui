# Aheart UI v2 阶段验收标准

> 文档状态：已批准验收基线（Approved），2026-11-05 由 wzfdhr（单人项目，产品、技术、设计/文档、发布负责人均由其担任） 签字生效。
>
> 说明：正文中的发布事实截至 2026-09-08；截至 2026-11-05，`aheart-ui@1.1.0`、`@aheart-ui/dnd@1.0.0`、`@aheart-ui/ai@1.0.0` 均已公开发布，见 [发布报告](../evidence/v1.1.0-release-2026-09-29/registry-publish-report.md)。批准文档不等于 M0 通过，M0 其余门禁仍按阶段验收标准判定。
>
> 适用范围：Aheart UI 基础组件、`@aheart-ui/ai`、`@aheart-ui/dnd`、`@aheart-ui/motion`、`@aheart-ui/icons`、Resolver、文档站与发布链路。
>
> 关联文档：[产品与技术总体方案](./2026-09-08-aheart-ui-product-and-technical-master-plan.md)、[整体任务流程清单](./2026-09-08-aheart-ui-v2-task-flow-checklist.md)、[技术 RFC](./2026-09-08-aheart-ui-v2-architecture-optimization-design.md)。

## 1. 验收原则

每个阶段只接受三种结果：

- **Pass**：该阶段全部 Must 项完成，所有适用门禁满足，不适用门禁已书面标记 `N/A` 并说明理由，证据可复核，允许进入下一阶段。
- **Conditional**：全部 P0 通过，存在已登记且不影响当前用户路径的 P1/P2；必须有责任人、截止日期、降级路径，且不得进入真实发布阶段。
- **Fail**：任一 P0 未通过、证据缺失或门禁之间互相矛盾；停止下一阶段，执行回滚或降级。

“代码已写完”“本地开发服务器能打开”“PR 已创建”均不等于阶段通过。代码、自动检查、视觉、打包、合并、主线 CI、Pages、npm 发布和用户验收分别记录状态。

## 2. 证据等级与缺陷级别

### 2.1 证据等级

| 等级 | 定义 | 可证明内容 | 不可替代的证据 |
| --- | --- | --- | --- |
| E0 | 口头或设计意图 | 目标、假设、待办 | 不能作为通过依据 |
| E1 | 本地静态证据 | 源码、类型、单测、构建日志 | 不能证明消费端、视觉或发布可用 |
| E2 | 本地运行证据 | 本地预览、截图、交互录像、消费 fixture | 不能证明 PR/主线/Pages/npm |
| E3 | PR 审查证据 | PR diff、审查结论、Review thread | 不能替代合并后 CI |
| E4 | 合并后环境证据 | 主线 CI、Pages 预览、npm pack 安装 | 不能替代真实 npm 发布后的验证 |
| E5 | 真实消费/用户证据 | 三个试点、干净安装、真实 npm 安装、反馈和复测 | 可作为 Beta/Stable 决策依据；不能自动声称存在外部用户 |

阶段文档必须注明每条证据的路径、命令、提交 SHA、运行时间和结论。截图必须包含 URL、浏览器、视口和测试场景；命令证据必须包含退出码。

### 2.2 缺陷级别

| 级别 | 判定规则 | 阶段影响 |
| --- | --- | --- |
| P0 | 安装失败、构建失败、数据丢失、键盘/屏幕阅读器核心路径失败、严重错误样式、公开包无法使用、许可证或凭据风险 | 立即 Fail，阻止合并和发布 |
| P1 | 推荐路径功能错误、组件 API 不兼容、SSR/iframe 失败、核心浏览器失败、包体超标、文档示例失败 | Beta/Stable 前必须关闭；开发阶段可 Conditional |
| P2 | 非核心视觉偏差、边缘浏览器差异、文档措辞、可选增强缺失 | 可登记后带入后续版本 |

同一问题在两个独立环境复现，或影响两个以上组件，自动升一级；涉及安全、凭据、许可证的问题最低按 P0 处理。

## 3. 公共八门禁

每个阶段都必须逐项填写以下门禁。允许按阶段标记 `N/A`，但必须由阶段标准明确允许并给出理由；遗漏和 `N/A` 不是同一状态。

| 门禁 | Pass 条件 | 必需证据 | 责任边界 |
| --- | --- | --- | --- |
| G1 设计冻结 | 目标、范围、API、非目标、迁移和回滚写入方案；变更经过产品和技术负责人确认 | 设计文档、变更记录、决策人和日期 | 设计冻结后新增需求进入下一阶段 |
| G2 代码 | Must 范围已实现；类型、exports、依赖方向和许可证检查通过 | diff、`git status`、类型/构建日志 | 本地通过不代表 PR 通过 |
| G3 自动检查 | 相关单测、组件测试、a11y、SSR/iframe、bundle 检查全部通过；无未解释失败 | 命令、退出码、报告文件 | 已知失败必须有编号和降级决定 |
| G4 视觉 | 关键视口和状态与基线一致；交互、动效、暗色/移动适用性通过 | 五浏览器截图/录像、对比结果 | 视觉验收由实际运行页面完成 |
| G5 包 | `pnpm pack`/`npm pack` 产物可在干净目录安装；exports、类型、CSS、依赖和 module graph 正确 | tarball SHA、安装日志、bundle 报告 | pack 验证不等于 npm 发布 |
| G6 审查合并 | PR 通过产品、技术、质量审查；无未解决 P0/P1；合并策略和 SHA 已记录 | PR URL、审批记录、合并 SHA | PR 未合并不得进入主线门禁 |
| G7 主线 CI/部署 | 合并后的主线 CI 全绿；Pages 构建和部署可访问，部署 SHA 与合并 SHA 对齐 | CI URL、Pages URL、部署日志 | Pages 失败不能用本地预览替代 |
| G8 用户验收 | 指定试点/干净消费者完成真实任务并签字；反馈已归档 | 验收表、录屏/截图、反馈和复测 | 只在定义的用户范围内生效 |

状态必须分开记录：`Local`、`PR`、`Merged`、`Main CI`、`Pages`、`npm pack`、`npm published`、`UA`。例如 `Local=Pass`、`PR=Pass`、`Merged=No` 时，阶段仍不是 Pass。

门禁适用原则：

- M0 是产品与契约阶段：G1、G8 必须通过；G2-G7 可以标记 `N/A`，但基线采集脚本或文档变更若进入代码库，相关 G2/G3/G6/G7 仍适用。
- M1-M7：本阶段实际涉及的设计、代码、自动化、视觉、包、合并、主线和用户路径门禁均适用。
- M8 发布：G1-G8 全部适用，不允许 `N/A`；`npm published` 只在真实发布后才能标记 Pass。

## 4. 固定试点与环境矩阵

三项试点贯穿 M0、M1、M2、M6、M7、M8：

1. `ai-review-gate`：AI 产品/桌面消费端，验证 AI 包、安装、主题和长期迁移。
2. `muxu-todo`：普通业务消费端，验证基础组件、表单、数据展示和升级兼容。
3. `clean-consumer`：从零创建的 Vite/Nuxt 消费端，验证 clean install、Resolver、SSR 和没有仓库隐式依赖。

固定验证矩阵：

- Node.js 版本按仓库 `.nvmrc`/`package.json` 声明的支持范围各跑一次。
- Vue 3、Vite；若声称 Nuxt/SSR 支持，则必须跑 Nuxt SSR fixture。
- 五项目基线：desktop Chromium、mobile Chromium、desktop Firefox、desktop WebKit、mobile WebKit，与仓库 `playwright.config.ts` 对齐；真实 Safari/物理 iOS 属于单独门禁，只有明确纳入阶段范围并实际运行后才能声称通过。
- `iframe` 场景：组件挂在 iframe `document` 内，浮层、ownerDocument、焦点和样式均从 iframe 验证。
- `prefers-reduced-motion`、键盘、屏幕阅读器可访问性路径至少覆盖旗舰组件。

## 5. 阶段清单与验收

### M0：产品与契约冻结

**目标**：把技术蓝图变成可执行产品契约，冻结第一优先用户、默认采用路径、包边界和发布策略。

**进入条件**：现有架构方案已完成产品审查；当前 npm/仓库包状态已核对；三项试点可定位或已建立；没有未决的 P0 产品事实错误。

**Must**

- 明确定位：面向 Vue 3 AI 产品与业务后台的 styled component system。
- 完成用户、JTBD、竞品、默认采用路径、非目标和成功指标。
- 冻结包图：基础、AI、DND、Motion、Icons、Resolver 的依赖方向。
- 冻结版本路线：M1 v1.1、M2 Icons、M3/M4 旗舰能力、M5 Motion Preview、M6 AI/DND、M7 生态、M8 v2 决策。
- 建立任务清单、风险登记、负责人、预计周期和 Go/No-Go 决策人。
- 完成三个试点的当前基线：安装耗时、首次渲染、包体、失败点、关键任务和可回滚版本。

**Should**：完成许可证和 npm scope 预审；形成第一版竞品与用户访谈记录。

**Later**：完整视觉品牌重做、非核心动效、所有组件的 Compound API。

**量化验收**：产品和技术负责人各 1 次书面批准；至少 3 个试点和 1 个 clean fixture；所有 Must 任务有 owner 和截止日期；所有 P0=0。

**必需证据**：E3 以上的冻结文档、任务清单、包图、风险表、试点基线报告。

**Go/No-Go**：Go=G1、G8 和所有实际适用门禁通过且 P0=0；Conditional=仅有已登记 P2；No-Go=定位、包边界、许可证或用户路径任一未决。

**回滚/降级**：保留当前 v1；停止新增包和破坏性 API，只允许文档和基线工作。

### M1：v1.1 真实按需

**目标**：让基础组件具备可证明的组件级 JS/CSS 按需引入。

**进入条件**：M0 Pass；现有 `aheart-ui@1.0.0` 消费方式已记录；Button、Modal、Select 作为试点组件冻结，Combobox 留在 M3。

**Must**

- 支持根 named import、组件 subpath、`/full` 和仅覆盖三组件的 Resolver Preview；默认文档只推荐一条路径。
- 拆分 `theme.css`、组件 CSS 和 `full.css`，不允许组件入口隐式加载全量 CSS。
- exports、类型、ESM/CJS（若声明支持）、SSR 和副作用配置一致。
- 建立 bundle module graph fixture，证明 Button 不带 Table/AI，Modal 不带 AI/DND，Select 不带全量组件。
- 三项试点完成迁移或明确保留旧入口的兼容策略。

**Should**：提供 codemod 或迁移表；对公共组件导入失败给出可读错误。

**Later**：所有组件一次性迁移、CSS 原子化、完整组件自动生成。

**量化验收**：三个试点（包含 clean-consumer）均可从干净目录安装 tarball；三类入口各有 1 个成功 fixture；module graph 无越界依赖；按需产物相对 full 产物有可解释下降；五浏览器核心组件通过；P0=0、P1=0。

**必需证据**：E2 本地运行、E3 PR、E4 合并主线 CI/Pages、`npm pack` tarball 安装日志、module graph 报告、五浏览器截图。

**Go/No-Go**：Go=G1-G8 全通过且 `npm pack` clean install 全部通过；Conditional=仅允许文档 P2；No-Go=任一推荐入口安装失败、CSS 泄漏、SSR/iframe 失败或 module graph 越界。

**回滚/降级**：保留 v1 根入口和全量 CSS；撤回 Resolver/subpath 文档；不得发布破坏现有 `aheart-ui@1.0.0` 的版本。

### M2：Icons 公共供应链

**目标**：把默认图标接入 `aheart-icon` 体系，同时保证无 PAT 的公开安装和可回退性。

**进入条件**：M0 Pass 且 M1 的 exports/CSS 逻辑契约已冻结；M2 可以与 M1 实现并行。图标许可证、npm scope 所有权、发布权限和命名表已审查；旧 Lucide 映射已盘点。

**Must**

- 公共 npm 包（暂定 `@aheart-ui/icons`）可在无 GitHub PAT、无私有 registry 配置的干净环境安装。
- 提供根入口和单图标 subpath；`sideEffects`、类型、ESM/CJS 声明与实际产物一致。
- AIcon 默认语义图标改用新库；保留 `component`、slot 和 ConfigProvider 覆盖。
- 旧包兼容周期、迁移说明、图标来源和许可证记录完成。
- Icons 发布失败时，基础包仍有明确 fallback，不阻塞基础组件安装。

**Should**：生成图标目录、命名别名、尺寸快照和暗色/高对比度检查。

**Later**：全部 518 图标一次性迁移、在线图标搜索、动态图标动画。

**量化验收**：clean install 无 `.npmrc`、PAT 或 GitHub 登录；至少 20 个核心图标单文件导入通过；AIcon 5 个默认语义图标在五浏览器显示正确；许可证扫描 0 个 P0/P1；三试点至少 1 个完成替换。

**必需证据**：真实 `npm pack`/npm 安装日志、无 PAT 环境变量证明、图标许可证清单、视觉截图、回退测试。

**Go/No-Go**：Go=公共安装、单图标 tree-shaking、默认图标和 fallback 全通过；Conditional=非核心图标延后；No-Go=需要 PAT、许可证不清、默认图标导致核心组件失败。

**回滚/降级**：基础包继续使用内置兼容映射；暂停 `@aheart-ui/icons` 默认依赖，只允许 opt-in 接入。

### M3：Primitive + Combobox

**目标**：用一个旗舰复杂组件验证受控状态、Primitive、Compound API、Collection、键盘和可访问性契约。

**进入条件**：M1 Pass；Combobox 数据模型、状态机、API 和非目标已冻结。M2 未通过时继续使用 Lucide fallback，不阻塞 M3，也不得提前切换默认图标。

**Must**

- 普通 API 与 namespaced API 同时可用：`ACombobox` 和 `Combobox.Root/Input/Trigger/Content/Item`。
- 受控/非受控、单选、自定义对象、分组、异步 loading、空状态、禁用、键盘导航和表单校验路径通过。
- `Primitive/asChild`、`data-scope`、`data-part`、`data-state` 契约稳定并有测试。
- ownerDocument、iframe、SSR hydration、焦点回收和屏幕阅读器语义通过。
- 组件入口、样式、图标和依赖 module graph 无全量泄漏。

**Should**：多选/Tags、创建选项、虚拟列表、远程分页和命令模式；提供迁移示例。

**Later**：全部 Select/TreeSelect/Cascader 同步改造。

**量化验收**：至少 12 条交互用例、8 条键盘/a11y 用例、SSR/iframe 各 1 个 fixture；五浏览器全部通过；核心用例无 P0/P1；三个试点至少 1 个真实采用。

**必需证据**：E2 交互录像和截图、自动化报告、axe/键盘报告、SSR/iframe 日志、E3 审查记录。

**Go/No-Go**：Go=普通和组合 API 均通过八门禁；Conditional=仅 Later 功能缺失；No-Go=受控状态、焦点、SSR、iframe 或键盘任一失败。

**回滚/降级**：保留原 Select/Autocomplete；namespaced API 仅预览导出，不改变旧 API。

### M4：浮层/Dialog

**目标**：统一 Modal、Drawer、Popover、Select 等浮层的 Portal、Focus、Dismiss、Presence 边界。

**进入条件**：M3 Pass；Combobox 依赖的浮层契约已冻结；现有 Modal/Drawer 行为基线已保存。

**Must**

- 统一 `teleportTo`、ownerDocument、body scroll lock、dismiss、focus trap/restore、Escape 和 nested layer 行为。
- 覆盖 Popover、Tooltip、Dropdown、Modal、Drawer、Select 至少各 1 个真实场景。
- 默认行为兼容旧 API；迁移失败可按组件回退。
- iframe、SSR、移动视口、滚动容器和 z-index 层级通过。

**Should**：统一 ConfigProvider、RTL、CSP nonce、可选 forceMount。

**Later**：TreeSelect、Cascader、DatePicker、TimePicker 的后续 M4 增量；所有历史浮层一次性重写；跨窗口 Portal。

**量化验收**：6 个首批浮层组件、至少 20 条焦点/关闭/嵌套用例；五浏览器和 iframe 通过；无焦点泄漏、滚动锁死、遮挡或 P0/P1。

**必需证据**：视觉基线对比、键盘/焦点录像、iframe 与 SSR 报告、module graph、主线 CI/Pages。

**Go/No-Go**：Go=核心浮层全通过；Conditional=非核心高级配置延后；No-Go=Modal/Drawer 核心关闭、焦点或滚动行为回归。

**回滚/降级**：按组件开关新内核；默认回到旧浮层实现，保留新 API 但不启用。

### M5：Motion Preview

**目标**：以 Presence、Fade、Slide、Collapse 和 reduced-motion 形成可选动效预览，不增加基础包强依赖。

**进入条件**：M3 的 Presence 已 Pass，且 M4 至少一个浮层组件族通过退出生命周期验收；状态属性、动效规范、时长和无障碍策略冻结。M5 不需要等待 M4 全部组件族完成。

**Must**

- `@aheart-ui/motion` 首发仅包含 Presence、Fade、Slide、Collapse、reduced-motion。
- 基础组件不强依赖 Motion；退出动画完成后再卸载；关闭动画不阻塞键盘和屏幕阅读器。
- `prefers-reduced-motion` 默认尊重；可由 ConfigProvider 配置但不可绕过用户系统偏好。
- Modal、Popover、Select 至少各有 1 个接入示例，CSS/JS 时间线可复现。

**Should**：AnimatePresence 兼容层、动画调试标识、动效性能预算。

**Later**：Typewriter、Marquee、AnimateNumber、Stagger。

**量化验收**：进入/退出各至少 3 条用例；reduced-motion 下无位移/闪烁；五浏览器通过；核心页面无持续长任务；Motion 不进入未使用基础组件 module graph。

**必需证据**：不同 motion preference 的录像、性能 trace、bundle graph、a11y 报告、Pages 预览。

**Go/No-Go**：Go=可选安装、退出卸载、reduced-motion 和性能预算通过；Conditional=非核心效果延后；No-Go=动画导致内容不可访问、基础包强依赖或性能 P1。

**回滚/降级**：全局关闭 Motion，回到 CSS 无动画或旧过渡；不撤销基础组件 API。

### M6：AI/DND

**目标**：让 AI 包按 Chat、Agent、Workbench 三个产品场景可独立安装，Workbench 才引入 DND。

**进入条件**：M1 Pass；AI/DND 的 npm 发布、许可证和 API 现状已核对；三场景数据模型和非目标冻结。

**Must**

- `@aheart-ui/ai/chat`、`agent`、`workbench` 或等价子路径具备独立入口。
- Chat 不引入 DND；Agent 不引入 Workbench；Workbench 才按需引入 DND。
- 三场景各有完整 demo、状态流转、loading/error/empty、键盘和移动适配。
- `ai-review-gate` 至少完成 AI 包真实消费；普通基础试点不因 AI 依赖安装失败。
- 无模型厂商凭据依赖；示例使用 mock adapter；公共 npm 安装不要求 PAT。

**Should**：流式消息、ToolCall、Sources、Approval、Artifact 的标准数据模型。

**Later**：厂商专属适配器、在线协作、复杂白板。

**量化验收**：三场景各至少 1 条完整用户任务；至少 15 条组件/状态测试；DND module graph 只出现在 Workbench；clean install 和五浏览器通过；AI 试点签字。

**必需证据**：场景录像、包安装日志、module graph、a11y/移动报告、主线 CI/Pages、试点反馈。

**Go/No-Go**：Go=三场景独立可安装且试点完成；Conditional=非核心场景延后；No-Go=AI 包需要私有凭据、DND 污染基础/Chat，或核心场景无法运行。

**回滚/降级**：AI/DND 保持仓库内部包或 preview tag；基础包和 M1/M2 发布不受影响。

### M7：文档/Resolver/生态

**目标**：使新用户能在十分钟内完成安装、显示正确样式并找到下一步；让文档、Resolver、导出契约由同一 manifest 生成或校验。

**进入条件**：M1-M6 均 Pass 或 Conditional 且所有 Conditional 有未到期责任人；至少一个稳定消费版本可发布。

**Must**

- 首页只保留一条推荐采用路径；`full`、subpath、namespaced、Resolver 分别面向明确用户层级。
- 组件清单驱动 exports、Resolver、文档导航、安装示例和质量矩阵，检测漂移。
- 所有推荐示例从发布 tarball 验证，不依赖 monorepo 源码别名。
- 文档包含 API、无障碍、data 属性、CSS token、SSR/iframe、迁移、回滚和版本说明。
- Pages URL 可访问、链接无死链、五浏览器关键页面通过。

**Should**：生成 `llms.txt`、AI 组件检索入口、示例复制和 bundle 信息。

**Later**：多语言、在线 Playground、完整 MCP。

**量化验收**：clean-consumer 首次安装到首个正确样式组件 ≤10 分钟；文档示例成功率 100%；关键页面无 P0/P1；至少 3 个试点能从文档独立完成迁移；Pages SHA 与主线 SHA 对齐。

**必需证据**：新用户任务录屏、文档链接检查、tarball 示例日志、Pages 部署信息、Resolver 测试报告。

**Go/No-Go**：Go=新用户任务、文档、Resolver 和 Pages 全通过；Conditional=仅非核心文档 P2；No-Go=示例只能在 monorepo、推荐路径超过 10 分钟或 Pages 不可用。

**回滚/降级**：保留旧文档入口和手动导入方式；Resolver 标记 preview，不阻塞手动使用。

### M8：v2 决策 / Beta / RC / Stable

**目标**：以真实采用和持续观察决定是否发布 v2，而不是以代码完成量决定。

**进入条件**：M0-M7 已有阶段结论；所有 P0=0；公开包可无 PAT 安装；三试点和 clean-consumer 具备可复测基线。

**Must**

- Beta 发布：三试点中至少 2 个已准备完成真实任务；P0=0，Beta 范围内 P1=0；安装、迁移和回滚前置证据齐全。
- Beta 退出/RC 进入：Beta 持续观察至少 14 天且无 P0；全部 P1 在 RC 前关闭；试点反馈已复测。
- RC：迁移、回滚、npm pack、真实 npm 安装、SSR/iframe、五浏览器、Pages 和主线 CI 全通过；没有未关闭 P0/P1。
- Stable：至少 3 个试点在 RC 后继续使用；关键指标达到 M0 冻结目标；发布包、文档、变更日志、许可证和回滚包齐全。
- Stable 发布前建立 30/60/90 天复盘计划、Owner、数据源和模板；发布后按期记录采用数、安装失败、错误率、包体、文档任务完成率、反馈和回滚次数。

**Should**：公开迁移指南、弃用周期、下一版本候选列表。

**Later**：未影响推荐路径的增强能力进入 v2.1，不延迟 Stable。

**量化验收**：Beta 观察至少 14 天；RC 连续两次主线 CI 全绿；真实 npm 安装在三个试点（包含 clean-consumer）全部成功；Stable 前 30/60/90 天复盘机制已建立且有责任人；Stable 前 P0/P1=0。

**必需证据**：Beta 日志、用户验收签字、npm 真实安装日志、发布 SHA、CI/Pages、变更日志、回滚演练、30/60/90 天复盘计划与模板；发布后的实际复盘按到期时间追加。

**Go/No-Go**：

- **Beta 发布 Go**：P0=0、Beta 范围 P1=0、试点准备数 ≥2，定义矩阵安装成功率 100%。
- **Beta 退出 Go**：观察至少 14 天无 P0，全部 RC 范围 P1 已关闭。
- **RC Go**：所有 G1-G8 通过，P0/P1=0，回滚演练成功。
- **Stable Go**：RC 观察通过、试点 ≥3 持续使用、指标达标。
- **No-Go**：任一条件不满足；延期并保持上一稳定版本。

**回滚/降级**：撤回 dist/tag 或暂停 latest；将文档和 CDN 指向上一稳定版本；提供迁移回退说明；不删除已发布 tarball。

## 6. 统一阶段验收表

每个阶段结束时复制以下表格并填入链接，禁止只填写“已完成”。

| 项目 | 状态 | 证据链接/命令 | SHA/时间 | 负责人 |
| --- | --- | --- | --- | --- |
| G1 设计冻结 | Pass/Conditional/Fail/N/A |  |  |  |
| G2 代码 | Pass/Conditional/Fail/N/A |  |  |  |
| G3 自动检查 | Pass/Conditional/Fail/N/A |  |  |  |
| G4 视觉 | Pass/Conditional/Fail/N/A |  |  |  |
| G5 包/npm pack | Pass/Conditional/Fail/N/A |  |  |  |
| G6 PR 审查合并 | Pass/Conditional/Fail/N/A |  |  |  |
| G7 主线 CI/Pages | Pass/Conditional/Fail/N/A |  |  |  |
| G8 用户验收 | Pass/Conditional/Fail/N/A |  |  |  |
| Local | Pass/Fail |  |  |  |
| PR | Pass/Fail |  |  |  |
| Merged | Pass/Fail |  |  |  |
| Main CI | Pass/Fail |  |  |  |
| Pages | Pass/Fail |  |  |  |
| npm pack | Pass/Fail |  |  |  |
| npm published | Pass/Fail/NA |  |  |  |
| UA | Pass/Fail |  |  |  |
| 未关闭 P0/P1/P2 | 数量 | issue 链接 |  |  |
| 阶段结论 | Pass/Conditional/Fail | 决策记录 |  |  |

## 7. 最低回滚与发布纪律

- 每次公开发布前保留上一稳定版本、tarball、lockfile、变更日志和回滚命令。
- 不使用 `latest` 做 Beta 验证；Beta、RC、Stable 使用明确 dist-tag。
- 任何真实 npm 发布必须在 `npm published=Pass` 后重新运行 clean install、三试点、SSR/iframe 和最小视觉回归。
- Pages 部署失败时，不得把本地预览或 PR 预览标记为主线发布通过。
- 用户验收未通过时，只能标记 Conditional/Fail；不得用自动化绿色覆盖用户任务失败。
- 迁移失败时优先回退消费端入口和版本，不删除旧导出，不覆盖用户的未提交改动。
