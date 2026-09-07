# D4 C：正式Select虚拟化实施

最新修正版：`56debe7`，122文件指纹`1f7b2f227d72235319f21c08fd308648eac447f7edcbb6d761f621394f505bd9`，见[最终清单](../evidence/d4-c/final-candidate.json)。下文初始数据保留为历史，修正和最新体积/性能见末节；初始全量浏览器门禁未通过，不冒充最终证据。

用户已批准仅Select静态TanStack接入，接受默认关闭仍有包成本。核心提交`b40f100`，真实消费验证提交`84ad73a`；122文件候选指纹`56e5623a5d98ce69b9204b4c4bc5b93b415746aa8de42bd4c3c26dc0a8cb626b`，清单见[候选](../evidence/d4-c/candidate.json)。A/B原验收为历史记录，不冒充本候选通过；Tree/TreeSelect/Cascader没有新增虚拟化。

## 实现

- `virtual: boolean | SelectVirtualConfig`默认false；height=288外框上限、estimateSize=32只估算不裁切、overscan=3。无效数值分别回退；支持跨iframe realm的普通配置对象。
- 复用Select完整options/typed-key/筛选/受控模型；窗口单独保留active项的DOM，aria-posinset/setsize反映逻辑列表。默认false仍渲染全量并保留既有事件。
- 动态测量使用TanStack注册的ownerWindow观察器；RO回调不立即写布局，测量提交排到相同窗口的RAF，避免WebKit通知循环。resizeItem仍交由成熟引擎维护高度与锚点，不自研前缀和引擎。
- 首次尾项估算后追加测量定位；手动wheel/touchstart/pointerdown使待执行定位token失效，标签变化不再拉回active；关闭/禁用/卸载清理观察和调度。禁用虚拟Select时隐藏浮层并移除active引用，保留受控open状态的所有权。
- pnpm9.15.4安装`@tanstack/vue-virtual@3.13.36`，核心锁3.17.8；根lock只增加18行所需依赖，ESM/CJS均静态external分发。原node_modules由pnpm11生成，已按pnpm9配置重建，未改pnpm-workspace或主工作树。

## RED与修正记录

最初真实Select新增5项测试中4失败/1通过，参数helper先因缺模块失败再GREEN。异步更新循环最终定位为Teleport stub重挂popup导致geometry对象同值反复写回，现同值不写；不是以延迟测量掩盖循环。SSR最初的单测失败来自错误的HTML属性顺序假设，修正匹配后验证真实窗口/typed ID。

真实浏览器暴露尾项估算后位置过期和WebKit RO通知循环，均修正后通过对应回归。移动锚点早期76px差异来自iOS滚动中暂缓的旧估算补偿；通过引擎缓存/scrollTop现场对照确认，测试在滚动安静区间及几何稳定后建立锚点，再严格要求增高后偏移<3px，不提高容差。用户滚动取消定位的P2预审建议已落实。

实施者Select当前56/56；早期全组件1119打印通过后Node24原生退出SIGABRT，不记为成功，限制maxWorkers=2后1119项正常退出。之后补入配置跨realm用例，全量1120待独立报告确认。DnD44、AI66、scripts86、三包类型、确定性双构建和pack971/71/111通过；虚拟五浏览器10/10为实施者阶段证据，最终SHA由独立测试重跑。

## 真实生产消费者

[结果](../evidence/d4-c/consumer/results.json)来自同一tarball中的Select ES路径，固定/动态渲染内容相同，仅切换virtual。Node24.17.0、Vue3.5.38、Vite5.0.12、Chromium149；1k/5k/10k各固定/动态三轮，共36场景。4组SSR→hydrate零诊断；CJS SSR有13个窗口项；Button-only入口没有TanStack模块。新tar SHA`4e059c6d634913c1c80b664a29764a0cb37ecd9e8dff9b5faea6a971b1dc4e07`，旧A基线SHA`378f59655efbaa9a4416bee112f6668c89353ba47147093e6461a9a24aaa703f`。锁文件和旧tarball均保存，复现说明见[consumer](../experiments/d4-c-consumer/README.md)。

| 应用JS字节 | raw | gzip | Brotli |
| --- | ---: | ---: | ---: |
| 旧A Select | 139415 | 52319 | 46749 |
| 当前默认false | 168181 | 60751 | 54217 |
| 当前显式true | 168181 | 60751 | 54231 |
| 当前只用Button | 83748 | 31093 | 27891 |

默认false相对同入口旧A增量：raw28766 / gzip8432 / Brotli7468。当前CSS169408/21944/18166，旧A169303/21914/18129，增量105/30/37。应用含Vue与夹具，非纯引擎口径；真实默认成本不套用B的6.8KiB gzip值。

| 10k三轮中位ms | 全量固定 | 虚拟固定 | 全量动态 | 虚拟动态 |
| --- | ---: | ---: | ---: | ---: |
| 首次打开 | 313.0 | 45.7 | 333.1 | 40.7 |
| 同页再次打开 | 243.7 | 44.7 | 261.2 | 55.4 |
| 搜索唯一尾项 | 43.6 | 23.5 | 53.4 | 20.7 |
| 20次方向键 | 1171.4 | 48.1 | 1247.6 | 52.8 |

首次打开从新页面mount完成后点击开始；再次打开不计关闭动画。时间包含Playwright与两帧渲染等待，不是纯CPU，三轮不足以作跨硬件SLA。长任务按operation marker内startTime分段，heap未强制GC不作为泄漏或节省结论。旧包只做体积对照，没有拿旧开发模式custom listbox计算收益。

独立[开发复审](2026-09-07-d4-c-dev-review.md)已通过；独立测试正在执行，必要[视觉审核](2026-09-07-d4-c-design-review.md)已记录。最终产品验收、完整D4发布边界、PR/主线CI/Pages/合并仍未由本报告放行。

## 空状态P2修正后的最终冻结

初审后补查真实无匹配词，确认虚拟窗口height0使empty提示被压进10px浮层。新增失败用例准确复现，再让空结果走自然内容布局。新增docs搜索示例、五浏览器空结果可见/恢复搜索用例，并在真实consumer的36场景中追加emptyVisible断言。主代理Select57/57、虚拟五浏览器15/15、最终consumer36/36和4组hydrate通过；独立开发续审及最终测试另行绑定新指纹。

新tarSHA`0d14f00fcedf0c53244ddcadb39548ee2403570465befc850040c9064edd9162`，冻结consumer锁SHA`523a662735987c1ec752848950749ec15da601d51dc792e6d51c4e34b4e5b83f`，见[最终结果](../evidence/d4-c/consumer/final-results.json)和`final-new-lock.json`。相同旧A消费者基线下，最终默认false JS raw168207/gzip60759/Brotli54169，增量28792/8440/7420字节；显式true raw168207/gzip60759/Brotli54237。CSS维持169408/21944/18166，增量仍105/30/37。Button-only无引擎模块，JS字节未变。

最终10k三轮中位ms（全量→虚拟）：固定首次打开301.8→48.4、热开258.1→50.9、搜索53.2→16.6、20键1255.9→53.3；动态首次336.2→45.4、热开286.2→50.7、搜索50.9→23.9、20键1315.0→60.7。口径仍包含PW与两帧，不与旧开发模式或自建列表算比值。

初始独立全量E2E在本任务并发重建docs产物时出现preview ENOENT，随后连接失败；另有splitter remount断言需最终跑确认。该编排失误不视为组件通过，也不作为降低门禁理由。最终复验将由测试经理独占构建/预览期间的产物，主代理不并发build或编辑候选源码。
