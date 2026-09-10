# D8 Chat Stream RED evidence

Date: 2026-09-09
Scope: V1 compatibility, V2 envelope/reducer, reconnect recovery, ChatPanel lifecycle invalidation, controlled authority, and owner-document clipboard.

## Command

```text
corepack pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/d8-chat-stream.test.ts --environment jsdom
```

## Result

The revised test file ran as 15 tests: 1 passed and 14 failed. Exit code was 1.

The first RED failures are intentional public-surface failures: `@aheart-ui/ai` does not yet export `createAIStreamReducer` or `reduceAIStreamEvent`. The reducer tests therefore stop at the explicit API assertion instead of silently testing a local substitute. The lifecycle tests also demonstrate the baseline gaps: the existing ChatPanel sends a V1-shaped request to a V2 transport, does not abort on conversation or transport replacement, emits an optimistic controlled candidate, and does not use the iframe owner document clipboard. V2 stream fixtures now derive `requestId` and `messageId` from the request received by `send`/`resume`, so a correct implementation is not rejected by a fixed test identity. The iframe test checks clipboard in the frame realm separately from owner-document and same-realm focus assertions.

Representative failures:

```text
expected 'undefined' to be 'function'
  at loadReducer (src/__tests__/d8-chat-stream.test.ts:50:44)

expected { conversationId: undefined, ... } to match object
  { version: '2', idempotencyKey: Any<String>, requestId: Any<String>, messageId: Any<String> }

expected false to be true
  conversation/transport replacement did not abort the active transport

expected ...update:messages... to have a length of 1 but got 2
  controlled stream output was presented optimistically

expected "spy" to be called with arguments: [ '来自 iframe' ]
Received: Number of calls: 0
```

No `skip`, `only`, timeout increase, or conditional bypass was added. The file is deliberately RED until the D8 public reducer and ChatPanel lifecycle contract are implemented.

## Helper correction and follow-up GREEN

After the D8 implementation became available, the test helper was corrected so a returned historical `result` is read before the reducer's live `getState()`. This preserves assertions about a prior terminal-no-op or protocol result when a later dispatch has already changed the reducer. No production file or assertion was weakened.

```text
corepack pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/d8-chat-stream.test.ts --environment jsdom
✓ src/__tests__/d8-chat-stream.test.ts (15 tests)
Test Files  1 passed (1)
Tests       15 passed (15)
```

## Expanded RED: accepted candidates, recovery and epoch invariants

The test file was then expanded for the remaining stream contract and run against the current implementation:

```text
corepack pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/d8-chat-stream.test.ts --environment jsdom
Test Files  1 failed (1)
Tests      13 failed | 16 passed (29)
Exit code 1
```

The failures are real implementation gaps, including:

- uncontrolled V2 delta/final visibility and completion, controlled candidate emission/acceptance, and `stream-status`;
- fresh output identity plus `targetMessageId` for edit/retry/regenerate and resume identity reuse;
- lower/higher revision cursor rules, buffered-sequence conflicts, terminal fingerprints, checkpoint field clearing/status projection, checkpoint buffer draining, unknown/empty envelopes, and terminal error recovery;
- EOF/throw/gap recovery without a resume budget, protocol-error resume suppression, `retryable: false` retry hiding, and final-before-suspended-iterator settlement;
- resolved-conversation equivalence, owner-realm abort, and old-epoch invalidation.

No timeout, `skip`, or `only` was added. These tests intentionally remain RED until the corresponding D8 behavior is implemented.

## Latest rerun after implementation progress

The controlled-candidate count assertion was migrated from an exact legacy count to “at least one accepted candidate plus the final candidate,” while retaining the parent-rejection DOM and announcement assertions. The checkpoint-drain fixture now gives the buffered event the same revision as its authoritative checkpoint, so it specifically tests same-revision draining.

```text
corepack pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/d8-chat-stream.test.ts --environment jsdom
Test Files  1 failed (1)
Tests       1 failed | 28 passed (29)
Exit code 1
```

The remaining failure is a real controlled-authority leak: after the parent rejects the first candidate, the `AI 回复：第一段` announcement still exposes the rejected stream content. The other expanded stream/reducer/lifecycle assertions, including checkpoint draining, passed this rerun.

## Precise counterexamples: revision barriers, recovery publication and pending epochs

Additional counterexamples were added for future/old revision buffers, final/error revival, error publication after no-resume and exhausted-resume paths, immediate gap-overflow resume, and immediate sending release while an old iterator remains pending.

```text
corepack pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/d8-chat-stream.test.ts --environment jsdom
Test Files  1 failed (1)
Tests       5 failed | 31 passed (36)
Exit code 1
```

The five remaining REDs are concrete current defects:

- a future revision buffer is appended as `CURRENTFUTURE`;
- a buffered delta is drained after `final`, reviving the completed stream;
- V2 EOF without resume leaves the published assistant candidate streaming instead of publishing error;
- a gap overflow does not invoke `resume` before the source iterator reaches EOF;
- a resolved conversation change does not immediately release the sending lock, so a new request cannot start while the old iterator is pending.

## Third-round precise counterexamples

Added the exact newer-checkpoint barrier sequence, no-resume EOF/throw publication at a larger retry budget, retry affordance after recovery exhaustion, and V1 old-conversation rejection after a newer conversation completes.

```text
corepack pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/d8-chat-stream.test.ts --environment jsdom
Test Files  1 failed (1)
Tests       3 failed | 37 passed (40)
Exit code 1
```

The current REDs are:

- `snapshot(seq1, rev2, A) -> buffer(seq3, rev1, OLD) -> seq2 rev2 B` produces `ABOLD` instead of `AB`;
- no-resume EOF with `maxReconnectAttempts=3` still emits `reconnecting` and does not publish the error candidate;
- recovery exhaustion does not expose the `请重试` retry affordance or allow the next retry.

The V1 conversation replacement counterexample passes: a late rejection from A does not add an update or overwrite completed NEW from B.

## Retry affordance fixture correction and latest rerun

The recovery-exhaustion retry test now mounts the panel uncontrolled (the prior `messages: []` made it a parent-authoritative rejection case and could not validly require a visible retry button). The protocol-error and no-resume budget assertions remain unchanged.

```text
corepack pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/d8-chat-stream.test.ts --environment jsdom
Test Files  1 failed (1)
Tests       1 failed | 39 passed (40)
Exit code 1
```

The remaining RED is the real `retryable: false` boundary: the server error is marked non-retryable, but the UI still renders a `[data-action="retry"]` button. No-resume budget-3 error publication, protocol-error resume suppression, the corrected retryable recovery test, and the V1 epoch counterexample pass.

## Fourth-round stream counterexamples

Added the exact no-resume `maxReconnectAttempts=3` delta-then-throw case and tightened the V1 epoch case to prove the request order is A then B, B actually completes with NEW, and only then does the old A iterator reject.

```text
corepack pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/d8-chat-stream.test.ts --environment jsdom
Test Files  1 failed (1)
Tests       1 failed | 40 passed (41)
Exit code 1
```

The V1 epoch counterexample passes. The remaining RED is the real recovery defect: after a delta then throw with no resume, the panel emits `reconnecting` instead of immediately publishing and emitting the retryable terminal error.

## Fifth-round stream P2 counterexamples

The V1 test now waits for an explicit A-iterator-start barrier, then proves the complete sequence A pending → B completion with NEW → update count exactly `4` → A rejection. A second reducer test rejects a final with an invalid outer message even when a nested message appears valid.

```text
corepack pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/d8-chat-stream.test.ts --environment jsdom
Test Files  1 failed (1)
Tests       1 failed | 41 passed (42)
Exit code 1
```

The V1 epoch sequence passes. The remaining RED is the reducer boundary defect: an outer `{ id: wrong, role: user, ... }` final is incorrectly accepted by falling through to its nested assistant message instead of returning `protocol-error`.

## Final helper correction rerun

The tool-call projection fixture was corrected to pass `toolCall`, `reasoning`, and `rawArguments` directly as the public message fields; the helper itself supplies the valid outer message identity. The malicious nested-message test remains separate and continues to require `protocol-error`.

```text
corepack pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/d8-chat-stream.test.ts --environment jsdom
✓ src/__tests__/d8-chat-stream.test.ts (42 tests)
Test Files  1 passed (1)
Tests       42 passed (42)
```
