# Ant Style Modal Semantic Functions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style function support for AModal `classNames` and `styles` semantic hooks.

**Architecture:** Keep the feature inside Modal types and helpers. Broaden the semantic hook types to accept a function, add one generic resolver in `modal.vue`, and keep all existing class/style call sites unchanged.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest with Vue Test Utils, Vite library build, VitePress docs.

---

## File Structure

- Modify `packages/components/src/modal/types.ts` for `ModalSemanticInfo`, `ModalSemanticConfig`, `ModalClassNames`, and `ModalStyles`.
- Modify `packages/components/src/modal/modal.vue` for a shared semantic resolver.
- Modify `packages/components/src/modal/__tests__/modal.test.ts` for red/green coverage.
- Modify `docs/components/modal.md` for the example and API docs.
- Regenerate `packages/components/es/**` and `packages/components/lib/**` through the component build.

### Task 1: Add Failing Semantic Function Test

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Write failing test**

Add this test after the existing object semantic class/style test:

```ts
it('resolves semantic class and style functions with modal props', () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      title: 'Semantic functions',
      width: 480,
      classNames: ({ props }) => ({
        root: props.open ? 'function-root-open' : 'function-root-closed',
        dialog: props.width === 480 ? 'function-dialog-wide' : 'function-dialog-narrow'
      }),
      styles: ({ props }) => ({
        body: {
          padding: props.open ? '32px' : '8px'
        },
        footer: {
          justifyContent: props.width === 480 ? 'center' : 'flex-end'
        }
      })
    }
  })

  expect(wrapper.find('.aheart-modal').classes()).toContain('function-root-open')
  expect(wrapper.find('.aheart-modal__dialog').classes()).toContain('function-dialog-wide')
  expect(wrapper.find('.aheart-modal__body').attributes('style')).toContain('padding: 32px')
  expect(wrapper.find('.aheart-modal__footer').attributes('style')).toContain('justify-content: center')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: FAIL because function-form `classNames` and `styles` are currently ignored by bracket lookups.

### Task 2: Implement Semantic Function Resolution

**Files:**
- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`

- [ ] **Step 1: Broaden semantic hook types**

In `packages/components/src/modal/types.ts`, replace the existing class/style aliases with:

```ts
export interface ModalSemanticInfo {
  props: Readonly<Record<string, unknown>>
}

export type ModalSemanticRecord<T> = Partial<Record<ModalSemanticPart, T>>
export type ModalSemanticConfig<T> = ModalSemanticRecord<T> | ((info: ModalSemanticInfo) => ModalSemanticRecord<T>)
export type ModalClassNames = ModalSemanticConfig<string>
export type ModalStyles = ModalSemanticConfig<CSSProperties>
```

- [ ] **Step 2: Add shared resolver**

In `packages/components/src/modal/modal.vue`, import `ModalSemanticConfig` and add:

```ts
const resolveSemanticConfig = <T,>(
  config: ModalSemanticConfig<T> | undefined,
  part: ModalSemanticPart
): T | undefined => {
  const resolved = typeof config === 'function' ? config({ props }) : config
  return resolved?.[part]
}
```

- [ ] **Step 3: Wire existing helpers**

Replace the helper implementations with:

```ts
const semanticClass = (part: ModalSemanticPart) => resolveSemanticConfig(props.classNames, part)
const semanticStyle = (part: ModalSemanticPart): CSSProperties | undefined =>
  resolveSemanticConfig(props.styles, part)
```

- [ ] **Step 4: Run Modal tests**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: all Modal tests pass.

### Task 3: Update Docs and Generated Outputs

**Files:**
- Modify: `docs/components/modal.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] **Step 1: Update semantic docs demo**

Add script helpers:

```ts
const semanticClassNames = ({ props }: { props: { open?: boolean } }) => ({
  dialog: props.open ? 'docs-modal-dialog' : '',
  body: 'docs-modal-body'
})
const semanticStyles = ({ props }: { props: { open?: boolean } }): Record<string, CSSProperties> => ({
  body: {
    padding: props.open ? '24px' : '16px'
  }
})
```

Use `:class-names="semanticClassNames"` and `:styles="semanticStyles"` in the semantic styling demo.

- [ ] **Step 2: Update API table and type section**

Update the rows:

```markdown
| classNames | 语义化结构类名 | `Partial<Record<ModalSemanticPart, string>>` \| `(info: ModalSemanticInfo) => Partial<Record<ModalSemanticPart, string>>` | - |
| styles | 语义化结构样式 | `Partial<Record<ModalSemanticPart, CSSProperties>>` \| `(info: ModalSemanticInfo) => Partial<Record<ModalSemanticPart, CSSProperties>>` | - |
```

Add:

```ts
interface ModalSemanticInfo {
  props: Readonly<Record<string, unknown>>
}
```

- [ ] **Step 3: Build generated outputs**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Modal outputs include function-form semantic hook types.

### Task 4: Verify, Commit, Push, and Merge

**Files:**
- All files changed by Tasks 1-3.

- [ ] **Step 1: Run full component tests**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
```

Expected: all component tests pass.

- [ ] **Step 2: Run typecheck**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
```

Expected: exit 0.

- [ ] **Step 3: Run docs build**

Run from `docs`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../node_modules/.bin/vitepress build .
```

Expected: docs build succeeds.

- [ ] **Step 4: Run diff hygiene**

Run:

```bash
git diff --check
```

Expected: no whitespace errors.

- [ ] **Step 5: Commit and publish**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-modal-semantic-functions-design.md docs/superpowers/plans/2026-06-23-ant-style-modal-semantic-functions.md docs/components/modal.md packages/components/src/modal packages/components/es/modal packages/components/lib/modal
git commit -m "feat: align modal semantic functions"
git push origin codex/consolidated-ant-style-foundation
```

- [ ] **Step 6: Fast-forward merge to master**

Run:

```bash
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

Expected: `master`, `origin/master`, current branch, and its remote all point at the new commit.

## Self-Review

- Spec coverage: Task 1 covers regression tests, Task 2 covers typed behavior, Task 3 covers docs and generated outputs, Task 4 covers verification and GitHub publication.
- Placeholder scan: no unfinished placeholders.
- Type consistency: `ModalSemanticInfo`, `ModalSemanticConfig`, `classNames`, and `styles` names match between spec, tests, source, and docs.
