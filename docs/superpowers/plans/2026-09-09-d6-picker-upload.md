# D6 Picker / Upload delivery matrix

候选：`418cd0022ee6c8321c5036651fedce9b00454ba7`。本矩阵把 D6 原始 8 项分别映射到源码、unit、browser、consumer 与审核证据；能力完成不等于 PR/merge/deploy 完成。

| Original item | Source | Unit / browser evidence | Status |
| --- | --- | --- | --- |
| 单值/范围共用 parse/draft/commit/keyboard/disabled | `picker-core/transaction.ts`，四 Picker 生产接入 | transaction/static contract；D6 single/range 五浏览器 | product accepted |
| picker-core 唯一日期能力、清理 date-utils 重复 | codec/dayjs + deprecated `date-utils` shim | legacy parse/format/deep import、consumer ESM/CJS | product accepted |
| 时间列依据真实 DOM 尺寸 | `time-column-geometry.ts`，Time/TimeRange | 36/44/52px geometry unit；D6 live resize | product accepted |
| input/click/Preset/Confirm/Clear/Escape 时机一致 | shared transaction + Date/Time components | unit timing matrix；D6 Escape/Confirm/range | product accepted |
| Upload abort/cancel/retry、校验失败及超时 | Upload task lifecycle | Upload unit 24、SSR、D6/legacy Upload browser | product accepted |
| beforeUpload=false、手动上传、受控 fileList | Upload validation/manual/controlled paths | unit + browser manual/rejected/accepted | product accepted |
| task ID 隔离迟到进度与完成回调 | `uid + taskId` active map and signal | cancel/retry/remove/replacement/unmount tests | product accepted |
| Upload 独立 locale 分组 | ConfigProvider `locale.upload` | nested merge unit、five-browser docs fixture、SSR | product accepted |

## Evidence

- Architecture: `docs/superpowers/specs/2026-09-09-d6-picker-upload-architecture.md`
- RED history: `docs/superpowers/evidence/d6/red/`
- Consumer: `docs/superpowers/evidence/d6/consumer/results.json`
- Visual: `docs/superpowers/reviews/2026-09-09-d6-design-review.md`
- Development: `docs/superpowers/reviews/2026-09-09-d6-dev-review.md`
- Independent test: `docs/superpowers/reviews/2026-09-09-d6-test-review.md`
- Product: `docs/superpowers/reviews/2026-09-09-d6-product-review.md`

## Remaining delivery gates

- PR creation/Ready and latest-head CI
- squash merge, master CI, Pages and live DatePicker/TimePicker/Upload verification
