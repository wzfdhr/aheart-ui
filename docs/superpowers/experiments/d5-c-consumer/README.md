# D5-C real-package consumer harness (RED)

This fixture is deliberately package-boundary based: install a real `aheart-ui.tgz`, then run typecheck, CJS/ESM import, CSS import, SSR render, and local-server hydration checks. The virtual API references in `types.ts` and `app.js` are expected to fail until D5-C publishes the public contract.

The performance entry point is `node scripts/d5-table-c-perf.mjs --url <real-built-consumer-url> --out <evidence-dir>`. It emits measurements only; thresholds are not claimed until a paired full-DOM control run and gzip comparison are captured.
