# D7 DnD architecture contract

状态：2026-09-09 用户明确要求按既定顺序继续优化并完整闭环，aheart-ui v2 暂停。本规格只冻结 D7 DnD 七项，不启动 D8、延期虚拟化、D0-D3 最终复核或 D9 发布。

基线：master `b6630ceb31c3d30e4bdc6529c622354b1e34c181`，工作分支 `codex/d7-dnd`。基线 `@aheart-ui/dnd` 单测为 `44 passed`，类型检查通过；这些结果只证明旧行为，没有覆盖 D7。

## Public compatibility and additions

- `SortableList` 保留必填 `itemKey: string`、现有 `items/group/disabled`、slot 和 `update:items/change` 首参数。
- `SortableList` 新增：
  - `revision?: string | number`：服务端刷新或同 key 内容换代时由父层显式提供；未提供时组件以 items 引用与有序 key 集合维护内部 revision。
  - `label?: string`：列表播报名称；默认按同组注册顺序生成可理解的“列表 N”。
  - `itemLabel?: (item: TItem, index: number) => string`：业务条目播报名称；默认使用稳定 `itemKey`。
  - `scopeKey?: string | number`：宿主页面/路由生命周期标识；变化时取消本 scope 的会话与 pending transaction。复用组件实例的路由必须传入 route key，真实卸载路径无需额外配置。
- `SortableList` 新增事件 `moveStart`、`moveCommit`、`moveReject`。三者携带同一 `transactionId`、输入来源、稳定 `itemKey`、源/目标列表和位置；拒绝事件增加标准 reason。`update:items` 仍只以数组为第一个参数，`change` 允许可选的第二个事务上下文，旧监听器不受影响。
- `SortableItemData.index` 保留为 deprecated 拖动开始位置，兼容深层入口；新增 `itemKey`、`revision`、`sessionId` 和参与列表 revision 快照。生产移动逻辑不得再以 `index` 识别业务条目。
- `Draggable` 与 `DropZone` 新增 `keyboard?: boolean`（默认 `true`）、`label?: string` 和 `scopeKey?: string | number`。键盘取放仍触发现有 `dragStart/drop`，并增加 `keyboardGrab/keyboardCancel/keyboardDrop` 作为可选审计事件。同 document 的 source/target 只有 scopeKey 相等才兼容。
- 根入口导出新的 D7 事件、拒绝原因与 revision 类型；既有组件、composable、深层 ESM/CJS 入口及 CSS 入口保持可用。
- D7 不公开 Atlaskit 实例、内部 registry、session manager 或自动滚动实例。

精确公开类型冻结为：

```ts
export type SortableRevision = string | number
export type SortableInput = 'pointer' | 'touch' | 'keyboard'
export type SortableDropPosition =
  | { kind: 'item'; itemKey: string }
  | { kind: 'end' }

export type SortableMoveRejectReason =
  | 'stale-revision' | 'source-missing' | 'target-missing'
  | 'duplicate-key' | 'group-mismatch' | 'disabled'
  | 'invalid-position' | 'parent-rejected' | 'rollback-rejected'
  | 'unmounted' | 'cancelled'

export interface SortableMoveLocation {
  listId: string
  listLabel: string
  index: number
  revision: SortableRevision
}

export interface SortableMoveEvent {
  transactionId: string
  sessionId: string
  input: SortableInput
  itemKey: string
  itemLabel: string
  source: SortableMoveLocation
  target: SortableMoveLocation
  position: SortableDropPosition
}

export interface SortableMoveRejectEvent extends SortableMoveEvent {
  reason: SortableMoveRejectReason
}

export interface SortableChangeContext {
  transactionId: string
  phase: 'candidate' | 'rollback'
  input: SortableInput
}

export type KeyboardDragCancelReason =
  | 'cancelled' | 'replaced' | 'unmounted'
  | 'scope-changed' | 'page-hidden' | 'owner-detached'

export interface KeyboardDragEvent {
  sessionId: string
  data: DragData
  source: { label: string; scopeKey?: string | number }
}

export interface KeyboardDragCancelEvent extends KeyboardDragEvent {
  reason: KeyboardDragCancelReason
}

export interface KeyboardDropEvent extends KeyboardDragEvent {
  target: { label: string; scopeKey?: string | number }
}
```

`moveStart` 在预检通过、候选 emit 前由 source 与 target 各发一次；`moveCommit` 在父层候选 settle 后各发一次；`moveReject` 在预检拒绝或回滚 settle 后由仍挂载的参与列表各发一次，同一列表/transaction/event 最多一次。预检阶段目标不存在时只由仍注册的 source 发 reject；source 与 target 都已卸载时不向已销毁 Vue 实例伪造事件，只执行数据回滚和资源清理。`change(items, context?)` 在每次 candidate/rollback 请求时发出；已有监听器读取第一个参数保持兼容。

`Draggable.keyboardGrab(event)`、`Draggable.keyboardCancel(event)` 与 `DropZone.keyboardDrop(event)` 使用上述精确 payload；既有 `Draggable.dragStart/drop` 仍无参数，既有 `DropZone.drop` 仍只接收 `DragData`，键盘路径不改变它们的首参数或触发次数。

## Stable identity and revision

- 每次 native、touch 或 keyboard 会话开始时创建唯一 `sessionId`，捕获源 `itemKey`、源列表 revision，以及同 group 当前已注册列表的 revision 快照。
- drop 时先按 `itemKey` 在当前源列表重新定位；`index` 只用于兼容与播报原始位置。源 key 不存在、重复 key、列表缺失或任一参与列表 revision 与会话快照不一致时，移动在任何 `update:items` 前拒绝。
- item 目标也使用稳定 target key；空列表或列表尾部使用显式 `end` 位置，不把旧 DOM index 当身份。
- `SortableItem` 的 droppable payload 直接携带自己的稳定 `itemKey`；列表容器 payload 使用 `{ kind: 'end' }`。`{ kind: 'item', itemKey }` 表示“占据目标条目在 drop 时的原位置”：同列表使用该 key 当前 index 作为 reorder finish index，跨列表在该 key 当前 index 前插入；这保持既有 drop-on-item 行为。目标 key 被删除或重复时拒绝，绝不退回 DOM index。
- `revision` prop、`scopeKey` 发生变化，items 引用/有序 key 集合在会话中变化、列表注销或源 item 删除都会使旧会话失效。相同 key 的数据刷新可由显式 `revision` 区分。
- 缺失或重复 key 在开发环境告警，并对相关移动安全拒绝；生产环境不抛异常、不移动错误条目。
- fallback revision 同步观察 items 数组引用、条目对象引用和有序 key；原对象原地业务字段变化不会自动失效。若字段变化会改变 canDrop/业务移动语义，父层必须传入并递增显式 `revision`，API 文档必须明确该责任。

## Controlled transaction and rollback

- registry 先构造不可变 source/target 原快照和候选快照，完成 group、disabled、key、revision、边界与目标存在性校验后，才在同一同步调用中向参与列表请求候选数组。
- 同列表只有一次 `update:items/change`；跨列表 source 和 target 各请求一次。事务在 Vue 更新完成后检查父层实际 props：两侧都等于候选才 commit。
- 父层拒绝任一侧时事务 reject。若另一侧已接受且仍等于本事务候选，registry 对该侧发送原快照回滚；不得用回滚覆盖随后到达的无关外部数据。回滚完成后才发一次 `moveReject` 和失败播报。
- 两侧均拒绝时无需回滚；两侧均接受时只发一次 commit。迟到 settle、重复 drop、旧 session 回调和已结束 transaction 不得二次写入或播报。
- 如果父层同时拒绝候选和回滚，组件不能越过父层权威强改 props；必须报告 `rollback-rejected`，不伪报成功。正常“一侧接受、一侧拒绝”的受控路径必须恢复到事务前数据。

settle 时序是确定性的受控 Vue 契约：父层必须在 `update:items` 处理器内同步更新权威状态；延迟 Promise/定时器更新视为新的外部更新。candidate emit 完成后等待恰好一次 Vue `nextTick`，接受判定只比较稳定 key 的成员与顺序，允许父层合法 clone 条目对象；若拒绝，只有当前 key 序列仍精确等于本事务 candidate 的侧才接收 rollback，随后再等待恰好一次 `nextTick` 验证原 key 序列。rollback 按当前条目的稳定 key 重排并保留当前对象/字段，只有缺失的被移动条目才从原快照补回，避免覆盖同时发生的内容刷新。不同于 candidate/original 的并发 key 数据绝不覆盖，并按 `parent-rejected` 结束；rollback 请求后仍保持 candidate key 序列才升级为 `rollback-rejected`。事务结束后 token 失效，任何迟到 settle 无效果。

标准拒绝原因至少包括：`stale-revision`、`source-missing`、`target-missing`、`duplicate-key`、`group-mismatch`、`disabled`、`invalid-position`、`parent-rejected`、`rollback-rejected`、`unmounted`、`cancelled`。

## Keyboard and announcements

- 通用 `Draggable` 在可用时进入 Tab 顺序。Space/Enter 抓取；再次按键或 Escape 取消。抓取后用户用正常 Tab/Shift+Tab 导航到兼容 `DropZone`，Space/Enter 放置。
- `DropZone` 在 keyboard 开启且未禁用时可聚焦。类型不匹配或 disabled 时不得发 drop，并播报明确失败原因；成功只触发一次现有 `drop` 和一次 `keyboardDrop`。
- Escape、source unmount、pagehide、owner document hidden 或新会话替换旧会话时统一取消并恢复可用的源焦点。
- source/zone/list 的 `scopeKey` 变化视为宿主导航：旧 scope session 与 pending transaction 以 `scope-changed` 结束。Vue Router 复用同一组件实例时，消费者必须把 route identity 传给 scopeKey；未传时只承诺真实组件卸载的路由清理。
- Sortable 既有 `Alt + Arrow` 同列表/跨列表操作保持兼容，但必须复用稳定 key、revision、事务 settle 和同一播报服务。
- 每个 `ownerDocument` 最多一个 `aria-live="polite" aria-atomic="true"` 节点。播报覆盖：抓取源、当前目标、成功最终位置，以及 disabled/group/revision/parent rejection/unmount 等失败原因。相同文本连续发生时仍可被读屏重新宣布。
- SSR 不创建 runtime id、keyboard session 或 live region；hydration 首树保持一致。

通用 keyboard service 使用 `WeakMap<Document, Session>` 与 `WeakMap<Document, Set<ZoneRegistration>>` 隔离 realm。source session 保存浅拷贝 data/type、source element/label 和结束回调；zone registration 保存 element、动态 accept/disabled/label 和 drop 回调，并复用 native canDrop 的类型判定。所有启用 keyboard 的 zone 保留 Tab 停止点：兼容 zone 聚焦时播报目标；不兼容 zone仍可聚焦并播报“类型不匹配”，按下放置键只播报拒绝。disabled zone 为 `tabindex=-1`，若聚焦后动态禁用则放置键播报“目标已禁用”。仅当键盘事件 target 是组件 root 本身时拦截 Space/Enter，嵌套 input/button/link 的原生键盘和 submit 不被劫持；root 自身为 button 时会 `preventDefault` 防止误提交。service 在调用 drop 回调前原子结束 session，因此重复按键/迟到事件只能 drop 一次；成功后焦点留在目标，取消时才恢复仍连接的 source。

## Owner realm and lifecycle

- computed style、事件构造器、定时器、RAF、scroll、visibility/pagehide 和自动滚动 window 注册全部从实际元素的 `ownerDocument.defaultView` 获取，不读取模块级全局 `window/document`。
- 自动滚动注册按 `ownerDocument` 隔离引用计数；主文档与 iframe 的 window/ancestor 不共享 registration，最后一个使用者卸载后释放。
- native/touch/keyboard 会话在插入、删除、刷新、列表或 item 卸载、iframe 卸载、pagehide、visibility hidden 和组件重挂载时只能结束一次。结束后 overlay、drag state、listeners、auto-scroll 与 live region 引用不得残留。
- 路由切换通过组件卸载路径完成 abort；迟到 adapter drop 或 pointerup 只能得到已结束会话结果，不能写入新页面数据。
- 同源 iframe 中还要观察 `ownerWindow.frameElement` 所属父文档：使用父文档自身 `defaultView.MutationObserver` 监听 frame detach，frameElement 不再 connected 时以 `owner-detached` 取消 session、pending transaction、RAF 和 registration。跨源或无 frameElement 时以 owner window `pagehide/unload` 和组件卸载为边界；所有 cleanup 幂等。

Atlaskit 3.0.0 的 window auto-scroll 实现内部绑定模块全局 `window/document`，没有 owner window 参数。因此边界冻结为：主文档且 `element.ownerDocument.defaultView === globalThis.window` 时可继续调用 Atlaskit element/window auto-scroll；iframe 或其他 realm 必须走本包的 owner-realm wrapper。wrapper 从 owner window 读取 computed style/RAF/viewport/scrollBy，监听该 owner document 的 `dragover`/`pointermove` 与 owner window 的 `dragend`/`pointerup`/`blur`/`pagehide`，按内到外顺序滚动已注册 overflow ancestor，最后滚动 owner window；每个 document 独立引用计数和 RAF。iframe 路径不得调用 Atlaskit window registration。若 owner window 缺失则安全禁用并返回幂等 cleanup。

## Implementation boundary

- 新建纯数据 sortable transaction/session kernel；`sortable-registry` 负责列表注册、snapshot、settle 与回滚，不查询 DOM。
- 新建 ownerDocument 级 announcer/keyboard session service；组件只提供 element、label、data 和结果回调。
- `SortableList/SortableItem` 负责 Vue props/emit、焦点与可见状态；不得在 DOM 查询失败时静默宣称成功。
- `useDraggable/useDroppable` 保持现有回调兼容；需要的 D7 上下文通过新增可选回调或内部 adapter 传递，不改变旧回调首参数。
- 不新增手势库，不替换 Atlaskit，不加入列虚拟化、v2 resolver、全局 ConfigProvider 或 npm 发布。

## RED/GREEN and exit gates

实施前必须保留真实 RED：稳定 key、source/target revision、跨列表单侧父拒绝回滚、通用键盘取放、失败播报、iframe owner window、插入/删除/刷新/卸载/路由迟到回调。已有旧能力首轮通过只记补证。

退出必须同时满足：

1. D7 scoped unit、SSR/hydration 与五浏览器 E2E 全绿，D7 新用例 0 skip；完整仓库 unit/typecheck/E2E、确定性双构建、generated、docs 和 release pack 全绿。
2. desktop/mobile Chromium、desktop Firefox、desktop/mobile WebKit 覆盖 pointer、scripted touch、keyboard、controlled rejection、iframe、nested scroll、unmount/route；物理 iOS 仍属于 D9，不能冒充。
3. 真实无 workspace 软链 tgz 消费端验证公开类型、ESM/CJS、CSS、SSR/hydration、keyboard、sortable transaction 与 cleanup。
4. 截图优先设计审核覆盖通用键盘抓取/目标、成功、revision/parent rejection 和移动窄屏；截图重新捕获并逐张打开。
5. 开发经理、设计、独立测试经理、产品经理均通过，P0/P1/P2 为 0；不新增 skip、force 或扩大 timeout。
6. 最终候选一次性推送 Ready PR；匹配 head SHA 的 PR CI 全绿后 squash merge，不删除分支。随后验证 merge commit、master CI、Pages 和线上 DnD，才关闭 D7。

可复算断言：candidate settle 最多一个 `nextTick`，rollback settle 再一个 `nextTick`；父层 clone 对象但保持候选 key 顺序视为接受；单侧拒绝最终两列表恢复原有序 key、保留并发字段更新且只发一次 reject；插入、删除、显式 revision 刷新分别在零 update 下拒绝；source/list 卸载、scopeKey 路由变化和同源 iframe frameElement detach 清空 session/overlay/listeners/RAF，迟到 drop/pointerup 为零 update；非兼容 keyboard zone 保持可聚焦、零 drop 并播报类型原因；iframe 真实 overflow ancestor 的 `scrollTop` 或 owner window `scrollY` 必须变化且主 window 不变；SSR 同配置两次 HTML 字节一致并无 runtime id/live region，hydration 首树无 warning。D7 新 spec 不写条件 skip；全仓既有平台适用性 skip 基线为 `127`，最终不得增加，若基线因测试矩阵变化则逐项机器清单解释。
