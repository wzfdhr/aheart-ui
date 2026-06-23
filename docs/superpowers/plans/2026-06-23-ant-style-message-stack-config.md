# Ant Style Message Stack Config Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style Message stack configuration for collapsed overflow messages.

**Architecture:** Store stack configuration in the Message service state and pass it to the existing `AMessage` host. The host computes visible notices from the full notice list so timers, close callbacks, and max-count behavior remain in the service.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress docs, Vite package build.

---

## File Map

- Modify `packages/components/src/message/types.ts`: add `MessageStackConfig` and expose `stack` on service config and host props.
- Modify `packages/components/src/message/service.ts`: store global stack config and pass it to `MessageHost`.
- Modify `packages/components/src/message/message.vue`: render only the latest notice when stacked and show a `+N` stack count.
- Modify `packages/components/src/message/style.css`: style the stack count.
- Modify `packages/components/src/message/__tests__/message.test.ts`: add stack behavior coverage.
- Modify `docs/components/message.md`: document stack usage and API.
- Update generated output in `packages/components/es/message`, `packages/components/lib/message`, `packages/components/es/style.css`, and `packages/components/lib/style.css`.

### Task 1: Add Stack Behavior Test

**Files:**
- Modify: `packages/components/src/message/__tests__/message.test.ts`

- [x] **Step 1: Write the failing test**

```ts
it('stacks notices over the configured threshold', async () => {
  message.config({ stack: { threshold: 2 } })
  message.info('First stacked', 0)
  message.info('Second stacked', 0)
  message.info('Third stacked', 0)
  await nextTick()

  const notices = document.body.querySelectorAll('.aheart-message-notice')
  const host = document.body.querySelector('.aheart-message') as HTMLElement
  const stackCount = document.body.querySelector('.aheart-message-notice__stack-count')

  expect(notices).toHaveLength(1)
  expect(host.classList.contains('is-stacked')).toBe(true)
  expect(document.body.textContent).not.toContain('First stacked')
  expect(document.body.textContent).toContain('Third stacked')
  expect(stackCount?.textContent).toBe('+2')
})
```

- [x] **Step 2: Run test to verify it fails**

Run: `PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/message/__tests__/message.test.ts`

Expected: FAIL because all three notices render and no stack count exists.

### Task 2: Add Stack Types And Service State

**Files:**
- Modify: `packages/components/src/message/types.ts`
- Modify: `packages/components/src/message/service.ts`

- [x] **Step 1: Add public stack types**

Add:

```ts
export type MessageStackConfig = boolean | { threshold: number }
```

Add `stack?: MessageStackConfig` to `MessageGlobalConfig`.

Add a `stack` prop to `messageProps`:

```ts
stack: {
  type: [Boolean, Object] as PropType<MessageStackConfig>,
  default: false
}
```

- [x] **Step 2: Wire service state**

Add `stack?: MessageStackConfig` to `MessageState`, pass `stack: state.stack` into `MessageHost`, set `state.stack = options.stack` when provided, and reset `state.stack = undefined` in `destroy()`.

### Task 3: Render Stacked Notices

**Files:**
- Modify: `packages/components/src/message/message.vue`
- Modify: `packages/components/src/message/style.css`

- [x] **Step 1: Compute stack rendering state**

Add a default threshold of `3`, then compute `isStacked`, `visibleNotices`, and `stackedCount` from `props.notices` and `props.stack`.

- [x] **Step 2: Render visible notices**

Change the `v-for` to use `visibleNotices`, add `is-stacked` to the root class, and render:

```vue
<span v-if="isStacked" class="aheart-message-notice__stack-count" aria-label="Stacked message count">
  +{{ stackedCount }}
</span>
```

- [x] **Step 3: Style stack count**

Add compact count styling to `style.css` so the indicator sits inline with the message content.

- [x] **Step 4: Run targeted test**

Run: `PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/message/__tests__/message.test.ts`

Expected: PASS for the Message suite.

### Task 4: Update Docs

**Files:**
- Modify: `docs/components/message.md`

- [x] **Step 1: Add stack usage section**

Add a `## 堆叠提示` section showing:

```ts
message.config({ stack: { threshold: 2 } })
message.info('First', 0)
message.info('Second', 0)
message.info('Third', 0)
```

- [x] **Step 2: Update API rows**

Document `stack` in the service API summary, `MessageGlobalConfig`, and `AMessage API`.

### Task 5: Verify, Build, Commit, Push, And Merge

**Files:**
- Generated: `packages/components/es/message`
- Generated: `packages/components/lib/message`
- Generated: `packages/components/es/style.css`
- Generated: `packages/components/lib/style.css`

- [x] **Step 1: Run verification**

Run:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../node_modules/.bin/vitepress build .
git diff --check
```

Expected: all commands exit 0.

- [x] **Step 2: Stage phase files explicitly**

Run:

```bash
git add docs/components/message.md docs/superpowers/specs/2026-06-23-ant-style-message-stack-config-design.md docs/superpowers/plans/2026-06-23-ant-style-message-stack-config.md packages/components/src/message/types.ts packages/components/src/message/service.ts packages/components/src/message/message.vue packages/components/src/message/style.css packages/components/src/message/__tests__/message.test.ts packages/components/es/message packages/components/lib/message packages/components/es/style.css packages/components/lib/style.css
```

- [ ] **Step 3: Commit**

Run: `git commit -m "feat: align message stack config"`

- [ ] **Step 4: Push and merge**

Run:

```bash
git push -u origin codex/consolidated-ant-style-foundation
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

Expected: branch push succeeds and master fast-forwards to the phase commit.
