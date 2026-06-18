# Aheart UI Collaboration Handoff

更新时间：2026-06-18

## 当前状态

当前分支：`codex/ant-style-docs-site`

远端仓库：`https://github.com/wzfdhr/aheart-ui`

核心协作文档：

- 设计文档：`docs/superpowers/specs/2026-06-18-full-ui-roadmap-i18n-design.md`
- Phase 1 实施计划：`docs/superpowers/plans/2026-06-18-phase-1-i18n-ready-components.md`
- 本交接文档：`docs/superpowers/COLLABORATION_HANDOFF.md`

已经完成：

- 仿 Ant Design 的 VitePress 文档站基础结构。
- 组件总览页面与 Button 文档页。
- 全量产品级组件库路线设计。
- Phase 1 的详细实施计划。
- Task 1：文档默认中文、英文 `/en/`、组件元数据国际化、中文乱码文案修复、英文镜像页面。

截至本交接前的最新功能提交：

- `ddbb635 docs: add chinese default and english locale`

注意：Task 1 已通过规格审查。代码质量审查在本交接前被暂停，没有宣称已通过。

## 当前真实能力边界

源码组件库当前真正可用的 Ready 组件仍然只有：

- `Button`

文档里的 `Icon`、`Space`、`Divider`、`Tag`、`Alert` 等组件在 Task 1 之后仍应是 `Planned`，还没有实现源码、测试、导出和组件文档。

不要在 npm、官网或 README 中宣称这些组件已经可用，直到对应任务完成并通过验证。

## 后续执行顺序

建议严格按 Phase 1 计划继续：

1. Task 2：实现 `Icon`
   - 新增 `packages/components/src/icon/*`
   - 先写失败测试，再实现组件
   - 更新根导出
   - 添加中英文 Icon 文档
   - 在组件元数据里把 Icon 改为 `Ready`

2. Task 3：实现 `Space` 和 `Divider`
   - 新增两个组件源码、样式、类型和测试
   - 更新根导出
   - 添加中英文组件文档
   - 在组件元数据里把 Space、Divider 改为 `Ready`

3. Task 4：实现 `Tag` 和 `Alert`
   - 新增两个组件源码、样式、类型和测试
   - `Alert` 会依赖 `Icon`
   - 更新根导出
   - 添加中英文组件文档
   - 在组件元数据里把 Tag、Alert 改为 `Ready`

4. Task 5：全量验证、构建产物、推送
   - 跑完整测试、类型检查、组件构建、文档构建
   - 刷新 `packages/components/es/**` 和 `packages/components/lib/**`
   - 提交构建产物
   - 推送到 GitHub

后续第二阶段再做：

- `Typography`
- `Flex`
- `Grid`

更复杂的 `Form`、`Table`、`DatePicker`、`Upload`、`Tree` 等不要提前混进 Phase 1。

## 推荐验证命令

如果你的本机已经安装了 `pnpm`，可以直接使用：

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
$env:PATH='C:\Users\12864\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;' + $env:PATH
$node='C:\Users\12864\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$pnpm='C:\Users\12864\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.cjs'

& $node $pnpm --filter ./docs dev -- --host 127.0.0.1 --port 5173
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

回家后建议先做这三步：

1. 拉取最新分支：

```powershell
git checkout codex/ant-style-docs-site
git pull origin codex/ant-style-docs-site
```

2. 启动文档站，看中文和英文首页：

```powershell
pnpm --filter ./docs dev -- --host 127.0.0.1 --port 5173
```

3. 打开 Phase 1 计划，从 Task 2 开始做：

```text
docs/superpowers/plans/2026-06-18-phase-1-i18n-ready-components.md
```

如果时间不多，先只做 `Icon`。它是后续 `Alert` 等反馈组件的基础，收益最高。
