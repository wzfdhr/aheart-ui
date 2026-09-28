# 现有版本本地验收报告

报告时间：2026-09-28

本地验收提交：`09cf9b64cb9653763aab81d3b96925c62c793701`

基线：`origin/master` / `FETCH_HEAD` `17b3494e4f16972edde3d3d77d058102d6f4ee2c`

分支：`codex/v1-local-closeout`
环境：Node `v24.17.0`、pnpm `9.15.4`、npm `11.13.0`、macOS arm64。

完整机器摘要见 [`local-acceptance-summary.json`](local-acceptance-summary.json)；截图文件和 SHA-256 清单见 [`visual-artifacts.json`](visual-artifacts.json)。

所有最终本地命令都绑定到上述干净候选 SHA。随后提交的本文件、消费者结果、原始日志、覆盖率重跑记录与计划勾选更新只归档证据，不修改组件运行时代码、E2E 源文件或依赖锁文件；推送后的 PR CI 仍会验证最终远端 head。

## 本地自动化门禁

| 门禁 | 结果 | 证据 |
| --- | --- | --- |
| `corepack pnpm install --frozen-lockfile` | 退出码 0，lockfile 无变化 | 最终候选 SHA 上重跑通过 |
| `corepack pnpm test` | 组件 1485、DnD 79、AI 200 项通过 | [`gzip 日志`](logs/release-check-ci.log.gz) |
| 脚本测试 | 247/247 通过，失败 0 | [`gzip 日志`](logs/release-check-ci.log.gz) |
| `corepack pnpm typecheck` | 三包通过 | [`gzip 日志`](logs/release-check-ci.log.gz) |
| `corepack pnpm check:build-determinism` | 三包连续构建通过，无生成物漂移 | [`gzip 日志`](logs/release-check-ci.log.gz) |
| `corepack pnpm test:coverage:r1` | 14 个文件均 ≥80%；3312/3829 = 86.50%，最低 80.33% | [`R1 机器结果`](../v1-local-closeout-r1-coverage-2026-09-28.json)、[`gzip 原始日志`](logs/r1-coverage.log.gz) |
| `corepack pnpm docs:build` | VitePress 构建通过 | [`gzip 日志`](logs/release-check-ci.log.gz) |
| `corepack pnpm release:pack` | 核心包 1047 文件、DnD 79 文件、AI 115 文件 | [`gzip 日志`](logs/release-check-ci.log.gz) |
| `CI=true corepack pnpm release:check` | 退出码 0；955 个 E2E 中 828 通过、127 按项目配置跳过、失败 0 | [`完整 gzip CI 门禁日志`](logs/release-check-ci.log.gz) |
| `git diff --check` 与干净树检查 | 门禁退出码 0；运行时工作树干净 | [`gzip 日志`](logs/release-check-ci.log.gz)、候选 SHA `09cf9b6` |

R1 先前同源码运行的聚合计数为 3311/3828（86.49%）；最终提交上的计数分母相差一个分支，14 个文件的阈值结果未变化。以候选提交上的输出为本报告主结果。

## 独立 tarball 消费

三个包从本地候选重新打包，并在隔离 consumer 中验证；三份结果均为 `passed`，没有 workspace symlink。执行命令、tarball 文件数与 SHA-256 见 [`consumer-summary.json`](consumers/consumer-summary.json)。

- 根入口 consumer：ESM 根入口通过，gzip bundle 为 50,729 bytes，未发现无关模块。
- Form.List consumer：类型、ESM、CJS、CSS、SSR、hydration 与交互检查全通过。
- D8 三包 consumer：包文件、类型导入、ESM/CJS、CSS、插件安装、reducer、SSR、hydration、Chat 生命周期、Workbench、AI Form 和原子包体检查全通过；可选 gzip benchmark 未运行。

Tarball SHA-256：

- `aheart-ui@1.1.0`: `2e263cad466fff8b23883af898d1656ad0f5c588308055889ae89ab13a8899b7`
- `@aheart-ui/dnd@1.0.0`: `f2ffba7d81fbf34ca6f41ff59faa12187a31c2361d6d74b61239ebc3c096ae0f`
- `@aheart-ui/ai@1.0.0`: `f09be0bb5b31d089c7b5d34492cb3361e46c9ab978e31f74f3383044287f102b`

## 人工交互与视觉验收

桌面真实鼠标/键盘路径、窄屏/主题检查、演示边界和截图索引见 [`manual-smoke.md`](manual-smoke.md)。Table、DatePicker、Upload、DnD、Splitter、Modal 与 AI Workbench 均完成代表性本地交互；Upload 和 Workbench 的演示行为仅修改本地组件状态，不代表真实后端集成。

截图覆盖 Table 全页与桌面/移动视口、DatePicker、Upload、DnD、Splitter、Workbench 初始与批准后状态。暗色 token 和 `prefers-reduced-motion` 的结果见 [`theme-smoke.json`](theme-smoke.json)；WebKit 取消预取失败诊断见 [`qg5-cancelled-prefetch-diagnosis.json`](qg5-cancelled-prefetch-diagnosis.json)。

## L3 GitHub 上传核验

- PR [#32](https://github.com/wzfdhr/aheart-ui/pull/32) 的精确 head `8053ebcf177ea0c60891031a09dddadb8485a534` 在 push 与 pull_request 两轮 CI 均全绿，随后于 2026-09-28 squash 合入。
- 合并 SHA `d5145c3af4fdfb157fe1a557c392c15321ae8a1f` 与核验时 `origin/master` 一致。该 SHA 的主线 CI 全部通过：typecheck、unit、browser、coverage、consumer、build-generated、docs 和五组 QG5 browser 项目。
- 同一主线 SHA 的 Pages build/deploy 全部成功。线上根页、Table、发布指南和 AI Agent Workbench 路径均返回 HTTP 200，发布指南在线内容已包含新增回滚说明。
- PR head、master SHA、CI/Pages run URL 和页面请求清单见 [`github-upload-verification.json`](github-upload-verification.json)。原始本地 E2E/覆盖率运行的提交仍明确记录为父提交 `09cf9b6`；合并提交另经精确主线 CI 覆盖。

## 仍待外部验收

- 独立设计与产品负责人的最终 D9 签字。
- 物理 iOS Safari 上的真实手指输入验收。
- 同一主线 SHA 的连续 10 次有效 QG5 运行。
- npm 正式发布、公开 registry 空项目安装、tag 和 GitHub Release。

本报告区分本地验收 SHA、PR head 和合并后 master SHA；外部待办不能由 PR 合并、CI、Pages 或截图代替。本轮未执行 npm publish，也未启动 v2。
