# D4 iframe 指定场景补测与流程纠正

产品裁定：iframe 指定证据 P2 已由产品经理任务 `019eecfb-9d1a-7c40-99dd-13c7386e3e1f` 批准关闭，见 [正式产品报告](./2026-09-07-d4-iframe-product-review.md)。此前未经批准的“等价覆盖、非阻断”降级已撤销，本次关闭依据是独立补证和产品正式裁定。

## 实施验证（不是独立审核）

三组件原有仅挂载断言已替换为完整同源 iframe 行为用例：

- 触发器 focus 后，iframe Document.activeElement 是触发器，父文档 activeElement 是 iframe。
- 浮层直属触发器 ownerDocument.body，父文档无泄漏浮层。
- TreeSelect/Cascader 焦点进入真实 treeitem/option；Select 保持其现有 combobox 焦点模型。
- 父文档 Escape 不关闭 iframe 内浮层。
- iframe 内 Escape 被处理、aria-expanded=false、焦点恢复触发器，openChange 仅一次关闭通知。
- 再次打开后 unmount，父/子文档均无浮层；派发 Escape 和 pointerdown 后不消耗 Escape、不抢外部按钮焦点、不触发旧 openChange。

命令：`corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/select/__tests__/select.test.ts src/tree-select/__tests__/tree-select.test.ts src/cascader/__tests__/cascader.test.ts`，74/74 通过；`corepack pnpm --filter ./packages/components typecheck` 通过。

证据边界：上述运行环境是 jsdom；真实浏览器同源 iframe 用例另行验证。OverlayController 每 Document 的共享输入跟踪监听按现有设计保留；清理断言针对组件的浮层注册、回调、事件消费和焦点副作用，不声称移除了所有原生共享监听。

## 候选与审核

候选已冻结：`c81258c59f8da5bef1cc9d67740ca8fad44f80154fef6fdb7198ef119b697c6c`；46 文件清单见 `docs/superpowers/evidence/d4-iframe-candidate.json`。通过 `node scripts/d4-candidate-fingerprint.mjs` 复算；审核记录与状态文件不在代码指纹范围内，候选源码/测试/产物/组件文档变化必须重新冻结并复审。

实施者执行 `AHEART_E2E_PORT=5182 corepack pnpm exec playwright test e2e/d4-iframe.spec.ts --project=desktop --reporter=line --output=/tmp/aheart-d4-iframe-implementation`：3/3 通过。三组件实际从现有交互入口打开；TreeSelect/Cascader 从内部焦点节点发出 Escape；SPA 导航卸载前保持打开，Document 随机标识在卸载前后相同且非空，排除 reload 清理造成假通过。卸载后检查触发器和panel均消失、Escape/pointer不被消费、外部按钮焦点保持。

独立开发经理复审已完成（技术P1/P2=0），见 `2026-09-07-d4-iframe-dev-review.md`。随后独立测试经理实际运行三组件74/74、typecheck和五浏览器15/15通过，见 `2026-09-07-d4-iframe-test-review.md`，日志位于 `docs/superpowers/evidence/d4-iframe-test/`，测试前后指纹一致。设计影响核对见 `2026-09-07-d4-iframe-design-impact.md`：本次没有运行时/样式变化，不触发新视觉审核。产品经理已实际复算并核对上述证据，批准关闭本项 P2；独立角色报告中的“待裁定”为审核当时状态，以正式产品报告为最终裁定。

公共 API 与窗口化保持待专项批准；不合并、不推进 D5。
