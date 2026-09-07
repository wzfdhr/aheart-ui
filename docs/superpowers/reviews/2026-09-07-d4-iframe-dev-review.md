# D4 同源 iframe 开发经理复审

## 结论

开发复审：P1=0，技术 P2=0。指定的三组件同源 iframe 行为已经有真实场景断言，未发现把 reload、父文档重聚焦或静态挂载当作通过条件的证据缺陷。

产品测试 P2=1 仍待产品经理最终裁定；本报告不作产品放行，也不替代测试经理的独立浏览器运行。

## 冻结候选

- 候选证据：`docs/superpowers/evidence/d4-iframe-candidate.json`
- 预期指纹：`c81258c59f8da5bef1cc9d67740ca8fad44f80154fef6fdb7198ef119b697c6c`
- 清单：46 文件
- 复核命令：`node scripts/d4-candidate-fingerprint.mjs docs/superpowers/evidence/d4-iframe-candidate.json`
- 结果：命令成功，输出的 `sha256` 与预期一致；本报告文件不在候选清单内。

## 开发复审范围与证据

复核了 `e2e/d4-iframe.spec.ts`、Select/TreeSelect/Cascader 三个 iframe 单测，以及三组件的 `ownerDocument` popup 容器和 `useFloatingDismiss`/`overlay-controller` 连接。

- 三个单测均在真实 `iframe.contentDocument.body` 挂载组件，并断言 panel/popup 的父节点属于 iframe Document；父文档查询不到浮层。
- 三个单测均分别向父文档派发 foreign Escape（打开态保持），再向 iframe ownerWindow/activeElement 派发 Escape，断言事件被消费、`aria-expanded=false`、焦点回到 iframe 内触发器及 `openChange` 的开关次数。
- 三个单测均重新打开后 `wrapper.unmount()`，断言 iframe 与父文档都没有浮层；随后在 iframe 内部外部按钮派发 Escape 与 pointerdown，断言 Escape 未被 prevent、焦点未被抢走、旧回调未再次触发。
- E2E 为同源 iframe 的真实浏览器路径，使用 iframe 内 `/components/select`、`/components/tree-select`、`/components/cascader` 交互入口；父页面 Escape 不关闭，iframe 内部目标 Escape 关闭并恢复焦点。
- E2E 通过 iframe 内 `document` marker 在 SPA 导航前后保持相同且非空，并在同一 frame 内检查组件节点消失及后续 Escape/pointerdown 未消费，排除了 reload 或仅靠重新聚焦造成的假通过。

源码对照：Select、TreeSelect、Cascader 的默认 popup 容器均取触发器 `ownerDocument.body`；`useFloatingDismiss` 由 trigger/floating 推导 ownerDocument 注册 overlay；Escape 与 pointerdown 分别按该 Document 的 overlay stack 处理。

## 实际轻量检查

命令：

`corepack pnpm --filter ./packages/components test -- src/select/__tests__/select.test.ts src/tree-select/__tests__/tree-select.test.ts src/cascader/__tests__/cascader.test.ts`

结果：3 个文件、74 个测试全部通过（Select 38、TreeSelect 15、Cascader 21）。

## 未覆盖项与边界

- 本开发复审未运行全量跨浏览器 E2E；该项由测试经理独立实际运行。
- 单测/E2E 证明的是卸载后共享处理器不再消费事件和不产生副作用；`overlay-controller` 当前按 Document 保留共享 keydown/pointerdown 原生监听，最后一个 overlay 注销时不主动 `removeEventListener`。这属于既有共享监听架构边界，不应表述为“所有原生监听已移除”；若产品把物理 detach 作为要求，应另开技术项。
- 本复审不覆盖 D4 其他组件/API、窗口化、设计影响或最终用户验收。

## 分级

- 技术 P1：0。未见会阻断 iframe 交互或造成跨 Document 误关闭/焦点丢失的实现问题。
- 技术 P2：0。指定场景的断言链完整；共享监听物理 detach 边界已明确，但当前行为验证为卸载后 inert，不计为本候选技术缺陷。
- 产品 P2：1（待裁定）。测试场景补齐后的产品是否接受该行为证据，以及是否要求共享原生监听物理移除，留待产品经理最终裁定。

