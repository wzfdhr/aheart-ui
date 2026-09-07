# D4 大列表性能基线与虚拟化选项

最新授权：用户“按照你规划继续”已批准成熟引擎优先的B组隔离适配验证，允许在隔离目录安装评估所需依赖；按A实施验收→B隔离验证执行。本文件涉及的核心正式依赖、virtual props/default策略、四组件接入仍未批准。

## 当前基线

`scripts/d4-browser-performance.mjs` 使用临时 Vite harness，将仓库中的 `select.vue` 与 `cascader.vue` 直接加载到真实 Chromium 页面，覆盖 1,000、5,000、10,000 个选项。Select 分别测量固定单行和交错多行 `optionRender`，Cascader 测量平面叶子选项；每个规模测量浏览器内 `createApp.mount` 至 `nextTick`/一帧、打开、搜索过滤，并对 Select 追加 20 次 ArrowDown。结果 JSON 保存在 `docs/superpowers/evidence/d4-performance/`。这是固定 1440x900 桌面环境的单轮、非统计性基线，不是绝对耗时门槛，也不代表移动端或生产构建。

复现：

```sh
corepack pnpm exec node scripts/d4-browser-performance.mjs
```

## 实际测量与发现

采用 `baseline-2026-09-07T034506Z.json` 为修复后基线：Chromium开发模式1440×900，完整主题tokens，单轮；mount仅计浏览器内mount至nextTick/RAF，open/search/keyboard包含Playwright往返，不可据此计算纯渲染FPS。机器JSON保存浏览器版本、源码哈希、长任务时间戳与行高，不以绝对时间作跨机器门槛。

| 场景 | 规模 | 展开ms | 搜索ms | 20次方向键ms | DOM | 活动项可见 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Select固定32px | 1k /5k /10k | 99 /233 /379 | 8 /17 /28 | 148 /602 /1098 | 1k /5k /10k | 是 |
| Select交错32/46px | 1k /5k /10k | 92 /237 /404 | 7 /21 /31 | 148 /616 /1171 | 1k /5k /10k | 是 |
| Cascader固定32px | 1k /5k /10k | 85 /169 /296 | 6 /18 /32 | 99 /476 /947 | 1k /5k /10k | 是 |

真实测量暴露两个内部缺陷：Select活动项不滚入浮层；搜索input和selector重复处理同一键盘冒泡事件，20次方向键跳40项。已在现有API内修复，`--require-visible` 要求所有9场景DOM数量正确、活动项是Option 00020且在真实popup/column可见范围。新增单测要求搜索多选Enter只提交一次。

数据筛选说明：早期 `033912Z` 文件对Select错误比较完整list高度且Cascader没有键盘测量，该文件不作为验收数据；`034106Z`为修正测量方法后的缺陷基线；`034242Z`仅修复滚动但仍跳两项；最终采用`034506Z`。它们保留用于溯源，不能选择性引用早期true值。

## 方案边界与取舍

默认不自动启用虚拟化。先以基线和真实交互证据确认收益，再单独审批公开 API；本文件不批准 API，也不改变现有组件行为。

### 固定行高

固定 `itemHeight`/viewport 可用索引窗口加少量 overscan，滚动计算简单、键盘定位可预测、DOM 最少。代价是内容必须满足固定高度，动态 `optionRender` 溢出或多行内容会错位；需要明确 CSS 裁剪或测量约束。

### 动态行高

测量已渲染行并维护高度前缀和，能保留动态 optionRender，但首次测量、滚动锚定和高度变化会增加复杂度。大列表快速滚动时需要处理未测量行和滚动跳动，不能只以 DOM 数下降判断成功。

## 必须保留的交互契约

- 键盘 active 项必须始终有可查询的 DOM 节点（或等价的稳定 active 语义）；`aria-activedescendant` 不得指向已卸载节点。
- active 项变化要滚动到可见区域，鼠标 hover、PageUp/PageDown、Home/End 与搜索后的首项保持一致。
- SSR 与 hydration 的初始窗口、option id 和 active 语义必须一致，不能因客户端首次测量造成 hydration mismatch。
- 当前未授权新增运行时依赖；选型先评估成熟引擎，再比较无依赖实现。若推荐引入依赖，和必要公开 props、事件、类型一起专项确认，不默认自研。
- Select 与 Cascader 的平面/多列语义不能混用；Cascader 需要单独定义每列窗口、展开路径和 lazy load 行为。
- Long Task记录保留startTime；`longTasksAfterMount`过滤mount起点之前条目，但并未将全部条目精确归因至单次键盘或绘制，不据此声称某一具体操作造成全部长任务。

## 可审查实施选择（均未批准）

1. 保持全量DOM：不增加API，保留任意内容/SSR契约；10k初次展开和逐键仍有全量更新成本。本次已修复可见性及重复事件，不声称解决全部大列表性能。
2. 推荐先评审显式启用的窗口能力及成熟引擎适配：默认`virtual=false`，不根据数量自动切换。可讨论`listHeight/itemHeight/overscan`；依赖选择见下节。固定高度路径先覆盖已知高度，自定义多行内容不能因优化被裁掉。
3. 动态高度窗口作为后续独立子阶段：ResizeObserver测量+高度前缀和/二分定位，锚定首个可见key及行内偏移；重排、文本/字体/宽度变化重算高度。优点是保留任意内容，代价是未知高度估算、跳动与测试复杂度，尚未实现。

固定窗口候选算法：flatten后按typed key保存索引；可见区加overscan，键盘目标不在窗口时先更新窗口/scrollTop，再在nextTick后更新active-descendant或焦点。禁用项不参与导航；active DOM引用不得出现已卸载ID。Cascader每列独立窗口，路径切换丢弃对应列位置；Tree展开收起先重新计算visible序列，再恢复最近可见祖先。

SSR候选契约：服务端与客户端首轮使用相同初始窗口（起点0、由固定配置计算的数量），不能读取window尺寸决定首轮结构；onMounted后再测量/滚动。默认关闭窗口化保留现有完整SSR输出。动态测量缓存不能跨请求共享，显式节点ID及typed token保持稳定；可访问节点位置用aria-posinset/setsize反映逻辑全集。服务端不能“全量渲染、客户端首次直接裁窗”。

后续验收需覆盖：服务端renderToString→客户端hydrate零mismatch；首次defaultOpen和已选尾部项；Home/End/方向键与禁用跳过；搜索后重排/移除活动项；动态高度变化；iframe ownerDocument；窄屏、缩放、Firefox/WebKit。该验收计划为待审方案，不冒充已实现能力。

## 待确认 API 问题

以下是评审清单，尚未要求实现或批准；具体推荐与决策分组见下节。

1. 是否公开 `virtual`、`itemHeight`、`overscan`，还是先提供内部实验开关？默认值和兼容策略是什么？
2. 动态 `optionRender` 是否允许任意高度；若允许，是否接受测量抖动和首屏预估高度？
3. 10k 选项的搜索过滤是否仍在主线程；是否需要异步/外部数据源契约？
4. SSR 项目是否要求稳定的服务端窗口；组件如何避免随机 id、窗口大小和 hydration 不一致？
5. 何种浏览器矩阵和证据（桌面、移动 H5、iframe）才足以进入 API 评审？

## 成熟引擎优先比较（2026-09-07实查）

只读查询：`npm view @tanstack/vue-virtual version dependencies peerDependencies dist.unpackedSize exports license --json`，对`@tanstack/virtual-core`与`vue-virtual-scroller`同样查询。没有安装包、修改锁文件或接入引擎。

| 方案 | 已核验包形态及能力 | Aheart需承担的工作 | 主要成本/风险 |
| --- | --- | --- | --- |
| 首选评估：@tanstack/vue-virtual 3.13.36 + virtual-core 3.17.8 | MIT；Vue适配器调用核心Virtualizer；提供import/require入口。initialRect、getItemKey、measureElement、rangeExtractor支持初始尺寸、稳定key、动态测量及自定义渲染范围 | 在现有popup/column上挂接headless引擎；typed key与活动项固定渲染；Tree可见列表及Cascader各列映射；SSR初始范围一致 | 引入适配器+核心两包；动态高度锚点、焦点/ARIA、容器生命周期仍由本库验证，并非安装即获得完整可访问性 |
| 备选：vue-virtual-scroller 3.0.5 | MIT；Vue ^3.3.0；RecycleScroller/DynamicScroller及headless composables；ESM-only | 可选headless保留现有DOM；如用组件式API需整合其CSS和复用节点生命周期；验证焦点节点身份不随回收错配 | 本库CJS产物不能直接假设可require该ESM包，需额外评估bundling/消费端兼容；组件复用带来额外焦点/样式适配 |
| 比较基线：无依赖自研 | 无新增外部包；固定行高窗口可直接使用typed索引 | 固定窗口、overscan、滚动锚点、ResizeObserver动态测量、缓存失效、SSR、跨Document销毁与定位都需自行实现维护 | 固定路径代码较少不代表动态路径便宜；上游引擎已解决的测量/滚动边界将变成本库长期负担，不作默认选择 |

能力来源：[TanStack Vue adapter](https://tanstack.com/virtual/latest/docs/framework/vue/vue-virtual)、[Virtualizer API](https://tanstack.com/virtual/latest/docs/api/virtualizer)、[vue-virtual-scroller官方指南](https://github.com/Akryum/vue-virtual-scroller/blob/master/docs/guide/index.md)。选型推荐为对上述能力与本库既有ESM/CJS、typed-key和ARIA契约的工程判断，并非已运行两引擎对比测试。

### 体积与维护成本

Registry实查unpackedSize：Vue Virtual适配器18,928字节，核心410,424字节，合计429,352字节；vue-virtual-scroller 462,625字节。该口径包含分发源码、声明、map等，**不是浏览器min+gzip体积，不能用于断言谁更轻**。包元数据可由上述npm view命令复查；MIT许可仅是元数据核对，不代表完成全部依赖审查。

进入获批的隔离适配验证时，三方案用同一个生产Vite消费者构建、external Vue、关闭sourceMap，并比较raw/gzip/Brotli增量、CSS、ESM/CJS导入、未启用virtual时的tree-shaking结果。固定和动态场景分别记录冷开/热开、键盘单步、布局稳定、内存与DOM数量；不以当前开发模式基线推算引擎收益。

工作量判断（非工期承诺）：三个方案都需完成同一套键盘、SSR、五浏览器、iframe验收。TanStack额外工作主要为四组件适配；vue-virtual-scroller还需先解决CJS策略与节点回收/样式适配；自研则额外负责动态测量缓存、前缀和索引、锚点修正与长期维护。先做TanStack固定+动态各一份隔离验证，若CJS/动态测量/体积不达要求再比较备选，避免直接投入完整自研。

### 当前待决策与推荐

- **D4 Tree/Cascader兼容API组**：用户已批准checkStrictly默认true、派生半选、Tree loadData(signal)、TreeSelect对应能力和Cascader signal；已进入A实施与验收。
- **虚拟化独立组**：用户已批准“成熟引擎优先的隔离验证”，首选TanStack，比较上表备选后再决定核心运行时依赖与最终props。允许隔离目录评估依赖安装；默认不开启，不按数量自动切换，不直接批准四组件全部接入、自研动态引擎或新增包边界。

前批内部代码修复、完整门禁、真实浏览器基线与初始方案准备已完成；A与B现按本次授权继续执行，不再重复索要同一确认。A当前冻结候选和角色门禁以status文件为准；B结果出来后再提交核心接入具体方案。PR/主线CI/Pages及D5仍按完整D4验收门禁执行。

## B 隔离验证续记

A组现已获产品验收。获授权后，只在临时消费者安装TanStack与评估工具，Aheart使用当前候选tarball；前文“没有安装包”是早期只读选型时状态，现不再是B实验状态。核心依赖、根锁文件与默认行为未变。

实测与复现见[B实施报告](../reviews/2026-09-07-d4-b-implementation.md)。external Vue的adapter导出入口为raw23060/gzip6970/Brotli6334字节；未使用import可移除，运行时disabled仍包含引擎。ESM/CJS、固定/动态SSR hydration和10k自建列表的键盘/行高机制已通过实施者自测，独立开发复审在严格限定结论后无B阻断；独立测试与产品裁定以各自报告为准。

这不是Aheart组件窗口化接入，不提供与旧开发模式基线的加速比。此前计划的真实组件冷/热开、搜索、长任务、统计内存及完整浏览器矩阵尚未执行，不可将初步可行性升级为那些门禁已通过。是否采用TanStack依赖、如何保证默认消费成本、公开props与正式集成范围仍待最终裁定。
