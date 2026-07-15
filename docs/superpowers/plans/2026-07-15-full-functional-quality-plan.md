# Aheart UI 全量功能质量提升实施计划

> **执行要求：** 后续实施必须按阶段使用 `superpowers:executing-plans`，每个阶段先补失败测试，再修复实现，并在合并前依次执行开发经理复审、设计审核、测试经理测试和产品经理最终审核四角色关卡。

**目标：** 把当前“自动化大部分通过”提升为“发布可重复、关键用户任务真实可完成、跨浏览器与消费端可验证”的组件库质量体系。

**范围：** `aheart-ui`、`@aheart-ui/dnd`、`@aheart-ui/ai`、中文 VitePress 文档站及发布产物。英文站 M12 继续暂停。

**技术栈：** Vue 3、TypeScript、Vitest、Vue Test Utils、Playwright、VitePress、pnpm workspace、GitHub Actions。

---

## 1. 本轮审计结论

### 1.1 发布判定

**结论：有条件不通过，暂不建议发布新版本。**

当前没有发现 P0 级数据损坏或安全问题，已有核心交互回归大部分可通过。但构建后生成物检查在本地和远端持续失败，且 DnD、Splitter、Upload 等高风险能力尚未经过真实浏览器核心任务验证。因此“源码可测试”不等于“包可稳定发布”。

### 1.2 2026-07-15 实测基线

| 门禁 | 结果 | 证据 |
| --- | --- | --- |
| 单元/脚本测试 | 通过 | 985 tests：components 911、dnd 8、ai 54、scripts 12 |
| TypeScript | 通过 | workspace typecheck exit 0 |
| 构建 | 通过 | 三个包构建 exit 0 |
| 中文文档构建 | 通过 | VitePress build exit 0 |
| 发布包检查 | 通过 | `release:pack` exit 0 |
| Playwright | 部分通过 | 130 passed、64 skipped；仅 Chromium 桌面/移动项目 |
| 生成物一致性 | **失败** | 构建后 12 个 Input/InputNumber/Modal 声明文件漂移 |
| Git 差异格式 | 通过 | `git diff --check` exit 0 |
| 远端 CI | **失败** | 当前 `master` 与最近 5 次运行均停在 Check Generated Output |

远端失败证据：[GitHub Actions run 29394559902](https://github.com/wzfdhr/aheart-ui/actions/runs/29394559902)。

### 1.3 证据限制

- 已通过 Playwright 在 `1440x900` 与移动设备项目执行功能和几何断言。
- 本轮内置可视化浏览器连接异常，未获得新的人工截图证据；因此不能把本轮称为完整视觉回归验收。
- 视觉基线、跨浏览器、真实触屏、屏幕阅读器和消费端安装仍属于待补验证。

---

## 2. 风险分级与主要发现

### P0：0 项

未发现会造成数据不可逆损坏、权限绕过、敏感信息泄漏或全站不可用的问题。

### P1：2 项发布阻断风险

#### P1-1 构建不可重复，主分支持续红灯

- CI 先执行 `pnpm build`，再执行 `pnpm check:generated`，见 `.github/workflows/ci.yml:47-51`。
- 检查脚本会对 `es/lib` 的任何差异直接失败，见 `scripts/check-generated.mjs:19-24`。
- 当前构建会改写 Input、InputNumber、Modal 的 12 个 `.d.ts` 文件；工作区初始干净也可稳定复现。
- `release:check` 使用同一顺序，因此本地发布门禁同样不可通过。

**产品影响：** 无法建立可信的可发布主分支，任何后续功能都无法区分“新回归”与“既有门禁噪声”。

#### P1-2 DnD 与 Splitter 的定义性交互未做真实浏览器验证

- DnD 单测 mock 了底层 adapter，见 `packages/dnd/src/__tests__/dnd.test.ts:8-20`。
- Splitter 的 iframe shield 只在 jsdom 中验证 DOM 存在，见 `packages/components/src/splitter/__tests__/splitter.test.ts:162-174`。
- 当前 E2E 没有真实指针拖动、触屏拖动、跨列表、嵌套滚动、自动滚动或 iframe 穿越用例。

**产品影响：** 两个组件最重要的用户任务没有发布级证据，尤其容易在 Safari、触屏和 iframe 页面失效。

### P2：8 项主要质量缺口

1. **浏览器矩阵不足：** `playwright.config.ts:10-12` 仅 Chromium，缺 Firefox 与 WebKit。
2. **无视觉回归：** 没有 `toHaveScreenshot` 基线，无法稳定发现对齐、溢出、层级和暗色主题回归。
3. **无系统无障碍扫描：** 没有 axe；现有测试只覆盖少量焦点、对比度与尺寸断言。
4. **发布包没有真实消费端安装：** `scripts/package-entrypoints.test.mjs:8-15` 直接导入 workspace 产物，未安装 tarball 到干净项目。
5. **SSR 覆盖过窄：** 仅日期时间和 ConfigProvider 有代表性 SSR；浮层、服务组件、DnD、AI 包缺 SSR smoke。
6. **Upload 无真实文件流程：** 浏览器层没有 `setInputFiles`、进度、失败、重试、移除和限量验证。
7. **ConfigProvider 无产品级 E2E：** 全局尺寸、禁用、locale、嵌套覆盖和主题只在单测或静态示例验证。
8. **E2E 运行开发服务器：** `playwright.config.ts:14-18` 使用 docs dev，未覆盖生产构建与 preview 的真实资源行为。

### P3：持续改进项

- CI 为单一串行 job，失败后缺 Playwright report、trace、截图、coverage 和生成物 diff artifact。
- 缺少覆盖全部 48 个 Ready 组件的机器可读质量矩阵与责任人。
- 中文文档存在少量英文示例文案，影响产品一致性但不阻断功能。
- 64 个 skipped 主要来自项目条件分支，应按“有意跳过/暂未支持/环境不适用”分类统计。

---

## 3. 产品任务覆盖现状

### 已有可信自动化覆盖

- **发现与浏览：** 48 个 Ready 中文路由可加载，运行时异常会失败。
- **日期时间：** 单值、周/月/季度/年、多选、预设、日期时间确认、范围、12 小时制和移动端边界。
- **表单：** 同步/异步校验、错误摘要、首错聚焦、提交、重置、AIForm 分组与提交。
- **导航与浮层：** Menu、Steps、Dropdown、Modal、Popconfirm 的代表性交互、定位和焦点恢复。
- **数据任务：** Table 排序/选择/展开/分页，Pagination 页大小与快速跳转。
- **AI：** 对话建议、会话切换、流式停止、失败重试、编辑重发、复制、审批、产物预览和移动端 Drawer。
- **基础输入：** InputNumber、Textarea 字数、Select、Checkbox、Switch、Cascader、TreeSelect 的主要路径。

### 尚未达到产品发布证据标准

- DnD 指针/触屏排序、跨容器、取消回滚、自动滚动、嵌套滚动和卸载清理。
- Splitter 实际尺寸变化、lazy、min/max、外部数字输入、iframe shield 和窗口失焦清理。
- Upload 真实文件选择、进度、成功/失败、重试、移除、手动上传和最大数量。
- ConfigProvider 对真实子树的 locale、size、disabled、theme 与嵌套局部覆盖。
- Tree 的浏览器键盘模型、受控 keys、焦点恢复和节点禁用组合。
- Message 的堆叠、更新、销毁与全局配置；Modal 的异步确认 loading。
- 三个 tarball 在干净 Vue 消费项目中的 ESM、CJS、types、CSS、`app.use` 和 SSR。

---

## 4. 测试分层与组件风险矩阵

### 4.1 风险层级

| 层级 | 组件域 | 必须具备的证据 |
| --- | --- | --- |
| R1 关键 | Form、Select、Date/Time、Upload、Table、Tree 系列、所有浮层、Splitter、DnD、AI 套件 | unit + browser task + keyboard + a11y + mobile + SSR/cleanup + visual |
| R2 重要 | Button、Input、InputNumber、Checkbox、Radio、Switch、Menu、Tabs、Steps、Pagination、ConfigProvider | unit + browser task + keyboard + responsive + representative visual |
| R3 稳定展示 | Typography、Icon、Space、Flex、Grid、Divider、Breadcrumb、Descriptions、Card、Tag、Badge、Empty、Spin、Skeleton、Alert | unit + route smoke + a11y semantics + representative visual |

### 4.2 八个能力域的验收责任

1. **设计基础：** ConfigProvider、Typography、Icon。关注主题传播、语义、SSR 和图标可识别性。
2. **通用构建：** Button、Space、Flex、Grid、Divider。关注响应式、间距稳定和操作语义。
3. **导航与流程：** Menu、Tabs、Breadcrumb、Steps、Dropdown。关注路径完成率、键盘与焦点。
4. **表单与选择：** 13 个数据录入组件。关注受控语义、校验、禁用、清除和异常输入。
5. **数据与状态：** Table、Pagination、Tree 等 11 个组件。关注大数据、空态、loading 和移动端可读性。
6. **浮层与反馈：** Message、Modal、Drawer、Tooltip、Popover、Popconfirm。关注定位、层级、关闭与焦点恢复。
7. **高级交互：** Splitter、DnD。关注真实指针、触屏、iframe、滚动和可替代键盘路径。
8. **智能产品：** AIChatPanel、AIForm、AIAgentWorkbench。关注流式状态、错误恢复、审批和业务边界。

### 4.3 测试数据规则

- 固定 `TZ=Asia/Shanghai`，日期用例以 `2026-07` 为基准，禁止依赖运行当天。
- 网络、AI 流、上传请求使用可控 fake transport/request，不依赖外部服务。
- 所有截图关闭光标闪烁、随机 ID、系统时间和不稳定动画。
- 每个受控组件必须包含“父组件接受更新”和“父组件拒绝更新”两个用例。
- 每个浮层必须覆盖打开、关闭中重开、Escape、外部点击、滚动更新、焦点恢复和 reduced motion。

---

## 5. 分阶段实施计划

## QG0：恢复发布门禁与确定性构建（1-2 人日）

**目标：** 同一干净提交连续构建两次结果完全一致，主分 CI 恢复绿色。

### 实施任务

- [ ] 新增 `scripts/check-build-determinism.mjs`：清理并构建两次，对六个生成目录计算文件清单与 SHA-256。
- [ ] 新增脚本单测，验证内容变化、新文件、文件删除和仅顺序变化都能输出可读 diff。
- [ ] 先确认漂移属于“未提交稳定输出”还是“每次构建来回变化”。
- [ ] 若第二次构建稳定，提交唯一规范化声明产物；若仍振荡，锁定/调整 `vue-tsc`、`vite-plugin-dts` 或声明聚合顺序。
- [ ] 更新 `package.json`，使 `release:check` 在任何后续门禁前先执行 determinism check。
- [ ] CI 失败时上传声明 diff artifact，不让开发者靠本地猜测。

### 主要文件

- `scripts/check-generated.mjs`
- `scripts/check-generated.test.mjs`
- `scripts/check-build-determinism.mjs`
- `package.json`
- `.github/workflows/ci.yml`
- 稳定后对应的 `packages/*/{es,lib}/**/*.d.ts`

### 退出条件

- [ ] 本地从干净工作区连续运行两次 `pnpm build && pnpm check:generated` 均通过。
- [ ] GitHub Actions 当前提交全绿。
- [ ] 构建结束后 `git status --short` 为空。

## QG1：建立机器可读质量矩阵（1-2 人日）

**目标：** 每个 Ready 组件都有风险级别、测试责任、产品任务和发布证据，新增组件不能漏登记。

### 实施任务

- [ ] 新增 `quality/component-test-matrix.json`，记录 `component`、`package`、`risk`、`unit`、`e2e`、`ssr`、`a11y`、`visual`、`owner`。
- [ ] 新增 `scripts/check-test-matrix.mjs`，从 `components.ts` 读取 48 个 Ready key，校验不重不漏。
- [ ] 新增 `docs/quality/component-test-matrix.md`，供测试经理和产品经理按能力域查看。
- [ ] 在 PR 模板中加入“影响的产品任务”和“矩阵更新”复选项。

### 退出条件

- [ ] 每个 Ready 组件恰好一条记录。
- [ ] 每个 R1 组件至少绑定一个 E2E spec 和一个产品验收任务。
- [ ] CI 对矩阵缺失、过期 spec 路径和重复组件直接失败。

## QG2：DnD 与 Splitter 真实交互专项（4-6 人日）

**目标：** 用真实浏览器证明高级交互在桌面、移动、滚动和 iframe 中可完成。

### 实施任务

- [ ] 新增 `e2e/dnd-splitter.spec.ts`，禁止 mock 底层 adapter。
- [ ] DnD 覆盖同列表排序、跨列表、空列表、拖动柄、禁用、取消回滚和焦点恢复。
- [ ] 覆盖嵌套滚动、边缘自动滚动、列表卸载、路由切换与数据回滚。
- [ ] 增加键盘移动菜单、方向键和 live region 文案断言。
- [ ] 在 WebKit 移动项目覆盖真实 touch/pointer 序列。
- [ ] Splitter 覆盖横/纵向、多面板、min/max、lazy、外部 InputNumber 和 ResizeObserver。
- [ ] 新增含 iframe 的可见中文示例，拖动穿过 iframe 后继续调整并正确清理 shield。
- [ ] 覆盖 `pointercancel`、窗口失焦、组件卸载、关闭页面后的光标和 `user-select` 恢复。

### 退出条件

- [ ] 指针、触屏、键盘三种路径均能完成同一排序/调宽任务。
- [ ] iframe、嵌套滚动和卸载场景无残留遮罩、监听器或错误。
- [ ] 桌面 Chromium/Firefox/WebKit 与移动 WebKit 全部通过。

## QG3：高风险缺口补测（4-5 人日）

**目标：** 补齐 Upload、ConfigProvider、Tree 和服务型反馈组件的真实产品流程。

### 实施任务

- [ ] `e2e/upload.spec.ts`：`setInputFiles`、beforeUpload、进度、成功、失败、重试、移除、手动上传、disabled、maxCount。
- [ ] `e2e/config-provider.spec.ts`：中文/英文运行时 locale、size、disabled、theme、嵌套深度覆盖和 SSR hydration。
- [ ] `e2e/tree.spec.ts`：展开、选择、多选、勾选、禁用、受控 keys、折叠后焦点恢复和完整键盘导航。
- [ ] `e2e/feedback-services.spec.ts`：Message 堆叠/更新/销毁/全局配置，Modal 异步确认 loading 与异常恢复。
- [ ] 为关键流程增加稳定的语义 locator；仅在无合适角色/名称时使用 `data-testid`。

### 退出条件

- [ ] 每个任务从用户入口开始，到可观察结果结束，不直接调用组件内部方法作弊。
- [ ] 成功、失败、取消、禁用和父组件拒绝更新均有至少一个反例。
- [ ] 浏览器控制台 error、未处理 Promise 和 Vue warning 均为零。

## QG4：无障碍与视觉回归（3-5 人日）

**目标：** 把“看起来差不多”转成可重复的视觉与无障碍门禁。

### 实施任务

- [ ] 引入 `@axe-core/playwright`，对八个能力域的代表性页面和展开态执行扫描。
- [ ] critical/serious 违规为零；moderate 必须有 issue、负责人和豁免期限。
- [ ] 建立稳定截图：桌面 `1440x900`、移动 `390x844`、暗色主题、reduced motion。
- [ ] 重点截图 Input/Select/DateTime/Table/Menu/Modal/Splitter/AI Workbench 的默认、错误、禁用和展开状态。
- [ ] 增加 200% zoom、键盘 only、焦点可见、触控目标与中文长文本检查。
- [ ] 产品经理逐项检查任务层级、中文文案、空态、错误恢复；设计审核对齐、间距、层级、对比度和动效。

### 退出条件

- [ ] axe critical/serious = 0。
- [ ] 无未解释截图差异；基线更新必须由设计审核人确认。
- [ ] R1 组件均可只用键盘完成主任务。

## QG5：跨浏览器与生产站验收（3-4 人日）

**目标：** 验证生产构建，而不是只验证 Vite 开发服务器和 Chromium。

### 实施任务

- [ ] Playwright 增加 Desktop Firefox、Desktop WebKit、Mobile Safari/WebKit 项目。
- [ ] CI E2E 改为 `docs:build` 后启动 `docs:preview`；本地保留单独 dev 配置用于快速调试。
- [ ] 按 browser/project 分片并设置合理重试，禁止用重试掩盖稳定复现问题。
- [ ] 归档 HTML report、trace、video（仅失败）、截图和控制台日志。
- [ ] 对 Floating UI、Pointer Events、ResizeObserver、Teleport 和 sticky/overflow 做浏览器专项。

### 退出条件

- [ ] 三大桌面引擎与移动 WebKit 的 R1 冒烟全部通过。
- [ ] 生产 preview 无资源 404、hydration warning 或路由失效。
- [ ] flaky rate 连续 10 次主分运行低于 1%。

## QG6：消费端、发布包与 SSR 契约（3-5 人日）

**目标：** 证明用户安装 npm 包后可用，而不仅是仓库内部可导入。

### 实施任务

- [ ] 新增 `scripts/release-consumer.mjs`，将三个 tarball 安装到临时 Vue 3 + TypeScript 项目。
- [ ] 验证 ESM、CJS、types、CSS 入口、按需导入、根插件安装和单组件 `app.use`。
- [ ] 编译一个最小 Vite 消费应用，并执行 `renderToString` SSR smoke。
- [ ] 覆盖 Overlay、Message、Drawer、Modal、DnD、AIChatPanel、AIForm、Workbench 的无 DOM 导入安全性。
- [ ] 校验 `exports`、`files`、peerDependencies、sideEffects 和 tarball 文件白名单。
- [ ] 在 Node 20 与当前最低支持 Node 版本运行消费端契约。

### 退出条件

- [ ] 三个 tarball 在无 workspace 软链环境完成 install、typecheck、build 和 SSR。
- [ ] 不允许从源码路径或未声明深层路径意外导入。
- [ ] 发布包无 docs、test、临时文件和未引用大体积依赖。

## QG7：覆盖率、CI 可观测性与缺陷治理（2-3 人日）

**目标：** 让失败可定位、覆盖率可持续提升、缺陷状态可追踪。

### 实施任务

- [ ] 引入 `@vitest/coverage-v8`，先记录基线，再按包设置不低于基线的阈值。
- [ ] R1 核心状态机要求 branch coverage >= 80%；展示组件不以行数制造虚假覆盖。
- [ ] CI 拆分 lint/typecheck、unit、build/generated、docs、browser、release-consumer jobs。
- [ ] 上传 coverage、声明 diff、Playwright report 和失败 trace。
- [ ] 建立 flaky quarantine 规则：只能带 issue、owner、到期日期，禁止无期限 `skip`。
- [ ] 周报指标：P0/P1/P2、逃逸缺陷、任务通过率、flaky rate、MTTR、R1 覆盖完整度。

### 退出条件

- [ ] 所有 CI 失败都有可下载证据。
- [ ] 新增代码不得降低对应包的覆盖基线。
- [ ] skipped 用例 100% 有明确原因分类。

## QG8：全量产品验收与发布决策（2-3 人日）

**目标：** 从用户任务而非组件 class 判断是否可以发布。

### 产品经理验收脚本

- [ ] 新用户能在中文站按能力域找到组件，并从示例完成一次真实操作。
- [ ] 表单用户能录入、校验、修正、提交和恢复失败，不丢失输入。
- [ ] 数据用户能排序、筛选、选择、分页、展开，并在移动端读到关键信息。
- [ ] 管理员能通过键盘完成导航、弹层确认和高风险操作取消。
- [ ] 工作台用户能拖动调宽、排序任务，也能不用拖拽完成同一任务。
- [ ] AI 用户能开始会话、停止流、重试、审批、查看来源和产物，并理解错误状态。
- [ ] 上传用户能识别进度、失败原因、重试和移除结果。
- [ ] locale、主题、尺寸和 disabled 能在真实组件树中一致生效。

### 最终发布条件

- [ ] P0 = 0、P1 = 0。
- [ ] P2 = 0；确需延期必须由测试经理和产品经理共同签署风险豁免与截止日期。
- [ ] 所有质量门禁全绿，构建后工作区干净。
- [ ] R1 产品任务在桌面 Chromium/Firefox/WebKit 与移动 WebKit 通过。
- [ ] 设计审核、开发经理审核、测试经理审核、产品经理审核全部通过。

---

## 6. 每阶段标准执行顺序

1. 测试经理写出风险、前置条件、主路径、反例和退出条件。
2. 开发先提交失败测试，证明当前实现确实缺少该能力或保护。
3. 实现最小修复，并补 SSR、cleanup、controlled rejection 等边界。
4. 开发经理审核类型边界、共享逻辑、性能、资源清理和包产物。
5. 设计审核视觉层级、对齐、响应式、动效和 reduced motion。
6. 测试经理执行自动化、探索性测试、跨浏览器与回归抽样。
7. 产品经理按用户任务验收成功、失败、取消和恢复路径。
8. 只有 `P1=0、P2=0` 且门禁全绿后才允许合并。

统一命令：

```bash
CI=true TZ=Asia/Shanghai corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
corepack pnpm check:generated
corepack pnpm docs:build
corepack pnpm release:pack
corepack pnpm test:e2e
git diff --check
git status --short
```

---

## 7. 排期与资源建议

| 阶段 | 预计人日 | 建议负责人 | 是否阻断后续 |
| --- | ---: | --- | --- |
| QG0 发布门禁 | 1-2 | 资深前端 + 测试 | 是 |
| QG1 质量矩阵 | 1-2 | 测试经理 | 是，作为治理基线 |
| QG2 DnD/Splitter | 4-6 | 前端 + 自动化测试 | 是，阻断高级交互发布 |
| QG3 高风险缺口 | 4-5 | 前端 + 自动化测试 | 是 |
| QG4 a11y/视觉 | 3-5 | 测试 + 设计 | 是，阻断正式发布 |
| QG5 跨浏览器 | 3-4 | 自动化测试 | 是 |
| QG6 消费端/SSR | 3-5 | 前端工程化 | 是 |
| QG7 可观测性 | 2-3 | 测试平台/前端 | 否，可与 QG3-QG6 并行 |
| QG8 产品验收 | 2-3 | 产品 + 测试 + 设计 | 是 |

**总计：23-35 人日。** 单人连续实施约 5-7 周；一名前端加一名测试并行约 3-4 周。QG0 必须最先完成，QG2/QG3 可在 QG1 后并行，QG4-QG6 在功能缺口稳定后执行。

---

## 8. 默认决策

- 当前优先级为 QG0 → QG1 → QG2/QG3 → QG4/QG5/QG6 → QG7 → QG8。
- 本计划默认不扩张组件公开 API；发现真实产品缺陷时另立 spec 决策兼容方案。
- 英文站继续暂停，不把英文路由和翻译纳入本轮发布门禁。
- AI 包继续保持模型无关，不接入 API Key、真实模型 SDK 或后端持久化。
- 自动化通过不是单独发布依据；必须同时具备真实用户任务、产物消费端和跨浏览器证据。
