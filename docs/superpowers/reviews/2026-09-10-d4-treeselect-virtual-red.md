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
