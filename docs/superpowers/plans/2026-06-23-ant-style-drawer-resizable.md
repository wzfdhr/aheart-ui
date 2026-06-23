# Ant Style Drawer Resizable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-compatible Drawer resize behavior with `resizable`, `maxSize`, callbacks, and the `dragger` semantic DOM part.

**Architecture:** Keep resize behavior inside `drawer.vue`. The panel owns a local resized size override, derives the active dimension from placement, listens to document pointer movement while dragging, and appends the resized width or height to the existing panel style calculation.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Drawer Resize Tests

**Files:**
- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [x] **Step 1: Import `vi`**

Replace the Vitest import with:

```ts
import { describe, expect, it, vi } from 'vitest'
```

- [x] **Step 2: Add tests after the push tests**

```ts
  it('resizes a right drawer with callbacks and maxSize', async () => {
    const onResizeStart = vi.fn()
    const onResize = vi.fn()
    const onResizeEnd = vi.fn()
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Resizable drawer',
        width: 320,
        maxSize: 360,
        resizable: {
          onResizeStart,
          onResize,
          onResizeEnd
        },
        classNames: {
          dragger: 'custom-dragger'
        },
        styles: {
          dragger: { backgroundColor: 'rgb(1, 2, 3)' }
        }
      }
    })

    const dragger = wrapper.find('.aheart-drawer__dragger')

    expect(dragger.exists()).toBe(true)
    expect(dragger.classes()).toEqual(expect.arrayContaining(['aheart-drawer__dragger--right', 'custom-dragger']))
    expect(dragger.attributes('style')).toContain('background-color: rgb(1, 2, 3)')

    await dragger.trigger('pointerdown', { clientX: 100, clientY: 0 })
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 20, clientY: 0 }))
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 20, clientY: 0 }))
    await nextTick()

    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('width: 360px')
    expect(onResizeStart).toHaveBeenCalledTimes(1)
    expect(onResize).toHaveBeenCalledWith(360)
    expect(onResizeEnd).toHaveBeenCalledTimes(1)
  })

  it('resizes a bottom drawer by dragging upward', async () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Bottom resizable drawer',
        placement: 'bottom',
        height: 200,
        resizable: true
      }
    })

    const dragger = wrapper.find('.aheart-drawer__dragger')

    await dragger.trigger('pointerdown', { clientX: 0, clientY: 100 })
    document.dispatchEvent(new MouseEvent('pointermove', { clientX: 0, clientY: 40 }))
    document.dispatchEvent(new MouseEvent('pointerup', { clientX: 0, clientY: 40 }))
    await nextTick()

    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('height: 260px')
  })

  it('does not render a resize dragger when resizable is disabled', () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Static drawer'
      }
    })

    expect(wrapper.find('.aheart-drawer__dragger').exists()).toBe(false)
  })
```

- [x] **Step 3: Run the focused test and confirm red**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: FAIL because Drawer does not expose `resizable`, `maxSize`, or `.aheart-drawer__dragger` yet.

### Task 2: Drawer Resize Types

**Files:**
- Modify: `packages/components/src/drawer/types.ts`

- [x] **Step 1: Add `dragger` to semantic parts**

Replace:

```ts
export const drawerSemanticParts = ['root', 'mask', 'section', 'header', 'title', 'extra', 'body', 'footer', 'close'] as const
```

With:

```ts
export const drawerSemanticParts = [
  'root',
  'mask',
  'section',
  'header',
  'title',
  'extra',
  'body',
  'footer',
  'dragger',
  'close'
] as const
```

- [x] **Step 2: Add resize types**

Add after `DrawerPush`:

```ts
export interface DrawerResizableConfig {
  onResizeStart?: () => void
  onResize?: (size: number) => void
  onResizeEnd?: () => void
}

export type DrawerResizable = boolean | DrawerResizableConfig
```

- [x] **Step 3: Add props**

Add near `push`:

```ts
  resizable: {
    type: [Boolean, Object] as PropType<DrawerResizable>,
    default: false
  },
  maxSize: {
    type: Number,
    default: undefined
  },
```

### Task 3: Drawer Resize Runtime

**Files:**
- Modify: `packages/components/src/drawer/drawer.vue`

- [x] **Step 1: Render the dragger**

Add this inside the `<section>` after the footer block:

```vue
          <button
            v-if="isResizable"
            :class="draggerClass"
            :style="semanticStyle('dragger')"
            type="button"
            aria-label="Resize drawer"
            @pointerdown="handleResizeStart"
          />
```

- [x] **Step 2: Add resize state and helpers**

Add after `panelRef`:

```ts
const resizedSize = ref<number>()
const resizeStart = ref<{ size: number; clientX: number; clientY: number } | null>(null)
```

Add near `normalizeSize`:

```ts
const parseNumericSize = (size: number | string | undefined) => {
  if (typeof size === 'number') {
    return size
  }

  const match = typeof size === 'string' ? size.trim().match(/^(\d+(?:\.\d+)?)(?:px)?$/) : null
  return match ? Number(match[1]) : undefined
}

const clampResizeSize = (size: number) => Math.max(0, props.maxSize ? Math.min(size, props.maxSize) : size)
```

- [x] **Step 3: Add resize computed values**

Add after `pushTransform`:

```ts
const resizableConfig = computed(() =>
  typeof props.resizable === 'object' && props.resizable !== null ? props.resizable : undefined
)
const isResizable = computed(() => props.resizable === true || resizableConfig.value !== undefined)
const currentBaseSize = computed(() => {
  const configuredSize = isVertical.value ? props.height ?? resolvedSize.value : props.width ?? resolvedSize.value
  return parseNumericSize(configuredSize) ?? parseNumericSize(resolvedSize.value) ?? 378
})
const activePanelSize = computed(() => resizedSize.value ?? currentBaseSize.value)
```

- [x] **Step 4: Use active panel size in panel style**

In `panelStyle`, replace both direct size assignments with:

```ts
height: `${activePanelSize.value}px`
```

and:

```ts
width: `${activePanelSize.value}px`
```

- [x] **Step 5: Add the dragger class**

Add after `footerClass`:

```ts
const draggerClass = computed(() => [
  'aheart-drawer__dragger',
  `aheart-drawer__dragger--${props.placement}`,
  { 'is-resizing': resizeStart.value !== null },
  semanticClass('dragger')
])
```

- [x] **Step 6: Add pointer handlers**

Add before `close`:

```ts
const getNextResizeSize = (event: PointerEvent | MouseEvent) => {
  const start = resizeStart.value

  if (!start) {
    return activePanelSize.value
  }

  switch (props.placement) {
    case 'left':
      return clampResizeSize(start.size + event.clientX - start.clientX)
    case 'top':
      return clampResizeSize(start.size + event.clientY - start.clientY)
    case 'bottom':
      return clampResizeSize(start.size + start.clientY - event.clientY)
    case 'right':
    default:
      return clampResizeSize(start.size + start.clientX - event.clientX)
  }
}

const handleResizeMove = (event: PointerEvent | MouseEvent) => {
  if (!resizeStart.value) {
    return
  }

  const nextSize = getNextResizeSize(event)
  resizedSize.value = nextSize
  resizableConfig.value?.onResize?.(nextSize)
}

const stopResize = () => {
  document.removeEventListener('pointermove', handleResizeMove)
  document.removeEventListener('pointerup', handleResizeEnd)
}

const handleResizeEnd = () => {
  if (!resizeStart.value) {
    return
  }

  stopResize()
  resizeStart.value = null
  resizableConfig.value?.onResizeEnd?.()
}

const handleResizeStart = (event: PointerEvent) => {
  if (!isResizable.value) {
    return
  }

  event.preventDefault()
  resizeStart.value = {
    size: activePanelSize.value,
    clientX: event.clientX,
    clientY: event.clientY
  }
  resizableConfig.value?.onResizeStart?.()
  document.addEventListener('pointermove', handleResizeMove)
  document.addEventListener('pointerup', handleResizeEnd)
}
```

Add to the existing `onBeforeUnmount` block:

```ts
  stopResize()
```

### Task 4: Drawer Resize Styles

**Files:**
- Modify: `packages/components/src/drawer/style.css`

- [x] **Step 1: Add dragger CSS**

Add after panel placement rules:

```css
.aheart-drawer__dragger {
  --aheart-drawer-dragger-size: 4px;
  position: absolute;
  z-index: 1;
  border: 0;
  padding: 0;
  background: transparent;
  transition: background-color 0.2s ease;
}

.aheart-drawer__dragger:hover,
.aheart-drawer__dragger.is-resizing {
  background: var(--aheart-color-primary, rgba(22, 119, 255, 0.35));
}

.aheart-drawer__dragger--right {
  top: 0;
  bottom: 0;
  left: calc(var(--aheart-drawer-dragger-size) / -2);
  width: var(--aheart-drawer-dragger-size);
  cursor: ew-resize;
}

.aheart-drawer__dragger--left {
  top: 0;
  right: calc(var(--aheart-drawer-dragger-size) / -2);
  bottom: 0;
  width: var(--aheart-drawer-dragger-size);
  cursor: ew-resize;
}

.aheart-drawer__dragger--top {
  right: 0;
  bottom: calc(var(--aheart-drawer-dragger-size) / -2);
  left: 0;
  height: var(--aheart-drawer-dragger-size);
  cursor: ns-resize;
}

.aheart-drawer__dragger--bottom {
  top: calc(var(--aheart-drawer-dragger-size) / -2);
  right: 0;
  left: 0;
  height: var(--aheart-drawer-dragger-size);
  cursor: ns-resize;
}
```

- [x] **Step 2: Run the focused test and confirm green**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: PASS with all Drawer tests green.

### Task 5: Docs and Generated Output

**Files:**
- Modify: `docs/components/drawer.md`
- Generated: `packages/components/es/drawer/*`
- Generated: `packages/components/lib/drawer/*`

- [x] **Step 1: Update Drawer docs**

Add API rows near `push`:

```md
| resizable | 是否允许拖拽调整抽屉尺寸 | `boolean` \| `DrawerResizableConfig` | `false` |
| maxSize | 可拖拽调整的最大宽度或高度 | `number` | - |
```

Add `dragger` to `DrawerSemanticPart`.

Add this type section after `DrawerPushConfig`:

```md
### DrawerResizableConfig

```ts
interface DrawerResizableConfig {
  onResizeStart?: () => void
  onResize?: (size: number) => void
  onResizeEnd?: () => void
}
```
```

- [x] **Step 2: Refresh generated component output**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Drawer files include resize props, types, dragger styles, and updated declarations.

### Task 6: Verification, Commit, Push, and Merge

**Files:**
- Stage only Drawer source/tests/styles/docs, this stage's spec/plan, and generated Drawer outputs.

- [x] **Step 1: Run verification**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
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
git add docs/superpowers/specs/2026-06-23-ant-style-drawer-resizable-design.md docs/superpowers/plans/2026-06-23-ant-style-drawer-resizable.md docs/components/drawer.md packages/components/src/drawer packages/components/es/drawer packages/components/lib/drawer
git commit -m "feat: align drawer resizable behavior"
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

- Spec coverage: tests, implementation, styles, docs, generated output, verification, commit, push, and merge are represented.
- Placeholder scan: no placeholder wording remains.
- Type consistency: `DrawerResizableConfig`, `DrawerResizable`, `resizable`, `maxSize`, `dragger`, `resizedSize`, and resize callback names are consistent across tasks.
