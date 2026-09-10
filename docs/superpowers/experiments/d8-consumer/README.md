# D8 real-package consumer

This fixture is copied into a fresh temporary directory and installs three real
tarballs with npm. The consumer never runs inside the pnpm workspace and fails
if any installed package is a symlink. The AI package is wired to the matching
component and DnD tarballs through local `file:` dependencies so the public
package contract is tested without workspace protocol resolution.

## Red proof

The implementation gate must first run this against a tarball made before the
AI `es/` and `lib/` outputs are rebuilt. The expected failure is explicit:

```sh
node docs/superpowers/experiments/d8-consumer/run.mjs \
  --ai-tarball /path/to/aheart-ui-ai.tgz \
  --components-tarball /path/to/aheart-ui.tgz \
  --dnd-tarball /path/to/aheart-ui-dnd.tgz \
  --out docs/superpowers/evidence/d8/red/consumer
```

The runner records the tarball SHA-256, package file list, Node/npm/pnpm,
symlink status, generated public declarations, ESM/CJS/CSS, SSR determinism,
hydration warnings, Chat lifecycle, Workbench operations/reorder, AIForm
rules/tool projection, and primitive-only bundle isolation. A missing argument
or stale generated entry is a hard RED and is never converted into a skip.

## Gzip gate

`measure-gzip.mjs` accepts two built JavaScript files (or directories) and
reports raw/gzip sizes and the D8 AI delta. The current optimization gate is a
strict 12 KiB gzip delta; a measured delta above it exits non-zero.

```sh
node docs/superpowers/experiments/d8-consumer/measure-gzip.mjs \
  --baseline /path/to/d8-ai-baseline.js \
  --current /path/to/d8-ai-current.js \
  --out docs/superpowers/evidence/d8/consumer/gzip.json
```
