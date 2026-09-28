# 本地收尾差异审查

日期：2026-09-28。以下是执行代理对收尾差异的四个角度复核，不是独立人员签字。

## 开发

- 没有修改组件运行时代码、公开 API 或生成的 `es/lib`；差异集中在发布文档、D9 状态、E2E 测试和验收证据。
- Q3 在异步 Vue hydration 后再检查 Checkbox 焦点与 TreeSelect 触控目标；键盘用 Tab/Shift+Tab 建立键盘操作上下文后再断言焦点环。
- QG5 仅在 WebKit 主文档、GET/XHR、`Sec-Fetch-Dest: empty`、活动路由 referer、哈希 Markdown 资源等条件同时满足时，忽略精确的取消原因；Chromium 和普通资源取消仍会失败。
- `pnpm check:build-determinism` 的现有验证通过；最终候选 SHA 的完整门禁结果见本目录的最终报告。

## 测试

- 组件、DnD、AI 单测当前复核分别为 1485、79、200 项通过；R1 的 14 个文件均不低于 80%，聚合 3311/3828（86.49%）。
- 初次完整浏览器矩阵 955 项中 828 项通过、127 项由项目配置跳过、0 项失败；`test-results/.last-run.json` 记录 `status: passed` 和空 `failedTests`。
- WebKit 20 个已取消 Markdown 预取资源的历史失败被单独记录。原始 trace 已被后续 Playwright 运行覆盖；证据 JSON 不冒充原始 trace。
- 三个隔离 tarball consumer 与最终 `CI=true` 门禁待本目录最终报告绑定到候选提交。

## 设计

- 检查了 Table、DatePicker、Upload、DnD、Splitter、Workbench 的桌面画面，以及 Table 的 iPhone 13 画面；相关截图和 Workbench 成功状态截图与本文件同目录。
- 暗色文档外壳不会自动把所有组件 token 变为暗色。用应用级 `html.dark` 变量覆盖后，Table 背景从 `rgb(255, 255, 255)` 变为 `rgb(17, 19, 24)`；系统减少动态效果时 motion token 为 `0ms`。`docs/guide/theme.md` 已说明边界与配置方式。
- 桌面手工鼠标/键盘路径和移动触控 E2E 分开记录；移动人工验收证据不等同于物理 iOS Safari。

## 产品

- `CHANGELOG.md` 现在如实区分已发布的 `aheart-ui@1.0.0` 与未发布的 `aheart-ui@1.1.0`、`@aheart-ui/dnd@1.0.0`、`@aheart-ui/ai@1.0.0`。
- Upload 演示只改变本地任务状态，不接真实上传服务；Workbench 审批只记录本地组件状态，不调用业务后端。验收报告不会把这些演示说成生产集成。
- 发布指南明确失败停止点、registry 回滚限制和修复版流程；本轮没有执行 `npm publish`、创建 npm tag 或 GitHub Release。
- P0/P1：当前差异未发现。未关闭的发布外部项：最终四角色人工 D9 签字、物理 iOS Safari、同一主线 SHA 连续 10 次 QG5、三个包的 npm 发布与 registry 安装。
