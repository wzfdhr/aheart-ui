# D5-C real-package evidence

Candidate package: `/tmp/d5-c-tgz.7di3E7/aheart-ui-1.0.0.tgz` (SHA-256 recorded in `consumer/tarball.sha256`). The isolated consumer passed typecheck, ESM/CJS imports, CSS, SSR, hydration, and six scenarios: local, server, virtual, fixed, expanded, fixed-expanded. `consumer/consumer.json` is the durable result.

The five-round same-document performance run is recorded in `perf/perf.json` and `perf/perf.log`. Virtual median was 35 ms versus full DOM 375.5 ms (9.3%), 11 logical rows, exactly two spacers, CLS 0, and gzip delta 12,196 bytes (under 12,288). The gate failed because full-DOM output had no `aria-rowcount` (null in all five rounds) and full-DOM long tasks reached 341 ms, exceeding 100 ms. Virtual performance itself passed its latency, window, spacer, CLS, and long-task thresholds.

Severity: P1 for the failed required accessibility/long-task gates; no P0 observed. This evidence intentionally remains failed and does not relax thresholds.
