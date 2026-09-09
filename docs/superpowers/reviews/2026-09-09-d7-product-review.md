# D7 DnD 独立产品经理验收

日期：2026-09-09
被审候选：`684170d2b785b8ce834b1be86253f45d3f10e79c`
生产实现基线：已合并 master `b6630ceb31c3d30e4bdc6529c622354b1e34c181`

## 总裁定

D7 七项产品范围逐项接受，用户成功、拒绝、取消、恢复路径均可理解且有对应反馈；本轮产品审查未发现 P0/P1/P2，结果为 `0/0/0`。允许创建普通 Ready PR；不替代 PR head CI、merge、master CI、Pages 或线上验收。

## 七项逐条验收

1. **稳定 `itemKey`：接受。** 拖动后按业务 key 重定位；插入、删除、缺失或重复 key 不会退回旧 DOM index。重复键在移动端截图中显示为“已安全拒绝（键重复）”，没有把 `duplicate-key` 机器码直接暴露给用户。
2. **revision 过期拒绝：接受。** 刷新 revision 后旧拖动被拒绝，未修改权威列表，并给出“数据已更新，请重试”语义。截图中“过期拒绝原因：等待验证”属于夹具的待触发状态，独立测试与 consumer 已覆盖真实 stale rejection。
3. **跨列表父拒绝回滚：接受。** 一侧接受、另一侧拒绝时恢复原有序列表并保留并发字段；截图明确显示“父层拒绝，列表已回滚”“并发字段：已保留”“候选 → 回滚”。不把事务 ID、session ID 或完整 JSON 默认铺给用户。
4. **Draggable/DropZone 通用键盘取放：接受。** Tab、Space/Enter 抓取与放置、Escape 取消、焦点恢复、禁用/不兼容目标均有可见状态和自动化证据；移动端单列重排后说明仍完整可读。
5. **live region 源/目标/失败/结果播报：接受。** 成功目标、类型不匹配、禁用、分组不兼容、父拒绝、过期和取消均有明确中文播报；连续相同文案可重新触发，未出现裸内部类型或拒绝码作为用户文案。
6. **ownerDocument/iframe 自动滚动：接受。** iframe 与主文档的 owner realm、嵌套滚动、frame detach 清理均有五浏览器与 consumer 证据；截图可见 iframe 条目、抓取入口和 owner live region 状态。未将 mobile WebKit 冒充物理 iOS。
7. **插入/删除/刷新/卸载/路由处理：接受。** 旧 session、迟到 drop/pointerup、scopeKey 路由切换、列表/item 卸载和 iframe detach 均安全结束；成功路径只提交一次，取消/拒绝路径保持零错误更新或完成回滚。

## 用户路径与视觉步骤

1. 桌面键盘抓取与兼容目标：健康；源、目标和成功/取消状态清楚（[截图](../evidence/d7/visual/01-desktop-generic-keyboard.png)）。
2. 桌面不兼容目标：健康；目标保持可聚焦并显示“类型不匹配”（[截图](../evidence/d7/visual/02-desktop-generic-mismatch.png)）。
3. 桌面父拒绝回滚：健康；回滚结果、并发字段和事务过程均可读，审计详情默认折叠（[截图](../evidence/d7/visual/03-desktop-parent-rejection-rollback.png)）。
4. 移动端键盘抓取：健康；390px 单列布局无横向裁切，键盘说明仍完整（[截图](../evidence/d7/visual/04-mobile390-generic-keyboard.png)）。
5. 移动端回滚与重复键：健康；失败原因可读，机器码未进入主路径文案（[截图](../evidence/d7/visual/05a-mobile390-rollback-duplicate.png)）。
6. 移动端 scope/迟到回调与 iframe：健康；路由取消、迟到 drop、iframe 状态分开呈现（[截图](../evidence/d7/visual/05b-mobile390-scope-iframe.png)）。
7. 桌面 iframe owner-realm：健康；抓取控件、条目边界和 owner live region 状态可辨（[截图](../evidence/d7/visual/06-desktop-iframe-owner-scroll.png)）。

## 验收依据

- [D7 架构规格](../specs/2026-09-09-d7-dnd-architecture.md)：冻结 stable key、revision、事务回滚、键盘、播报与 owner realm 边界。
- [开发复审](./2026-09-09-d7-dev-review.md)：P0/P1/P2=`0/0/0`，D7 定向单测 `79/79`，未发现范围越界。
- [独立测试经理报告](./2026-09-09-d7-test-review.md)：D7 五项目 `25/25`，D7+既有 DnD/Splitter `135 passed / 50 existing skips / 0 failed`；无新增 skip、todo、only、force 或 timeout 放宽。
- [设计审核](./2026-09-09-d7-design-review.md)：7 张最终图均通过；runtime errors 为空；移动端和机器码可读性问题已修复。
- [最终 consumer](../evidence/d7-independent/consumer-final/run/results.json)：无 workspace symlink，types/ESM/CJS/CSS/SSR/hydration、generic keyboard、stable key、revision、controlled rollback、ownerDocument cleanup 全部为 `true`。
- [最终截图清单](../evidence/d7/visual/manifest.json)：7 张截图、桌面/移动 viewport、无 runtime errors。

## 边界与后续门禁

本验收只覆盖 D7 DnD 七项；不启动 D8/v2、不包含 D4 Tree/TreeSelect/Cascader 延期虚拟化、不包含 D9 物理 iOS/设备门禁或 npm 发布。D7 产品通过不等于 PR CI、merge、master CI、Pages 或线上 DnD 已完成；这些仍需独立闭环。

截图不能单独证明完整 WCAG、读屏、SSR/hydration、cleanup 或所有跨浏览器行为；相应结论仅引用 unit/E2E/consumer 证据。mobile WebKit 不是物理 iOS Safari。
