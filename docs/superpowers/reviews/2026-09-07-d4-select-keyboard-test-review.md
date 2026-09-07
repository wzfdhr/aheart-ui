# D4 Select 键盘独立测试报告

日期：2026-09-07  
角色：独立测试经理  
范围：冻结候选 `docs/superpowers/evidence/d4-full-candidate.json`

## 冻结候选与完整性

- 冻结 commit：`709de18a183a09e76059c6ea184232b8f41163f4`
- 候选 base：`3dc64ff1734004c2e51cc2a5e6a99a59c85ae1a2`
- 候选文件数：48
- 指定 SHA-256：`17de1fad1c17fdbcd9ff686812de6067316b626e93a35c5b506d6a24e1a285ad`
- 测试前、测试后均执行 `node scripts/d4-candidate-fingerprint.mjs`，输出相同指纹，未修改候选代码、测试或配置。
- 指纹日志：[00-candidate-fingerprint-after.log](../evidence/d4-select-test/00-candidate-fingerprint-after.log)

## 实际门禁

| Gate | 实际命令 | 结果 | 日志 |
|---|---|---|---|
| components 全量单测 | `corepack pnpm --filter ./packages/components test` | 70 files，1080/1080 passed，退出码 0 | [01-components-test.log](../evidence/d4-select-test/01-components-test.log) |
| scripts 单测 | `node --test scripts/*.test.mjs` | 86/86 passed，0 failed，退出码 0 | [02-scripts-tests.log](../evidence/d4-select-test/02-scripts-tests.log) |
| components 类型检查 | `corepack pnpm --filter ./packages/components typecheck` | 退出码 0 | [03-components-typecheck.log](../evidence/d4-select-test/03-components-typecheck.log) |
| 构建确定性 | `corepack pnpm check:build-determinism` | 两轮 workspace build 完成，退出码 0 | [04-build-determinism.log](../evidence/d4-select-test/04-build-determinism.log) |
| 发布打包契约 | `corepack pnpm release:pack` | components 955、dnd 71、ai 111 文件，退出码 0 | [05-release-pack.log](../evidence/d4-select-test/05-release-pack.log) |
| Select 过滤浏览器回归 | `AHEART_E2E_PORT=5186 corepack pnpm exec playwright test e2e/d4-iframe.spec.ts e2e/cross-browser-r1.spec.ts e2e/q3-form-controls.spec.ts e2e/a11y-visual.spec.ts --grep 'Select selects|Select supports|Select opens|same-origin iframe Select' --reporter=line --output=/tmp/aheart-d4-select-independent` | 14/14 passed，退出码 0；webServer 包含 docs build | [06-select-browser.log](../evidence/d4-select-test/06-select-browser.log) |
| docs build | `corepack pnpm docs:build` | build complete in 5.44s，退出码 0 | [08-docs-build.log](../evidence/d4-select-test/08-docs-build.log) |
| 浏览器性能严格检查 | `node scripts/d4-browser-performance.mjs --require-visible` | 9/9 场景写出并通过严格断言 | [07-browser-performance.log](../evidence/d4-select-test/07-browser-performance.log) |

性能结果：[baseline-2026-09-07T035712Z.json](../evidence/d4-performance/baseline-2026-09-07T035712Z.json)。Select fixed/dynamic 的 1k、5k、10k 场景均满足 `optionDomCount === size`、active 文本为 `Option 00020`（含 variant 后缀）、`activeRect.fullyVisible === true`。脚本记录了部分长任务，但未触发失败；该开发 harness 基线不作为生产 FPS 承诺。

## Select 指定覆盖

过滤后的 14 个真实浏览器测试覆盖：

- `q3-form-controls.spec.ts`：desktop、mobile 的真实 popup 选择、多选移除、clear、loading feedback。
- `cross-browser-r1.spec.ts`：desktop、mobile、desktop-firefox、desktop-webkit、mobile-webkit 的 Select 选择、清除多值及键盘关闭。
- `a11y-visual.spec.ts`：desktop、mobile 的 Select 打开、键盘选择、Escape 后焦点恢复。
- `d4-iframe.spec.ts`：desktop、mobile、desktop-firefox、desktop-webkit、mobile-webkit 的 same-origin iframe Select；覆盖 iframe 内 trigger focus、打开、外层 Escape 不消费、内层 Escape 关闭并恢复 trigger 焦点、SPA 同一 iframe document 导航卸载组件，以及卸载后输入事件不再被组件消费。

本轮实际验证的是 Select 影响范围；没有重跑 TreeSelect/Cascader iframe 场景，也没有重跑完整 536 E2E。

## 未覆盖项与边界

- 未覆盖完整 workspace 的 409 E2E、全量跨浏览器套件及物理 iOS Safari。
- 未覆盖 TreeSelect/Cascader iframe 回归（本轮按任务要求不重复）。
- 性能脚本为单桌面、单轮、Vite development harness；不等同生产 bundle FPS、跨机器绝对性能门槛或移动端性能结论。
- 未实现或验证虚拟化、SSR renderToString→hydrate、窗口化 active 节点和动态测量缓存等后续方案项。

## 分级与结论

- 技术 P1：未观察到。重复 input keydown、键盘选择、焦点恢复、active 可见性及候选生成物检查均通过。
- 技术 P2：未观察到本次 Select 修正范围内的阻断性技术 P2；性能日志中的长任务已保留为基线事实，不构成本轮门禁失败。
- 产品问题：仍待产品经理最终裁定；本报告不作产品放行。

冻结候选通过本次 Select 受影响独立验证：components 1080、scripts 86、typecheck、determinism、release pack、Select 过滤浏览器 14/14、docs build 及性能 9 场景均有独立日志。该结论不替代未覆盖的完整 E2E、其他组件 iframe 验收或产品决策。
