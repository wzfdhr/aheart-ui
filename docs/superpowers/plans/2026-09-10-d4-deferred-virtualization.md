# Deferred D4 virtualization delivery matrix

> 2026-09-14 correction: empty JavaScript invalidated the old +172-byte result and dependent final approval. The corrected c608a9b full report and durable gzip supplement now pass; final whole-repository and four-role gates below remain open until their candidate-bound evidence is accepted. See [original P2](../evidence/d4-deferred-consumer/gzip-empty-entry-red.md).

Baseline: master `4a7511f9594d0a74906e427e158d02343ba33a22`. Branch: `codex/d4-tree-virtualization`. Architecture: [three-component contract](../specs/2026-09-10-d4-deferred-virtualization-architecture.md).

This is the independent follow-up authorized by the persistent optimization goal. It implements the Tree, TreeSelect and Cascader virtualization that D4 previously recorded as deferred. It does not reopen or rewrite the already merged Select delivery.

- [x] Recover current master, D8 closure evidence and deferred D4 boundary.
- [x] Inspect Tree, TreeSelect and Cascader current source, tests, accessibility, lazy loading, iframe and TanStack reuse points.
- [x] Draft public API, native tree semantic model, per-column Cascader model, SSR/realm rules and quantitative exits.
- [x] Independent architecture reviewer cleared two repair rounds (`0/3/3` → `0/1/1` → `0/0/0`) and released Tree RED only.
- [x] Tree genuine RED: existing `44/44` passed; corrected suite `3 passed / 10 failed`; full Tree `47 passed / 10 failed`; public type-included check failed as expected.
- [x] Tree GREEN implementation and functional development/design/test/product reviews: candidate `dc8c299`, independent unit91/91, developer28/28, isolated five-browser45/45, fresh lazy visual supplement and product P0/P1/P2=`0/0/0`. Joint final phase gates below remain open.
- [x] TreeSelect genuine RED, GREEN implementation and functional development/design/test/product reviews: production candidate `ad18e3b`, test-isolation closeout `586dfac`; maintained142/142, public types, TreeSelect50/50, Tree45/45, independent ownership24/24 and13 freshly opened final screenshots. Independent developer, design, test-manager and product verdicts are P0/P1/P2=`0/0/0`. Combined phase gates below remain open.
- [x] Cascader genuine RED, GREEN implementation and functional development/design/test/product reviews: production candidate `7964d86`; maintained135/135, recovery8–13 40/40, five-project Cascader60/60, geometry15/15, TreeSelect50/50 and typecheck passed. Thirteen final screenshots were individually opened; independent development, design, test-manager and product verdicts are P0/P1/P2=`0/0/0`. Combined phase gates below remain open.
- [x] Real tgz consumer, 1k/5k/10k performance, SSR/hydration and iframe evidence: production candidate `c608a9b`, 714 checkpoints, saved-report validator passed. Measured Chromium long task0ms/CLS0; eight hydration combinations; iframe105→0. See [full report evidence](../evidence/d4-deferred-consumer/full-green-c608a9b.md).
- [x] Independently reopened durable gzip double-build for c608a9b: +12,261B <=12,288B; actual component exports and both build artifact sets verified. See [size evidence](../evidence/d4-deferred-consumer/gzip-c608a9b-green.md).
- [x] Final whole-repository automated gates for production c608a9b: both a9734e3 CI groups passed; independent test manager verified unit1459/79/200, scripts238, types/determinism/generated/docs/pack, E2E808 passed/127 existing skips, QG5 62 passed/3 existing skips and no new skip lines. See [independent test report](../reviews/2026-09-14-d4-independent-final-test.md). Any later final merge head still requires its own CI checks.
- [x] Independent development-manager review for production c608a9b: scoped P0/P1/P2=0/0/0. See [development report](../reviews/2026-09-14-d4-independent-final-dev.md).
- [ ] Four final independent role reports with P0/P1/P2=`0/0/0`. Earlier component substages retain their historical reports; withdrawn final reports do not satisfy this gate.
- [ ] Final PR exact-head push/PR CI, squash merge, master CI, Pages and live deployed verification.

Form.List, D0-D3 final review, D9, physical devices, npm publication and aheart-ui v2 remain outside this phase.
