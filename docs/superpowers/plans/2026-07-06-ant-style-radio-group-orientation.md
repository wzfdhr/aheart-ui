# Ant Style Radio Group Orientation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `orientation` and `vertical` layout aliases to `ARadioGroup`.

**Architecture:** Keep the existing `direction` prop for compatibility. Add alias props in `types.ts`, compute `resolvedDirection` in `radio-group.vue`, and route only the layout class through the resolved value.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Files

- Modify: `packages/components/src/radio/types.ts`
- Modify: `packages/components/src/radio/radio-group.vue`
- Modify: `packages/components/src/radio/__tests__/radio.test.ts`
- Modify: `docs/components/radio.md`
- Generated after build: `packages/components/es/radio/*`
- Generated after build: `packages/components/lib/radio/*`

## Task 1: Add RadioGroup Orientation Aliases

- [ ] **Step 1: Write the failing test**

In `packages/components/src/radio/__tests__/radio.test.ts`, add a RadioGroup test:

```ts
it('supports RadioGroup orientation and vertical layout aliases', () => {
  const oriented = mount(RadioGroup, {
    props: {
      options: radioOptions,
      direction: 'horizontal',
      orientation: 'vertical'
    }
  })
  const verticalShortcut = mount(RadioGroup, {
    props: {
      options: radioOptions,
      direction: 'horizontal',
      vertical: true
    }
  })
  const orientationWins = mount(RadioGroup, {
    props: {
      options: radioOptions,
      direction: 'vertical',
      vertical: true,
      orientation: 'horizontal'
    }
  })

  expect(oriented.classes()).toContain('aheart-radio-group--vertical')
  expect(verticalShortcut.classes()).toContain('aheart-radio-group--vertical')
  expect(orientationWins.classes()).toContain('aheart-radio-group--horizontal')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
CI=true corepack pnpm --filter ./packages/components test -- radio
```

Expected: FAIL because `orientation` and `vertical` are not active props and the class still follows `direction`.

- [ ] **Step 3: Add alias props**

In `packages/components/src/radio/types.ts`, add:

```ts
export type RadioGroupOrientation = RadioGroupDirection
```

Add props:

```ts
orientation: String as PropType<RadioGroupOrientation>,
vertical: Boolean,
```

- [ ] **Step 4: Resolve direction in component**

In `packages/components/src/radio/radio-group.vue`, add:

```ts
const resolvedDirection = computed<RadioGroupDirection>(() =>
  props.orientation ?? (props.vertical ? 'vertical' : props.direction)
)
```

Then replace the group direction class with:

```ts
`aheart-radio-group--${resolvedDirection.value}`,
```

- [ ] **Step 5: Document the aliases**

In `docs/components/radio.md`, add RadioGroup API rows:

```md
| orientation | Ant 风格排列方向别名，优先级高于 `vertical` 和 `direction` | `horizontal` \| `vertical` | - |
| vertical | 是否垂直排列，优先级高于 `direction` | `boolean` | `false` |
```

- [ ] **Step 6: Run focused and full verification**

Run:

```bash
CI=true corepack pnpm --filter ./packages/components test -- radio
CI=true corepack pnpm --filter ./packages/components test
corepack pnpm --filter ./packages/components typecheck
corepack pnpm --filter ./packages/components build
corepack pnpm docs:build
git diff --check
```

Expected: all commands exit 0. Revert known unrelated Form/Modal declaration drift if the component build refreshes it.

- [ ] **Step 7: Commit and integrate**

Stage the spec, plan, source, tests, docs, and generated Radio output. Commit:

```bash
git commit -m "feat: align radio group orientation"
```

Push the feature branch, fast-forward merge to `master`, push `master`, then switch back to the feature branch.
