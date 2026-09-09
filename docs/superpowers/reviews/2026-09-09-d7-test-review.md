# D7 DnD 独立测试经理报告

## 结论

候选 SHA：`684170d2b785b8ce834b1be86253f45d3f10e79c`（`fix(dnd): defer native session cleanup`）。

独立测试结论：`P0=0 / P1=0 / P2=0`。D7 七项已具备独立测试证据，允许进入产品验收；本报告不等同于产品验收、PR/CI、合并、Pages 或发布放行。

## 定向自动化结果

| 门禁 | 命令/范围 | 结果 |
| --- | --- | --- |
| DnD unit | `corepack pnpm --filter @aheart-ui/dnd test` | 5 files, **79 passed / 79** |
| DnD typecheck | `corepack pnpm --filter @aheart-ui/dnd typecheck` | passed |
| 受影响 native 回归 | `AHEART_E2E_PORT=5304 ... dnd-splitter.spec.ts --project=desktop --grep "reorders a list once\|keeps legacy desktop whole-item\|moves across lists and accepts an empty destination"` | **3 passed / 3** |
| D7 + 既有 DnD/Splitter | `AHEART_E2E_PORT=5304 corepack pnpm exec playwright test e2e/d7-dnd.spec.ts e2e/dnd-splitter.spec.ts` | **135 passed / 50 skipped / 0 failed**，185 tests，五项目 |
| generated | `corepack pnpm check:generated` | passed |
| whitespace | `git diff --check` | passed |

完整矩阵包含 D7 五项目 25 项，D7 自身 25/25 通过。D7 测试的 `afterEach` 收集 `pageerror` 以及 error/Vue warning console 事件；通过结果证明该矩阵无运行时错误。既有 dnd-splitter 测试同样在各场景中保留运行时错误断言。

早期候选 `c9ed039` 曾在既有 native pointer 场景出现 11 项回归（同列表、legacy whole-item、跨列表）；该问题在 `727af42` 后仍可由 3 项 desktop 定向复现。`684170d` 修复 source native session cleanup 时序后，3 项定向和完整 185 项矩阵均通过；失败证据未删除，保留在独立 evidence 目录中。

## 七项逐条证据

1. **稳定 itemKey**：D7 contract/regression/resource unit 覆盖 key identity、重定位、重复/缺失 key 安全拒绝；D7 浏览器场景及 consumer `sortableStableKey=true` 通过。
2. **revision 过期拒绝**：unit、D7 stale-refresh 浏览器场景及 consumer `sortableRevision=true` 通过，过期 drop 不更新权威列表。
3. **跨列表事务与父拒绝回滚**：unit 覆盖 candidate/rollback/settle；D7 浏览器场景验证单侧父拒绝、并发字段保留、事件顺序；consumer `sortableControlledRollback=true` 通过。
4. **Draggable/DropZone 键盘替代操作**：D7 五项目覆盖 Space/Enter/Escape、兼容/不兼容/禁用目标和焦点恢复；consumer `genericKeyboard=true` 通过。
5. **live region**：unit 与浏览器场景验证成功、失败原因、源/目标播报；D7 五项目无 runtime error。
6. **ownerDocument/iframe 自动滚动**：D7 五项目验证 iframe nested auto-scroll 和 frame detach；consumer `ownerDocumentCleanup=true`，owner-detached 与 live region 清理通过。
7. **动态数据/生命周期**：resource unit 覆盖迟到 native/touch callback、刷新、插入/删除、重复 drop、卸载、scope/session cleanup；D7 浏览器场景验证 refresh stale rejection、scope navigation、late drop/unmount、iframe detach。

## SSR、hydration 与 consumer

以最终生成物重新打包并在无 workspace 软链临时 consumer 中运行：

- tarball SHA-256：`9cea27e357f1b42376f2b0147dd2448fcab0500f2627a66c106b98dc7f8ee20d`
- 包文件数：79；`symlink=false`
- ESM/CJS、类型、CSS、SSR deterministic、hydration、generic keyboard、stable key、revision、controlled rollback、ownerDocument cleanup：全部 `true`
- consumer 结果：`status=passed`

证据见 `docs/superpowers/evidence/d7-independent/consumer-final/run/results.json`。

## skip / todo / only / force / timeout 审计

对 `b6630ceb31c3d30e4bdc6529c622354b1e34c181...684170d` 的 D7 相关 diff 逐行核对：

- 新增 `test.skip` / `it.skip` / `describe.skip`：0
- 新增 `test.only` / `it.only` / `describe.only`：0
- 新增 `test.todo` / `it.todo` / `describe.todo` / `fixme`：0
- 新增 `force: true`：0
- 新增 timeout 属性或扩大既有 timeout：0

联合矩阵的 50 个 skip 来自既有 `dnd-splitter.spec.ts` 的项目能力边界（mobile-only、mobile-webkit scripted input、desktop native auto-scroll 等），D7 新测试没有 skip。相关原始 diff 审计见 `docs/superpowers/evidence/d7-independent/directive-diff-684170d.txt`。

## 独立放行意见

测试经理放行 D7 进入产品验收。产品验收仍需由产品角色逐条确认七项体验与失败文案；之后还需按主流程完成设计/PR CI/合并/Pages 等独立门禁。本轮未运行全仓 E2E，避免把定向 D7 结果扩大为全仓质量结论。
