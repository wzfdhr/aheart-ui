# D4 deferred virtualization final test-manager review

Date: 2026-09-13. Final production candidate: `cf2a24c1460187041f622ddd0a01831076f91ab0`. Final browser-test candidate: `3618e16bcdf7bdf3439ae3255529cc934588e4a3`.

## Method and boundary

This final test-manager pass evaluates maintained assertions, real browser behavior, artifact authenticity and release thresholds. It did not modify component production code or relax a test, timeout, skip, matrix, browser, row budget, performance ratio, gzip threshold or cleanup rule. The new Tree containment test is counted transparently as a design-finding regression, not as independent discovery. Earlier component-specific test-manager reports remain separate evidence.

## Results

| Gate | Result |
| --- | --- |
| Components unit | 114 files, 1,432/1,432 passed |
| DnD unit | 5 files, 79/79 passed |
| AI unit | 10 files, 200/200 passed |
| Node contract/scripts | 233/233 passed, 0 skipped/todo after PR CI and type-probe ordering guards |
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

## PR CI portability supplement

The first PR head exposed two local-checkout literals in Cascader CSS geometry tests. Both exact-head verify jobs failed while ten QG5 jobs passed. The next head proved that fix but exposed 36 integration tests sharing a local-only baseline tarball; its five QG5 jobs passed and verify failed 183/36. The preserved REDs, failed first Cascader repair, final Cascader scan and repository-history baseline reconstruction are documented in [the CI portability repair review](2026-09-13-d4-pr-ci-portability-repair.md). Final local results are 1/1 + 19/19 + integration 49/49 and 1,431/79/200/232. This supplement changes no production package behavior; it requires a new exact-head CI run and does not reinterpret failed jobs as passing.

## Performance and browser stability supplement

The exact-head long-task RED and 16-call structural RED are preserved in [the long-task record](../evidence/d4-deferred-consumer/full-longtask-red-7c87cee.md). A first 0.5px repair was rejected by a subpixel RED; the strict-equality repair retained 28.25px updates. The next full run cleared the exact performance round but failed because the durable type probe was delayed until after all browsers; [that RED](../evidence/d4-deferred-consumer/full-type-probe-red-e4047a8.md) led to a shared pre-browser probe and a new ordering guard.

The final production collector passed and independently reopened with 714 checkpoints, max long task 0ms, max median 179.7ms, max rows 22, gzip +172B, SSR 8/8 and iframe residual 0. A subsequent WebKit immediate geometry sample produced 159/1; the unchanged scenario passed 5/5, the stable-state version kept every original condition and passed 10/10 and 160/160. Full repository E2E then passed 808/127/0. Final full totals are 1,432/79/200/233. P0/P1/P2 remain `0/0/0`.
