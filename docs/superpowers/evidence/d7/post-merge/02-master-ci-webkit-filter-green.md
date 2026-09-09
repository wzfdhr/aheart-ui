# D7 post-merge master CI repair GREEN: WebKit filter geometry

Date: 2026-09-09

## Repair

The post-merge master run `34329397392` exposed a real viewport-state failure in
`openFilter(page, demo, 1)`: the page could be vertically scrolled away from the
table before the helper established the horizontal fixed-column geometry. The
helper now calls `scrollIntoViewIfNeeded()` for the requested trigger before
setting the table container's `scrollLeft`. The existing geometry boundary,
`elementFromPoint` hit-test, timeout, popup, and pageerror/console-error
assertions are unchanged. The deterministic scroll-to-bottom RED precondition is
retained in the test.

No product source was changed. No timeout was extended, no `force` or `skip` was
introduced, and no assertion was removed or weakened.

## Verification

Exact desktop WebKit regression command (isolated port `5314`):

```sh
AHEART_E2E_PORT=5314 corepack pnpm exec playwright test e2e/d5-table-b.spec.ts --project=desktop-webkit --grep="D5-B filter draft confirm, reset, cancel, keyboard, outside, and controlled rejection" --repeat-each=5
```

Result: **5 passed, 0 failed** in 12.2 seconds.

Five-project affected test command (isolated port `5315`):

```sh
AHEART_E2E_PORT=5315 corepack pnpm exec playwright test e2e/d5-table-b.spec.ts --project=desktop --project=mobile --project=desktop-firefox --project=desktop-webkit --project=mobile-webkit --grep="D5-B filter draft confirm, reset, cancel, keyboard, outside, and controlled rejection"
```

Result: **5 passed, 0 failed** in 13.1 seconds. The existing test listener
reported no page errors or console errors.

`git diff --check`: passed.
