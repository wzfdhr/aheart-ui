# D4 independent final test-manager evidence review

Reviewer: `/root/d4_final_test_gate_audit`, independent of implementation. Read-only evidence inspection; no component edits, builds or duplicate test executions. Date: 2026-09-14.

## Binding and verdict

**Automated candidate gates PASS; overall delivery remains conditional, not closed.** Production candidate is `c608a9bee62b94cbba939941a9d437fcd2e3c8f3`. PR run [34809321649](https://github.com/wzfdhr/aheart-ui/actions/runs/34809321649) tests head `a9734e392adb9282346fe1abe41c11c28318dfd4` through GitHub's merge checkout `3e0786d2` against `4a7511f9594d0a74906e427e158d02343ba33a22`. The downloaded log explicitly records both checkout and `AHEART_EVIDENCE_SHA`; it is not a direct-head checkout. `git diff c608a9b a9734e3` contains only two evidence Markdown files, so this is current production evidence, not reuse of the historical implementation candidate.

Raw inspected log: `/private/tmp/aheart-d4-ci-a9734e3-pr.log`.

## Actual logged gates

| Gate | Observed result |
| --- | --- |
| Components unit | 115 files, 1459 passed |
| DnD unit | 5 files, 79 passed |
| AI unit | 10 files, 200 passed |
| Node scripts | 238 passed; 0 failed, cancelled, skipped or todo |
| Typecheck | Components, DnD and AI `vue-tsc --noEmit` completed before Test |
| Determinism/generated | `pnpm check:build-determinism` completed; inspected runner performs two builds, snapshots/comparison, and pre/post generated-output checks |
| Docs | `pnpm docs:build` completed before release validation |
| Release tarballs | Components 1029 files, DnD 79, AI 115 |
| Complete E2E | 808 passed, 127 skipped, 43.4 minutes |
| Five QG5 projects | Desktop/Firefox/desktop WebKit each 12 passed + 1 skipped; mobile/mobile WebKit each 13 passed; total 62 passed + 3 skipped |

The E2E skip total matches the historical 127. A baseline-to-current E2E diff contains no added/removed skip lines. This supports no newly introduced skips; it does not claim existing platform skips disappeared. QG5's three skips are reported explicitly, not called 65 passing tests.

## Real consumer/performance evidence

Inspected `/private/tmp/aheart-d4-listeners-Nt2N5y/full-release.json`: provenance binds the production candidate and tarball `0981133a62906536bcfcea9c05ffdf966a59ebfe9ddf09706a3962d6cf6d78d3`. Complete collector/reopen evidence is recorded in `full-green-c608a9b.md`. Independently counted 270 observer rounds per browser, every round 40 scroll steps and zero runtime errors. Chromium has zero long-task and layout-shift entries: observed maximum 0ms and CLS 0. The 100ms/0.1 numbers are limits, not measurements. Firefox/WebKit lack these metric capabilities; empty arrays do not establish measured zeros for those browsers.

The strict same-candidate gzip supplement is independently reopened in `gzip-c608a9b-green.md`: 12261-byte delta against unchanged 12288-byte limit, 27-byte headroom. That persisted actual-output supplement is authoritative over the full collector's differently bundled 12171-byte figure. No size threshold is relaxed.

## Remaining conditions

- Push run [34809315887](https://github.com/wzfdhr/aheart-ui/actions/runs/34809315887) has now independently been checked as `completed/success`, event `push`, head `a9734e392adb9282346fe1abe41c11c28318dfd4`. Its complete log `/private/tmp/aheart-d4-ci-a9734e3-push.log` records direct checkout of that SHA, 1459/79/200 unit tests, 238 script tests (0 failed), completed typecheck/determinism/generated/docs, pack counts 1029/79/115, full E2E 808 passed + 127 skipped (45.3 minutes), and five QG5 projects totaling 62 passed + 3 skipped. Thus both CI groups pass for a9734e3. Require both exact-head CI groups for the eventual merge head; documentation-only later commits retain production equivalence but do not automatically have exact-head CI approval.
- Fresh independent screenshot-first design and product acceptance are separate, still pending at this report's creation. The old implementer-authored partial audit is not independent sign-off. Its search-selection BODY focus finding needs latest-candidate visual disposition, alongside the full phase visual coverage.
- Replace or clearly supersede the withdrawn historical final report and stale delivery-matrix approvals when all independent roles finish.
- Matching-head squash merge, master CI, Pages and deployed interaction verification remain future delivery gates. No npm/device/D9 approval is implied.

No new P0/P1/P2 code defect was established by this log audit. The previous missing latest-candidate whole-repository automated evidence is resolved by this completed PR run. Remaining visual/product and exact-head delivery conditions prevent an unconditional phase PASS; they must not be silently converted into completed checkboxes.
