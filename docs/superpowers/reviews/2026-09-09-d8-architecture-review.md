# D8 AI architecture review

Baseline: master `ff243fffc2a3c8e7d7d1b169e77d7c3914cf0f1e`. Scope: the eight D8 AI items only.

## Initial findings

Independent read-only review found blocking architecture gaps before implementation:

- V1 stream events had no version, request identity, sequence, revision or authoritative final message.
- `AIChatPanel` treated natural EOF as success and did not invalidate work on unmount or conversation/transport change.
- desktop and mobile Workbench branches mounted separate ChatPanel instances.
- task actions were notifications without transaction identity, result state or idempotency.
- task reordering had no dependency graph, stale revision or lock-reason contract.
- AIForm reused the core components but exposed only required validation and no complete Form API.
- tool messages had no safe structured summary projection.

These findings were classified as architecture P0/P1 and prevented RED assignment until a single contract was written.

The first independent contract pass reported P0/P1/P2=`0/6/2`: incomplete sequence/revision checkpoint rules, inconsistent recovery triggers and budgets, missing operation revision sources, unknown-result/success conflict gaps, a hidden-field compatibility regression, underspecified Form rule semantics, an unbounded replay-conflict promise, and no owner for async-validator cancellation.

After those corrections, the second pass reported `0/3/0`: a low-revision checkpoint could still cross a gap, V2 checkpoints omitted the new safe `toolCall` field, and a successful approval did not yet lock the opposite action. The final contract forbids low-revision checkpoint mutation/termination/cursor movement, projects and clears `toolCall` through its own whitelist, and locks all task actions for the confirmed task revision until parent authority advances.

## Contract under review

The candidate contract is [D8 AI architecture contract](../specs/2026-09-09-d8-ai-architecture.md). It preserves V1, adds an explicit V2 transport and one pure reducer, freezes request/sequence/revision/final/reconnect rules, defines epoch-based lifecycle invalidation, makes Workbench instances singular across responsive layouts, adds an authoritative action handler with idempotency, centralizes reorder validation, compiles serializable AIForm rules into core Form, and creates a whitelist-only tool display model.

## Final disposition

Independent final re-review verified the contract at SHA-256 `c90e20527f561a4d86d180a4e99499f633e33fb69c73826ff7b7604ff34512e5` and reported P0/P1/P2=`0/0/0`.

**Architecture decision: PASS. D8 is released to the RED test stage only.** This does not approve implementation, design, independent test, product acceptance, PR, merge, deployment, or publication.
