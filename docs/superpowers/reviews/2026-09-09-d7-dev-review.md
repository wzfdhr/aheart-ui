# D7 DnD 独立开发经理复审报告

候选范围：`packages/dnd` 源码、公开类型、ESM/CJS 生成物及 D7 定向单测。基线为 master `b6630ceb31c3d30e4bdc6529c622354b1e34c181`；本报告不代表独立测试经理、设计审核、产品验收、PR CI、合并或部署已完成。

## 最终开发结论

最终开发复审结论为 `P0=0 / P1=0 / P2=0`，允许进入浏览器 fixture/E2E、真实 consumer、截图设计审核和后续独立测试门禁。

审查没有把 DnD 旧基线 `44 passed` 当作 D7 证据；D7 新增定向覆盖最终为 `79/79`，并另行核对了实现、生成声明、owner realm 和资源生命周期。

## 范围与退出边界

本轮只覆盖 D7 七项：稳定 `itemKey`、revision 过期拒绝、跨列表受控事务回滚、通用 Draggable/DropZone 键盘取放、完整 live region、ownerDocument/iframe 自动滚动，以及插入/删除/刷新/卸载/路由迟到回调。

不包含 D8、D4 Tree/TreeSelect/Cascader 延期虚拟化、D0-D3 最终复核、D9 实体 iOS 和 npm 发布。独立测试、产品验收、PR/CI/合并/Pages/线上状态必须由各自门禁单独证明。

## 发现与修复历史

| 阶段 | 发现 | 严重度 | 处理结果 |
| --- | --- | --- | --- |
| 初始盘点 | 拖动身份和 registry 仍按 drag-start index；无 revision；跨列表为 source/target 顺序 emit，无事务 settle/回滚 | P1 | 引入 stable key、revision snapshot、纯数据 session/transaction kernel 和受控回滚。 |
| 初始盘点 | Draggable/DropZone 无键盘替代路径；失败原因和源/目标播报不完整 | P1 | 增加 ownerDocument keyboard service、Space/Enter/Escape、scopeKey、结构化事件和中文失败播报。 |
| 初始盘点 | auto-scroll 使用模块级 `window`，iframe/嵌套滚动/卸载无隔离 | P1 | 主文档继续使用 Atlaskit；iframe 使用 owner-realm wrapper、ancestor handoff、独立 RAF 和 detach cleanup。 |
| 架构首轮 | settle 时序、target position、generic keyboard session、事件类型、iframe 边界不够精确 | P1/P2 | 规格补齐单 tick settle/rollback、item/end target、精确 payload、scopeKey、owner wrapper 和可复算断言。 |
| 架构二轮 | 复用路由组件缺生命周期 key；clone 对象会被误判为拒绝；frame detach 和 keyboard payload 未冻结 | P1/P2 | 增加 `scopeKey`、key-sequence 接受判定并保留 clone/并发字段、精确 keyboard 类型和 frameElement detach 观察。 |
| GREEN 代码复审 | session 取消/无效 drop 泄漏；事件字段取当前 snapshot；动态 group 旧值；跨 owner drag state；nested handoff/连续 RAF 缺口 | P1 | 增加 session close/dropConsumed、drag-start snapshot event、动态 group getter、owner-scoped drag state、边界 handoff 和连续 RAF。 |
| GREEN 代码复审 | threshold 未启动路径未 close；cancel rollback 未单 tick 验证 | P1 | 所有 touch 结束路径 close session；rollback 等待一次 `nextTick`，再发单一终态 reason。 |
| 最终资源复审 | iframe remove 先出现 page-hidden 的 consumer 竞态 | P1（证据流程） | 改为 owner-window 延迟判断；frame detach 优先 `owner-detached`，timer 和 live/registration cleanup 幂等释放。 |

## 真实 RED 与 GREEN 证据

真实 RED 保留在 D7 定向测试和 consumer 证据中，没有通过删断言、扩大 timeout、force 或 skip 绕过：

- [D7 contract RED 测试](/Users/start/.codex/worktrees/091b/aheart-ui/packages/dnd/src/__tests__/d7-dnd-contract.test.ts)覆盖 stable key、显式 revision、受控拒绝、generic keyboard、失败播报和 iframe owner realm。
- [D7 regression RED 测试](/Users/start/.codex/worktrees/091b/aheart-ui/packages/dnd/src/__tests__/d7-dnd-regression.test.ts)覆盖 native ordering、revision、跨 owner、settle、keyboard、scope、动态 disabled、iframe auto-scroll 和 key safety。
- [D7 resource RED 测试](/Users/start/.codex/worktrees/091b/aheart-ui/packages/dnd/src/__tests__/d7-dnd-resource.test.ts)覆盖迟到 touch/native callback、snapshot 字段、动态 group、owner isolation、nested handoff、连续 RAF、外部 live region、frame detach、native dragend、dropConsumed、ancestor refcount、threshold close 和 cancel rollback。
- 初始 consumer RED 因 iframe 移除时得到 `page-hidden` 而不是要求的 `owner-detached`，保留在 [consumer red results](/Users/start/.codex/worktrees/091b/aheart-ui/docs/superpowers/evidence/d7/consumer/red/results.json:1)。修复后 [consumer green results](/Users/start/.codex/worktrees/091b/aheart-ui/docs/superpowers/evidence/d7/consumer/green/results.json:1) 全部通过。

最终 D7 定向单测为 `79/79`。这只是开发门禁证据，不替代后续独立测试经理或浏览器矩阵报告。

## 源码/API/owner realm 复审

- stable identity：`SortableItemData.itemKey` 为业务身份，`index` 仅兼容/播报；drop 按当前 key 重定位，重复/缺失 key 安全拒绝。
- revision/session：session 捕获源及参与列表快照；items/key/revision/scope/group 变化会使旧会话失效；`dropConsumed` 和 session token 防止重复或迟到写入。
- controlled transaction：candidate emit 后单次 `nextTick` settle；单侧接受时只对仍等于 candidate 的侧执行 rollback，再单次 `nextTick` 验证；父层拒绝回滚时发 `rollback-rejected`，不强改权威 props。
- native/touch：native `dragend`、adapter `onDrop`、touch threshold/pointercancel/blur/pagehide/visibility、组件卸载均关闭 session 和 owner drag state。
- generic keyboard：每个 owner document 独立 session/zone registration；Space/Enter/Escape、scope mismatch、disabled/type mismatch、重复 drop、source focus restore 和 frame detach 均有明确路径，播报保持中文。
- live region：service-owned 节点不覆盖外部同名节点；document/frame cleanup 幂等。
- owner realm：iframe 不调用 Atlaskit window registration；computed style、RAF、timer、scroll、MutationObserver 从 owner realm 获取；嵌套 ancestor 在边界时向外 handoff，全部不可滚动时停止 RAF；多列表 registration 按 ancestor 引用计数释放。
- 公开 API：新增 revision、scopeKey、事件和拒绝原因已导出；Draggable/DropZone 复用 `DraggableOptions/DroppableOptions`；ESM/CJS 生成声明与组件 props/事件同步。

## 生成物、consumer 与体积

真实无 workspace 软链的 D7 tgz consumer 当前 green：

- tarball SHA-256：`2b3442e2d60c5b1735f481b8eb821b82a0531cafbeec444daf702e527eb4f636`。
- 包文件数：`79`；consumer `symlink=false`。
- types、ESM、CJS、CSS、SSR deterministic、hydration、generic keyboard、stable key、revision、controlled rollback、ownerDocument cleanup 全部为 `true`，见 [consumer green results](/Users/start/.codex/worktrees/091b/aheart-ui/docs/superpowers/evidence/d7/consumer/green/results.json:1)。
- ESM/CJS 生成声明覆盖新增 API；本报告只记录生成物状态，不把 consumer 结果扩展为独立产品验收。

体积测量为 gzip baseline `8,275` bytes、current `16,015` bytes、delta `7,740` bytes。增量约 `7.74 KB`，低于当前优化流程采用的 `12 KB` 增量门槛，因此开发经理判断可接受；增量主要对应 D7 新增的 session/transaction、keyboard service、announcer、owner-realm auto-scroll 和生命周期防护。该判断绑定本次 DnD consumer 与当前门槛，不外推到任意应用，也不替代 D9 发布体积复核。

## 独立开发经理签署

源码、公共 API、生成 ESM/CJS、native/touch 时序、session/transaction 终态、owner realm、iframe detach、ancestor refcount、连续 RAF、SSR 边界和 consumer 结果均完成当前开发范围复审。

最终开发状态：`P0=0 / P1=0 / P2=0`。

本报告仅放行进入 browser fixture/E2E、consumer、截图设计审核和独立测试/产品验收流程；不宣称这些后续门禁已经完成。
