# D4 deferred virtualization final code candidate GREEN

Date: 2026-09-13. Code candidate: `4f6831e956218ff3d95d23507819f974aafdc7b2`. Approved baseline: `4a7511f9594d0a74906e427e158d02343ba33a22`.

This record binds the final Tree, TreeSelect and Cascader code candidate to the complete local consumer, performance, browser and repository gates. It is not PR, merge, master, Pages or npm-publication evidence.

## Artifact identity

- Candidate tarball: 519,463 bytes; SHA-256 `2983aea84a5217b4b401e4d356ef9fade4bf93bcabd81922978ea49d03515ce3`.
- Baseline tarball SHA-256: `b600f47aa5e32f46dda00ac57241a16237308f2d335f9c92603a4efe249bcd0b`.
- Full run ID: `full-1789281807624-533ab6e69ea418`.
- Raw report at capture time: `/private/tmp/aheart-d4-final-code-eg34mr/full-release.json`.
- Raw report: 196,775,326 bytes; SHA-256 `8e8c7c6ff13ef817001fd85b9b684078cb444eca60d0617887431bc9002cac56`.
- Independent reopening command: `node scripts/d4-deferred-consumer.mjs --report /private/tmp/aheart-d4-final-code-eg34mr/full-release.json --require-release` returned `status=passed`, `acceptanceEligible=true`, `failures=[]`.
- Environment: Apple M4, concurrency 1, Node 24.17.0, pnpm 9.15.4, Vue 3.5.38, Vite 5.0.12, Playwright 1.61.1 and TypeScript 5.3.3.
- The earlier `--preflight-full` run returned `passed-ineligible` and is not counted as release evidence.

## Complete matrix

The collector persisted and reopened 714 checkpoints for Tree, TreeSelect and Cascader across 1k/5k/10k data, fixed/coarse/dynamic rows, one discarded warm-up, five measured full/virtual runs in pair-forward-reverse order and 40 scroll positions per measured run.

| 10k case | Full median | Virtual median | Ratio |
| --- | ---: | ---: | ---: |
| Tree fixed | 367.7ms | 77.6ms | 21.10% |
| Tree coarse | 379.5ms | 87.2ms | 22.98% |
| Tree dynamic | 396.0ms | 86.7ms | 21.89% |
| TreeSelect fixed | 792.2ms | 101.5ms | 12.81% |
| TreeSelect coarse | 801.1ms | 106.4ms | 13.28% |
| TreeSelect dynamic | 823.3ms | 106.8ms | 12.97% |
| Cascader fixed | 422.1ms | 167.5ms | 39.68% |
| Cascader coarse | 417.9ms | 177.4ms | 42.45% |
| Cascader dynamic | 431.5ms | 179.9ms | 41.69% |

The maximum candidate virtual median was 179.9ms, below 500ms. Every 10k ratio was below 50%. The largest measured virtual window was 22 rows, below 24.

## Browser, SSR, iframe and package results

- Chromium 149.0.7827.55: 270 observer rounds; max scroll long task 0ms; CLS 0; console/page errors 0/0.
- Firefox 151.0 and WebKit 26.5: 270 observer rounds each; actual `supportedEntryTypes` exclude longtask/layout-shift, so those metrics are explicitly unsupported rather than forged as zero; console/page errors 0/0.
- SSR/hydration: eight boolean virtual-mode combinations, deterministic double server render, public type probe and hydrated actions passed.
- Iframe: Tree, TreeSelect and Cascader used the iframe owner realm; 110 resources were created and zero remained after unmount. ResizeObserver/RAF/timer, Teleport, late lazy update and post-unmount interaction residuals were all zero; focus restoration and popup reopen passed.
- Gzip level 9 over the real consumer bundle and CSS: baseline 22,552 bytes, candidate 22,724 bytes, delta +172 bytes against the 12,288-byte limit.
- Both real tgz packages installed without workspace links or `@fs` imports; ESM, CJS, CSS, declarations, public types, lock integrity and recursive build artifacts passed. Cleanup closed 28 Chromium, 28 Firefox, 28 WebKit, 82 pages and one preview server per side, then removed both temporary consumers.

## Repository gates on the same code candidate

- Components 1,431/1,431; DnD 79/79; AI 200/200; Node scripts 230/230.
- Three-package typecheck passed.
- Deterministic double build, generated-output check, docs production build and release pack passed; pack counts were 1,025 / 79 / 115.
- D4 five-project targeted browser matrix: 160/160, zero skip/failure.
- Complete five-project repository browser matrix: 808 passed, 127 existing platform skips, zero failed, 935 total.
- Static skip sites remained 38 in both approved master and candidate; no skip site was added.
- `git diff --check` passed and the code candidate worktree was clean.

Verdict for the code candidate: **GREEN**. P0/P1/P2 findings from this evidence: `0/0/0`. Review metadata commits after this candidate must not change runtime/package inputs; the eventual PR head still requires an exact-head package/hash attestation and CI.
