# D4 gzip evidence correction

2026-09-14: final evidence audit reopened the b1a8d49 report at `/private/tmp/aheart-d4-exact-node24-c81GQg/full-release.json`. Both baseline and candidate JavaScript assets contain only one newline (1 raw byte). The previously reported +172 bytes measures CSS changes, not the required component JavaScript plus CSS. Earlier gzip PASS claims are superseded; the combined release acceptance gate is OPEN.

Independent read-only reviewer `/root/d4_final_evidence_audit` confirmed P2 against frozen `5452caf`, at `collect.mjs:327`. Vite application-mode tree-shaking removed the export-only entry. Its scoped Tree measurement inspection found no additional concrete production issue; this is not a four-role final approval.

RED: the new `consumer gzip bundle preserves component entry exports` test failed before the repair. GREEN: 93 contract tests passed after strict entry signature preservation, Rollup output export assertions for Tree/TreeSelect/Cascader, and empty-JavaScript rejection. These are harness results, not a corrected package-size measurement.

Required next evidence: rebuild both real consumer bundles with identical corrected settings; inspect retained exports and recomputed gzip delta, then regenerate affected release evidence and independent reviews. No merge is authorized by the old report. Reopening the old report against the edited collector also correctly fails its collector-source hash binding; retain the historical report without rewriting it.
