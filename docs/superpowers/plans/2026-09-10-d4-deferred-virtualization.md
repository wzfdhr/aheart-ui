# Deferred D4 virtualization delivery matrix

Baseline: master `4a7511f9594d0a74906e427e158d02343ba33a22`. Branch: `codex/d4-tree-virtualization`. Architecture: [three-component contract](../specs/2026-09-10-d4-deferred-virtualization-architecture.md).

This is the independent follow-up authorized by the persistent optimization goal. It implements the Tree, TreeSelect and Cascader virtualization that D4 previously recorded as deferred. It does not reopen or rewrite the already merged Select delivery.

- [x] Recover current master, D8 closure evidence and deferred D4 boundary.
- [x] Inspect Tree, TreeSelect and Cascader current source, tests, accessibility, lazy loading, iframe and TanStack reuse points.
- [x] Draft public API, native tree semantic model, per-column Cascader model, SSR/realm rules and quantitative exits.
- [x] Independent architecture reviewer cleared two repair rounds (`0/3/3` → `0/1/1` → `0/0/0`) and released Tree RED only.
- [x] Tree genuine RED: existing `44/44` passed; corrected suite `3 passed / 10 failed`; full Tree `47 passed / 10 failed`; public type-included check failed as expected.
- [ ] Tree GREEN implementation, development/design/test/product reviews.
- [ ] TreeSelect genuine RED, GREEN implementation, development/design/test/product reviews.
- [ ] Cascader genuine RED, GREEN implementation, development/design/test/product reviews.
- [ ] Real tgz consumer, 1k/5k/10k performance, gzip, SSR/hydration and iframe evidence.
- [ ] Frozen candidate full repository gates, generated outputs and zero new skips.
- [ ] Four final independent reports with P0/P1/P2=`0/0/0`.
- [ ] Final PR exact-head push/PR CI, squash merge, master CI, Pages and live deployed verification.

Form.List, D0-D3 final review, D9, physical devices, npm publication and aheart-ui v2 remain outside this phase.
