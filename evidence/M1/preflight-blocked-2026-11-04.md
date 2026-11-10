# M1 前置检查报告 — 2026-11-04

> 历史快照：2026-11-04。11 月 5 日 npm/Release 与四份规范状态已变化，当前结论以 [M0 更新报告](../M0/decision-log.md) 为准。以下保留当时观察，不用于当前发布判断。

**状态：Blocked。** v2 保持暂停；不启动运行时代码实现。负责人为角色分工，具体人员待任命。

## 基线与核对

- `git ls-remote origin refs/heads/master 'refs/tags/v1.1.0*'`：master `512e2431fd4e89120a211d5f0a91e4ebcf76185a`；tag 对象 `f0d3cf0d6c42aa5bca10d04202e0d66fb6540d12`，指向 `90a0b25e43065c80261fdb2069dad472c92e1e38`。`git merge-base --is-ancestor 90a0b25 HEAD` exit 0。
- worktree `/Users/start/.codex/worktrees/v2-m1/aheart-ui`，分支 `codex/v2-m1`，起点为上述远端 master。主工作树未修改。
- 报告 `docs/superpowers/evidence/v1.1.0-release-2026-09-29/release-candidate-report.md` 指定候选 `8c7fe030214a1de0cf36e7aa7586a4888f0d370e`，不同于 tag 指向的 `90a0b25` 和当前 master；报告要求最终合并 SHA 重打包和比对，尚未找到同 SHA 结论。不要视这些 SHA 为相同。
- 指定四份 v2 规范在本次远端 master 树中不存在；主工作树存在未提交版本。现有独立 M0 worktree `evidence/M0/decision-log.md` 记录 Blocked，未见 M0 通过和签字证据。
- `npm --registry=https://registry.npmjs.org view <package>@<version> version dist.tarball dist.integrity --json`：`aheart-ui@1.1.0`、`@aheart-ui/dnd@1.0.0`、`@aheart-ui/ai@1.0.0` 均 exit 1 E404。`gh release view v1.1.0 --repo wzfdhr/aheart-ui`：exit 1，release not found。

## 现有实现与证据

- `packages/components/package.json` 公共 exports 包含根入口、`./style.css`、`./es/*`、`./lib/*` 和 package.json；无 `./button`、`./modal`、`./select`、`./full`、`./theme.css`、`./full.css` 或 resolver 公共入口。三个组件已有各自 `src/<component>/index.ts` 源码入口。Vite 构建使用 preserveModules、ESM/CJS 和声明生成；CSS 合并为 `style.css`，CSS 标记 sideEffects。未找到 M1 的 Resolver Preview 或 module graph fixture。
- 候选报告记录三包 tarball 的 SHA、大小和文件清单，候选 SHA 的 release check、三个隔离消费者、ESM/CJS、类型、CSS、SSR/hydration 和交互结果。原始记录在 `docs/superpowers/evidence/v1.1.0-release-2026-09-29/`。这是候选本地证据，不能替代公开 registry 安装及真实用户验收。
- 仓库 `docs/superpowers/evidence/` 有历史 iframe 与消费测试；尚未找到三指定试点在 M0 的可复测签字基线。`docs/superpowers/evidence/v1-local-closeout-2026-09-28/local-acceptance-report.md` 列出独立签字、物理 iOS Safari 和同 SHA 连续 QG5 的外部缺口，需核对是否后来完成。
- 更正：上一轮 M0 报告称未发现 v1.1.0 消费及 tarball 证据不准确，以上候选证据确实存在。

## 阻塞及解除条件

| 阻塞 | 责任角色 | 解除条件 |
| --- | --- | --- |
| M0 未通过；四份规范未进入远端基线 | PM/TM/QA/REL | 核对并批准四份文档，完成三个试点基线、契约和门禁签字，形成可复核的 M0 Accepted 报告 |
| 三包公开版本缺失，GitHub Release 缺失 | REL | 明确发布授权后按指南完成发布，并记录 registry 干净安装、dist-tag、provenance 与 Release；任何步骤失败即停止 |
| 候选、tag、master SHA 不一致 | REL/QA | 核对提交关系并在最终验收 SHA 重新 pack，比对哈希、内容与消费者验证，记录 tag/Release 对应关系 |
| 外部用户、真机和稳定性验收未有当前关闭证据 | QA/PM | 按 closeout 报告补齐并归档独立签字、物理 iOS 和同 SHA 稳定性结果，或提供可核验的后续关闭证据 |

本次没有运行构建、测试、tarball、浏览器或无障碍验证；没有 M1 代码、PR、合并、Pages 部署或 npm 发布。回滚路径保持现有 v1 根入口；新入口契约尚未实施。M2 前必须有 M0 许可证、scope 和发布决策，并满足该阶段自身进入条件。
