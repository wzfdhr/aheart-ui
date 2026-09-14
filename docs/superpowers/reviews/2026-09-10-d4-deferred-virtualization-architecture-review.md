# Deferred D4 virtualization independent architecture review

Baseline: master `4a7511f9594d0a74906e427e158d02343ba33a22`. Scope: Tree, TreeSelect and Cascader deferred virtualization only. Reviewer: independent Astra High read-only review after three component-specific read-only inspections.

## First verdict

P0/P1/P2 = `0/3/3`; not released to RED implementation.

| Severity | Finding | Required closure |
| --- | --- | --- |
| P1 | Focus pin ended at blur and did not preserve a roving Tab entry; TreeSelect could retain a logical but unmounted active ID. | Separate actual-focus, roving-entry and pending-target identities; keep/transfer a mounted single Tab entry; clear active descendants by real focus and mounted ownership. |
| P1 | Cascader search-result virtualization had no complete keyboard or mode-switch focus contract. | Add typed-path active state, pin/mount/focus, disabled skipping, Up/Down/Home/End/Enter/Space/Escape/Tab rules and query/column transition behavior. |
| P1 | TreeSelect delegated height clamping to `useFloatingPosition`, which exposes placement/coordinates but no available-height budget. | Add a private same-realm popup budget, measured chrome subtraction, flex shrink and exactly defined vertical scroll owners for TreeSelect/Cascader. |
| P2 | SSR realm absence conflicted with broad full-DOM fallback, and unsupported data invariants were undefined. | Never capability-fallback during SSR/hydration-first render; check after hydration only; enumerate runtime fallback and preserve duplicate/cycle errors. |
| P2 | The spec incorrectly described overscan as CSS pixels. | Define overscan as logical item count per side; only height estimates use CSS pixels. |
| P2 | Performance/gzip exits lacked a reproducible measurement protocol. | Bind baseline/toolchain/data shapes, timing points, warmups/samples/order, scroll/observer interval and exact emitted gzip set. |

## Remediation and second verdict

The architecture candidate submitted all six requested corrections. The second independent review closed four items and returned P0/P1/P2=`0/1/1`: the persistent roving-entry mechanics passed, but the dialog-controlled active-descendant wording remained invalid; the performance protocol still allowed offsets to collapse into one task.

The candidate now includes the second-round corrections as well:

- one persistent mounted roving entry plus actual-focus and pending-navigation pins, atomic transfer and Tab/Shift+Tab/retry-descendant tests;
- TreeSelect and Cascader virtual triggers omit `aria-activedescendant`; search and navigation transfer real DOM focus only, without claiming an unsupported dialog ownership relation;
- full 10k Cascader search keyboard reachability and search/column transition cancellation;
- a private owner-realm viewport-budget helper and measured short-viewport/200% zoom exits;
- SSR/hydration-first deterministic windows, post-hydration-only capability fallback and preserved duplicate/cycle errors;
- corrected units and a fixed Node/pnpm/Vue/Vite/Chromium, fixture, timing, five-sample, long-task/CLS and gzip protocol;
- every scroll offset now waits for Vue plus two owner-realm animation frames, asserts mounted non-blank content and records per-step timing before the next offset.

## Final verdict

The third independent review verified the two remaining corrections: virtual TreeSelect/Cascader triggers do not emit `aria-activedescendant` and navigation transfers real DOM focus only; every performance scroll offset now flushes Vue, waits two owner-realm animation frames, asserts a non-blank committed window and records per-step timing.

Final architecture P0/P1/P2 = `0/0/0`. The contract is released to Tree genuine RED only. This does not approve GREEN implementation, TreeSelect/Cascader RED, testing, product acceptance, PR, merge or release.
