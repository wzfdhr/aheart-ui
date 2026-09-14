# D4 deferred virtualization final production GREEN

Date: 2026-09-13. Production candidate: `cf2a24c1460187041f622ddd0a01831076f91ab0`. Browser-test stability closeout: `3618e16bcdf7bdf3439ae3255529cc934588e4a3`. Approved baseline: `4a7511f9594d0a74906e427e158d02343ba33a22`.

## Identity

- Candidate tarball: 519,528 bytes; SHA-256 `5db33d68665ab738dc15733c18752e82d725bfa5d7ec7f7f29f4dc79fc54d665`.
- Approved baseline tarball SHA-256: `b600f47aa5e32f46dda00ac57241a16237308f2d335f9c92603a4efe249bcd0b`.
- Full run ID: `full-1789298623958-359eed8ef2ea2`.
- Raw report at capture time: `/private/tmp/aheart-d4-tree-final-green-0YsKWX/full-release.json`.
- Raw report: 196,806,822 bytes; SHA-256 `6dfbf6697ab15017476a33b06ccfc515f5f3db08be3a8ba5a7d54e3e502d576c`.
- Independent reopening validator returned `status=passed`, `acceptanceEligible=true`, `failures=[]`.
- Environment: Apple M4, concurrency 1, Node 24.17.0, pnpm 9.15.4, Vue 3.5.38, Vite 5.0.12, Playwright 1.61.1 and TypeScript 5.3.3.

## Performance and size

| 10k case | Full median | Virtual median | Ratio |
| --- | ---: | ---: | ---: |
| Tree fixed | 415.3ms | 93.7ms | 22.56% |
| Tree coarse | 411.4ms | 91.3ms | 22.19% |
| Tree dynamic | 416.7ms | 79.2ms | 19.01% |
| TreeSelect fixed | 818.8ms | 111.3ms | 13.59% |
| TreeSelect coarse | 785.7ms | 109.5ms | 13.94% |
| TreeSelect dynamic | 854.0ms | 105.2ms | 12.32% |
| Cascader fixed | 429.2ms | 164.9ms | 38.42% |
| Cascader coarse | 439.8ms | 173.6ms | 39.47% |
| Cascader dynamic | 458.0ms | 179.7ms | 39.24% |

- 714 checkpoints; all 27 cases; one discarded warm-up plus five full/virtual measurements; 40 forward/reverse scroll samples per measured run.
- Maximum virtual median 179.7ms / 500ms; all 10k ratios at most 39.47% / 50%; maximum mounted virtual rows 22 / 24.
- Chromium: 270 observer rounds, maximum long task 0ms, CLS 0, console/page errors 0/0. The exact formerly failing Tree/10k/fixed virtual round 1 recorded 83.7ms first interaction, no long tasks and 45.1ms maximum scroll step.
- Firefox 151.0 and WebKit 26.5: 270 rounds each, capability-derived unsupported longtask/layout-shift status, console/page errors 0/0.
- Consumer gzip baseline/candidate: 22,552 / 22,724 bytes; delta +172 / 12,288 bytes.

## Semantics, artifacts and repository gates

- SSR/hydration 8/8 with deterministic double render, durable public type probe and post-hydration actions.
- Iframe owner realm: 105 resources created, zero after unmount; observer/RAF/timer/Teleport/late-lazy/post-unmount residuals all zero.
- Real isolated tgz install, ESM/CJS/CSS/declarations, lock integrity, recursive build artifacts and cleanup passed.
- Full unit/scripts: components 1,432; DnD 79; AI 200; Node scripts 233; zero skipped/todo.
- Typecheck, deterministic double build, generated-output check, docs build and release pack passed; pack counts 1,025 / 79 / 115.
- D4 five-project browser matrix 160/160, zero skip/failure.
- Full repository browser matrix 808 passed / 127 existing platform skips / 0 failed, 935 total.
- WebKit dynamic geometry RED was 159/1 due to an immediate pre-settle sample. The same unmodified test repeated 5/5 green, then the stable-state poll preserved all five original geometry conditions and passed 10/10 plus final 160/160.

Verdict: **GREEN, P0/P1/P2 = 0/0/0** for the production and affected-test candidates. Review metadata after this record must leave all runtime/package inputs unchanged; the final PR head requires an exact-head report/manifest and CI before merge.
