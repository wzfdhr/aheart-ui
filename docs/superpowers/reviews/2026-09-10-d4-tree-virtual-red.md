# Tree virtualization RED evidence

Architecture baseline: `3d9c797` on `codex/d4-tree-virtualization`. Scope: Tree RED only; no production source, generated output, dependency or lockfile change.

## Compatibility baseline

Before adding the new contract, the independent test author ran:

```text
corepack pnpm --filter ./packages/components exec vitest run src/tree/__tests__ --environment jsdom
```

The five existing Tree test files passed `44/44` with exit code 0. This is a compatibility baseline, not virtual implementation evidence.

## First RED and test-quality review

The first new suite produced `3 passed / 9 failed`; the full Tree directory produced `47 passed / 9 failed`. Main-thread review did not release implementation because the first draft looked up an unmounted tail row directly, combined several lazy cancellation claims into one request, did not prove iframe-realm observer ownership or pre-hydration zero observation, and its type imports were excluded from the normal package typecheck. These were test-quality gaps, not production defects, and are retained rather than overwritten by the corrected run.

## Corrected genuine RED

The final test-only file is `packages/components/src/tree/__tests__/tree-virtual.test.ts`. It keeps production behavior assertions independent of a marker and covers configuration, bounded DOM, explicit hierarchy metadata, typed keys, full-model selection/checking, cross-window keyboard focus, persistent roving entry, lazy lifecycle, iframe realm, deterministic SSR/hydration, capability fallback and existing duplicate/cycle errors.

Final commands and results:

| Gate | Result |
| --- | --- |
| Existing Tree baseline | `44/44 passed`, exit 0 |
| New Tree virtual suite | `3 passed / 10 failed`, exit 1 |
| Full Tree directory | `47 passed / 10 failed`; all 44 existing tests remain green, exit 1 |
| Temporary type-included `vue-tsc` | exit 2; missing `TreeVirtual`, `TreeVirtualConfig` and public root `TreeVirtual` export |
| `git diff --check` | pass |

The failures are genuine: `virtual-options` does not exist, the public types do not exist, `virtual` still renders the complete DOM, and no virtual observer/SSR window lifecycle is present. Three compatibility assertions already pass and are recorded as evidence, not fabricated failures.

Local logs were captured at `/tmp/d4-tree-red-baseline-v2.log`, `/tmp/d4-tree-red-virtual-v3.log`, `/tmp/d4-tree-red-full-v2.log` and `/tmp/d4-tree-red-typecheck-included.log`. They are local execution evidence; the committed suite is the reproducible contract.

Conclusion: Tree GREEN implementation is released to the sole implementation worker. TreeSelect/Cascader RED, broader reviews, PR, merge and release remain blocked.
