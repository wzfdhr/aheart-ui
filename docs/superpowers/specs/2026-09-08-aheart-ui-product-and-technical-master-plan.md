# Aheart UI 产品与技术总体方案

## 文档状态

- 状态：已批准（Approved）
- 批准：2026-11-05，wzfdhr（单人项目，产品、技术、设计/文档、发布负责人均由其担任）
- 说明：正文中的发布事实截至 2026-09-08；截至 2026-11-05，`aheart-ui@1.1.0`、`@aheart-ui/dnd@1.0.0`、`@aheart-ui/ai@1.0.0` 均已公开发布，见 [发布报告](../evidence/v1.1.0-release-2026-09-29/registry-publish-report.md)。批准文档不等于 M0 通过，M0 其余门禁仍按阶段验收标准判定。
- 日期：2026-09-08
- 适用仓库：`wzfdhr/aheart-ui`
- 方案角色：产品经理 + 技术经理联合主方案
- Owner：产品负责人 wzfdhr；技术负责人 wzfdhr；设计/文档负责人 wzfdhr；发布负责人 wzfdhr
- 本文不承诺具体日历工期；阶段进入条件、退出条件和验收证据优先于日期承诺。

## 1. 一页结论

Aheart UI 应定位为“面向 Vue 3 AI 产品与业务后台的 styled component system”：基础组件提供可直接上线的默认视觉，复杂组件提供可组合的高级 API，AI 产品能力和动效作为可选领域包按需安装。

当前不批准直接启动完整 v2 重写。批准进入 M0 产品与契约冻结，并以三个真实消费项目验证价值、安装和迁移成本。只有 M0-M7 的关键证据满足门禁，才进入 v2 Beta；没有满足门禁时，继续发布兼容的 v1.x 增量版本。

产品结构目标：

```text
Aheart UI Ecosystem
├─ aheart-ui                 基础组件、默认主题、复杂组件内核
│  ├─ /button /modal /select  组件级入口
│  ├─ /full                   全量 Vue Plugin
│  ├─ /resolver               自动按需引入
│  ├─ /namespaced             高级组合 API
│  └─ /theme.css              主题变量
├─ @aheart-ui/icons           默认图标供应链
├─ @aheart-ui/ai              AI 产品组件
├─ @aheart-ui/motion          可选动效预设
└─ @aheart-ui/dnd             拖拽与排序交互
```

现有技术细节、接口草案和风险清单以[架构与产品体系优化设计](./2026-09-08-aheart-ui-v2-architecture-optimization-design.md)为技术 RFC；执行任务和验收判定分别见[整体任务流程清单](./2026-09-08-aheart-ui-v2-task-flow-checklist.md)与[阶段验收标准](./2026-09-08-aheart-ui-v2-phase-acceptance-criteria.md)。四份文档组成同一套决策资料，必须在 M0 一并校对并批准。

## 2. 当前事实与决策前提

### 2.1 发布基线

截至 2026-09-08，公共 npm 的已发布事实是：

- 只有 `aheart-ui@1.0.0` 在公共 npm 可获取。
- `@aheart-ui/ai` 和 `@aheart-ui/dnd` 虽然在仓库中存在对应 package，但尚未作为公共 npm 包发布；不能在产品文案中称为“已公开可安装”。
- `@wzfdhr/aheart-icon` 是现有图标项目/包的供应链候选，不把 GitHub Packages 登录可用性当成基础包默认依赖的成立条件。
- npm 下载量只能作为弱信号，不能等同于活跃用户数、生产项目数或留存。

因此本项目的产品阶段是“基础包刚完成首发、领域包尚在验证期”，不是成熟生态的 v2 升级。M0 必须重新采集包、构建、文档和消费项目基线，发现与本文冲突时以可复现证据为准。

### 2.2 仓库与技术基线

仓库已经具备以下可复用资产：

- 基础组件包、AI package、DND package 的目录分层。
- `ConfigProvider`、受控/非受控组件、浮层定位、dismiss、teleport、focus trap、Presence 等实现基础。
- 组件单元测试、浏览器测试和文档站构建流程。
- 当前已有大量组件设计文档和历史维护分支。

已知技术债：

- 当前发布入口主要按源码模块组织，稳定的 `aheart-ui/button` 等公共 subpath 尚未形成。
- CSS 仍以总样式为主，不能仅凭 JavaScript tree-shaking 宣称真实按需。
- 复杂组件状态、ownerDocument、层级、焦点和动画生命周期契约分散。
- AI/DND 的公共发布状态、图标供应链和消费项目验证尚未闭环。

### 2.3 已知试点项目

M0-M1 固定使用三个消费项目，任何新增试点需记录原因和退出条件：

1. `ai-review-gate`：已有本地 `aheart-ui-1.0.0.tgz` 消费，验证 AI 产品/桌面场景。
2. `muxu-todo`：已有本地 `aheart-ui-1.0.0.tgz` 消费，验证普通业务场景。
3. `clean consumer`：新建最小 Vite 或 Nuxt 消费项目，验证干净安装、Resolver、SSR/构建与文档示例。

三个项目分别代表“已有集成迁移”“业务组件采用”“全新用户激活”，不可用仓库内部 fixture 代替。

## 3. 产品定位、用户与 JTBD

### 3.1 定位

> Aheart UI 是面向 Vue 3 AI 产品与业务后台的 styled component system：用可直接上线的默认视觉降低搭建成本，用组合式复杂组件支持深度定制，并将 Chat、Agent、Workbench 作为一等 AI 产品场景提供。

### 3.2 目标用户优先级

| 优先级 | 用户 | 主要任务（JTBD） | 选择 Aheart UI 的理由 |
|---|---|---|---|
| P0 | Vue 3 AI 产品团队 | 在不自建整套交互基础设施的情况下上线 Chat、Agent、Tool/Approval 和 Workbench | AI 场景现成、视觉一致、可按需安装 |
| P1 | Vue 业务后台开发者 | 快速交付表单、数据展示、浮层和导航，并保留可定制空间 | Styled 默认体验、中文文档、组件覆盖面 |
| P2 | 设计系统/组件库维护者 | 控制主题、无障碍、SSR、bundle 和版本兼容 | 稳定契约、组合 API、发布与质量门禁 |

非目标用户：需要 React/Angular 原生实现的团队；只寻找完全无样式 primitives 的团队；需要组件库代管模型请求、鉴权或业务状态的团队。

### 3.3 用户承诺

- 新用户 10 分钟内能够安装并渲染第一个带正确样式的组件。
- 普通场景只需要一条推荐安装路径，不必先理解 root/subpath/full/namespaced 的差异。
- 复杂组件能够从简单 API 渐进升级到 Compound/Anatomy API。
- AI 组件只负责 UI、状态呈现和交互协议，不绑定模型厂商、网络请求或鉴权。
- 每个推荐示例都从发布 tarball 或真实消费项目验证，而非只在源码工作区运行。

## 4. 竞品与差异化

| 方案 | 强项 | 主要差异 | Aheart UI 取舍 |
|---|---|---|---|
| Element Plus | Vue 业务后台覆盖广、上手快 | AI 产品能力和高级组合边界不是核心 | 保持易用性，强化 AI 产品线与按需证据 |
| Ant Design Vue | 企业组件成熟、规范完整 | 包体、定制和 AI 场景需要额外组合 | 借鉴成熟 API，减少全量默认成本 |
| Naive UI | Vue 体验和主题能力好 | AI/Agent 场景资产较少 | 用 AI 场景和产品化 demo 建差异 |
| Reka UI | Vue primitives、无障碍、组合 API 强 | 无默认视觉，需要较多工程搭建 | 借鉴状态/Primitive/Presence，不改成纯 headless |
| Ark UI | Anatomy、跨框架行为模型、AI 文档友好 | 默认视觉和 Vue 业务落地需另配 | 借鉴 Anatomy、状态契约和文档组织 |
| Ant Design X | AI UI 场景成熟 | 更强绑定 Ant 体系和特定产品语言 | 做 Vue 友好、可独立安装、可组合的 AI 产品层 |

核心差异化不是“组件数量最多”，而是三件事同时成立：

1. Styled by default：安装后即能使用。
2. Composable when needed：复杂场景有可靠的组合 API、焦点和状态契约。
3. AI product ready：Chat、Agent、Workbench 是完整产品场景，不只是零散卡片。

## 5. 产品原则与范围决策

### 5.1 产品原则

1. 先验证采用，再扩大架构范围。
2. 一个默认采用路径，其他路径服务高级用户。
3. 兼容优先：v1 先 additive，破坏性变更进入明确的 v2 门禁。
4. styled 默认、可组合增强，不强迫所有组件变成 `Root/Content/Item`。
5. 基础能力低耦合，AI、Motion、DND 可单独安装。
6. 运行时证据优先于源码推断：测试、视觉、包和用户验收分开报告。
7. 单一组件 manifest 驱动 exports、Resolver、文档、质量矩阵和发布检查。

### 5.2 明确非目标

- 不一次性重写全部 Ready 组件。
- 不把每个组件发布成独立 npm 包。
- 不在基础包内引入 GSAP、Lottie 等大型动画运行时。
- 不复制 Reka UI 或 Ark UI 的内部实现。
- 不把 AI provider、模型请求、鉴权、业务状态管理放入 UI 包。
- 不在缺少真实 bundle fixture 时宣称“已支持按需引入”。

## 6. 产品架构与默认采用路径

### 6.1 包边界

| 包/入口 | 责任 | 首发状态 |
|---|---|---|
| `aheart-ui` | 基础组件、默认主题、复杂组件内核 | 已有公共 npm 1.0.0；按需契约在 M1 建立 |
| `aheart-ui/full` | 全量 Vue Plugin 与全量样式 | M1 |
| `aheart-ui/<component>` | 组件级 JS、类型和对应 CSS 入口 | M1 先 Button/Modal/Select |
| `aheart-ui/resolver` | `unplugin-vue-components` Resolver | M1 三组件 Preview；M7 全生态 Stable |
| `aheart-ui/namespaced` | 高级 Compound API | M3 先 Combobox |
| `@aheart-ui/icons` | Aheart 默认图标及单图标 exports | M2 |
| `@aheart-ui/ai` | Chat、Agent、Workbench UI | M6 后公共发布 |
| `@aheart-ui/motion` | 可选 Presence 预设和动效 token | M5 Preview |
| `@aheart-ui/dnd` | 拖拽、排序与 Workbench 交互 | M6 配套发布 |

### 6.2 唯一默认采用路径

文档首页、Quick Start 和新项目模板只推荐：

```text
安装 aheart-ui
→ 安装/引入 theme.css
→ 使用组件级 Resolver 自动解析
→ Resolver 注入对应组件样式
→ 需要时再手动使用 subpath
```

其他路径仅作为分层选项：

- 原型或内部应用：`/full + full.css`。
- 库作者或性能敏感项目：`/button` 等 subpath + 组件 CSS。
- 复杂组件作者：`/namespaced`。
- 不建议新用户直接组合多种方式。

M1 必须验证默认路径的安装、样式、类型、SSR/构建和升级；如果默认路径无法稳定工作，Resolver 不得提前宣传为完成。

## 7. 技术架构摘要

### 7.1 发布与构建

- 保留根 named exports 作为便利入口。
- 通过显式 subpath 提供确定性最小入口。
- `/full` 单独承载 Vue Plugin 和全量 CSS。
- 以 `theme.css + component.css + full.css` 分层交付 CSS。
- `sideEffects`、ESM/CJS/types、exports、files、main/module 和实际 tarball 由 release contract 检查。
- root、subpath、Resolver、full 均使用真实 consumer fixture 验证 tree-shaking。

### 7.2 复杂组件内核

逐步统一以下内部能力：

- `useControllableState`：controlled/uncontrolled 一致行为。
- `useOwnerDocument/useStableId`：iframe、SSR 和 hydration 安全。
- `Primitive/Slot`：仅用于需要替换元素和属性合并的复杂部件。
- `Presence`：等待真实 leave 动画/transition 完成后卸载，timer 仅作兜底。
- `FloatingRoot/Portal/DismissableLayer/LayerStack`：浮层、Escape、层级和容器统一。
- `FocusScope/RovingFocus/Collection`：Modal、Menu、Tabs、Tree、Combobox 共享焦点基础设施。
- 统一 `data-scope/data-part/data-state`，兼容现有 class API。

### 7.3 图标、Motion、AI 边界

- 基础组件只依赖少量语义图标适配层，完整图标通过单图标 subpath 引入。
- `@aheart-ui/icons` 必须可在干净公共 npm 环境安装，不要求 GitHub PAT；在此之前基础包保留 Lucide 兼容层。
- Motion 只提供 Presence/Fade/Slide/Scale/Collapse/reduced-motion 首发能力；基础组件不强依赖 Motion。
- AI 首发按三个产品场景组织：Chat、Agent、Workbench；普通 Sender/Bubble 不解析 DND，Workbench 才引入拖拽能力。

## 8. MVP 边界与暂缓项

### 8.1 AI MVP（M6）

必须有完整可运行 demo、数据模型、状态流转和无模型厂商依赖的接入示例：

- Chat：Bubble、Sender、Actions、Sources、Loading/Streaming 状态。
- Agent：ThoughtChain、Process、AgentStatus、Retry/Stop 状态。
- Workbench：ToolCall、Artifact、Approval、DND 排序。

暂缓：模型请求 SDK、鉴权、向量检索、厂商专属协议、复杂多代理编排。

### 8.2 Motion MVP（M5）

首发只包含 `Presence`、`Fade`、`Slide`、`Scale`、`Collapse`、`ReducedMotionProvider` 和基础 motion tokens。`Stagger`、`Typewriter`、`Marquee`、`AnimateNumber` 放入后续 Effects 版本。

### 8.3 Icons MVP（M2）

- 公共 npm 包、单图标 exports、类型和版本策略。
- `AIcon` adapter、语义 alias、ConfigProvider 全局覆盖。
- 基础组件常用图标视觉回归和 bundle 回归。
- 旧 `@wzfdhr/aheart-icon` 保留兼容周期；迁移和弃用通知单独发布。

## 9. 支持矩阵：M0 必须冻结的项目

下表不是默认承诺；M0 必须逐项决定 `支持 / 试验 / 不支持 / 延后`，并将结论同步到文档和 CI。

| 维度 | 待冻结问题 | 结果证据 |
|---|---|---|
| Vue | Vue 3 小版本范围 | package peer、consumer fixture |
| 构建 | Vite、Webpack、Rspack、Nuxt 支持级别 | 真实构建矩阵 |
| 模块 | ESM、CJS、types 是否都保证 | tarball + import/type 检查 |
| SSR | Nuxt/SSR hydration、稳定 ID、Teleport | SSR fixture |
| 浏览器 | Chrome、Firefox、Safari、Edge 与移动 H5 范围 | 浏览器矩阵 |
| 文档 | 在线示例是否代表发布 tarball | docs build + clean consumer |
| 样式 | theme/component/full、CSS 变量覆盖、暗色/RTL | 视觉与 CSS fixture |
| 可访问性 | axe、键盘、屏幕阅读器风险范围 | a11y 报告 |
| iframe/ShadowRoot | ownerDocument、Portal、dismiss 是否支持 | 专项 fixture；否则明确不支持 |
| 包发布 | 公共 registry、provenance、旧包兼容周期 | npm pack/release record |
| AI/DND | 公开发布窗口和 optional peer 边界 | package/install 矩阵 |

## 10. 成功指标与决策指标

M0 先采集基线，M1 冻结目标值。不得在没有基线时用漂亮的百分比替代事实。

| 指标 | 目标方向 | 验证方式 |
|---|---|---|
| 激活 | 新用户 10 分钟内完成首个正确样式组件 | clean consumer 计时记录 |
| 采用 | 三个试点至少各完成一条推荐路径 | 迁移记录与运行截图 |
| 迁移 | 不改业务逻辑，或有可执行迁移说明/codemod | diff 与用户验收 |
| 性能 | Button/Modal/Select 的 JS/CSS 相对当前基线下降 | bundle fixture 报告 |
| 可安装性 | 基础、Icons、AI、DND 在对应阶段可从干净环境安装 | clean install/tarball |
| 质量 | Beta/RC 不允许未关闭 P0/P1 | issue/release gate |
| 文档 | 推荐示例全部从产物验证 | docs CI |
| 复用 | 试点项目在下一个发布周期仍使用新入口 | follow-up 记录 |
| 支持成本 | 因入口、CSS、图标造成的阻塞问题下降 | issue 分类基线 |

## 11. 治理、责任与变更控制

| 责任域 | Owner | 决策权限 | 必须产出 |
|---|---|---|---|
| 产品定位/优先级 | 产品负责人 TBD | 目标用户、MVP、范围取舍 | PRD、指标、Go/No-Go 建议 |
| 技术架构/兼容 | 技术负责人 TBD | API、包边界、迁移与技术债 | RFC、兼容矩阵、风险清单 |
| 组件实现/测试 | 工程 Owner TBD | 阶段内代码和自动检查 | PR、测试、bundle 证据 |
| 设计/文档 | 设计/文档负责人 TBD | 视觉语言、示例、信息架构 | 文档、截图、迁移指南 |
| 发布/供应链 | 发布负责人 TBD | npm、provenance、tag、回滚 | pack/release record |
| 用户验收 | 用户代表 TBD | 真实项目是否接受阶段结果 | 三个消费项目验收记录 |

任何变更必须标记为 `产品范围`、`公开 API`、`运行时行为`、`构建/发布` 或 `文档` 之一。跨域变更必须更新相应文档和验收清单。维护中的 Table/D5 工作不得自动并入本项目阶段。

## 12. M0-M8 总体路线图与出口门禁

### 12.1 规划量级与并行关系

以下是单一主实施 owner 下的初始规划量级，不是日期承诺；M0 根据人员、历史回归成本和试点反馈重新估算：

| 里程碑 | 初始量级 | 串并行说明 |
|---|---:|---|
| M0 | 3–5 个工作日 | 必须最先完成 |
| M1 | 1–2 个迭代 | 主关键路径 |
| M2 | 1–2 个迭代 | M0 后可与 M1 并行，不阻塞 M3 fallback |
| M3 | 3 个切片，每片 1–2 个迭代 | 依赖 M1；按 3A/3B/3C 顺序 |
| M4 | 每组件族 1 个迭代 | 依赖 M3；每族独立发布/回滚 |
| M5 | 1–2 个迭代 | M3 Presence + M4 一个浮层族通过后可开始 |
| M6 | 2–4 个迭代 | 包装工作依赖 M1，Motion 集成依赖 M5 |
| M7 | 1–2 个最终化迭代 | 信息架构可与 M1 并行，稳定内容依赖前序 API |
| M8 | Beta 观察至少 14 天，再进入 RC；Stable 后 D+30/D+60/D+90 复盘 | 只消费证据，不新增范围；Stable 前建立复盘 Owner、口径和模板 |

同一文件、包、构建输出、端口或试点项目同一时间只有一个写入 owner。并行工作必须使用独立工作树和不重叠责任域。

### 12.2 路线图与出口门禁

| 里程碑 | 目标与交付 | 出口验收标准 | 不通过时的决策 |
|---|---|---|---|
| M0 产品与契约冻结 | 批准主方案/RFC/任务清单/验收标准；冻结用户、包边界、支持矩阵、指标、manifest、兼容与责任 | 四份文档批准；三项目可运行基线；npm/仓库事实核对；无未决 P0 范围冲突 | 留在 M0，禁止开发扩展范围 |
| M1 v1.1 真实按需 | Button/Modal/Select subpath、`/full`、theme/component/full CSS、Resolver Preview、consumer fixtures、release contract | ESM/CJS/types/CSS 可安装；无关组件不进入 fixture；旧根行为兼容；三个试点分别完成推荐或兼容路径验证 | 仅发布兼容修复，暂缓 v2 |
| M2 Icons 公共供应链 | `@aheart-ui/icons` 公共 npm、单图标 exports、AIcon adapter、alias、迁移 | 无 PAT 干净安装；单图标不带整库；视觉/许可证/版本/回滚方案通过 | 保持 Lucide 兼容层，不阻塞其他 M1 修复 |
| M3 Primitive+Combobox 旗舰试点 | ControllableState、ownerDocument、Presence、Primitive/Slot、Focus、Layer、Collection、namespaced Combobox | controlled/uncontrolled、SSR、iframe/Teleport 范围、键盘、ARIA、exit 卸载、bundle、视觉全部通过 | 不迁移其他复杂组件，修复试点 |
| M4 浮层/Dialog 内核迁移 | 按 Popover/Tooltip/Dropdown→Modal/Drawer→Select 等族逐步迁移 | 每族独立 API/浏览器/视觉回归；topmost Escape、焦点恢复、容器和动画通过 | 停止在当前族，保留旧实现 |
| M5 Motion Preview | Presence 预设、tokens、reduced motion、基础组件示例 | 移除 Motion 不影响交互；关闭/进入动画真实完成；性能和可访问性通过 | Preview 不升 Stable，基础包不增加依赖 |
| M6 AI/DND 产品化 | Chat/Agent/Workbench demo、subpath/CSS、Workbench DND 边界、公共发布准备 | Sender/Bubble 不引入 DND；Workbench 交互/a11y/包验证；三个试点至少一个 AI 真实场景 | 保留仓库预览，不承诺公共稳定包 |
| M7 文档/Resolver/生态 | 默认 Resolver、manifest 生成、文档 IA、迁移指南、示例产物校验 | 首页只有一条推荐路径；示例从 tarball 验证；Resolver/exports/docs 无漂移 | 延后生态入口，不扩大 API |
| M8 v2 决策、Beta/RC/Stable | prerelease、反馈、回滚演练、Beta/RC/Stable 发布材料和 30/60/90 天观测计划 | 无 P0/P1；三试点持续使用；指标达到 M0 冻结目标；CI、pack、文档、浏览器、用户验收齐全；复盘 Owner/数据源/模板已建立 | 不发 v2，继续 v1.x 或回到具体阻塞阶段 |

## 13. 发布策略与版本承诺

### 13.1 版本轨道

```text
v1.0.x  当前稳定基础包
v1.1.x  additive 按需入口、CSS 和契约基础设施
v1.2.x  Icons 接入准备/兼容适配（不强制切换时可独立发布）
v1.5.x  Combobox/浮层/Motion Preview 的可选能力
v2.0.0  只有在 M8 Go 后发布的稳定产品线
```

AI/DND 的公共 npm 发布时间不由文档预先假定；必须完成各自 M6 证据和发布授权。未发布不等于不可开发，已开发不等于可对外承诺。

### 13.2 兼容原则

- v1.x 不删除既有根入口和既有 class/API；新入口以 additive 为主。
- 弃用必须有文档、控制台提示（如适用）、迁移例子和至少一个兼容周期。
- v2 破坏性变更必须列出受影响 API、自动化迁移能力、回滚版本和用户验收记录。
- npm 发布、GitHub tag、provenance、Pages 部署和用户接受是四个不同状态，不得混报为“已完成”。

## 14. 最终 Go/No-Go

### 14.1 现在的决定

- **Go**：进入 M0，整理 PRD、技术 RFC、任务/验收清单并建立三个真实消费项目基线。
- **No-Go**：立即进行完整 v2 开发、一次性迁移全部组件、默认切换图标、承诺 AI/DND 已公共发布。

### 14.2 v2 Beta 的 Go 条件

以下条件必须全部满足：

1. M0-M7 出口门禁均有可审计证据。
2. 三个消费项目至少完成推荐路径验证，其中 `ai-review-gate`、`muxu-todo` 和 `clean consumer` 的结果分别记录。
3. 公共 npm、Icons、AI/DND 的真实可安装状态和许可证/供应链结论明确。
4. P0 清零；Beta 发布范围内的 P1 清零，范围外 P1 必须有 owner、截止日期且不影响推荐路径。RC 和 Stable 前所有 P1 清零。
5. 文档、Resolver、exports、样式和包产物由同一 manifest 验证。
6. 产品负责人、技术负责人、发布负责人和用户代表分别给出通过意见。

### 14.3 Stable 的 No-Go 条件

任一条件存在即不得发布 v2 Stable：

- 只有源码/单测通过，没有真实 tarball、浏览器或用户验收。
- 默认采用路径仍需用户手工猜测 CSS 或入口。
- `@aheart-ui/icons` 仍依赖私有凭据或许可证未确认。
- AI/DND 只能在仓库 workspace 使用，不能在干净环境安装。
- root/subpath/full/Resolver 行为不一致，或存在未记录的破坏性 API。
- 真实试点没有继续使用意愿，或性能/包体没有达到 M0 冻结目标。

## 15. 参考文档与使用边界

- [Aheart UI v2 架构与产品体系优化设计](./2026-09-08-aheart-ui-v2-architecture-optimization-design.md)：技术 RFC，包含实现细节、风险和既有架构判断。
- [Aheart UI v2 整体任务流程清单](./2026-09-08-aheart-ui-v2-task-flow-checklist.md)：任务编号、依赖、Owner、输出物、降级和证据路径。
- [Aheart UI v2 阶段验收标准](./2026-09-08-aheart-ui-v2-phase-acceptance-criteria.md)：公共门禁、M0-M8 Pass/Conditional/Fail、发布和回滚规则。

本方案作为四份文档的总索引和决策层。产品目标与技术实现冲突时，先记录冲突，再由产品/技术 Owner 在对应阶段门禁前决定；不得通过悄悄扩大范围解决。
