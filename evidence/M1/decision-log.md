# M1 v1.2 阶段验收与交付记录

2026-11-10。状态：**Go / Accepted**。验收对象为 [#41](https://github.com/wzfdhr/aheart-ui/pull/41) 的 Button/Modal/Select 公共子入口、显式 CSS、兼容入口与 Modal 原生 Tab 修正。

## 负责人决定

wzfdhr 对“认可 M1 候选 #41，并授权在必需 CI 通过后合并、更新文档站；不含 npm 发布”的明确问题回复：**“认可，授权合并并更新文档站”**。按已生效 [A1](../../docs/superpowers/specs/2026-11-05-aheart-ui-v2-solo-scope-amendment.md)，该次书面决定同时作为产品、技术、质量、文档及发布负责人的阶段决定。此前仅覆盖 #38–#40 的授权由本次决定增加 #41 范围。

该记录保留负责人对候选的认可，不补造逐项试用操作、访谈或满意度。自动化范围及截图见[最终候选报告](native-tab-review-2026-11-09/report.md)。

## 验收对象与溯源

- M0：2026-11-09 Go，见 [M0 决策日志](../M0/decision-log.md)。
- 实现与验证器：`c76b33529162152fea4d029482d0b8bcf67871a2`；候选 head：`d56f449e48632b3842156e99ccf083b4d1d673e4`。
- #41 合并提交：`259db118c7c95904ae7054313fd0b7a0e2630214`；与候选的文件树一致，核对记录见 acceptance-2026-11-10/source-equivalence.json。
- 本地 core pack SHA-256：`38c00fed373bba4c30a4b0c0bbc9e0e38bb3db5360d2948f5bc5aca1458782a1`。Linux PR pack 另记为 `44ddec22cd4a0e1ab3ab58dd90c44bdf5235f04f1570143b6a6dbfa640654f21`；不把两个平台的 tarball 混记为同一产物。
- 主线 CI：[42763380087](https://github.com/wzfdhr/aheart-ui/actions/runs/42763380087)。Pages：[42767778878](https://github.com/wzfdhr/aheart-ui/actions/runs/42767778878)，部署 ID `7675123651`，二者提交均为 `259db118c7c95904ae7054313fd0b7a0e2630214`。

## 八门禁

| 门禁 | 状态 | 依据 |
| --- | --- | --- |
| G1 设计冻结 | Pass | [入口/CSS/预算契约](contract.md)、已生效 A1、负责人本次书面认可；预算未放宽 |
| G2 代码 | Pass | #41、实现 c76b335、合并 259db11；三包 build/typecheck/exports/license 通过 |
| G3 自动检查 | Pass | 本地 1,494 core + 79 DND + 200 AI，251 脚本；严格类型两版 Vue；确定性构建；PR/push 与主线各 12/12 success |
| G4 视觉/交互 | Pass | 打包后的 Chromium 桌面/手机、Firefox 桌面、WebKit 桌面/手机；SSR hydration、键盘、axe、iframe；原生 radio/editor/details/date/media Tab 对照 |
| G5 包 | Pass | 三包 pack；独立真实 npm consumer、十种构建、ESM/CJS/SSR、模块图、CSS 预算；升级 1.1 → 1.2 → 1.1 状态保留，原候选安装/构建恢复 |
| G6 审查合并 | Pass | 负责人书面决定，#41 自审与精确 head 检查；[PR CI](https://github.com/wzfdhr/aheart-ui/actions/runs/42754151637) / [push CI](https://github.com/wzfdhr/aheart-ui/actions/runs/42754145510) 均 12/12 success；已合并 |
| G7 主线/Pages | Pass | 主线 CI 42763380087 全部 12 项 success，Pages 42767778878 build/deploy success，部署提交与合并提交一致；线上新指南和资产 HTTP 200，详见 acceptance-2026-11-10/ |
| G8 用户验收 | Pass | wzfdhr 2026-11-10 对明确的 M1 候选及范围书面回复“认可，授权合并并更新文档站”；试点自动化和截图独立保留，不补造用户操作 |

## 八状态

| 字段 | 结论 | 证据 |
| --- | --- | --- |
| Local | Pass | [最终候选报告](native-tab-review-2026-11-09/report.md)，原始日志、模块图、tarball、截图及 manifest |
| PR | Pass | #41，两个 head 工作流 12/12 success |
| Merged | Pass | 259db118c7c95904ae7054313fd0b7a0e2630214 |
| Main CI | Pass | 42763380087，12/12 success；原始结果见 acceptance-2026-11-10/ |
| Pages | Pass | 42767778878，部署 7675123651，线上核验通过 |
| npm pack | Pass | 本地候选及独立安装/回退证据；主线 consumer job success |
| npm published | N/A | 本轮明确不包含 npm 发布，1.2 为本地 tarball/源码候选；无发布命令或 tag |
| UA | Pass | 本次负责人书面认可，适用范围为冻结的 M1 候选 |

Decision：**Go / Accepted**，P0=0、P1=0（本轮范围）。全量 E2E 的 127 项 skip 与实际通过数分别记录于 CI 日志；测试源和配置未因本轮改动调整。

## 适用范围与后续

本阶段交付是 v1.2 additive。根 default/named、旧 es/lib 和 style.css 保留；Resolver 按 A1 留在新 M3，未用 alias 或隐式全量 CSS 替代本轮按需契约。手机结果为浏览器仿真视口，实际验证为 Vue/Vite SSR/hydration、iframe 和三包消费者；不声称物理 iOS、Electron 或 Nuxt 适配验收。

后续 M2/M3 按 A1 的独立范围执行。npm 发布需要单独决定；本次阶段 Go 与文档站部署不授权 npm 发布。
