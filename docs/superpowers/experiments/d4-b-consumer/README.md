# D4 B isolated consumer

This is a headless TanStack feasibility experiment, **not** a virtualized Aheart component. The packaged Aheart Select is a one-option coexistence/import smoke check. The custom 10k list owns its own keyboard and ARIA adaptation. No core dependency, public prop or default has changed.

Run in a new temporary directory, never install these evaluation dependencies into the workspace. From the A candidate checkout (code commit `829531b`, fingerprint `8317f0a95c7fdc565b67ca96858f14c0a160125894b662167af0a3b6d1f8402f`), use:

```sh
trial_dir=$(mktemp -d /tmp/aheart-d4-b-reproduce.XXXXXX)
cp docs/superpowers/experiments/d4-b-consumer/* "$trial_dir/"
corepack pnpm --dir packages/components pack --pack-destination "$trial_dir"
cd "$trial_dir"
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install chromium
node engine-size.mjs
node measure.mjs
```

Node v24.17.0 and pnpm 9.15.4 produced the original run. `package-lock.json` fixes the consumer graph; no workspace symlink is used. If the packed tarball differs, npm lock integrity must fail rather than silently accept different contents. Rebuild only the identified source candidate before packing if needed; do not rewrite the lock to bypass a discrepancy.

`measure.mjs` builds baseline, unused import, runtime-disabled engine and virtualized custom-list applications, all including the same Vue version and full Aheart CSS. The baseline has less UI, so its delta **includes fixture UI/adapter code**, not just the engine. Runtime disabled is a build-cost probe only: TanStack `enabled:false` does not supply a non-virtual fallback list, and that page is not a functional Aheart contract.

`engine-size.mjs` separately produces an ESM adapter entry with Vue external, no Aheart or CSS; its exported `useVirtualizer` and `defaultRangeExtractor` are retained. This export surface is not every possible engine API or a guaranteed future per-component cost. Raw/gzip/Brotli are bytes, each emitted chunk compressed independently with Node defaults. No source maps.

Browser checks cover Chromium production hydration, fixed/dynamic SSR windows, ArrowDown disabled skipping and active DOM existence, Home/End visibility, and ResizeObserver-driven 48→80px row changes. CJS import plus CJS SSR is also checked. Timings include Playwright overhead, navigation includes local HTTP, and CDP heap samples are not forced-GC/leak measurements. These single-run records do not establish a speedup or memory benefit.

Not covered: real Select/Tree/TreeSelect/Cascader integration, cold/hot popup performance, filtering/reorder, PageUp/PageDown/hover, initial selected tail, scroll anchoring under mid-list edits, full accessibility, Firefox/WebKit/mobile/iframe, statistical latency or long-task attribution. Those remain integration gates if the user approves core adoption. Do not compare these production custom-list records numerically to the earlier development-mode component benchmark.
