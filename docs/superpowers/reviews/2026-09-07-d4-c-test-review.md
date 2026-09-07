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
