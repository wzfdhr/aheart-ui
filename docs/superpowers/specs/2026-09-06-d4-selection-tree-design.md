# D4 API 与内部架构专项评审

状态：用户回复“按照你规划继续”，A组下述兼容公共API已获授权，现进入失败测试→实现→验收。B组仅成熟引擎隔离适配验证获批，可在隔离目录安装评估依赖；核心包正式依赖、虚拟化props/default策略和自动开启仍未批准。执行顺序A验收→B隔离验证。

## 推荐契约

1. Tree 新增 `checkStrictly`，默认 true，保持现有独立勾选；显式 false 开启父子联动和派生半选。`checkedKeys` 保持 key 数组，`check` 事件保留原 keys/node 参数并追加可选信息 `{ halfCheckedKeys }`。禁用节点作为联动边界，不改变其子树的值。
2. TreeNodeData 新增 `isLeaf?: boolean`；Tree 新增 `loadData(node, { signal }) => Promise<TreeNodeData[] | void>`。返回 children 时存内部数据补丁，返回 void 时等待调用方更新 treeData。加载去重、失败可重试、数据替换/卸载使旧任务失效；不修改调用方 treeData。
3. TreeSelect 新增 `treeCheckable`、`treeCheckStrictly` 和 `loadData`，复用同一 Tree 模型。现有默认选择模式不变；开启勾选后 modelValue 为完整已勾选 key 数组，半选不进入值。仍由父层决定是否接受 value 更新。
4. Cascader 保留现有 loadData 回调，追加可忽略的 `{ signal }` 参数；组件内显示 pending/error/retry，新的 options 或路径请求使旧结果失效。补齐键盘和活动路径恢复。
5. Select 首先修复 IME 与 typed-key 活动项，不改已有 props/events。大列表方案先测量原始渲染开销与虚拟化体积；必要的 virtual/listHeight/itemHeight API 和依赖只在精确评估后单独确认，不直接安装新依赖。
6. DOM 身份区分数字 1 与字符串 '1'；不把 String(key) 当内部身份。实际 treeitem 具有稳定 ID、层级、位置与 setsize，TreeSelect 不再用运行时扫描给节点补 ID。

## 审核与验收

- typed key、重复 key、深层数据、数据替换及祖先折叠的焦点恢复。
- 父/子勾选、半选、strict 模式、禁用子树、受控父接受/拒绝。
- lazy success/error/retry、重复请求、取消、切换数据与卸载迟到结果。
- IME composition 中 Enter/方向键不选择或关闭，结束后只提交最终搜索词。
- TreeSelect 复用索引/勾选/懒加载，Cascader 键盘全过程及恢复。
- 真实浏览器含窄屏、ARIA、截图及性能证据；P1/P2 零才提交 PR 并合并。

实施锁定：checkStrictly默认true；false下从已接受checkedKeys派生父子和半选，禁用节点及其后代是隔离边界，保留其原有显式keys；半选不进入checkedKeys。check事件保留(keys,node)并追加{halfCheckedKeys}。加载不修改输入树，按typed key去重；收起、替换数据/loader、禁用、卸载取消请求并忽略迟到结果；失败保持可重试，isLeaf=true不触发加载。返回void等待调用方更新treeData，不伪造children。受控父层拒绝展开/勾选时保持已接受UI状态。Tree模型先稳定，再由TreeSelect复用；不借搜索过滤改变原树联动边界。

## 已完成的内部批次

- Tree/TreeSelect 共用 typed-key 索引与迭代过滤，真实焦点节点承担完整 treeitem 语义；禁用祖先成为事件边界。
- Select 使用稳定 value key 维持 active option，IME 期间不误选/关闭，compositionend 只提交最终搜索值。
- Cascader 使用 typed path token，补齐 Enter/ArrowUp，options 替换和路径切换会隔离旧 lazy 结果，失败状态可见并可点击或 Enter 重试。
- 窄屏 Cascader 两列适配视口，三列以上保留横向滚动；桌面与 390×844 运行时截图已复核。

## 大列表测量与待批范围

本机 jsdom 同进程基线（仅用于方案比较，不作为跨机器硬阈值）：

| 扁平选项数 | Select 首次展开 | Select 搜索 | Cascader 首次展开 | 初始 DOM 数量 |
| --- | ---: | ---: | ---: | ---: |
| 1,000 | 89.5 ms | 10.6 ms | 48.3 ms | 1,000 |
| 5,000 | 520.8 ms | 33.7 ms | 360.2 ms | 5,000 |
| 10,000 | 1,438.7 ms | 60.3 ms | 1,219.5 ms | 10,000 |

以上仅为 jsdom 探索性基线，不能替代真实浏览器的渲染、绘制和输入延迟测量。下一步补真实浏览器固定/动态高度基线，再单独评审窗口化方案。窗口化不随本次 Tree/Cascader API 确认一并批准，不按选项数量自动开启、不引入新依赖。候选 `virtual`（默认关闭）、`listHeight`、`itemHeight` 等公共配置仅是待审选项，需明确动态高度、键盘活动节点、SSR/hydration 和关闭窗口化的兼容影响后才能实施。
