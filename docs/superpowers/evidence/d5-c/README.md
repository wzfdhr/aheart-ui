# D5-C real-package evidence

Candidate package: `/tmp/d5-c-tgz.7di3E7/aheart-ui-1.0.0.tgz` (SHA-256 recorded in `consumer/tarball.sha256`). The isolated consumer passed typecheck, ESM/CJS imports, CSS, SSR, hydration, and six scenarios: local, server, virtual, fixed, expanded, fixed-expanded. `consumer/consumer.json` is the durable result.

The initial invalid-gate run is preserved as `perf/perf-initial-invalid-gate.json`. The corrected five-round production-build/static-preview run is recorded in `perf/perf.json` and `perf/perf.log`: virtual median `24.7 ms` versus full DOM `278.2 ms`, 11 logical rows, exactly two spacers, virtual aria-rowcount 10000, and gzip delta 12,196 bytes. The corrected gate fails only CLS: virtual scroll CLS reached `0.3531` (threshold `0.1`). Full DOM is gated only on 10,000 rows/no spacer; its aria may be null. Long-task gating is limited to the post-ready virtual scroll interval.

The pre-fix result was P1 for virtual-scroll CLS; no P0 observed. It remains preserved as historical evidence and thresholds were not relaxed.

After the production spacer visibility/overflow-anchor fix, the refreshed candidate tgz SHA-256 is `f34e8f622234de7966cfee7a9cd38e19bc441d6c122d06dcf6d3cd564bed4624`. Five alternating trusted-scroll rounds now pass: full median `263.4 ms`, virtual median `26.2 ms`, virtual max CLS `0.0014698361`, max virtual longtask `0 ms`, 10,000 aria rows, 11 rendered virtual rows, and exactly two spacers. The pre-fix result remains in `perf/perf-history-before-production-fix.json`.

Final style/CSS candidate rerun uses tgz SHA-256 `d3c09faf4a32160063e9d07c5235d7e0bc63d2552ac30495ae4c50bab52cf46b`: full median `263.4 ms`, virtual median `26.3 ms`, virtual max CLS `0.0014698361`, max virtual longtask `0 ms`, 10,000 aria rows, 11 rendered virtual rows, and exactly two spacers; all current harness checks pass. The old `gzip.deltaBytes` in `perf.json` is single-table historical instrumentation only; final package gzip acceptance is defined by the separate package-compare evidence.
