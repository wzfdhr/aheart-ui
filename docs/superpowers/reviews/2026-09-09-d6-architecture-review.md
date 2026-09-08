# D6 independent architecture review

基线：`759daca733791e17eec0e462bfd1fb9a1bea9b7c`。范围依据 D6 原始 Picker / Upload 八项清单；本报告不代表实现、测试、设计、产品、PR 或发布完成。

## Review findings before implementation

- P1：TimePicker 与 TimeRangePicker 都用 `scrollTop / 28` 推导值，在字体、zoom、移动端或自定义样式下会选错。
- P1：Upload 仅用 uid active set；旧任务在 retry/replacement 后可迟到覆盖新任务，remove 也未真正 abort transport。
- P1：Upload 无 timeout，pending transport 可永久保持 uploading。
- P1：Picker 四组件对 input/cell/preset/clear/Escape/disabled 的 draft/commit 路径分散，range clear 与 focus restore 存在不同语义。
- P2：Upload 文案借用 `datePicker.locale` 判断语言，没有独立 locale 所有权。
- P2：旧 `date-utils` 与 `picker-core` 重复；直接删除又会破坏深层消费者入口。

## Frozen resolution

采用同日架构规格：Picker 内部事务内核、真实 DOM 时间列、`date-utils` 兼容 shim；Upload additive signal/taskId/timeout/cancel/retry、validation/late-callback isolation 与独立 locale。既有公开行为默认兼容，不以扩大 timeout、删除断言或新增 skip 绕过失败。

架构实施前结论：冻结方案未发现未处理 P0/P1/P2；上述风险必须以真实 RED 进入实现，未转绿前不得送审或合并。
