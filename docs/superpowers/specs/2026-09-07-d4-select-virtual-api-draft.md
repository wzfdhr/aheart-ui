# Select virtual API 规格（已实现并通过C批产品验收）

## 2026-09-07 正式授权与定稿

用户已批准并完成仅Select静态TanStack接入，C批已通过[产品验收](../reviews/2026-09-07-d4-c-product-review.md)。virtual默认false、显式开启、动态测量，使用下文公开类型及288/32/3默认，数字校验/回退，不公开上游实例。依赖Vue Virtual3.13.36（核心3.17.8），pnpm9.15.4及既有ESM/CJS分发。独立可选入口、自动开启、Tree/TreeSelect/Cascader虚拟化不在已授权C批，不代表这些原路线图项已获批准延期。Draft PR留存已授权，完整D4范围与远端CI/合并裁定仍待核对。

当前证据：122文件指纹1f7b2f22…505bd9；components1121、完整E2E449通过/127既有skip、真实consumer36场景及4组hydrate通过。桌面Web专业工具为主，手机网站辅助兼容；保留本批矩阵，不新增原生App或额外实体手机门禁。

## 已实现接口与本地风格

沿用`select/types.ts`中`SelectXxx`类型命名、`selectProps`与根/组件barrel显式导出风格，当前接口：

```ts
export interface SelectVirtualConfig {
  height?: number
  estimateSize?: number
  overscan?: number
}
export type SelectVirtual = boolean | SelectVirtualConfig
// Select props: virtual?: SelectVirtual
```

`virtual=false`为默认；未提供/undefined不启用。`true`与`{}`均显式启用默认配置。没有新增ConfigProvider自动全局开关，也不根据options数量切换。类型已从根/组件barrel导出并随es/lib分发，不直接暴露TanStack实例或上游所有参数。

| 参数 | 默认 | 约束与语义 |
| --- | ---: | --- |
| height | 288 | 有限正数，单位CSS px；窗口目标上限，不撑高空列表。实际高度同时受内容总高、popup可用空间和现有视口限制约束 |
| estimateSize | 32 | 有限正数，单位CSS px；仅未测量选项的初始估计，不是固定行高，不覆盖用户optionRender内容 |
| overscan | 3 | 非负安全整数；向两侧额外渲染行数，不含必须保留的active项；大值会增加DOM，不承诺性能不变 |

默认数字来自本地样式：`select/style.css`popup外框上限288px、桌面option最小32px。`height`沿用外框上限口径，内部窗口须扣除padding/border，不叠加第二个288px滚动容器；现有list的2px间距单独计入布局，不把它误算成option测量高度。移动粗指针option最小44px，不能强制32px裁切；首轮SSR/client共用32px估计，mount后以真实元素测量修正，调用方可显式使用相同的44px估计。`height`不会取消当前窄屏/可用空间上限。

无效输入处理：配置字段NaN/Infinity/非正高度/非整数overscan回退各自默认，开发源码模式告警，生产不因可选优化配置抛错；`virtual`为null/数组/其他错误运行时类型时回退false。类型与数值回退已验证。不开启时保留现有完整DOM路径，不改事件签名、modelValue或搜索/选中语义。

## 内部适配契约

- 复用Select现有规范化/过滤/排序后的逻辑序列与typed value token，不能以DOM挂载子集作为完整数据源；optionRender索引仍沿用现有语义。
- active选项保留在渲染范围，`aria-activedescendant`不得指向已卸载ID。方向键与禁用跳过、输入法、单次Enter提交及焦点均与非虚拟路径一致；用户滚动可以让active暂离视口，键盘移动必须将目标滚入视口。
- 搜索、重排、删除active与清空时，先按完整逻辑序列恢复合法active，再同步窗口；不因测量或滚动发出change/search/modelValue事件。
- 动态optionRender使用实际行高测量；字体、宽度、内容、移动行高变化后更新测量，保持稳定key与滚动锚点，不把多行内容裁成estimateSize。
- 服务端和客户端首轮使用相同初始窗口/ID/估算配置，不从window媒体查询生成不同首轮树。defaultOpen和已选尾项要单独验证hydrate再定位；不得共享跨SSR请求缓存。
- 使用popup所在ownerDocument/defaultView，关闭/重开、禁用、移除及iframe卸载须停止观察和迟到定位；复用现有弹层焦点/事件边界。

## 已选择的静态接入与成本

已采用用户批准的静态TanStack适配。`virtual=false`不保证构建移除依赖；真实同入口消费者默认关闭时JS gzip增加8440字节、CSS增加30字节。该口径含消费者与Vue，不是任意应用固定增量；B的external Vue约6.8KiB不再作为正式接入成本估算。只消费Button的入口未包含引擎。

独立可选入口是未采用的备选方案，没有在本批实施。后续如产品改为要求默认零新增成本，须重新评审导入方式、ESM/CJS/types、CSS共享和SSR入口，不能用当前默认false承诺零成本。

## 实现与验证检查维度

以下保留原检查维度，C受批准范围已经验收；逐项专项证据及仍需明确的范围以[交付矩阵](../reviews/2026-09-07-d4-delivery-matrix.md)为准，不因测试总数全绿就声称每个边界有独立专项覆盖。

1. 参数与类型：false/true/空配置、边界和无效值、类型/barrel声明；默认路径DOM/事件不变。先写失败用例，再实现。
2. 实际Select：固定与任意多行optionRender、single/multiple/tags、disabled、IME、Enter不重复提交、搜索重排/删除active、Home/End及既有支持的其他导航；每步断言active身份、可见性与焦点，不能只数DOM。
3. 动态：32/44/多行与运行时增高、宽度/字体变化、列表中部更新的滚动锚点、展开关闭重开、边缘尾项、无结果、全禁用、1k/5k/10k。
4. SSR：真实打包产物renderToString→hydrate，首开与已选尾部项、稳定ID、零mismatch；CJS require与ESM消费者、声明消费、CSS/unused/tree-shaking/默认关闭包成本独立测量。
5. 浏览器：现有五浏览器矩阵和iframe ownerDocument，移动触控、窄屏、视觉证据及键盘语义；物理设备/读屏未执行时明确未覆盖。
6. 性能：同一真实Select仅切换virtual，完全相同数据/样式/交互的生产冷开、热开、搜索、逐键、长任务与heap；重复采样并报告环境/口径，不与旧开发模式数据直接计算加速比。
7. 角色顺序：实施与冻结→独立开发复审→独立测试→必要运行时设计复核→产品验收。默认路径回归和新增虚拟路径分别报告，候选变化重验受影响门禁。

## 剩余D4交付梳理

A/B/C已分别验收，旧iframe、Select键盘及虚拟空状态问题按产品记录关闭。待完成的是原D4清单剩余范围确认、Draft PR留存与远端CI、最终合并裁定，以及获准合并后的主线/Pages验证。其他三组件虚拟化未完成，不能改写成用户已经批准延期；详见交付矩阵。D5尚未启动。

## 决策历史（已被上述授权与验收替代）

B刚验收时，核心依赖/API/默认加载策略仍未获准，当时只允许准备本草案，曾对比“静态TanStack依赖”与“独立可选入口”。用户后来明确选择静态接入并接受默认包成本，C已实现及验收。保留此历史说明，但不再将“用户仍需选择/未安装依赖/接口不可调用”列为当前状态。
