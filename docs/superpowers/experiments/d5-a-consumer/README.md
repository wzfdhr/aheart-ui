# D5-A real consumer

This fixture is installed from a packed `aheart-ui` tarball into a fresh npm
project. It intentionally has no workspace links or source aliases. The
consumer runner type-checks the public Table/Pagination types, renders both
`local` and `server` Table modes through CJS/ESM SSR, and hydrates the same
production Vite output in a Playwright browser.

Run from the repository root:

```bash
node scripts/d5-table-pagination-consumer.mjs \
  --tarball /absolute/path/aheart-ui.tgz \
  --out /absolute/path/d5-consumer-results
```

The output directory contains the install and `npm ci` logs, both lock-file
copies, the ESM import log, and `results.json`.
