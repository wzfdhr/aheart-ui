# Ant Style Modal Loading Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide `AModal` footer actions while `loading` renders the body Skeleton.

**Architecture:** Keep the change inside the existing Modal SFC. Add focused tests around footer visibility, update the `hasFooter` computed value to return false during loading, and refresh docs plus generated outputs.

**Tech Stack:** Vue 3 SFC, TypeScript, Vue Test Utils, Vitest jsdom, Vite package build, VitePress docs build.

---

## File Structure

- Modify `packages/components/src/modal/__tests__/modal.test.ts` for red-green loading footer tests.
- Modify `packages/components/src/modal/modal.vue` for the `hasFooter` computed rule.
- Modify `docs/components/modal.md` to document footer suppression during loading.
- Run package build to regenerate `packages/components/es/modal/**` and `packages/components/lib/modal/**`.

### Task 1: Add Failing Loading Footer Tests

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Strengthen the existing loading test**

Change the loading test to assert that the default footer is hidden:

```ts
it('renders a loading skeleton in the body and hides content and footer actions', () => {
  const wrapper = mount(Modal, {
    props: { open: true, loading: true },
    slots: { default: 'Loaded content' }
  })

  expect(wrapper.find('.aheart-skeleton').exists()).toBe(true)
  expect(wrapper.text()).not.toContain('Loaded content')
  expect(wrapper.find('.aheart-modal__footer').exists()).toBe(false)
  expect(wrapper.find('.aheart-modal__ok').exists()).toBe(false)
  expect(wrapper.find('.aheart-modal__cancel').exists()).toBe(false)
})
```

- [ ] **Step 2: Add custom footer slot coverage**

Add this test after the strengthened loading test:

```ts
it('hides custom footer content while loading', () => {
  const wrapper = mount(Modal, {
    props: { open: true, loading: true },
    slots: {
      default: 'Loaded content',
      footer: '<button class="custom-loading-footer">Publish</button>'
    }
  })

  expect(wrapper.find('.aheart-skeleton').exists()).toBe(true)
  expect(wrapper.find('.custom-loading-footer').exists()).toBe(false)
  expect(wrapper.find('.aheart-modal__footer').exists()).toBe(false)
})
```

- [ ] **Step 3: Run Modal tests to verify red**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: the loading footer assertions fail because the component currently renders `.aheart-modal__footer` while loading.

### Task 2: Implement Footer Suppression

**Files:**
- Modify: `packages/components/src/modal/modal.vue`

- [ ] **Step 1: Update the footer visibility computed value**

Change:

```ts
const hasFooter = computed(() => Boolean(slots.footer) || (props.footer !== false && props.footer !== null))
```

to:

```ts
const hasFooter = computed(
  () => !props.loading && (Boolean(slots.footer) || (props.footer !== false && props.footer !== null))
)
```

- [ ] **Step 2: Run Modal tests to verify green**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: Modal tests pass, including loading footer suppression.

### Task 3: Update Documentation

**Files:**
- Modify: `docs/components/modal.md`

- [ ] **Step 1: Update loading demo copy**

Change the loading demo body copy to:

```vue
Sync details appear after the request finishes; footer actions return with the content.
```

- [ ] **Step 2: Update API row**

Change the `loading` API row to:

```md
| loading | 是否在内容区显示骨架屏，并暂时隐藏页脚操作 | `boolean` | `false` |
```

### Task 4: Build Generated Outputs and Verify

**Files:**
- Modify generated Modal outputs under `packages/components/es/modal/**`
- Modify generated Modal outputs under `packages/components/lib/modal/**`

- [ ] **Step 1: Run package build**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Modal outputs reflect the loading footer rule.

- [ ] **Step 2: Remove known unrelated Drawer/Form generated declaration noise if present**

Run:

```bash
cd /Users/start/Desktop/aheart-ui
git diff -- packages/components/es/drawer packages/components/lib/drawer packages/components/es/form packages/components/lib/form | git apply -R
```

Expected: only Modal-related generated files remain changed.

- [ ] **Step 3: Run full checks**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
```

Expected: all component tests and type checks pass.

- [ ] **Step 4: Run docs build and whitespace check**

Run:

```bash
cd /Users/start/Desktop/aheart-ui/docs
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../node_modules/.bin/vitepress build .
cd /Users/start/Desktop/aheart-ui
git diff --check
```

Expected: docs build succeeds and diff check reports no whitespace errors.

### Task 5: Stage and Commit

**Files:**
- Stage the new spec and plan.
- Stage `docs/components/modal.md`.
- Stage `packages/components/src/modal/**`.
- Stage `packages/components/es/modal/**`.
- Stage `packages/components/lib/modal/**`.

- [ ] **Step 1: Inspect final diff**

Run:

```bash
cd /Users/start/Desktop/aheart-ui
git status --short
git diff --stat
```

Expected: changes are limited to Modal source, Modal docs, Modal generated outputs, and this phase's spec/plan files.

- [ ] **Step 2: Stage explicit paths**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-modal-loading-footer-design.md docs/superpowers/plans/2026-06-23-ant-style-modal-loading-footer.md docs/components/modal.md packages/components/src/modal packages/components/es/modal packages/components/lib/modal
```

- [ ] **Step 3: Commit**

Run:

```bash
git diff --cached --check
git commit -m "feat: align modal loading footer"
```

Expected: commit succeeds with only the intended stage changes.

## Self Review

- Spec coverage: the plan includes loading footer tests, runtime change, docs, generated outputs, full checks, and commit scope.
- Placeholder scan: no placeholder markers or vague deferred steps.
- Type consistency: no new types are introduced; existing `loading`, `footer`, and Modal output paths match source and docs.
