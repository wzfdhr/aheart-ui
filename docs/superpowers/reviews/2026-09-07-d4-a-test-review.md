# D4-A 公共 API 独立测试报告

日期：2026-09-07  
角色：独立测试经理  
范围：冻结候选 `docs/superpowers/evidence/d4-a/candidate.json`

## 冻结候选与指纹

- 候选标识：`a17a0b4`
- base：`3dc64ff1734004c2e51cc2a5e6a99a59c85ae1a2`
- 文件数：90
- 指定 SHA-256：`8236908b3e9af4da35b091ef25450031669423298bdc3226fb9378799ecc6242`
- 测试前、测试后均执行 `node scripts/d4-candidate-fingerprint.mjs docs/superpowers/evidence/d4-a/candidate.json`，输出与冻结指纹一致；未改动源码、测试或配置。
- 测试后指纹日志：[00-candidate-fingerprint-after.log](../evidence/d4-a-independent/00-candidate-fingerprint-after.log)

## 实际门禁与结果

| Gate | 实际命令 | 结果 | 日志 |
|---|---|---|---|
| 全仓测试 | `corepack pnpm test` | components 1102/1102、dnd 44/44、ai 66/66、scripts 86/86；退出码 0 | [01-test.log](../evidence/d4-a-independent/01-test.log) |
| 全仓类型检查 | `corepack pnpm typecheck` | components、dnd、ai 均通过；退出码 0 | [02-typecheck.log](../evidence/d4-a-independent/02-typecheck.log) |
| 构建确定性 | `corepack pnpm check:build-determinism` | 两轮三包构建完成且无差异失败；退出码 0 | [03-build-determinism.log](../evidence/d4-a-independent/03-build-determinism.log) |
| 发布打包 | `corepack pnpm release:pack` | components 963、dnd 71、ai 111 文件；退出码 0 | [04-release-pack.log](../evidence/d4-a-independent/04-release-pack.log) |
| 全量真实浏览器 | `AHEART_E2E_PORT=5189 corepack pnpm exec playwright test --workers=4 --reporter=line --output=/tmp/aheart-d4-a-independent` | 561 tests：434 passed、127 skipped、0 failed；webServer docs build/render 完成 | [05-playwright.log](../evidence/d4-a-independent/05-playwright.log) |

## A 组指定覆盖

单元、组件与全量 E2E 的实际覆盖包含：

- Tree lazy：`void` 完成、空结果视为叶子、首次加载去重、拒绝展开/显式叶子不加载、collapse 取消、失败 retry、loader 替换/disable/unmount abort，以及 loader 忽略 abort 时迟到回调仍被忽略。
- Tree selection：默认 strict 独立勾选、`checkStrictly=false` 联动与 half-checked、disabled 子树边界、禁用目标不切换、受控 expanded/selected/checked 拒绝保持权威、typed/unknown keys、深树迭代处理。
- Tree E2E：`D4 Tree linked checks expose mixed state and lazy failure retry` 在 desktop、mobile、desktop-firefox、desktop-webkit、mobile-webkit 均执行。
- TreeSelect：搜索隐藏兄弟节点时仍按完整逻辑树计算勾选；treeCheckable strict/联动与受控拒绝；共享 lazy data/loaded labels；关闭时取消 pending loader。对应 D4 selection E2E 五浏览器均执行。
- Cascader lazy：旧一参 `loadData(option)` 兼容、新 signal 上下文、同分支去重、失败 retry、空结果、active branch/选项替换迟到结果丢弃、AbortSignal、关闭/disabled/unmount 清理、async loading 进度。相关单测与 Q3 lazy-loading E2E 执行。
- iframe/focus：Select、TreeSelect、Cascader 的 same-origin iframe focus、Escape 恢复、SPA 卸载清理在五浏览器项目均执行；新 Cascader async-focus 版本随全量 E2E 实际执行。
- 全量 Q3/QG1/QG4/QG5 兼容面、docs 页面、生成产物和跨浏览器项目均包含在本轮全量命令中。

## 未覆盖与待补测

- 尚未单独验证“retry 按钮在开始加载时被移除”这一新增焦点边界：需要明确键盘焦点不会意外掉到 `body`，以及合理的 fallback/恢复目标。该场景不应被现有 434 总通过数替代。
- 127 个 skipped 为既有平台/项目跳过，不是失败，也不等同于物理 iOS、SSR hydration 或产品视觉验收。
- 未覆盖虚拟化性能、跨域 iframe、物理设备和产品层放行。

## 缺陷分级与结论

- 技术 P1：已执行门禁中未观察到。
- 技术 P2：已执行门禁中未观察到；retry-button 移除后的焦点场景仍是独立验证缺口，暂不以总数结论覆盖。
- 产品问题：不作产品放行，保留产品经理最终裁定。

冻结候选通过当前全仓测试、类型、确定性、打包及全量浏览器门禁；候选前后指纹一致。独立测试结论不包含尚未完成的 retry 移除焦点专项验收。

## 最终候选 `829531b` 影响范围复验

最终候选：commit `829531b`，清单 `docs/superpowers/evidence/d4-a/final-candidate.json`，90 文件，指纹 `8317f0a95c7fdc565b67ca96858f14c0a160125894b662167af0a3b6d1f8402f`。前后复算均一致，后指纹日志见 [00-candidate-fingerprint-after.log](../evidence/d4-a-final-independent/00-candidate-fingerprint-after.log)。

实际命令及退出码：

- `corepack pnpm --filter ./packages/components test`：退出码 0，74 files、1103/1103 passed；[01-components-test.log](../evidence/d4-a-final-independent/01-components-test.log)。
- `corepack pnpm --filter ./packages/components typecheck`：退出码 0；[02-components-typecheck.log](../evidence/d4-a-final-independent/02-components-typecheck.log)。
- `corepack pnpm check:build-determinism`：退出码 0，全 3 包两轮构建无差异；[03-build-determinism.log](../evidence/d4-a-final-independent/03-build-determinism.log)。
- `corepack pnpm release:pack`：退出码 0，components 963、dnd 71、ai 111 文件；[04-release-pack.log](../evidence/d4-a-final-independent/04-release-pack.log)。
- `AHEART_E2E_PORT=5190 corepack pnpm exec playwright test e2e/d4-selection.spec.ts e2e/d4-iframe.spec.ts e2e/tree.spec.ts --reporter=line --output=/tmp/aheart-d4-a-final`：退出码 0，27/27 passed；docs build/render 已由 webServer 完成；[05-playwright.log](../evidence/d4-a-final-independent/05-playwright.log)。

最终影响范围覆盖 Tree retry 错误按钮键盘 Enter、retry 后 treeitem 焦点恢复、Tree linked/TreeSelect 完整逻辑树选择、legacy Tree，以及 Select/TreeSelect/Cascader iframe focus/Escape/unmount 五浏览器项目。此前 a17a0b4 的 434 passed/127 skipped 不冒充最终候选结果。

最终未覆盖：完整 561 全量 E2E（按任务要求不重复）、物理设备、跨域 iframe、SSR hydration、虚拟化性能及产品视觉/交互放行。技术 P1/P2：本次最终影响范围复验未观察到；产品仍待最终裁定。

可供设计复核的截图（Playwright 输出目录）：

- `/tmp/aheart-d4-a-final/d4-selection-D4-Tree-linke-f23c9-tate-and-lazy-failure-retry-desktop-firefox/lazy-error.png`
- `/tmp/aheart-d4-a-final/d4-selection-D4-Tree-linke-f23c9-tate-and-lazy-failure-retry-desktop-firefox/lazy-loaded.png`
- `/tmp/aheart-d4-a-final/d4-selection-D4-TreeSelect-212f1-full-linked-selection-model-desktop-webkit/tree-select-checked.png`

iframe 与 legacy Tree 用例本次未配置截图附件；其通过证据保留在上述 Playwright 日志中。
