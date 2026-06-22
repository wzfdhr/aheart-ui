# Ant Style Card Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `ACardGrid` / `Card.Grid` parity for Ant Design Card grid tiles.

**Architecture:** Follow the existing `CardMeta` pattern: create a focused `grid.vue`, extend `types.ts`, wire named exports and the static `Card.Grid` property in `card/index.ts`, then register the component from the root package entry. The component owns only one tile and leaves layout composition to the surrounding `ACard` body.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `ACardGrid` component.
- `CardGrid` and `ACardGrid` named exports.
- `Card.Grid` static property.
- `hoverable` prop defaulting to `true`.
- `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- Semantic keys `root` and `content`.
- Card docs and generated package outputs.

This plan does not cover tabbed cards, selectable grid tiles, or card-level layout management.

## Files

- Create: `packages/components/src/card/grid.vue`
- Modify: `packages/components/src/card/types.ts`
- Modify: `packages/components/src/card/index.ts`
- Modify: `packages/components/src/card/style.css`
- Modify: `packages/components/src/card/__tests__/card.test.ts`
- Modify: `packages/components/src/index.ts`
- Modify: `docs/components/card.md`
- Generated after build: `packages/components/es/card/*`
- Generated after build: `packages/components/lib/card/*`
- Generated after build: `packages/components/es/index.*`
- Generated after build: `packages/components/lib/index.*`
- Generated after build: `packages/components/es/style.css`
- Generated after build: `packages/components/lib/style.css`

## Task 1: Write Failing Card.Grid Tests

- [ ] **Step 1: Add tests in `packages/components/src/card/__tests__/card.test.ts`**

Add `CardGrid` to the import:

```ts
import Card, { CardGrid, CardMeta } from '../index'
```

Add these tests near the existing CardMeta tests:

```ts
it('renders CardGrid slot content with hoverable default', () => {
  const wrapper = mount(CardGrid, {
    slots: {
      default: '<span class="grid-content">Tile</span>'
    }
  })

  expect(wrapper.classes()).toContain('aheart-card-grid')
  expect(wrapper.classes()).toContain('is-hoverable')
  expect(wrapper.find('.aheart-card-grid__content .grid-content').text()).toBe('Tile')
})

it('supports non-hoverable CardGrid and semantic hooks', () => {
  const wrapper = mount(CardGrid, {
    props: {
      hoverable: false,
      className: 'grid-class',
      rootClassName: 'grid-root',
      style: { width: '50%' },
      classNames: {
        root: 'semantic-root',
        content: 'semantic-content'
      },
      styles: {
        root: { padding: '20px' },
        content: { color: 'red' }
      }
    },
    slots: {
      default: 'Tile'
    }
  })

  expect(wrapper.classes()).not.toContain('is-hoverable')
  expect(wrapper.classes()).toEqual(expect.arrayContaining(['grid-class', 'grid-root', 'semantic-root']))
  expect(wrapper.attributes('style')).toContain('width: 50%')
  expect(wrapper.attributes('style')).toContain('padding: 20px')
  expect(wrapper.find('.aheart-card-grid__content').classes()).toContain('semantic-content')
  expect(wrapper.find('.aheart-card-grid__content').attributes('style')).toContain('color: red')
})

it('exposes Card.Grid for Ant-style composition', () => {
  expect(CardGrid).toBeDefined()
  expect(Card.Grid).toBeDefined()
  expect(Card.Grid).toBe(CardGrid)
})
```

- [ ] **Step 2: Add root install coverage**

Import the root package inside the same test file:

```ts
import AheartUI, { CardGrid as RootCardGrid } from '../../index'
```

Add:

```ts
it('installs CardGrid from the root plugin', () => {
  const app = {
    component: vi.fn(),
    use: vi.fn()
  } as unknown as App

  AheartUI.install?.(app)

  expect(RootCardGrid).toBe(CardGrid)
  expect((app.component as Mock).mock.calls.some((call) => call[0] === 'ACardGrid')).toBe(true)
})
```

Also import `type App` from Vue and `type Mock` / `vi` from Vitest.

- [ ] **Step 3: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- card
```

Expected: FAIL because `CardGrid` is not exported or implemented yet.

## Task 2: Implement Card.Grid

- [ ] **Step 1: Extend `packages/components/src/card/types.ts`**

Add:

```ts
export type CardGridSemanticPart = 'root' | 'content'
export type CardGridClassNames = Partial<Record<CardGridSemanticPart, string>>
export type CardGridStyles = Partial<Record<CardGridSemanticPart, StyleValue>>
```

Add:

```ts
export const cardGridProps = {
  hoverable: {
    type: Boolean,
    default: true
  },
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<CardGridClassNames>,
  styles: Object as PropType<CardGridStyles>
} as const
```

Add:

```ts
export type CardGridProps = ExtractPropTypes<typeof cardGridProps>
```

- [ ] **Step 2: Create `packages/components/src/card/grid.vue`**

Create:

```vue
<template>
  <div class="aheart-card-grid" :class="gridClass" :style="rootStyle">
    <div class="aheart-card-grid__content" :class="classNames?.content" :style="styles?.content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cardGridProps } from './types'
import './style.css'

defineOptions({
  name: 'ACardGrid'
})

const props = defineProps(cardGridProps)

const gridClass = computed(() => [
  props.className,
  props.rootClassName,
  props.classNames?.root,
  {
    'is-hoverable': props.hoverable
  }
])
const rootStyle = computed(() => [props.style, props.styles?.root])
</script>
```

- [ ] **Step 3: Update `packages/components/src/card/index.ts`**

Import `grid.vue`, wrap it with `withInstall`, add `Grid` to the static Card type, assign `Card.Grid`, export `CardGrid as ACardGrid`, and export the new CardGrid types.

- [ ] **Step 4: Update `packages/components/src/index.ts`**

Import `CardGrid`, add it to the `components` array, and include it in the named export list.

- [ ] **Step 5: Update `packages/components/src/card/style.css`**

Add styles for `.aheart-card-grid`, `.aheart-card-grid.is-hoverable:hover`, and `.aheart-card-grid__content`. The tile should use a quarter-width default, card border tokens, compact padding, and the same hover shadow language as `ACard`.

- [ ] **Step 6: Run targeted tests and package typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- card
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: both commands exit 0.

## Task 3: Document Card.Grid

- [ ] **Step 1: Update `docs/components/card.md`**

Add a “网格卡片” example after “Meta 信息”:

```vue
<template>
  <ACard title="Grid card">
    <ACardGrid>Content</ACardGrid>
    <ACardGrid :hoverable="false">No hover</ACardGrid>
  </ACard>
</template>
```

Add a `CardGrid API` table, `CardGrid Slots`, and `CardGrid Semantic DOM` sections.

- [ ] **Step 2: Run docs build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: command exits 0.

## Task 4: Build Outputs And Verify

- [ ] **Step 1: Run package build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: command exits 0 and generates CardGrid `es` / `lib` output.

- [ ] **Step 2: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
test -f packages/components/es/card/grid.vue.d.ts && test -f packages/components/lib/card/grid.vue.d.ts && rg -q "CardGrid" packages/components/es/card/index.d.ts packages/components/lib/card/index.d.ts
rm -rf docs/.vitepress/cache
git status --short --branch
git diff --check
```

Expected: all commands exit 0 and the worktree is clean after commits.

## Self-Review

- Spec coverage: every Card.Grid design requirement maps to a test, source task, docs task, or build verification.
- Placeholder scan: no unfinished placeholders.
- Type consistency: `CardGrid` names, semantic part names, and export names match the design.
