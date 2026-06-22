# Ant Style Form Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Ant-style synchronous Form model/rules validation, submit success/failure events, and required/colon/variant configuration.

**Architecture:** Keep existing Form/FormItem files. Add typed rules in `types.ts`, provide a lightweight form context from `form.vue`, register named FormItems, derive validation display in `form-item.vue`, and update CSS/docs/build outputs.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- Form `model`, `rules`, `requiredMark`, `colon`, and `variant`.
- FormItem `rules` and automatic required/status/help derived from Form validation.
- Synchronous rules: `required`, `message`, `type`, `min`, `max`, `len`, `pattern`.
- Submit events: existing `submit`, plus `finish`, `finishFailed`, and per-field `validate`.
- Exposed Form methods: `validate()` and `clearValidate()`.
- docs and build output refresh.

This plan does not cover async validators, nested path names, dependencies, `Form.List`, value extraction from child controls, or scroll-to-error.

## Task 1: Write Failing Form Tests

**Files:**
- Modify: `packages/components/src/form/__tests__/form.test.ts`

- [ ] **Step 1: Add validation and configuration tests**

Append these tests to `packages/components/src/form/__tests__/form.test.ts`:

```ts
it('validates required model fields and emits finishFailed on submit', async () => {
  const wrapper = mount(Form, {
    props: {
      model: { email: '' },
      rules: {
        email: [{ required: true, message: 'Email is required' }]
      }
    },
    slots: {
      default: {
        render() {
          return h('button', { type: 'submit' }, 'Save')
        }
      }
    }
  })

  await wrapper.find('form').trigger('submit')

  expect(wrapper.emitted('finish')).toBeUndefined()
  expect(wrapper.emitted('finishFailed')?.[0][0]).toEqual({
    values: { email: '' },
    errorFields: [{ name: 'email', errors: ['Email is required'] }]
  })
  expect(wrapper.emitted('validate')?.[0]).toEqual(['email', false, ['Email is required']])
})

it('renders FormItem automatic required state and validation help from rules', async () => {
  const wrapper = mount(Form, {
    props: {
      model: { email: '' },
      rules: {
        email: [{ required: true, message: 'Email is required' }]
      }
    },
    slots: {
      default: {
        render() {
          return h(FormItem, { label: 'Email', name: 'email' }, () => h(Input, { modelValue: '' }))
        }
      }
    }
  })

  await wrapper.find('form').trigger('submit')

  const item = wrapper.findComponent(FormItem)
  expect(item.classes()).toContain('aheart-form-item--error')
  expect(item.find('.aheart-form-item__required').exists()).toBe(true)
  expect(item.text()).toContain('Email is required')
})

it('emits finish when model passes rules', async () => {
  const wrapper = mount(Form, {
    props: {
      model: { email: 'ada@example.com' },
      rules: {
        email: [{ required: true }, { type: 'email', message: 'Use a valid email' }]
      }
    },
    slots: { default: '<button type="submit">Save</button>' }
  })

  await wrapper.find('form').trigger('submit')

  expect(wrapper.emitted('finish')?.[0]).toEqual([{ email: 'ada@example.com' }])
  expect(wrapper.emitted('finishFailed')).toBeUndefined()
})

it('supports item rules, optional mark, colon false, and variant classes', async () => {
  const wrapper = mount(Form, {
    props: {
      model: { age: 12 },
      requiredMark: 'optional',
      colon: false,
      variant: 'filled'
    },
    slots: {
      default: {
        render() {
          return h(FormItem, { label: 'Age', name: 'age', rules: [{ min: 18, message: 'Adults only' }] }, () =>
            h(Input, { modelValue: '12' })
          )
        }
      }
    }
  })

  expect(wrapper.classes()).toContain('aheart-form--filled')
  expect(wrapper.classes()).toContain('aheart-form--required-optional')
  expect(wrapper.classes()).toContain('aheart-form--no-colon')
  expect(wrapper.find('.aheart-form-item__optional').exists()).toBe(true)

  await wrapper.find('form').trigger('submit')

  expect(wrapper.findComponent(FormItem).classes()).toContain('aheart-form-item--error')
  expect(wrapper.text()).toContain('Adults only')
})
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- form
```

Expected: FAIL because Form does not yet accept model/rules/requiredMark/variant or render derived validation errors.

## Task 2: Implement Form Validation

**Files:**
- Modify: `packages/components/src/form/types.ts`
- Modify: `packages/components/src/form/form.vue`
- Modify: `packages/components/src/form/form-item.vue`
- Modify: `packages/components/src/form/style.css`

- [ ] **Step 1: Extend form types**

Add:

```ts
export type FormRequiredMark = boolean | 'optional'
export type FormVariant = 'outlined' | 'borderless' | 'filled' | 'underlined'
export type FormRuleType = 'string' | 'number' | 'email' | 'array'
export type FormModel = Record<string, unknown>

export interface FormRule {
  required?: boolean
  message?: string
  type?: FormRuleType
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
}

export interface FormValidationError {
  name: string
  errors: string[]
}

export interface FormFinishFailedInfo {
  values: FormModel
  errorFields: FormValidationError[]
}
```

Add Form props and emits for `model`, `rules`, `requiredMark`, `colon`, `variant`, `finish`, `finishFailed`, and `validate`. Add FormItem `rules`.

- [ ] **Step 2: Implement Form context and validation**

In `form.vue`, register named fields, merge Form and FormItem rules, validate synchronously on submit, store errors, emit events, and expose `validate`/`clearValidate`.

- [ ] **Step 3: Implement FormItem derived state**

In `form-item.vue`, inject context, register/unregister field rules, compute required mark, optional mark, effective validateStatus, and effective help from context errors.

- [ ] **Step 4: Add styles**

Add classes for `aheart-form--required-optional`, `aheart-form--no-colon`, variants, optional marker, and derived help state.

- [ ] **Step 5: Run targeted verification**

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- form
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit source**

```bash
git add packages/components/src/form
git commit -m "feat: add form validation APIs"
```

## Task 3: Update Docs and Build Output

**Files:**
- Modify: `docs/components/form.md`
- Generated: `packages/components/es/**`
- Generated: `packages/components/lib/**`

- [ ] **Step 1: Update docs**

Add model/rules validation examples, required/optional mark examples, API rows, events, exposed methods, and rule tables.

- [ ] **Step 2: Verify docs build**

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: PASS.

- [ ] **Step 3: Commit docs**

```bash
git add docs/components/form.md
git commit -m "docs: document form validation APIs"
```

- [ ] **Step 4: Run full verification**

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 typecheck
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 test
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 build
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
test -f packages/components/es/form/index.d.ts && test -f packages/components/es/form/form-item.vue.d.ts && test -f packages/components/lib/form/index.d.ts && test -f packages/components/lib/form/form-item.vue.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo form-validation-build-ok
```

Expected: every command exits 0 and the final check prints `form-validation-build-ok`.

- [ ] **Step 5: Commit generated output**

```bash
git add packages/components/es packages/components/lib
git commit -m "build: update form validation outputs"
```
