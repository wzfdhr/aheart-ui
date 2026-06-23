# Ant Style Typography Copyable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style copyable operation support to Title, Text, and Paragraph typography components.

**Architecture:** Add shared typography copyable types and a small composable/helper for clipboard behavior. Wrap rendered content in a content span for copy text extraction, render a copy action before or after content based on `actions.placement`, and preserve each typography component's existing root element and styling.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `copyable` prop on `ATitle`, `AText`, and `AParagraph`.
- Copying rendered slot text by default.
- Custom copy text as string or async function.
- Copy icon and tooltip before/after state.
- `actions.placement` start/end.
- Disabled copy prevention.
- Docs and generated package output refresh.

This plan does not add editable typography, expandable ellipsis, tooltip components around the copy button, or copyable support for `ALink`.

## Files

- Modify: `packages/components/src/typography/types.ts`
- Create: `packages/components/src/typography/copyable.ts`
- Modify: `packages/components/src/typography/text.vue`
- Modify: `packages/components/src/typography/paragraph.vue`
- Modify: `packages/components/src/typography/title.vue`
- Modify: `packages/components/src/typography/style.css`
- Modify: `packages/components/src/typography/__tests__/typography.test.ts`
- Modify: `docs/components/typography.md`
- Generated after build: `packages/components/es/typography/*`
- Generated after build: `packages/components/lib/typography/*`

## Task 1: Write Failing Typography Tests

- [x] **Step 1: Add copyable tests**

In `packages/components/src/typography/__tests__/typography.test.ts`, update the Vitest import:

```ts
import { describe, expect, it, vi } from 'vitest'
```

Add this helper after imports:

```ts
const stubClipboard = () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', {
    clipboard: {
      writeText
    }
  })
  return writeText
}
```

Add these tests before the final `renders link and handles disabled state` test:

```ts
it('copies rendered text content from copyable Text', async () => {
  const writeText = stubClipboard()
  const wrapper = mount(Text, {
    props: {
      copyable: true
    },
    slots: {
      default: 'Copy me'
    }
  })

  await wrapper.find('.aheart-typography__copy').trigger('click')

  expect(writeText).toHaveBeenCalledWith('Copy me')
  expect(wrapper.find('.aheart-typography__copy').text()).toBe('copied')
})

it('supports Paragraph copyable config icon callback text and start placement', async () => {
  const writeText = stubClipboard()
  const onCopy = vi.fn()
  const wrapper = mount(Paragraph, {
    props: {
      copyable: {
        text: async () => 'Async copy',
        icon: ['copy-icon', 'done-icon'],
        tooltips: ['Copy paragraph', 'Copied paragraph'],
        onCopy,
        tabIndex: 3
      },
      actions: {
        placement: 'start'
      }
    },
    slots: {
      default: 'Visible paragraph'
    }
  })

  const firstChild = wrapper.element.firstElementChild
  expect(firstChild?.classList.contains('aheart-typography__copy')).toBe(true)
  expect(wrapper.find('.aheart-typography__copy').attributes('title')).toBe('Copy paragraph')
  expect(wrapper.find('.aheart-typography__copy').attributes('tabindex')).toBe('3')

  await wrapper.find('.aheart-typography__copy').trigger('click')

  expect(writeText).toHaveBeenCalledWith('Async copy')
  expect(onCopy).toHaveBeenCalledTimes(1)
  expect(wrapper.find('.aheart-typography__copy').text()).toBe('done-icon')
  expect(wrapper.find('.aheart-typography__copy').attributes('title')).toBe('Copied paragraph')
})

it('renders copyable Title action while preserving heading level', () => {
  const wrapper = mount(Title, {
    props: {
      level: 2,
      copyable: {
        icon: ['copy-title', 'copied-title']
      }
    },
    slots: {
      default: 'Heading'
    }
  })

  expect(wrapper.element.tagName).toBe('H2')
  expect(wrapper.find('.aheart-typography__copy').text()).toBe('copy-title')
  expect(wrapper.find('.aheart-typography__content').text()).toBe('Heading')
})

it('does not copy disabled copyable Text', async () => {
  const writeText = stubClipboard()
  const wrapper = mount(Text, {
    props: {
      disabled: true,
      copyable: true
    },
    slots: {
      default: 'Disabled copy'
    }
  })

  await wrapper.find('.aheart-typography__copy').trigger('click')

  expect(writeText).not.toHaveBeenCalled()
  expect(wrapper.find('.aheart-typography__copy').attributes()).toHaveProperty('disabled')
})
```

- [x] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- typography
```

Expected: FAIL because current typography components do not accept `copyable` / `actions`, render copy buttons, or call clipboard APIs.

## Task 2: Add Shared Copyable Types And Helper

- [x] **Step 1: Extend typography types**

In `packages/components/src/typography/types.ts`, update the import:

```ts
import type { ExtractPropTypes, PropType, StyleValue, VNodeChild } from 'vue'
```

Add after `TypographyEllipsis`:

```ts
export type TypographyCopyableIcon = VNodeChild | [VNodeChild, VNodeChild]
export type TypographyCopyableTooltip = false | [VNodeChild, VNodeChild]

export interface TypographyCopyableConfig {
  text?: string | (() => string | Promise<string>)
  icon?: TypographyCopyableIcon
  tooltips?: TypographyCopyableTooltip
  format?: 'text/plain' | 'text/html'
  tabIndex?: number
  onCopy?: (event: MouseEvent) => void
}

export type TypographyCopyable = boolean | TypographyCopyableConfig
export type TypographyActionPlacement = 'start' | 'end'

export interface TypographyActionsConfig {
  placement?: TypographyActionPlacement
}
```

Add helpers:

```ts
const copyableProp = [Boolean, Object] as PropType<TypographyCopyable>
const actionsProp = Object as PropType<TypographyActionsConfig>
```

Add to `titleProps`, `textProps`, and `paragraphProps`:

```ts
copyable: copyableProp,
actions: actionsProp,
```

- [x] **Step 2: Create copyable helper**

Create `packages/components/src/typography/copyable.ts`:

```ts
import { computed, defineComponent, ref, type PropType, type Ref, type VNodeChild } from 'vue'
import type { TypographyCopyable, TypographyCopyableConfig } from './types'

const getCopyableConfig = (copyable: TypographyCopyable | undefined): TypographyCopyableConfig | undefined => {
  if (!copyable) {
    return undefined
  }

  return typeof copyable === 'object' ? copyable : {}
}

const toText = (value: unknown) => {
  if (value === undefined || value === null || value === false) {
    return undefined
  }

  return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined
}

export const TypographyRenderNode = defineComponent({
  name: 'ATypographyRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(props) {
    return () => props.node
  }
})

export const useTypographyCopyable = (
  copyable: Ref<TypographyCopyable | undefined>,
  contentRef: Ref<HTMLElement | null>,
  disabled: Ref<boolean>
) => {
  const copied = ref(false)
  const copyableConfig = computed(() => getCopyableConfig(copyable.value))
  const isCopyable = computed(() => Boolean(copyableConfig.value))
  const copyTabIndex = computed(() => copyableConfig.value?.tabIndex ?? 0)

  const copyIcon = computed<VNodeChild>(() => {
    const icon = copyableConfig.value?.icon

    if (Array.isArray(icon)) {
      return copied.value ? icon[1] : icon[0]
    }

    return icon ?? (copied.value ? 'copied' : 'copy')
  })

  const copyTitle = computed(() => {
    const tooltips = copyableConfig.value?.tooltips

    if (tooltips === false) {
      return undefined
    }

    const title = Array.isArray(tooltips) ? (copied.value ? tooltips[1] : tooltips[0]) : copied.value ? 'Copied' : 'Copy'
    return toText(title)
  })

  const resolveCopyText = async () => {
    const text = copyableConfig.value?.text

    if (typeof text === 'function') {
      return text()
    }

    return text ?? contentRef.value?.textContent ?? ''
  }

  const writeClipboardText = async (text: string) => {
    if (copyableConfig.value?.format === 'text/html' && navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([text], { type: 'text/html' })
        })
      ])
      return
    }

    await navigator.clipboard?.writeText?.(text)
  }

  const handleCopy = async (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isCopyable.value || disabled.value) {
      return
    }

    const text = await resolveCopyText()
    await writeClipboardText(text)
    copied.value = true
    copyableConfig.value?.onCopy?.(event)
  }

  return {
    copied,
    isCopyable,
    copyIcon,
    copyTitle,
    copyTabIndex,
    handleCopy
  }
}
```

## Task 3: Render Copyable Actions

- [x] **Step 1: Update Text**

In `packages/components/src/typography/text.vue`:

- Import `computed`, `ref`, `toRef`, and `useTypographyCopyable` / `TypographyRenderNode`.
- Wrap slot content in `<span ref="contentRef" class="aheart-typography__content">`.
- Render a button with class `aheart-typography__copy` before or after content based on `actions.placement`.
- Pass disabled state to the helper.

- [x] **Step 2: Update Paragraph**

Apply the same copyable rendering pattern to `packages/components/src/typography/paragraph.vue`.

- [x] **Step 3: Update Title**

Apply the same copyable rendering pattern to `packages/components/src/typography/title.vue`.

- [x] **Step 4: Update typography styles**

In `packages/components/src/typography/style.css`, add styles for:

```css
.aheart-typography__content {
  display: inline;
}

.aheart-typography__copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-inline-start: 4px;
  padding: 0 2px;
  border: 0;
  border-radius: var(--aheart-radius-sm);
  background: transparent;
  color: var(--aheart-color-primary);
  font: inherit;
  line-height: 1;
  cursor: pointer;
}

.aheart-typography__copy:first-child {
  margin-inline-start: 0;
  margin-inline-end: 4px;
}

.aheart-typography__copy:hover:not(:disabled) {
  background: var(--aheart-color-fill);
}

.aheart-typography__copy:disabled {
  color: var(--aheart-color-text-secondary);
  cursor: not-allowed;
  opacity: 0.72;
}
```

- [x] **Step 5: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- typography
```

Expected: all Typography tests pass.

## Task 4: Update Typography Documentation

- [x] **Step 1: Update docs demo and API**

In `docs/components/typography.md`:

- Add a copyable demo for Text, Paragraph, and Title.
- Document `copyable` and `actions` under Title/Text/Paragraph.
- Document `TypographyCopyableConfig` and `TypographyActionsConfig`.

- [x] **Step 2: Build docs once**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build exits 0.

## Task 5: Refresh Generated Outputs And Verify

- [x] **Step 1: Run full typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
```

- [x] **Step 2: Run full tests**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
```

- [x] **Step 3: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

- [x] **Step 4: Clean known generated drift for non-Typography components**

Run:

```bash
git status --short
```

If the package build refreshes unrelated component outputs, inspect them and revert only unrelated generated drift.

- [x] **Step 5: Build docs and clean cache**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
```

- [x] **Step 6: Check diff hygiene**

Run:

```bash
git diff --check
git status --short --branch
git log --oneline -12
```

- [x] **Step 7: Commit slice**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-typography-copyable-design.md docs/superpowers/plans/2026-06-23-ant-style-typography-copyable.md packages/components/src/typography/types.ts packages/components/src/typography/copyable.ts packages/components/src/typography/text.vue packages/components/src/typography/paragraph.vue packages/components/src/typography/title.vue packages/components/src/typography/style.css packages/components/src/typography/__tests__/typography.test.ts docs/components/typography.md packages/components/es/typography packages/components/lib/typography
git commit -m "feat: align typography copyable actions"
```

## Self-Review

- Spec coverage: every behavior in the design has a task.
- Placeholder scan: no TODO/TBD placeholders.
- Type consistency: `TypographyCopyable`, `TypographyCopyableConfig`, `TypographyActionsConfig`, and `actions.placement` are consistent across tasks.
