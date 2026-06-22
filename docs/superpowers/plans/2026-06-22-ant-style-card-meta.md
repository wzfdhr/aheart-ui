# Ant Style Card Meta Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant Design `Card.Meta` parity with Vue-friendly props, slots, semantic hooks, and exports.

**Architecture:** Add a focused `meta.vue` subcomponent under `card`. Shared Card type definitions live in `types.ts`; `index.ts` installs and exports `CardMeta`, attaches it to `Card.Meta`, and the package root installs/exports both Card and CardMeta.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Files

- Create: `packages/components/src/card/meta.vue`
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

## Task 1: Write Failing Card.Meta Tests

- [ ] **Step 1: Update imports in `packages/components/src/card/__tests__/card.test.ts`**

Change:

```ts
import Card from '../card.vue'
```

To:

```ts
import Card, { CardMeta } from '../index'
```

- [ ] **Step 2: Add failing Card.Meta tests**

Append these tests inside the existing `describe('Card', () => { ... })` block:

```ts
  it('renders CardMeta avatar, title, and description props', () => {
    const wrapper = mount(CardMeta, {
      props: {
        avatar: h('span', { class: 'avatar-node' }, 'A'),
        title: 'Meta title',
        description: 'Meta description'
      }
    })

    expect(wrapper.classes()).toContain('aheart-card-meta')
    expect(wrapper.find('.aheart-card-meta__avatar .avatar-node').text()).toBe('A')
    expect(wrapper.find('.aheart-card-meta__title').text()).toBe('Meta title')
    expect(wrapper.find('.aheart-card-meta__description').text()).toBe('Meta description')
  })

  it('lets CardMeta slots override renderable props', () => {
    const wrapper = mount(CardMeta, {
      props: {
        avatar: 'prop avatar',
        title: 'prop title',
        description: 'prop description'
      },
      slots: {
        avatar: '<span class="slot-avatar">slot avatar</span>',
        title: '<strong class="slot-title">slot title</strong>',
        description: '<em class="slot-description">slot description</em>'
      }
    })

    expect(wrapper.find('.slot-avatar').text()).toBe('slot avatar')
    expect(wrapper.find('.slot-title').text()).toBe('slot title')
    expect(wrapper.find('.slot-description').text()).toBe('slot description')
    expect(wrapper.text()).not.toContain('prop title')
    expect(wrapper.text()).not.toContain('prop description')
  })

  it('applies CardMeta semantic classes and styles', () => {
    const wrapper = mount(CardMeta, {
      props: {
        avatar: 'A',
        title: 'Title',
        description: 'Description',
        className: 'meta-class',
        rootClassName: 'meta-root',
        style: { width: '180px' },
        classNames: {
          root: 'semantic-root',
          section: 'semantic-section',
          avatar: 'semantic-avatar',
          title: 'semantic-title',
          description: 'semantic-description'
        },
        styles: {
          root: { marginTop: '4px' },
          section: { gap: '2px' },
          avatar: { color: 'red' },
          title: { color: 'blue' },
          description: { color: 'green' }
        }
      }
    })

    expect(wrapper.classes()).toContain('meta-class')
    expect(wrapper.classes()).toContain('meta-root')
    expect(wrapper.classes()).toContain('semantic-root')
    expect(wrapper.attributes('style')).toContain('width: 180px')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.find('.aheart-card-meta__section').classes()).toContain('semantic-section')
    expect(wrapper.find('.aheart-card-meta__section').attributes('style')).toContain('gap: 2px')
    expect(wrapper.find('.aheart-card-meta__avatar').classes()).toContain('semantic-avatar')
    expect(wrapper.find('.aheart-card-meta__avatar').attributes('style')).toContain('color: red')
    expect(wrapper.find('.aheart-card-meta__title').classes()).toContain('semantic-title')
    expect(wrapper.find('.aheart-card-meta__title').attributes('style')).toContain('color: blue')
    expect(wrapper.find('.aheart-card-meta__description').classes()).toContain('semantic-description')
    expect(wrapper.find('.aheart-card-meta__description').attributes('style')).toContain('color: green')
  })

  it('exposes Card.Meta for Ant-style composition', () => {
    expect(Card.Meta).toBe(CardMeta)
  })
```

- [ ] **Step 3: Run focused Card tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- card
```

Expected: test run fails because `CardMeta` and `Card.Meta` do not exist yet.

## Task 2: Implement Card.Meta

- [ ] **Step 1: Extend `packages/components/src/card/types.ts`**

Add `VNodeChild`, semantic meta types, and props:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'

export type CardMetaSemanticPart = 'root' | 'section' | 'avatar' | 'title' | 'description'
export type CardMetaClassNames = Partial<Record<CardMetaSemanticPart, string>>
export type CardMetaStyles = Partial<Record<CardMetaSemanticPart, StyleValue>>

export const cardMetaProps = {
  avatar: [String, Number, Boolean, Object, Array, Function] as PropType<VNodeChild>,
  title: [String, Number, Boolean, Object, Array, Function] as PropType<VNodeChild>,
  description: [String, Number, Boolean, Object, Array, Function] as PropType<VNodeChild>,
  className: String,
  rootClassName: String,
  style: [String, Object, Array] as PropType<StyleValue>,
  classNames: Object as PropType<CardMetaClassNames>,
  styles: Object as PropType<CardMetaStyles>
} as const

export type CardMetaProps = ExtractPropTypes<typeof cardMetaProps>
```

- [ ] **Step 2: Create `packages/components/src/card/meta.vue`**

Create:

```vue
<template>
  <div class="aheart-card-meta" :class="metaClass" :style="rootStyle">
    <div v-if="hasAvatar" class="aheart-card-meta__avatar" :class="classNames?.avatar" :style="styles?.avatar">
      <slot name="avatar">
        <ARenderNode :node="avatar" />
      </slot>
    </div>
    <div v-if="hasSection" class="aheart-card-meta__section" :class="classNames?.section" :style="styles?.section">
      <div v-if="hasTitle" class="aheart-card-meta__title" :class="classNames?.title" :style="styles?.title">
        <slot name="title">
          <ARenderNode :node="title" />
        </slot>
      </div>
      <div v-if="hasDescription" class="aheart-card-meta__description" :class="classNames?.description" :style="styles?.description">
        <slot name="description">
          <ARenderNode :node="description" />
        </slot>
      </div>
      <slot v-if="!hasTitle && !hasDescription" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, useSlots, type PropType, type VNodeChild } from 'vue'
import { cardMetaProps } from './types'
import './style.css'

defineOptions({
  name: 'ACardMeta'
})

const props = defineProps(cardMetaProps)
const slots = useSlots()

const ARenderNode = defineComponent({
  name: 'ACardMetaRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})

const hasRenderable = (value: VNodeChild | undefined) => value !== undefined && value !== null && value !== false

const hasAvatar = computed(() => hasRenderable(props.avatar) || Boolean(slots.avatar))
const hasTitle = computed(() => hasRenderable(props.title) || Boolean(slots.title))
const hasDescription = computed(() => hasRenderable(props.description) || Boolean(slots.description))
const hasSection = computed(() => hasTitle.value || hasDescription.value || Boolean(slots.default))
const metaClass = computed(() => [props.className, props.rootClassName, props.classNames?.root])
const rootStyle = computed(() => [props.style, props.styles?.root])
</script>
```

- [ ] **Step 3: Update `packages/components/src/card/index.ts`**

Replace the file with:

```ts
import card from './card.vue'
import cardMeta from './meta.vue'
import { withInstall, type SFCWithInstall } from '../utils/install'

export const CardMeta = withInstall(cardMeta, 'ACardMeta')

type CardComponent = SFCWithInstall<typeof card> & {
  Meta: typeof CardMeta
}

const Card = withInstall(card, 'ACard') as CardComponent
Card.Meta = CardMeta

export { CardMeta as ACardMeta }
export type {
  CardAction,
  CardClassNames,
  CardMetaClassNames,
  CardMetaProps,
  CardMetaSemanticPart,
  CardMetaStyles,
  CardProps,
  CardSemanticPart,
  CardStyles,
  CardType,
  CardVariant
} from './types'
export default Card
```

- [ ] **Step 4: Update `packages/components/src/index.ts`**

Change the Card import:

```ts
import Card, { CardMeta } from './card'
```

Add `CardMeta` to the `components` array after `Card`, and add `CardMeta` to the final named export list.

- [ ] **Step 5: Add Card.Meta CSS to `packages/components/src/card/style.css`**

Append:

```css
.aheart-card-meta {
  display: flex;
  align-items: flex-start;
  gap: var(--aheart-spacing-md);
}

.aheart-card-meta__avatar {
  flex: 0 0 auto;
}

.aheart-card-meta__section {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 4px;
}

.aheart-card-meta__title {
  color: var(--aheart-color-text);
  font-weight: 600;
  line-height: var(--aheart-line-height);
}

.aheart-card-meta__description {
  color: var(--aheart-color-text-secondary);
  font-size: var(--aheart-font-size-sm);
  line-height: var(--aheart-line-height);
}
```

- [ ] **Step 6: Run focused tests and package typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- card
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: focused Card tests and component package typecheck pass.

- [ ] **Step 7: Commit implementation**

Run:

```bash
git add packages/components/src/card/types.ts packages/components/src/card/meta.vue packages/components/src/card/index.ts packages/components/src/card/style.css packages/components/src/card/__tests__/card.test.ts packages/components/src/index.ts
git commit -m "feat: add card meta parity"
```

## Task 3: Document And Build Outputs

- [ ] **Step 1: Update `docs/components/card.md`**

Add a `Card.Meta` example after the cover/actions section:

```md
## Meta 信息

<div class="aheart-demo-panel">
  <ACard hoverable>
    <ACardMeta title="Europe Street beat" description="www.instagram.com">
      <template #avatar>
        <AIcon name="user" />
      </template>
    </ACardMeta>
  </ACard>
</div>
```

Add `CardMeta` API and Slots tables with the props from the design.

- [ ] **Step 2: Run docs build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build passes.

- [ ] **Step 3: Run package build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: Card and root `es` / `lib` outputs update.

- [ ] **Step 4: Commit docs and generated outputs**

Run:

```bash
git add docs/components/card.md packages/components/es/card packages/components/lib/card packages/components/es/index.* packages/components/lib/index.* packages/components/es/style.css packages/components/lib/style.css
git commit -m "docs: document card meta APIs"
```

## Task 4: Final Verification

- [ ] **Step 1: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
git diff --check
git status --short --branch
```

Expected: all commands pass, whitespace check is clean, and the worktree is clean after committing.

## Self-Review

- Spec coverage: every Card.Meta requirement maps to a task.
- Placeholder scan: no placeholder steps remain.
- Type consistency: `CardMeta*` names are consistent across types, component, tests, docs, and exports.
- Scope: limited to Card.Meta, root export registration, docs, and generated outputs.
