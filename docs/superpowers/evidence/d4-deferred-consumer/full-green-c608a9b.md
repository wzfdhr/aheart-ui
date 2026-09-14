# D4 full real-consumer GREEN — c608a9b

Candidate: `c608a9bee62b94cbba939941a9d437fcd2e3c8f3`.

Raw report: `/private/tmp/aheart-d4-listeners-Nt2N5y/full-release.json`.

Run: `full-1789363044729-eb7b5c3e3b14f8`. The collector completed all 714 checkpoints. Independent reopen command:

```text
node scripts/d4-deferred-consumer.mjs --report /private/tmp/aheart-d4-listeners-Nt2N5y/full-release.json --require-release
status: passed
acceptanceEligible: true
failures: []
```

Measured gates from the reopened report:

- Full 27-case matrix: Tree, TreeSelect and Cascader × 1k/5k/10k × fixed/coarse/dynamic, both full and virtual modes, with warmups and 40 scroll steps.
- Maximum 10k virtual/full median ratio: 43.96% (Cascader coarse), below 50%.
- Maximum 10k virtual first-interaction median: 196ms, below 500ms.
- Maximum mounted virtual rows: 16, below the 24-row budget.
- Chromium's 270 observer rounds recorded no long-task or layout-shift entries: measured maximum long task 0ms and CLS 0. The 100ms and 0.1 values previously listed here were acceptance limits, not measurements. Firefox/WebKit unsupported metrics remain explicitly capability-gated rather than fabricated.
- SSR/hydration: 8/8 combinations recorded and validator-reopened.
- Iframe resources: 105 before, 0 after; post-unmount interactions 0 in the bound report.
- Cleanup: baseline and candidate each Chromium 28, Firefox 28, WebKit 28, page 82, preview server 1; temporary artifacts removed after persistence.
- Gzip in this full report: +12,171B. Separate independently reopened strict-build supplement for the same c608a9b candidate reports +12,261B ≤ 12,288B; the supplement is the authoritative package-size gate because it persists and reopens the actual bundle outputs.

This closes the full real-consumer/performance evidence for the frozen c608a9b candidate. It does not by itself close independent design/product reviews, latest-head remote CI, merge, master CI, Pages or live verification.
