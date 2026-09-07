# D4-C Select 虚拟化独立开发复审

## 结论

候选 `HEAD 84ad73a`（核心 `b40f100`）在本次授权范围内未发现新的技术 P1/P2。复审仅覆盖 Select 的 TanStack Virtual `3.13.36`/core `3.17.8` 接入、`virtual` 默认关闭及 `height`/`estimateSize`/`overscan` 配置；不覆盖其他组件，也不作产品放行。

## 候选绑定与验证结果

- 候选清单：`docs/superpowers/evidence/d4-c/candidate.json`。
- 122 文件指纹：`56e5623a5d98ce69b9204b4c4bc5b93b415746aa8de42bd4c3c26dc0a8cb626b`。
- 新 consumer tarball SHA256：`4e059c6d634913c1c80b664a29764a0cb37ecd9e8dff9b5faea6a971b1dc4e07`。
- consumer 使用同一 packaged Select ES entry，对 default-false 与 virtual-true 分别覆盖 1k/5k/10k、固定/动态行高、3 轮，共 36 场景；4 组 SSR hydration 无 error；CJS SSR 13 rows；unused Button entry 未包含 TanStack 模块。
- 主线记录：Select/types 56 项、components 初版 1119 项、dnd 44、ai 66、scripts 86 通过；三包 typecheck、确定性构建、pack `971/71/111` 通过；虚拟化五浏览器 `10/10` 通过。Node 24 全线程 SIGABRT 作为既有运行环境记录保留，不改变已通过的分项结果。

## consumer 测量边界

测量脚本对每个场景记录 DOM 数、实际行高集合、active 可见性、搜索单项、20 次键盘、navigation/cold/hot/search markers、long-task 区间和 CDP heap 原始值。结果明确注明耗时包含 Playwright 往返及两帧等待，heap 未强制 GC，不将数据表述为纯 CPU 或加速比。

10k 固定行高新 consumer 的记录中，default-false cold 中位数约 313ms、20 键约 1171ms；virtual-true cold 中位数约 45.7ms、20 键约 48.1ms。该差异仅是同一真实 packaged Select consumer 的观测值，仍受浏览器、Playwright、两帧等待和页面启动状态影响，不是组件内部纯算法收益证明。

## 兼容与风险检查

- `virtual` 默认 false，旧 Select DOM 路径保持；默认 bundle 接受用户已批准的 TanStack 包成本。
- virtual-true 场景断言窗口 DOM 小于 100，active `aria-activedescendant` 对应节点存在且可见，动态 optionRender 行高有多值；默认路径断言 DOM 数等于 count。
- SSR 输出与 client hydration 分别覆盖 default-false/virtual-true 和 fixed/dynamic；CJS SSR 另行验证。
- hook 以 popup `ownerDocument.defaultView` 调度 ResizeObserver/RAF，延迟 RO 写回；关闭、disabled、popup 替换和 unmount 清理待测量队列。active 定位只由 open/active 请求触发，wheel/touchstart/pointerdown 使 token 失效，避免延迟测量覆盖用户滚动。
- `height` 作为 popup 约束、`estimateSize` 作为未测量行估计、`overscan` 控制窗口；动态高度通过真实 `optionRender` 与测量路径验证。

## 未覆盖与后续门禁

- 未覆盖其他组件的虚拟化接入、公开 API 产品批准、发布验收或移动物理设备。
- consumer 记录的是冷/热/搜索/键盘的浏览器观测，不是独立 CPU profiler、长任务统计结论或内存泄漏结论；多轮统计和多浏览器消费测试仍由独立测试经理复验。
- 默认 false 仍会把引擎带入应用 bundle，这是用户已接受的依赖成本；本报告不把它解释为 tree-shaking 缺陷。

开发复审结论：在上述候选和授权边界内通过，交由独立测试经理执行完整最终复跑。

## 续审：virtual 空结果窗口 P2 修复

原候选复审后发现真实 P2：virtual 模式无搜索结果时，virtualizer 总高度为 0，`listStyle.height` 将 popup 压缩到约 10px，empty message 被裁切；该问题由 `/tmp/d4-c-empty-before.png` 及独立补查确认。原报告保留该漏检历史，不将其降级为普通样式差异。

修复 delta `84ad73a..56debe7` 仅 8 文件：当 `input.options` 为空时不再写 virtual list 固定 height；单测先 RED 后 GREEN，五浏览器增加空结果/恢复断言，consumer 每个场景增加 `emptyVisible`，同步更新 ES/lib 产物与最终 lock/README。最终结果显示 36/36 consumer 场景 `emptyVisible=true`，4 组 hydration 无 error，Select 57/57 与虚拟五浏览器 15/15 通过；修复关闭了该具体技术 P2。

最终候选绑定：HEAD `56debe7`，122 文件指纹 `1f7b2f227d72235319f21c08fd308648eac447f7edcbb6d761f621394f505bd9`，清单 `docs/superpowers/evidence/d4-c/final-candidate.json`；最终 tarball SHA256 `0d14f00fcedf0c53244ddcadb39548ee2403570465befc850040c9064edd9162`。最终 consumer 证据位于 `docs/superpowers/evidence/d4-c/consumer/final-results.json`、`final-run.log` 与 `final-new-lock.json`。

最终 default-false JS 为 raw `168207` / gzip `60759` / Brotli `54169`，CSS 与前一候选相同；该包成本已在用户授权范围内接受。独立测试经理对最终候选的完整复跑仍是后续门禁；本续审不代替产品裁定。
