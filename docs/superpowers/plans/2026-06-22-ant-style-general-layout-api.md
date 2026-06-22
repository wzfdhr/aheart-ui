# Ant Style General Layout API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Ant Design API parity for Button, Space, and Divider.

**Architecture:** Keep each component's existing file structure and backward-compatible props. Add Ant-style props in `types.ts`, express behavior through focused computed values in the component SFCs, and extend tests/docs/build output in small commits.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- Button Ant-style configuration additions
- Space Ant-style configuration additions
- Divider Ant-style configuration additions
- docs updates for those three components
- package build output refresh

This plan does not cover Button icon VNode props, loading delay objects, Space compact mode, custom VNode separators, or deeper component families.

## Task 1: Write Failing Tests

**Files:**
- Modify: `packages/components/src/button/__tests__/button.test.ts`
- Modify: `packages/components/src/space/__tests__/space.test.ts`
- Modify: `packages/components/src/divider/__tests__/divider.test.ts`

- [ ] **Step 1: Add Button tests**

Append to `packages/components/src/button/__tests__/button.test.ts`:

```ts
  it('supports Ant-style visual props and shapes', () => {
    const dashed = mount(Button, {
      props: { type: 'dashed', danger: true, ghost: true, shape: 'round' },
      slots: { default: 'Delete' }
    })

    expect(dashed.classes()).toContain('aheart-button--dashed')
    expect(dashed.classes()).toContain('is-danger')
    expect(dashed.classes()).toContain('is-ghost')
    expect(dashed.classes()).toContain('is-round')

    const circle = mount(Button, {
      props: { shape: 'circle' },
      slots: { default: 'i' }
    })

    expect(circle.classes()).toContain('is-circle')
  })

  it('renders anchor buttons from href and suppresses disabled clicks', async () => {
    const wrapper = mount(Button, {
      props: { href: 'https://example.com', target: '_blank', disabled: true },
      slots: { default: 'Docs' }
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('target')).toBe('_blank')

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('uses htmlType over nativeType for native buttons', () => {
    const wrapper = mount(Button, {
      props: { nativeType: 'button', htmlType: 'submit' }
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })
```

- [ ] **Step 2: Add Space tests**

Append to `packages/components/src/space/__tests__/space.test.ts`:

```ts
  it('renders separators between items', () => {
    const wrapper = mount(Space, {
      props: { separator: '|' },
      slots: { default: '<span>One</span><span>Two</span><span>Three</span>' }
    })

    expect(wrapper.findAll('.aheart-space__item')).toHaveLength(3)
    expect(wrapper.findAll('.aheart-space__separator')).toHaveLength(2)
    expect(wrapper.text()).toContain('|')
  })

  it('supports Ant-style orientation and vertical shortcut', () => {
    const oriented = mount(Space, {
      props: { orientation: 'vertical' },
      slots: { default: '<span>One</span><span>Two</span>' }
    })

    expect(oriented.classes()).toContain('aheart-space--vertical')

    const vertical = mount(Space, {
      props: { vertical: true },
      slots: { default: '<span>One</span><span>Two</span>' }
    })

    expect(vertical.classes()).toContain('aheart-space--vertical')
  })
```

- [ ] **Step 3: Add Divider tests**

Append to `packages/components/src/divider/__tests__/divider.test.ts`:

```ts
  it('supports Ant-style title placement margin variant and size', () => {
    const wrapper = mount(Divider, {
      props: {
        titlePlacement: 'start',
        orientationMargin: 24,
        variant: 'dotted',
        size: 'large'
      },
      slots: { default: 'Section' }
    })

    expect(wrapper.classes()).toContain('aheart-divider--start')
    expect(wrapper.classes()).toContain('aheart-divider--large')
    expect(wrapper.classes()).toContain('is-dotted')
    expect(wrapper.attributes('style')).toContain('--aheart-divider-orientation-margin: 24px')
  })

  it('supports vertical shortcut', () => {
    const wrapper = mount(Divider, {
      props: { vertical: true }
    })

    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.classes()).toContain('aheart-divider--vertical')
  })
```

- [ ] **Step 4: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- button space divider
```

Expected: FAIL because the new props and behavior are not implemented yet.

## Task 2: Implement Button Space Divider API Additions

**Files:**
- Modify: `packages/components/src/button/types.ts`
- Modify: `packages/components/src/button/button.vue`
- Modify: `packages/components/src/button/style.css`
- Modify: `packages/components/src/space/types.ts`
- Modify: `packages/components/src/space/space.vue`
- Modify: `packages/components/src/space/style.css`
- Modify: `packages/components/src/divider/types.ts`
- Modify: `packages/components/src/divider/divider.vue`
- Modify: `packages/components/src/divider/style.css`

- [ ] **Step 1: Implement Button props and rendering**

Add `dashed`, `link`, and `text` button types, `danger`, `ghost`, `shape`, `htmlType`, `href`, `target`, and click emission. Preserve existing props and classes.

- [ ] **Step 2: Implement Space orientation and separators**

Add `orientation`, `vertical`, `separator`, and `split`. Render separator nodes between normalized children.

- [ ] **Step 3: Implement Divider style additions**

Add `titlePlacement`, `orientationMargin`, `variant`, `size`, and `vertical`. Map existing aliases to the same behavior.

- [ ] **Step 4: Run targeted verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- button space divider
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit source**

```bash
git add packages/components/src/button packages/components/src/space packages/components/src/divider
git commit -m "feat: expand general layout component APIs"
```

## Task 3: Update Documentation

**Files:**
- Modify: `docs/components/button.md`
- Modify: `docs/components/space.md`
- Modify: `docs/components/divider.md`

- [ ] **Step 1: Update Button docs**

Document `dashed`, `link`, `text`, `danger`, `ghost`, `shape`, `htmlType`, `href`, and `target`.

- [ ] **Step 2: Update Space docs**

Document `orientation`, `vertical`, `separator`, and `split`.

- [ ] **Step 3: Update Divider docs**

Document `titlePlacement`, `orientationMargin`, `variant`, `size`, and `vertical`.

- [ ] **Step 4: Build docs and commit**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: PASS.

Then commit:

```bash
git add docs/components/button.md docs/components/space.md docs/components/divider.md
git commit -m "docs: document expanded general layout APIs"
```

## Task 4: Full Verification And Build Output

**Files:**
- Modify generated package output under `packages/components/es`
- Modify generated package output under `packages/components/lib`

- [ ] **Step 1: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: all commands exit 0.

- [ ] **Step 2: Check declaration output and docs exclusions**

Run:

```bash
test -f packages/components/es/button/index.d.ts && test -f packages/components/es/space/index.d.ts && test -f packages/components/es/divider/index.d.ts && test -f packages/components/lib/button/index.d.ts && test -f packages/components/lib/space/index.d.ts && test -f packages/components/lib/divider/index.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo declarations-and-docs-ok
```

Expected: `declarations-and-docs-ok`

- [ ] **Step 3: Remove generated VitePress cache**

Run:

```bash
test ! -d docs/.vitepress/cache || rm -rf docs/.vitepress/cache
```

- [ ] **Step 4: Commit build output**

```bash
git add packages/components/es packages/components/lib
git commit -m "build: update general layout api outputs"
```

## Self-Review

- Spec coverage: all Button, Space, and Divider API additions map to tests, implementation, docs, and build output tasks.
- Placeholder scan: the plan contains no TBD/TODO/fill-in placeholders.
- Type consistency: `ButtonShape`, `SpaceOrientation`, `DividerTitlePlacement`, `DividerVariant`, and `DividerSize` names are consistent across the plan.
