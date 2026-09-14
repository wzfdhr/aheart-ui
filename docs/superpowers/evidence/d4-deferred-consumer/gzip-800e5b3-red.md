# Actual size RED after selection-focus correctness repair

Candidate: `800e5b3257075e8d86fb80a88b3d2de117c4ea82`; tgz SHA256 `3c7ccad8fc804e44e2317a998890af64021aa3e65f3907d43c7f2b1a530b2dfe`.

Real preflight: `/private/tmp/aheart-d4-selection-final-EXQXce/preflight.json`, passed-ineligible (not full performance acceptance). Five-browser Cascader: 60 passed in 1.7m, no skips/failures; log `/private/tmp/aheart-d4-selection-final-EXQXce/browser.log`.

Deterministic, persisted gzip supplementary report: `/private/tmp/aheart-d4-gzip-strict-800e5b3/gzip-supplement.json`. Both sides build twice with strict CommonJS wrapping and retained component exports. Process exit 1: delta 12,541 bytes exceeds unchanged 12,288-byte limit by 253 bytes. Retain this failure; no size PASS or phase closure.

Next: reduce actual production duplication without removing focus correctness, functionality, diagnostics or weakening the size gate. Any optimization requires affected contract tests and new real package measurements.
