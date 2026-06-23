# Ant Style Message Closable Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Message close controls opt-in so default notices visually match Ant Design Message.

**Architecture:** Extend Message notice config with `closable` and `closeIcon`, then let the host component conditionally render the existing close button. The service still owns removal, timers, stack, and close promise resolution.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress docs, Vite package build.

---

## File Map

- Modify `packages/components/src/message/types.ts`: add `closable` and `closeIcon` to notice/open config types.
- Modify `packages/components/src/message/service.ts`: copy the new fields from config into notices.
- Modify `packages/components/src/message/message.vue`: conditionally render the close button and render `closeIcon`.
- Modify `packages/components/src/message/__tests__/message.test.ts`: update existing tests and add close-control coverage.
- Modify `docs/components/message.md`: document manual close controls and API.
- Update generated output in `packages/components/es/message` and `packages/components/lib/message`.

### Task 1: Add Close Control Tests

**Files:**
- Modify: `packages/components/src/message/__tests__/message.test.ts`

- [x] **Step 1: Write failing default-hidden test**

```ts
it('hides close controls by default', () => {
  const wrapper = mount(Message, {
    props: {
      notices: [{ key: 'saved', type: 'success', content: 'Saved' }]
    }
  })

  expect(wrapper.find('.aheart-message-notice__close').exists()).toBe(false)
})
```

- [x] **Step 2: Write closable render and emit test**

```ts
it('renders closable notices with custom close icon and emits close', async () => {
  const wrapper = mount(Message, {
    props: {
      notices: [
        {
          key: 'manual',
          type: 'info',
          content: 'Manual close',
          closable: true,
          closeIcon: h('span', { class: 'close-node' }, 'Dismiss')
        }
      ]
    }
  })

  const close = wrapper.find('.aheart-message-notice__close')
  expect(close.find('.close-node').text()).toBe('Dismiss')

  await close.trigger('click')

  expect(wrapper.emitted('close')?.[0]).toEqual(['manual'])
})
```

- [x] **Step 3: Run tests to verify failure**

Run: `PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/message/__tests__/message.test.ts`

Expected: FAIL because close controls render by default and `closeIcon` is not implemented.

### Task 2: Implement Closable Notice Fields

**Files:**
- Modify: `packages/components/src/message/types.ts`
- Modify: `packages/components/src/message/service.ts`
- Modify: `packages/components/src/message/message.vue`

- [x] **Step 1: Extend types**

Add these fields to `MessageNotice` and `MessageOpenConfig`:

```ts
closable?: boolean
closeIcon?: MessageContentNode
```

- [x] **Step 2: Copy config into notices**

In `service.ts`, include:

```ts
closable: config.closable,
closeIcon: config.closeIcon,
```

- [x] **Step 3: Render close conditionally**

In `message.vue`, add `v-if="notice.closable"` to the close button and replace the hardcoded text with:

```vue
<ARenderNode :node="notice.closeIcon ?? '×'" />
```

- [x] **Step 4: Update existing tests that expect close controls**

Set `closable: true` on direct host test notices that intentionally test close behavior or semantic close hooks.

- [x] **Step 5: Run targeted test**

Run: `PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/message/__tests__/message.test.ts`

Expected: PASS for the Message suite.

### Task 3: Update Docs

**Files:**
- Modify: `docs/components/message.md`

- [x] **Step 1: Add manual close example**

Add a section showing:

```ts
message.info({
  content: 'Manual close',
  duration: 0,
  closable: true,
  closeIcon: 'dismiss'
})
```

- [x] **Step 2: Update API table**

Add `closable` and `closeIcon` rows to `MessageOpenConfig`.

- [x] **Step 3: Clarify semantic close**

Change the Semantic DOM row for `close` to mention that it is rendered for closable notices.

### Task 4: Verify, Build, Commit, Push, And Merge

**Files:**
- Generated: `packages/components/es/message`
- Generated: `packages/components/lib/message`

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
git add docs/components/message.md docs/superpowers/specs/2026-06-23-ant-style-message-closable-controls-design.md docs/superpowers/plans/2026-06-23-ant-style-message-closable-controls.md packages/components/src/message/types.ts packages/components/src/message/service.ts packages/components/src/message/message.vue packages/components/src/message/__tests__/message.test.ts packages/components/es/message packages/components/lib/message
```

- [ ] **Step 3: Commit**

Run: `git commit -m "feat: align message closable controls"`

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
