# D2 浮层栈、焦点与无障碍验收记录

## 范围

- 新增内部 document 级 overlay controller，统一 Modal、Drawer 与浮动弹层的顶层 Escape、outside pointer、视觉层级和 owner tree。
- Modal/Drawer 增加引用计数 body scroll lock，并在 leave 动画结束前保持锁定。
- Dropdown、Tooltip、Popover、Popconfirm 修复 hover 延迟与 click/contextmenu/focus 竞态；Tooltip/Popover/Popconfirm 补真实焦点触发器与 popup 的 ARIA 关系。
- Cascader、TreeSelect 补稳定 `aria-controls`、`aria-activedescendant`、label/description 关联与键盘导航。

不包含公开 API/类型导出、主要依赖、包边界、全局视觉 token、组件视觉重设计、虚拟化、DnD 包或 AI 包改造。实体 iOS Safari 仍是独立于 Playwright mobile WebKit 的证据门禁，本记录不把自动化等同于实体设备验收。

## 开发实施

- 共享栈按 Document 隔离，支持 Teleport 后代递归 owner 判断与 `composedPath`；Escape/outside pointer 每次只分发给绝对顶层，顶层 `keyboard=false` 会阻断下层。
- Modal/Drawer 与浮动弹层从同一栈获得递增有效 z-index；显式 z-index 作为下限，不再出现键盘顶层与视觉顶层不一致。
- Modal/Drawer 按实际容器 Document 注册、锁滚动和恢复焦点；Safari/WebKit pointer 打开不聚焦按钮时，使用最近 pointer opener，keyboard 输入会清除该候选。
- scroll lock 保存并恢复原始 `overflow`/`padding-right`，多层引用计数归零且 leave 完成后才释放。
- `useTriggerAria` 只向真实可聚焦 slot 后代同步关系，合并并在卸载时恢复原有 token 属性。
- Cascader/TreeSelect 使用 Vue SSR 稳定 ID；活动项不可见、搜索过滤或弹层关闭时不保留悬空 active descendant。

## 开发经理复审

- [x] 新增 helper 不从公共入口导出，未改变公开 props/events/types、包边界或主要依赖。
- [x] attached document 由集中监听处理；detached/custom host 仅走本地兜底，受控拒绝关闭仍只发出一次请求。
- [x] mixed Modal/Drawer/Floating 的 owner document、z-index、Escape、focus restore 与 leave 生命周期一致。
- [x] source 与 es/lib 生成产物配对，diff 无无关 `pnpm-workspace.yaml` 漂移。
- [x] 开发经理复审与测试经理复审均确认 P1=0、P2=0。

## 测试经理测试

- [x] overlay controller、floating dismiss、trigger ARIA、Modal/Drawer、Dropdown/Tooltip/Popover/Popconfirm、Cascader/TreeSelect 专项通过。
- [x] leave scroll lock、custom owner document、受控拒绝、pointer opener、递归 Teleport、z-index、hover timer、focusout、SSR stable ID 与自动卸载均有回归测试。
- [x] 全量 unit（components 66 files / 1026 tests、DnD 44、AI 63、scripts 86）、typecheck、组件/docs build 与 D2 ESM/CommonJS 配对契约通过。
- [x] D2 嵌套路径在 Desktop Chromium、Mobile Chromium、Firefox、Desktop WebKit、Mobile WebKit 通过（5/5）。
- [x] 三包 tarball 通过（components 943 files、DnD 71、AI 111）。
- [x] 构建确定性与完整 Desktop WebKit R1 通过（9/9）。
- [x] QG4 desktop 通过（14 passed / 3 skipped），axe、hydration、键盘与既有截图基线无未解释回退。
- [ ] GitHub PR CI 与 master CI 全绿。

## 设计审核

- [x] 1440×900 下 Modal、teleported Popover、Drawer、Drawer 上层 Modal 的遮罩、层级、定位与焦点环通过截图检查。
- [x] 390×844 下 Modal/Popover 不越界，Drawer 保持窄屏安全宽度，上层 Modal 完整覆盖 Drawer。
- [x] 设计审核发现并修复“行为顶层正确但 Drawer 视觉压住上层 Modal”的 z-index P1；复拍后通过。
- [x] 未修改全局设计基础、组件 token、既有布局或文案体系。

## 产品经理最终验收

- [x] 一次 Escape 只关闭 Popover → 上层 Modal → Drawer → 外层 Modal 中的当前最上层。
- [x] 每层关闭后焦点回到该层实际 opener；Safari/WebKit pointer 入口与 keyboard 入口均可观察。
- [x] 多层打开期间页面保持不可滚动，最后一层完全离场后恢复原始页面样式。
- [x] Cascader/TreeSelect 键盘活动项与触发器 ARIA 引用保持可见、稳定且 SSR 一致。
- [x] 开发/测试复审后 P1/P2 为零。
- [ ] PR 留存完成，合并 master 后远端 CI 绿色。

## GitHub 留存

- 分支：`codex/d2-overlay-focus`
- PR：待创建
- 合并提交：待完成
- master CI：待完成
