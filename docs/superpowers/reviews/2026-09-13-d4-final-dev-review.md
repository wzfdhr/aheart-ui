# D4 deferred virtualization final development-manager review

Date: 2026-09-13. Final production candidate: `cf2a24c1460187041f622ddd0a01831076f91ab0`. Browser-test closeout: `3618e16bcdf7bdf3439ae3255529cc934588e4a3`. Baseline: master `4a7511f9594d0a74906e427e158d02343ba33a22`.

## Scope and review independence

This is the read-only combined development review for Tree, TreeSelect and Cascader virtualization plus the shared owner-realm positioning lifecycle. The reviewer did not implement the component production code. The only current-turn code-adjacent change before this review was a browser regression assertion for the already repaired Tree fixture containment. Component substages retain their separate implementation, test, design and product reports; this review rechecks their integration rather than replacing them.

## Architecture and code review

- Public APIs remain opt-in `boolean | config`, default false, with positive height/estimateSize and non-negative overscan normalization. No TanStack instance, threshold auto-enable or scroll-to API is exposed.
- Tree keeps native tree/treeitem semantics and its indexed visible-node/check/lazy model. Virtual rows retain logical level/position/set-size, typed key tokens, roving focus, focused-row pinning and dynamic measurement.
- TreeSelect delegates row virtualization to Tree and keeps search/trigger/popup ownership distinct. Search focus transfer, accepted/rejected controlled open/value state, popup budget and lazy retry lifecycle do not create a second data model.
- Cascader virtualizes each real column independently. Typed full paths remain authoritative; cached item keys and `indexByKey` remove per-scroll O(n) key scans while preserving active, pending and focused rows.
- Measurement, ResizeObserver, RAF, scroll listeners and popup viewport reads derive from the actual element `ownerDocument.defaultView`. The shared floating-position wrapper owns and cancels its ResizeObserver reobserve frame; logical close stops Select positioning before leave motion.
- Unsupported owner-realm runtime capabilities fall back safely without changing default full-DOM behavior. SSR uses a deterministic initial window and starts measurement after hydration.
- The implementation does not reopen D5-D8, Form.List, D0-D3 final audit, D9 device/release work or aheart-ui v2.

## Failure history retained

The branch preserves genuine RED history for public types, virtual row lifecycle, focus deletion/collapse, lazy retry, TreeSelect ownership, Cascader typed paths/dynamic rows/stale reveal, iframe resources, consumer authenticity, checkpoint scalability, comparable scroll geometry and Cascader O(n) lookup performance. The final repair chain did not delete failing evidence or weaken thresholds.

The final code evidence is [bound here](../evidence/d4-deferred-consumer/final-code-green-4f6831e.md): 714 real consumer checkpoints, exact tarball/report hashes, all 10k ratios below 50%, max median 179.9ms, max mounted rows 22, gzip delta 172 bytes, SSR 8/8, owner-realm iframe cleanup and full-repository gates. Complete E2E is 808 passed / 127 existing platform skips / 0 failed. Static skip sites are unchanged at 38.

## Findings

- P0: 0.
- P1: 0.
- P2: 0.
- Non-blocking boundary: physical iOS Safari and npm publication remain D9 and are not represented by mobile WebKit.

Development-manager verdict: **PASS** for the combined D4 runtime candidate. This releases final delivery preparation; it does not approve merge without exact PR-head CI, squash merge, master CI, Pages and live verification.

## Post-PR performance repair review

The final-head collector later rejected a real 126ms Chromium long task in Tree/10k/fixed virtual scroll. The production repair adds one internal `resizeMeasuredItem`: it suppresses only an update whose measured height is exactly the size already stored by the virtualizer. The corrected RED proved 16 redundant 28px writes; a follow-up RED proved that a 28.25px subpixel change must still call `resizeItem`. Strict comparison satisfies both without an accumulating tolerance. Public API, DOM, CSS, key identity, focus, SSR and fallback paths are unchanged.

Affected GREEN: Tree virtual units 56/56, full components 1,432/1,432, D4 five-project 160/160, full E2E 808/127/0, generated output and all release gates. The final 714-checkpoint collector has max long task 0ms, including the exact prior failing round; see [final production GREEN](../evidence/d4-deferred-consumer/full-green-cf2a24c.md). Development finding disposition remains P0/P1/P2=`0/0/0`.
