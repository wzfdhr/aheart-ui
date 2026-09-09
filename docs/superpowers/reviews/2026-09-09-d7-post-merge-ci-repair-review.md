# D7 post-merge CI repair independent test-manager review

Date: 2026-09-09

## Scope and baseline

This review covers the repair diff on `codex/d7-master-ci-repair` against the
merged D7 baseline `cf2776f301f055fb4a02486e434d30dc2183c7fc` (PR #22).
The authoritative post-merge failure was master CI run
[34329397392](https://github.com/wzfdhr/aheart-ui/actions/runs/34329397392):
the desktop WebKit D5-B filter test timed out in `openFilter(page, demo, 1)`
while the page was vertically scrolled away from the table.

## Line-by-line review

The repair has two test-only changes in `e2e/d5-table-b.spec.ts`:

1. In `openFilter`, the requested second trigger is made vertically visible
   with `scrollIntoViewIfNeeded()` before the existing horizontal
   `scrollLeft = scrollWidth` setup. The existing fixed-column boundary,
   `elementFromPoint` hit test, geometry assertions, poll timeout, click, and
   popup assertions are unchanged.
2. The main D5-B filter test intentionally scrolls to the document bottom
   immediately before `openFilter(page, demo, 1)`, preserving a deterministic
   regression precondition for the master-CI viewport drift.

No production source, public API, timeout, `force`, `skip`, retry policy, or
assertion was changed. The diff does not weaken coverage or hide a product
failure; it makes the test helper establish the page state required by its
existing geometry assertion.

## RED evidence

The preserved RED record is
`docs/superpowers/evidence/d7/post-merge/01-master-ci-webkit-filter-red.md`.
Without the visibility repair, the deterministic scroll-to-bottom precondition
failed 1/1 and 3/3 repeated desktop-WebKit runs at the existing 5-second
geometry poll. This matches the post-merge master failure and is a real,
repeatable helper-state defect.

## Independent GREEN verification

Command, run on an exclusive port:

```sh
AHEART_E2E_PORT=5324 corepack pnpm exec playwright test e2e/d5-table-b.spec.ts \
  --project=desktop --project=mobile --project=desktop-firefox \
  --project=desktop-webkit --project=mobile-webkit
```

Result: **40 passed, 0 failed** in 35.3 seconds. All five configured browser
projects completed the complete D5-B spec, including the deterministic
scroll-drift regression path. No page or console errors were reported by the
spec listeners.

`git diff --check`: passed.

## Gate decision

| Gate | Result |
| --- | --- |
| Scope limited to test helper/page-state precondition | PASS |
| Real RED retained and reproducible | PASS |
| No timeout expansion, force, skip, or assertion weakening | PASS |
| Complete five-browser D5-B spec | PASS (40/40) |
| P0 | 0 |
| P1 | 0 |
| P2 | 0 |

**Independent test-manager decision: PASS. The repair PR is approved for the
next review/CI stage.** This approval is limited to the repair diff and does
not substitute for the required repair-PR CI, post-merge master CI, Pages, or
live verification gates.
