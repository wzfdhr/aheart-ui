# Ant Style Tooltip Popup Container Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style `getPopupContainer` popup mounting to Tooltip.

**Architecture:** Keep trigger ownership inside `tooltip.vue` and teleport only the popup subtree. Existing unit tests stub Teleport for local structure assertions, while two real Teleport tests verify the browser DOM mounting contract.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Tooltip Popup Container Tests

**Files:**
- Modify: `packages/components/src/tooltip/__tests__/tooltip.test.ts`

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
const mountTooltip = (options: Record<string, any> = {}) =>
  mount(Tooltip, {
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

Replace existing `mount(Tooltip, {` calls with `mountTooltip({` so current local popup assertions keep using a stubbed Teleport.

- [x] **Step 4: Add real Teleport tests**

Add before the arrow test:

```ts
  it('teleports popup to document body by default', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)

    const wrapper = mount(Tooltip, {
      attachTo: host,
      props: {
        open: true,
        title: 'Body tooltip'
      },
      slots: {
        default: '<button>Help</button>'
      }
    })

    await nextTick()

    expect(document.body.querySelector('.aheart-tooltip__popup')).toBeTruthy()
    expect(host.querySelector('.aheart-tooltip__popup')).toBeNull()

    wrapper.unmount()
    host.remove()
  })

  it('teleports popup to getPopupContainer target', async () => {
    const container = document.createElement('section')
    let triggerNode: HTMLElement | undefined
    document.body.appendChild(container)

    const wrapper = mount(Tooltip, {
      props: {
        open: true,
        title: 'Target tooltip',
        getPopupContainer: (node: HTMLElement) => {
          triggerNode = node
          return container
        }
      },
      slots: {
        default: '<button>Help</button>'
      }
    })

    await nextTick()

    expect(triggerNode?.classList.contains('aheart-tooltip__trigger')).toBe(true)
    expect(container.querySelector('.aheart-tooltip__popup')).toBeTruthy()
    expect(container.textContent).toContain('Target tooltip')

    wrapper.unmount()
    container.remove()
  })
```

- [x] **Step 5: Run focused Tooltip tests and confirm red**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/tooltip/__tests__/tooltip.test.ts
```

Expected: FAIL because the popup renders inline and `getPopupContainer` is not wired.

### Task 2: Tooltip Popup Container Runtime

**Files:**
- Modify: `packages/components/src/tooltip/types.ts`
- Modify: `packages/components/src/tooltip/tooltip.vue`

- [x] **Step 1: Add public type and prop**

Add to `types.ts`:

```ts
export type TooltipGetPopupContainer = (triggerNode: HTMLElement) => HTMLElement
```

Add to `tooltipProps` near `zIndex`:

```ts
  getPopupContainer: Function as PropType<TooltipGetPopupContainer>,
```

- [x] **Step 2: Add trigger ref and Teleport target**

In `tooltip.vue`, add `triggerRef` and target computations:

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

- [x] **Step 3: Wrap the popup in Teleport**

Add `ref="triggerRef"` to `.aheart-tooltip__trigger`.

Wrap the popup span with:

```vue
    <Teleport :to="teleportTo" :disabled="!shouldTeleport">
      <span
        v-if="shouldRenderPopup"
        v-show="visible"
        class="aheart-tooltip__popup"
        :class="popupClass"
        :style="popupStyle"
        role="tooltip"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        ...
      </span>
    </Teleport>
```

- [x] **Step 4: Run focused Tooltip tests and confirm green**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/tooltip/__tests__/tooltip.test.ts
```

Expected: PASS for the Tooltip suite.

### Task 3: Docs and Generated Output

**Files:**
- Modify: `docs/components/tooltip.md`
- Generated: `packages/components/es/tooltip/*`
- Generated: `packages/components/lib/tooltip/*`
- Generated: `packages/components/es/style.css`
- Generated: `packages/components/lib/style.css`

- [x] **Step 1: Update Tooltip docs**

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

Expected: build succeeds and generated Tooltip files include `getPopupContainer` and Teleport output.

### Task 4: Verification, Commit, Push, and Merge

**Files:**
- Stage Tooltip source/tests/docs, this stage's spec/plan, and generated Tooltip outputs.

- [x] **Step 1: Run verification**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/tooltip/__tests__/tooltip.test.ts
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
git add docs/superpowers/specs/2026-06-23-ant-style-tooltip-popup-container-design.md docs/superpowers/plans/2026-06-23-ant-style-tooltip-popup-container.md docs/components/tooltip.md packages/components/src/tooltip packages/components/es/tooltip packages/components/lib/tooltip packages/components/es/style.css packages/components/lib/style.css
git commit -m "feat: align tooltip popup container"
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
- Type consistency: `TooltipGetPopupContainer`, `getPopupContainer`, `triggerRef`, `popupContainer`, `shouldTeleport`, and `teleportTo` are consistent across tasks.
