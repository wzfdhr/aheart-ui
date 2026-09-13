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

Finding disposition: P0/P1/P2 = `0/0/0` after GREEN. The previous failed jobs remain visible audit history. A new PR head must rerun both verify jobs and all five-browser jobs; old-head browser success is not used as the final CI release signal.
