# Aheart UI 深度优化完成清单

目标：完成原 D0→D9 所有优化项，严格审核。只有逐条有对应源码、测试、运行时、审查及交付证据时才关闭项目目标；不得把当前实现重新定义为完整目标。

## 执行规则

- 每阶段：开发实施 → 开发经理复审 → 测试经理测试 → 设计审核 → 产品经理验收 → PR → 合并 master。
- P1/P2 未清零不得合并；公开 API、包边界、主要依赖、全局设计基础或三个以上组件交互模型变更按原用户约定专项评审。
- 收尾核实的 master 为 `1587b4e4d63dc34bf13239712243c698a88ffd83`：D4 PR #18 已合并，随后安全依赖 PR #9/#14 已合并；该主线 CI 34113272892 / Pages 34115362807 均 success。见[D4 收尾记录](../reviews/2026-09-07-d4-closeout.md)。此 SHA 是收尾证据基线，不是文档后续提交的 SHA。
- D0–D3 既有交付在最终阶段仍需按原要求逐条复核，不仅沿用“已完成”标签。D3 延后的 Form.List 纳入下方待办。

## D4 选择与树形组件

当前：A兼容API、B隔离评估、C仅Select虚拟化及三项Select合并补证已完成交付；用户明确授权后PR #18合并，主线CI/Pages验证完成，见[逐项交付矩阵](../reviews/2026-09-07-d4-delivery-matrix.md)。2026-09-07用户明确批准三组件虚拟化延期为后续独立任务，本轮D4按调整后的范围关闭，不把延期项算作已实现。

合并时的范围裁定：PR18仅为已授权A/B/C增量；当时未授权的Tree/TreeSelect/Cascader虚拟化不阻塞它，也没有获批延期。原宽泛checkbox不是四组件虚拟化批准。三个Select契约补证及当前候选CI已通过；用户随后明确要求“提交pr吧”“过了就合并”，已据此执行合并，不伪称无法送达的产品经理任务另行给过最终裁定。此次收尾中的延期批准是后续独立决定，不倒写成合并时已经存在。

- [x] Tree 共用 typed key 节点索引、父子关系、可见节点列表。
- [x] 实际焦点节点承担 treeitem；aria-level/posinset/setsize 完整。
- [x] 父子联动勾选、半选、严格模式、禁用边界和异步加载（A批产品验收）。
- [x] TreeSelect 复用 Tree 索引/状态，消除重复 flatten 与活动项 DOM 补丁。
- [x] Cascader 左右、Enter、Home/End、活动路径恢复完整。
- [x] Cascader lazy pending/error/retry 与过期响应隔离。
- [x] Cascader `loadData` AbortSignal 公共契约（A批产品验收，保留旧一参回调兼容）。
- [x] Select 稳定 active option、组合输入法与禁用项边界。
- [x] 大列表基线已测量：10k Select/Cascader 首次展开约 1.44s/1.22s，均渲染 10k DOM；确认需要窗口化而非继续微调全量渲染。
- [x] 真实Chromium开发模式1k/5k/10k基线与固定32px、动态32/46px对照，源码哈希/浏览器版本/截图已保存；不将此前jsdom耗时当成生产浏览器数据。
- [x] 基线发现Select20键跳40项和活动项不可见，已内部修复；候选709de18通过独立开发、测试经理和设计复核，两项问题由2026-09-07-d4-select-keyboard-product-review.md正式批准关闭。
- [x] 本地完整既定门禁已执行：最终C components1121、全量E2E449通过/127既有skip、types/确定性/pack通过。此前409 E2E、1080单测等保留于历史报告，不改标为当前结果。
- [x] 本轮D4虚拟化范围裁定闭合：Select已交付，其他三组件经用户批准延期；此勾选表示范围决定完成，不表示四组件均已实现。
  - [x] Select子集已批准并实现：静态TanStack、默认false、height/estimateSize/overscan；真实生产体积/36场景/4组hydrate与产品验收完成。
  - [x] Tree、TreeSelect、Cascader虚拟化已获批准延期并移入下方独立任务清单；实现仍未完成。
- [x] 成熟引擎优先选型：初评比较三方案，B已完成TanStack隔离评估，C已获准并完成仅Select静态接入。各阶段“当时尚未安装”属于历史，不是当前状态。
- [x] [PR #18](https://github.com/wzfdhr/aheart-ui/pull/18)已正式提交并合并，merge commit `22d60d4`；本批范围与未完成范围分别记录。
- [x] PR18最终head `933d8b1`远端CI全绿；用户明确授权合并，master `22d60d4`及后续`1587b4e`的CI/Pages验证通过。
- [x] D4剩余范围裁定：用户对三组件虚拟化正式延期的询问明确回复“是”，决定已记入收尾记录。
- [x] 本轮D4按调整后的范围关闭；D0–D9整体目标与延期任务仍未完成，不自动启动D5。

## 已批准延期的三组件虚拟化

批准延期日期：2026-09-07；来源：当前任务的明确问答，见[D4收尾记录](../reviews/2026-09-07-d4-closeout.md)。D8闭环后，用户持续优化目标已授权执行此独立阶段，当前分支为 `codex/d4-tree-virtualization`，见[阶段矩阵](2026-09-10-d4-deferred-virtualization.md)。Tree功能子阶段已在 `dc8c299` 通过独立开发、测试、设计及产品验收，正在进入TreeSelect RED；下面三项只有联合性能/消费者/最终审核与交付门禁完成后才勾选，不把功能子阶段通过写成已合并交付。

- [x] Tree虚拟化功能子阶段：生产候选`dc8c299`通过窗口化、展开/勾选/焦点、ARIA、懒加载、动态高度和独立开发/设计/测试/产品验收；联合消费者、性能和交付仍由下方共用门禁约束。
- [x] TreeSelect虚拟化功能子阶段：生产候选`ad18e3b`与测试清理`586dfac`通过搜索/已选节点/活动项/Tree复用、独立开发/设计/测试经理/产品验收，P0/P1/P2=`0/0/0`；联合消费者/性能/交付仍由下方共用门禁约束。
- [x] Cascader虚拟化功能子阶段：生产候选`7964d86`通过多列窗口化、typed path、键盘、异步加载/重试、动态高度、受控拒绝、iframe/owner realm及独立开发/设计/测试/产品验收，P0/P1/P2=`0/0/0`；联合消费者、性能和交付仍由下方共用门禁约束。
- [x] 共用与交付门禁：生产候选`c608a9b`通过真实tgz、714检查点性能/体积、SSR/iframe、完整仓库、四角色终审与产品验收，P0/P1/P2=`0/0/0`；PR #25 exact head `8899365`全绿并 squash 合并为`19a0bf8`，master CI `34823011366`、Pages `34828162352`及新部署 Tree/TreeSelect/Cascader 线上交互均通过。D4延期虚拟化至此正式闭环。

## D5 Table / Pagination

2026-09-08用户明确要求继续D5并批准A兼容方案；D4收尾时“不自动启动D5”是当时边界，本次已有新的启动授权。随后用户对D5-A最终产品验收回复“确认”，A产品验收已通过。见[D5状态](../status/2026-09-08-d5-status.md)、[分批矩阵](2026-09-08-d5-table-pagination.md)、[A产品验收记录](../reviews/2026-09-08-d5-a-product-review.md)和[API规格](../specs/2026-09-08-d5-table-pagination-design.md)。A已完成实现与独立技术/必要视觉验证（1357单测/脚本、484 E2E通过/127既有skip、真实包消费者通过）；B三项原始要求已完成退出证据与产品验收；C技术/性能/设计/产品门禁已完成，完整D5八项产品验收P0/P1/P2为`0/0/0`。D4延期项、D6及npm发布仍不属于本批；PR推送/Ready、当前候选CI、merge、Pages/deploy仍待完成，以下仅更新门禁状态，不提前勾选整体交付关闭。

- [x] 显式本地/服务端 dataMode，排序筛选不混用（D5-A产品验收通过）。
- [x] 排序、筛选、分页、选择、展开受控拒绝契约（D5-A产品验收通过）。
- [x] 行级禁用、全选、跨页与保留选择（D5-A产品验收通过）。
- [x] 筛选使用可交互浮层，确认、重置与受控 open（D5-B退出证据完成；不等同于PR/合并/发布）。
- [x] 固定表头/固定列、横向滚动和稳定列宽（D5-B退出证据完成；不等同于PR/合并/发布）。
- [x] empty/loading/error 状态互不覆盖（D5-B退出证据完成；不等同于PR/合并/发布）。
- [x] Table 内部分页与独立 Pagination 边界统一（D5-A产品验收通过）。
- [x] 虚拟滚动作为单独子阶段审核和验收（D5-C技术/性能/设计/产品门禁完成；交付链仍待PR/CI/merge/Pages）。

## D6 Picker / Upload

- [x] 单值/范围共用 parse/draft/commit/keyboard/disabled 内核（D6 产品验收通过；交付链继续核对 PR/CI/Pages）。
- [x] picker-core 为唯一日期能力；旧 date-utils 保留 deprecated 兼容 shim，重复算法已移除。
- [x] 时间列依据真实 DOM 尺寸，不依赖固定 28px 行高。
- [x] 输入、点击、Preset、确认、清除与 Escape 的提交时机一致。
- [x] Upload abort/cancel/retry、校验失败及超时。
- [x] beforeUpload=false、手动上传、受控 fileList 的一致语义。
- [x] task ID 隔离迟到进度与完成回调。
- [x] Upload 使用独立 locale 分组。

## D7 DnD

- [x] 稳定 itemKey，不依赖拖动开始时的 index（D7 产品验收通过；交付链继续核对 PR/CI/Pages）。
- [x] 列表 revision 与外部数据变化后的过期拖放拒绝。
- [x] 跨列表事务及父拒绝完整回滚。
- [x] Draggable / DropZone 键盘替代操作。
- [x] live region 宣布源、目标、失败原因和最终结果。
- [x] 自动滚动使用 ownerDocument/defaultView，支持 iframe。
- [x] 拖动中插入/删除/刷新/卸载/路由切换覆盖。

## D8 AI

D8 delivery is closed through [PR #24](https://github.com/wzfdhr/aheart-ui/pull/24): frozen head `a65de98`, exact-head push/PR CI, squash merge `4a7511f`, master CI, Pages and live AI interaction validation all passed. The detailed matrix is [here](2026-09-09-d8-ai.md).

- [x] AIStreamEventV2 版本、requestId、sequence、revision（D8 四角色审核与完整交付链通过）。
- [x] 重复/乱序/断线重连和服务端最终消息处理（D8 四角色审核与完整交付链通过）。
- [x] AIChatPanel 卸载、切会话 abort 与迟到事件隔离（D8 四角色审核与完整交付链通过）。
- [x] 审批、取消、重试 pending/success/error 和幂等标识（D8 四角色审核与完整交付链通过）。
- [x] Workbench 单一状态源，桌面/移动不再双实例分叉（D8 四角色审核与完整交付链通过）。
- [x] reorderable、任务依赖约束及锁定原因（D8 四角色审核与完整交付链通过）。
- [x] AIForm 范围、格式、跨字段、异步规则、reset/validate 完整；复用核心 Form（D8 四角色审核与完整交付链通过）。
- [x] 工具调用展示业务摘要、输入状态与结果，不展示隐藏推理（D8 四角色审核与完整交付链通过）。

## 延后项与 D0–D3 最终复核

- [x] Form.List API 评审、实现、动态数组增删移动与稳定字段身份；PR #26 已 squash 合并为 `05f6b904`，master CI、Pages 与线上交互均通过。
- [x] D0：WebKit Modal 20 次零偶发、DnD 消费端类型、QG4 真实证据、Pages 质量保护；PR #27 squash 合并为 `faf5521b`，master CI `34873710572`、Pages `34879898583` 与线上验证通过。
- [x] D1：五个内部 helper 契约及优先迁移组件；默认值初始化、父接受/拒绝、异步生命周期；随 PR #27 完成 exact-head、master 与 Pages 交付门禁。
- [x] D2：完整浮层堆栈、焦点/滚动管理、placement/arrow/motion/container、关闭中重开、自动 ARIA 与嵌套场景；随 PR #27 完成 exact-head、master 与 Pages 交付门禁。
- [x] D3：嵌套路径、保留/依赖/触发、服务器错误/异步过期、控件协议、AIForm 核心复用；随 PR #27 完成 exact-head、master 与 Pages 交付门禁。

Final D0–D3 candidate `619fbe6` also closes the previously recorded default danger-token contrast P2 (`#ff4d4f` → `#b42318`). The separate D9 package, device and publication gates remain open.

## D9 发布与质量门禁

- [ ] 三个 tarball 在无 workspace 软链的临时 Vue 消费项目安装。
- [ ] ESM/CJS、类型、CSS、按需导入、插件安装与 SSR。
  - [x] 根入口 named import 的真实 Vite consumer 已修复并通过：生成 ESM/CJS module roots 标记 `sideEffects:false`，组件 CSS 改为显式 `style.css` 入口；root bundle 不再保留无关 Table/Cascader/TreeSelect/Upload。
  - [ ] 三包完整 ESM/CJS、插件安装、SSR/hydration 组合仍待 D9 总消费者门禁。
- [ ] 引入覆盖率，R1 状态机 branch coverage ≥80%。
- [ ] CI 拆为 unit/typecheck/build/docs/browser/consumer。
- [ ] 消除重复 QG5 E2E，核实 CI 耗时改善。
- [ ] 每个 skip 登记原因、负责人、issue、失效日期。
- [ ] 实体 iOS Safari 的 DnD、Picker、浮层和 Workbench 真实设备验收。
- [ ] 四角色最终逐条完成审计。
- [ ] 发布 aheart-ui@1.1.0、DnD 和 AI 正式版本，验证 registry 和消费者安装。

当前目标保持 active。实体设备、账户/2FA 等尚不能自动证明的门禁不得用模拟器或发布意图代替。
