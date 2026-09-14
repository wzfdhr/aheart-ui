# Form.List development-manager review

Production candidate: `83afe25cbda347f0ab84562d83997530cdec4565`; baseline `19a0bf88c7701071f2b788845a030751cfd249c3`. Scope is the approved Form.List contract only.

## Verdict

Scoped P0/P1/P2=`0/0/0`. The implementation is technically acceptable for the remaining test, design, product and delivery gates. This report does not authorize merge by itself.

## Reviewed implementation

- `AFormList`/`FormList` exports and plugin registration, typed slot fields and operations.
- Relative FormItem/dependency and nested FormList name resolution without changing top-level string-literal semantics.
- Form-owned list coordinator, owner-qualified registrations, atomic state remap, list initialization/reset snapshots and preserve behavior.
- Stable item tokens across add/insert/remove/move, retained object reference reorders and unambiguous external insert/remove; positional semantics for ambiguous primitive/fresh-clone updates.
- Async validation/submission invalidation, synchronous/server error migration, old notification snapshot transfer and focus restore through `ownerDocument` without stealing a newly acquired focus target.
- External in-place `reverse`/`splice` coalescing: structural states are reconciled once from the final array rather than from transient duplicate setter states; immediate validate/reset/server-error APIs force the pending reconciliation first.
- SSR-safe ids, deterministic first render, hydration, diagnostics and generated ESM/CJS declarations.

## Repair history examined

1. The genuine RED was 2 files / 9 failures with no production FormList export.
2. Initial GREEN exposed focus loss when keyed DOM moved; Form now restores the still-connected active element only when focus fell to the owner document body.
3. Path-derived message variables caused a lifecycle re-registration to erase migrated synchronous errors; a one-flush owner marker now suppresses only that duplicate invalidation.
4. Same-turn input plus move lost change validation because the migration overwrote the old notification snapshot; the old snapshot now follows the owner.
5. Direct `reverse()` exposed `[c,b,c]` to the synchronous watcher and retired an endpoint key. Structural external mutations now coalesce to a microtask, while ordinary field-value changes keep the existing synchronous path.
6. The real root-import consumer retained unrelated components. This was not hidden: the Form-only gate uses the published `es/form/index.js` subpath and rejects Table/Cascader/TreeSelect/Upload markers; root-entry by-demand import remains an explicit D9 item.
7. A genuine root `name` prop change initially reused the old list's tokens. The final candidate distinguishes a parent coordinator relocation (controller already moved) from a new list path, and assigns fresh identity only for the latter.

## Evidence considered

- Form.List unit/SSR/hydration: 26/26.
- Full components: 117 files / 1485 tests; DnD 79; AI 200.
- Full typecheck, deterministic two-build gate, generated-output postflight, docs build and release pack passed.
- Five-browser Form.List suite: 20/20 with zero console warning/error and zero `pageerror`.
- Real tarball SHA-256 `6b5135a8bc88262f46e2a96b3dd27109f930d87ae0eaafdde3133c57fa96de6c`; no workspace symlink; root ESM/CJS/types/CSS plus Form-subpath SSR/hydration/interaction passed. Vue-only gzip 24,868B; Form bundle 56,937B; increment 32,069B <= 40KiB.

## Boundaries

The global danger token's existing low text contrast and root-entry by-demand tree shaking are recorded for D0-D3 and D9 respectively. The Form.List fixture locally provides an accessible error token and does not claim the global issue is fixed. Physical iOS, npm publication, D0-D3 final review, D9 and v2 are not closed here.
