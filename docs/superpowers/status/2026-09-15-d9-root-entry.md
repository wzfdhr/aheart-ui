# D9 root-entry gate status

The root named-import architecture spike is GREEN on the current branch. The original RED retained unrelated component markers; the final real tgz consumer passes with no workspace symlink, root ESM/CJS/types, Vite build and zero unrelated markers. The Form subpath consumer remains green. The D9 CI split is merged in PR #29, with coverage thresholds and five dedicated QG5 browser jobs passing on its exact head.

The 38 static E2E skip sites are now registered in [the skip ledger](../evidence/d9-skip-ledger.json), bound to the real PR tracking URL, checked recursively and validated against the current date by `scripts/qg5-skip-ledger.test.mjs`. R1 state-machine files now have an explicit 14-file branch coverage manifest with an aggregate `86.50%` result and an 80% per-file threshold. A real three-tarball consumer is wired into CI and passes locally with all ESM imports rooted in the copied packages. The Cascader lazy fixture now uses an explicit resolver and the mobile-WebKit regression passes 3/3.

## 2026-09-28 status refresh

The final correction candidate is now merged as PR #31. Remote `master` is `17b3494e4f16972edde3d3d77d058102d6f4ee2c`; its [CI run](https://github.com/wzfdhr/aheart-ui/actions/runs/34924182981) and [documentation deployment](https://github.com/wzfdhr/aheart-ui/actions/runs/34926985041) both completed successfully on that SHA. This closes the previously listed fresh master/Pages automation gate for the D9 correction candidate.

The following exits remain open:

- Physical iOS Safari evidence for DnD, Picker, overlays and Workbench, with human review of genuine device input.
- Ten consecutive successful QG5 master runs on one exact master SHA. As of this refresh, only one CI run is recorded for `17b3494`.
- Final four-role D9 review; existing scoped engineering/test results do not count as independent design and product sign-off.
- npm publication and clean registry installation of `aheart-ui@1.1.0`, `@aheart-ui/dnd@1.0.0` and `@aheart-ui/ai@1.0.0`.

Local reproduction on 2026-09-28 ran `corepack pnpm test:coverage:r1` on candidate `09cf9b64cb9653763aab81d3b96925c62c793701`: all three package suites passed, all 14 R1 files met the 80% threshold, and aggregate branch coverage was `3312/3829 = 86.50%` (minimum file coverage `80.33%`). An earlier same-source measurement was `3311/3828 = 86.49%`; the one-branch denominator difference did not change any threshold result. Machine-readable output: [`v1-local-closeout-r1-coverage-2026-09-28.json`](../evidence/v1-local-closeout-r1-coverage-2026-09-28.json); gzip-compressed original log: [`r1-coverage.log.gz`](../evidence/v1-local-closeout-2026-09-28/logs/r1-coverage.log.gz).

Read-only registry verification on 2026-09-28 found `aheart-ui@1.0.0` published on 2026-09-01; `1.1.0` and both scoped sibling packages were not available in the public registry. No publish, tag or GitHub Release was created. v2 remains paused.
