# D4 iframe 独立测试报告

日期：2026-09-07  
角色：独立测试经理  
范围：冻结候选 `docs/superpowers/evidence/d4-iframe-candidate.json`

## 冻结候选

- base：`3dc64ff1734004c2e51cc2a5e6a99a59c85ae1a2`
- 文件数：46
- SHA-256：`c81258c59f8da5bef1cc9d67740ca8fad44f80154fef6fdb7198ef119b697c6c`
- `node scripts/d4-candidate-fingerprint.mjs` 在测试前、测试后均复算为上述指纹，未发现候选改动。
- 复算日志：[00-candidate-fingerprint-after.log](../evidence/d4-iframe-test/00-candidate-fingerprint-after.log)

## 实际执行结果

| Gate | 实际命令 | 结果 | 日志 |
|---|---|---|---|
| 定向回归 | `corepack pnpm --filter ./packages/components exec vitest run --environment jsdom src/select/__tests__/select.test.ts src/tree-select/__tests__/tree-select.test.ts src/cascader/__tests__/cascader.test.ts` | 3 files passed，74/74 passed | [01-targeted-vitest.log](../evidence/d4-iframe-test/01-targeted-vitest.log) |
| 类型检查 | `corepack pnpm --filter ./packages/components typecheck` | 退出码 0 | [02-typecheck.log](../evidence/d4-iframe-test/02-typecheck.log) |
| 真实浏览器补测 | `AHEART_E2E_PORT=5183 corepack pnpm exec playwright test e2e/d4-iframe.spec.ts --project=desktop --project=mobile --project=desktop-firefox --project=desktop-webkit --project=mobile-webkit --reporter=line --output=/tmp/aheart-d4-iframe-independent` | 15/15 passed，约 26.5s | [03-playwright.log](../evidence/d4-iframe-test/03-playwright.log) |

## 指定场景覆盖

`e2e/d4-iframe.spec.ts` 对每个组件分别在 desktop、mobile、desktop-firefox、desktop-webkit、mobile-webkit 执行同一套 same-origin iframe 场景：

- Select：iframe 内 trigger 获得焦点；打开 popup；iframe 外层 Escape 不消费且 popup 保持打开；iframe 内 Escape 关闭并将焦点恢复 trigger；SPA 导航卸载后 trigger/panel 消失；卸载后的 Escape/pointerdown 均未被消费，后续焦点保持。
- TreeSelect：同上，打开后额外断言 treeitem 获得焦点；SPA 导航与卸载后事件消费/焦点清理同上。
- Cascader：同上，打开后额外断言 option 获得焦点；SPA 导航与卸载后事件消费/焦点清理同上。

共享原生监听按既有架构保留；本轮验证的是组件卸载后注册/回调/事件消费清理及焦点行为，而非要求移除共享监听。

## 未覆盖项

- 非 same-origin 或跨域 iframe（浏览器同源策略限制）。
- 本轮未覆盖其他组件、组件 API 深度审计项、发布/合并主线 CI、视觉截图验收。
- 本轮未覆盖自定义 popup container 的全部排列组合；仅验证测试夹具中的 iframe ownerDocument 场景。

## 缺陷分级

- 技术 P1：未观察到。
- 技术 P2：未观察到影响本轮指定 iframe 场景通过的技术 P2；上述未覆盖项保留为测试边界，不作通过替代。
- 产品 P2：保留给产品经理 `019eecfb-9d1a-7c40-99dd-13c7386e3e1f`，本报告不作产品放行，也不以总数替代指定场景验收。

## 测试结论

冻结候选的定向回归、类型检查及五浏览器 iframe focus/Escape/unmount 补测均通过。该结论仅覆盖本报告列明的独立测试 gate；不等同于产品放行或 D4 全部 API/发布验收。
