# D4 交付矩阵与剩余范围

日期：2026-09-07

## 当前合并范围裁定

产品经理已明确：PR18是已授权A/B/C增量交付，未授权的Tree/TreeSelect/Cascader虚拟化不阻塞本PR；未实现仍如实保留，也不改写为获批延期。原第13项是宽泛的审批/方案跟踪文字，不能解释成用户已经批准四组件虚拟化。

合并前补证只锁定三个Select契约：打开期间宽度/字体尺寸重排、中部稳定key数据更新、virtual+tags及父拒绝。其余PageUp/PageDown新快捷键、所有hover排列、实体设备/读屏不追加为本批门禁。三项证据及修复见[合并补证](./2026-09-07-d4-merge-supplement.md)。

主来源是 [`2026-09-06-deep-optimization-completion.md`](../plans/2026-09-06-deep-optimization-completion.md) 的 D4 段（原始 14 个 checkbox）。选择/树 API 的语义以 [`2026-09-06-d4-selection-tree-design.md`](../specs/2026-09-06-d4-selection-tree-design.md) 的“当时推荐契约”“当时审核与验收”“当时大列表测量与待批范围”章节为补充；Select 虚拟化的当前授权与覆盖边界以 [`2026-09-07-d4-select-virtual-api-draft.md`](../specs/2026-09-07-d4-select-virtual-api-draft.md) 为准。以下保留原 checkbox，不以总测试数替代逐项源码、测试和产品证据。

状态含义：`完成且本批验收`、`已有能力非本批`、`未完成待产品定范围`、`超出已授权 C 不得实施`。第一列保留最初14项的checkbox快照；当前完成清单已依据A证据更新第3/7项，并将第13项拆为已验收的Select子项与未裁定的总体范围，未改写为全D4完成。

## D4 原始 14 项逐条映射

| # / 原始 checkbox 与要求 | 当前代码、测试和产品依据 | 实际状态与边界 |
| --- | --- | --- |
| 1. `[x]` Tree 共用 typed key 节点索引、父子关系、可见节点列表 | A 实施代码为 `packages/components/src/tree/tree-index.ts`、`tree-check.ts`、`tree.vue` 及 TreeSelect 集成；`src/tree/__tests__/tree-index.test.ts` 与 Tree/TreeSelect 专项测试覆盖索引模型，A 报告记录共用 typed-key 索引和迭代过滤（[`d4-a-implementation.md` 的实施记录](./2026-09-07-d4-a-implementation.md)），产品报告接受 TreeSelect 复用范围（[`d4-a-product-review.md` 的验收范围](./2026-09-07-d4-a-product-review.md)）。 | 完成且本批验收。仅证明非虚拟树模型，不证明 Tree 窗口化。 |
| 2. `[x]` 实际焦点节点承担 treeitem；`aria-level`/`posinset`/`setsize` 完整 | Tree/TreeSelect 的 `tree-node.vue` 实际渲染 treeitem 与 ARIA 属性；A 的 D4 selection E2E、Tree/TreeSelect 单测和最终 27 项影响范围复验绑定 A 最终候选；A 产品报告核对焦点与截图。 | 完成且本批验收。 |
| 3. `[ ]` 父子联动勾选、半选、严格模式、禁用边界和异步加载 | `packages/components/src/tree/tree-check.ts`、`use-tree-loader.ts`、`tree.vue` 与 `tree-select.vue` 实现 `checkStrictly`、半选派生、disabled 隔离、取消/重试/迟到结果；Tree lazy 与 TreeSelect checkable RED→GREEN 单测见 A 实施报告；A 产品报告接受该范围。 | 完成且本批验收；当前完成清单已依据A验收更新为`[x]`。 |
| 4. `[x]` TreeSelect 复用 Tree 索引/状态，消除重复 flatten 与活动项 DOM 补丁 | `packages/components/src/tree-select/tree-select.vue` 注入并复用 Tree 的私有 loader/index；TreeSelect checkable、过滤完整逻辑树和真实 Teleport 测试见 A 实施报告及 `src/tree-select/__tests__/tree-checkable.test.ts`。 | 完成且本批验收。 |
| 5. `[x]` Cascader 左右、Enter、Home/End、活动路径恢复完整 | `packages/components/src/cascader/cascader.vue` 与 `src/cascader/__tests__/cascader.test.ts` 覆盖 typed path、键盘导航和异步焦点版本；A 产品报告接受 Cascader 键盘全过程与恢复。 | 完成且本批验收。 |
| 6. `[x]` Cascader lazy pending/error/retry 与过期响应隔离 | Cascader loader 的 `AbortController`、路径/options/loader 替换失效、错误重试与卸载清理在 `cascader.vue` 和 Cascader 单测中实现；A 产品报告接受 pending/error/retry 与迟到结果隔离。 | 完成且本批验收。 |
| 7. `[ ]` Cascader `loadData` AbortSignal 公共契约 | Cascader 类型与组件当前保留旧一参 `loadData(option)` 兼容，追加可忽略的第二参数 `{ signal }`；实现/类型/专项 E2E 依据见 A 实施与测试报告，A 产品报告明确接受该兼容公共 API。 | 完成且本批验收；当前完成清单已依据A验收更新为`[x]`。 |
| 8. `[x]` Select 稳定 active option、组合输入法与禁用项边界 | Select 既有 `select.vue` 的 stable value key、IME 处理与 disabled 跳过；Select 键盘产品报告关闭“20 键跳 40 项/active 不可见”问题，C 的 `select.vue`/`use-select-virtual.ts` 保留并回归该语义。 | 已有能力非本批；C 对其做了虚拟路径回归，不把它重写成 C 新增公共 API。 |
| 9. `[x]` 大列表基线：10k Select/Cascader 首次展开约 1.44s/1.22s、均渲染 10k DOM，确认需要窗口化 | 原清单数值来自设计稿中的 jsdom 探索基线。后续 C 以同一真实 Select 做 1k/5k/10k、固定/动态、全量/虚拟生产消费者对照；证据在 `docs/superpowers/evidence/d4-c/consumer/final-results.json` 与 C 实施/测试报告。 | 完成且本批验收（Select 真实生产对照口径）；不把原 jsdom 数值当跨机器阈值，也不外推到三组件。 |
| 10. `[x]` 真实 Chromium 开发模式 1k/5k/10k 基线与固定 32px、动态 32/46px 对照，保存哈希/浏览器/截图 | `docs/superpowers/evidence/d4-performance/` 保存基线 JSON 与 Select/Cascader 运行截图；`d4-select-keyboard-product-review.md` 及 D4 full-gates 记录 Select 影响范围验证。C 后续生产动态行高使用真实测量，不以开发模式数据计算 SLA。 | 已有能力非本批；作为 C 之前的基线证据保留。 |
| 11. `[x]` 基线发现 Select 20 键跳 40 项和活动项不可见，已内部修复；候选 709de18 获独立复核与产品关闭 | `packages/components/src/select/select.vue` 的 active/scroll 修复、Select 定向单测与 `scripts/d4-browser-performance.mjs`、`e2e/d4-iframe.spec.ts`；产品关闭记录为 `2026-09-07-d4-select-keyboard-product-review.md`。 | 已有能力非本批；C 依赖并回归该能力，不重新计为 C 的独立新问题。 |
| 12. `[x]` 完整既定门禁已执行；修复前 409 E2E/127 skip，修复后按 Select 影响范围 14 E2E、1080 单测、确定性构建和 pack 独立验证 | 当前 C 最终候选 `56debe7` 的独立报告记录 components 1121、DnD 44、AI 66、scripts 86、三包 typecheck/确定性/pack，以及完整 E2E 449 passed / 127 既有 skip；历史失败与最终指纹分开保存。 | 完成且本批验收（技术门禁口径）。不等于远端 CI、合并或发布完成。 |
| 13. `[ ]` 虚拟化 API、依赖体积与实现方案审批；实施时保留键盘、SSR 与动态高度契约 | **Select 子项已完成：** C 实现 `SelectVirtual` (`boolean | SelectVirtualConfig`)、默认 false、`height/estimateSize/overscan` 校验回退，TanStack 静态接入、动态 `measureElement`、SSR/hydration、iframe ownerDocument；对应 `src/select/virtual-options.ts`、`use-select-virtual.ts`、`select-virtual.ssr.test.ts`、`e2e/d4-select-virtual.spec.ts` 及 C 产品验收。**但原清单的泛化项不能勾满：** Tree/TreeSelect/Cascader 虚拟化未实施，且没有用户批准延期记录。 | Select 子项：完成且本批验收。D4 泛化虚拟化项：未完成待产品定范围；三组件虚拟化同时属于超出已授权 C 不得实施。 |
| 14. `[x]` 成熟引擎优先选型初评：TanStack Vue Virtual、vue-virtual-scroller、无依赖方案，核对能力/元数据/适配成本/CJS 风险/体积边界与推荐 | B 的隔离 consumer 记录 TanStack 生产 ESM/CJS、SSR/hydration、动态行高和包体评估；`d4-b-product-review.md` 接受隔离可行性。C 随后按授权正式采用 TanStack 3.13.36/core 3.17.8。 | 完成且本批验收（选型/Select 接入）；B 隔离自建 listbox 不代表其他组件已虚拟化。 |

## C Select API 的专项覆盖与未覆盖维度

当前 API 规格“实现与验证检查维度”要求逐项保留边界，不能因为最终总数全绿就全部勾选。C 已有独立证据的范围包括：`virtual` 默认 false/true/空配置与非法数值回退（`virtual-options.test.ts`）；默认非虚拟 DOM/SSR 与虚拟 SSR（`select-virtual.ssr.test.ts`）；固定/动态行高、disabled 跳过、Home/End、active 可访问、无结果恢复、iframe ownerDocument/卸载（`e2e/d4-select-virtual.spec.ts`）；同一真实 Select 的 1k/5k/10k 固定/动态生产对照、CJS/ESM 与 hydration（C consumer final results）。

已经专门验证多选Enter单次提交与清除、视口滚至中部后首项增高的锚点保持（`select-virtual.test.ts`、`e2e/d4-select-virtual.spec.ts`）。不能将这两项误列为完全未测。

合并前已按产品限定补齐三项：宽度与字体尺寸导致的重新换行及active可见性；中部稳定key的前插/删除/重排和删除active合法回退；virtual+tags创建/单次Enter/移除/clear与父拒绝。独立Select60、五浏览器25及必要消费/视觉证据见[补证报告](./2026-09-07-d4-merge-supplement.md)。不把已经补齐的维度继续列为缺失。

任意字体文件、所有tags/hover排列与PageUp/PageDown新快捷键并非这三项的扩大门禁。物理设备和读屏不从现有证据推断通过，也不追加为PR18阻断；继续按明确的已批准范围验收，而非“全部边界无缺口”的无穷目标。

## 仍未闭合的 D4 交付边界

1. **Tree、TreeSelect、Cascader 虚拟化未完成。** A 只验收兼容 API、树索引/勾选/懒加载和 Cascader 键盘/lazy；B 只是隔离引擎验证；C 的正式授权只覆盖 Select。没有用户批准延期记录，不能把三组件改写为“已完成”或“已延期获批”。
2. **原始 D4 范围跟踪与本PR合并分开。** Select子项已实现并验收；宽泛第13项不代表四组件授权。保留其他组件的未授权/未实现状态，不把它们设为PR18的合并阻断，也不宣称完整D4自动关闭。
3. **交付门禁未闭合。** [Draft PR #18](https://github.com/wzfdhr/aheart-ui/pull/18)已创建留存；远端CI须看其检查结果。A/B/C产品报告不等于完整D4合并裁定、主线CI/Pages或发布，这些门禁仍需按计划执行。
4. **范围定位保持不变。** C 产品报告将桌面 Web 专业工具作为主要场景、手机网站作为辅助响应式兼容，不新增原生移动 App 门禁。

结论：当前准确表述是“D4 A/B/C 分批交付已分别验收，Select 虚拟化已验收；原 D4 14 项中三组件虚拟化和最终交付门禁仍未闭合”。
