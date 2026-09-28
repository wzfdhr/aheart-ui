# Aheart UI 现有版本本地收尾计划（v2 暂停）

> 状态：L0–L3 已完成；L4 外部验收仍待办。启动基线是 2026-09-28 核对的 `master` `17b3494`；本次合并后的 `master` 为 `d5145c3af4fdfb157fe1a557c392c15321ae8a1f`。收尾 PR：[#32](https://github.com/wzfdhr/aheart-ui/pull/32)。
>
> 范围：现有 `aheart-ui`、`@aheart-ui/dnd`、`@aheart-ui/ai`、中文文档与发布门禁。v2 的 M0–M8、Combobox、独立 Icons/Motion 包和 Resolver 均不在本轮开发范围。
>
> “上传”指将通过本地验收的代码和证据提交、推送并合入 GitHub `master`；npm 正式发布另设发布门禁。任何阶段不得以 CI、Pages 或 tarball 单项通过代替本地完整验收。

## 目标与完成定义

1. 保全旧本地工作区，再以最新 `origin/master` 建立干净的收尾基线。
2. 只修复经过复现的现有版本缺口；同步源码、测试、文档和生成的 `es/lib` 产物。
3. 在本地通过单测、类型、构建确定性、中文文档、发布包、真实浏览器任务与人工操作验收。
4. 上传同一验收 SHA，核对 PR、主分 CI 与 Pages。完成现有版本发布门禁后，另行决定 v2 开工。

## L0：保全与基线对齐（第一优先级）

**任务**

- [x] 记录 `HEAD`、`origin/master`、Node/pnpm 版本、`git status` 与真实内容差异；把外接卷造成的 `100644 -> 100755` 和 `._` 文件单独列为文件系统噪声。（2026-09-28；旧工作树 `e719e8d`，最新主线 `17b3494`；Node `v24.17.0`、pnpm `9.15.4`。）
- [x] 备份当前两处已跟踪内容改动：Table SSR 测试和 `pnpm-workspace.yaml`；备份未跟踪的 Logo 素材与 v2 规划稿，不删除、不混入本轮发布提交。（原目录保留；补丁 `/tmp/aheart-ui-v1-closeout-original-working-tree.patch`，未跟踪文件副本及 SHA-256 清单 `/tmp/aheart-ui-v1-closeout-original-untracked/manifest.json`。）
- [x] 从最新 `origin/master` 建立独立收尾分支或工作树。逐项比较旧本地改动：主线已有覆盖的 Table 测试不重复迁移；`allowBuilds: esbuild: set this to true or false` 占位值不得进入提交。（分支 `codex/v1-local-closeout` 从 `17b3494` 建立；主线已有稳定 ID、跨实例及 SSR/hydration 覆盖；占位值未迁移。）
- [x] 固定 `pnpm@9.15.4`，确认 lockfile 与安装配置可重复；建立待办/风险/证据表，并标明每条任务的基线 SHA。（`corepack pnpm install --frozen-lockfile` 通过；R1 覆盖结果见 `../evidence/v1-local-closeout-r1-coverage-2026-09-28.json`。）

**本地退出条件**：所有原始改动可恢复；收尾工作树没有意外文件、权限噪声或配置占位值；对每项保留、迁移、搁置都有记录。

## L1：现有版本缺口复现与修复

**任务**

- [x] 以最新主线为准复核 Table 单选组在多实例 SSR 与 hydration 中的稳定性；主线已有覆盖该风险的稳定 ID、跨实例及 SSR/hydration 测试，无需重复添加同一测试。
- [x] 核对 D9 最终修正、38 处有意跳过记录、14 个 R1 文件覆盖门槛与三包独立消费测试；对新的失败做最小范围修复，不把 QG6 延期项或 v2 需求偷偷并入现有版本。D9 skip ledger、14 文件 coverage 与三个无 workspace symlink 的 tarball consumer 均有本地证据。
- [x] 修正文档与真实发布状态不一致之处，特别是 `CHANGELOG.md` 对已公开的 `aheart-ui@1.0.0` 和待发布的 `1.1.0` 的描述；核对安装与发布指南中的版本、依赖、命令和回滚步骤，并补充暗色 token 与减少动态效果的使用边界。
- [x] 本轮没有改公开入口或组件样式；运行时源码、类型声明和 `es/lib` 无需同步，E2E 调整与本地验收证据已单独记录。

**本地退出条件**：每项代码改动有失败复现与修复后证据；P0/P1 为零；无未解释的测试跳过、生成物漂移或文档/包版本矛盾。

## L2：本地自动化和真实操作验收

在固定提交 SHA、干净工作树和 `pnpm@9.15.4` 环境执行，逐项保存命令、退出码、日志与产物 SHA：

- [x] `corepack pnpm install --frozen-lockfile`（候选提交 `09cf9b6` 上通过）。
- [x] `corepack pnpm test`、`corepack pnpm typecheck`、`corepack pnpm test:coverage:r1`；R1 14 个文件均达到 80% 分支阈值，最终聚合 86.50%。
- [x] `corepack pnpm check:build-determinism`；连续构建后 `es/lib` 不漂移。
- [x] `corepack pnpm docs:build`、`corepack pnpm release:pack`；按 `.github/workflows/ci.yml` 的 `consumer` job 运行三个脚本，从三个新 tarball 验证 ESM、CJS、类型、CSS、SSR/hydration、基础交互及无 workspace symlink。
- [x] `CI=true corepack pnpm test:e2e`（由最终 `release:check` 调用），包括五个浏览器项目；955 项中 828 通过、127 按配置跳过、失败 0。
- [x] 使用 production preview 与桌面鼠标/键盘完成 Table/表单、Picker/Upload、浮层、DnD/Splitter、AI Workbench 代表性任务；检查桌面/移动视口、暗色 token 与 reduced-motion，并保存路径和截图。
- [x] 在干净候选 SHA `09cf9b6` 上执行 `CI=true corepack pnpm release:check`，退出码 0；`git diff --check` 通过。

**本地退出条件**：所有适用命令通过；交互可在本地实际完成；测试、视觉、SSR、消费端与构建证据分开归档。未通过项保留为明确的阻断项，不用“基本通过”代替。

## L3：审查与 GitHub 上传

- [x] 开发、测试、设计、产品四个视角分别审查最终差异与本地证据，记录 P0/P1/P2、结论和待复测项；本地差异未发现 P0/P1，独立设计/产品签字仍列在 L4。
- [x] 仅提交 L0–L2 验收范围内的代码、中文文档与证据索引；Logo 方案和 v2 规划稿未混入本次提交。
- [x] 推送收尾分支并创建 PR #32；精确 head `8053ebcf177ea0c60891031a09dddadb8485a534` 的两轮 CI 均通过，包括五浏览器矩阵、coverage、consumer、unit、typecheck、build-generated、docs 和 browser。
- [x] PR #32 已于 2026-09-28 squash 合入 `master`，merge SHA `d5145c3af4fdfb157fe1a557c392c15321ae8a1f`。该精确主线 SHA 的 [CI run 36427030605](https://github.com/wzfdhr/aheart-ui/actions/runs/36427030605) 全部通过；[Pages run 36432592641](https://github.com/wzfdhr/aheart-ui/actions/runs/36432592641) build/deploy 全部通过。
- [x] 在部署的该 SHA 上验证关键页面：文档根页、Table、发布指南、AI Agent Workbench 均 HTTP 200；发布指南在线内容包含“回滚与部分发布故障”和 npm dist-tag 回滚说明。逐项请求与 SHA 记录见 [`github-upload-verification.json`](../evidence/v1-local-closeout-2026-09-28/github-upload-verification.json)。

**上传退出条件**：已完成。GitHub 主线包含已验收的同一运行时/测试内容；最终主线只比本地完整门禁提交多证据归档及主线核验文档，不丢失原本地工作；PR、主分、Pages 的 SHA 和证据链可追溯。L4 真机、连续 QG5、独立 D9 签字及 npm 发布继续单独待办。

## L4：发布与外部验收（单独记录，不冒充本地通过）

- [ ] 在物理 iOS Safari 上用手指验收 DnD 排序/正文滚动、Splitter 拖动与取消清理，以及 D9 涉及的 Picker、浮层和 Workbench；证据绑定准确 SHA，经过人工复核。
- [ ] 按 QG5 规则收集同一主分提交的连续 10 次有效运行，验证 flaky rate 低于 1%。
- [ ] 发布负责人从干净主分复跑发布门禁，完成 npm 登录/二次验证，按核心包、DnD、AI 顺序发布；从公开 registry 在空项目重新安装三包，核对版本、类型、样式和运行时，再创建同 SHA 的 tag/Release。

**发布退出条件**：真机、稳定性、registry 消费、tag/Release 均有独立证据；任一项缺失时只报告“本地与代码上传完成”，不报告“D9/发布全部完成”。

## v2 启动条件

v2 保持暂停。至少等 L0–L3 全部完成并上传后，再检查 L4 的发布和外部验收状态，由产品与技术负责人明确决定是否开启 v2 M0。此前不实施 v2 组件、包拆分或 API 迁移。
