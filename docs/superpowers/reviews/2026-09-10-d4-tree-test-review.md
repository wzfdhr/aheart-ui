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

## Latest retry candidate independent validation

Candidate: `dc8c299cdea619fabd7acf2602437b32e35bf3d7`. The earlier 87/40 results above are historical; this section records fresh affected-boundary validation.

- Maintained unit: **91/91**, ten files (19 virtual + 6 recovery + 4 retry + 62 legacy), independently executed. Log: `/tmp/d4-tree-independent-final-20260910/owner-focus-final/unit-91.log`.
- Independent source diagnostics: **28/28**, including async external focus-then-blur and owner-document capture listener lifecycle/iframe isolation. P0/P1/P2=`0/0/0`.
- Complete five-browser suite: **45/45 passed**, 43.3s, no added skip, from `/tmp/d4-tree-independent-final-20260910/no-build-final/browser-45.log`. The source was frozen and no build ran concurrently during this final pass.
- Build, root typecheck, docs and release pack passed (1003/79/115 files). `check:generated` and deterministic double build passed with no generated drift. Logs: `/tmp/d4-tree-build-owner-focus.log` and `/tmp/d4-tree-determinism-owner-focus.log`.

The repair loop retained two failed browser runs rather than treating reruns as substitutes for diagnosis. First, mobile reorder selected an overscan row that was removed before focus, before any reorder action occurred. Its test precondition now selects a genuinely visible middle row, asserts visibility and actual focus, and retains all original key/ID/geometry/roving assertions. Mobile repeated runs passed 5/5. Second, a run overlapping distribution rebuilding failed Firefox module MIME diagnostics while the preview consumed rebuilding `es` files. Builds were stopped; the preview's index/CSS module responses were confirmed as HTTP 200 JavaScript rather than HTML, then the entire suite passed in isolation. Neither failure was suppressed by changing production code, force, timeout or skip allowances.

The independent product pre-review noted that the E2E artifact named `tree-virtual-lazy-success.png` is captured while retry is still busy, before child assertions. That historical filename does **not** prove a completed state. Success behavior is asserted later in the test; accepted completed-state visual evidence is the freshly opened `retry-final/07-lazy-success.png` in the design report. Correct the diagnostic artifact name in subsequent E2E maintenance.

The functional test substage passes for this candidate. Final combined three-component production/consumer/performance/full-repository and delivery obligations remain open.
