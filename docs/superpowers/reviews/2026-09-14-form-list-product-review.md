# Form.List product acceptance

Candidate `83afe25cbda347f0ab84562d83997530cdec4565`; architecture, RED, source, docs, generated types, test results, packed consumer and screenshot-first design evidence reviewed as one frozen feature scope.

## Verdict

Product P0/P1/P2=`0/0/0`. The test-manager gate is now final and Form.List is acceptable to proceed to exact-head PR/CI delivery. This is not yet merge, master, Pages or deployed acceptance.

## User tasks accepted

- Add at end or a valid insertion index; invalid/non-array inputs remain safe and diagnosed in development.
- Remove one or multiple unique indices and move a row without changing surviving logical keys.
- Keep focused keyed content and synchronous/server errors with the same logical item; do not steal a focus target chosen by the consumer.
- Add/remove nested phone entries with relative field paths and move the nested controller with its parent row.
- Revalidate relative dependencies and list-level rules once per logical operation.
- Ignore stale field validation and whole-form submission results after list identity changes.
- Let the model win over `initialValue`, restore the accepted initial snapshot on reset with fresh identities, and honor preserve on unmount.
- Give a genuinely new root `name` path fresh identities while preserving nested identities when the parent coordinator relocates the same logical list.
- Reconcile parent-owned array replacement, object reorder and in-place reverse/splice without guessing business identity for ambiguous primitives/clones.
- Render deterministic SSR, hydrate without mismatch, install through root aliases and operate from a real packed Form-only consumer.

## Product boundaries

FormList is intentionally renderless: applications own row semantics, confirmation prompts and removal focus destination. The docs fixture demonstrates an accessible choice but no new focus API is exposed. Root-entry tree shaking remains D9, the global danger token remains D0-D3, and physical-device/npm/v2 work is not implied by this acceptance.
