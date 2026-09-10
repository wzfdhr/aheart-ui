# Tree implementation recovery review

Scope: uncommitted Tree implementation following architecture `3d9c797` and RED `24e19de`. The implementation is not accepted yet.

## Evidence correction

The earlier `/tmp/tree-d4-boundaries.log` reports two Vitest tests running with a jsdom environment. Its source fixture was temporary. It cannot prove real browser geometry, scrolling, painting, or Tab navigation; earlier descriptions of it as a real viewport/browser check are withdrawn. Fresh browser regression tests and a maintained fixture are required before accepting those behaviors.

The original virtual test suite also dispatched synthetic Tab events and manually focused the expected destination. That verifies the presence of a target, but does not prove browser Tab traversal. Real keyboard traversal is part of the browser gate.

## Rejected implementation history

Main-thread source review rejected successive versions even when narrow tests passed:

- A manual array slice ignored TanStack virtual items and omitted total scroll height/row positioning. The non-virtual path combined flattened nodes with recursive rendering, duplicating expanded children.
- Stringified keys collided across number/string identities. Global iframe-presence checks and private Vue synchronous updates were used to satisfy test timing; they were rejected and removed.
- Later versions added TanStack geometry but retained viewport-height inflation, incomplete overscan, cross-realm constructor checks, missing focus cancellation, duplicate root observers, and incomplete observer teardown.
- The missing-observer fallback and test mounting timing were subsequently distinguished. A test that needs a virtual window must provide browser capabilities in its owner realm; a separate test must remove those capabilities and verify the post-mount full-DOM fallback.

Those repairs do not yet establish acceptance. Current independent review and additional regressions must verify inherited disabled state, visual hierarchy, measured heights, stable-key updates, observer cleanup, mounted focus transfer, and supported-browser execution. Implementation green, independent review, design audit, product acceptance, release artifacts and delivery remain separate pending gates.

## Independent development review

Astra High independently reviewed the uncommitted source against `24e19de` and returned P0/P1/P2=`0/6/2`. Six diagnostic tests in `/private/tmp/d4-tree-dev-review-25sPoc/review.test.ts` all failed against that candidate. These are Vue/TanStack/jsdom diagnostics, not browser evidence.

| Severity | Reproduced defect or source finding | Repair gate |
| --- | --- | --- |
| P1 | Expanded disabled parent's virtual child lacked `aria-disabled`; its native checkbox was enabled. | Inherit indexed disabled state for rows and all controls. |
| P1 | Flattened virtual rows lost the group-based visual indentation. | Preserve 20px logical indentation per hierarchy level, with bounded width. |
| P1 | End followed by immediate wheel cancellation still focused the tail row. | Check navigation generation before every focus commit and cancel ongoing alignment. |
| P1 | Controlled collapse of the focused child left focus on BODY. | Distinguish recycling from user focus departure and restore a visible ancestor. |
| P1 | Two selection updates raised active observers from 17 to 49; 32 remained after unmount. | Reuse observer identity and disconnect every replaced/removed observer. |
| P1 | A timer-only realm threw from TanStack's missing `requestAnimationFrame` during End navigation. | Check all primitives required by the dependency before attaching it; safely fall back. |
| P2 | ArrowDown cleared a previously measured offscreen row height from TanStack's cache. | Preserve valid stable-key measurements across unrelated navigation and structure changes. |
| P2 | Consecutive viewport notifications overwrote scheduled handles; cleanup cancelled only the last. | Coalesce scheduling and reject every callback after its observer is disposed. |

The independent test author is preserving regression cases, and the sole implementation worker will repair the candidate after those RED results are recorded. No implementation acceptance has been granted.

## Second independent review

The original six diagnostics now pass, and the original eight findings have been closed for their stated scope. The maintained Tree/TreeSelect suite passed `81/81` (19 new and 62 existing). However, four additional contract checks failed and the independent verdict remains P0/P1/P2=`0/2/2`:

- P1: changing `estimateSize` replaced an already measured 56px row with the new 40px estimate.
- P1: after an explicit `child.blur()` and a flush, a later collapse stole focus back to the parent.
- P2: replacing only an offscreen row's title under the same typed key retained its stale 112px measurement.
- P2: disabling the Tree left 17 active ResizeObservers. The remedy must pause continuous observation and scheduled work while preserving readable, scrollable virtual content; simply rendering no virtual rows or switching to full DOM is not the prescribed behavior.

The independent test author preserved all four RED cases in `tree-virtual-recovery.test.ts`; their initial run was `4 failed / 0 passed` with exit 1. Local log: `/private/tmp/d4-tree-dev-review-25sPoc/tree-virtual-recovery-red.log`.

The first complete browser run on source was `28 passed / 7 failed` over five projects. Browser failures are under independent classification and do not constitute browser acceptance. No implementation, product or delivery approval follows from the 81 passing unit tests.

## Third independent review

The original ten diagnostics passed. Of three checks on the affected boundaries, disabled scrolling retained a bounded, covering virtual window; two checks failed, leaving P0/P1/P2=`0/1/1`:

- P1: a mounted 56px row changed title without changing its DOM height but its virtual size became 28px. A size observer need not fire for unchanged geometry; mounted content changes require an explicit DOM measurement, while only unmounted changes should use the estimate.
- P2: End immediately followed by disabled left one TanStack navigation RAF queued and retained its old index target. Disabling must cancel dependency navigation as well as row/viewport work.

The maintained suite passed `85/85`; full components passed `1258/1258`, root typecheck passed and scripts passed `90/90`. Independent browser run `r11` passed `40/40` across five projects, including whole-tree disabled scrolling and re-enable navigation. These successful runs do not close the two diagnostic failures.

Browser test repairs retained real default Tree behavior: the temporary fixture `tabindex=-1` was removed, Firefox's additional default scroll-root Tab stop was reproduced, and the production virtual root now owns that fix. Dynamic bottom scrolling re-reads the measured total; only an exact Firefox built-in scroll-linked warning is classified separately in a retained attachment. No console error or pageerror is suppressed.

Initial screenshot inspection accepted the desktop hierarchy/disabled/tail states as local observations. The mobile long-title capture was rejected because the documentation header overlapped the fixture and the wrapped title was not fully visible. Fresh final captures and design acceptance remain pending.
