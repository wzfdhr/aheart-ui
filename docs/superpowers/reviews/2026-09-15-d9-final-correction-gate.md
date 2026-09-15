# D9 final correction gate

This report covers the correction candidate after the merged D9 root-entry/CI work. It is a scoped engineering and test gate; it does not claim physical iOS or npm publication acceptance.

## Development and test evidence

- `typecheck`, `release:pack`, generated-output determinism and `git diff --check` pass.
- Script/release suite passes `247/247`.
- R1 coverage runs through the dedicated CI command; 14 explicit state-machine files pass the 80% branch threshold with `3312/3829 = 86.50%` aggregate coverage.
- The isolated three-tarball consumer passes ESM/CJS, types, CSS, plugin installation, deterministic SSR, hydration and AI/DnD interaction with no workspace symlinks.
- Cascader virtual browser coverage passes `60/60` across desktop/mobile Chromium, Firefox and WebKit; the lazy cancellation scenario also passes repeated mobile-WebKit runs.
- The skip ledger registers all 38 current static sites, maps each owner role to the repository maintainer, binds a real PR tracking URL and checks expiry against the execution date.

## Scope review

The source changes add no public component API. The Cascader timing change is test-fixture-only and exposes an internal resolver to the fixture test so Escape cancellation is asserted without a timer race. Package preparation changes only the release version/range: `aheart-ui@1.1.0`, DnD/AI `1.0.0`, and AI's peer range `^1.1.0`.

Scoped P0/P1/P2 result: `0/0/0` for the correction implementation and automated gates. A final independent design/product sign-off remains required before declaring D9 closed.

## Explicit open exits

- Physical iOS Safari evidence for DnD, Picker, overlays and Workbench is unavailable in this run.
- npm publish, login, 2FA and registry consumer verification remain user-operated release steps. Read-only registry checks found the prepared versions unoccupied; no publish was attempted.
