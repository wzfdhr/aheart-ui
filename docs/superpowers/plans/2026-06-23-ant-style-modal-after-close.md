# Ant Style Modal After Close Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align Aheart Modal with Ant-style `afterClose` close-completion event behavior.

**Architecture:** Keep the event in the existing controlled `open` watcher. Add the event to `modalEmits`, emit it only when `open` becomes `false`, and document the event in the Modal docs table.

**Tech Stack:** Vue 3 SFC, TypeScript, Vitest, Vue Test Utils, VitePress docs, package build output under `packages/components/es` and `packages/components/lib`.

---

## File Structure

- Modify `packages/components/src/modal/types.ts` to add the `afterClose` event validator.
- Modify `packages/components/src/modal/modal.vue` to emit `afterClose` on close transitions.
- Modify `packages/components/src/modal/__tests__/modal.test.ts` to cover the event.
- Modify `docs/components/modal.md` to document the event.
- Generate `packages/components/es/modal/*` and `packages/components/lib/modal/*` with the component build.

### Task 1: Modal After Close Tests

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
it('emits afterClose when open changes to false', async () => {
  const wrapper = mount(Modal, {
    props: { open: true, title: 'Closable' }
  })

  await wrapper.setProps({ open: false })

  expect(wrapper.emitted('afterOpenChange')?.[0]).toEqual([false])
  expect(wrapper.emitted('afterClose')).toHaveLength(1)
})

it('does not emit afterClose when open changes to true', async () => {
  const wrapper = mount(Modal, {
    props: { open: false, forceRender: true, title: 'Opening' }
  })

  await wrapper.setProps({ open: true })

  expect(wrapper.emitted('afterOpenChange')?.[0]).toEqual([true])
  expect(wrapper.emitted('afterClose')).toBeUndefined()
})

it('emits afterClose when destroyOnHidden removes the modal', async () => {
  const wrapper = mount(Modal, {
    props: { open: true, destroyOnHidden: true, title: 'Destroyable' }
  })

  await wrapper.setProps({ open: false })

  expect(wrapper.find('.aheart-modal').exists()).toBe(false)
  expect(wrapper.emitted('afterClose')).toHaveLength(1)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: FAIL because `afterClose` is not emitted yet.

### Task 2: Modal After Close Implementation

**Files:**
- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`

- [ ] **Step 1: Add the event validator**

Add `afterClose: () => true` to `modalEmits`.

- [ ] **Step 2: Emit from the controlled close transition**

In the `props.open` watcher, keep the existing render-state logic and `afterOpenChange` emit. Add:

```ts
if (!open) {
  emit('afterClose')
}
```

- [ ] **Step 3: Run tests to verify they pass**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: PASS.

### Task 3: Docs, Build Outputs, And Publish

**Files:**
- Modify: `docs/components/modal.md`
- Modify generated output under `packages/components/es/modal/*`
- Modify generated output under `packages/components/lib/modal/*`

- [ ] **Step 1: Update Modal docs**

Add this row to the Events table:

```md
| afterClose | 对话框完全关闭后触发 | `() => void` |
```

- [ ] **Step 2: Run full verification**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Run from `docs`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../node_modules/.bin/vitepress build .
```

Run from the repository root:

```bash
git diff -- packages/components/es/drawer packages/components/lib/drawer packages/components/es/form packages/components/lib/form | git apply -R
git diff --check
git status --short
```

- [ ] **Step 3: Commit and publish**

Run from the repository root:

```bash
git add docs/components/modal.md \
  docs/superpowers/plans/2026-06-23-ant-style-modal-after-close.md \
  docs/superpowers/specs/2026-06-23-ant-style-modal-after-close-design.md \
  packages/components/src/modal/types.ts \
  packages/components/src/modal/modal.vue \
  packages/components/src/modal/__tests__/modal.test.ts \
  packages/components/es/modal \
  packages/components/lib/modal
git commit -m "feat: align modal after close event"
git push -u origin codex/consolidated-ant-style-foundation
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

## Self-Review

- Spec coverage: all spec requirements map to Task 1, Task 2, or Task 3.
- Placeholder scan: no TBD/TODO/fill-in placeholders.
- Type consistency: `afterClose` is named consistently across tests, emits, docs, and generated outputs.
