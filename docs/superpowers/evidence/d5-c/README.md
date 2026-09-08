# D5-C real-package evidence

Candidate package: `/tmp/d5-c-tgz.7di3E7/aheart-ui-1.0.0.tgz` (SHA-256 recorded in `consumer/tarball.sha256`). The isolated consumer passed typecheck, ESM/CJS imports, CSS, SSR, hydration, and six scenarios: local, server, virtual, fixed, expanded, fixed-expanded. `consumer/consumer.json` is the durable result.

The initial invalid-gate run is preserved as `perf/perf-initial-invalid-gate.json`. The corrected five-round production-build/static-preview run is recorded in `perf/perf.json` and `perf/perf.log`: virtual median `24.7 ms` versus full DOM `278.2 ms`, 11 logical rows, exactly two spacers, virtual aria-rowcount 10000, and gzip delta 12,196 bytes. The corrected gate fails only CLS: virtual scroll CLS reached `0.3531` (threshold `0.1`). Full DOM is gated only on 10,000 rows/no spacer; its aria may be null. Long-task gating is limited to the post-ready virtual scroll interval.

Severity: P1 for the failed virtual-scroll CLS gate; no P0 observed. This evidence intentionally remains failed and does not relax thresholds.
