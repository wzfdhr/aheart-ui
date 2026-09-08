# D5-B 独立测试经理报告

最终测试候选：`8f70387996a170ce31bdbcc5a24c6c2fc2011474`；候选 HEAD：`8f8c52663d1991201b5e0a30d3db33eebe4563c2`；生产基线：`c7dd91a5ebdfbd31d10b7cbfce1878e1e49fba4b`。候选 HEAD 相对测试候选只增加审核文档，D5-B 运行时代码与测试覆盖不变。

## 最终结果：D5-B 独立技术门禁通过

| 门禁 | 最终结果 |
| --- | --- |
| 单元测试 | D5-B 相关 unit 共 `204`，全部通过。 |
| 五浏览器回归 | D5-B `35/35` 通过，`0 skip`，`0 failed`；覆盖五个浏览器项目。 |
| 页面错误边界 | 每个 D5-B 浏览器场景均收集 `pageerror`；未出现页面异常。 |
| console 错误边界 | 测试监听 `console` 的 `error` 类型并纳入失败条件；最终各场景错误数组为空。普通 info/warn 不被错误地当成失败，也不据此宣称没有任何 console 输出。 |
| 类型检查 | components 及工作区既定 typecheck 通过。 |
| 构建 | 生产组件/工作区 build 通过；本轮没有以测试替换或跳过构建作为放行条件。 |

浏览器断言位于 [`e2e/d5-table-b.spec.ts`](../../../e2e/d5-table-b.spec.ts)，覆盖筛选 draft/confirm/reset/cancel、Escape/outside、controlled rejection、即时重开、fixed/sticky 几何、loading 锁定、error 保留旧行、retry、empty、popup anchoring 和 iframe outside boundary。

## 早期移动缺陷与最终修正

此前移动场景首次结果为 `33/35`，另有 `4/4` 的移动定向结果记录；失败来自 outside 目标与移动时序竞态，不应被覆盖或静默改成 skip。该缺陷先保留为真实测试缺陷，随后以安全的 outside target 固化到测试候选 `8f70387`，再完成最终 `35/35`、`0 skip`。因此最终结果不是通过放宽断言、扩大等待或新增 skip 获得的。

## pageerror/console 口径

测试辅助函数同时登记 `pageerror` 和 `console` error；每个测试在结束时要求收集数组为空。该口径只对 D5-B 场景中的页面异常与 console error 作门禁，不能外推为所有浏览器、所有组件或所有 console 等级均已审计。

## 历史背景（不作为最终重跑）

较早的全仓记录为 `1383/641`，仅作为阶段背景保留，不能冒充本轮 D5-B 最终重跑，也不能替代 D5-A/B/C 的完整全仓复跑。当前报告的最终证据范围是上表的 D5-B `204` unit、`35/35/0 skip` 五浏览器、pageerror/console 边界以及 typecheck/build。

## 放行边界

本报告仅表示独立测试技术门禁通过，不放行产品、不批准 PR、不批准合并或发布。远端 CI、PR 状态、部署和用户最终产品验收仍须分别核对；D5-A、D5-C 及完整全仓 A/B/C 重跑不由本报告代替。
