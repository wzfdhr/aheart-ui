# D0 可信基线恢复验收记录

## 范围

- WebKit Modal 在进入阶段的 Escape 关闭与触发器焦点恢复。
- `@aheart-ui/dnd` 的真实包入口与业务对象泛型解析。
- QG4 质量矩阵只登记真实完成的无障碍与视觉证据。
- GitHub Pages 仅部署同一 SHA 的成功 CI 结果。
- 三个发布包的 tarball、类型、构建与测试基线。

不包含 D1 状态内核、D2 浮层栈、公开 API 扩展、依赖升级或全局视觉基础调整。

## 开发实施

- Modal 在 `open` 后的下一次 DOM 更新即尝试聚焦；进入动画期间若焦点仍停留在本实例触发器上，Escape 由实例级兜底处理。
- Modal 的进入阶段监听在卸载时移除；受控父组件拒绝关闭、`keyboard=false`、离场焦点保持和关闭后恢复语义不变。
- SortableList 使用消费数据泛型贯穿 `items`、`v-model:items`、`change` 和 item slot；测试不再用 `paths` 绕过包入口。
- QG4 覆盖清单成为质量矩阵和 Playwright 测试的共同数据源：真实证据与待验收项互斥。
- Pages 改由 `CI` 在 `master` 上成功完成后触发，并 checkout 被验证的准确 SHA。

## 开发经理复审

- [x] Modal 修复限定在 Modal-only 打开栈与进入竞态，不扩展到其他浮层组件。
- [x] DnD 运行时事件与 props 名称未改变，生成的 ESM/CJS 声明一致。
- [x] QG4 未把代表页面结果冒充为 48 个组件全覆盖。
- [x] Pages deploy 对 CI 失败保持不可达。
- [x] diff 无无关改动，主工作区未被触碰。

## 测试经理测试

- [x] Modal 单元测试通过（56/56，含进入阶段、Teleport/inline 嵌套与初始双开）。
- [ ] Desktop WebKit Modal 连续 20 次通过，零重试、零失败。
- [x] DnD 单元、typecheck、真实 exports 消费端类型测试通过。
- [x] QG4 desktop 自动化与截图基线通过（14 passed / 3 skipped）。
- [ ] 全量 unit、typecheck、构建确定性、docs build、三包 tarball 通过。
- [ ] GitHub PR CI 全绿，master 合并后 CI 全绿。

## 设计审核

- [x] 本阶段没有 CSS、视觉 token 或组件模板结构变化。
- [x] 既有 QG4 桌面截图无未解释差异。
- [x] 中文质量矩阵明确区分真实证据与待验收，不误导使用者。

## 产品经理最终验收

- [ ] 用户从 Modal 触发按钮打开对话框后可立即按 Escape 关闭，焦点返回原按钮。
- [ ] 用户以普通 `Task[]` 使用 SortableList 时，值、事件和 slot 均保留业务类型。
- [ ] CI 失败的 SHA 不会发布到 Pages。
- [ ] P1/P2 为零。
- [ ] PR 留存完成，合并 master 后远端 CI 恢复绿色。

## GitHub 留存

- 分支：`codex/d0-quality-recovery`
- PR：待创建
- 合并提交：待完成
- master CI：待完成
