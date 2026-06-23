# Ant Style Message Pause On Hover Default Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Message hover-pause default behavior match Ant Design.

**Architecture:** Keep the existing timer, pause, and resume flow in `service.ts`. Only change the global default and reset value, then cover the default with a focused Vitest test.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress docs, pnpm workspace build.

---

## File Map

- Modify `packages/components/src/message/service.ts`: change initial and reset `pauseOnHover` defaults to `true`.
- Modify `packages/components/src/message/__tests__/message.test.ts`: add a default-hover-pause regression test.
- Modify `docs/components/message.md`: update the API default.
- Update generated package output in `packages/components/es/message` and `packages/components/lib/message` through the normal build.

### Task 1: Add Default Hover Pause Test

**Files:**
- Modify: `packages/components/src/message/__tests__/message.test.ts`

- [x] **Step 1: Write the failing test**

```ts
it('pauses auto close while hovered by default', async () => {
  vi.useFakeTimers()

  message.info('Default hover pause', 0.2)
  await nextTick()

  const notice = document.body.querySelector('.aheart-message-notice') as HTMLElement
  notice.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
  await vi.advanceTimersByTimeAsync(250)
  await nextTick()

  expect(document.body.textContent).toContain('Default hover pause')

  notice.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
  await vi.advanceTimersByTimeAsync(250)
  await nextTick()

  expect(document.body.textContent).not.toContain('Default hover pause')
})
```

- [x] **Step 2: Run test to verify it fails**

Run: `PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom packages/components/src/message/__tests__/message.test.ts`

Expected: FAIL because default Message notices currently do not pause on hover.

### Task 2: Change Message Default

**Files:**
- Modify: `packages/components/src/message/service.ts`

- [x] **Step 1: Update initial state**

Set `pauseOnHover: true` in the `state` initializer.

- [x] **Step 2: Update destroy reset**

Set `state.pauseOnHover = true` in `destroy()`.

- [x] **Step 3: Run targeted test**

Run: `PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom packages/components/src/message/__tests__/message.test.ts`

Expected: PASS for the Message suite.

### Task 3: Update Docs

**Files:**
- Modify: `docs/components/message.md`

- [x] **Step 1: Update global API default**

Change the `pauseOnHover` row default from `false` to `true`.

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
git add docs/components/message.md docs/superpowers/specs/2026-06-23-ant-style-message-pause-on-hover-default-design.md docs/superpowers/plans/2026-06-23-ant-style-message-pause-on-hover-default.md packages/components/src/message/service.ts packages/components/src/message/__tests__/message.test.ts packages/components/es/message packages/components/lib/message
```

- [ ] **Step 3: Commit**

Run: `git commit -m "feat: align message hover pause default"`

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
