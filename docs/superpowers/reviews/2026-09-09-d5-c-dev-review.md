# D5-C 独立开发技术终审

候选 HEAD：`cde5e665b69a4ce31a8bc1e35cd969004e1426cc`。本报告只覆盖 Table D5-C 行虚拟化、动态测量、固定列、展开/选择/焦点、SSR/fallback 与性能契约；不扩展 D5-A/B 或其他组件。

## 结论

Astra 架构终审的六轮 RED 拦截已逐轮清零。最终生产修复 `3737849` 与 `d1d672e`，并结合 `2e63b4f`、`e369db7` 等测试/实现收口，在 `cde5e66` 候选范围内开发复核未发现 P0、P1、P2。历史问题、失败与回归均保留，不以最终绿色结果覆盖。

## 真实开发拦截与修复链

| 阶段 | 拦截内容 | 修复/收口 |
| --- | --- | --- |
| 首实现 `98b020d` | 首版 TanStack row virtualization 仅建立基础窗口；动态测量、逻辑 row/key、SSR/fallback、焦点和固定列组合仍未达到契约。 | 作为历史首实现保留，后续架构 RED 继续暴露缺口。 |
| 回归 `a544478` | 首轮补强引入 virtualization regression，测量与行索引/展开组合、滚动优先级和清理边界需要重新收紧。 | 完成 TanStack 适配与 `measureElement`/ResizeObserver、逻辑行索引及清理路径，进入下一轮 RED。 |
| Astra RED 六轮 | 依次覆盖 TanStack 接入、measurement、稳定 key/page、focus 保留与 Tab bridge、fixed/窄布局、radio/spacer/SSR/iframe cleanup 等架构契约；每轮失败均保留在 `docs/superpowers/evidence/d5-c/red/`。 | 按契约逐轮修正，未通过扩大 timeout、删除断言或新增 skip 绕过。 |
| `e369db7` 等 | Tab 离开时的 source 保留、custom rendered rows 的 Tab bridge 与 focus ownership 仍有边界缺口。 | 修复 tab/source 扫描与 row bridge；同时保留 focused row 在滚出窗口时，外部 focus 后再释放。 |
| `2e63b4f`、`507f4e8`、`38931f3` | fixed 列在窄布局下存在降级/可达性与 Status 裁切、透明透底问题；固定列触发器不能只在宽屏可达。 | 以实际渲染宽度计算 collision/downgrade，增加窄 utility 预算、`reserve64` 与移动可读性断言。 |
| `cf70727` → `3737849`、`1e0f93e` | expanded 行背景被基础 opaque 层覆盖，测试对可选 hover token 的契约也需准确表达。 | `3737849` 恢复 expanded cell visual layer；`1e0f93e` 只校正测试对 optional hover token 的断言。 |
| `9593143` → `d1d672e` | spacer row 参与视觉位移，性能门禁暴露虚拟滚动 CLS `0.3531`（P1），不是可接受的稳定布局。 | 排除 virtual spacer 的视觉位移并处理 overflow-anchor；最终五轮 CLS 为 `0.0014698361`。 |
| 生产组合 `3737849` + `d1d672e` + `2e63b4f`/`e369db7` 等 | 最终候选需同时满足源码、es/lib 生成物、焦点/Tab、fixed/radio、SSR/fallback、移动可达性和视觉层契约。 | 在 `cde5e66` 候选下精确开发复核 P0/P1/P2 = 0。 |

## 最终复核覆盖

- TanStack 虚拟窗口、动态 measurement、稳定 key 与 page/index 映射、展开行作为单一逻辑 item。
- 实际 focused row pinning、滚出窗口后的 focus 保留、外部 focus 释放、Tab bridge 与原生 radio 拒绝后的整组恢复。
- fixed/sticky 列与窄布局 downgrade、utility/spacer 几何、移动端 fixed reachability 与可读性。
- SSR 两次稳定输出、virtual=false full-DOM、rowSpan 不支持时 fallback、iframe ownerDocument 的 observer/RAF/listener 清理。
- spacer 视觉层、expanded/selected/focus 层叠、CLS、long-task 与 gzip/package 边界。

## 放行边界

本报告只表示 D5-C 独立开发技术复审在最终候选内无 P0/P1/P2。它不放行产品，不批准 PR、远端 CI、合并、部署或发布；D5 总体关闭仍需分别核对产品验收及其他阶段门禁。
