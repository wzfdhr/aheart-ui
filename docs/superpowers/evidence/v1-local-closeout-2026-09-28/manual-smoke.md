# 本地文档与交互验收

日期：2026-09-28

预览：收尾工作树通过 VitePress production preview 提供 `http://127.0.0.1:5185/`。手工交互使用桌面浏览器，截图使用该预览构建；当前收尾只改了文档与验收用例，未改组件运行时代码。

## 鼠标与键盘路径

- **Table**：按 `Ada` 筛选并确认结果；在受控单选组中尝试被父层拒绝的选择，原选中行保留且请求计数增加；翻到第 2 页，确认显示第二页客户。
- **DatePicker**：打开日期时间面板，选择 7 月 15 日并确认；重新打开后选择 7 月 16 日草稿，按 Escape 取消，值恢复为 7 月 15 日，焦点回到触发控件。
- **Upload**：选择本地无害文本文件，观察 50% 进度，再按“完成上传”进入完成状态。该演示只验证组件本地状态；组件不提供上传服务，未向服务器传文件。
- **DnD**：先用 `Alt+↓` 把“整理需求”移到第 2 位，再用鼠标拖到第 3 位；更新事件和 change 事件计数各为 2。
- **Splitter**：聚焦分隔线后按 `ArrowRight`，首栏宽度从 120 变为 130；再用鼠标拖动，宽度变为 148。
- **Modal**：打开基础弹窗并按 Escape 关闭；焦点返回“打开弹窗”触发按钮。
- **AI Agent Workbench**：切换到来源数据产物预览并点击“批准”；演示任务状态变为完成并显示“已批准”。该示例仅改变本地 Vue 状态，不调用业务服务。

## 桌面、移动和主题检查

- 桌面视口截图覆盖 Table 全页及首屏、DatePicker、Upload、DnD、Splitter、Workbench；Workbench 另有批准与产物预览状态截图。
- `table-mobile.png` 使用 iPhone 13 视口；人工检查页面标题、导航和正文在窄屏内可读。触控交互另外由五项目 Playwright E2E 矩阵验证。
- VitePress 切换到暗色后，文档外壳变暗，Table 仍使用浅色默认 token。`theme-smoke.json` 记录这个默认行为，以及覆盖 `html.dark` 下的 Aheart 变量后表格背景由 `rgb(255, 255, 255)` 变为 `rgb(17, 19, 24)`。
- 同一浏览器上下文启用 `prefers-reduced-motion: reduce` 时，`--aheart-motion-duration` 计算值为 `0ms`。主题文档已说明内置浅色默认值、应用自定义暗色变量与减少动态效果行为。

## 截图索引

- `table-desktop.png`：Table 文档全页。
- `table-desktop-viewport.png`、`table-mobile.png`：桌面与 iPhone 13 窄屏首屏。
- `table-dark-desktop.png`、`table-dark-custom.png`：暗色文档外壳下的默认组件 token，以及应用覆盖变量后的表格状态。
- `date-picker-desktop.png`、`upload-desktop.png`、`dnd-desktop.png`、`splitter-desktop.png`：交互组件文档首屏。
- `workbench-desktop.png`、`workbench-approved.png`、`workbench-interaction.json`：Workbench 初始态与批准/产物预览后的状态。

本记录描述本地组件演示验收，不代表真实上传、业务后端审批、物理 iOS Safari 或独立设计/产品签字已经完成。
