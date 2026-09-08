# D6 Picker / Upload architecture freeze

状态：2026-09-09 用户明确要求启动并闭环 D6。基线为已验证 master `759daca733791e17eec0e462bfd1fb9a1bea9b7c`，工作分支 `codex/d6-picker-upload`。本规格冻结 D6 的 8 项原始范围，不启动 D7/D8/D9，不实现 D4 延期虚拟化，不发布 npm。

## Picker transaction contract

DatePicker、DateRangePicker、TimePicker、TimeRangePicker 必须共用 `picker-core` 内部事务内核，而不是各自维护 parse/draft/commit/keyboard/disabled 判断。公开 props、事件和默认值保持兼容。

- `picker-core` 统一提供 parse/format、draft session、action source、commit/discard policy、keyboard intent 与 disabled/readOnly gate。
- `needConfirm=false` 时，合法 input/cell/preset/now/scroll/keyboard selection 立即提交一次；`needConfirm=true` 时这些入口只更新 draft，Confirm 才提交一次并发出 `ok`。
- Escape、Cancel、outside dismiss 永不提交 draft；Escape/Cancel 恢复触发输入焦点。重新打开从父层/当前 committed value 建立新 draft。
- whole clear 是明确提交动作：立即提交空值并关闭；range endpoint clear 立即提交该端点为空但保持面板可继续编辑。受控父层拒绝时，committed display 回到父值，不保留乐观结果。
- disabled/readOnly 对输入、点击、preset、now、scroll、keyboard 和 Confirm 使用同一个 gate；组件打开后变为 disabled/readOnly 时关闭并丢弃 draft。
- range 的 part-aware disabled 继续兼容现有函数签名；共享内核负责统一 action gate，不破坏公开类型。

`packages/components/src/date-picker/date-utils.ts` 不直接删除。它保留原生 `Date` 返回类型和现有深层入口，内部委托 `picker-core` codec/dayjs，并标记 deprecated；生产 Picker 不再依赖重复日期算法。

## Time column geometry

- 禁止以固定 `28px` 将 `scrollTop` 换算为 option index。
- 单值/范围 TimePicker 共用真实 DOM 解析函数；每次 settled scroll 依据 ownerDocument 下实际 option `offsetTop`/`getBoundingClientRect()` 与列 viewport 中心选择最近的可用 option。
- SSR 保持确定性 DOM；DOM 测量仅在挂载后进行。timer/RAF/observer 若存在，全部来自 ownerDocument.defaultView 并在卸载时清理。
- 字体、zoom、主题、自定义行高与 ResizeObserver 变化后不得选错值。

## Upload public compatibility

现有 `fileList/defaultFileList/beforeUpload/customRequest/maxCount/disabled/multiple` 保持兼容。新增能力全部可选：

```ts
type UploadStatus = 'ready' | 'uploading' | 'done' | 'error' | 'cancelled'
type UploadFailureReason = 'validation' | 'timeout' | 'request' | 'cancelled'

interface UploadRequestOption {
  file: UploadFile
  signal: AbortSignal
  taskId: string
  onProgress(percent: number): void
  onSuccess(response?: unknown): void
  onError(error: unknown): void
  onCancel(): void
}

interface UploadRequestHandle { abort?: () => void }
type UploadRequestResult = void | Promise<void> | UploadRequestHandle
```

- `timeout?: number`，默认 `0` 表示关闭；正数到期后 abort 当前任务并进入 `error/timeout`。
- uploading 文件提供 Cancel；error/cancelled 文件提供 Retry。新增 `cancel(file)`、`retry(file)` 事件；原 `remove(file)` 不变。
- `beforeUpload=false` 只进入 ready/manual 状态；throw/reject 是 validation error，不启动 transport。Retry 会重新执行 validation，再创建新任务。
- 每次请求使用唯一 `taskId`。只有 `uid + taskId` 当前匹配的 progress/success/error/cancel 才可写回；remove、cancel、retry、受控 replacement、unmount 都会使旧任务失效并 abort。
- `customRequest` 的旧实现可忽略新增字段。若返回 abort handle，组件在 signal abort 时调用一次；Promise resolve 本身不伪造 success，仍由回调决定状态。
- 受控 `fileList` 仍以父层为 UI 权威；所有状态转换通过完整数组提出，父层拒绝时不得出现乐观 DOM。

## Upload locale

`AheartLocale` 新增独立 `upload` 分组，覆盖选择、上传、成功、失败、取消、重试、移除、校验失败与超时文案。Upload 不再读取 `datePicker.locale` 判断语言。缺少局部字段时逐项回退 zhCN 默认值；enUS 提供完整英文组；嵌套 ConfigProvider 继续按现有 locale 合并规则工作。

## Evidence and exit

- 先保留真实 RED：共享 Picker policy、非 28px 时间列、resize 后重算、提交矩阵；Upload signal/cancel/retry/timeout/validation/task isolation/controlled rejection/locale。
- D6 unit、五浏览器任务、keyboard/a11y/mobile/SSR/cleanup/iframe、真实 tgz consumer、完整仓库门禁和运行时截图全部通过。
- 开发、设计、测试、产品四份报告均 P0/P1/P2 = 0 后才允许 PR Ready/merge。
- 最新 PR head CI、squash merge、master CI、Pages 与线上 Picker/Upload 交互全部完成后才关闭 D6。

