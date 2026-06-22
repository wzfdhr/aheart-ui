# Ant Style Select Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Select, Form, and FormItem as Ready Data Entry components.

**Architecture:** Select is a styled native select with typed options and ConfigProvider size/disabled support. Form is a presentational form container that provides size/disabled to descendants through the existing Aheart config context; FormItem handles labels, help, extra text, required marks, and validation status styling.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Select`
- `Form`
- `FormItem`
- package root exports and plugin install
- docs pages and Ready status
- package build output refresh

This plan does not cover Select search, async loading, virtual scroll, custom dropdown rendering, or a Form validation rules engine.

## Task 1: Write Failing Tests

**Files:**
- Create: `packages/components/src/select/__tests__/select.test.ts`
- Create: `packages/components/src/form/__tests__/form.test.ts`

- [ ] **Step 1: Create Select tests**

Create `packages/components/src/select/__tests__/select.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Select from '../select.vue'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true }
]

describe('Select', () => {
  it('renders placeholder and options', () => {
    const wrapper = mount(Select, {
      props: { options, placeholder: 'Choose fruit' }
    })

    expect(wrapper.classes()).toContain('aheart-select')
    expect(wrapper.find('select').element.value).toBe('')
    expect(wrapper.findAll('option').map((option) => option.text())).toEqual(['Choose fruit', 'Apple', 'Banana', 'Cherry'])
  })

  it('emits model update and change when selected', async () => {
    const wrapper = mount(Select, {
      props: { options }
    })

    await wrapper.find('select').setValue('banana')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['banana'])
  })

  it('clears selected value when allowClear is clicked', async () => {
    const wrapper = mount(Select, {
      props: { options, modelValue: 'apple', allowClear: true }
    })

    await wrapper.find('.aheart-select__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('supports multiple mode', async () => {
    const wrapper = mount(Select, {
      props: { options, modelValue: ['apple'], mode: 'multiple' }
    })

    const select = wrapper.find('select').element
    Array.from(select.options).forEach((option) => {
      option.selected = ['apple', 'banana'].includes(option.value)
    })
    await wrapper.find('select').trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['apple', 'banana']])
  })

  it('uses ConfigProvider size and disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large', disabled: true },
      slots: {
        default: {
          render() {
            return h(Select, { options })
          }
        }
      }
    })

    const select = wrapper.findComponent(Select)
    expect(select.classes()).toContain('aheart-select--large')
    expect(select.find('select').attributes()).toHaveProperty('disabled')
  })
})
```

- [ ] **Step 2: Create Form tests**

Create `packages/components/src/form/__tests__/form.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Input from '../../input/input.vue'
import Form, { FormItem } from '../index'

describe('Form', () => {
  it('renders layout and emits submit', async () => {
    const wrapper = mount(Form, {
      props: { layout: 'vertical', labelAlign: 'left' },
      slots: { default: '<button type="submit">Save</button>' }
    })

    expect(wrapper.classes()).toContain('aheart-form')
    expect(wrapper.classes()).toContain('aheart-form--vertical')
    expect(wrapper.classes()).toContain('aheart-form--label-left')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('renders FormItem label, required mark, help, extra, and status', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: 'Email',
        name: 'email',
        required: true,
        validateStatus: 'error',
        help: 'Email is required',
        extra: 'Use your work email',
        hasFeedback: true
      },
      slots: { default: '<input />' }
    })

    expect(wrapper.classes()).toContain('aheart-form-item')
    expect(wrapper.classes()).toContain('aheart-form-item--error')
    expect(wrapper.find('.aheart-form-item__required').exists()).toBe(true)
    expect(wrapper.find('.aheart-form-item__feedback').exists()).toBe(true)
    expect(wrapper.text()).toContain('Email')
    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Use your work email')
  })

  it('provides size and disabled state to nested controls', () => {
    const wrapper = mount(Form, {
      props: { size: 'large', disabled: true },
      slots: {
        default: {
          render() {
            return h(FormItem, { label: 'Name' }, () => h(Input, { modelValue: 'Ada' }))
          }
        }
      }
    })

    const input = wrapper.findComponent(Input)
    expect(input.classes()).toContain('aheart-input--large')
    expect(input.find('input').attributes()).toHaveProperty('disabled')
  })
})
```

- [ ] **Step 3: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- select form
```

Expected: FAIL because implementation files do not exist yet.

## Task 2: Implement Select And Form

- [ ] **Step 1: Create component files**

Create:

- `packages/components/src/select/select.vue`
- `packages/components/src/select/types.ts`
- `packages/components/src/select/style.css`
- `packages/components/src/select/index.ts`
- `packages/components/src/form/form.vue`
- `packages/components/src/form/form-item.vue`
- `packages/components/src/form/types.ts`
- `packages/components/src/form/style.css`
- `packages/components/src/form/index.ts`

Each component must match the API in `docs/superpowers/specs/2026-06-22-ant-style-select-form-design.md`.

- [ ] **Step 2: Update package root exports**

Modify `packages/components/src/index.ts` so Select, Form, and FormItem are imported, registered where installable, and exported by name.

- [ ] **Step 3: Run targeted verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- select form
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit source**

```bash
git add packages/components/src/select packages/components/src/form packages/components/src/index.ts
git commit -m "feat: add select and form components"
```

## Task 3: Add Documentation

- [ ] **Step 1: Update component metadata**

Modify `docs/.vitepress/data/components.ts`:

- `Select` -> Ready with `/components/select`
- `Form` -> Ready with `/components/form`

- [ ] **Step 2: Update sidebar**

Modify `docs/.vitepress/config.ts` and add:

- `Select 选择器`
- `Form 表单`

- [ ] **Step 3: Create component docs**

Create:

- `docs/components/select.md`
- `docs/components/form.md`

Each page must include a Ready badge, description, demos, Vue code, API table, events, slots where applicable, and theme token notes.

- [ ] **Step 4: Build docs and commit**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Remove `docs/.vitepress/cache` if generated, then commit:

```bash
git add docs/.vitepress/config.ts docs/.vitepress/data/components.ts docs/components/select.md docs/components/form.md
git commit -m "docs: add select and form documentation"
```

## Task 4: Full Verification And Build Outputs

- [ ] **Step 1: Run full verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: all commands exit 0.

- [ ] **Step 2: Check declarations and docs exclusions**

Run:

```bash
test -f packages/components/es/select/index.d.ts
test -f packages/components/es/form/index.d.ts
test -f packages/components/lib/select/index.d.ts
test -f packages/components/lib/form/index.d.ts
test ! -e docs/.vitepress/dist/superpowers
```

Expected: all commands exit 0.

- [ ] **Step 3: Commit build outputs**

```bash
git add packages/components/es packages/components/lib
git commit -m "build: update select and form outputs"
```

- [ ] **Step 4: Final status**

Run:

```bash
git status --short --branch
```

Expected: clean branch.

## Self-Review

- Spec coverage: Select, Form, and FormItem are covered by tests, implementation, docs, and build output tasks.
- Placeholder scan: No unresolved placeholder markers are present.
- Type consistency: Component names, props, and event names match the design doc and tests.
