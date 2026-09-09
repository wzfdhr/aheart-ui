# D7 post-merge master CI repair RED: WebKit filter geometry

Date: 2026-09-09

## Failure being reproduced

The first master CI run after D7 PR #22 was squash-merged at `cf2776f301f055fb4a02486e434d30dc2183c7fc` failed in `desktop-webkit` for:

`D5-B filter draft confirm, reset, cancel, keyboard, outside, and controlled rejection`

The authoritative run is [master CI run 34329397392](https://github.com/wzfdhr/aheart-ui/actions/runs/34329397392). Its failure timed out in `openFilter(page, demo, 1)` at the existing geometry poll (`e2e/d5-table-b.spec.ts:37`), after the page had drifted down to the Theme Tokens section and the second filter trigger was outside the viewport.

## Deterministic RED setup

The test now adds one precondition immediately before the second-filter call:

```ts
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
popup = await openFilter(page, demo, 1)
```

This deliberately reproduces the post-navigation vertical scroll state. The helper and its timeout, hit-test, geometry assertions, and popup assertions are unchanged. No `force`, `skip`, or assertion weakening was used.

## Exact reproduction

Command (isolated port):

```sh
AHEART_E2E_PORT=5312 corepack pnpm exec playwright test e2e/d5-table-b.spec.ts --project=desktop-webkit --grep="D5-B filter draft confirm, reset, cancel, keyboard, outside, and controlled rejection"
```

Result: **1 failed**, at `openFilter` line 37, with `expect.poll` timing out after 5000 ms (`Expected: true`, `Received: false`). The failure produced the local screenshot, video, trace, and error context under:

`test-results/d5-table-b-D5-B-filter-dra-eb0e9-de-and-controlled-rejection-desktop-webkit/`

Repeat command:

```sh
AHEART_E2E_PORT=5313 corepack pnpm exec playwright test e2e/d5-table-b.spec.ts --project=desktop-webkit --grep="D5-B filter draft confirm, reset, cancel, keyboard, outside, and controlled rejection" --repeat-each=3
```

Result: **3 failed / 3 runs**, all at the same geometry poll in `openFilter` line 37. Repeat artifacts are under the corresponding `test-results/...-repeat1` and `...-repeat2` directories.

The original master-run screenshot remains available at:

`/tmp/aheart-d7-master-ci-evidence.NJwaGt/test-results/d5-table-b-D5-B-filter-dra-eb0e9-de-and-controlled-rejection-desktop-webkit/test-failed-1.png`

## RED conclusion

The failure is real and repeatable: when the page is vertically scrolled away from the table, the existing helper never establishes the required `elementFromPoint`/container geometry for trigger index 1. The next repair must make the trigger visible before horizontal geometry setup; this RED phase intentionally does not include that fix.

`git diff --check`: passed.
