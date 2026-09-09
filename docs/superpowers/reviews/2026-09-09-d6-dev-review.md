# D6 development manager review

候选：`418cd0022ee6c8321c5036651fedce9b00454ba7`，基线：`759daca733791e17eec0e462bfd1fb9a1bea9b7c`。范围只包含 D6 Picker / Upload；不包含 D4 延期虚拟化、D7、D9 物理设备或 npm 发布。

## Final development verdict

在当前候选中未发现未关闭 P0/P1/P2。审查覆盖公开类型、事务边界、受控权威、资源清理、ownerDocument、浮层定位稳定性、SSR、生成物和包体积。早期失败保存在 `docs/superpowers/evidence/d6/red/`，没有通过删除断言、扩大 timeout、force click 或新增 skip 绕过。

## Findings and resolution history

| Finding | Severity | Resolution |
| --- | --- | --- |
| 四个 Picker 初版只新增 transaction 工具但生产未使用 | P1 | 四组件真实接入动态 `shouldStage/shouldCommit`、committed sync、discard 与统一 action gate。 |
| TimePicker/Range 通过 `scrollTop / 28` 选值 | P1 | 共用真实 option rect/column viewport 几何；ownerDocument ResizeObserver、timer 全部清理。 |
| DateRange showTime 深页面 footer 被 viewport 裁切 | P1 | 根据 trigger/viewport 可用空间限制主体，calendar 滚动、footer sticky。 |
| placement 相关高度形成 top/bottom flip 反馈环 | P1 | auto-adjust 使用稳定的上下最大可用空间；内部滚动忽略，外部更新 RAF 合并并禁止并发。 |
| `date-utils` 委托后意外接受更多 parse 格式 | P2 | 保留 deprecated 深层 shim 和原生 Date 类型，同时恢复只接受 `YYYY-MM-DD` 的旧契约。 |
| DateRange endpoint/whole clear 与其他 Picker 时机不一致 | P2 | endpoint clear 遵循 confirm transaction；whole clear 立即提交并关闭。 |
| Upload 无 signal/task token/cancel/retry/timeout | P1 | additive API、唯一 taskId、AbortSignal、cancel/retry、timeout 和迟到回调隔离。 |
| validation rejection 成为未处理异常 | P1 | 失败文件进入可见 `error/validation`，可重新校验并 retry。 |
| 受控元数据被旧 callback 快照覆盖 | P1 | callback patch 合并到父层最新文件快照。 |
| consumer abort handle 抛错阻断 remove/cleanup | P1 | token/signal 先失效，abort handle best-effort 隔离，UI 清理继续完成。 |
| Upload 借用 DatePicker locale | P2 | ConfigProvider 新增独立、可深合并的 `locale.upload`。 |
| 移动 Upload 操作目标过小、错误文字对比风险 | P2 | coarse/mobile target 至少 40px，错误色按当前 danger/text 自适应加深。 |

## Package and resource review

- 5 个主要 ESM 模块合计 gzip：基线 `37,513` bytes，候选 `41,205` bytes，增量 `3,692` bytes。
- 当前 listeners、RAF、ResizeObserver、timeouts、AbortController 均有 owner/unmount cleanup；Upload task token 使旧 callback 不可写回。
- `date-utils` 未破坏深层 ESM/CJS 入口；picker-core 仍未从根导出内部 Dayjs 实例。
- 真实 tgz 非 workspace symlink，types/ESM/CJS/CSS/SSR/hydration/交互通过，SHA-256 `b600f47aa5e32f46dda00ac57241a16237308f2d335f9c92603a4efe249bcd0b`。

## Verified gates at review time

- components `1235`、dnd `44`、ai `66`、scripts `88` 全部通过。
- D6 五浏览器 `30/30`；D6 + 既有 Upload 最终影响回归 `48/48`。
- workspace typecheck、deterministic double build、generated check、docs build、release pack `995/71/111` 通过。
- screenshot-first design audit 7 张最终图通过。

该开发结论不替代独立测试经理、产品经理、PR CI、合并、master CI、Pages 或线上验收。
