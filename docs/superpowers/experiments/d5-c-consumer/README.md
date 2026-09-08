# D5-C real-package consumer harness (RED)

This fixture is deliberately package-boundary based: install a real `aheart-ui.tgz` into a temporary directory, then run typecheck, CJS/ESM import, CSS import, SSR render, and local-server hydration checks. It never resolves a workspace symlink. `types.ts` covers local/server data modes plus virtual, fixed, and expanded combinations; `estimatedRowHeight` is a numeric public field.

Reproduce from the repository root with `corepack pnpm --filter ./packages/components pack --pack-destination /tmp/d5-c-tgz`, then `cd docs/superpowers/experiments/d5-c-consumer && npm install && npm run typecheck && npm run runner -- --tarball /tmp/d5-c-tgz/aheart-ui-1.0.0.tgz`. The runner uses its own copied package and records JSON when `--out` is provided.

The performance entry point is `node scripts/d5-table-c-perf.mjs --url <real-built-consumer-url> --out <evidence-dir>`. It emits measurements only; thresholds are not claimed until a paired full-DOM control run and gzip comparison are captured.
