# Ant Style Popover Popup Container Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style `getPopupContainer` popup mounting to Popover.

**Architecture:** Keep trigger ownership inside `popover.vue` and teleport only the popup subtree. Existing unit tests stub Teleport for local structure assertions, while two real Teleport tests verify the browser DOM mounting contract.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Popover Popup Container Tests

**Files:**
- Modify: `packages/components/src/popover/__tests__/popover.test.ts`

- [ ] **Step 1: Import `nextTick`**

Replace:

```ts
import { h } from 'vue'
```

With:

```ts
import { h, nextTick } from 'vue'
```

- [ ] **Step 2: Add a Teleport-stubbed mount helper**

Add after imports:

```ts
const mountPopover = (options: Record<string, any> = {}) =>
  mount(Popover, {
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

- [ ] **Step 3: Update existing local structure tests**

Replace existing `mount(Popover, {` calls with `mountPopover({` so current local popup assertions keep using a stubbed Teleport.

- [ ] **Step 4: Add real Teleport tests**

Add before the arrow test:

```ts
  it('teleports popup to document body by default', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(Popover, {
      attachTo: host,
      props: {
        open: true,
        content: 'Body popover'
      },
      slots: {
        default: '<button>Details</button>'
      }
    })

    await nextTick()

    expect(document.body.querySelector('.aheart-popover__popup')).toBeTruthy()
    expect(host.querySelector('.aheart-popover__popup')).toBeNull()

    wrapper.unmount()
    host.remove()
  })

  it('teleports popup to getPopupContainer target', async () => {
    const container = document.createElement('section')
    let triggerNode: HTMLElement | undefined
    document.body.appendChild(container)

    const wrapper = mount(Popover, {
      props: {
        open: true,
        title: 'Target title',
        content: 'Target content',
        getPopupContainer: (node: HTMLElement) => {
          triggerNode = node
          return container
        }
      },
      slots: {
        default: '<button>Details</button>'
      }
    })

    await nextTick()

    expect(triggerNode?.classList.contains('aheart-popover__trigger')).toBe(true)
    expect(container.querySelector('.aheart-popover__popup')).toBeTruthy()
    expect(container.textContent).toContain('Target title')
    expect(container.textContent).toContain('Target content')

    wrapper.unmount()
    container.remove()
  })
```

- [ ] **Step 5: Run focused Popover tests and confirm red**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/popover/__tests__/popover.test.ts
```

Expected: FAIL because the popup renders inline and `getPopupContainer` is not wired.

### Task 2: Popover Popup Container Runtime

**Files:**
- Modify: `packages/components/src/popover/types.ts`
- Modify: `packages/components/src/popover/popover.vue`

- [ ] **Step 1: Add public type and prop**

Add to `types.ts`:

```ts
export type PopoverGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement
```

Add to `popoverProps` near `zIndex`:

```ts
  getPopupContainer: Function as PropType<PopoverGetPopupContainer>,
```

- [ ] **Step 2: Add trigger ref and Teleport target**

In `popover.vue`, add `triggerRef` and target computations:

```ts
const triggerRef = ref<HTMLElement | null>(null)
const getDefaultPopupContainer = () => (typeof document === 'undefined' ? false : document.body)
const popupContainer = computed(() => {
  if (props.getPopupContainer && triggerRef.value) {
    return props.getPopupContainer(triggerRef.value)
  }

  return getDefaultPopupContainer()
})
const shouldTeleport = computed(() => popupContainer.value !== false)
const teleportTo = computed(() => (popupContainer.value === false ? 'body' : popupContainer.value))
```

- [ ] **Step 3: Wrap the popup in Teleport**

Add `ref="triggerRef"` to `.aheart-popover__trigger`.

Wrap the popup span with:

```vue
    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <span
        v-if="shouldRenderPopup"
        v-show="visible"
        class="aheart-popover__popup"
        :class="popupClass"
        :style="popupStyle"
        role="dialog"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        ...
      </span>
    </Teleport>
```

- [ ] **Step 4: Run focused Popover tests and confirm green**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/popover/__tests__/popover.test.ts
```

Expected: PASS for the Popover suite.

### Task 3: Docs and Generated Output

**Files:**
- Modify: `docs/components/popover.md`
- Generated: `packages/components/es/popover/*`
- Generated: `packages/components/lib/popover/*`
- Generated: `packages/components/es/style.css`
- Generated: `packages/components/lib/style.css`

- [ ] **Step 1: Update Popover docs**

Add an API row after `zIndex`:

```md
| getPopupContainer | 指定浮层挂载容器 | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
```

- [ ] **Step 2: Refresh generated component output**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Popover files include `getPopupContainer` and Teleport output.

### Task 4: Verification, Commit, Push, and Merge

**Files:**
- Stage Popover source/tests/docs, this stage's spec/plan, and generated Popover outputs.

- [ ] **Step 1: Run verification**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/popover/__tests__/popover.test.ts
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
cd ../../docs
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node_modules/.bin/vitepress build .
cd ..
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 2: Commit and publish**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-popover-popup-container-design.md docs/superpowers/plans/2026-06-23-ant-style-popover-popup-container.md docs/components/popover.md packages/components/src/popover packages/components/es/popover packages/components/lib/popover packages/components/es/style.css packages/components/lib/style.css
git commit -m "feat: align popover popup container"
git push origin codex/consolidated-ant-style-foundation
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

Expected: the work branch and `master` both point to the new stage commit.

## Self Review

- Spec coverage: tests, type changes, Teleport runtime, docs, generated output, verification, commit, push, and merge are represented.
- Placeholder scan: no placeholder wording remains.
- Type consistency: `PopoverGetPopupContainer`, `getPopupContainer`, `triggerRef`, `popupContainer`, `shouldTeleport`, and `teleportTo` are consistent across tasks.
