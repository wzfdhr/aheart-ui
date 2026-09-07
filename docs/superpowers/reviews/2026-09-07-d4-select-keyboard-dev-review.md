# D4 Select 键盘与大列表修正：开发经理复审

## 结论

本次相对 `a5300e8` 的 Select 修正，开发复审未发现 P1；指定键盘行为与动态行高滚动证据链完整。技术 P2=0（见门禁证据边界），产品相关问题仍待产品经理裁定，本报告不作产品放行。

## 冻结候选

- 候选：`docs/superpowers/evidence/d4-full-candidate.json`
- Git commit SHA：`709de18a183a09e76059c6ea184232b8f41163f4`（整合者仅校正此术语，不改动独立审查结论）
- 实际指纹：`17de1fad1c17fdbcd9ff686812de6067316b626e93a35c5b506d6a24e1a285ad`
- 文件数：48（候选清单自身记录）
- 命令：`node scripts/d4-candidate-fingerprint.mjs docs/superpowers/evidence/d4-full-candidate.json`
- 结果：命令成功，输出指纹与指定完整指纹一致；报告文件不在候选清单内。

## 本次修改复审范围

复查了：

- `packages/components/src/select/select.vue`
- `packages/components/src/select/__tests__/select.test.ts`
- 对应 `packages/components/es/select/select.vue.js`、`packages/components/lib/select/select.vue.js`
- `scripts/d4-browser-performance.mjs`
- `docs/superpowers/specs/2026-09-07-d4-virtualization-options.md`

### 双重键盘事件

搜索 input 已移除直接 `@keydown="handleKeydown"`，保留 selector 根节点的单一冒泡处理路径。新增单测连续触发两次 ArrowDown 后 active 为 Apple、Banana，再触发 Enter，`update:modelValue` 只有一次且值为 Banana。

命令：`corepack pnpm --filter ./packages/components test -- src/select/__tests__/select.test.ts`

结果：39 tests passed。

### active 可见性与动态行高

新增 `watch(activeOptionId, { flush: 'post' })`，在下一 tick 按实际 `getBoundingClientRect()` 比较 active row 与 popup viewport，并通过 `scrollTop` 调整。计算同时使用 popup 的 transform scale、`clientTop` 与 `clientHeight`，没有把固定 32px 假设写入修正路径，能覆盖交错 32/46px 的 optionRender。

最终 Chromium 证据：`docs/superpowers/evidence/d4-performance/baseline-2026-09-07T034506Z.json`。本地解析命令确认 9 个场景全部满足 `optionDomCount === size`、active 文本为 `Option 00020`、`activeRect.fullyVisible === true`；浏览器版本 149.0.7827.55。场景覆盖 Select fixed/dynamic 与 Cascader fixed，各 1k/5k/10k。

### ownerDocument 与 SSR 安全性

- popup 默认容器仍为 `selectorRef.value?.ownerDocument.body`。
- active 查询使用 `popup?.ownerDocument.getElementById(id)`，并以 `popup.contains(option)` 限定同一 popup。
- watcher 的 DOM 访问只在 `nextTick` 回调内执行；setup/SSR 首轮不读取全局 `document` 或 `window`，没有改变首轮 SSR DOM 结构。
- es/lib 生成物均包含相同 watcher、ownerDocument 查询和移除 search input 直接 keydown 的结果；候选指纹覆盖这些生成物。

## 性能基线边界

`d4-browser-performance.mjs` 使用真实 Playwright Chromium，但 harness 是 Vite development 直接加载源码；报告明确记录单桌面、单轮、非统计性基线，open/search/keyboard 含 Playwright 往返时间。因此它可证明 1k/5k/10k 的交互场景与 active 可见性，不可冒充 production bundle FPS、跨机器绝对性能门槛或移动端性能结论。方案文件也明确默认不自动虚拟化，本候选没有虚拟化实现或 API 放行。

## 未覆盖项与门禁边界

- 本复审未重跑完整 409 E2E、全 workspace 门禁、跨浏览器矩阵；仅执行 Select 定向测试和最终性能 JSON 结构/断言解析。已有门禁日志中记录 components 1079、dnd 44、ai 66、scripts 86、typecheck、determinism、release pack 与 E2E 409 passed/127 existing skipped，但这些不是本次独立重跑结果。
- `docs/superpowers/evidence/d4-full-gates/unit.log` 尾部同时保留一次 scripts 断言失败（旧的 `playwright.config.ts` 期望未包含 `d4IframeOnly`）；`scripts-fixed.log` 后续记录 86/86 通过。该证据需要测试/门禁负责人确认采用哪一次，不把它误报为本次 Select 修正的绿灯。
- 未实现虚拟化，未验证 SSR renderToString→hydrate、窗口化 active 节点、动态测量缓存或移动/Firefox/WebKit 性能；这些属于待审方案后续范围。

## 分级

- 技术 P1：0。未见重复处理导致一次按键跳两项、active 不可见、跨 Document 查询错误或 SSR 首轮直接触 DOM 的阻断问题。
- 技术 P2：0（本次 Select 修正范围）。定向测试与 9 场景最终 Chromium 证据均满足指定行为；完整门禁日志的旧失败已作为证据边界单列，需门禁负责人确认而非由本复审自行覆盖。
- 产品问题：待产品经理裁定。虚拟化是否立项、是否公开 API、以及性能基线是否足以支持产品承诺，均不由开发复审放行。
