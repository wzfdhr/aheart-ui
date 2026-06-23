# Ant Style Modal Mask Config Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style object configuration for AModal `mask` while preserving existing boolean and `maskClosable` behavior.

**Architecture:** Keep the API localized to Modal. Add a typed `ModalMaskConfig`, derive mask visibility, blur state, and closability in computed helpers, and let the template consume those helpers instead of reading raw props directly.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vitest with Vue Test Utils, Vite library build, VitePress docs.

---

## File Structure

- Modify `packages/components/src/modal/types.ts` for the new mask types and prop signature.
- Modify `packages/components/src/modal/modal.vue` for computed mask normalization, template visibility, blur class, and click behavior.
- Modify `packages/components/src/modal/style.css` for the blurred mask state.
- Modify `packages/components/src/modal/__tests__/modal.test.ts` for red/green coverage.
- Modify `docs/components/modal.md` for the example and API docs.
- Regenerate `packages/components/es/**` and `packages/components/lib/**` through the component build.

### Task 1: Add Failing Mask Config Tests

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Write object mask rendering test**

Add this test near the existing mask click test:

```ts
it('supports object mask enabled and blur settings', () => {
  const blurred = mount(Modal, {
    props: {
      open: true,
      mask: { enabled: true, blur: true }
    }
  })

  expect(blurred.find('.aheart-modal__mask').exists()).toBe(true)
  expect(blurred.find('.aheart-modal__mask').classes()).toContain('is-blur')

  const hidden = mount(Modal, {
    props: {
      open: true,
      mask: { enabled: false }
    }
  })

  expect(hidden.find('.aheart-modal__mask').exists()).toBe(false)
  expect(hidden.find('.aheart-modal__dialog').exists()).toBe(true)
})
```

- [ ] **Step 2: Write closable precedence test**

Add this test after the object mask rendering test:

```ts
it('uses mask closable config before legacy maskClosable', async () => {
  const locked = mount(Modal, {
    props: {
      open: true,
      mask: { closable: false },
      maskClosable: true
    }
  })

  await locked.find('.aheart-modal__mask').trigger('click')

  expect(locked.emitted('update:open')).toBeUndefined()

  const closable = mount(Modal, {
    props: {
      open: true,
      mask: { closable: true },
      maskClosable: false
    }
  })

  await closable.find('.aheart-modal__mask').trigger('click')

  expect(closable.emitted('update:open')?.[0]).toEqual([false])
})
```

- [ ] **Step 3: Run test to verify it fails**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: FAIL because `.aheart-modal__mask` does not include `is-blur` and `mask.closable` does not override `maskClosable`.

### Task 2: Implement Mask Config

**Files:**
- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`
- Modify: `packages/components/src/modal/style.css`

- [ ] **Step 1: Add mask types and prop signature**

In `packages/components/src/modal/types.ts`, add:

```ts
export interface ModalMaskConfig {
  enabled?: boolean
  blur?: boolean
  closable?: boolean
}

export type ModalMask = boolean | ModalMaskConfig
```

Change the `mask` prop to:

```ts
mask: {
  type: [Boolean, Object] as PropType<ModalMask>,
  default: true
},
```

- [ ] **Step 2: Normalize mask state in Modal**

In `packages/components/src/modal/modal.vue`, import `ModalMaskConfig`, add an object guard, and derive:

```ts
const isMaskConfig = (value: typeof props.mask): value is ModalMaskConfig =>
  typeof value === 'object' && value !== null

const maskConfig = computed(() => (isMaskConfig(props.mask) ? props.mask : undefined))
const isMaskVisible = computed(() => (props.mask === false ? false : maskConfig.value?.enabled !== false))
const isMaskBlurred = computed(() => maskConfig.value?.blur === true)
const isMaskClosable = computed(() => maskConfig.value?.closable ?? props.maskClosable)
```

- [ ] **Step 3: Wire template and click behavior**

Change the mask template to use `isMaskVisible`. Change `maskClass` and `handleMaskClick` to:

```ts
const maskClass = computed(() => [
  'aheart-modal__mask',
  {
    'is-blur': isMaskBlurred.value
  },
  semanticClass('mask')
])

const handleMaskClick = () => {
  if (isMaskClosable.value) {
    close()
  }
}
```

- [ ] **Step 4: Add blur CSS**

In `packages/components/src/modal/style.css`, add:

```css
.aheart-modal__mask.is-blur {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
```

- [ ] **Step 5: Run test to verify it passes**

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

- [ ] **Step 1: Add docs demo**

Add a `maskConfigOpen` ref and a docs demo that uses:

```vue
<AModal
  v-model:open="maskConfigOpen"
  title="Mask config"
  :mask="{ blur: true, closable: false }"
>
  The blurred mask stays visible, and mask clicks do not close this modal.
</AModal>
```

- [ ] **Step 2: Update API table and type section**

Update the `mask` row to:

```markdown
| mask | 遮罩配置 | `boolean` \| `{ enabled?: boolean; blur?: boolean; closable?: boolean }` | `true` |
```

Update the `maskClosable` row to:

```markdown
| maskClosable | 点击遮罩是否关闭；优先使用 `mask.closable` | `boolean` | `true` |
```

Add:

```ts
interface ModalMaskConfig {
  enabled?: boolean
  blur?: boolean
  closable?: boolean
}
```

- [ ] **Step 3: Build generated outputs**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Modal outputs include the new mask API.

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
git add docs/superpowers/specs/2026-06-23-ant-style-modal-mask-config-design.md docs/superpowers/plans/2026-06-23-ant-style-modal-mask-config.md docs/components/modal.md packages/components/src/modal packages/components/es/modal packages/components/lib/modal packages/components/es/style.css packages/components/lib/style.css
git commit -m "feat: align modal mask config"
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

- Spec coverage: Task 1 covers regression tests, Task 2 covers typed behavior and styling, Task 3 covers docs and generated outputs, Task 4 covers verification and GitHub publication.
- Placeholder scan: no unfinished placeholders.
- Type consistency: `ModalMaskConfig`, `ModalMask`, `enabled`, `blur`, and `closable` names match between spec, tests, source, and docs.
