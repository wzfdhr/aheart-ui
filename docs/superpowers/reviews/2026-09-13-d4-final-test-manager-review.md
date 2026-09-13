# D4 deferred virtualization final test-manager review

Date: 2026-09-13. Tested runtime code candidate: `4f6831e956218ff3d95d23507819f974aafdc7b2`.

## Method and boundary

This final test-manager pass evaluates maintained assertions, real browser behavior, artifact authenticity and release thresholds. It did not modify component production code or relax a test, timeout, skip, matrix, browser, row budget, performance ratio, gzip threshold or cleanup rule. The new Tree containment test is counted transparently as a design-finding regression, not as independent discovery. Earlier component-specific test-manager reports remain separate evidence.

## Results

| Gate | Result |
| --- | --- |
| Components unit | 114 files, 1,431/1,431 passed |
| DnD unit | 5 files, 79/79 passed |
| AI unit | 10 files, 200/200 passed |
| Node contract/scripts | 230/230 passed, 0 skipped/todo |
| Typecheck | components, DnD and AI passed |
| Determinism/generated/docs/pack | passed; package counts 1,025 / 79 / 115 |
| D4 targeted five-project browser | 160/160 passed, 0 skipped/failed |
| Complete five-project browser | 808 passed, 127 existing platform skips, 0 failed |
| Skip audit | 38 static sites on baseline and candidate; delta 0 |
| Real tgz release collector | 714 checkpoints; validator `passed`, `acceptanceEligible=true`, no failures |

The complete browser run exercised desktop/mobile Chromium, desktop Firefox, desktop/mobile WebKit and all D0-D8 existing specs. D4 coverage includes default compatibility, 1k/10k row bounds, full scroll endpoints, typed identity, controlled rejection, lazy retry, focus restore, collapse/delete/reorder/disable, five Cascader columns, large text, mobile containment, iframe and console/pageerror collection.

The release collector installed real baseline/candidate tarballs into isolated non-workspace consumers; reopened ESM/CJS/CSS/types/build/lock artifacts; rendered and hydrated eight SSR combinations; ran all 27 performance cases for both sides; retained 270 observer rounds per browser; and verified iframe resource cleanup. The exact measurements and hashes are in [the final code evidence](../evidence/d4-deferred-consumer/final-code-green-4f6831e.md).

## Finding disposition

- P0: 0.
- P1: 0.
- P2: 0.
- The first `--preflight-full` execution was correctly `acceptanceEligible=false`; it was not counted. Only the later full report and independent reopening validator support this verdict.
- Mobile WebKit is not physical iOS Safari; that device gate remains D9.

Test-manager verdict: **PASS** for the combined D4 code candidate. PR-head CI and post-merge main/Pages/live checks remain distinct delivery gates.
