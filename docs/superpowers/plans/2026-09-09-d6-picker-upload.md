# D6 Picker / Upload delivery matrix

候选：`418cd0022ee6c8321c5036651fedce9b00454ba7`。本矩阵把 D6 原始 8 项分别映射到源码、unit、browser、consumer 与审核证据；能力完成不等于 PR/merge/deploy 完成。

| Original item | Source | Unit / browser evidence | Status |
| --- | --- | --- | --- |
| 单值/范围共用 parse/draft/commit/keyboard/disabled | `picker-core/transaction.ts`，四 Picker 生产接入 | transaction/static contract；D6 single/range 五浏览器 | implemented, review pending |
| picker-core 唯一日期能力、清理 date-utils 重复 | codec/dayjs + deprecated `date-utils` shim | legacy parse/format/deep import、consumer ESM/CJS | implemented, review pending |
| 时间列依据真实 DOM 尺寸 | `time-column-geometry.ts`，Time/TimeRange | 36/44/52px geometry unit；D6 live resize | implemented, review pending |
| input/click/Preset/Confirm/Clear/Escape 时机一致 | shared transaction + Date/Time components | unit timing matrix；D6 Escape/Confirm/range | implemented, review pending |
| Upload abort/cancel/retry、校验失败及超时 | Upload task lifecycle | Upload unit 24、SSR、D6/legacy Upload browser | implemented, review pending |
| beforeUpload=false、手动上传、受控 fileList | Upload validation/manual/controlled paths | unit + browser manual/rejected/accepted | implemented, review pending |
| task ID 隔离迟到进度与完成回调 | `uid + taskId` active map and signal | cancel/retry/remove/replacement/unmount tests | implemented, review pending |
| Upload 独立 locale 分组 | ConfigProvider `locale.upload` | nested merge unit、five-browser docs fixture、SSR | implemented, review pending |

## Evidence

- Architecture: `docs/superpowers/specs/2026-09-09-d6-picker-upload-architecture.md`
- RED history: `docs/superpowers/evidence/d6/red/`
- Consumer: `docs/superpowers/evidence/d6/consumer/results.json`
- Visual: `docs/superpowers/reviews/2026-09-09-d6-design-review.md`
- Development: `docs/superpowers/reviews/2026-09-09-d6-dev-review.md`

## Remaining delivery gates

- independent test manager and product manager acceptance
- complete repository E2E on frozen candidate
- PR creation/Ready and latest-head CI
- squash merge, master CI, Pages and live DatePicker/TimePicker/Upload verification

