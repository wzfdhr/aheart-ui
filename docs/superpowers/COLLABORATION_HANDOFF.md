# Aheart UI Collaboration Handoff

更新时间：2026-06-22

## 当前状态

当前分支：`codex/ant-style-docs-site`

远端仓库：`https://github.com/wzfdhr/aheart-ui`

核心协作文档：

- 设计文档：`docs/superpowers/specs/2026-06-18-full-ui-roadmap-i18n-design.md`
- Phase 1 实施计划：`docs/superpowers/plans/2026-06-18-phase-1-i18n-ready-components.md`
- 本交接文档：`docs/superpowers/COLLABORATION_HANDOFF.md`

本次交接前的本地最新功能提交：

- `d68b9ca docs: polish i18n navigation`

这次交接文档提交并推送后，GitHub 远端分支会包含 `d68b9ca` 以及本交接文档更新。

## 已完成

- 搭建了仿 Ant Design 的 VitePress 文档站基础结构。
- 添加了组件总览页面、Button 文档页、指南页和主题说明页。
- 写入了产品级组件库全量路线设计。
- 写入了 Phase 1 的详细实施计划。
- 完成了 Phase 1 Task 1：
  - 默认中文站点。
  - 英文 `/en/` 站点。
  - 组件元数据国际化。
  - 中文文档乱码修复。
  - 英文镜像首页、指南、组件总览和 Button 文档。
- Task 1 规格审查已通过。
- Task 1 代码质量审查发现的主要问题已部分修复：
  - 中文组件侧边栏已补回 `组件总览`。
  - 英文组件侧边栏已补回 `Overview`。
  - 中文首页卡片标题已本地化。

## 当前未完成问题

下一次继续前，先修这个问题：

- `docs/en/index.md` 的英文状态句现在会渲染成类似 `There are currently 1 Ready components`，因为当前只有 1 个 Ready 组件。
- 建议改成不需要单复数判断的句子，例如：

```md
Current status: {{ readyCount }} ready, {{ plannedCount }} planned. Planned components are roadmap items and are not published yet.
```

或者用 computed 生成单复数文案。

建议修复提交：

```powershell
git add docs/en/index.md
git commit -m "docs: fix english status wording"
git push origin codex/ant-style-docs-site
```

修完之后再继续 Phase 1 Task 2。

## 当前真实能力边界

源码组件库当前真正可用的 Ready 组件仍然只有：

- `Button`

这些组件仍是 `Planned`，尚未实现源码、测试、导出和组件文档：

- `Icon`
- `Space`
- `Divider`
- `Tag`
- `Alert`

不要在 npm、官网或 README 中宣称这些组件已经可用，直到对应任务完成并通过验证。

## 后续执行顺序

建议严格按 Phase 1 计划继续：

1. 修复 `docs/en/index.md` 的英文计数文案。
2. Task 2：实现 `Icon`
   - 新增 `packages/components/src/icon/*`
   - 先写失败测试，再实现组件。
   - 更新 `packages/components/src/index.ts` 根导出。
   - 添加中英文 Icon 文档。
   - 在组件元数据里把 Icon 改为 `Ready`。
3. Task 3：实现 `Space` 和 `Divider`
   - 新增两个组件源码、样式、类型和测试。
   - 更新根导出。
   - 添加中英文组件文档。
   - 在组件元数据里把 Space、Divider 改为 `Ready`。
4. Task 4：实现 `Tag` 和 `Alert`
   - 新增两个组件源码、样式、类型和测试。
   - `Alert` 会依赖 `Icon`。
   - 更新根导出。
   - 添加中英文组件文档。
   - 在组件元数据里把 Tag、Alert 改为 `Ready`。
5. Task 5：全量验证、构建产物、推送
   - 跑完整测试、类型检查、组件构建、文档构建。
   - 刷新 `packages/components/es/**` 和 `packages/components/lib/**`。
   - 提交构建产物。
   - 推送到 GitHub。

后续第二阶段再做：

- `Typography`
- `Flex`
- `Grid`

更复杂的 `Form`、`Table`、`DatePicker`、`Upload`、`Tree` 等不要提前混进 Phase 1。

## 本次已验证

2026-06-22 已验证：

- `pnpm --filter ./packages/components test`：通过，当前 1 个测试文件、3 个测试。
- `pnpm --filter ./packages/components typecheck`：通过。
- `pnpm --filter ./docs build`：通过。
- `d68b9ca` 后再次执行 `pnpm --filter ./docs build`：通过。

注意：这些命令在 Codex 环境里是用 bundled Node + pnpm 跑的。本机如果已经安装 pnpm，可以直接使用普通命令。

## 推荐验证命令

如果本机已经安装了 `pnpm`：

```powershell
pnpm --filter ./packages/components test
pnpm --filter ./packages/components typecheck
pnpm --filter ./packages/components build
pnpm --filter ./docs build
```

当前 Codex 运行环境里 `pnpm` 不在 PATH，需要使用 bundled Node + pnpm：

```powershell
$env:PATH='C:\Users\12864\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;' + $env:PATH
$node='C:\Users\12864\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$pnpm='C:\Users\12864\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.cjs'

& $node $pnpm --filter ./packages/components test
& $node $pnpm --filter ./packages/components typecheck
& $node $pnpm --filter ./packages/components build
& $node $pnpm --filter ./docs build
```

启动文档站：

```powershell
pnpm --filter ./docs dev -- --host 127.0.0.1 --port 5173
```

访问地址：

- 中文站：`http://127.0.0.1:5173/`
- 英文站：`http://127.0.0.1:5173/en/`

## Git 注意事项

继续工作前先看状态：

```powershell
git status --short --branch
```

当前常见未跟踪目录：

- `.pnpm-store/`
- `docs/.vitepress/cache/`

这两个都是本地生成目录，不要提交。后续可以单独加一条小提交把它们写进 `.gitignore`，但不要和组件实现混在一个提交里。

建议每个任务一个提交：

```powershell
git add <本任务文件>
git commit -m "feat: add icon component"
git push origin codex/ant-style-docs-site
```

## 组件完成标准

一个组件只有同时满足下面条件，才能在 `docs/.vitepress/data/components.ts` 里改成 `Ready`：

- 有 `packages/components/src/<component>/<component>.vue`
- 有 `types.ts`
- 有 `style.css`
- 有 `index.ts`
- 有 Vitest 测试
- 已从 `packages/components/src/index.ts` 导出
- 支持全量插件安装
- 有中文文档页
- 有英文文档页
- `pnpm --filter ./packages/components test` 通过
- `pnpm --filter ./packages/components typecheck` 通过
- `pnpm --filter ./docs build` 通过

## 接手建议

回家后建议先做这几步：

1. 拉取最新分支：

```powershell
git checkout codex/ant-style-docs-site
git pull origin codex/ant-style-docs-site
```

2. 修复 `docs/en/index.md` 的英文计数文案，并跑文档构建。

3. 打开 Phase 1 计划，从 Task 2 的 `Icon` 开始：

```text
docs/superpowers/plans/2026-06-18-phase-1-i18n-ready-components.md
```

如果时间不多，先只做 `Icon`。它是后续 `Alert` 等反馈组件的基础，收益最高。
