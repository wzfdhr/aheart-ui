# D6 independent test manager review

被审候选：`418cd0022ee6c8321c5036651fedce9b00454ba7`。审查者未参与 D6 实现，执行只读 diff/test 审核；本报告不代表产品、PR、merge 或发布完成。

## Final verdict

P0/P1/P2 = `0/0/0`，放行进入产品验收。

| Gate | Independent result |
| --- | --- |
| Picker + Upload scoped unit | 14 files，184 passed |
| ConfigProvider locale unit | 10 passed |
| D6 five-project browser | 30 passed，0 skipped，0 failed，独占端口 5293 |
| Runtime errors | pageerror 与 Vue warning 收集为空 |
| SSR / cleanup | Upload SSR deterministic；unmount/abort/ResizeObserver/timer cleanup 有独立断言 |
| Consumer | real tgz types/ESM/CJS/CSS/SSR/hydration/interaction passed |
| Complete repository E2E | first RED 591 passed / 127 existing skips / 7 failed; repaired legacy expectations; final 598 passed / 127 existing skips / 0 failed |

## Test integrity review

- 未发现 `skip`、`todo`、`.only`、`force` 或扩大 timeout。
- `e2e/upload.spec.ts` 删除的旧 “Retry 后等待手动上传” 断言与 D6 新规格冲突；新契约是 Retry 重新校验并直接创建新任务。替换后新增 cancel/late callback/timeout/validation 独立覆盖，不是缩小断言。
- `taskId`、AbortSignal、同 UID controlled replacement、unmount、throwing abort handle 均由 unit 独立观察，不依赖组件内部实现细节自证。
- 初次审查发现 consumer types 与设计报告 EOF 多余空行两个 P2；主线程已清理并重新执行 `git diff --check origin/master`，P2 关闭。

## Boundaries

mobile WebKit 不是物理 iOS Safari；D9 设备门禁仍独立。当前结论只放行产品验收，不能替代完整仓库 E2E、远端 CI、合并、Pages 或线上验收。
