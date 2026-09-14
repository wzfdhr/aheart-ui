# Deterministic gzip measurement after correctness-preserving size repair

Candidate `c608a9bee62b94cbba939941a9d437fcd2e3c8f3`, tgz SHA256 `0981133a62906536bcfcea9c05ffdf966a59ebfe9ddf09706a3962d6cf6d78d3`.

Real preflight: `/private/tmp/aheart-d4-listeners-Nt2N5y/preflight.json` passed-ineligible. It is not full performance acceptance.

Supplement: `/private/tmp/aheart-d4-gzip-strict-c608a9b/gzip-supplement.json`, exit 0, delta 12,261 bytes against unchanged 12,288-byte limit (27 bytes headroom). Both sides retain real JS/CSS and declarations, frozen source-report locks, component exports and two byte-identical builds with fixed CommonJS wrapping. Independent reviewer `/root/d4_final_evidence_audit` reopened first/repeat artifacts, parsed actual exports and confirmed source/tgz association: baseline166,314 bytes, candidate178,575 bytes. The candidate-specific gzip P2 is closed; no broader gate is approved by this result.

Preserved size REDs: 800e5b3=12,541; 241b003=12,440; 2cb6fce=12,297. No threshold was changed. Repairs deduplicate normalization, omit development-only diagnostic construction from production while retaining validation, and share identical listener registration/removal lists. All focus fixes remain.

The latest production diagnostic tests pass 15/15; latest focus lifecycle tests pass 27/27 with typecheck and regenerated outputs. Prior 241b003 three-component browser result was160/160; it is not a substitute for latest final candidate validation. Full performance, latest browser audit, independent roles and PR/master/Pages closure remain open.
