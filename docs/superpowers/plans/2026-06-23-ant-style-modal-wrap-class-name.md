# Ant Style Modal Wrap Class Name Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align Aheart Modal with Ant-style `wrapClassName` support for styling the dialog wrapper.

**Architecture:** Keep the implementation in the existing Modal SFC and prop schema. Add a string prop in `types.ts`, include it in the `wrapClass` computed value between the built-in class and semantic `classNames.wrap`, then document and generate package outputs.

**Tech Stack:** Vue 3 SFC, TypeScript, Vitest, Vue Test Utils, VitePress docs, package build output under `packages/components/es` and `packages/components/lib`.

---

## File Structure

- Modify `packages/components/src/modal/types.ts` to add `wrapClassName`.
- Modify `packages/components/src/modal/modal.vue` to apply `wrapClassName` to `.aheart-modal__wrap`.
- Modify `packages/components/src/modal/__tests__/modal.test.ts` to cover the wrapper class behavior.
- Modify `docs/components/modal.md` to document and demonstrate the prop.
- Generate `packages/components/es/modal/*` and `packages/components/lib/modal/*` with the component build.

### Task 1: Modal Wrap Class Name Tests

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it('applies wrapClassName alongside semantic wrap class', () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      wrapClassName: 'custom-wrap-name',
      classNames: {
        wrap: 'semantic-wrap'
      }
    }
  })

  expect(wrapper.find('.aheart-modal__wrap').classes()).toEqual(
    expect.arrayContaining(['custom-wrap-name', 'semantic-wrap'])
  )
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: FAIL because `wrapClassName` is not applied to `.aheart-modal__wrap` yet.

### Task 2: Modal Wrap Class Name Implementation

**Files:**
- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`

- [ ] **Step 1: Add the prop**

Add this prop to `modalProps` near `rootClassName`:

```ts
wrapClassName: String,
```

- [ ] **Step 2: Apply the class to the wrap element**

Change `wrapClass` to include the new prop:

```ts
const wrapClass = computed(() => ['aheart-modal__wrap', props.wrapClassName, semanticClass('wrap')])
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

Add `wrap-class-name` to the semantic styling example and this row to the API table:

```md
| wrapClassName | 对话框外层容器自定义类名 | `string` | - |
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
  docs/superpowers/plans/2026-06-23-ant-style-modal-wrap-class-name.md \
  docs/superpowers/specs/2026-06-23-ant-style-modal-wrap-class-name-design.md \
  packages/components/src/modal/types.ts \
  packages/components/src/modal/modal.vue \
  packages/components/src/modal/__tests__/modal.test.ts \
  packages/components/es/modal \
  packages/components/lib/modal
git commit -m "feat: align modal wrap class name"
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
- Type consistency: `wrapClassName` is named consistently across tests, props, docs, and generated outputs.
