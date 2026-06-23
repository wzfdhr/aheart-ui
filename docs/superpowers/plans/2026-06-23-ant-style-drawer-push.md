# Ant Style Drawer Push Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-compatible nested Drawer `push` behavior.

**Architecture:** Use Vue provide/inject inside `drawer.vue` so child Drawers report open state to the nearest parent Drawer even when Teleport moves DOM nodes. The parent tracks open nested children and appends a placement-aware push transform to the panel style when enabled.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Drawer Push Tests

**Files:**
- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] **Step 1: Add tests after the style alias tests**

```ts
  it('pushes a parent drawer when a nested drawer opens', async () => {
    const wrapper = mountDrawer({
      props: { open: true, title: 'Parent drawer' },
      slots: {
        default: () =>
          h(
            Drawer,
            { open: true, title: 'Child drawer', getContainer: false },
            { default: () => 'Child body' }
          )
      }
    })

    await nextTick()

    const panels = wrapper.findAll('.aheart-drawer__panel')

    expect(panels[0].attributes('style')).toContain('transform: translateX(-180px)')
    expect(panels[1].attributes('style')).not.toContain('translateX(-180px)')
  })

  it('does not push a parent drawer when push is false', async () => {
    const wrapper = mountDrawer({
      props: { open: true, title: 'Static parent', push: false },
      slots: {
        default: () =>
          h(
            Drawer,
            { open: true, title: 'Child drawer', getContainer: false },
            { default: () => 'Child body' }
          )
      }
    })

    await nextTick()

    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).not.toContain('transform:')
  })

  it('uses push distance with parent placement direction', async () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Left parent',
        placement: 'left',
        push: { distance: 96 }
      },
      slots: {
        default: () =>
          h(
            Drawer,
            { open: true, title: 'Child drawer', getContainer: false },
            { default: () => 'Child body' }
          )
      }
    })

    await nextTick()

    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain('transform: translateX(96px)')
  })

  it('preserves custom panel transforms before the push transform', async () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        title: 'Transformed parent',
        style: { transform: 'scale(0.98)' },
        push: { distance: '12vw' }
      },
      slots: {
        default: () =>
          h(
            Drawer,
            { open: true, title: 'Child drawer', getContainer: false },
            { default: () => 'Child body' }
          )
      }
    })

    await nextTick()

    expect(wrapper.find('.aheart-drawer__panel').attributes('style')).toContain(
      'transform: scale(0.98) translateX(calc(0px - 12vw))'
    )
  })
```

- [ ] **Step 2: Run the focused test and confirm red**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: FAIL because nested child drawers do not currently report open state and the parent panel does not include push transforms.

### Task 2: Drawer Push Types and Context

**Files:**
- Modify: `packages/components/src/drawer/types.ts`
- Modify: `packages/components/src/drawer/drawer.vue`

- [ ] **Step 1: Add push types and prop**

In `packages/components/src/drawer/types.ts`, add:

```ts
export interface DrawerPushConfig {
  distance?: number | string
}

export type DrawerPush = boolean | DrawerPushConfig
```

Then add the prop near `getContainer`:

```ts
  push: {
    type: [Boolean, Object] as PropType<DrawerPush>,
    default: undefined
  },
```

- [ ] **Step 2: Add a module-level injection key**

Add a normal script block before `<script setup lang="ts">` in `packages/components/src/drawer/drawer.vue`:

```ts
<script lang="ts">
import type { InjectionKey } from 'vue'

interface DrawerPushContext {
  setChildOpen: (id: symbol, open: boolean) => void
}

const DRAWER_PUSH_CONTEXT: InjectionKey<DrawerPushContext> = Symbol('ADrawerPushContext')
</script>
```

This key must live in module scope so every Drawer instance shares the same provide/inject key.

- [ ] **Step 3: Import Vue context helpers**

In the setup script of `packages/components/src/drawer/drawer.vue`, add `inject`, `onBeforeUnmount`, and `provide` to the Vue import list.

- [ ] **Step 4: Add local child tracking**

Add after `const panelRef`:

```ts
const parentPushContext = inject<DrawerPushContext | null>(DRAWER_PUSH_CONTEXT, null)
const drawerId = Symbol('ADrawer')
const openChildDrawers = ref(new Map<symbol, true>())

const setChildOpen = (id: symbol, open: boolean) => {
  const nextOpenChildren = new Map(openChildDrawers.value)

  if (open) {
    nextOpenChildren.set(id, true)
  } else {
    nextOpenChildren.delete(id)
  }

  openChildDrawers.value = nextOpenChildren
}

provide(DRAWER_PUSH_CONTEXT, { setChildOpen })
```

- [ ] **Step 5: Report this drawer open state to its parent**

Add after the existing `props.open` watcher or near the other watchers:

```ts
watch(
  () => props.open,
  (open) => {
    parentPushContext?.setChildOpen(drawerId, open)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  parentPushContext?.setChildOpen(drawerId, false)
})
```

### Task 3: Drawer Push Transform

**Files:**
- Modify: `packages/components/src/drawer/drawer.vue`

- [ ] **Step 1: Add distance helpers**

Add near `normalizeSize`:

```ts
const formatPushDistance = (distance: number | string, negative: boolean) => {
  if (typeof distance === 'number') {
    return `${negative ? '-' : ''}${distance}px`
  }

  return negative ? `calc(0px - ${distance})` : distance
}
```

- [ ] **Step 2: Add push computed values**

Add after `isVertical`:

```ts
const hasOpenChildDrawer = computed(() => openChildDrawers.value.size > 0)
const pushConfig = computed(() =>
  typeof props.push === 'object' && props.push !== null ? props.push : undefined
)
const isPushEnabled = computed(() => props.push !== false)
const resolvedPushDistance = computed(() => pushConfig.value?.distance ?? 180)
const pushTransform = computed(() => {
  if (!hasOpenChildDrawer.value || !isPushEnabled.value) {
    return undefined
  }

  switch (props.placement) {
    case 'left':
      return `translateX(${formatPushDistance(resolvedPushDistance.value, false)})`
    case 'top':
      return `translateY(${formatPushDistance(resolvedPushDistance.value, false)})`
    case 'bottom':
      return `translateY(${formatPushDistance(resolvedPushDistance.value, true)})`
    case 'right':
    default:
      return `translateX(${formatPushDistance(resolvedPushDistance.value, true)})`
  }
})
```

- [ ] **Step 3: Preserve existing transforms and append push transform**

Replace `panelStyle` with:

```ts
const panelStyle = computed(() => {
  const style = isVertical.value
    ? {
        ...props.style,
        ...props.drawerStyle,
        ...props.contentWrapperStyle,
        ...semanticStyle('section'),
        height: normalizeSize(props.height ?? resolvedSize.value)
      }
    : {
        ...props.style,
        ...props.drawerStyle,
        ...props.contentWrapperStyle,
        ...semanticStyle('section'),
        width: normalizeSize(props.width ?? resolvedSize.value)
      }

  if (!pushTransform.value) {
    return style
  }

  return {
    ...style,
    transform: [style.transform, pushTransform.value].filter(Boolean).join(' ')
  }
})
```

- [ ] **Step 4: Run the focused test and confirm green**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: PASS with all Drawer tests green.

### Task 4: Docs and Generated Output

**Files:**
- Modify: `docs/components/drawer.md`
- Generated: `packages/components/es/drawer/*`
- Generated: `packages/components/lib/drawer/*`

- [ ] **Step 1: Document `push`**

Add this API row after `getContainer`:

```md
| push | 嵌套抽屉打开时是否推动父级抽屉 | `boolean` \| `DrawerPushConfig` | `{ distance: 180 }` |
```

Add this type section after `DrawerGetContainer`:

```md
### DrawerPushConfig

```ts
interface DrawerPushConfig {
  distance?: number | string
}
```
```

- [ ] **Step 2: Refresh generated component output**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Drawer files include `push`, `DrawerPushConfig`, and `DrawerPush`.

### Task 5: Verification, Commit, Push, and Merge

**Files:**
- Stage only Drawer source/tests/docs, this stage's spec/plan, and generated Drawer outputs.

- [ ] **Step 1: Run verification**

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
git add docs/superpowers/specs/2026-06-23-ant-style-drawer-push-design.md docs/superpowers/plans/2026-06-23-ant-style-drawer-push.md docs/components/drawer.md packages/components/src/drawer packages/components/es/drawer packages/components/lib/drawer
git commit -m "feat: align drawer push behavior"
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

- Spec coverage: tests, implementation, docs, generated output, verification, commit, push, and merge are represented.
- Placeholder scan: no placeholder wording remains.
- Type consistency: `DrawerPushConfig`, `DrawerPush`, `push`, `distance`, `setChildOpen`, and `pushTransform` are named consistently across tasks.
