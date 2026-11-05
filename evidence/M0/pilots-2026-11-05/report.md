# 三试点创建与消费基线报告

2026-11-05。状态：**Blocked**（质量门禁）；三个应用已创建并可运行。M0 未 Accepted，M1 未开始运行时代码开发。

## 来源与实现

用户明确指示“那你应该自己建啊”，因此新建 `pilots/clean-consumer`、`pilots/ai-review-gate`、`pilots/muxu-todo`。不再要求用户提供旧工程路径。这是新消费验证应用，不是既有业务采用或生产系统。源码初始提交 `17ec2448b8eb8305e31e326a33e81b7f28305edf`；本提交补充手机抽屉导航测试、预览脚本和结果。结果记录各应用输入文件 SHA256，runner 以本报告所在提交为准。

- clean-consumer：Button 计数、Select、Modal、键盘焦点、真实 iframe。
- ai-review-gate：本地聊天适配器、修订预览、勾选门禁、批准记录、重复批准限制、Workbench 任务排序及手机 Drawer。没有真实模型/Git 后端。
- muxu-todo：新增、完成、筛选、删除和 localStorage 刷新恢复。

三个独立 npm 锁文件，消费公开 core 1.1.0、AI/DND 1.0.0。隔离目录 npm ci，未使用 monorepo 源码 alias/link。主库 packages 未改动。

## 命令和结果

```sh
node pilots/run-baselines.mjs --out /tmp/aheart-pilot-evidence-2026-11-05-final
node pilots/run-baselines.mjs --only ai-review-gate --out /tmp/aheart-pilot-evidence-2026-11-05-ai-final
node pilots/serve-baselines.mjs /tmp/aheart-pilot-evidence-2026-11-05-final
```

两次 runner 均 exit 1，不能解释为通过。第一次 AI 手机用例未打开执行抽屉；修正测试导航后第二次替代 AI 结果。原始结果分别保留 original-run-results.json、ai-rerun-results.json；各工程目录保存有效结果。

| 证据类别 | 结论 | 可复测证据 |
| --- | --- | --- |
| 代码 | 三应用及独立 runner 已实现 | pilots/；各 results.json 的 sourceFiles |
| 自动化 | 三工程 npm ci、兼容类型、SSR/Vite 构建 exit 0；严格类型 exit 2 | 各工程 results.json、压缩命令日志 |
| 视觉/运行时 | Chromium 149，1440×1000/390×844；三应用 hydration 和业务交互通过，控制台无错误 | browser/failure PNG、results.json；仅浏览器模拟手机 |
| 无障碍 | Todo 两视口、AI 手机通过；clean 两视口和 AI 桌面对比度失败 | axe-*.json；未豁免或覆盖组件样式 |
| 包消费 | 公开精确版本安装，无 workspace symlink；clean/Todo 已渲染图无 AI/DND | package-lock.json、module-graph.json、results.json |
| iframe | clean-consumer 子文档 Modal 开关、父文档无 dialog 通过 | clean-consumer/results.json 的 iframe |
| 发布准备 | 仅消费当前公开版本，无新候选包发布 | 本轮未 npm publish、Release、生产部署 |
| 用户验收 | Pending，未代签 | 可运行应用已提供，真实使用反馈待采集 |

这批独立消费测试没有替代全仓单测、三包构建、确定性、docs build、M1 subpath tarball、五浏览器或物理设备验收。消费锁文件来自公开 registry tarball；尚未验证新的 M1 候选 tarball。SSR 是实际 Node renderToString 后浏览器 hydration；不是部署 SSR 服务。

## 阻塞、负责人和解除条件

| 项目 | Owner | 解除条件 |
| --- | --- | --- |
| P1：公开 Card 声明 TS2344，三应用严格类型均失败 | #39 实施者 / 维护者 | 修复提交的候选 tarball 在严格消费者通过；公开发布另行授权 |
| P1：clean 默认按钮 hover 文字约 2.98:1；AI 桌面排序按钮也出现 serious color-contrast | 组件维护者；Codex 复测 | 定位样式/交互状态，修复后相同流程 axe 无违规；AI 原轮桌面通过、复测失败，两次证据保留，需排查时序敏感性 |
| 新试点尚无真实用户使用反馈及版本升级/回滚演练 | Codex 准备；wzfdhr 验收 | 实际任务反馈、后续候选版本对照及回退关键流程归档 |
| M0 契约预算与 #38 生效决策未完成 | wzfdhr / 技术负责人 | 按生效规范冻结并书面 Go |

## 回退、分支与下一步

工作分支 codex/v2-m1；Draft PR https://github.com/wzfdhr/aheart-ui/pull/40 。未合并，无合并 SHA，本轮未部署。原主工作树不写入。独立试点可以删除其临时安装副本；依赖回退按 pilots/README.md 在新副本恢复 package.json/lock 并 npm ci。该步骤是已记录方法，不能写成已完成升级回滚演练。公开包没有被更改。

M1 继续 Blocked；先关闭 P1、补用户反馈及 M0 决策。M2 须在 M1 的实际 subpath、CSS、ESM/CJS、tarball、SSR/iframe、预算和文档验收通过后进入。PR 未合并时保留 worktree/分支；确认合并后才清理。
