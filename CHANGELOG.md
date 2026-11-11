# 更新日志

Aheart UI 的重要变更统一记录在本文件中。

## [1.3.0-preview.1]（候选）

配套预览版本为 `@aheart-ui/dnd@1.1.0-preview.1` 和 `@aheart-ui/ai@1.1.0-preview.1`。

- 基础包提供 Button、Modal、Select 和 Combobox 子入口，以及主题、组件和全量 CSS 入口。
- 新增 Combobox。Popover、Tooltip、Dropdown、Modal、Drawer、Select 和 Picker 系列复用浮层定位与交互逻辑。
- AI 提供 Chat、Agent、Workbench 子入口和独立 CSS。DND 提供 Sortable、Draggable、DropZone 和 DragOverlay 子入口与样式。
- `aheart-ui/resolver` 支持 Vite 自动导入已提供子入口的组件。迁移示例覆盖手动导入、Resolver 和旧入口回退。
- 修复 Card 在 `skipLibCheck: false` 下的公开类型错误和默认按钮悬停文字对比度。根插件与旧全量 CSS 路径继续支持 v1 消费端。

## [1.1.0] - 2026-09-29

### 新增与改进

- Select、Tree、TreeSelect、Cascader 与 Table 增加大数据虚拟化能力及相应交互保护。
- Form.List、表格分页与选择、Picker/Upload、浮层焦点管理、DnD/Splitter 和 AI 工作流稳定性得到增强。
- 核心包根入口支持更有效的按需导入；CI 增加分支覆盖率、独立 tarball 消费和五浏览器质量门禁。
- 更新 PostCSS 与 nanoid 依赖以修复已知安全问题，并验证 ESM、CommonJS、类型、CSS、SSR 与 hydration 消费路径。

### 发布范围

- 核心组件包：`aheart-ui@1.1.0`。
- 首次发布的领域包：`@aheart-ui/dnd@1.0.0`、`@aheart-ui/ai@1.0.0`。
- 三个 tarball 必须从同一主线提交生成；公开 registry 安装验证和 tag/Release 状态以该提交的发布证据为准。

## [1.0.0] - 2026-09-01

### 新增

- 48 个中文 Ready 组件与完整 VitePress 演示站。
- `aheart-ui` 基础组件、表单、数据展示、浮层、日期时间、树和 Splitter。
- `@aheart-ui/dnd` 通用拖拽、排序、跨列表移动与键盘替代操作。
- `@aheart-ui/ai` AI 对话、智能表单和 Agent 工作台。
- 中英文运行时 locale pack、统一浮层定位、Presence 动效和 reduced-motion 支持。
- 基于共享 Picker 内核的 DatePicker、TimePicker、DateRangePicker 与 TimeRangePicker，支持多模式、预设、12 小时制、禁用规则和字符串业务值。
- AIForm 的 `date-range` 与 `time-range` 安全 schema 字段映射。
- 三包 tarball 合约验证、全量 CI 和发布前质量门禁。

### 发布状态

- 核心包 `aheart-ui@1.0.0` 已于 2026-09-01 发布到 npm。
- `@aheart-ui/dnd` 与 `@aheart-ui/ai` 尚未发布；Git tag 与 GitHub Release 尚未创建。
- 本版本按产品决策继续暂停英文文档。
