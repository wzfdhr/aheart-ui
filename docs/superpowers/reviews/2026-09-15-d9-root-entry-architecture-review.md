# D9 root-entry architecture review

Candidate source: current `codex/d9-release-quality` branch after master `faf5521b`.

## Genuine RED

The real copied-tgz Vite consumer initially retained `aheart-table`, `aheart-cascader`, `aheart-tree-select` and `aheart-upload` when its source imported only `{ Form, FormItem, FormList }` from `aheart-ui`. The failed runner recorded a 188,072-byte gzip bundle and the unrelated marker list in `/tmp/aheart-root-entry-consumer-*/results.json`.

## Architecture decision

PASS for the root-entry spike. The default plugin is isolated in `src/plugin.ts`; the root module re-exports named components without exporting the plugin's all-component named registry. Component CSS is an explicit package-level side effect (`aheart-ui/style.css`), while generated ESM/CJS module roots are marked `sideEffects: false`. This lets a normal Vite consumer remove unused component modules without changing synchronous component exports or plugin installation.

## GREEN

The final copied-tgz consumer (no workspace symlink) passes typecheck and Vite build with root named imports. Bundle gzip is `50,729` bytes and unrelated Table/Cascader/TreeSelect/Upload markers are absent. The existing Form subpath consumer still passes with gzip increment `32,069` bytes and all SSR/hydration/interaction checks.

## Boundaries

This is one D9 gate only. Coverage, CI split, skip ledger, physical iOS evidence and npm publication remain open and are not inferred from this spike.
