# Ant Style Drawer Get Container Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style `getContainer` mounting support to `ADrawer`.

**Architecture:** Keep Drawer DOM and behavior intact, wrap it with Vue `Teleport`, and resolve the target from a typed `getContainer` prop. Existing behavior tests use a Teleport-stubbed helper, while new real Teleport tests prove default body, inline false, function target, and selector target behavior.

**Tech Stack:** Vue 3 SFC, TypeScript prop types, Vue Test Utils, Vitest, Vite package build, VitePress docs.

---

### Task 1: Drawer Get Container Tests

**Files:**

- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] **Step 1: Import `nextTick` and create a default mount helper**

Replace the imports and add the helper near the top:

```ts
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import Drawer from '../drawer.vue'

const mountDrawer = (options: Record<string, any> = {}) =>
  mount(Drawer, {
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

Replace existing `mount(Drawer, { ... })` calls with `mountDrawer({ ... })` for tests that inspect Drawer internals through `wrapper.find`.

- [ ] **Step 3: Add real Teleport tests**

Insert these tests before mask close behavior:

```ts
it('teleports to document body by default', async () => {
  const host = document.createElement('div')
  document.body.appendChild(host)

  const wrapper = mount(Drawer, {
    attachTo: host,
    props: { open: true, title: 'Body drawer' }
  })

  await nextTick()

  expect(document.body.querySelector('.aheart-drawer')).toBeTruthy()
  expect(host.querySelector('.aheart-drawer')).toBeNull()

  wrapper.unmount()
  host.remove()
})

it('renders inline when getContainer is false', () => {
  const wrapper = mount(Drawer, {
    props: { open: true, title: 'Inline drawer', getContainer: false }
  })

  expect(wrapper.find('.aheart-drawer').exists()).toBe(true)
  expect(wrapper.text()).toContain('Inline drawer')
})

it('teleports to a getContainer function target', async () => {
  const container = document.createElement('section')
  document.body.appendChild(container)

  const wrapper = mount(Drawer, {
    props: {
      open: true,
      title: 'Function container',
      getContainer: () => container
    }
  })

  await nextTick()

  expect(container.querySelector('.aheart-drawer')).toBeTruthy()
  expect(container.textContent).toContain('Function container')

  wrapper.unmount()
  container.remove()
})

it('teleports to a selector container target', async () => {
  const container = document.createElement('section')
  container.id = 'drawer-selector-root'
  document.body.appendChild(container)

  const wrapper = mount(Drawer, {
    props: {
      open: true,
      title: 'Selector container',
      getContainer: '#drawer-selector-root'
    }
  })

  await nextTick()

  expect(container.querySelector('.aheart-drawer')).toBeTruthy()
  expect(container.textContent).toContain('Selector container')

  wrapper.unmount()
  container.remove()
})
```

- [ ] **Step 4: Run focused test to verify RED**

Run:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: new `getContainer` tests fail because Drawer still renders inline and has no `getContainer` prop.

### Task 2: Drawer Get Container Implementation

**Files:**

- Modify: `packages/components/src/drawer/types.ts`
- Modify: `packages/components/src/drawer/drawer.vue`

- [ ] **Step 1: Add the public type and prop**

Add:

```ts
export type DrawerGetContainer = HTMLElement | string | (() => HTMLElement) | false
```

Add `getContainer` to `drawerProps` after `footer`:

```ts
getContainer: {
  type: [String, Object, Function, Boolean] as PropType<DrawerGetContainer>,
  default: undefined
},
```

- [ ] **Step 2: Wrap the existing root in Teleport**

In `drawer.vue`, place `<Teleport :to="teleportTo" :disabled="!shouldTeleport">` around the current root `<div>` and close it after the root.

- [ ] **Step 3: Resolve the Teleport target**

Add these computed values after `normalizeSize`:

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

- [ ] **Step 4: Run focused test to verify GREEN**

Run:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: all Drawer tests pass.

### Task 3: Docs and Generated Output

**Files:**

- Modify: `docs/components/drawer.md`
- Generate: `packages/components/es/drawer/*`
- Generate: `packages/components/lib/drawer/*`

- [ ] **Step 1: Update API docs**

Add this API row after `footer`:

```md
| getContainer | 指定 Drawer 挂载容器；传入 `false` 时保持内联渲染 | `HTMLElement` \| `string` \| `() => HTMLElement` \| `false` | `document.body` |
```

Add this type section after `DrawerSemanticPart`:

````md
### DrawerGetContainer

```ts
type DrawerGetContainer = HTMLElement | string | (() => HTMLElement) | false
```
````

- [ ] **Step 2: Build package output**

Run:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: component build completes and generated Drawer files reflect the new prop and Teleport code.

- [ ] **Step 3: Revert unrelated generated declaration drift**

If Form declaration files change again, run:

```bash
git diff -- packages/components/es/form packages/components/lib/form | git apply -R
```

Expected: only Drawer, docs, spec, and plan files remain changed.

### Task 4: Verification, Commit, Push, and Merge

**Files:**

- Stage only this phase's files.

- [ ] **Step 1: Run verification**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Run from `docs`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../node_modules/.bin/vitepress build .
```

Expected: Drawer focused tests, typecheck, full component tests, package build, and docs build all pass.

- [ ] **Step 2: Stage and commit**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-drawer-get-container-design.md docs/superpowers/plans/2026-06-23-ant-style-drawer-get-container.md docs/components/drawer.md packages/components/src/drawer packages/components/es/drawer packages/components/lib/drawer
git diff --cached --check
git commit -m "feat: align drawer get container"
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
- Placeholder scan: no placeholder or vague implementation steps remain.
- Type consistency: `DrawerGetContainer`, `getContainer`, `teleportTarget`, `shouldTeleport`, and `teleportTo` are named consistently across tasks.
