# D4 Cascader 独立测试经理验收报告

## 候选与环境

- Candidate HEAD：`7964d860aca96a1b6ae73958cfb65eb7d559ba30`
- Evidence：`/tmp/d4-7964d86-final-tl4XuM`
- Node：24.17.0
- pnpm：9.15.4（`corepack pnpm --version`）
- Vitest：1.6.1
- Playwright：1.61.1
- VitePress preview：5416，命令为 `corepack pnpm --dir docs dev --host 127.0.0.1 --port 5416`
- Playwright config：`/tmp/d4-7964d86-playwright.config.mjs`
- 未 build、未打包 tgz、未操作主 5371。

## 独立运行命令与结果

1. Recovery unit：

   ```bash
   corepack pnpm --filter ./packages/components exec vitest run \
     --config /tmp/d4-b8-vitest.config.mjs \
     src/cascader/__tests__/cascader-virtual-recovery8.test.ts \
     src/cascader/__tests__/cascader-virtual-recovery9.test.ts \
     src/cascader/__tests__/cascader-virtual-recovery10.test.ts \
     src/cascader/__tests__/cascader-virtual-recovery11.test.ts \
     src/cascader/__tests__/cascader-virtual-recovery12.test.ts \
     src/cascader/__tests__/cascader-virtual-recovery13.test.ts \
     --reporter=verbose
   ```

   结果：6 files，40/40；日志：[recovery8-13.log](/tmp/d4-7964d86-final-tl4XuM/unit/recovery8-13.log)。

2. Cascader unit 全量：

   ```bash
   ./packages/components/node_modules/.bin/vitest run \
     --config /tmp/d4-8ff-cascader-vitest.config.mjs --reporter=verbose
   ```

   结果：17 files，135/135；日志：[cascader-135.log](/tmp/d4-7964d86-final-tl4XuM/unit/cascader-135.log)。

3. Recovery13 controls 单独复验：同一 `vitest run` 命令仅执行 `cascader-virtual-recovery13.test.ts`。

   结果：4/4；日志：[recovery13-controls.log](/tmp/d4-7964d86-final-tl4XuM/unit/recovery13-controls.log)。

4. Components typecheck：

   ```bash
   corepack pnpm --filter ./packages/components typecheck
   ```

   结果：exit 0；日志：[typecheck.log](/tmp/d4-7964d86-final-tl4XuM/unit/typecheck.log)。

5. Geometry 五项目（原 deep-column + 两个稳定恢复场景）：

   ```bash
   corepack pnpm exec playwright test \
     --config /tmp/d4-7964d86-playwright.config.mjs \
     e2e/d4-cascader-virtual.spec.ts \
     --grep 'five columns keep logical|deep five-column search clear|deep five-column ArrowLeft'
   ```

   结果：5 projects × 3 cases = 15/15；日志：[geometry15.log](/tmp/d4-7964d86-final-tl4XuM/browser/geometry15.log)。

6. Cascader 五项目当前全套：

   ```bash
   corepack pnpm exec playwright test \
     --config /tmp/d4-7964d86-playwright.config.mjs \
     e2e/d4-cascader-virtual.spec.ts
   ```

   结果：60/60；日志：[cascader60.log](/tmp/d4-7964d86-final-tl4XuM/browser/cascader60.log)。

7. TreeSelect 五项目当前全套：

   ```bash
   corepack pnpm exec playwright test \
     --config /tmp/d4-7964d86-playwright.config.mjs \
     e2e/d4-tree-select-virtual.spec.ts
   ```

   结果：50/50；日志：[treeselect50.log](/tmp/d4-7964d86-final-tl4XuM/browser/treeselect50.log)。

五项目为 Chromium desktop/mobile、Firefox desktop、WebKit desktop/mobile。Playwright JSON 显示 `expected=50`、`skipped=0`、`unexpected=0`、`flaky=0`；unit、E2E 日志均无 pageerror 或浏览器 console error/warning。

## 对比度与行为指标

- Cascader lazy error text：5 个项目均为 `4.866457121528835`。
- TreeSelect normal：`5.305562382514169`。
- TreeSelect hover：`5.083099410296239`。
- TreeSelect selected retry：`4.736824356547493`。
- TreeSelect selected title：约 `4.9447157`。
- Geometry 场景的 panel viewport 边界、focused/current row 与所属 column clip 均通过；ArrowLeft root row intersection 均为 1。
- Lazy retry、focus ring、empty-search、recovery13 stale reveal cancellation 均通过。

## 历史 RED 分类

- `2055440`：deep search-clear 在 viewport 775 下 panel 越界；5/5 RED。ArrowLeft root row 在 Chromium mobile/mobile WebKit 约 `0.607843` intersection，2/5 RED。属于真实 geometry/scroll ownership 缺陷，已由后续 candidate 修复。
- `8fb9d57`：受控 `floatingPosition.update()` 延迟释放后，旧 reveal 将 `scrollLeft` 从 0 写回 180；核心 case 1 RED，close/options/search 三个 cancellation controls 通过。日志：`/tmp/d4-8fb9d57-cascader-reveal-red.log`。属于真实 async reveal generation 缺陷，已由 `recovery13` 维护并在当前 candidate GREEN。
- `7964d86`：上述 RED 均转 GREEN；未将历史失败混入当前验收结果。

## Source/status fingerprint

验收 before/after：

- HEAD before/after 均为 `7964d860aca96a1b6ae73958cfb65eb7d559ba30`。
- Source hash 清单：[source-head-before.sha256](/tmp/d4-7964d86-final-tl4XuM/source-head-before.sha256)、[source-head-after.sha256](/tmp/d4-7964d86-final-tl4XuM/source-head-after.sha256)。
- Source diff：[source-head.diff](/tmp/d4-7964d86-final-tl4XuM/source-head.diff)，0 bytes。
- Status diff：[status.diff](/tmp/d4-7964d86-final-tl4XuM/status.diff)，0 bytes。
- 相关生产源 SHA：

  ```text
  56d58e879051d8dd52fb801081134ab999a0fc7c  packages/components/src/cascader/cascader.vue
  2f40bc3a4977da1319ba02fb87f24511a2a2c5af  packages/components/src/cascader/cascader-virtual-list.vue
  c7716ed2abc9663b01fe3d0c0080d91144275de4  packages/components/src/cascader/style.css
  f0156634fa08828e812daddf3b07d9a31c2368b1  packages/components/src/tree/tree.vue
  fc2cb2f17851597c85f1c2f2c39f4009642e74b7  packages/components/src/tree/use-tree-virtual.ts
  267da28fb2c32a50d566333a5c237249113e272f  packages/components/src/tree-select/tree-select.vue
  ```

工作树中既有的 `packages/components/es/style.css`、`packages/components/lib/style.css` dirty 与 `docs/superpowers/evidence/d4-cascader-virtual/` 未跟踪目录前后保持不变，未纳入本轮动作。

## Gate 结论

- P0：0
- P1：0
- P2：0
- 新 skip：0
- pageerror / 浏览器 console error：0

该 candidate 通过本轮独立自动化测试经理门禁。此次报告不宣称完整 release closure：尚未执行 build、tgz/consumer 对照、SSR combined release 验证或最终发布验收。
