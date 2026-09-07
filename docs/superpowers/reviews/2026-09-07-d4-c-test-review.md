# D4-C Select 虚拟化独立测试报告

日期：2026-09-07
角色：独立测试经理
范围：冻结候选 `HEAD 84ad73a` / 核心 `b40f100`

## 冻结绑定

- 执行前冻结指纹：`56e5623a5d98ce69b9204b4c4bc5b93b415746aa8de42bd4c3c26dc0a8cb626b`，122 文件。
- 执行前参考日志：[00-candidate-fingerprint-start.log](../evidence/d4-c-independent/00-candidate-fingerprint-start.log)。
- 测试期间主代理为修复新发现的 virtual 空结果高度 P2 修改了源码；当前复算为 `3f65e5795b1a7e773ed3d2fc19efd869b97504d0a2695bc50e8e871479b64574`，不作为旧冻结候选结束指纹，也不把旧结果冒充新 SHA。[00-current-after-delta.log](../evidence/d4-c-independent/00-current-after-delta.log)

## 已完成门禁（均绑定执行前 56e 候选）

| Gate | 命令 | 结果 | 日志 |
|---|---|---|---|
| components 单测 | `corepack pnpm --filter ./packages/components test -- --maxWorkers=2 --minWorkers=1` | 77 files，1120/1120 passed，退出码 0 | [01-components-test.log](../evidence/d4-c-independent/01-components-test.log) |
| dnd 单测 | `corepack pnpm --filter @aheart-ui/dnd test` | 44/44 passed，退出码 0 | [02-dnd-test.log](../evidence/d4-c-independent/02-dnd-test.log) |
| ai 单测 | `corepack pnpm --filter @aheart-ui/ai test` | 66/66 passed，退出码 0 | [03-ai-test.log](../evidence/d4-c-independent/03-ai-test.log) |
| scripts 单测 | `node --test scripts/*.test.mjs` | 86/86 passed，退出码 0 | [04-scripts-test.log](../evidence/d4-c-independent/04-scripts-test.log) |
| 三包 typecheck | `corepack pnpm typecheck` | 退出码 0 | [05-typecheck.log](../evidence/d4-c-independent/05-typecheck.log) |
| 确定性构建 | `corepack pnpm check:build-determinism` | 退出码 0，双构建完成 | [06-build-determinism.log](../evidence/d4-c-independent/06-build-determinism.log) |
| release pack | `corepack pnpm release:pack` | components 971、dnd 71、ai 111，退出码 0 | [07-release-pack.log](../evidence/d4-c-independent/07-release-pack.log) |

## consumer 复验

重新 pack 的 Select tarball SHA-256 为 `4e059c6d634913c1c80b664a29764a0cb37ecd9e8dff9b5faea6a971b1dc4e07`。`d4-select-virtual-consumer.mjs` 新候选 36 场景（1k/5k/10k × fixed/dynamic × 3 rounds）全部通过，4 组 hydration、CJS SSR、bytes/module sets 断言通过；旧 tarball build-only 对照也通过。新旧稳定字段与 `docs/superpowers/evidence/d4-c/consumer/results.json` 完全一致。[consumer-results.json](../evidence/d4-c-independent/consumer-results.json)、[11-consumer-stable-compare.log](../evidence/d4-c-independent/11-consumer-stable-compare.log)

## 全量 E2E（旧冻结候选，非最终放行）

实际命令：`AHEART_E2E_PORT=5213 corepack pnpm exec playwright test --workers=2 --reporter=line --output=/tmp/aheart-d4-c-independent`。

结果：571 tests 启动，376 passed、106 skipped；未通过。运行中 docs preview 因 `ENOENT ... docs/.vitepress/dist/assets/app.CK04hGkd.js` 崩溃，随后大量测试为 `Could not connect to the server`；另有 splitter remount 断言失败。完整失败、截图、trace 保留在 `/tmp/aheart-d4-c-independent/`，原始日志：[10-playwright.log](../evidence/d4-c-independent/10-playwright.log)。该结果只绑定执行前 `56e5623a...` 候选；不用于新 P2 修复后的候选结论。

## 分级与结论

- 技术 P1：本轮未观察到由 Select 虚拟化实现直接确认的 P1；全量 E2E 受 docs preview 崩溃影响，属于未通过的独立门禁。
- 技术 P2：主代理在本轮执行期间确认并修复了空搜索结果高度问题（virtual popup 固定高度压住 empty/notFound）；该 delta 不属于本报告冻结候选，必须等待新候选开发复审、重冻及受影响复验。
- 产品放行：不作产品裁定。

本报告保留旧 56e 候选的真实门禁与失败证据；consumer 稳定字节/模块及 36 场景通过不抵消全量 E2E 未通过，也不替代新 P2 修复后的最终候选测试。

## 最终修正版候选独立复验

最终冻结候选：HEAD `8b099c8` / code `56debe7`，122 文件，指纹 `1f7b2f227d72235319f21c08fd308648eac447f7edcbb6d761f621394f505bd9`。执行前后 `node scripts/d4-candidate-fingerprint.mjs docs/superpowers/evidence/d4-c/final-candidate.json` 均一致；日志：[00-candidate-fingerprint-after.log](../evidence/d4-c-final-independent/00-candidate-fingerprint-after.log)。

门禁结果：

- components：77 files、1121/1121 passed（`--maxWorkers=2 --minWorkers=1`）。
- dnd：44/44；ai：66/66；scripts：86/86。
- 三包 typecheck：退出码 0。
- build determinism：双构建退出码 0。
- release pack：components 971、dnd 71、ai 111。
- 新 tarball SHA-256：`0d14f00fcedf0c53244ddcadb39548ee2403570465befc850040c9064edd9162`，与预期一致；[00-tarball-sha-after.log](../evidence/d4-c-final-independent/00-tarball-sha-after.log)。

全部独立日志位于 [d4-c-final-independent](../evidence/d4-c-final-independent/)。

最终 consumer 以 `final-new-lock.json` 重跑：1k/5k/10k × fixed/dynamic × 3 rounds 的 36/36 场景通过，4 组 hydration、CJS SSR、empty-visible、bytes/modules 对照全部通过；新旧稳定字段与 `final-results.json` 一致。[final-results.json](../evidence/d4-c-final-independent/final-results.json)、[11-consumer-stable-compare.log](../evidence/d4-c-final-independent/11-consumer-stable-compare.log)。

最终完整 E2E 实际命令：`AHEART_E2E_PORT=5215 corepack pnpm exec playwright test --workers=2 --reporter=line --output=/tmp/aheart-d4-c-final-independent`。结果：576 tests，449 passed、127 skipped、0 failed，退出码 0；docs preview 未崩溃。新增 no-results、tail/disabled/HomeEnd/dynamic、ownerDocument iframe/unmount、splitter remount 场景均随五项目执行。[10-playwright.log](../evidence/d4-c-final-independent/10-playwright.log)

最终截图示例：`/tmp/aheart-d4-c-final-independent/d4-select-virtual-Select-v-59507-ible-and-search-can-recover-desktop-firefox/select-virtual-empty.png`、`/tmp/aheart-d4-c-final-independent/d4-select-virtual-Select-v-5eb26-height-and-scroll-anchoring-desktop/select-virtual-tail.png`。

最终候选未观察技术 P1/P2；此前空结果高度 P2 已由本候选验证关闭。旧 56e 候选的 376/106 失败历史保留，不与最终 449/127 结果混用。产品视觉/交互及产品 API 仍不由独立技术测试放行。
