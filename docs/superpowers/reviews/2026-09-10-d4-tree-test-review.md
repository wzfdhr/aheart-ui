# Tree virtual independent test evidence

Independent test authors were separate from the sole production implementation worker. The frozen architecture and genuine RED history are retained in the architecture and implementation-recovery reports.

| Evidence | Result and boundary |
| --- | --- |
| Maintained Tree/TreeSelect unit suite | 87/87 passed: 19 virtual contracts, 6 repair regressions, 62 existing tests. |
| Independent developer diagnostics | 13/13 passed, final P0/P1/P2=`0/0/0`; includes observer leak, cancellation, blur/collapse distinction and measurement cache cases. |
| Independent browser run r12 | 40/40 passed across desktop/mobile Chromium, desktop Firefox, desktop/mobile WebKit; no new skip. |
| Browser coverage | 1k/10k bounded windows, physical scroll geometry, End/Home focus, true Tab exit/re-entry, collapse/deletion entry recovery, inherited disabled, multiline dynamic rows, stable-key reorder, whole-tree disabled scrolling and re-enable. |
| Runtime errors | pageerror and console error are failures. Only Firefox's built-in scroll-linked positioning warning is preserved separately as a browser-diagnostics attachment. |
| Build/type evidence | Root typecheck, full package build, docs build and release pack passed. Public virtual types and generated Tree modules were rebuilt. |
| Candidate hygiene | No package dependency or lockfile change; no new skip/only/fixme or timeout allowance. Generated CSS changes during Vitest arise from the existing deterministic-style closeBundle plugin. |

Command for the independent source-preview browser run:

```text
corepack pnpm exec playwright test --config=/tmp/aheart-d4-tree-playwright.config.ts --output=/tmp/aheart-d4-tree-results-r12
```

The maintained spec is `e2e/d4-tree-virtual.spec.ts`, also added to the normal repository five-browser configuration. The temporary run used the source preview at port 5371; it is not the final production/packed-consumer run. Initial failures, corrected test assumptions and rejection of a fixture-level tabindex workaround are retained in the recovery report. All eight browser tests use the current source Tree and actual component DOM.

Tree functional test substage passes. The combined phase still requires fresh production-browser, real tgz SSR/hydration, 1k/5k/10k performance, gzip comparison, full repository freeze and all delivery gates. This report does not close those requirements or authorize publishing.
