# D5 Table / Pagination：范围与 API 专项评审草案

状态：2026-09-08用户明确回复“批准”，下述D5-A兼容API与行为方案已获批准，进入RED→GREEN实施。D5-B/C不在此次批准范围，仍单独评审。

## 基线与隔离

- 工作分支：`codex/d5-table-pagination`，基线 `92cbb52b470741be795b95f981e67f398c4cbc81`（D4收尾PR #19已合并）。该文档合并后的主线CI在启动核对时仍在运行，未宣称部署已完成。
- D4的Tree/TreeSelect/Cascader虚拟化已批准延期，不纳入D5。
- `/Users/start/Desktop/aheart-ui`存在用户未提交的Table SSR测试、workspace配置和logo资产，全部保留；本分支从远端已合并状态开始，不复制这些工作。
- pnpm 9.15.4冻结安装通过；Node 20.20.2下Table 29/Pagination 18，共47项原测试通过，组件typecheck通过。此为现有行为基线，不是新增D5契约验收。

## 分批范围

| 批次 | 目标 | 授权与退出门禁 |
| --- | --- | --- |
| D5-A | 数据模式、受控排序/筛选/分页/选择/展开、行禁用和全选、Pagination共用边界 | 先批准下述兼容API方案，再RED→GREEN；独立开发复审、独立测试、必要运行时/设计及产品验收。 |
| D5-B | 可交互筛选浮层、固定表头/列、横向滚动/列宽、empty/loading/error | 精确API和视觉方案单独评审，不随A默认批准。 |
| D5-C | Table虚拟滚动 | 单独测量、方案/API/依赖体积评审和验收；不因已有Select引擎而自动复用或批准。 |

三批都保留在D5总目标中；分批不是延期，不把A通过说成整个D5完成。无新增包、无主要依赖变更；若后续证明需要，再提出专项方案。

## D5-A 推荐契约

### 1. 显式数据模式与迁移兼容

新增可选`dataMode?: 'local' | 'server'`。省略时保留当前历史行为作为兼容路径，不新增第三个公开枚举值，也不偷偷把已有调用切成不同数据模式。

| 输入 | 排序/筛选/分页行为 | total |
| --- | --- | --- |
| `dataMode='local'` | 对dataSource副本进行筛选→稳定排序→分页，不变异调用方数据 | 忽略pagination.total，来自筛选后的本地记录数，并据此计算页数；不再由pagination.total暗中关闭分页。 |
| `dataMode='server'` | 原样展示调用方提供的本页数据；点击只发出查询请求，不再本地重排、筛选或二次切页 | 优先使用pagination.total；缺省用当前数据长度作为安全回退，文档要求远端总数由调用方提供。 |
| 不传dataMode | 保留既有本地排序/筛选；pagination.total存在时不切页的历史路径 | 兼容现有调用。新示例显式填写模式，并说明这是迁移保留而非推荐混合模式。 |

不在Table内部请求网络。服务端并发/请求取消由应用控制；组件只能保证不伪装为已收到新的服务端数据。`change`的参数顺序与既有action保持兼容；server模式的`extra.currentDataSource`是当前传入数组的浅拷贝（记录引用不深拷贝），不是内部派生数组或假造的下一页数据。省略模式+total的既有混合路径必须有兼容快照测试，不称作推荐的server模式。

### 2. 受控状态与查询请求

- 排序、筛选、current、pageSize、selectedRowKeys和expandedRowKeys都以父层接受后的prop为准；点击/原生input变化只发请求，不将受控请求值偷偷提交为内部事实。
- `sortOrder`拟支持`null`表示“受控且无排序”，覆盖defaultSortOrder和旧内部排序；`undefined`继续表示未控制，以免破坏已有初始化代码。单列排序语义不变；多列同时控制时按可见columns顺序取第一个sortOrder不为undefined的列（含null），不引入多列排序。过滤`filteredValue=[]`表示受控清空；保留既有默认值一次性初始化。
- 点击受控排序/筛选而父层拒绝时，不应悄悄重置未受控页码；接受后的查询变化才更新显示状态。事件可报告请求页码1，但UI仍反映已接受状态。必须覆盖“拒绝后再次点击”和异步接受。
- 该页码约束按受控维度分别处理：未受控查询在本地接受后重置未受控页码；受控查询被拒绝时查询UI和页码保持原值，父层异步接受后才重置未受控页码。受控页码始终由父层值决定。接受prop更新不再次发出用户change请求。server模式同样区分受控/未受控查询控件：未受控控件可显示本地接受的请求状态，但数据仍原样展示；需要查询、页码和响应共同提交的应用须控制这些字段，不虚构服务端接受确认。
- 分页总数/大小归一化使用内部共用纯函数，Table与Pagination不能各自生成NaN、Infinity、小数页码或相反的边界结果；不新增公开工具导出。
- 合法pageSize为正整数；非有限值或非正值沿用安全回退1，正小数取整。current归一到合法整数页码，非法值回退1；total归一为非负有限整数，非法值回退0。父层原始props不变异，纯显示归一化不主动制造change事件。
- pageSize改变时保留当前页码并向新页数上界夹取，保留现有事件参数顺序；明确区分“请求的current/pageSize”与“父层实际接受的current/pageSize”，避免遗漏一次update或发送重复change。
- 非法输入和外部prop变化的显示归一化不自动发update或change；用户操作的请求值必须为归一化整数。受控pageSize被拒绝时不永久写入候选页数引起的current夹取；接受后再按实际pageCount归一显示。一次用户操作只发一次change，之后prop接受不再次发送。四种current/pageSize受控组合及部分接受均需对照测试。

### 3. 行禁用、全选与保留选择

- `TableRowSelection<T extends TableRecord = TableRecord>`拟新增`getCheckboxProps(record: T): { disabled?: boolean }`及`preserveSelectedRowKeys?: boolean`；新增默认泛型保持旧类型引用兼容，不承诺当前非泛型SFC自动推导所有record类型，需补实际消费端类型测试。
- preserve默认true，延续现有选择key不会随分页/数据替换自动删除的行为；显式false才按当前已知dataSource裁剪未受控选择。受控选择仍由父层拥有，不擅自改写或凭数据消失发更新请求。
- 当前已知范围指原始dataSource：local为传入的完整本地集合，server为当前传入响应页，不是筛选/分页后的可见子集。preserve=false时按其key集合变化在下一次渲染前裁剪未受控选择，不因本地过滤或换页自行裁剪；这种外部数据派生更新不伪造select/selectAll/update事件，受控keys保持父权威。
- 全选只作用于当前可见页中可选择的行；禁用行不加入请求、不被取消，其他页已保留的key不丢失。全禁用时表头复选框禁用，radio模式无全选。
- 表头checked/indeterminate按可选择行计算；数字/字符串key严格区分；选择事件只包含已知record，不为远端缓存外key伪造记录。
- key使用Set/Array.includes的SameValueZero语义（数字1与字符串1不同，0与-0相同）；跨页保留和server数据必须提供稳定唯一的字符串或有限数字rowKey。缺失、重复或非法key开发期警告；保留旧index回退路径以兼容，但文档明确其不能保证数据重排或换页后的身份，不能宣称支持无稳定key的跨页保留。
- 新增组件事件签名为`selectAll(selected: boolean, selectedRowKeys: TableKey[], changedRows: TableRecord[])`；keys是请求后的完整集合，已有key顺序保持，新key按当前页顺序追加，去重；取消全选只移除当前页可选key，保留其他key。changedRows仅含本次实际改变的可选行，顺序与当前页一致，不含disabled行。
- 一次有效全选操作先发一次`update:selectedRowKeys`，再发一次`selectAll`，不发逐行select；候选集合无变化时不发事件。受控父拒绝时载荷仍表示请求，但DOM保持父层状态；事件数组为独立浅拷贝，不允许监听器改写内部集合。
- 现有单行`select`、`expand`和更新事件保留。A只验证disabled和分页请求状态；loading是否锁定查询/分页交互留在B专项，A不默改loading行为。

### 4. Table与独立Pagination统一

- 当前Table内部Pagination会按total>50自动显示大小控件，不能称它没有该控件；但Table尚未保存未受控pageSize，也缺少显式控制项透传。保留当前pagination配置，并评审增加`showSizeChanger`、`pageSizeOptions`、`showQuickJumper`与`totalBoundaryShowSizeChanger`的透传；引用Pagination现有公开类型，不复制另一套值域。
- Table拥有其未受控current/pageSize；内部Pagination以受控值呈现，大小切换不能只发事件而不改变未受控Table实际切页。
- 先覆盖Table与独立Pagination相同输入/操作的输出对照，再追加真实浏览器的父拒绝和总数收缩测试。

## D5-B / C 边界（未在本草案请求实现授权）

- 筛选浮层需有草稿、确认、重置、关闭/取消、受控open及焦点恢复，复用现有浮层能力；不把内联filter按钮直接改成没有键盘协议的弹层。
- 固定布局需明确scroll容器、列宽单位、sticky偏移与左右固定列重叠边界；固定表头不能破坏原生表格语义。
- 状态优先级、错误文案/重试事件、加载时是否保留旧行和禁用交互需结合运行时设计评审，不能新增error prop后即称状态完整。
- Table虚拟滚动须先测量基线，再评审分页/展开/固定列/行选择/SSR的组合，避免复制Select方案后未验证就认定可用。

## 验证和交付要求

1. 原47项回归保留；新增场景先展示可复现失败，再修复。已通过的原行为只记覆盖补齐，不虚构实现缺陷。
2. A的核心测试：三种数据路径、混合受控接受/拒绝、查询重置页码、页大小事件、非法输入与总数收缩、跨页/禁用/全选、typed keys、默认值及受控切换、SSR稳定性。
3. 真实浏览器：至少覆盖桌面/移动Chromium、Firefox、桌面/移动WebKit的受影响契约；本地生成物/单测不能替代运行时验证。必要视觉审核按阶段的新变化执行。
4. 候选绑定源码SHA/清单→独立复审→独立测试→必要设计→产品验收→PR→最新head CI→用户授权合并。P1/P2不清零不合并；保留失败与重跑历史。
5. 不自动启动D6，不改D9的CI结构或发布门禁；D5-C仍单独审核。

## 已批准决定

用户已批准先执行D5-A：接受上述可选dataMode与旧行为兼容路径、受控空排序null、行选择扩展、分页透传和统一归一化。B/C继续保留待评审，不自动扩大本批范围。
