# D4 full collector late type-probe RED

Date: 2026-09-13. Candidate: `e4047a8edf6ba6fd250017a8a30d2843a637afb9`. Candidate tarball: 519,534 bytes; SHA-256 `9f10fbaae80470b224d5034d6dcfdc633732b0875c793e363d16c76d4b0daba4`.

The post-long-task production repair completed all 714 performance/browser checkpoints. The exact previously failing `Tree/10000/fixed`, virtual measured round 1 recorded first interaction 89.6ms, no long-task entries, maximum scroll-step elapsed 43.7ms and no step over 100ms.

The run did not qualify as GREEN because the candidate public type probe was deferred until after the complete browser matrix. At that late point the isolated consumer's `node_modules/typescript/bin/tsc` could not load `../lib/tsc.js`; the collector raised `MODULE_NOT_FOUND`. The temporary consumer was removed by its normal failure cleanup, so no final validating report was produced. The install-stage `pnpm exec tsc --noEmit` had already passed against the same isolated consumer, showing that the package/type surface was initially valid but the durable probe depended on a long-lived temporary compiler installation.

This failure is kept separate from the real 126ms performance RED. It does not convert the 714 raw checkpoints into release evidence.

Repair contract:

- create and persist the candidate public type probe immediately after isolated install/SSR/build and before opening any benchmark browser;
- reuse that same durable probe record for both preflight and full collection;
- do not reinstall dependencies or synthesize a passing type result after the browser run;
- keep final artifact reopening and type-probe hash validation unchanged.

A structural guard initially failed because both preflight and full paths still called `durableTypeProbe` after browser work. After the repair it passed, and the complete real integration suite passed 49/49 with zero skip. Final full release collection remains required on the frozen candidate.
