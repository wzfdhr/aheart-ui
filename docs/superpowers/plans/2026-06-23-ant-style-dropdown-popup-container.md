# Ant Style Dropdown Popup Container Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style `getPopupContainer` popup mounting to Dropdown.

**Architecture:** Keep trigger ownership inside `dropdown.vue` and teleport only the overlay subtree. Existing unit tests stub Teleport for local structure assertions, while real Teleport tests verify body mounting, custom mounting, and hover handoff between trigger and overlay.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Dropdown Popup Container Tests

**Files:**
- Modify: `packages/components/src/dropdown/__tests__/dropdown.test.ts`

- [x] **Step 1: Import `nextTick`**

Replace:

```ts
import { h } from 'vue'
```

With:

```ts
import { h, nextTick } from 'vue'
```

- [x] **Step 2: Add a Teleport-stubbed mount helper**

Add after the `menu` fixture:

```ts
const mountDropdown = (options: Record<string, any> = {}) =>
  mount(Dropdown, {
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

- [x] **Step 3: Update existing local structure tests**

Replace existing `mount(Dropdown, {` calls with `mountDropdown({` so current local overlay assertions keep using a stubbed Teleport. Keep the `mount(ConfigProvider, ...)` test unchanged because it mounts the provider, not Dropdown directly.

- [x] **Step 4: Add real Teleport tests**

Add before the ConfigProvider disabled fallback test:

```ts
  it('teleports overlay to document body by default', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(Dropdown, {
      attachTo: host,
      props: {
        open: true,
        menu
      },
      slots: {
        default: '<button>Actions</button>'
      }
    })

    await nextTick()

    expect(document.body.querySelector('.aheart-dropdown__overlay')).toBeTruthy()
    expect(host.querySelector('.aheart-dropdown__overlay')).toBeNull()

    wrapper.unmount()
    host.remove()
  })

  it('teleports overlay to getPopupContainer target', async () => {
    const container = document.createElement('section')
    let triggerNode: HTMLElement | undefined
    document.body.appendChild(container)

    const wrapper = mount(Dropdown, {
      props: {
        open: true,
        menu,
        getPopupContainer: (node: HTMLElement) => {
          triggerNode = node
          return container
        }
      },
      slots: {
        default: '<button>Actions</button>'
      }
    })

    await nextTick()

    expect(triggerNode?.classList.contains('aheart-dropdown__trigger')).toBe(true)
    expect(container.querySelector('.aheart-dropdown__overlay')).toBeTruthy()
    expect(container.textContent).toContain('Edit')
    expect(container.textContent).toContain('Archive')

    wrapper.unmount()
    container.remove()
  })

  it('keeps hover dropdown open when moving from trigger to overlay', async () => {
    const container = document.createElement('section')
    document.body.appendChild(container)

    const wrapper = mount(Dropdown, {
      props: {
        menu,
        getPopupContainer: () => container
      },
      slots: {
        default: '<button>Actions</button>'
      }
    })

    await wrapper.find('.aheart-dropdown__trigger').trigger('mouseenter')
    await nextTick()

    const overlay = container.querySelector('.aheart-dropdown__overlay') as HTMLElement
    expect(overlay).toBeTruthy()

    await wrapper.find('.aheart-dropdown__trigger').trigger('mouseleave', { relatedTarget: overlay })
    expect(container.querySelector('.aheart-dropdown__overlay')).toBeTruthy()

    overlay.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }))
    await nextTick()

    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false, { source: 'trigger' }])

    wrapper.unmount()
    container.remove()
  })
```

- [x] **Step 5: Run focused Dropdown tests and confirm red**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/dropdown/__tests__/dropdown.test.ts
```

Expected: FAIL because the overlay renders inline, `getPopupContainer` is not wired, and hover leave does not account for a teleported overlay.

### Task 2: Dropdown Popup Container Runtime

**Files:**
- Modify: `packages/components/src/dropdown/types.ts`
- Modify: `packages/components/src/dropdown/dropdown.vue`

- [x] **Step 1: Add public type and prop**

Add to `types.ts`:

```ts
export type DropdownGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement
```

Add to `dropdownProps` near `placement`:

```ts
  getPopupContainer: Function as PropType<DropdownGetPopupContainer>,
```

- [x] **Step 2: Add refs and Teleport target**

In `dropdown.vue`, add root, trigger, and overlay refs plus target computations:

```ts
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
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

- [x] **Step 3: Add hover containment helper**

Add below `setOpen`:

```ts
const containsRelatedTarget = (event: MouseEvent, element: HTMLElement | null) =>
  event.relatedTarget instanceof Node && Boolean(element?.contains(event.relatedTarget))

const isHoveringTriggerOrOverlay = (event: MouseEvent) =>
  containsRelatedTarget(event, rootRef.value) || containsRelatedTarget(event, overlayRef.value)
```

Update `handleMouseLeave` to accept the event:

```ts
const handleMouseLeave = (event: MouseEvent) => {
  if (triggerSet.value.has('hover') && !isHoveringTriggerOrOverlay(event)) {
    setOpen(false, { source: 'trigger' })
  }
}
```

- [x] **Step 4: Wrap the overlay in Teleport**

Add refs to template:

```vue
  <div
    ref="rootRef"
    class="aheart-dropdown"
```

```vue
    <span
      ref="triggerRef"
      class="aheart-dropdown__trigger"
```

Wrap the overlay with:

```vue
    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <div
        v-if="shouldRenderOverlay"
        v-show="mergedOpen"
        ref="overlayRef"
        class="aheart-dropdown__overlay"
        :class="overlayClass"
        :style="overlayStyle"
        role="presentation"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        ...
      </div>
    </Teleport>
```

- [x] **Step 5: Run focused Dropdown tests and confirm green**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/dropdown/__tests__/dropdown.test.ts
```

Expected: PASS for the Dropdown suite.

### Task 3: Docs and Generated Output

**Files:**
- Modify: `docs/components/dropdown.md`
- Generated: `packages/components/es/dropdown/*`
- Generated: `packages/components/lib/dropdown/*`
- Generated: `packages/components/es/style.css`
- Generated: `packages/components/lib/style.css`

- [x] **Step 1: Update Dropdown docs**

Add an API row after `placement`:

```md
| getPopupContainer | 指定浮层挂载容器 | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
```

- [x] **Step 2: Refresh generated component output**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Dropdown files include `getPopupContainer` and Teleport output.

### Task 4: Verification, Commit, Push, and Merge

**Files:**
- Stage Dropdown source/tests/docs, this stage's spec/plan, and generated Dropdown outputs.

- [x] **Step 1: Run verification**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/dropdown/__tests__/dropdown.test.ts
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
cd ../../docs
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node_modules/.bin/vitepress build .
cd ..
git diff --check
```

Expected: all commands exit 0.

- [x] **Step 2: Commit and publish**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-dropdown-popup-container-design.md docs/superpowers/plans/2026-06-23-ant-style-dropdown-popup-container.md docs/components/dropdown.md packages/components/src/dropdown packages/components/es/dropdown packages/components/lib/dropdown packages/components/es/style.css packages/components/lib/style.css
git commit -m "feat: align dropdown popup container"
git push origin codex/consolidated-ant-style-foundation
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

Expected: the work branch and master both point at the new commit.

## Self Review

- Spec coverage: all Dropdown popup container design requirements map to tests, runtime code, docs, generated output, and verification tasks.
- Placeholder scan: no TBD/TODO/fill-in placeholders remain.
- Type consistency: `DropdownGetPopupContainer`, `getPopupContainer`, `rootRef`, `triggerRef`, `overlayRef`, `popupContainer`, `shouldTeleport`, and `teleportTo` are consistent across tasks.
