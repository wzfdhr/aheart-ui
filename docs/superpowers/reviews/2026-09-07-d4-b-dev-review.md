# D4-B 独立开发复审：隔离 consumer 夹具

## 结论

夹具可复现地证明了 production Vite 下 ESM/CJS 入口可加载、SSR 字符串可生成、未使用的 `@tanstack/vue-virtual` import 可被 tree-shake，以及 `enabled: false` 的运行时构建仍包含引擎模块。但这组证据不能证明 Aheart Select/Tree 的虚拟化性能收益：夹具的虚拟列表、active、scroll、动态行高和键盘逻辑均由 `App.js` 自己实现，Aheart Select 只渲染一个独立的单选 option。

因此没有发现核心代码技术 P1/P2。若将隔离夹具结果泛化为 Aheart 组件性能收益，会构成 P2 级过度结论；在本阶段明确限定为“隔离引擎可行性”后，不再构成 B 组阻断。真实组件集成、性能和产品 API 门禁仍明确未覆盖。

## 只读检查范围与文件指纹

隔离目录：`/tmp/aheart-d4-virtual-consumer.T7xOU8/`

```text
App.js       8a80379dac2f791f6fc72f25710edd97b8ba7a0438fe00fb87a706ac153f19f8
main.js      fae007d4ede8544364ab551de526cd67145a766fcdf7fa148722ebb1e8c11bf0
baseline.js  cb7badea1b65ff8aa18baa323eb9ead82d0bc4bcc037ee2d9bc82bd07f35bc56
unused.js    a57994bb53252a112d712938730868da6afd57a80ef56b0cbc259ebfabd3ac1c
disabled.js  09b810817e4aaa9aa43fa44a13fed84d2cf40831511c782e64c8eb22d447973b
measure.mjs  37f42def80282d4247394b26a5744f5a6899db1986ba9e7a7e261f84cb363523
package.json b14f8365627a97743ad17f76364c94055864a2060730d2c29013b022569e635d
package-lock.json c5f9149db2ae1960db1fe392a596dbecf8ce13a0d9225b4aed6e6487e4890b01
results.json b9085b898f73280a337f90a48edb015b147cd6f6dbe6057797e6574302e5ceb8
```

补充测量文件：`engine-size.mjs` SHA256 `7ef2b60eb1550d933dd685700f1ea5fd09206311fb214a22046150ce7cfec349`；`engine-sizes.json` SHA256 `f25a7bd6ff97c12cf28ff9add8a5c39cce4524e4f1ba6bd09ee9fcd8efc31a30`。最终归档的 10 文件夹具（含 README）manifest 指纹为 `622be79440a47e4d1bafeef428874df364675a518ea2bf1383421f379a29a0ef`，清单位于 `docs/superpowers/evidence/d4-b/fixture-candidate.json`。

## 实际结果复核

- `results.json` 记录 Node `v24.17.0`、Chromium `149.0.7827.55`、Vite `5.0.12`、Vue `3.5.38`、TanStack Vue Virtual `3.13.36`。
- CJS `require`、CJS SSR、Vue SSR 字符串和 hydration 错误检查均通过；但 hydration 仅实际挂载了 virtual consumer 页面。
- `baseline` 与 `unused` bundle 尺寸相同，且 unused engine modules 为空，支持未使用 import 被 tree-shake。
- `disabled` 仍包含 `@tanstack/virtual-core`/`@tanstack/vue-virtual` ESM 模块；virtual 与 disabled 的 JS 差值为 raw `163317-163228=+89`、gzip `59443-59392=+51`、Brotli `52847-52900=-53` B（virtual 反而小 53 B）。这只能说明构建入口仍引用引擎，不能推出运行时成本或收益。`enabled:false` 未启用引擎的非虚拟回退属于隔离 consumer 原生契约，不是 Aheart API 结论。
- external Vue 的 engine-only ESM adapter 测得 virtual engine raw `23060` / gzip `6970` / Brotli `6334`，baseline/unused 为 raw `31` / gzip `51` / Brotli `35`，可作为干净引擎体积口径。
- virtual 页面报告固定行高 12 行、动态行高 11 行，20 次键盘 active DOM/非禁用、导航耗时、CDP heap 原始记录、active 到 9999/Home、动态高度改变和 hydration errors 均通过；这些断言针对自建 custom listbox，不是 Aheart Select 的 `optionRender` 或窗口。

## 阻断项与补测建议

1. 若要进入真实组件性能门禁，使用实际组件集成夹具：让 Aheart Select/Tree 的 option/node 渲染、键盘 active、`aria-activedescendant`、滚动和动态 optionRender 走同一实现；baseline 与 virtual 需保持选项内容、样式、搜索和事件一致。
2. 另行授权后增加 production 冷启动/热启动、搜索/20 次键盘、长任务和统计采样；当前记录的导航/键盘/heap 是隔离 custom listbox 原始值，不是加速比。
3. 对 baseline、virtual、disabled 分别做 SSR→hydrate，并检查 active 节点存在及 viewport 可见；当前 fixed/dynamic 仅检查 virtual 页面，baseline/disabled 没有浏览器交互断言。

本报告不批准虚拟化 API、不修改夹具或核心实现，也不作产品裁定。

## 续审结论

补充 engine-only 体积、导航耗时、20 次 active DOM/非禁用断言和 CDP heap 原始记录后，隔离夹具在其声明范围内无阻断缺陷。B 结论严格限定为 ESM/CJS/SSR 可行性、tree-shaking 对照与 custom listbox 机制验证；真实四组件集成、冷/热开、搜索、长任务、统计性能、多浏览器和产品 API 审批均为后续独立门禁。

## 便携性差量续审

独立测试在新临时目录执行 `npm ci` 时发现旧 lock 的路径键包含原始 `/private/tmp/aheart-d4-virtual-consumer.T7xOU8` 位置，构成夹具 P1 可移植性缺陷；该问题在初次静态复审中漏检，初审结论对此项不成立。主代理随后仅重生成 10 文件夹具中的 `package-lock.json`，在真实 cwd `/private/tmp/aheart-d4-b-portable.CttbAO` 使用 `file:./aheart-ui-1.0.0.tgz`，新 lock 使用标准 `node_modules/*` 键，不再绑定旧临时绝对路径。已核对依赖版本与 integrity 与旧 lock 保持不变。

修正后最终 manifest 指纹为 `21f3b0b4bdf200d0bee256f8ab684e74e7c40515dca3710136a3c3f80a3aea61`；旧 manifest 与 non-portable lock 保留在 `docs/superpowers/evidence/d4-b/initial-*` 作为失败证据。修正后的 lock SHA256 为 `1af2e3a957e6edd429a0198ae8392c331b2544c7243392f7bda70470fa76f0aa`。源码及其余 9 个夹具文件未变更。

当前状态：lock 可移植性问题已修正，engine-size 与 measure 已由主代理复跑通过；在测试经理对修正后最终 manifest 独立复跑通过前，保留该 P1 为开放测试门禁，不关闭。
