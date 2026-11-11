# M3 AI/DND 与文档候选验证

基于 M2 合并提交 `9889ce995e647ee6b6868bd826a973be074691b0`，分支 `codex/m3-ai-dnd-docs`。场景入口、显式样式和回退路径见 [M3 按需迁移](../../../docs/guide/m3-migration.md)。

| 交付 | 本地验证 |
| --- | --- |
| Chat、Agent、Workbench 和 DND Sortable 公共入口 | 在仓库外安装三个实际 tarball，核对 22 个组件的 ESM/CJS 导出和 CSS 路径。Chat、Agent、Sender、Bubble 的模块图无 DND 或 Workbench。Workbench 只通过 DND Sortable 子入口加载拖放能力。 |
| 独立 CSS 和原入口兼容 | 验证 JS-only 构建无 CSS 输出。原根入口与全量样式保留，D8 旧入口消费、M1 包体和模块图回归通过。为了兼容根入口的 Workbench，AI v1 继续声明 DND 安装依赖。 |
| Resolver 和迁移文档 | 用实际 Vite 插件构建 Vue SFC，验证 Button 和 AISender 的自动导入及显式 CSS。文档入口测试校验包导出、导航、迁移锚点和质量矩阵。 |
| 场景操作 | 三个 AI 子入口均通过确定性 SSR。Chat 键盘发送及流式回复、Agent 必填校验及修正提交在独立消费端的 Chromium 桌面与窄视口通过。 |
| 试点 | `clean-consumer` 和 `ai-review-gate` 安装候选 tarball，在 Chromium、Firefox 和 WebKit 的宽窄视口均通过。Workbench 试点覆盖审批、排序和 SSR 水合。 |

## 证据

- 三包 1,778 项组件单测、类型检查和生产文档构建通过。全量脚本套件通过 253 项，补充质量矩阵断言后定向复跑 27 项通过。生产文档定向浏览器回归 65 项通过，7 项按既有项目条件跳过。移动覆盖使用模拟设备和窄视口。
- 三包打包契约通过。连续构建比对了 1,398 个生成文件。Vue 3.5.38 和 3.5.44 的独立 tarball 消费端均通过 `skipLibCheck: false`，每次检查 542 份声明文件。
- 本地结果在工作树的 `.pilot-runs/`。`m3-acceptance/results.json` 记录模块图、样式、SSR 和场景操作，`m3-strict-final/`、`m3-legacy/` 和 `m3-m1-regression/` 记录兼容回归，`m3-pilots-final/`、`m3-pilots-firefox/` 和 `m3-pilots-webkit/` 记录试点操作。
- 使用 `pnpm release:pack --pack-destination test-results/release-tarballs` 打包，并用 `pnpm exec playwright install chromium` 安装浏览器后，可用 `pnpm check:m3-consumer` 复跑。

## 阶段状态

| 门禁 | 状态 | 依据 |
| --- | --- | --- |
| G1 设计 | 范围已确认 | [A1 路线图](../../../docs/superpowers/specs/2026-11-05-aheart-ui-v2-solo-scope-amendment.md) |
| G2 代码 | 本地通过 | `codex/m3-ai-dnd-docs` 的工作树及上述实现 |
| G3 自动检查 | 本地通过 | 组件单测、定向脚本、类型检查、生产文档及浏览器回归 |
| G4 视觉 | 待人工验收 | 本地预览和试点截图已生成 |
| G5 包 | 本地通过 | `aheart-ui@1.2.0`、`@aheart-ui/ai@1.1.0`、`@aheart-ui/dnd@1.1.0` 的候选 tarball |
| G6 PR 审查合并 | 待评审 | 本地候选 |
| G7 主线 CI/Pages | 待合并后验证 | M3 消费门禁已接入工作流 |
| G8 用户验收 | 待验收 | 已准备文档示例和试点 |

Local、npm pack 已通过。PR、Merged、Main CI、Pages 和 UA 待完成。本次为本地候选，npm published 待发布决策。阶段结论待用户验收。

## 提交前自审

- 对照 M2 合并提交，AI/DND 原根入口的 ESM/CJS 输出及全量 CSS 逐字节一致。重新构建的三个候选 tarball 与首轮候选逐字节一致。
- 补齐公开导出的存在性和身份断言，覆盖根插件全部组件的 ESM/CJS 注册、场景辅助函数、`/full` 和深路径全量样式。D8 旧入口消费回归通过。将候选 AI/DND 包与 npm 上的基础包 `aheart-ui@1.1.0` 组合安装后，插件注册、Workbench 和 AIForm 的 SSR 通过。
- 扩展独立安装探针至 13 个构建。Draggable、DropZone、DragOverlay 及 Sortable 各自验证模块图和样式。用真实 Vite Resolver 验证 Workbench 自动引入 Sortable 样式。
- 严格消费端增加 Chat、Agent、Workbench、Sortable 与 Resolver 的公开类型断言。PR 的 consumer-evidence artifact 同时保留候选 tarball，便于在独立应用中验收。
- 提交前类型检查、生产文档构建、27 项定向脚本及 `git diff --check` 通过。严格消费端复验覆盖 Vue 3.5.38 和 3.5.44。AI/DND、首页和文档导航浏览器复验 65 项通过，7 项按原有条件跳过。

## PR #44 视觉回归修复

- [首轮 PR CI](https://github.com/Labradorca/aheart-ui/actions/runs/42971165437) 的全量浏览器任务通过 793 项，Splitter 桌面截图一项失败。M2 与 M3 在同一 Chromium 的局部对照中，面板数值、分隔线位置和截图尺寸一致。变化来自叠在长截图顶部的 VitePress 固定导航。
- Splitter 截图在捕获时隐藏文档固定导航，比较阈值保持原值。按实际浏览器捕获重采 macOS 三张和 [Linux 三张](https://github.com/Labradorca/aheart-ui/actions/runs/42975622634) 基线。逐像素比对确认六张截图的差异均位于顶部 66 像素内，其余像素一致。
- [第二轮 PR CI](https://github.com/Labradorca/aheart-ui/actions/runs/42976065403) 暴露 DND 全包分支覆盖率 79.84% 与桌面 WebKit 启动预览时的 pnpm 下载超时。DND 测试改经新子入口运行并补充根插件、`useSortable` 拖放及卸载回归。本地 82 项通过，分支覆盖率 81.08%，沿用 80% 阈值。Playwright 直接运行已安装的 VitePress，在禁止 Corepack 联网时复跑桌面 WebKit QG5，12 项通过，1 项按原条件跳过。
