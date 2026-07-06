# Ant Style Switch Native Element Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose `nativeElement` from `ASwitch` component refs.

**Architecture:** Reuse the existing root button ref in `switch.vue`. Extend `defineExpose` to return that ref as `nativeElement`, and document the ref surface without changing switch behavior.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Files

- Modify: `packages/components/src/switch/__tests__/switch.test.ts`
- Modify: `packages/components/src/switch/switch.vue`
- Modify: `docs/components/switch.md`
- Generated after build: `packages/components/es/switch/switch.vue.d.ts`
- Generated after build: `packages/components/lib/switch/switch.vue.d.ts`

## Task 1: Add Switch Native Element Ref API

- [ ] **Step 1: Write the failing test**

In `packages/components/src/switch/__tests__/switch.test.ts`, extend the existing ref-control test:

```ts
const switchVm = wrapper.vm as unknown as {
  focus: () => void
  blur: () => void
  nativeElement?: HTMLButtonElement
}
```

Then add this assertion after the focus assertion:

```ts
expect(switchVm.nativeElement).toBe(wrapper.element)
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
CI=true corepack pnpm --filter ./packages/components test -- switch
```

Expected: FAIL because `switchVm.nativeElement` is currently `undefined`.

- [ ] **Step 3: Write minimal implementation**

In `packages/components/src/switch/switch.vue`, update `defineExpose`:

```ts
defineExpose({
  focus,
  blur,
  nativeElement: switchRef
})
```

- [ ] **Step 4: Document the API**

In `docs/components/switch.md`, update the ref type examples to include:

```ts
nativeElement?: HTMLButtonElement
```

Add one Methods row:

```md
| nativeElement | 根按钮元素 |
```

- [ ] **Step 5: Run focused and full verification**

Run:

```bash
CI=true corepack pnpm --filter ./packages/components test -- switch
CI=true corepack pnpm --filter ./packages/components test
corepack pnpm --filter ./packages/components typecheck
corepack pnpm --filter ./packages/components build
corepack pnpm docs:build
git diff --check
```

Expected: all commands exit 0. If the component build refreshes unrelated Form or Modal declaration files, revert only that known generated drift.

- [ ] **Step 6: Commit and integrate**

Stage the spec, plan, source, tests, docs, and generated Switch output. Commit:

```bash
git commit -m "feat: align switch native element ref"
```

Push the feature branch, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
