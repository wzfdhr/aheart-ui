# D4 B 隔离引擎评估

## 结论与授权边界

TanStack 在本次隔离消费者中通过了生产打包、ESM/CJS、SSR/hydration、10k固定/动态行高与键盘active机制验证，具备继续评审的依据。**不是Aheart组件虚拟化实现或性能收益验收**：自建listbox承担窗口/键盘/ARIA适配，Aheart Select仅一项数据用于tarball消费共存检查。没有修改核心依赖、锁文件、virtual props或默认行为，没有四组件接入、PR、合并或D5。

A组已获[产品验收](2026-09-07-d4-a-product-review.md)。核心候选保持`829531b`及90文件指纹`8317f0a95c7fdc565b67ca96858f14c0a160125894b662167af0a3b6d1f8402f`。本次[10文件实验清单](../evidence/d4-b/fixture-candidate.json)最终指纹为`21f3b0b4bdf200d0bee256f8ab684e74e7c40515dca3710136a3c3f80a3aea61`；含锁文件和[完整复现说明](../experiments/d4-b-consumer/README.md)。安装只发生在新临时目录，Aheart以tarball安装，非workspace软链接。

初次`622be794...`锁文件含原始临时路径，独立测试在新目录`npm ci`失败，登记P1；实施者自测与开发初审未发现该可移植性问题。现已在真实临时cwd重新生成标准相对路径锁文件，逐项核验全部包version/integrity不变，其余9文件不变，实施者再次运行两脚本通过。旧锁、旧清单及独立失败日志保留，不删除失败历史。P1是否关闭以独立测试续验为准，不由实施者自测宣布关闭。

## 生产体积（字节）

Node v24.17.0 / Vite 5.0.12 / Vue 3.5.38 / Vue Virtual 3.13.36 / virtual-core 3.17.8。esbuild生产minify，无sourceMap，gzip/Brotli为Node默认压缩，逐chunk累计。

| JS口径 | raw | gzip | Brotli |
| --- | ---: | ---: | ---: |
| Aheart + Vue基线应用 | 124876 | 46322 | 41483 |
| 基线 + 未使用引擎import | 124876 | 46322 | 41483 |
| 自建列表 + 引擎enabled=false | 163228 | 59392 | 52900 |
| 自建虚拟列表应用 | 163317 | 59443 | 52847 |
| 仅adapter导出入口，external Vue | 23060 | 6970 | 6334 |
| external微入口基线 / unused | 31 | 51 | 35 |

前四组CSS完全相同：raw169303 / gzip21914 / Brotli18129。应用delta含夹具UI及适配逻辑，不能称纯引擎开销。最后两行没有Aheart、CSS或Vue runtime，保留`useVirtualizer`/`defaultRangeExtractor`导出；也不代表未来任意组件集成的固定增量。

unused产物内无TanStack模块，且大小与baseline一致。disabled仍有4个TanStack ESM模块：**运行时关闭不等于零包体积**；若审批目标要求默认消费零成本，应另行评审可选入口或拆包，不可仅承诺`virtual=false`。disabled页面仅测构建成本，不提供非虚拟列表回退，未将其作为可用组件契约。

## 实际机制验证

- ESM实际生产构建并浏览器运行；CJS `require`落到`dist/cjs/index.cjs`并真实SSR生成首项；Aheart CJS入口加载成功。
- 固定SSR 12行、动态SSR 9行；客户端hydrate后两场景无pageerror/hydration warning/mismatch。
- 10k逻辑项固定32px，回Home后DOM12行；动态32/48px场景DOM11行。不是全生命周期恒定行数。
- 20次ArrowDown逐次检查active DOM存在且非禁用，最终index21（跳过17）；Home回0，End到9999并实际落在viewport。动态项改成80px后重复Home/End通过。
- 单轮20键含Playwright检查往返约57.0/73.2ms；导航DOMContentLoaded约28.3/24.6ms。CDP heap原始前后值保留在[results.json](../evidence/d4-b/results.json)，未强制GC，不作内存泄漏或节省结论。

测试不覆盖真实组件冷/热popup、搜索、长任务归因、统计性能对照，不从早期开发模式组件基线计算加速比。多浏览器/移动H5/iframe、初始尾项、重排/搜索移除active、PageUp/Down/hover、动态中部锚点、读屏仍是正式集成门禁。

## 设计证据与后续建议

整合者实际查看了[固定行高](../evidence/d4-b/production-fixed.png)与[动态增高](../evidence/d4-b/production-dynamic.png)运行截图：固定列表行距一致，增高内容分行可见，active背景与输入焦点清楚；滚动容器边界部分裁切末行是滚动视口行为。截图只是headless测试外观，不是Aheart产品样式或完整可访问性验收；没有冒称独立设计代理。

建议保留TanStack为优先候选，不转向自研动态引擎。但核心正式依赖、可选入口及最终props/default仍需基于产品要求批准；本报告不自动授权下一阶段。官方API对`initialRect`、稳定key、`rangeExtractor`及`measureElement`的说明支持夹具选择，实际结论以上述运行证据为准：[Virtualizer API](https://tanstack.com/virtual/latest/docs/api/virtualizer)。本段是工程判断，不是与其他引擎的同条件性能竞赛结果。

### 建议提交审批的最小接入批次（未实施）

首批仅Select，不同时接Tree/TreeSelect/Cascader。建议批准后使用TanStack内部适配层，复用现有选项、搜索、typed value、active和popup生命周期，而不是复制一套Select。依赖起点锁定本次评估版本，按既有ESM/CJS构建检查分发；接受静态引入会有默认消费者的引擎成本，不承诺默认关闭即可tree-shake。如果默认零成本是硬条件，应先审批独立可选入口设计，不在本批私自拆包。

公共API建议收敛为显式`virtual`配置（默认false；开启配置含视口高度、估算行高与overscan，名称/默认数值由API评审定稿），不要按数据量自动打开。估算高度不等于强制固定高度，动态`optionRender`继续测量，不裁掉内容。初始SSR窗口、稳定option id与active保留由内部适配层负责；不将上游Virtualizer实例或所有参数直接暴露为公共API。

该批验收应先以同一个真实Select切换全量/虚拟模式，匹配内容和交互后测1k/5k/10k生产冷开、热开、搜索、逐键、长任务和内存；再跑既有五浏览器、SSR/hydration与iframe门禁。默认非虚拟路径回归必须单独通过。数据与门禁通过后才考虑Tree/TreeSelect的可见树扁平化与每列Cascader，不能从本次custom listbox结果推断这些适配已完成。

独立开发复审见[报告](2026-09-07-d4-b-dev-review.md)；[独立测试修正版续验](2026-09-07-d4-b-test-review.md)已在另一全新临时目录通过pack/npm ci/engine-size/measure，体积及模块集合一致，关闭锁文件可移植性P1。[独立动态截图](../evidence/d4-b-independent-success/production-dynamic.png)亦由整合者实际打开复核。[B产品验收现已接受](2026-09-07-d4-b-product-review.md)，仅限隔离可行性。正式接入选择仍待用户决定；[精确API草案与测试清单](../specs/2026-09-07-d4-select-virtual-api-draft.md)仅文档准备，不构成实施授权。
