# M0 阶段报告与执行准备 — 2026-11-05

状态：**Accepted（2026-11-09 负责人书面确认）**。M1：**In progress**。本报告替代旧 M0 审计中“无候选/消费者证据”“roadmap 缺失”等不准确结论，并更新 11 月 4 日后变化的发布事实。批准文档与阶段通过分别判断。

## 2026-11-09 M0 Go

负责人 wzfdhr 在“待实际试用 AI 工作台、提供反馈并确认 M0 通过，之后进入 M1”的阶段说明后回复 **“确认”**。本次记录为负责人对 M0 基线及阶段 Go 的书面确认；不补造逐项操作日志、访谈内容或量化满意度。此前“保持待验收”的决定由本次确认更新。

适用 A1：四份规范与修订已批准并合入，clean-consumer 与自用项目 ai-review-gate 已登记并归档基线，P0=0。入口/依赖/兼容契约以 [契约文档](contract-review.md) 为准。M1 按 v1.2 additive 推进 Button/Modal/Select、显式 CSS 与 /full；Resolver、Icons、Primitive、AI/DND 拆分均在后续阶段。本次确认不包含 npm 发布，也不扩大此前仅针对 #38/#39/#40 的合并部署授权。

| 门禁 | 状态 | 依据 |
| --- | --- | --- |
| G1 设计冻结 | Pass | 四份 Approved 规范、已生效 A1、contract-review.md |
| G2 代码 | Pass | #39/#40 的 v1 修复与试点源码，master 90285d6 |
| G3 自动检查 | Pass | 主线 CI [42732612399](https://github.com/wzfdhr/aheart-ui/actions/runs/42732612399)，12/12 success |
| G4 视觉 | Pass | 两项必需试点及可选 Todo，六视口交互/axe，card-integration-2026-11-05 |
| G5 包 | Pass | tarball SHA、两版 Vue 严格类型、独立安装及升级回退记录 |
| G6 PR | Pass | #38/#39/#40 已合并 |
| G7 主线/Pages | Pass | master 90285d6；[部署 42738114400](https://github.com/wzfdhr/aheart-ui/actions/runs/42738114400) success，线上 HTTP/CSS 核验通过 |
| G8 用户验收 | Pass | wzfdhr 本轮书面“确认”；以上述阶段说明为上下文 |

Local / PR / Merged / Main CI / Pages / npm pack：Pass（证据如上）；npm registry：N/A（本轮未发布）；Decision：**Go / Accepted**。物理 iOS、连续 10 次 QG5、公开 v1.1.x 补丁保留为 A1 的独立 v1 待办。M1 自身的验收与发布决策另行记录。

## 2026-11-05 历史快照（状态以本次 Go 为准）

2026-11-05 后续推进：[Button 悬停对比度修复与消费回归](button-hover-2026-11-05/report.md)。本地候选的三个试点六视口交互/axe 通过，普通按钮与 AI 排序按钮的对比度 P1 在本地修复；Card TS2344 仍失败。M0-QA-01 基线脚本任务完成，M0-PM-02 的真实使用反馈与阶段 Go 仍待完成。共享 Git 对象目录的 AppleDouble 索引元数据已隔离备份，文档构建恢复正常。未合并或发布。

2026-11-05 最新推进：[Card 整合与升级回退验证](card-integration-2026-11-05/report.md)。已在本地叠加 #39，严格消费者两版 Vue/486 份声明、三个试点六视口均通过；同源浏览器升级和回退保留业务状态。M0-DEV-01 技术基线已完成。公开 1.1.0 的缺陷仍存在，#38/#39 仍开放且 CI success；未执行合并、发布或用户验收。

## 2026-11-05 合并授权与有效状态

- wzfdhr 明确授权：“允许合并并更新文档站”。范围为 #38、#39 与整合 PR #40；各 PR 必需 CI 全绿后合并，跟进 master CI 和 Pages。此授权不包含 npm 发布。
- #38 已合并，merge SHA `ab4b0903f4aa80bac3eff64cd6b4298670f81477`；head `1d85b2f` 的 CI run `41985175453` 全部 12 项 success。A1 即日起生效：M1 = v1.2 additive，Resolver 移至新 M3；固定试点为 clean-consumer 和负责人实际使用的项目。
- #39 已合并，merge SHA `9ed3a8c8ff64bb2c88754dc68f2c0ab9db1243df`；head `8b460a6` 的 CI run `41983599712` 全部 12 项 success。Card 修复已进入主线，但公开 registry 1.1.0 未改变。
- 自用试点登记：`ai-review-gate`，仓库路径 `pilots/ai-review-gate`；本轮本机路径 `/Volumes/新加卷/Codex/桌面归档/项目资料/aheart-ui-v2-m1/pilots/ai-review-gate`。用户明确回复：“尚未实际试用，保持待验收”。自动化基线通过不能替代实际使用。
- M0 继续 **Needs decision / 用户验收 Pending**，M1 **Blocked**。物理 iOS、QG5 连续 10 次和 Card 补丁发布按 A1 转为 v1.1.x 独立待办，不再作为 M0 的阻塞条件。
- 整合改动提交后以 #40 的精确 head CI 为合并依据；最终部署结果以合并后的 master SHA 和 Pages run 为准。本记录不预报尚未完成的 CI 或部署结果。

## 整合 CI 后续

#40 的首个整合提交 PR CI 通过，但 push CI 存在一次 mobile-webkit DnD iframe 滚动失败；已补充目标进入视口的测试前置条件，保持原断言。见 [CI 整合记录](ci-integration-2026-11-05/report.md)。合并仍以最新提交 CI 全绿为准，M0 用户验收状态不变。

## 较早决策快照（以下合并状态以最新记录为准）

- 工作分支 `codex/v2-m1` 已从 `512e243` 快进到 `c63edbf8c9098043d2d967d70d61d11db40e1a59`（11 月 5 日实时远端 master）。仅快进独立 worktree，未写入原主工作树。
- 四份规范经 [#37](https://github.com/wzfdhr/aheart-ui/pull/37) 合入并标为 Approved；批准人为 wzfdhr。规范明确：批准不等于 M0 通过，任务未自动勾选。
- [#36](https://github.com/wzfdhr/aheart-ui/pull/36) 的发布报告已合入；三包公开版本与 shasum 实时核对通过，GitHub Release 已存在。旧的“npm 未发布 / Release 不存在”阻塞关闭。
- 候选 `8c7fe030214a1de0cf36e7aa7586a4888f0d370e` 与 tag 提交 `90a0b25e43065c80261fdb2069dad472c92e1e38` 为同父提交的不同提交。`git diff --quiet <candidate> <tag> -- packages package.json pnpm-lock.yaml` exit 0；tag 与 `c63edbf` 同范围 diff 也 exit 0。发布报告另记录 tag 的重新构建、tarball SHA-256 比对一致。源码/产物树一致不能单独替代重新运行的证明。
- [#38](https://github.com/wzfdhr/aheart-ui/pull/38) 修订 A1 正在审查；其正文规定合入 master 后生效。因此本报告不提前降低现行试点、签字或验收门槛。A1 还要求登记自用项目的名称和路径。用户已选择 `ai-review-gate`，名称已确认，已按用户指示新建于 `pilots/ai-review-gate`，见 [试点记录](pilot-ai-review-gate.md)。
- [#39](https://github.com/wzfdhr/aheart-ui/pull/39) 修复 Card 严格类型错误，当前尚未合并；本次检查 diff 未发现新的阻塞性问题，但不能将 PR 描述中的本地结果作为本代理重跑结果。

## 六类证据与门禁

以下为早期审计快照。新增应用后的有效六类证据及 P1 以 [三试点报告](pilots-2026-11-05/report.md) 为准。

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

[契约评审稿](contract-review.md) 按已批准规范整理用户/JTBD、非目标、包依赖、兼容轨道、入口与 CSS 规则和预算决策。它是评审准备，未代签、未宣告冻结。M0-QA-01 的新消费试点基线已建立；M0-PM-02 仍需真实使用反馈，M0-TM-02 的 v1.2 版本对齐需等待 A1 生效。

## 风险与解除条件

| 编号 | 风险 / 阻塞 | Owner | 解除条件 / 下一步 |
| --- | --- | --- | --- |
| B1 | 三个验证应用已新建；质量失败与真实用户反馈待关闭 | Codex（创建/复测）；wzfdhr（验收） | 不再要求提供旧路径。见 [三试点报告](pilots-2026-11-05/report.md)；不能把新 fixture 写成历史业务采用 |
| B2 / P1 | 公开 1.1.0 严格消费者 Card TS2344；本地组合候选已修复 | #39 实施者；wzfdhr 发布决策 | #39 CI 已通过，本地两版 Vue/三试点严格消费验证见最新报告；仍需主线合并，公开补丁版本及发布另行决策 |
| B3 | A1 尚未合入，版本/Resolver/阶段编号存在待决变更 | wzfdhr | 审查 #38 并完成合并决定；生效后同步 M0 兼容矩阵，避免按旧的 v1.1 计划覆盖已发布版本 |
| B4 | 现行外部验收缺口：真机与连续 QG5 | wzfdhr / QA | 归档证据，或在 A1 生效后明确转为独立 v1 待办；本报告不自行豁免 |
| R1 / 已解除 | Git 共享对象目录 `._pack-*.idx` 报 non-monotonic index | Codex / DEV | 2026-11-05 已验证 AppleDouble 魔数并隔离备份 12 个元数据文件；真实索引保留，Git 查询和文档生产构建通过，见后续修复报告 |
| R2 | Pages 会在 master CI 成功后自动部署 | wzfdhr / REL | 本轮仅提出 PR；合并/重跑主线 CI 可能更新线上，需遵守此前的部署授权边界 |

任务时序：本轮完成证据纠正与 clean-consumer Node 基线 → 已指定 ai-review-gate，已创建三试点并执行安装/首屏/关键任务，接下来关闭类型和对比度 P1、补用户反馈及升级回滚基线 → A1 决策明确后完成兼容与预算冻结 → M0 书面 Go → 才启动 M1。依赖输入未到前不承诺日历截止日。

## 回滚与状态

现有 v1 根入口和 `aheart-ui/style.css` 保持作为回退路径。本轮文档/新试点可单独 revert；主库包和 pnpm lockfile 未修改，新增三个独立 npm lockfile。公开包不可覆盖重发；修复需新版本和单独发布授权。PR 尚未合并时保留 worktree；仅在确认合并后才清理分支/worktree。v2 Stable 未进入。
