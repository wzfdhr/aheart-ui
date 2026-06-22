# Ant Style Tag Controls Semantic API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `ATag` closer to Ant Design Tag and add Vue exports for checkable tag and checkable tag group.

**Architecture:** Extend the existing Tag module in place. `ATag` remains a presentational tag with optional close action, `ACheckableTag` owns only controlled checked display and events, and `ATagGroup` normalizes options while managing uncontrolled group state only when neither `value` nor `modelValue` is supplied.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `ATag` `variant`, `bordered`, `disabled`, `href`, `target`, `rel`, `title`, `icon`, and `closeIcon`.
- `ATag` `className`, `rootClassName`, `style`, `classNames`, and `styles`.
- `ATag` semantic keys `root`, `icon`, `content`, and `close`.
- `ACheckableTag` controlled `checked` and `update:checked` / `change` events.
- `ATagGroup` `value`, `modelValue`, `defaultValue`, `multiple`, primitive options, option metadata, and semantic hooks.
- Docs and generated `es` / `lib` outputs.

This plan does not cover React-style dotted runtime aliases, drag sorting demos, or theme token tables beyond the existing docs style.

## Files

- Modify: `packages/components/src/tag/types.ts`
- Modify: `packages/components/src/tag/tag.vue`
- Create: `packages/components/src/tag/checkable-tag.vue`
- Create: `packages/components/src/tag/tag-group.vue`
- Modify: `packages/components/src/tag/index.ts`
- Modify: `packages/components/src/index.ts`
- Modify: `packages/components/src/tag/style.css`
- Modify: `packages/components/src/tag/__tests__/tag.test.ts`
- Modify: `docs/components/tag.md`
- Generated after build: `packages/components/es/tag/*`
- Generated after build: `packages/components/lib/tag/*`

## Task 1: Write Failing Tag Tests

- [ ] **Step 1: Add tests in `packages/components/src/tag/__tests__/tag.test.ts`**

Add tests that assert:

```ts
it('supports variant bordered link disabled and semantic styles', () => {
  const wrapper = mount(Tag, {
    props: {
      color: 'processing',
      variant: 'solid',
      href: 'https://example.com',
      target: '_blank',
      title: 'Linked tag',
      className: 'tag-class',
      rootClassName: 'tag-root',
      style: { marginTop: '4px' },
      classNames: {
        root: 'semantic-root',
        icon: 'semantic-icon',
        content: 'semantic-content'
      },
      styles: {
        root: { color: 'red' },
        icon: { fontSize: '12px' },
        content: { fontWeight: 600 }
      },
      icon: '!'
    },
    slots: {
      default: 'Linked'
    }
  })

  expect(wrapper.element.tagName).toBe('A')
  expect(wrapper.attributes('href')).toBe('https://example.com')
  expect(wrapper.attributes('target')).toBe('_blank')
  expect(wrapper.attributes('title')).toBe('Linked tag')
  expect(wrapper.classes()).toContain('tag-class')
  expect(wrapper.classes()).toContain('tag-root')
  expect(wrapper.classes()).toContain('semantic-root')
  expect(wrapper.classes()).toContain('aheart-tag--solid')
  expect(wrapper.classes()).toContain('aheart-tag--processing')
  expect(wrapper.attributes('style')).toContain('margin-top: 4px')
  expect(wrapper.attributes('style')).toContain('color: red')
  expect(wrapper.find('.aheart-tag__icon').classes()).toContain('semantic-icon')
  expect(wrapper.find('.aheart-tag__icon').attributes('style')).toContain('font-size: 12px')
  expect(wrapper.find('.aheart-tag__content').classes()).toContain('semantic-content')
  expect(wrapper.find('.aheart-tag__content').attributes('style')).toContain('font-weight: 600')
})

it('supports custom close icon and hides close icon when false', async () => {
  const wrapper = mount(Tag, {
    props: {
      closable: true,
      closeIcon: 'close',
      classNames: { close: 'semantic-close' },
      styles: { close: { color: 'blue' } }
    },
    slots: { default: 'Closable' }
  })
  const hiddenWrapper = mount(Tag, {
    props: {
      closable: true,
      closeIcon: false
    },
    slots: { default: 'Hidden' }
  })

  expect(wrapper.find('.aheart-tag__close').text()).toBe('close')
  expect(wrapper.find('.aheart-tag__close').classes()).toContain('semantic-close')
  expect(wrapper.find('.aheart-tag__close').attributes('style')).toContain('color: blue')
  expect(hiddenWrapper.find('.aheart-tag__close').exists()).toBe(false)

  await wrapper.find('.aheart-tag__close').trigger('click')
  expect(wrapper.emitted('close')).toHaveLength(1)
})

it('does not emit close or render anchor when disabled', async () => {
  const wrapper = mount(Tag, {
    props: {
      closable: true,
      disabled: true,
      href: 'https://example.com'
    },
    slots: { default: 'Disabled' }
  })

  expect(wrapper.element.tagName).toBe('SPAN')
  expect(wrapper.classes()).toContain('is-disabled')

  await wrapper.find('.aheart-tag__close').trigger('click')
  expect(wrapper.emitted('close')).toBeUndefined()
})

it('renders controlled checkable tag events and disabled state', async () => {
  const wrapper = mount(CheckableTag, {
    props: {
      checked: false,
      icon: '*'
    },
    slots: { default: 'Choice' }
  })

  expect(wrapper.classes()).not.toContain('is-checked')
  expect(wrapper.find('.aheart-tag__icon').text()).toBe('*')

  await wrapper.trigger('click')

  expect(wrapper.emitted('update:checked')?.[0]).toEqual([true])
  expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
  expect(wrapper.emitted('change')?.[0]?.[1]).toBeInstanceOf(MouseEvent)
})

it('supports TagGroup single default value primitive options and option metadata', async () => {
  const wrapper = mount(TagGroup, {
    props: {
      defaultValue: 'b',
      options: [
        'a',
        { label: 'Bee', value: 'b', className: 'option-class', style: { color: 'green' }, title: 'Bee title' }
      ],
      className: 'group-class',
      rootClassName: 'group-root',
      style: { gap: '8px' },
      classNames: { root: 'semantic-group', item: 'semantic-item', activeItem: 'semantic-active' },
      styles: { root: { color: 'red' }, item: { marginRight: '4px' }, activeItem: { fontWeight: 600 } }
    }
  })

  expect(wrapper.classes()).toContain('group-class')
  expect(wrapper.classes()).toContain('group-root')
  expect(wrapper.classes()).toContain('semantic-group')
  expect(wrapper.attributes('style')).toContain('gap: 8px')
  expect(wrapper.attributes('style')).toContain('color: red')
  expect(wrapper.text()).toContain('a')

  const tags = wrapper.findAllComponents(CheckableTag)
  expect(tags[1].classes()).toContain('is-checked')
  expect(tags[1].classes()).toContain('option-class')
  expect(tags[1].classes()).toContain('semantic-item')
  expect(tags[1].classes()).toContain('semantic-active')
  expect(tags[1].attributes('style')).toContain('color: green')
  expect(tags[1].attributes('style')).toContain('font-weight: 600')
  expect(tags[1].attributes('title')).toBe('Bee title')

  await tags[0].trigger('click')

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
  expect(wrapper.emitted('update:value')?.[0]).toEqual(['a'])
  expect(wrapper.emitted('change')?.[0]).toEqual(['a'])
  expect(tags[0].classes()).toContain('is-checked')
})

it('supports TagGroup multiple controlled value alias', async () => {
  const wrapper = mount(TagGroup, {
    props: {
      multiple: true,
      value: ['a'],
      modelValue: ['b'],
      options: ['a', 'b']
    }
  })

  const tags = wrapper.findAllComponents(CheckableTag)

  expect(tags[0].classes()).toContain('is-checked')
  expect(tags[1].classes()).not.toContain('is-checked')

  await tags[1].trigger('click')

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])
  expect(wrapper.emitted('update:value')?.[0]).toEqual([['a', 'b']])
  expect(wrapper.emitted('change')?.[0]).toEqual([['a', 'b']])
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- tag
```

Expected: the new tests fail because `CheckableTag`, `TagGroup`, Tag variants, link rendering, semantic hooks, and close icon behavior are missing.

## Task 2: Implement Tag APIs

- [ ] **Step 1: Extend `packages/components/src/tag/types.ts`**

Add `StyleValue` and `VNodeChild` imports. Define:

```ts
export type TagVariant = 'filled' | 'solid' | 'outlined'
export type TagValue = string | number
export type TagIcon = VNodeChild
export type TagSemanticPart = 'root' | 'icon' | 'content' | 'close'
export type TagGroupSemanticPart = 'root' | 'item' | 'activeItem'
export type TagClassNames = Partial<Record<TagSemanticPart, string>>
export type TagStyles = Partial<Record<TagSemanticPart, StyleValue>>
export type TagGroupClassNames = Partial<Record<TagGroupSemanticPart, string>>
export type TagGroupStyles = Partial<Record<TagGroupSemanticPart, StyleValue>>
export type TagGroupValue = TagValue | TagValue[] | null
export type TagRawOption = TagValue | TagOption
```

Add `TagOption` and props for Tag, CheckableTag, and TagGroup matching the spec.

- [ ] **Step 2: Update `packages/components/src/tag/tag.vue`**

Render dynamic `component :is="tagComponent"` with anchor attributes when enabled. Add semantic spans for icon, content, and close. Support custom close icon through prop or `closeIcon` slot. Skip close emission when disabled.

- [ ] **Step 3: Create `packages/components/src/tag/checkable-tag.vue`**

Render a button-like tag root with `aria-pressed`, controlled `checked`, icon support, semantic classes/styles, and `update:checked` / `change` emissions.

- [ ] **Step 4: Create `packages/components/src/tag/tag-group.vue`**

Normalize primitive/object options, resolve controlled and uncontrolled values, and render `ACheckableTag` items. Support single and multiple selection with `null` as the single-mode clear value.

- [ ] **Step 5: Update exports**

Update `packages/components/src/tag/index.ts` and `packages/components/src/index.ts` to export and install `CheckableTag` / `TagGroup`.

- [ ] **Step 6: Update styles**

Extend `packages/components/src/tag/style.css` with variant, disabled, anchor, icon, checkable, and group styles.

- [ ] **Step 7: Run targeted tests and typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- tag
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: targeted tests and typecheck pass.

## Task 3: Document And Build

- [ ] **Step 1: Update `docs/components/tag.md`**

Add examples for variants, link tags, custom close icons, checkable tags, tag groups, and semantic styling. Expand API, events, slots, options, and Semantic DOM tables.

- [ ] **Step 2: Build docs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build passes.

- [ ] **Step 3: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

Expected: `packages/components/es/tag/*` and `packages/components/lib/tag/*` update with the new APIs.

- [ ] **Step 4: Final verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
git status --short --branch
```

Expected: all commands pass and the worktree is clean after committing.
