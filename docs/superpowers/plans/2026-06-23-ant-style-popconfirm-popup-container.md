# Ant Style Popconfirm Popup Container Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style `getPopupContainer` popup mounting to Popconfirm.

**Architecture:** Keep trigger ownership inside `popconfirm.vue` and teleport only the popup subtree. Existing unit tests stub Teleport for local structure assertions, while real Teleport tests verify body mounting, custom mounting, and hover handoff between trigger and popup.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Popconfirm Popup Container Tests

**Files:**
- Modify: `packages/components/src/popconfirm/__tests__/popconfirm.test.ts`

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

Add after imports:

```ts
const mountPopconfirm = (options: Record<string, any> = {}) =>
  mount(Popconfirm, {
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

Replace existing `mount(Popconfirm, {` calls with `mountPopconfirm({` so current local popup assertions keep using a stubbed Teleport.

- [x] **Step 4: Add real Teleport tests**

Add before the popup click test:

```ts
  it('teleports popup to document body by default', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(Popconfirm, {
      attachTo: host,
      props: {
        open: true,
        title: 'Body confirm'
      },
      slots: {
        default: '<button>Delete</button>'
      }
    })

    await nextTick()

    expect(document.body.querySelector('.aheart-popconfirm__popup')).toBeTruthy()
    expect(host.querySelector('.aheart-popconfirm__popup')).toBeNull()

    wrapper.unmount()
    host.remove()
  })

  it('teleports popup to getPopupContainer target', async () => {
    const container = document.createElement('section')
    let triggerNode: HTMLElement | undefined
    document.body.appendChild(container)

    const wrapper = mount(Popconfirm, {
      props: {
        open: true,
        title: 'Target title',
        description: 'Target description',
        getPopupContainer: (node: HTMLElement) => {
          triggerNode = node
          return container
        }
      },
      slots: {
        default: '<button>Delete</button>'
      }
    })

    await nextTick()

    expect(triggerNode?.classList.contains('aheart-popconfirm__trigger')).toBe(true)
    expect(container.querySelector('.aheart-popconfirm__popup')).toBeTruthy()
    expect(container.textContent).toContain('Target title')
    expect(container.textContent).toContain('Target description')

    wrapper.unmount()
    container.remove()
  })

  it('keeps hover popconfirm open when moving from trigger to popup', async () => {
    const container = document.createElement('section')
    document.body.appendChild(container)

    const wrapper = mount(Popconfirm, {
      props: {
        trigger: 'hover',
        title: 'Hover confirm',
        getPopupContainer: () => container
      },
      slots: {
        default: '<button>Delete</button>'
      }
    })

    await wrapper.find('.aheart-popconfirm__trigger').trigger('mouseenter')
    await nextTick()

    const popup = container.querySelector('.aheart-popconfirm__popup') as HTMLElement
    expect(popup).toBeTruthy()

    await wrapper.find('.aheart-popconfirm__trigger').trigger('mouseleave', { relatedTarget: popup })
    expect(container.querySelector('.aheart-popconfirm__popup')).toBeTruthy()

    popup.dispatchEvent(new MouseEvent('mouseleave', { relatedTarget: document.body }))
    await nextTick()
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false])

    wrapper.unmount()
    container.remove()
  })
```

- [x] **Step 5: Run focused Popconfirm tests and confirm red**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/popconfirm/__tests__/popconfirm.test.ts
```

Expected: FAIL because the popup renders inline, `getPopupContainer` is not wired, and hover leave does not account for a teleported popup.

### Task 2: Popconfirm Popup Container Runtime

**Files:**
- Modify: `packages/components/src/popconfirm/types.ts`
- Modify: `packages/components/src/popconfirm/popconfirm.vue`

- [x] **Step 1: Add public type and prop**

Add to `types.ts`:

```ts
export type PopconfirmGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement
```

Add to `popconfirmProps` near `zIndex`:

```ts
  getPopupContainer: Function as PropType<PopconfirmGetPopupContainer>,
```

- [x] **Step 2: Add refs and Teleport target**

In `popconfirm.vue`, add root, trigger, and popup refs plus target computations:

```ts
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
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

Add below `requestOpen`:

```ts
const containsRelatedTarget = (event: MouseEvent, element: HTMLElement | null) =>
  event.relatedTarget instanceof Node && Boolean(element?.contains(event.relatedTarget))

const isHoveringTriggerOrPopup = (event: MouseEvent) =>
  containsRelatedTarget(event, rootRef.value) || containsRelatedTarget(event, popupRef.value)
```

Update `handleMouseLeave` to accept the event:

```ts
const handleMouseLeave = (event: MouseEvent) => {
  if (normalizedTriggers.value.has('hover') && !isHoveringTriggerOrPopup(event)) {
    requestOpen(false)
  }
}
```

- [x] **Step 4: Wrap the popup in Teleport**

Add refs to template:

```vue
  <span
    ref="rootRef"
    class="aheart-popconfirm"
```

```vue
    <span
      ref="triggerRef"
      class="aheart-popconfirm__trigger"
```

Wrap the popup span with:

```vue
    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <span
        v-if="visible"
        ref="popupRef"
        class="aheart-popconfirm__popup"
        :class="popupClass"
        :style="popupStyle"
        role="dialog"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @click="handlePopupClick"
      >
        ...
      </span>
    </Teleport>
```

- [x] **Step 5: Run focused Popconfirm tests and confirm green**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/popconfirm/__tests__/popconfirm.test.ts
```

Expected: PASS for the Popconfirm suite.

### Task 3: Docs and Generated Output

**Files:**
- Modify: `docs/components/popconfirm.md`
- Generated: `packages/components/es/popconfirm/*`
- Generated: `packages/components/lib/popconfirm/*`
- Generated: `packages/components/es/style.css`
- Generated: `packages/components/lib/style.css`

- [x] **Step 1: Update Popconfirm docs**

Add an API row after `zIndex`:

```md
| getPopupContainer | 指定浮层挂载容器 | `(triggerNode: HTMLElement) => HTMLElement` | `document.body` |
```

- [x] **Step 2: Refresh generated component output**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Popconfirm files include `getPopupContainer` and Teleport output.

### Task 4: Verification, Commit, Push, and Merge

**Files:**
- Stage Popconfirm source/tests/docs, this stage's spec/plan, and generated Popconfirm outputs.

- [x] **Step 1: Run verification**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/popconfirm/__tests__/popconfirm.test.ts
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
git add docs/superpowers/specs/2026-06-23-ant-style-popconfirm-popup-container-design.md docs/superpowers/plans/2026-06-23-ant-style-popconfirm-popup-container.md docs/components/popconfirm.md packages/components/src/popconfirm packages/components/es/popconfirm packages/components/lib/popconfirm packages/components/es/style.css packages/components/lib/style.css
git commit -m "feat: align popconfirm popup container"
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

- Spec coverage: all Popconfirm popup container design requirements map to tests, runtime code, docs, generated output, and verification tasks.
- Placeholder scan: no TBD/TODO/fill-in placeholders remain.
- Type consistency: `PopconfirmGetPopupContainer`, `getPopupContainer`, `rootRef`, `triggerRef`, `popupRef`, `popupContainer`, `shouldTeleport`, and `teleportTo` are consistent across tasks.
