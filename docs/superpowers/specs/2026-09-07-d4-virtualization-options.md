# D4 大列表性能基线与虚拟化选项

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
- 不新增运行时依赖；优先组件内部实现，必要的公开 props、事件和类型另行评审。
- Select 与 Cascader 的平面/多列语义不能混用；Cascader 需要单独定义每列窗口、展开路径和 lazy load 行为。
- Long Task记录保留startTime；`longTasksAfterMount`过滤mount起点之前条目，但并未将全部条目精确归因至单次键盘或绘制，不据此声称某一具体操作造成全部长任务。

## 可审查实施选择（均未批准）

1. 保持全量DOM：不增加API，保留任意内容/SSR契约；10k初次展开和逐键仍有全量更新成本。本次已修复可见性及重复事件，不声称解决全部大列表性能。
2. 推荐先评审显式启用的固定高度窗口：默认`virtual=false`，不根据数量自动切换。可讨论`listHeight/itemHeight/overscan`，不新增依赖。仅在消费者保证固定高度时窗口化；自定义多行内容继续全量，不能裁掉用户内容作为性能优化。
3. 动态高度窗口作为后续独立子阶段：ResizeObserver测量+高度前缀和/二分定位，锚定首个可见key及行内偏移；重排、文本/字体/宽度变化重算高度。优点是保留任意内容，代价是未知高度估算、跳动与测试复杂度，尚未实现。

固定窗口候选算法：flatten后按typed key保存索引；可见区加overscan，键盘目标不在窗口时先更新窗口/scrollTop，再在nextTick后更新active-descendant或焦点。禁用项不参与导航；active DOM引用不得出现已卸载ID。Cascader每列独立窗口，路径切换丢弃对应列位置；Tree展开收起先重新计算visible序列，再恢复最近可见祖先。

SSR候选契约：服务端与客户端首轮使用相同初始窗口（起点0、由固定配置计算的数量），不能读取window尺寸决定首轮结构；onMounted后再测量/滚动。默认关闭窗口化保留现有完整SSR输出。动态测量缓存不能跨请求共享，显式节点ID及typed token保持稳定；可访问节点位置用aria-posinset/setsize反映逻辑全集。服务端不能“全量渲染、客户端首次直接裁窗”。

后续验收需覆盖：服务端renderToString→客户端hydrate零mismatch；首次defaultOpen和已选尾部项；Home/End/方向键与禁用跳过；搜索后重排/移除活动项；动态高度变化；iframe ownerDocument；窄屏、缩放、Firefox/WebKit。该验收计划为待审方案，不冒充已实现能力。

## 待确认 API 问题

1. 是否公开 `virtual`、`itemHeight`、`overscan`，还是先提供内部实验开关？默认值和兼容策略是什么？
2. 动态 `optionRender` 是否允许任意高度；若允许，是否接受测量抖动和首屏预估高度？
3. 10k 选项的搜索过滤是否仍在主线程；是否需要异步/外部数据源契约？
4. SSR 项目是否要求稳定的服务端窗口；组件如何避免随机 id、窗口大小和 hydration 不一致？
5. 何种浏览器矩阵和证据（桌面、移动 H5、iframe）才足以进入 API 评审？
