# D4 C Select virtual consumer

This experiment validates the packaged Aheart `Select` as a real production consumer, using its supported ES component path. The same `sharedApp.js` factory, data and renderer are used for `virtual: false` and `virtual: true`; it does not implement a custom list. The runner measures 1k/5k/10k options across three rounds per fixed/dynamic scenario. Cold is the first popup open on a fresh mounted page; hot is a reopen, excluding the 120ms close animation. Search and 20-key timings include Playwright and two rendering frames; they are not pure render CPU time. Long-task entries are assigned by startTime to operation markers. CDP heap is not forced-GC and does not establish a leak or retained-memory saving.

Run from the repository checkout after producing the current package tarball:

```sh
corepack pnpm --dir packages/components pack --pack-destination /tmp/aheart-d4-c-current
node scripts/d4-select-virtual-consumer.mjs \
  --new-tarball /tmp/aheart-d4-c-current/aheart-ui-1.0.0.tgz \
  --old-tarball /tmp/aheart-d4-virtual-consumer.T7xOU8/aheart-ui-1.0.0.tgz \
  --out /tmp/aheart-d4-c-results.json
```

The runner creates an isolated realpath temporary cwd, copies the tarball as `aheart-ui.tgz`, installs fixed Vue 3.5.38, Vite 5.0.12, Playwright 1.61.1 and the file tarball, then uses `npm ci` against the generated lock. It never installs evaluation dependencies into the workspace. Temporary directories, locks, HTML and build outputs are preserved for diagnosis and reproduction; their paths and lock/tarball hashes are recorded. Install Chromium once with `corepack pnpm exec playwright install chromium` if needed. Use `--counts 1000 --rounds 1` for a smoke run; that does not replace the default 36-scenario run.

The JSON report includes production minified JS raw/gzip/Brotli and CSS sizes for default-false, virtual-true, and a Button-only entry that must not retain any TanStack module. Vue is included in each app; these are consumer deltas, not a pure engine-size claim. The old tarball is build-only, not a runtime speed comparison. SSR checks include CJS require/render and actual ESM browser hydration for both modes, both fixed and dynamic content with an initial selected tail. Hydration pages carry explicit server/client settings; ordinary measurement pages use createApp with no SSR markup. Any runtime/hydration error fails the run.

The real multi-browser/iframe acceptance gate is separate and remains with the main D4 integration run.

For the final empty-state-corrected candidate, pass `--new-lockfile docs/superpowers/evidence/d4-c/consumer/final-new-lock.json` and `--old-lockfile docs/superpowers/evidence/d4-c/consumer/old-lock.json`; npm then runs only clean install against those locks. The earlier `new-lock.json` belongs to the initial candidate and remains as history. The preserved old tarball is `docs/superpowers/evidence/d4-c/consumer/baseline.tgz` (A candidate `829531b`). The new tarball must be repacked from the reviewed generated outputs and match the new lock integrity. `--include=dev` is explicit because Vite sets NODE_ENV=production in its process and the subsequent old-package probe still needs its evaluation tools. This does not install those tools in the core package.
