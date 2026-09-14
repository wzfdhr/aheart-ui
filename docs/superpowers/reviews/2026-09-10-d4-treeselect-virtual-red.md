# TreeSelect virtualization independent RED

Baseline: `7d6833b` on `codex/d4-tree-virtualization`, after Tree functional product acceptance. The independent Luna High test author did not modify production code, helpers, documentation, fixtures, E2E, generated distributions or the lockfile.

Existing TreeSelect and checkable tests passed **18/18**. This is compatibility evidence, not a fabricated failure. Log: `/tmp/d4-treeselect-red-20260910/compat-baseline.log`.

The maintained `packages/components/src/tree-select/__tests__/tree-select-virtual.test.ts` produced **5 failed / 0 passed**. Command:

```text
corepack pnpm --filter ./packages/components exec vitest run src/tree-select/__tests__/tree-select-virtual.test.ts --environment jsdom
```

Final RED log: `/tmp/d4-treeselect-red-20260910/tree-select-virtual-red-final.log`.

| Contract | Observed RED |
| --- | --- |
| Default full DOM compatibility and explicit `virtual=true` window | Default 100 rows remain; virtual 1000 rows are all mounted instead of at most 24. |
| Empty/custom config, height and caller immutability | Explicit configuration does not activate the bounded Tree window. |
| Virtual search keyboard entry and no trigger active descendant | ArrowDown from search does not move actual focus into a treeitem. |
| Internal Tree viewport wiring | The existing Tree virtual overflow/max-block-size wiring is absent. |
| Deterministic bounded SSR without observation | Repeated SSR is stable but outputs all 1000 treeitems, not a virtual window. |

The first scroll-owner test attempted computed CSS/clientHeight in a Vitest environment that does not inject imported CSS and reports zero layout. That fixture assumption was removed before the final RED above. The maintained unit checks existing Tree inline viewport wiring only; the actual popup CSS, single-scroll-owner geometry and viewport-budget behavior still require browser evidence. Owner-realm ResizeObserver/RAF capabilities are installed for virtual tests and restored after unmount.

This is an initial core RED set, not the full TreeSelect test exit. Public type exports, invalid configuration, virtual controlled/checkable/tag states, search endpoint/re-entry details, popup-budget geometry, lazy close/cancellation, iframe and actual hydration diagnostics remain to be covered. No TreeSelect implementation or product acceptance follows from this report.

## Pre-implementation extended RED

The independent author extended the maintained suite to **9 tests: 7 failed / 2 passed**, without changing production code. Log: `/tmp/d4-treeselect-red-20260910/tree-select-virtual-red-final4.log`. Added coverage includes invalid field fallback, search ArrowUp/End reaching the last enabled logical row, controlled open/value refusal, and checkable search using the full index with disabled nodes and tags. Passing existing controlled/checkable behavior is recorded as compatibility supplementation, not invented RED.

The public-type assertion is kept under `src/tree-select/__tests__/tree-select-virtual.types.ts`, not in the production source directory where declaration generation would package it. Its local `tsconfig.virtual.json` includes only the contract and imports the public root barrel. This command failed with exactly the two missing exports, `TreeSelectVirtual` and `TreeSelectVirtualConfig`:

```text
corepack pnpm --filter ./packages/components exec vue-tsc --noEmit -p src/tree-select/__tests__/tsconfig.virtual.json
```

Final type RED log: `/tmp/d4-treeselect-red-20260910/public-type-contract-red-final.log`, exit 2. The earlier temporary production-directory location has been removed; it is not a deliverable or the final type-test command.

Real popup-budget/clientHeight, iframe, lazy close/cancellation, actual hydration diagnostics and the complete five-browser geometry matrix still require independent browser/consumer evidence. A browser test author is separately preparing the source fixture and genuine viewport RED before production implementation starts.

## Source-preview browser RED

A different Luna High author added the query-gated `TreeSelectVirtualFixture.vue`, its ordinary-docs `ClientOnly` entry and `e2e/d4-tree-select-virtual.spec.ts`. No production component or generated output changed. Desktop Chromium ran four real-browser scenarios: **3 failed / 1 passed**. The failures establish full 1000-row DOM instead of a bounded window, the popup rather than Tree owning vertical scroll under a short viewport, and search ArrowDown failing actual focus transfer. The controlled parent refusal scenario passed on the first run and is compatibility evidence. A failure at the 1000-row assertion does not establish that the subsequent 10k assertions executed successfully.

The fixture uses source imports, real Teleport panel lookup, explicit reopen after toolbar dismissal, actual computed 24px popup font and real viewport resizing. Disabled tail nodes may remain mounted as overscan; tests assert disabled and unfocused, not their removal. The scroll/layout contract is tested in the browser, not inferred from jsdom zero sizes.

Command: `corepack pnpm exec playwright test --config=/tmp/d4-treeselect-browser-20260910/playwright.config.ts`. Final stdout is `/tmp/d4-treeselect-browser-20260910/last-run.stdout.log`; copied failure traces/screenshots/videos are preserved outside disposable `test-results` in `/tmp/d4-treeselect-browser-20260910/evidence/`. Five-browser expansion, iframe, 200% zoom, real hydration/consumer and broader lazy paths remain open.

## Normal five-browser configuration contract

The independent browser author added a configuration self-check before editing Playwright routing. `node --test scripts/playwright-config.test.mjs` first produced **9 passed / 1 failed**, then **10 passed / 0 failed** after the new TreeSelect spec was added to the existing cross-browser allowlist. Desktop/mobile Chromium retain their existing all-tests default; Firefox and both WebKit projects use the shared list. No timeout, worker, skip or CI architecture changes were made. Logs: `/tmp/d4-treeselect-ci-contract-20260910-red.stdout.log` and `/tmp/d4-treeselect-ci-contract-20260910-green.stdout.log`.

This proves test selection configuration only, not five-browser functional success. The production implementation now proceeds against the frozen genuine RED contracts.

## Lifecycle and hydration validation draft

A separate maintained lifecycle file is prepared at `src/tree-select/__tests__/tree-select-virtual-lifecycle.test.ts`, with five scenarios for rejected/accepted controlled close, lazy retry, disabled/unmount abort, attached-host SSR hydration diagnostics and iframe observation cleanup. It has **not yet been executed** and is not RED/GREEN evidence. The author corrected its fixture before first execution: attach the hydration host, observe the beforeMount boundary, restore warning hooks/descriptors, avoid double unmount and dispose the iframe wrapper before removing its document. First execution is scheduled after the implementation freezes; already-working lifecycle behavior must be recorded as supplemental proof rather than invented failure.
