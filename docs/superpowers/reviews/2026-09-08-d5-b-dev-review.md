# D5-B 独立开发技术终审

候选 HEAD：`8f8c52663d1991201b5e0a30d3db33eebe4563c2`（仅记录审查文档的最终候选）。

生产基线：`c7dd91a5ebdfbd31d10b7cbfce1878e1e49fba4b`；独立测试候选：`8f70387996a170ce31bdbcc5a24c6c2fc2011474`。本报告只覆盖 D5-B 筛选浮层、固定布局、loading/error/empty 韧性与焦点/关闭时序，不扩展到 D5-C 虚拟滚动。

## 结论

开发终审的最终技术门禁通过：精确 jsdom 复核与 D5-B 五浏览器 25/25 均通过，最终未发现 P0、P1 或 P2。该结论不等于产品放行，也不等于 PR、远端 CI、合并、部署或发布完成。

## Astra 终审的真实拦截链

下表保留历次拦截，不以最终绿色结果抹除中间的失败与修正。

| 阶段 | 真实问题/门禁 | 处理与证据 | 结论 |
| --- | --- | --- | --- |
| `ab937cb` | 筛选浮层交互审查中，popup lock 属 P1；dialog accessible name 属 P2。同期还确认 resilient 状态必须保留旧行，不能由 error 层遮住 stale data。 | `ab937cb53e33f2ebc20acec645000dcce725bcf6` 修复 stale rows 与状态呈现；保留原始失败记录和后续针对性断言。 | 未放行，继续修复。 |
| `8722d75` | 第二轮发现 stale/outside 关闭时序为 P1；controlled focus 恢复/锁定行为为 P2。浮层在状态转换期间可能被外部关闭或焦点落错。 | `8722d7515cffc51496124b2087af8895d57d4154` 收紧 popup lock、outside dismiss 与 focus 行为，并保留生成物同步。 | 未放行，继续进入时序复核。 |
| `c96f801` | outside-dismiss 延迟与新一代 popup 的竞态仍触发 unit 门禁；旧 outside 回调不得关闭新打开的浮层。 | `c96f801a6442fb6a18147f029d1f8f47ef475578` 按 active generation 约束关闭回调；unit 门禁在此处作为必须通过的拦截点。 | 只有在该门禁修正后才可进入最终复核。 |
| `c7dd91a` | 最终生产实现需要与测试契约精确对齐，避免过宽的 outside 关闭或残留延迟。 | `c7dd91a5ebdfbd31d10b7cbfce1878e1e49fba4b` 完成最终精确实现；精确 jsdom 结果通过，D5-B 五浏览器最终 25/25 通过。 | P0/P1/P2 均为 0。 |

## 复核范围

- 筛选 popup 的可访问名称、输入与 Confirm/Reset/Cancel 布局、Escape、outside close、controlled rejection 和焦点恢复。
- loading/error/empty 状态下旧数据保留、动作锁定、retry 与空状态呈现。
- fixed/sticky 列、utility offset、滚动容器、窄视口与 popup anchoring。
- iframe/outside boundary 及新旧 popup 交替打开的 generation 时序。
- 源码、`es/lib` 生成物和对应 D5-B 测试契约的一致性。

## 放行边界

本报告是独立开发技术复审记录，结论仅表示 D5-B 代码级 P0/P1/P2 技术问题在最终范围内清零。它不批准产品验收、PR 创建或合并，不代表远端 CI、Pages/部署、npm 发布或 D5 总体完成；D5-C 仍是独立范围。

## 86464cb 受影响终审补充

首次产品复核发现 resilient-state 文案没有完整走 ConfigProvider locale，记录为产品 P2，因而当时不放行。`86464cb` 修复并同步 `src`、`es`、`lib` 的 locale 文案读取；针对受影响路径的终审结果为 P0/P1/P2 `0/0/0`。

该修复后的受影响终审同时复核 unit `207`、D5-B 五浏览器 E2E `35/35`，以及 typecheck/build，均通过。此补充只更新受 `86464cb` 影响的最终门禁证据，不抹除上文历史候选与拦截记录；产品批准 D5-B 进入 D5-C，但仍不放行 PR、合并、部署或发布。
