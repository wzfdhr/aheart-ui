# D8 Workbench RED evidence

Date: 2026-09-09
Baseline: `codex/d8-ai` at the D8 implementation gate, before Workbench implementation
Test file: `packages/ai/src/__tests__/d8-workbench.test.ts`

## Command

```text
pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/d8-workbench.test.ts --environment jsdom
```

## Result

The command produced a genuine RED result: **17 tests failed, 0 passed**.

Representative failures were:

- Workbench mounted two `AAIChatPanel` instances instead of the required single owner.
- `actionHandler` was not invoked, so transactional approval could not replace the legacy event path.
- Operation success/error/not-applied/unknown feedback was absent.
- Dependency inversion emitted `update:tasks` instead of `task-move-reject`, and `tasksRevision` was not forwarded as the D7 SortableList `revision`.
- Running/locked tasks did not disable reorder controls or expose lock reasons.
- Separate Workbench instances reused the same task/context DnD group instead of being scope-isolated.

The complete test output was observed directly from Vitest; no `skip`, `only`, `force`, or timeout relaxation was used. `git diff --check` passed for the test and evidence additions.

The first RED run used a Vue Test Utils public-proxy identity assertion. That assertion was replaced with the stable internal component UID while retaining the exact-one-instance assertion, avoiding proxy enumeration warnings without weakening the ownership check. The updated run below remains RED with the same 17 contract failures.

## Post-fix rerun history

After the Workbench implementation landed in the shared worktree, the corrected test was rerun with the same command. It completed **17 passed, 0 failed**. The run emitted only the expected duplicate-key warning while intentionally supplying an invalid duplicate-ID graph; the test still performed the user move and asserted rejection. The original 17-failure RED output above is retained as the implementation-stage evidence.

## Legacy test migration

The pre-existing `gives each execution instance unique labelled section ids` case in `agent-workbench.test.ts` assumed two simultaneously mounted Execution instances. That assumption directly contradicted the approved D8 single-owner contract, so only that case was migrated to assert one stable Execution UID through responsive Tab and Drawer transitions, distinct task/artifact section IDs, and correct `aria-labelledby` links. No other legacy tests were changed.

Verification after migration:

```text
pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/agent-workbench.test.ts src/__tests__/d8-workbench.test.ts --environment jsdom
```

**32 passed, 0 failed** (15 legacy Workbench + 17 D8 Workbench). The intentionally invalid duplicate-ID graph still emits the expected Vue duplicate-key warning.

## Expanded Workbench reliability RED

The fixtures were tightened so every approval carrying `artifactId` includes a matching artifact revision, except the dedicated missing-artifact/revision lock test. Additional assertions now cover non-approval cancel/retry handler routing, pending/success/error write locks, same-action approve retries with stable idempotency, fresh keys for `not-applied`, settled and pending identity cleanup, mobile interactive ownership, same-user-scope isolation, free-task reorder around locked indexes, revisionless running/waiting locks, candidate field immutability, and duplicate-key warning suppression for invalid graphs.

Command:

```text
pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/agent-workbench.test.ts src/__tests__/d8-workbench.test.ts --environment jsdom
```

Current implementation-stage result: **32 passed, 8 failed** (15 legacy tests passed; D8 Workbench had 17 passed and 8 failed). The failures are genuine implementation gaps: mobile ChatPanel/Execution are still placeholders, non-approval pending locks permit duplicate writes, unknown approve retry sends `retry`, settled state is retained across conversation changes, artifact identity changes with equal revision do not abort, locked-index/free-task reorder is rejected, revisionless running/waiting tasks remain movable, and shared user scope reuses DnD groups/heading IDs. No skip, force, or timeout relaxation was used; `git diff --check` passed.

## Responsive owner-window RED revision

The three directly related responsive/single-owner cases now install a triggerable owner-window `matchMedia('(max-width: 760px)')` mock with `matches=true`, exercise role/name-selected scoped tabs, change back to desktop and mobile, and restore the original matcher. Mobile assertions locate the ChatPanel through its real Teleport target and require the Execution inside `.aheart-drawer__body .aheart-ai-workbench__execution-content`, including an actual interactive control and stable component UID.

Latest verification command:

```text
pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/agent-workbench.test.ts src/__tests__/d8-workbench.test.ts --environment jsdom
```

Current RED: **31 passed, 9 failed, 4 unhandled errors**. The unhandled `Teleport` `insertBefore` failures occur when switching the scoped responsive owner between the desktop and mobile targets; they are implementation evidence, not test skips or suppressed errors. `git diff --check` passes.

The remaining locator corrections were then applied: Teleported content is located through the detached VTU wrapper/Drawer locator, and the draft-continuity case uses the role/name scoped-tab helper throughout. Latest rerun:

```text
pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/agent-workbench.test.ts src/__tests__/d8-workbench.test.ts --environment jsdom
```

Result: **39 passed, 1 failed** (25 D8 Workbench tests passed; 14/15 legacy tests passed). The sole remaining failure is the pre-existing legacy move-button expectation for a revisionless running task, which conflicts with the approved D8 rule that running tasks without a revision remain locked. `git diff --check` passes; no skip/force/timeout was used.

That final legacy conflict was migrated by changing only the old ordering case's local fixture to two `pending`, `reorderable` tasks. The D8 running-without-revision lock remains covered by the dedicated D8 test. Final rerun of the same command: **40 passed, 0 failed** (15 legacy + 25 D8), with no skip/force/timeout relaxation; `git diff --check` passes.

## Development-manager second-review counterexamples

The second review expanded the Workbench suite with revisionless non-approval action locks and non-fabricated approval identity, omitted-outcome/throw-as-unknown retry behavior, original-action and idempotency assertions, authority-change key rotation, mobile Drawer close/overlay release on desktop transition, same-revision parent authority cleanup, approval-status/timeline/header consistency, and legal `tasksRevision` button/candidate paths.

Latest command result after this expansion:

```text
pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/agent-workbench.test.ts src/__tests__/d8-workbench.test.ts --environment jsdom
```

**40 passed, 8 failed** (15 legacy passed; D8 had 25 passed and 8 failed). This pre-migration result included two test-semantic conflicts: the legacy approval-status expectation and the Drawer mask-node expectation.

Those two cases were migrated per the D8 contract: approval results now retain the original task status/timeline/completion count, and the Drawer assertion checks `open=false`, hidden/closing root state, and body-scroll release while allowing retained mask DOM. After correcting the approval helper to deep-merge default identity fields and using the Drawer’s real `is-leave` phase plus fake timers for its existing 240ms motion, the authoritative rerun is **47 passed, 1 failed** (15 legacy + 32 passing D8). The third-review retry counterexample then added two parameterized non-approval error cases (omitted outcome and throw). Current rerun: **48 passed, 2 failed** out of 50 tests (15 legacy + 33 passing D8). Both failures are the same genuine gap: after the first `status:error`/throw on a revisioned non-approval retry, the retry button remains disabled instead of allowing a second attempt with the original `retry` action, new operationId, same idempotencyKey, and no approvalId. The previously observed Drawer-root, fabricated approvalId, conversation-key, and move-task failures are no longer present in this current implementation state. No skip, force, or timeout relaxation was used; `git diff --check` passes.

## Third-review migration and current verification

The older pending/success duplicate-write case was narrowed and renamed to cover only pending and success. Its contradictory error-after-omitted-outcome assertion was removed; omitted-outcome and thrown-error retry behavior remains fully covered by the parameterized cases, including same-key/new-attempt/original-action/no-approvalId and success locking.

Current D8-only run: **35 passed, 0 failed**.

Complete AI package run:

```text
pnpm --filter @aheart-ui/ai test
```

**10 test files passed, 185 tests passed, 0 failed**, environment `jsdom`; no skip, force, or timeout relaxation. `git diff --check` passes.

## D7 `moveReject` Workbench bridge RED

Added a browser-facing unit RED that locates the task `ASortableList`, emits a minimal legal D7 `moveReject` event with `reason: 'stale-revision'`, verifies `update:tasks` is absent, and requires the Workbench message `任务版本已变化，排序已拒绝`. It then emits `disabled` and requires a safe human-readable rejection string without object leakage.

Command:

```text
pnpm --filter @aheart-ui/ai exec vitest run src/__tests__/d8-workbench.test.ts --environment jsdom
```

Result: **35 passed, 1 failed** out of 36. The sole failure is the intended RED: AgentExecution/Workbench does not currently listen to or translate the D7 `moveReject` event. No skip, force, timeout, or production change was used; `git diff --check` passes.

## Coverage intent

The test file asserts the D8 Workbench contract for one shared responsive ChatPanel/AgentExecution owner, preservation of draft/session/pending operation state, transactional handler versus legacy event exclusivity, operation lifecycle and idempotent retry identity, late-result and revision/handler/session/unmount invalidation, success conflict locks, dependency-aware and stale-safe task ordering, common button/drag rejection, actionable lock reasons, and multi-Workbench DnD scope isolation.
