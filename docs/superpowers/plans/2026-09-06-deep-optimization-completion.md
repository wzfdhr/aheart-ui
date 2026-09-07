# Aheart UI 深度优化完成清单

目标：完成原 D0→D9 所有优化项，严格审核。只有逐条有对应源码、测试、运行时、审查及交付证据时才关闭项目目标；不得把当前实现重新定义为完整目标。

## 执行规则

- 每阶段：开发实施 → 开发经理复审 → 测试经理测试 → 设计审核 → 产品经理验收 → PR → 合并 master。
- P1/P2 未清零不得合并；公开 API、包边界、主要依赖、全局设计基础或三个以上组件交互模型变更按原用户约定专项评审。
- 当前已核实 master 为 `3dc64ff1734004c2e51cc2a5e6a99a59c85ae1a2`，D3 PR #17 已合并，CI 34015092054 / Pages 34016159317 success。
- D0–D3 既有交付在最终阶段仍需按原要求逐条复核，不仅沿用“已完成”标签。D3 延后的 Form.List 纳入下方待办。

## D4 选择与树形组件

当前：A兼容API、B隔离评估、C仅Select虚拟化已分别通过产品验收，见[逐项交付矩阵](../reviews/2026-09-07-d4-delivery-matrix.md)。这不改变原总目标；剩余范围必须明示，Draft PR只是已授权留存，不是完整D4/合并放行。

最新合并范围裁定：PR18仅为已授权A/B/C增量；未授权的Tree/TreeSelect/Cascader虚拟化不阻塞它，且未实现不等于已获延期。原宽泛checkbox不是四组件虚拟化批准。本PR补证仅限三个Select契约，完成并且当前head远端CI全绿后交产品经理最终裁定。

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
- [ ] 原D4虚拟化总体范围闭合：API、依赖体积与方案须按实际授权审批，保留键盘、SSR、动态高度契约。
  - [x] Select子集已批准并实现：静态TanStack、默认false、height/estimateSize/overscan；真实生产体积/36场景/4组hydrate与产品验收完成。
  - [ ] Tree、TreeSelect、Cascader虚拟化未授权且未实现，仍由后续范围决定；非PR18合并阻断，不表述为已批准延期。
- [x] 成熟引擎优先选型：初评比较三方案，B已完成TanStack隔离评估，C已获准并完成仅Select静态接入。各阶段“当时尚未安装”属于历史，不是当前状态。
- [x] [Draft PR #18](https://github.com/wzfdhr/aheart-ui/pull/18)留存；正文及矩阵明确本批与未完成范围，不等于合并放行。
- [ ] 远端CI全绿及完整D4剩余范围裁定（见PR checks和产品经理后续决定）。
- [ ] 产品经理最终合并裁定，以及获准合并后的master CI/Pages验证；不提前开始D5。

## D5 Table / Pagination

- [ ] 显式本地/服务端 dataMode，排序筛选不混用。
- [ ] 排序、筛选、分页、选择、展开受控拒绝契约。
- [ ] 行级禁用、全选、跨页与保留选择。
- [ ] 筛选使用可交互浮层，确认、重置与受控 open。
- [ ] 固定表头/固定列、横向滚动和稳定列宽。
- [ ] empty/loading/error 状态互不覆盖。
- [ ] Table 内部分页与独立 Pagination 边界统一。
- [ ] 虚拟滚动作为单独子阶段审核和验收。

## D6 Picker / Upload

- [ ] 单值/范围共用 parse/draft/commit/keyboard/disabled 内核。
- [ ] picker-core 为唯一日期能力；清理旧 date-utils 的重复实现。
- [ ] 时间列依据真实 DOM 尺寸，不依赖固定 28px 行高。
- [ ] 输入、点击、Preset、确认、清除与 Escape 的提交时机一致。
- [ ] Upload abort/cancel/retry、校验失败及超时。
- [ ] beforeUpload=false、手动上传、受控 fileList 的一致语义。
- [ ] task ID 隔离迟到进度与完成回调。
- [ ] Upload 使用独立 locale 分组。

## D7 DnD

- [ ] 稳定 itemKey，不依赖拖动开始时的 index。
- [ ] 列表 revision 与外部数据变化后的过期拖放拒绝。
- [ ] 跨列表事务及父拒绝完整回滚。
- [ ] Draggable / DropZone 键盘替代操作。
- [ ] live region 宣布源、目标、失败原因和最终结果。
- [ ] 自动滚动使用 ownerDocument/defaultView，支持 iframe。
- [ ] 拖动中插入/删除/刷新/卸载/路由切换覆盖。

## D8 AI

- [ ] AIStreamEventV2 版本、requestId、sequence、revision。
- [ ] 重复/乱序/断线重连和服务端最终消息处理。
- [ ] AIChatPanel 卸载、切会话 abort 与迟到事件隔离。
- [ ] 审批、取消、重试 pending/success/error 和幂等标识。
- [ ] Workbench 单一状态源，桌面/移动不再双实例分叉。
- [ ] reorderable、任务依赖约束及锁定原因。
- [ ] AIForm 范围、格式、跨字段、异步规则、reset/validate 完整；复用核心 Form。
- [ ] 工具调用展示业务摘要、输入状态与结果，不展示隐藏推理。

## 延后项与 D0–D3 最终复核

- [ ] Form.List API 评审、实现、动态数组增删移动与稳定字段身份。
- [ ] D0：WebKit Modal 20 次零偶发、DnD 消费端类型、QG4 真实证据、Pages 质量保护。
- [ ] D1：五个内部 helper 契约及优先迁移组件；默认值初始化、父接受/拒绝、异步生命周期。
- [ ] D2：完整浮层堆栈、焦点/滚动管理、placement/arrow/motion/container、关闭中重开、自动 ARIA 与嵌套场景。
- [ ] D3：嵌套路径、保留/依赖/触发、服务器错误/异步过期、控件协议、AIForm 核心复用。

## D9 发布与质量门禁

- [ ] 三个 tarball 在无 workspace 软链的临时 Vue 消费项目安装。
- [ ] ESM/CJS、类型、CSS、按需导入、插件安装与 SSR。
- [ ] 引入覆盖率，R1 状态机 branch coverage ≥80%。
- [ ] CI 拆为 unit/typecheck/build/docs/browser/consumer。
- [ ] 消除重复 QG5 E2E，核实 CI 耗时改善。
- [ ] 每个 skip 登记原因、负责人、issue、失效日期。
- [ ] 实体 iOS Safari 的 DnD、Picker、浮层和 Workbench 真实设备验收。
- [ ] 四角色最终逐条完成审计。
- [ ] 发布 aheart-ui@1.1.0、DnD 和 AI 正式版本，验证 registry 和消费者安装。

当前目标保持 active。实体设备、账户/2FA 等尚不能自动证明的门禁不得用模拟器或发布意图代替。
