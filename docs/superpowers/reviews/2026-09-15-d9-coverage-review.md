# D9 coverage gate review

Scoped verdict: P0/P1/P2=`0/0/0` for coverage instrumentation and the R1 branch threshold.

- `@vitest/coverage-v8@1.6.1` is pinned in components, DnD and AI.
- Each package uses a V8 coverage config filtered to source files, excludes generated output/tests, emits JSON summaries and enforces branch coverage of at least 80%.
- GREEN branch results: components `88.36%`, DnD `80.37%`, AI `86.22%`.
- The initial command without the existing jsdom environment produced a genuine tooling RED; it was corrected without weakening assertions or lowering thresholds.

This review does not close CI decomposition, skip ledger, physical iOS or npm publication.
