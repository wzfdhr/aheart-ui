# M0 阶段报告与执行准备 — 2026-11-05

状态：**Blocked / discovery**。M1：**Blocked**。本报告替代旧 M0 审计中“无候选/消费者证据”“roadmap 缺失”等不准确结论，并更新 11 月 4 日后变化的发布事实。批准文档与阶段通过分别判断。

## 当前决策与事实

- 工作分支 `codex/v2-m1` 已从 `512e243` 快进到 `c63edbf8c9098043d2d967d70d61d11db40e1a59`（11 月 5 日实时远端 master）。仅快进独立 worktree，未写入原主工作树。
- 四份规范经 [#37](https://github.com/wzfdhr/aheart-ui/pull/37) 合入并标为 Approved；批准人为 wzfdhr。规范明确：批准不等于 M0 通过，任务未自动勾选。
- [#36](https://github.com/wzfdhr/aheart-ui/pull/36) 的发布报告已合入；三包公开版本与 shasum 实时核对通过，GitHub Release 已存在。旧的“npm 未发布 / Release 不存在”阻塞关闭。
- 候选 `8c7fe030214a1de0cf36e7aa7586a4888f0d370e` 与 tag 提交 `90a0b25e43065c80261fdb2069dad472c92e1e38` 为同父提交的不同提交。`git diff --quiet <candidate> <tag> -- packages package.json pnpm-lock.yaml` exit 0；tag 与 `c63edbf` 同范围 diff 也 exit 0。发布报告另记录 tag 的重新构建、tarball SHA-256 比对一致。源码/产物树一致不能单独替代重新运行的证明。
- [#38](https://github.com/wzfdhr/aheart-ui/pull/38) 修订 A1 正在审查；其正文规定合入 master 后生效。因此本报告不提前降低现行试点、签字或验收门槛。A1 还要求登记自用项目的名称和路径。用户已选择 `ai-review-gate`，名称已确认，当前路径仍待取得，见 [试点记录](pilot-ai-review-gate.md)。
- [#39](https://github.com/wzfdhr/aheart-ui/pull/39) 修复 Card 严格类型错误，当前尚未合并；本次检查 diff 未发现新的阻塞性问题，但不能将 PR 描述中的本地结果作为本代理重跑结果。

## 六类证据与门禁

| 类别 | 本轮结论 | 证据 / 限制 |
| --- | --- | --- |
| 代码 | 仅文档与基线归档；无 M1 运行时实现 | `git diff --name-only`；包树 diff exit 0 |
| 自动化 | release-contract 7/7 通过 | `node --test scripts/release-contract.test.mjs` exit 0；未重跑全仓构建/单测/确定性 |
| 视觉/运行时 | Node ESM、CJS、AI SSR、三包 CSS 读取通过 | [clean-consumer](baseline/clean-consumer-2026-11-05/results.json)；不是浏览器视觉、hydration、iframe 或无障碍验收 |
| 包消费 | 公开 registry 安装通过；严格类型失败 | 安装 15.078 秒，包名精确版本，无 workspace symlink；兼容类型 exit 0，严格类型 exit 2（Card TS2344） |
| 发布 | v1 已发布；本轮未发布或部署 | [发布报告](../../docs/superpowers/evidence/v1.1.0-release-2026-09-29/registry-publish-report.md)；Pages 最新成功 SHA 另记状态快照 |
| 用户验收 | 未通过 | 指定业务试点、安装到正确首屏耗时、真实任务反馈、负责人决策未归档 |

G1：规范批准已有，M0 契约冻结仍待确认；G2/G3：仅本次文档/基线范围；G4/G5：仅部分基线；G6/G7：见 PR 与 CI 快照；G8：未通过。不得把单项通过写成 M0 Accepted。

## 产品与技术契约准备

[契约评审稿](contract-review.md) 按已批准规范整理用户/JTBD、非目标、包依赖、兼容轨道、入口与 CSS 规则和预算决策。它是评审准备，未代签、未宣告冻结。M0-PM-02、M0-QA-01 仍需真实试点，M0-TM-02 的 v1.2 版本对齐需等待 A1 生效。

## 风险与解除条件

| 编号 | 风险 / 阻塞 | Owner | 解除条件 / 下一步 |
| --- | --- | --- | --- |
| B1 | `ai-review-gate` 已选定，当前源码位置和可复测反馈缺失 | wzfdhr（选择/验收）；Codex（基线执行） | 名称已由用户确认，下一步提供当前本地路径或仓库地址；定位范围及待跑流程见试点记录。现行规范要求三试点；若 A1 合入，则按两试点重新核对。不能用内部 fixture 冒充业务项目 |
| B2 / P1 | 公开 1.1.0 严格消费者 Card TS2344 | #39 实施者；wzfdhr 发布决策 | #39 审查及 CI 全通过；最终 SHA 打包验证；若需公开修复，再单独授权 1.1.1 发布 |
| B3 | A1 尚未合入，版本/Resolver/阶段编号存在待决变更 | wzfdhr | 审查 #38 并完成合并决定；生效后同步 M0 兼容矩阵，避免按旧的 v1.1 计划覆盖已发布版本 |
| B4 | 现行外部验收缺口：真机与连续 QG5 | wzfdhr / QA | 归档证据，或在 A1 生效后明确转为独立 v1 待办；本报告不自行豁免 |
| R1 | Git 共享对象目录 `._pack-*.idx` 报 non-monotonic index | Codex / DEV | 不删除主工作树文件；重要发布读数可用远端 API 交叉验证，发布前用健康 clone 独立验证 |
| R2 | Pages 会在 master CI 成功后自动部署 | wzfdhr / REL | 本轮仅提出 PR；合并/重跑主线 CI 可能更新线上，需遵守此前的部署授权边界 |

任务时序：本轮完成证据纠正与 clean-consumer Node 基线 → 已指定 ai-review-gate，取得当前源码位置后执行安装/首屏/关键任务/回滚基线 → A1 决策明确后完成兼容与预算冻结 → M0 书面 Go → 才启动 M1。依赖输入未到前不承诺日历截止日。

## 回滚与状态

现有 v1 根入口和 `aheart-ui/style.css` 保持作为回退路径。本轮文档可单独 revert；包和 lockfile 未修改。公开包不可覆盖重发；修复需新版本和单独发布授权。PR 尚未合并时保留 worktree；仅在确认合并后才清理分支/worktree。v2 Stable 未进入。
