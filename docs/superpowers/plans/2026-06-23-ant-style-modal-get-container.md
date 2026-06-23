# Ant Style Modal Get Container Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style `getContainer` mounting support to `AModal`.

**Architecture:** Keep the Modal DOM structure intact and wrap it with Vue `Teleport`. Add a typed `getContainer` resolver in `modal.vue`, keep existing behavioral tests readable through a Teleport-stubbed helper, and add dedicated real Teleport tests for default, inline, function, and selector containers.

**Tech Stack:** Vue 3 SFC, TypeScript prop types, Vue Test Utils, Vitest, Vite package build, VitePress docs.

---

### Task 1: Modal Get Container Tests

**Files:**

- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Import Teleport and create a default mount helper**

Replace the Vue import and add the helper near the top of the test file:

```ts
import { Teleport, h, nextTick } from 'vue'

const mountModal = (options: Parameters<typeof mount>[1] = {}) =>
  mount(Modal, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ...options.global?.stubs,
        Teleport: true
      }
    }
  })
```

- [ ] **Step 2: Use the helper for existing behavior tests**

Replace existing `mount(Modal, { ... })` calls with `mountModal({ ... })` for all tests that inspect Modal internals through `wrapper.find`.

- [ ] **Step 3: Add real Teleport tests**

Append these tests before the mask tests:

```ts
it('teleports to document body by default', async () => {
  const host = document.createElement('div')
  document.body.appendChild(host)

  const wrapper = mount(Modal, {
    attachTo: host,
    props: { open: true, title: 'Body modal' }
  })

  await nextTick()

  expect(document.body.querySelector('.aheart-modal')).toBeTruthy()
  expect(host.querySelector('.aheart-modal')).toBeNull()

  wrapper.unmount()
  host.remove()
})

it('renders inline when getContainer is false', () => {
  const wrapper = mount(Modal, {
    props: { open: true, title: 'Inline modal', getContainer: false }
  })

  expect(wrapper.find('.aheart-modal').exists()).toBe(true)
  expect(wrapper.text()).toContain('Inline modal')
})

it('teleports to a getContainer function target', async () => {
  const container = document.createElement('section')
  document.body.appendChild(container)

  const wrapper = mount(Modal, {
    props: {
      open: true,
      title: 'Function container',
      getContainer: () => container
    }
  })

  await nextTick()

  expect(container.querySelector('.aheart-modal')).toBeTruthy()
  expect(container.textContent).toContain('Function container')

  wrapper.unmount()
  container.remove()
})

it('teleports to a selector container target', async () => {
  const container = document.createElement('section')
  container.id = 'modal-selector-root'
  document.body.appendChild(container)

  const wrapper = mount(Modal, {
    props: {
      open: true,
      title: 'Selector container',
      getContainer: '#modal-selector-root'
    }
  })

  await nextTick()

  expect(container.querySelector('.aheart-modal')).toBeTruthy()
  expect(container.textContent).toContain('Selector container')

  wrapper.unmount()
  container.remove()
})
```

- [ ] **Step 4: Run the focused test to verify RED**

Run:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: the new tests fail because `getContainer` is not implemented and the default Modal still renders inline.

### Task 2: Modal Get Container Implementation

**Files:**

- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`

- [ ] **Step 1: Add the public type and prop**

Add:

```ts
export type ModalGetContainer = HTMLElement | string | (() => HTMLElement) | false
```

Add `getContainer` to `modalProps`:

```ts
getContainer: {
  type: [String, Object, Function, Boolean] as PropType<ModalGetContainer>,
  default: undefined
},
```

- [ ] **Step 2: Wrap the existing root in Teleport**

In `modal.vue`, place `<Teleport :to="teleportTo" :disabled="!shouldTeleport">` around the current root `<div>` and close it after the root.

- [ ] **Step 3: Resolve the Teleport target**

Add these computed values in script setup:

```ts
const getDefaultContainer = () => (typeof document === 'undefined' ? false : document.body)
const resolvedContainer = computed(() => props.getContainer ?? getDefaultContainer())
const teleportTarget = computed(() => {
  const container = resolvedContainer.value

  return typeof container === 'function' ? container() : container
})
const shouldTeleport = computed(() => teleportTarget.value !== false)
const teleportTo = computed(() => (teleportTarget.value === false ? 'body' : teleportTarget.value))
```

- [ ] **Step 4: Run the focused test to verify GREEN**

Run:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: all Modal tests pass.

### Task 3: Docs and Generated Output

**Files:**

- Modify: `docs/components/modal.md`
- Generate: `packages/components/es/modal/*`
- Generate: `packages/components/lib/modal/*`

- [ ] **Step 1: Update API docs**

Add this API row after `modalRender`:

```md
| getContainer | 指定 Modal 挂载容器；传入 `false` 时保持内联渲染 | `HTMLElement` \| `string` \| `() => HTMLElement` \| `false` | `document.body` |
```

Add this type snippet after `ModalFooterRender`:

````md
### ModalGetContainer

```ts
type ModalGetContainer = HTMLElement | string | (() => HTMLElement) | false
```
````

- [ ] **Step 2: Build package output**

Run:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: component build completes and generated Modal files reflect the new prop and Teleport code.

- [ ] **Step 3: Revert unrelated generated declaration drift**

If Drawer/Form declaration files change again, run:

```bash
git diff -- packages/components/es/drawer packages/components/lib/drawer packages/components/es/form packages/components/lib/form | git apply -R
```

Expected: only Modal, docs, spec, and plan files remain changed.

### Task 4: Verification, Commit, Push, and Merge

**Files:**

- Stage only this phase's files.

- [ ] **Step 1: Run verification**

Run:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

From `docs/`, run:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../node_modules/.bin/vitepress build .
```

Expected: Modal focused tests, typecheck, full component tests, package build, and docs build all pass.

- [ ] **Step 2: Stage and commit**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-modal-get-container-design.md docs/superpowers/plans/2026-06-23-ant-style-modal-get-container.md docs/components/modal.md packages/components/src/modal packages/components/es/modal packages/components/lib/modal
git diff --cached --check
git commit -m "feat: align modal get container"
```

- [ ] **Step 3: Push and fast-forward merge**

Run:

```bash
git push origin codex/consolidated-ant-style-foundation
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

- [ ] **Step 4: Final state check**

Run:

```bash
git status -sb
git diff --check
git log --oneline --decorate -5
git branch -vv
```

Expected: worktree is clean and `HEAD`, `master`, `origin/master`, and `origin/codex/consolidated-ant-style-foundation` point at the new commit.

## Self-Review

- Spec coverage: the plan covers prop typing, Teleport behavior, tests, docs, generated outputs, verification, commit, push, and merge.
- Placeholder scan: no placeholder steps or vague implementation instructions remain.
- Type consistency: `ModalGetContainer`, `getContainer`, `teleportTarget`, `shouldTeleport`, and `teleportTo` are named consistently across tasks.
