# D5-C real-package consumer harness (RED)

This fixture is deliberately package-boundary based: install a real `aheart-ui.tgz` into a temporary directory, then run typecheck, CJS/ESM import, CSS import, SSR render, and local-server hydration checks. It never resolves a workspace symlink. `types.ts` covers local/server data modes plus virtual, fixed, and expanded combinations; `estimateSize` is a numeric public field.

Reproduce from the repository root with `corepack pnpm --filter ./packages/components pack --pack-destination /tmp/d5-c-tgz`, then `cd docs/superpowers/experiments/d5-c-consumer && npm install && npm run runner -- --tarball /tmp/d5-c-tgz/aheart-ui-1.0.0.tgz`. The runner copies `types.ts` and `tsconfig.json` into its isolated root, installs the real tgz, runs `tsc`, and records JSON when `--out` is provided.

The performance entry point is `node scripts/d5-table-c-perf.mjs --full-url <10k-full-url> --virtual-url <10k-virtual-url> --baseline-table-file <D5-A-Table-file> --candidate-table-file <D5-C-Table-file> --out <evidence-dir>/perf.json`. Both pages must expose `performance.mark('d5c:mountStart')`, `performance.mark('d5c:interactive')`, and `window.__fixtureReady`; the runner performs at least three paired rounds and gzips the explicitly supplied Table-only files.
