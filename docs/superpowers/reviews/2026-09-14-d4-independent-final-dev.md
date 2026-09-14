# D4 independent final development-manager review

Date: 2026-09-14. Reviewer: independent agent `/root/d4_final_evidence_audit`.

## Candidate and independence

Production candidate: `c608a9bee62b94cbba939941a9d437fcd2e3c8f3`; baseline: `4a7511f9594d0a74906e427e158d02343ba33a22`. At final inspection HEAD was `ad95912a4c92b2c4b4b0715908262f6871a9e71f`: its difference from the production candidate contains only two evidence Markdown files. No production changes were introduced after the reviewed candidate.

This reviewer did not implement production code, tests, collectors, or repairs. Review work was read-only until authoring this report. Findings were returned to the implementation agent, which performed repairs and RED/GREEN execution. This report does not inherit the independence claim of the earlier September 13 report.

## Reviewed scope

- Tree measurement suppression and subpixel preservation; virtual row lifecycle and owner-realm positioning changes.
- TreeSelect delegation, controlled state, search focus bridge, lazy cancellation, SSR initial window and popup viewport ownership.
- Cascader per-column virtualization, typed path identity, active/pending row retention, controlled refusal, lazy generation/abort handling, focus retry ownership, selection-close focus return and teardown.
- Private normalization deduplication: component defaults, numeric checks, cross-realm plain records, immutable results, getter access paths, exact development diagnostics and production-only diagnostic elimination. Public root exports were not expanded; inspected generated declarations did not expose a Vite client dependency.
- Gzip collector authenticity, export retention, emitted-JS export validation, durable artifact binding, dependency-lock association, numerical recomputation and deterministic strict CommonJS supplement.

The final source diff was checked against these previously reviewed repairs. This is a targeted development review across the above areas, not a claim that every line of the large baseline diff received exhaustive verification.

## Findings and disposition

| Finding raised during independent review | Final disposition |
| --- | --- |
| Gzip entry was tree-shaken to one newline; reported +172 bytes measured CSS only | Closed. Strict entry preservation and actual export checks replace the invalid evidence; the old number is not accepted. |
| Nonempty dummy JS could pass report validation | Closed. Raw JS export parsing requires all three named component exports. |
| Embedded gzip bytes lacked independently reopened output binding | Closed for this candidate by the durable supplement: exact file sets, manifest hashes, embedded byte equality and first/repeat output validation. |
| Supplement used a fresh unfrozen dependency graph and omitted numeric checks | Closed. Original locks are hash-bound/frozen; reopened bytes recompute sizes, hashes, gzip totals, delta and unchanged limit. |
| Superseded Cascader focus retry RAF was not cancelled with its originating scheduler | Closed. Cancellation captures owner realm, scheduler kind and handle; retry callback ownership and generation guards remain intact. |
| Single selection closed the panel without returning keyboard focus | Closed. Selection-close ownership is consumed on actual accepted close, rather than assumed from an emitted request. |
| One-tick restoration missed delayed controlled acceptance and could steal focus after external focus/blur | Closed. Pending ownership tracks actual closure and is cancelled on intervening focus/navigation. |
| Direct blur of the still-connected source did not revoke ownership | Closed. Source focusout while still open cancels the pending return; exact listener identities are removed. |
| Correctness repairs exceeded the 12KB gzip increment limit | Closed for the exact candidate package below. Private normalization/diagnostic and listener-registration deduplication retain validation and focus behavior. Limit was not increased. |

The final listener tuple refactor preserves registration/removal order, callbacks, owner document and capture mode. No remaining concrete P0/P1/P2 was identified within the reviewed scope.

## Independently inspected evidence

- Full report: `/private/tmp/aheart-d4-listeners-Nt2N5y/full-release.json`. Reopened at final review: SHA256 `27a96f80924ee98ee88cb58db14b35312d926a25913ff06d6a90552d2bb99be6`; candidate commit matches; 714 checkpoints; `acceptanceEligible=true`; recorded validator status `passed`. This inspection verifies report identity and recorded result, not an independently rerun browser matrix.
- Candidate tgz SHA256: `0981133a62906536bcfcea9c05ffdf966a59ebfe9ddf09706a3962d6cf6d78d3`.
- Independently reopened and verified gzip supplement: `/private/tmp/aheart-d4-gzip-strict-c608a9b/gzip-supplement.json`. Source association: `/private/tmp/aheart-d4-listeners-Nt2N5y/preflight.json`, SHA256 `151df670eb6eda082c9a5f741f8ac7a05d9cf87e5124857da635be872e1d155e`. Recomputed candidate tarball hash matches the full report candidate.
- Baseline/candidate first and repeat artifacts were reopened. Both actual JS entries export `Tree`, `TreeSelect`, `Cascader`; strict CommonJS mode is recorded. Gzip totals: baseline 166,314 bytes; candidate 178,575 bytes; increment **12,261 / 12,288 bytes**, leaving **27 bytes**. This is an exact-candidate pass, not reserve capacity for future changes.

The full report and strict gzip supplement are distinct evidence. The supplement's preflight source does not itself establish full performance acceptance, and its strict-mode output is not represented as byte-identical to the collector's default CommonJS build. Both bind the same candidate package. Earlier +172-byte and differing automatic-CommonJS results are superseded for the size gate.

## Verdict and limitations

**Development-manager PASS for the reviewed production candidate; open scoped P0/P1/P2 = 0/0/0.**

No tests, browser sessions or builds were executed by this reviewer during final closure; earlier independent work reopened artifacts and ran their read-only verifiers. Implementation-agent test counts are not relabelled as independently executed tests. This report is not design, test-manager or product approval. It does not approve merge absent the other required roles and exact latest-head CI. PR merge, master CI, Pages and online interaction verification remain separate delivery gates; remote CI was not polled by this reviewer. No npm publication, physical-device acceptance or later optimization phase is implied.
