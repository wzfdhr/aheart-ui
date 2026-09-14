# Form.List architecture review

Baseline `19a0bf8`; reviewed draft [Form.List architecture](../specs/2026-09-14-form-list-architecture.md). This gate reviews the contract and compatibility model only. It does not certify implementation, tests, UX, release artifacts or delivery.

## Round 1

Verdict P0/P1/P2=`0/4/1`; implementation gate remained closed.

1. **P1 — reset snapshot gap.** Form captures `initialValues` before a child FormList mounts. A child-only `initialValue` write would therefore disappear on reset instead of being restored.
2. **P1 — observer ordering gap.** A FormList-local watcher cannot guarantee it remaps registrations before Form's synchronous deep watcher invalidates path-indexed state after an external array mutation.
3. **P1 — primitive identity churn.** First-unused `Object.is` matching would replace a stable field key whenever a primitive item is edited, including ordinary text entry.
4. **P1 — nested controller collision.** Moving an outer item must remap the nested FormList coordinator itself; remapping only descendant FormItem state leaves an old-path unregister able to retire the new occupant.
5. **P2 — duplicate list ownership.** Two live FormLists at the same full path had no deterministic ownership or diagnostic contract.

## Repairs applied to the draft

- Added a Form-owned `initializeList` operation that writes both live model and reset snapshot only when the path is undefined.
- Added a synchronous Form-owned list coordinator. Internal operations carry an explicit old-to-new index map; external mutations reconcile before ordinary field invalidation, not in a later child watcher.
- Changed ambiguous primitive and fresh-clone reconciliation to positional identity, while retaining unambiguous object-reference moves and common primitive prefix/suffix insertion/removal.
- Required nested coordinator registrations and owners to move in the same snapshot/write transaction as descendant fields.
- Defined first-owner behavior and development diagnostics for duplicate live list paths.

## Round 2

The repaired draft is internally coherent on public API, model authority, operation bounds, list-root validation, stable item identity, path/error/dependency migration, async staleness, initialization/reset, preserve, external changes, nested lists, SSR/hydration, accessibility ownership, diagnostics and release gates.

Round-2 verdict: P0/P1/P2=`0/0/0`. Architecture is approved for a genuine RED only. Approval does not permit a GREEN claim until failing tests cover the contract, and it does not replace the independent final development, test, screenshot-first design or product gates.
