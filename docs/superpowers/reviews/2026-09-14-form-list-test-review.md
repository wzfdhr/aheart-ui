# Form.List test-manager review

Production candidate `83afe25cbda347f0ab84562d83997530cdec4565`; baseline `19a0bf88c7701071f2b788845a030751cfd249c3`.

## Verdict

Scoped P0/P1/P2=`0/0/0`. No new skip/fixme was added. Static `test.skip` sites remain 38 and Form.List unit/E2E files contain none. Exact-head remote CI and post-merge delivery are still separate gates.

## Valid GREEN evidence

- Focused Form.List: 2 files / 26 tests passed. Coverage includes exports/install, add/insert/single+multi-remove/move, root-name changes, nested lists, stable keys/DOM/focus, server+synchronous error migration, relative dependencies, list rules, same-turn change/remove, pending validation/submission invalidation, initialValue/model authority, reset identities, preserve, duplicate/missing parent diagnostics, non-array fallback, external assignment/reverse/splice, immediate validation flushing, SSR determinism and hydration.
- Components: 117 files / 1485 tests passed after the final production change.
- DnD: 5 files / 79 tests passed. AI: 10 files / 200 tests passed.
- Workspace `typecheck` passed for components, DnD and AI.
- `check:build-determinism` completed two full components/DnD/AI builds for exact production commit `83afe25`, compared recursive generated SHA snapshots and passed postflight.
- `docs:build` passed. `release:pack` passed with aheart-ui 1043 files, DnD 79 and AI 115. Package entrypoint/config tests passed 16/16.
- `node --test --test-reporter=dot scripts/*.test.mjs` passed all 239 scripts tests after the Form.List cross-browser contract was added.
- Form.List five-project Playwright suite passed 20/20: desktop/mobile Chromium, desktop Firefox, desktop/mobile WebKit. It checks key retention, external reorder, error movement, focus handoff, nested list operations, reset identities, narrow containment, warning/pageerror absence and >=4.5:1 fixture error text.
- Real packed consumer installed a copied tarball with no workspace link; root types/ESM/CJS/CSS, Form-subpath SSR byte determinism, hydration, add/move/error/reset and key renewal passed. Tarball SHA-256 `6b5135a8bc88262f46e2a96b3dd27109f930d87ae0eaafdde3133c57fa96de6c`; Vue baseline gzip 24,868B, Form bundle 56,937B, increment 32,069B <=40KiB; unrelated Table/Cascader/TreeSelect/Upload markers absent.

## Invalid or superseded runs

- The first RED attempt had a test syntax error and is excluded. The corrected production-unchanged RED was 2 files / 9 expected missing-export failures.
- The first browser run failed because docs consumed stale generated output; it is evidence for the packaging boundary only, not a product failure or GREEN.
- A later five-browser run failed 5 cases because the contrast assertion queried a field error after that row was intentionally deleted; the corrected ordering passed 20/20.
- One aggregate `pnpm test` reached components/DnD/AI and 237/238 scripts but failed the stale Playwright allowlist assertion; the updated config contract passed and the entire scripts set was rerun successfully.
- One components run reported 908 passed but 17 ENOSPC worker errors and is invalid. Only explicitly identified rebuildable temp test directories were removed; the final consumer evidence was preserved. The clean rerun passed all 117/1485.

## Limits

Browser emulation is not physical iOS Safari and no npm registry publish occurred. Root-entry named-import tree shaking and the global danger token remain explicit D9/D0-D3 work; the current consumer and fixture do not claim those global gates passed.
