# Ant Style Card Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for source changes and superpowers:verification-before-completion before reporting completion. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style tabbed card controls to `ACard`.

**Architecture:** Extend the existing `card.vue` in place. Keep Card tabs as a small card-owned tabbar between the header and body, use local controlled/uncontrolled state for active keys, and reuse the existing slot body surface through `tab-{key}` slots plus item `children` fallback.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `CardTab`
- `CardTabProps`
- `CardTabSemanticPart`
- `tabList`
- `activeTabKey`
- `defaultActiveTabKey`
- `tabBarExtraContent`
- `tabProps`
- `update:activeTabKey`
- `tabChange`
- tab keyed content slots
- docs and generated package output refresh

This plan does not cover editable cards, overflow dropdowns, or route-aware tabs.

## Files

- Modify: `packages/components/src/card/types.ts`
- Modify: `packages/components/src/card/card.vue`
- Modify: `packages/components/src/card/style.css`
- Modify: `packages/components/src/card/__tests__/card.test.ts`
- Modify: `docs/components/card.md`
- Generated after build: `packages/components/es/card/*`
- Generated after build: `packages/components/lib/card/*`
- Generated after build: `packages/components/es/style.css`
- Generated after build: `packages/components/lib/style.css`

## Task 1: Write Failing Card Tabs Tests

- [ ] **Step 1: Add tests in `packages/components/src/card/__tests__/card.test.ts`**

Add these tests before the CardMeta tests:

```ts
it('renders tab list with first enabled tab and keyed slot content', () => {
  const wrapper = mount(Card, {
    props: {
      title: 'Tabbed',
      tabList: [
        { key: 'disabled', tab: 'Disabled', disabled: true },
        { key: 'overview', tab: 'Overview' },
        { key: 'settings', tab: 'Settings' }
      ]
    },
    slots: {
      default: 'Default content',
      'tab-overview': '<span class="overview-panel">Overview panel</span>',
      'tab-settings': '<span class="settings-panel">Settings panel</span>'
    }
  })

  expect(wrapper.find('.aheart-card__tabs').exists()).toBe(true)
  expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
  expect(wrapper.find('[aria-selected="true"]').text()).toContain('Overview')
  expect(wrapper.find('.overview-panel').text()).toBe('Overview panel')
  expect(wrapper.text()).not.toContain('Default content')
})

it('supports default active tab and emits tab changes when uncontrolled', async () => {
  const wrapper = mount(Card, {
    props: {
      tabList: [
        { key: 'overview', tab: 'Overview' },
        { key: 'settings', tab: 'Settings' }
      ],
      defaultActiveTabKey: 'settings'
    },
    slots: {
      'tab-overview': 'Overview panel',
      'tab-settings': 'Settings panel'
    }
  })

  expect(wrapper.find('[aria-selected="true"]').text()).toContain('Settings')

  await wrapper.findAll('[role="tab"]')[0].trigger('click')

  expect(wrapper.find('[aria-selected="true"]').text()).toContain('Overview')
  expect(wrapper.emitted('update:activeTabKey')?.[0]).toEqual(['overview'])
  expect(wrapper.emitted('tabChange')?.[0]).toEqual(['overview'])
})

it('keeps controlled active tab visual state after tab clicks', async () => {
  const wrapper = mount(Card, {
    props: {
      activeTabKey: 'overview',
      tabList: [
        { key: 'overview', tab: 'Overview' },
        { key: 'settings', tab: 'Settings' }
      ]
    },
    slots: {
      'tab-overview': 'Overview panel',
      'tab-settings': 'Settings panel'
    }
  })

  await wrapper.findAll('[role="tab"]')[1].trigger('click')

  expect(wrapper.find('[aria-selected="true"]').text()).toContain('Overview')
  expect(wrapper.emitted('update:activeTabKey')?.[0]).toEqual(['settings'])
  expect(wrapper.emitted('tabChange')?.[0]).toEqual(['settings'])
})

it('does not emit tab changes for disabled or active tabs', async () => {
  const wrapper = mount(Card, {
    props: {
      defaultActiveTabKey: 'overview',
      tabList: [
        { key: 'overview', tab: 'Overview' },
        { key: 'disabled', tab: 'Disabled', disabled: true }
      ]
    }
  })

  await wrapper.findAll('[role="tab"]')[0].trigger('click')
  await wrapper.findAll('[role="tab"]')[1].trigger('click')

  expect(wrapper.emitted('update:activeTabKey')).toBeUndefined()
  expect(wrapper.emitted('tabChange')).toBeUndefined()
})

it('renders tab item children, tab extra content, and tabProps hooks', async () => {
  const wrapper = mount(Card, {
    props: {
      tabBarExtraContent: 'Extra',
      tabProps: {
        className: 'tabs-class',
        rootClassName: 'tabs-root',
        style: { marginTop: '4px' },
        tabBarGutter: 20,
        classNames: {
          root: 'semantic-tabs',
          list: 'semantic-list',
          tab: 'semantic-tab',
          activeTab: 'semantic-active-tab',
          tabLabel: 'semantic-label',
          extra: 'semantic-extra'
        },
        styles: {
          root: { backgroundColor: 'rgb(250, 250, 250)' },
          list: { paddingInlineStart: '2px' },
          tab: { minWidth: '64px' },
          activeTab: { fontWeight: 700 },
          tabLabel: { color: 'red' },
          extra: { color: 'blue' }
        }
      },
      tabList: [
        { key: 'overview', tab: 'Overview', children: 'Overview children' },
        { key: 'settings', tab: 'Settings', children: 'Settings children' }
      ]
    },
    slots: {
      default: 'Default fallback'
    }
  })

  expect(wrapper.text()).toContain('Overview children')
  expect(wrapper.find('.aheart-card__tabs').classes()).toEqual(
    expect.arrayContaining(['tabs-class', 'tabs-root', 'semantic-tabs'])
  )
  expect(wrapper.find('.aheart-card__tabs').attributes('style')).toContain('margin-top: 4px')
  expect(wrapper.find('.aheart-card__tabs').attributes('style')).toContain('background-color: rgb(250, 250, 250)')
  expect(wrapper.find('.aheart-card__tab-list').attributes('style')).toContain('--aheart-card-tab-gutter: 20px')
  expect(wrapper.find('.aheart-card__tab-list').classes()).toContain('semantic-list')
  expect(wrapper.find('.aheart-card__tab').classes()).toContain('semantic-tab')
  expect(wrapper.find('.aheart-card__tab.is-active').classes()).toContain('semantic-active-tab')
  expect(wrapper.find('.aheart-card__tab-label').classes()).toContain('semantic-label')
  expect(wrapper.find('.aheart-card__tab-extra').classes()).toContain('semantic-extra')
  expect(wrapper.find('.aheart-card__tab-extra').text()).toBe('Extra')

  await wrapper.findAll('[role="tab"]')[1].trigger('click')

  expect(wrapper.text()).toContain('Settings children')
})

it('lets tabBarExtraContent slot override the prop and falls back to default slot', () => {
  const wrapper = mount(Card, {
    props: {
      tabBarExtraContent: 'Prop extra',
      tabList: [
        { key: 'overview', tab: 'Overview' }
      ]
    },
    slots: {
      default: '<span class="fallback-panel">Fallback panel</span>',
      tabBarExtraContent: '<button class="extra-slot">Action</button>'
    }
  })

  expect(wrapper.find('.extra-slot').exists()).toBe(true)
  expect(wrapper.find('.aheart-card__tab-extra').text()).toBe('Action')
  expect(wrapper.text()).not.toContain('Prop extra')
  expect(wrapper.find('.fallback-panel').text()).toBe('Fallback panel')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- card
```

Expected: the new tests fail because Card tab props and tabbar rendering are not implemented.

## Task 2: Implement Card Tabs

- [ ] **Step 1: Extend `packages/components/src/card/types.ts`**

Add `CardTab`, `CardTabSemanticPart`, `CardTabClassNames`, `CardTabStyles`, and `CardTabProps`. Add `tabList`, `activeTabKey`, `defaultActiveTabKey`, `tabBarExtraContent`, and `tabProps` to `cardProps`. Add `cardEmits` for `update:activeTabKey` and `tabChange`.

- [ ] **Step 2: Update `packages/components/src/card/card.vue`**

Use `defineEmits(cardEmits)`. Add controlled/uncontrolled active tab state, first-enabled key resolution, click handling, keyed slot content resolution, and a small local `ARenderNode` helper for renderable tab labels and extra content.

Render the tabbar after the card header and before body:

```vue
<div v-if="hasTabs" :class="tabRootClass" :style="tabRootStyle">
  <div :class="tabListClass" :style="tabListStyle" role="tablist">
    <button v-for="item in tabList" role="tab">...</button>
  </div>
  <div v-if="hasTabExtra" :class="tabExtraClass" :style="tabExtraStyle">...</div>
</div>
```

In body content, use keyed tab slot, item `children`, then default slot.

- [ ] **Step 3: Update `packages/components/src/card/style.css`**

Add styles for `.aheart-card__tabs`, `.aheart-card__tab-list`, `.aheart-card__tab`, `.aheart-card__tab.is-active`, `.aheart-card__tab-label`, and `.aheart-card__tab-extra`.

- [ ] **Step 4: Run targeted tests and component typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- card
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: both commands exit 0.

## Task 3: Document Card Tabs

- [ ] **Step 1: Update `docs/components/card.md`**

Add a “页签卡片” example showing `tab-list`, `default-active-tab-key`, keyed `tab-*` slots, `tab-bar-extra-content`, and `tab-props`. Add Card API rows, Events rows, `CardTab`, `CardTabProps`, and slot documentation.

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

Expected: command exits 0 and updates Card `es` / `lib` output.

- [ ] **Step 2: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
test -f packages/components/es/card/card.vue.d.ts && test -f packages/components/lib/card/card.vue.d.ts && rg -q "CardTabProps" packages/components/es/card/types.d.ts packages/components/lib/card/types.d.ts
rm -rf docs/.vitepress/cache
git status --short --branch
git diff --check
```

Expected: all commands exit 0 and the worktree is clean after commits.

## Self-Review

- Spec coverage: every Card tabs design requirement maps to tests, implementation, docs, or build verification.
- Placeholder scan: no unfinished placeholders.
- Type consistency: `CardTab`, `CardTabProps`, event names, and slot names match the spec.
