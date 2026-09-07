# Select virtual API 草案（仅文档，未获接入授权）

B隔离验证已获产品验收，不等于核心依赖/API/默认加载策略获准。用户仍需选择静态TanStack依赖或独立可选入口；本草案不安装依赖、不改源码或产物。先仅Select，其他三个组件不随本草案自动接入。

## 推荐接口与本地风格

沿用`select/types.ts`中`SelectXxx`类型命名、`selectProps`与根/组件barrel显式导出风格，拟定：

```ts
export interface SelectVirtualConfig {
  height?: number
  estimateSize?: number
  overscan?: number
}
export type SelectVirtual = boolean | SelectVirtualConfig
// Select props: virtual?: SelectVirtual
```

`virtual=false`为默认；未提供/undefined不启用。`true`与`{}`均显式启用默认配置。只解释该字段，不新增ConfigProvider自动全局开关，不根据options数量切换。名称是待审草案，不是现有可调用API，不直接暴露TanStack实例或上游所有参数。

| 参数 | 草案默认 | 约束与语义 |
| --- | ---: | --- |
| height | 288 | 有限正数，单位CSS px；窗口目标上限，不撑高空列表。实际高度同时受内容总高、popup可用空间和现有视口限制约束 |
| estimateSize | 32 | 有限正数，单位CSS px；仅未测量选项的初始估计，不是固定行高，不覆盖用户optionRender内容 |
| overscan | 3 | 非负安全整数；向两侧额外渲染行数，不含必须保留的active项；大值会增加DOM，不承诺性能不变 |

默认数字来自本地样式：`select/style.css`popup外框上限288px、桌面option最小32px。`height`沿用外框上限口径，内部窗口须扣除padding/border，不叠加第二个288px滚动容器；现有list的2px间距单独计入布局，不把它误算成option测量高度。移动粗指针option最小44px，不能强制32px裁切；首轮SSR/client共用32px估计，mount后以真实元素测量修正，调用方可显式使用相同的44px估计。`height`不会取消当前窄屏/可用空间上限。

拟议无效输入处理：配置字段NaN/Infinity/非正高度/非整数overscan回退各自默认，开发模式告警，生产不因可选优化配置抛错；`virtual`为null/数组/其他错误运行时类型时回退false。类型检查与运行时校验都需测试；该容错规则同样待API审核。不开启时忽略配置且保留现有完整DOM路径，不改事件签名、modelValue或搜索/选中语义。

## 内部适配契约

- 复用Select现有规范化/过滤/排序后的逻辑序列与typed value token，不能以DOM挂载子集作为完整数据源；optionRender索引仍沿用现有语义。
- active选项保留在渲染范围，`aria-activedescendant`不得指向已卸载ID。方向键与禁用跳过、输入法、单次Enter提交及焦点均与非虚拟路径一致；用户滚动可以让active暂离视口，键盘移动必须将目标滚入视口。
- 搜索、重排、删除active与清空时，先按完整逻辑序列恢复合法active，再同步窗口；不因测量或滚动发出change/search/modelValue事件。
- 动态optionRender使用实际行高测量；字体、宽度、内容、移动行高变化后更新测量，保持稳定key与滚动锚点，不把多行内容裁成estimateSize。
- 服务端和客户端首轮使用相同初始窗口/ID/估算配置，不从window媒体查询生成不同首轮树。defaultOpen和已选尾项要单独验证hydrate再定位；不得共享跨SSR请求缓存。
- 使用popup所在ownerDocument/defaultView，关闭/重开、禁用、移除及iframe卸载须停止观察和迟到定位；复用现有弹层焦点/事件边界。

## 接入方式待选择

推荐静态TanStack适配作为最小单组件批次，但需明确接受默认消费引擎代码成本：`virtual=false`只保持运行行为，不保证构建移除依赖。B的external Vue入口约6.8KiB gzip不是未来真实Select增量承诺，正式产物必须复测。

若用户要求默认入口零新增引擎成本，则先审可选入口/包边界方案，包括用户导入方式、ESM/CJS/types、CSS共享和SSR入口；不可在本轮自行新增包或以异步导入掩盖首开/SSR代价。这两个选择在用户决定前均不实施。

## 获准后的RED→GREEN与验收清单

1. 参数与类型：false/true/空配置、边界和无效值、类型/barrel声明；默认路径DOM/事件不变。先写失败用例，再实现。
2. 实际Select：固定与任意多行optionRender、single/multiple/tags、disabled、IME、Enter不重复提交、搜索重排/删除active、Home/End及既有支持的其他导航；每步断言active身份、可见性与焦点，不能只数DOM。
3. 动态：32/44/多行与运行时增高、宽度/字体变化、列表中部更新的滚动锚点、展开关闭重开、边缘尾项、无结果、全禁用、1k/5k/10k。
4. SSR：真实打包产物renderToString→hydrate，首开与已选尾部项、稳定ID、零mismatch；CJS require与ESM消费者、声明消费、CSS/unused/tree-shaking/默认关闭包成本独立测量。
5. 浏览器：现有五浏览器矩阵和iframe ownerDocument，移动触控、窄屏、视觉证据及键盘语义；物理设备/读屏未执行时明确未覆盖。
6. 性能：同一真实Select仅切换virtual，完全相同数据/样式/交互的生产冷开、热开、搜索、逐键、长任务与heap；重复采样并报告环境/口径，不与旧开发模式数据直接计算加速比。
7. 角色顺序：实施与冻结→独立开发复审→独立测试→必要运行时设计复核→产品验收。默认路径回归和新增虚拟路径分别报告，候选变化重验受影响门禁。

## 剩余D4交付梳理

A兼容API及B隔离可行性已获各自产品验收；旧iframe与Select键盘问题按既有产品记录关闭。尚未完成：用户正式接入选择、被批准批次的实现及上述门禁、完整D4最终产品/发布边界裁定、PR/主线CI/Pages验证。虚拟树与多列Cascader属于未来单独范围，不因Select草案默认为必做或已放行；是否纳入D4由产品明确。没有把局部通过当作完整D4合并许可，D5尚未启动。
