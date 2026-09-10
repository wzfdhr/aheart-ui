# D8 AI architecture contract

Status: implementation gate. Baseline is verified master `ff243fffc2a3c8e7d7d1b169e77d7c3914cf0f1e`; delivery branch is `codex/d8-ai`. This contract covers the eight D8 AI reliability items only. It does not start deferred Tree/TreeSelect/Cascader virtualization, D0-D3 final review, D9 publication, npm release, or aheart-ui v2.

## Compatibility boundary

- Existing `AITransport`, `AIChatRequest`, and `AIStreamEvent` remain the legacy V1 surface. Existing V1 consumers keep their current arrival-order and EOF-completes behavior; D8 documentation must not promise V2 replay guarantees for V1.
- D8 adds explicit V2 types and a discriminated `AITransportV2` with `version: '2'`. A request uses exactly one protocol. Components must never infer a protocol by catching a type error or accept mixed V1/V2 events.
- Existing component props and legacy approval/cancel/retry events remain compatible. New transactional handlers are opt-in and are the sole business-write path when supplied.
- D8 may raise only `@aheart-ui/ai`'s Vue peer floor to `>=3.5.0 <4` because the package already imports Vue `useId`; the real consumer gate must prove the declared floor. Other packages keep their existing ranges.
- No model SDK, network client, validation framework, or other runtime dependency is added.

## Public stream protocol

```ts
interface AIStreamEventBaseV2 {
  version: '2'
  requestId: string
  messageId: string
  sequence: number
  revision: number
}

type AIStreamEventV2 =
  | (AIStreamEventBaseV2 & { type: 'text-delta'; delta: string })
  | (AIStreamEventBaseV2 & { type: 'process-upsert'; item: AIProcessItem })
  | (AIStreamEventBaseV2 & { type: 'sources-replace'; sources: AISource[] })
  | (AIStreamEventBaseV2 & { type: 'snapshot'; message: AIMessage })
  | (AIStreamEventBaseV2 & { type: 'final'; message: AIMessage })
  | (AIStreamEventBaseV2 & { type: 'cancelled'; reason?: string })
  | (AIStreamEventBaseV2 & { type: 'error'; error: string; retryable?: boolean })

interface AIChatResumeCursorV2 {
  afterSequence: number
  revision: number
}

type AIChatRequestV2 = Omit<AIChatRequest, 'messageId'> & {
  version: '2'
  requestId: string
  messageId: string
  targetMessageId?: string
  idempotencyKey: string
  resume?: AIChatResumeCursorV2
}

interface AITransportV2 {
  version: '2'
  send(request: AIChatRequestV2, signal: AbortSignal): AsyncIterable<AIStreamEventV2>
  resume?(request: AIChatRequestV2, signal: AbortSignal): AsyncIterable<AIStreamEventV2>
}
```

- `requestId` identifies one logical generation. Reconnect reuses it; a new send/edit/regenerate/user retry creates a new one.
- `messageId` identifies the new assistant output message and is frozen for the request. V2 edit/retry/regenerate place the legacy target message identity in `targetMessageId`; they never overwrite the output `messageId`. V1 continues using its existing optional `messageId` field.
- `sequence` is a one-based safe integer scoped to `requestId`. `revision` is a non-negative safe integer representing the authoritative server message version; it never substitutes for sequence.
- IDs are non-empty strings. Invalid envelopes, mismatched request/message IDs, unsafe counters, same-sequence conflicting payloads, and post-terminal events are rejected without mutating visible messages.
- Request IDs and idempotency keys are created only when a user action begins; import and SSR paths do not access time, randomness, `window`, or `document`.

## Pure V2 reducer

D8 introduces one DOM-free reducer used by every component path. It owns:

- current request/message identity and an initial cursor `{ afterSequence: 0, revision: 0 }`;
- whether an authoritative revision baseline has been established;
- a bounded out-of-order buffer of at most 32 events;
- payload fingerprints for the most recent 64 accepted events plus the terminal event until request disposal;
- `idle | streaming | reconnecting | completed | cancelled | error` state;
- a bounded diagnostic result describing accepted, duplicate, buffered, stale, gap, protocol-error, and terminal-no-op outcomes.

Rules:

1. Contiguous events apply once. Within the 64-event fingerprint window an identical replay is a no-op and the same sequence with different content is a protocol error. An older sequence outside that window is a stale no-op; the implementation does not claim it can diagnose an evicted payload conflict.
2. Future events are buffered until the gap closes. A gap larger than 32 or a full buffer requests recovery instead of silently dropping content.
3. Revision `0` is the local empty assistant baseline. An incremental event can mutate only the current established revision. A higher revision must first arrive as `snapshot` or `final`; a lower-revision contiguous event consumes its sequence position but cannot mutate the message. A checkpoint must have `revision >= current revision`; a lower-revision checkpoint cannot mutate, terminate, cross a gap or advance the cursor. A checkpoint with a sequence lower than `afterSequence` is stale even when its revision is higher, so sequence never moves backwards.
4. `snapshot` and `final` are authoritative checkpoints and may cross a forward gap only after the revision check, clearing buffered events they cover. Both validate the envelope/message ID match, assistant role and a whitelist projection of `content`, `process`, `sources`, `toolCall`, `status` and safe `error`. `toolCall` is independently projected through the `AIToolCallDisplay` whitelist; its absence in a checkpoint clears any older tool summary. A snapshot must remain `streaming`; a final must be `complete`. Attachments, arbitrary runtime keys and client-owned request data are not replaced.
5. `snapshot` replaces the allowed server-owned fields. `final` also replaces them and is the only V2 success transition.
6. Non-abort transport throws, natural EOF without final, and gap/buffer overflow enter one recovery path. When `resume` exists and the request's remaining recovery budget is positive, it is called with the same request/message/idempotency identity and current cursor. `maxReconnectAttempts` is the maximum number of `resume` calls per logical request; default `1`, `0` disables recovery, and failed attempts never reset the budget. Resume failure or exhaustion produces a safe retryable user error. Malformed envelopes, identity conflicts and conflicting replay payloads are protocol errors and never auto-resume. A server `error` event is terminal and its `retryable` flag controls only whether a new user retry is offered; it never requests automatic resume.
7. Terminal states cannot be revived. Duplicate matching terminal events are no-ops; conflicting terminal events are protocol errors.

`AIChatPanel` accepts `AITransport | AITransportV2` and adds `maxReconnectAttempts?: number` with default `1`, clamped to a non-negative safe integer. It emits `stream-status` and `stream-reject` diagnostics without exposing reducer instances or buffers.

## Chat lifecycle and controlled authority

- Each active generation has a local epoch plus request identity. Stop, actual conversation change, transport replacement, and unmount increment the epoch, abort the owner-realm controller, and invalidate all pending work.
- Identity is checked after every `await`, before reducer application, and in catch/finally. Invalidated work cannot mutate messages, errors, announcements, `sending`, or newer requests.
- `conversationId ?? activeConversation` is frozen at request start. Changing it aborts the old request; changing only responsive layout does not.
- Controlled `messages` remain parent-authoritative. Stream output is emitted as a candidate; a parent rejection cannot be presented as accepted state. Uncontrolled history has one component owner.
- Clipboard and focus access come from the rendered root element's `ownerDocument.defaultView`; direct `globalThis.navigator` access is removed.

## Workbench single source of truth

- `AIAgentWorkbench` renders exactly one `AIChatPanel` and one `AgentExecution`. Responsive layout, mobile tabs, and the execution surface move or reveal those same instances; CSS-hidden or conditionally mounted duplicates are forbidden.
- Draft, editing state, controller, stream state, operation state, and active artifact remain continuous across breakpoints, tabs, and drawer/panel changes. Only a real conversation/transport change invalidates a generation.
- SSR and the first hydration tree keep both Teleports disabled in their desktop source slots. After mount, the root `ownerDocument.defaultView.matchMedia('(max-width: 760px)')` decides mobile ownership; mobile target elements are resolved as stable element references before Teleport is enabled. The chat target remains mounted, and the execution target remains inside a `getContainer=false`, non-destroying Drawer after client-only force render. Tab changes use `v-show`; closing a Drawer or leaving a breakpoint never destroys either business component. Media-query listeners are removed on unmount.
- Every Workbench gets an SSR-stable instance scope. Its task/context DnD groups include that scope so separate workbenches cannot exchange items. An optional `scopeKey?: string | number` lets route owners invalidate DnD work.
- Approval status does not imply task completion. Header counts, task labels, mobile priority cards, and result views derive from the same normalized task state.

## Task operations and idempotency

```ts
type AIAgentOperationAction = 'approve' | 'reject' | 'cancel' | 'retry'
type AIAgentOperationStatus = 'idle' | 'pending' | 'success' | 'error'

interface AIAgentOperationRequest {
  operationId: string
  idempotencyKey: string
  conversationId?: string
  taskId: string
  taskRevision: string | number
  action: AIAgentOperationAction
  approvalId?: string
  artifactId?: string
  artifactRevision?: string | number
}

type AIAgentOperationResult =
  | { status: 'success'; operationId: string }
  | { status: 'error'; operationId: string; error: string; retryable?: boolean; outcome?: 'not-applied' | 'unknown' }

type AIAgentActionHandler = (
  request: AIAgentOperationRequest,
  signal: AbortSignal
) => Promise<AIAgentOperationResult>
```

- Workbench adds `actionHandler?: AIAgentActionHandler` and operation lifecycle events. With a handler, it is the only business-write path and legacy action events are not emitted. Without a handler, legacy events retain existing synchronous behavior and do not claim transactional guarantees.
- One task/approval has at most one pending operation. Desktop, mobile and priority controls share the same status and lock. Handler mode requires `task.revision`; when an approval points to an artifact it also requires `artifact.revision`. Missing identity disables the action with a visible reason. `AIAgentOperationRequest.taskRevision` comes from the task, while the list-level `tasksRevision` prop is used only for reorder staleness.
- `AIAgentArtifact` adds optional `revision?: string | number` for compatibility; it becomes required only for a handler operation that references that artifact.
- Matching success is displayed but business task/approval data remains parent-authoritative. Success is remembered by `(taskId, taskRevision, approvalId, action)` for display and duplicate recognition. All four task actions are conflicting for the same task revision; in particular approve/reject are mutually exclusive and cancel/retry cannot race another task operation. After any success, every conflicting action for that task revision/approval ID remains locked until the parent advances task revision or authoritative approval/task state.
- An error with `outcome: 'not-applied'` may start a new user intent. An omitted/`unknown` outcome allows only retry of the same logical operation and keeps conflicting actions locked. Each network attempt gets a new `operationId`, while every retry of that logical operation reuses the original `idempotencyKey`; only the current attempt ID may settle UI.
- Task removal, task revision change, approval ID/artifact association change, artifact revision change, `actionHandler` replacement, conversation change and unmount immediately abort and invalidate the operation. Late or mismatched results are ignored without clearing a newer state.
- Pending, success and safe error states are visible and announced. Raw thrown objects, stack traces, hidden model data and transport payloads are never stringified into the UI.

## Reorder and dependencies

`AIAgentTask` adds:

```ts
revision?: string | number
dependsOn?: string[]
reorderable?: boolean
lockedReason?: string
```

Workbench adds `reorderable?: boolean` (default `true`) and `tasksRevision?: string | number`. A single validator serves drag, move buttons, and programmatic candidate updates.

- Task IDs must be unique and the candidate must contain the identical set.
- Dependencies must exist, be acyclic, and precede dependents.
- Globally disabled/reorder-disabled tasks, `reorderable: false`, a non-empty `lockedReason`, running/waiting-approval tasks, and tasks with a pending operation cannot move.
- A locked task keeps its index. A stale `tasksRevision` or data change during drag rejects the candidate.
- Invalid graphs disable ordering and expose an actionable lock reason. Rejection emits `task-move-reject` and never emits `update:tasks` or a successful legacy `move-task`.
- The component edits order only; it does not schedule or execute dependencies.

## AIForm rule compilation

`AIFormFieldV1` adds `rules?: AIFormRuleV1[]`, `dependencies?: string[]`, and `preserve?: boolean`. Schema remains strict and serializable; functions, scripts, arbitrary URLs and unknown keys are rejected.

```ts
type AIFormRuleV1 =
  | { kind: 'range'; valueType: 'number' | 'length'; min?: number; max?: number; message?: string }
  | { kind: 'format'; format: 'email' | 'url' | 'date' | 'time'; message?: string }
  | { kind: 'compare'; field: string; operator: 'equals' | 'not-equals' | 'greater-than' | 'greater-than-or-equal' | 'less-than' | 'less-than-or-equal'; message?: string }
  | { kind: 'async'; validator: string; message?: string }

type AIFormAsyncValidator = (
  value: unknown,
  context: { values: Readonly<Record<string, unknown>>; field: AIFormFieldV1; signal: AbortSignal }
) => void | boolean | string | Promise<void | boolean | string>
```

- `validators?: Record<string, AIFormAsyncValidator>` resolves safe async rule names. Missing names are schema errors; schema never supplies executable code.
- All rules compile to core `FormRule`; every `compare.field` is automatically merged into core `FormItem.dependencies` along with any explicit field dependencies. Core Form remains the only validation runner and stale-async arbiter.
- Optional empty values skip non-required rules. Numeric range accepts only finite numbers. Length range accepts only strings or arrays. Schema validation requires at least one bound, finite bounds and `min <= max`.
- Compare operands must have compatible runtime types and never coerce. Ordered comparison is limited to finite numbers or matching canonical date/time strings accepted by the existing codecs; strings otherwise support only equals/not-equals. Every referenced field and explicit dependency must exist, and impossible field/rule combinations are schema errors.
- `format: email` follows the core Form email rule. URL accepts only `http:`/`https:` absolute URLs. Date/time use the existing strict codecs. Async boolean/string/throw results use the core Form validator result/error semantics.
- Hidden fields are not validated. To preserve V1 behavior they retain their value and are included in submit by default. `preserve: false` requests a controlled candidate with that field removed when it hides; parent rejection keeps the authoritative value. Disabled fields are not validated but remain in submit.
- AIForm exposes `validate`, `resetFields`, `clearValidate`, and `setFieldsErrors` by forwarding the core Form API. Reset uses the frozen initial resolved model/default snapshot and emits a controlled candidate; the parent remains authoritative.
- The AIForm rule adapter owns one `AbortController` per field run only to cancel external validator I/O. A new run for that field, dependency change, reset, schema change or unmount aborts it. Core Form validation revisions remain the sole authority for accepting or ignoring the eventual result; AIForm does not create a second validation engine.
- Error summary says `校验问题`, includes async/cross-field/server errors, focuses the first visible enabled invalid field, and ignores stale completions after reset/schema/unmount.

## Tool-call display boundary

```ts
interface AIToolCallDisplay {
  id: string
  name: string
  summary: string
  inputStatus?: 'pending' | 'ready' | 'redacted'
  inputSummary?: string
  resultStatus?: 'pending' | 'success' | 'error'
  resultSummary?: string
  error?: string
}
```

- `AIMessage` and `AIAgentTask` may carry `toolCall?: AIToolCallDisplay`; existing `toolName/detail/content` remain compatible.
- When structured `toolCall` exists, default rendering projects only the whitelist above and does not render legacy `content`, unknown keys, raw arguments/results, reasoning, trace, token or chain-of-thought fields.
- `AIThoughtChain` remains a compatibility name for business process summaries. No hidden-reasoning API is added.
- Custom renderers/slots are explicitly consumer-owned; the safe default never stringifies an arbitrary object.

## SSR, browser, package and quality gates

- Import and reducer tests run without DOM globals. SSR output is deterministic; two workbenches produce stable unique IDs and hydrate without warnings. Owner-document focus, clipboard, DnD scope and cleanup are tested in iframe and detach paths.
- New AI tests have no conditional skips. Full desktop/mobile Chromium, desktop Firefox, desktop/mobile WebKit cover streams, reconnect, conversation switch, responsive single instance, operations, dependency ordering, AIForm and tool summaries. Mobile WebKit is not physical iOS.
- A real packed `@aheart-ui/ai` consumer without workspace symlinks verifies public types, ESM/CJS, CSS, plugin install, SSR/hydration, Vue peer floor, V1 compatibility and all D8 public paths.
- Measure AI package gzip and a primitive-only consumer against baseline. A D8 gzip increase over 12 KB or primitive import pulling Workbench/DnD is P2 and blocks closure.
- Final candidate reruns all workspace unit/typecheck, deterministic double build, generated outputs, docs, release pack and complete repository E2E. Existing skip count may not increase without an itemized owner/issue/expiry record.
- Architecture, development, screenshot-first design, independent test-manager and product-manager reports must all have P0/P1/P2=`0/0/0`. Exact-head push and pull-request CI must pass before squash merge; then exact merge-commit master CI, Pages and live AI interactions must pass before D8 closes.
