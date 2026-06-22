# Ant Style Typography Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style root customization, `mark`, and object ellipsis foundation support to Typography primitives.

**Architecture:** Keep the current one-file-per-primitive structure. Add shared Typography root hook types in `types.ts`, then apply root classes/styles inside each primitive with small local computed helpers.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `className`, `rootClassName`, `style`, `classNames`, and `styles` on Typography primitives.
- `TypographySemanticPart = 'root'`.
- Object or function semantic maps using `{ props }`.
- `mark` on `ATitle`, `AText`, and `AParagraph`.
- `type` and `disabled` on `ATitle`.
- `AParagraph :ellipsis="{ rows }"` multiline styling.
- Docs and generated package output refresh.

This plan does not cover `copyable`, `editable`, expandable ellipsis controls, suffix, or onEllipsis callbacks.

## Files

- Modify: `packages/components/src/typography/types.ts`
- Modify: `packages/components/src/typography/typography.vue`
- Modify: `packages/components/src/typography/title.vue`
- Modify: `packages/components/src/typography/text.vue`
- Modify: `packages/components/src/typography/paragraph.vue`
- Modify: `packages/components/src/typography/link.vue`
- Modify: `packages/components/src/typography/style.css`
- Modify: `packages/components/src/typography/index.ts`
- Modify: `packages/components/src/typography/__tests__/typography.test.ts`
- Modify: `docs/components/typography.md`
- Generated after build: `packages/components/es/typography/*`
- Generated after build: `packages/components/lib/typography/*`

## Task 1: Write Failing Typography Foundation Tests

- [ ] **Step 1: Add tests in `packages/components/src/typography/__tests__/typography.test.ts`**

Add these tests after the root wrapper test:

```ts
it('applies root hooks to typography wrapper', () => {
  const wrapper = mount(Typography, {
    props: {
      className: 'legacy-typography',
      rootClassName: 'root-typography',
      style: { marginTop: '4px' },
      classNames: {
        root: 'semantic-typography-root'
      },
      styles: {
        root: { padding: '8px' }
      }
    },
    slots: {
      default: 'Content'
    }
  })

  expect(wrapper.classes()).toEqual(
    expect.arrayContaining(['legacy-typography', 'root-typography', 'semantic-typography-root'])
  )
  expect(wrapper.attributes('style')).toContain('margin-top: 4px')
  expect(wrapper.attributes('style')).toContain('padding: 8px')
})

it('applies title type disabled mark and root hooks', () => {
  const wrapper = mount(Title, {
    props: {
      level: 4,
      type: 'warning',
      disabled: true,
      mark: true,
      className: 'title-class',
      rootClassName: 'title-root',
      style: { marginBottom: '2px' },
      classNames: {
        root: 'semantic-title-root'
      },
      styles: {
        root: { color: 'rgb(250, 173, 20)' }
      }
    },
    slots: {
      default: 'Heading'
    }
  })

  expect(wrapper.element.tagName).toBe('H4')
  expect(wrapper.classes()).toEqual(
    expect.arrayContaining([
      'aheart-typography-title--warning',
      'is-disabled',
      'is-mark',
      'title-class',
      'title-root',
      'semantic-title-root'
    ])
  )
  expect(wrapper.attributes('style')).toContain('margin-bottom: 2px')
  expect(wrapper.attributes('style')).toContain('color: rgb(250, 173, 20)')
})

it('renders marked text with semantic root hooks', () => {
  const wrapper = mount(Text, {
    props: {
      mark: true,
      strong: true,
      className: 'text-class',
      rootClassName: 'text-root',
      classNames: ({ props }) => ({
        root: props.mark ? 'semantic-marked-text' : 'semantic-text'
      }),
      styles: {
        root: { letterSpacing: '0px' }
      }
    },
    slots: {
      default: 'Marked'
    }
  })

  expect(wrapper.element.tagName).toBe('MARK')
  expect(wrapper.classes()).toEqual(expect.arrayContaining(['is-mark', 'is-strong', 'text-class', 'text-root']))
  expect(wrapper.classes()).toContain('semantic-marked-text')
  expect(wrapper.attributes('style')).toContain('letter-spacing: 0px')
})

it('supports paragraph ellipsis rows and root hooks', () => {
  const wrapper = mount(Paragraph, {
    props: {
      ellipsis: { rows: 2 },
      mark: true,
      className: 'paragraph-class',
      rootClassName: 'paragraph-root',
      style: { marginTop: '6px' },
      classNames: {
        root: 'semantic-paragraph-root'
      },
      styles: {
        root: { maxWidth: '240px' }
      }
    },
    slots: {
      default: 'Long content'
    }
  })

  expect(wrapper.classes()).toEqual(
    expect.arrayContaining([
      'is-ellipsis',
      'is-ellipsis-multiline',
      'is-mark',
      'paragraph-class',
      'paragraph-root',
      'semantic-paragraph-root'
    ])
  )
  expect(wrapper.attributes('style')).toContain('--aheart-typography-ellipsis-rows: 2')
  expect(wrapper.attributes('style')).toContain('margin-top: 6px')
  expect(wrapper.attributes('style')).toContain('max-width: 240px')
})

it('applies link root hooks while preserving disabled href behavior', () => {
  const wrapper = mount(Link, {
    props: {
      href: 'https://example.com',
      disabled: true,
      className: 'link-class',
      rootClassName: 'link-root',
      style: { marginInlineStart: '4px' },
      classNames: {
        root: 'semantic-link-root'
      },
      styles: {
        root: { color: 'rgb(22, 119, 255)' }
      }
    },
    slots: {
      default: 'Open'
    }
  })

  expect(wrapper.attributes('href')).toBeUndefined()
  expect(wrapper.classes()).toEqual(expect.arrayContaining(['is-disabled', 'link-class', 'link-root', 'semantic-link-root']))
  expect(wrapper.attributes('style')).toContain('margin-inline-start: 4px')
  expect(wrapper.attributes('style')).toContain('color: rgb(22, 119, 255)')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- typography
```

Expected: new tests fail because Typography primitives do not accept root hook props, `ATitle` does not support type/disabled/mark, `AText mark` is not rendered as `mark`, and Paragraph ellipsis object rows are not applied.

## Task 2: Implement Typography Foundation Props

- [ ] **Step 1: Extend `packages/components/src/typography/types.ts`**

Add shared root hook types and props:

```ts
import type { ExtractPropTypes, PropType, StyleValue } from 'vue'

export type TypographySemanticPart = 'root'
export type TypographySemanticClassNames = Partial<Record<TypographySemanticPart, string>>
export type TypographySemanticStyles = Partial<Record<TypographySemanticPart, StyleValue>>
export interface TypographySemanticInfo {
  props: Record<string, unknown>
}
export type TypographyClassNames =
  | TypographySemanticClassNames
  | ((info: TypographySemanticInfo) => TypographySemanticClassNames)
export type TypographyStyles = TypographySemanticStyles | ((info: TypographySemanticInfo) => TypographySemanticStyles)
export interface TypographyEllipsisConfig {
  rows?: number
}
export type TypographyEllipsis = boolean | TypographyEllipsisConfig
```

Use shared props on `typographyProps`, `titleProps`, `textProps`, `paragraphProps`, and `linkProps`.

- [ ] **Step 2: Apply root hooks in each primitive**

For each primitive, compute semantic maps:

```ts
const semanticInfo = computed(() => ({ props }))
const semanticClassNames = computed(() =>
  typeof props.classNames === 'function' ? props.classNames(semanticInfo.value) : props.classNames ?? {}
)
const semanticStyles = computed(() =>
  typeof props.styles === 'function' ? props.styles(semanticInfo.value) : props.styles ?? {}
)
```

Then merge `className`, `rootClassName`, `semanticClassNames.value.root`, `style`, and `semanticStyles.value.root` onto the root element.

- [ ] **Step 3: Add mark and ellipsis behavior**

Use `mark` in Text tag resolution:

```ts
if (props.mark) return 'mark'
```

Apply `is-mark` classes to Text, Title, and Paragraph. For Paragraph ellipsis:

```ts
const isEllipsis = computed(() => Boolean(props.ellipsis))
const ellipsisRows = computed(() => {
  if (typeof props.ellipsis === 'object' && props.ellipsis?.rows && props.ellipsis.rows > 0) {
    return props.ellipsis.rows
  }

  return 1
})
const paragraphStyle = computed(() => [
  isEllipsis.value ? { '--aheart-typography-ellipsis-rows': ellipsisRows.value } : undefined,
  props.style,
  semanticStyles.value.root
])
```

- [ ] **Step 4: Update `packages/components/src/typography/style.css`**

Add title tone states, mark styling, disabled title styling, and multiline ellipsis CSS:

```css
.aheart-typography-title--secondary {
  color: var(--aheart-color-text-secondary);
}

.aheart-typography-title--success {
  color: var(--aheart-color-success);
}

.aheart-typography-title--warning {
  color: var(--aheart-color-warning);
}

.aheart-typography-title--danger {
  color: var(--aheart-color-danger);
}

.aheart-typography-title.is-disabled {
  color: var(--aheart-color-text-secondary);
  cursor: not-allowed;
  opacity: 0.72;
}

.aheart-typography-title.is-mark,
.aheart-typography-text.is-mark,
.aheart-typography-paragraph.is-mark {
  background: color-mix(in srgb, var(--aheart-color-warning) 24%, transparent);
}

.aheart-typography-paragraph.is-ellipsis-multiline {
  display: -webkit-box;
  -webkit-line-clamp: var(--aheart-typography-ellipsis-rows, 1);
  -webkit-box-orient: vertical;
  white-space: normal;
}
```

- [ ] **Step 5: Run targeted tests and component typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- typography
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: targeted Typography tests pass and component typecheck exits 0.

- [ ] **Step 6: Commit source and tests**

```bash
git add packages/components/src/typography/types.ts packages/components/src/typography/typography.vue packages/components/src/typography/title.vue packages/components/src/typography/text.vue packages/components/src/typography/paragraph.vue packages/components/src/typography/link.vue packages/components/src/typography/style.css packages/components/src/typography/index.ts packages/components/src/typography/__tests__/typography.test.ts
git commit -m "feat: add typography foundation parity"
```

## Task 3: Update Documentation

- [ ] **Step 1: Update `docs/components/typography.md`**

Add examples for marked text, paragraph ellipsis rows, and semantic styling. Update API tables for shared root hook props and `mark`. Add:

```md
### TypographyEllipsisConfig

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| rows | 最大显示行数 | `number` | `1` |
```

Add Semantic DOM:

```md
| 名称 | 说明 |
| --- | --- |
| root | 根排版节点 |
```

- [ ] **Step 2: Run package build and docs build**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: package and VitePress builds exit 0.

- [ ] **Step 3: Commit docs**

```bash
git add docs/components/typography.md
git commit -m "docs: document typography foundation APIs"
```

## Task 4: Commit Generated Output and Verify

- [ ] **Step 1: Commit generated Typography output**

```bash
git add packages/components/es/typography packages/components/lib/typography packages/components/es/style.css packages/components/lib/style.css
git commit -m "build: update typography foundation outputs"
```

- [ ] **Step 2: Run verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
git diff --check
git status --short --branch
```

Expected: all commands exit 0 and the final status is clean.

## Self-Review

- Spec coverage: each requirement in `docs/superpowers/specs/2026-06-22-ant-style-typography-foundation-design.md` maps to Task 1, Task 2, or Task 3.
- Placeholder scan: no `TBD`, unfinished `TODO`, or "similar to" placeholders remain.
- Type consistency: `TypographySemanticPart`, `TypographyClassNames`, `TypographyStyles`, `TypographyEllipsisConfig`, and `TypographyEllipsis` are named consistently across tests, source, docs, and generated output.
