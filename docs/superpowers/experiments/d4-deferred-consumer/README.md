# D4 deferred Tree / TreeSelect / Cascader packed consumer

This harness owns the combined release contract for the three deferred D4
virtualization surfaces. It is deliberately separate from the older Select
consumer in `scripts/d4-select-virtual-consumer.mjs`.

The contract is implemented in
[`scripts/d4-deferred-consumer-contract.mjs`](../../../scripts/d4-deferred-consumer-contract.mjs).
It freezes the architecture matrix: 1k/5k/10k data, fixed/coarse/dynamic
rows, one discarded warm-up plus five measured full/virtual runs in alternating
order, and 20 forward plus 20 reverse scroll steps. Raw interaction samples,
scroll stabilization evidence, gzip file bytes and SSR/browser/package
manifests are recomputed before a full report can pass.

## Bounded smoke

Run this after a clean component build when only package/resource intake is
needed:

```sh
node scripts/d4-deferred-consumer.mjs --smoke \
  --out docs/superpowers/evidence/d4-deferred-consumer/smoke.json
```

The runner packs the current component package when no candidate tarball is
provided, uses the preserved baseline tarball when available (or accepts an
explicit `--baseline-tarball`), and checks the real tarball SHA-256, required
ESM/CJS/CSS/declaration files, exports, symlinks, workspace links and Vite
`@fs` imports. It uses a temporary directory and removes it in `finally`.
`smoke` reports always contain `acceptanceEligible: false`; smoke has no
performance, browser, SSR/hydration, iframe or gzip release result and cannot
pass the release gate.

## Full report validation

The full Playwright/consumer run is intentionally supplied as a raw report
input so a missing browser run cannot be silently replaced with fixture data:

```sh
node scripts/d4-deferred-consumer.mjs \
  --report /path/to/full-raw-report.json --require-release
```

`--require-release` requires `acceptanceEligible:true` and rejects smoke
reports. A valid full report must pin Node 24.17.0, pnpm 9.15.4, Vue 3.5.38,
Vite 5.0.12, Playwright 1.61.1 and TypeScript 5.3.3. Chromium must record
long-task/layout-shift observers; Firefox/WebKit must explicitly record those
metrics as unsupported rather than inventing zeroes. Every installed package
must be a clean real tarball with no symlink, workspace protocol or `@fs`
artifact. The gzip section uses Node `gzipSync(..., { level: 9 })` over every
listed emitted JS/CSS file and stores raw/gzip bytes and hashes for each file.

The contract tests are pure Node tests:

```sh
node --test scripts/d4-deferred-consumer.test.mjs
```

