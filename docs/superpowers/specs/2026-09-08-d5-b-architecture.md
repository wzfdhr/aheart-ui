# D5-B Table architecture freeze

状态：2026-09-08，RED 测试阶段；本文件只记录冻结契约，不授权实现或生成物变更。

## 公开 API

- `TableColumn.fixed` 仅接受 `left` / `right`。固定列必须是连续的左前缀或右后缀；前缀/后缀中出现空洞、非法值、非正数或无法解析为 px 的宽度时，该组整体降级为普通列。
- `TableColumn.filterDropdown` 提供草稿上下文；`filterDropdownOpen` 与 `defaultFilterDropdownOpen` 支持受控/非受控打开。Table 仅同时显示一个筛选浮层。
- `scroll.x` 为 `true | number | string`，`scroll.y` 为 `number | string`。`true` 触发布局测量并冻结自然宽度，数字/px 字符串转为最小宽度约束；y 在表内建立滚动容器。
- `sticky` 为 `boolean | { offsetHeader?: number }`。无 y 时固定表头依赖页面/祖先滚动容器；有 y 时固定表头属于表内滚动结构。
- `error` 为 `boolean | { message?: TableRenderable; retryText?: TableRenderable }`。错误保留当前 `dataSource`，只允许 retry；`loading` 优先于 error。
- `getPopupContainer(triggerNode)` 默认返回 trigger 的 `ownerDocument.body`，不得读取全局 window/document 代替 owner realm。
- 事件：`filterDropdownOpenChange(columnKey, open)`、`retry`；父层拒绝受控请求时 DOM 保持父层状态。

## 筛选状态机

筛选浮层维护 draft，不在输入时修改已提交值。Confirm 提交并关闭；Reset 立即清空已提交值、草稿并关闭；Cancel、Escape、outside、未确认关闭均丢弃 draft。Tab 在浮层可交互节点内循环，关闭后焦点返回触发器。第二个触发器打开时先关闭第一个，任一时刻只存在一个可见浮层。

## 交互锁定矩阵

| 状态 | 当前 dataSource | 查询/分页/选择 | customRender 内按钮 | error/retry |
| --- | --- | --- | --- | --- |
| idle | 展示 | 可交互 | 可交互 | 无 |
| loading | 保留并展示 | 全部锁定 | 锁定 | error 隐藏 |
| error | 保留并展示 | 仅 retry 可交互 | 锁定 | 展示 message/retryText |

## 布局不变量

组件只渲染一个原生 `table`；列宽通过 `colgroup` 与列元数据统一，selection/expand utility 列也必须参与 offset 计算。固定前缀从 `left: 0` 累加，固定后缀从 `right: 0` 反向累加；每个固定 cell 使用可审计的 sticky style。布局快照应能供 D5-C 的虚拟行层消费，但 D5-B 不实现虚拟滚动。

## SSR 与浮层 realm

SSR 输出必须不访问浏览器全局且重复渲染稳定。所有浮层的 popup container、事件监听、z-index 与位置测量以 trigger/popup 的 `ownerDocument` 为边界；`useFloatingPosition` 的 viewport、`computePosition` 和 `autoUpdate` 回归必须覆盖 iframe owner realm。真实页面 sticky 几何与页面/祖先滚动链留给 E2E 计划，不由 jsdom 单测宣称通过。
