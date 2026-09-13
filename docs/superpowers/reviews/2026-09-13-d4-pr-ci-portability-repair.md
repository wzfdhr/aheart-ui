# D4 PR CI portability repair review

Date: 2026-09-13. PR: [#25](https://github.com/wzfdhr/aheart-ui/pull/25). Failed head: `aba66542507ad178403f12147ca211c6903bec53`.

## Genuine remote RED

Both exact-head `verify` jobs failed in the component unit step while all ten QG5 five-browser jobs passed. The two failed assertions were otherwise-green Cascader CSS geometry tests:

- [pull_request verify](https://github.com/wzfdhr/aheart-ui/actions/runs/34745980665/job/103693890703): components 1,429 passed / 2 failed.
- [push verify](https://github.com/wzfdhr/aheart-ui/actions/runs/34745981568/job/103693892510): the same portability defect.

Both tests called `readFileSync('/Users/start/.codex/worktrees/091b/aheart-ui/packages/components/src/cascader/style.css')`. GitHub's Ubuntu checkout correctly returned `ENOENT`. This was a P1 test-portability defect; local success did not override the remote RED.

## RED/GREEN repair

1. A new Node contract test scans every Cascader `*.test.ts` source and rejects developer-home, GitHub runner and Windows user checkout literals. Its genuine local RED listed exactly `cascader-virtual-recovery.test.ts` and `cascader-virtual-recovery2.test.ts`.
2. The first attempted `new URL('../style.css', import.meta.url)` repair remained RED because Vitest/Vite exposes a non-`file:` module URL in jsdom; `readFileSync` rejected it with `ERR_INVALID_URL_SCHEME`. This failed attempt was not treated as GREEN.
3. The final repair resolves `src/cascader/style.css` from the package test process using `node:path.resolve(process.cwd(), ...)`. It is independent of username, checkout root and operating system while retaining the original computed-style assertions.

## Local GREEN after repair

- Portability scan: 1/1 passed.
- The two original files: 19/19 passed.
- Full components: 1,431/1,431 passed.
- DnD: 79/79; AI: 200/200.
- Node scripts: 231/231, 0 skipped/todo; this includes the new portability guard and all real consumer/failure-injection contracts.
- Three-package typecheck passed.
- Search across packages/e2e/scripts found no remaining literal for the rejected local checkout.
- No component production, generated package, CSS, docs fixture or browser test behavior changed in this repair.

## Second remote RED and repository-owned baseline repair

The next head `94c1ce94251e49dc964a3e4feee5ef4368d5606d` proved the Cascader repair in CI, but its [push verify](https://github.com/wzfdhr/aheart-ui/actions/runs/34748216113/job/103699938608) exposed a wider pre-existing dependency: 36 real integration tests read the approved baseline from `/private/tmp/aheart-d4-baseline-evidence-F5VN6u/...`. That file happened to exist locally but not on GitHub. CI reported 183 scripts passed / 36 failed; all five QG5 browser jobs passed. This was classified as a second P1, not retried or skipped.

The repair keeps the approved baseline commit and hash unchanged. `d4-deferred-consumer.integration.test.mjs` now creates one test-run fixture by:

1. archiving the exact approved commit `4a7511f9594d0a74906e427e158d02343ba33a22` from repository history;
2. packing its tracked `packages/components` output with the pinned workspace package manager;
3. requiring SHA-256 `b600f47aa5e32f46dda00ac57241a16237308f2d335f9c92603a4efe249bcd0b` before any real collector test may use it;
4. removing the shared temporary baseline fixture after the file's tests finish.

The verify checkout uses `fetch-depth: 0` so the approved baseline commit exists in CI. QG5 checkout behavior is unchanged; this is not the deferred D9 CI split. A new contract test rejects external baseline temp paths, requires `git archive`, and requires full history for verify. Its genuine local RED rejected the old source. Final targeted GREEN is guard 1/1 plus the complete integration file 49/49, zero skip. The full Node script count is now 232.

Finding disposition: P0/P1/P2 = `0/0/0` after both GREEN repairs. All failed jobs remain visible audit history. A new PR head must rerun verify and all five-browser jobs; old-head browser success is not used as the final CI release signal.

## Third remote RED: cross-platform tar container bytes

Final head `4c881658c9719be2c805020e3096973d62352a2f` produced ten successful QG5 jobs but both verify jobs rejected the freshly reconstructed baseline. The same approved commit packed to raw SHA `b600f47a…cd0b` on macOS and `8cc595fd…c80` on Linux. The package contained 995 files in both cases; the difference is the platform-specific tar/gzip container encoding, so raw compressed bytes cannot serve as a cross-platform reconstruction invariant.

- [push verify](https://github.com/wzfdhr/aheart-ui/actions/runs/34757756582/job/103724994164)
- [pull_request verify](https://github.com/wzfdhr/aheart-ui/actions/runs/34757757840/job/103724997768)

The repair does not replace the approved release baseline or accept either platform hash by fiat. Integration tests still archive exact commit `4a7511f`, pack a real local tgz, bind that run's raw tgz SHA in the manifest and let the collector reopen it. They additionally unpack the tgz and hash a deterministic, path-sorted ledger of all 995 file paths, types, byte counts and per-file SHA-256 values. The approved content fingerprint is `eb1bf948660e16caf96109b9b77a181f3c1acaec63283ab91ffec47088778dbc`.

The first content-ledger implementation was rejected locally because `localeCompare` made order locale-dependent (`48c2f25c…` instead of the pinned ledger). A new RED guard forbids locale ordering; explicit code-point comparison produced the pinned fingerprint and the complete integration suite passed 49/49. External full release runs continue to use and require the original `b600f47a…cd0b` artifact. A fresh two-group CI run is still required.
