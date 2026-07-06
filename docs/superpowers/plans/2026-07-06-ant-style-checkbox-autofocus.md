# Ant Style Checkbox Autofocus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `autoFocus` support to `ACheckbox`.

**Architecture:** Reuse the existing native input ref and `focus()` helper. Add an `autoFocus` prop and call `nextTick(focus)` on mount when enabled.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Files

- Modify: `packages/components/src/checkbox/types.ts`
- Modify: `packages/components/src/checkbox/checkbox.vue`
- Modify: `packages/components/src/checkbox/__tests__/checkbox.test.ts`
- Modify: `docs/components/checkbox.md`
- Generated after build: `packages/components/es/checkbox/*`
- Generated after build: `packages/components/lib/checkbox/*`

## Task 1: Add Checkbox Autofocus

- [ ] **Step 1: Write the failing test**

In `packages/components/src/checkbox/__tests__/checkbox.test.ts`, add:

```ts
it('focuses the native input when autoFocus is enabled', async () => {
  const host = document.createElement('div')
  document.body.appendChild(host)

  const wrapper = mount(Checkbox, {
    attachTo: host,
    props: { autoFocus: true }
  })

  await nextTick()

  expect(document.activeElement).toBe(wrapper.find('input').element)

  wrapper.unmount()
  host.remove()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
CI=true corepack pnpm --filter ./packages/components test -- checkbox
```

Expected: FAIL because `autoFocus` is not declared and Checkbox does not focus on mount.

- [ ] **Step 3: Add the prop**

In `packages/components/src/checkbox/types.ts`, add:

```ts
autoFocus: Boolean,
```

- [ ] **Step 4: Implement mount focus**

In `packages/components/src/checkbox/checkbox.vue`, update the Vue import:

```ts
import { computed, nextTick, onMounted, ref } from 'vue'
```

Then add:

```ts
onMounted(() => {
  if (props.autoFocus) {
    nextTick(focus)
  }
})
```

- [ ] **Step 5: Document the prop**

In `docs/components/checkbox.md`, add `auto-focus` to the focus demo and add this API row:

```md
| autoFocus | 挂载后自动聚焦原生 checkbox 输入框 | `boolean` | `false` |
```

- [ ] **Step 6: Run focused and full verification**

Run:

```bash
CI=true corepack pnpm --filter ./packages/components test -- checkbox
CI=true corepack pnpm --filter ./packages/components test
corepack pnpm --filter ./packages/components typecheck
corepack pnpm --filter ./packages/components build
corepack pnpm docs:build
git diff --check
```

Expected: all commands exit 0. Revert known unrelated Form/Modal declaration drift if the component build refreshes it.

- [ ] **Step 7: Commit and integrate**

Stage the spec, plan, source, tests, docs, and generated Checkbox output. Commit:

```bash
git commit -m "feat: align checkbox autofocus"
```

Push the feature branch, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
