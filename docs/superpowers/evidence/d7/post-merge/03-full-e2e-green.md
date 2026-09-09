# D7 post-merge full E2E gate

- Run timestamp (UTC): 2026-09-09T09:43:36Z
- Base checkout: `cf2776f301f055fb4a02486e434d30dc2183c7fc` (merge commit for PR #22), with the reviewed post-merge repair diff applied in the working tree. The repair commit SHA is recorded after candidate freeze rather than being guessed here.
- Command: `CI=1 AHEART_E2E_PORT=5326 corepack pnpm exec playwright test`
- Execution shape: Playwright single worker, 750 tests
- Result: **623 passed, 127 skipped, 0 failed**
- Duration: **18.0 minutes**
- Skip delta: no new skips observed; the 127 skips match the existing repository applicability skips.
- Master CI regression: the previously failing `desktop-webkit` D5-B filter draft/confirm/reset/cancel/keyboard/outside/controlled-rejection test passed in this full run.
- `git diff --check`: passed.

The run completed with exit code 0. The Playwright `test-results/` output was retained in the checkout for inspection; no failed test artifacts were produced by this run.
