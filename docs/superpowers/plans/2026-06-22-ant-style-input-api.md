# Ant Style Input API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Ant Design API parity for Input, Textarea, and InputNumber.

**Architecture:** Keep the existing component files and controlled value behavior. Add Ant-style props in `types.ts`, implement deterministic classes and native attributes in each SFC, update tests first, then docs and build output.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- Input addon, prefix/suffix props, variants, readonly, id, and pressEnter
- Textarea allowClear, variants, readonly, id, autoSize object, clear, and pressEnter
- InputNumber prefix/suffix, status, variants, readonly, id, formatter/parser, precision, keyboard, pressEnter, and step
- docs updates for those three components
- package build output refresh

This plan does not cover Input Password/Search/Group/OTP, Textarea count formatter objects, or InputNumber stringMode/changeOnWheel/changeOnBlur.

## Task 1: Write Failing Tests

**Files:**
- Modify: `packages/components/src/input/__tests__/input.test.ts`
- Modify: `packages/components/src/textarea/__tests__/textarea.test.ts`
- Modify: `packages/components/src/input-number/__tests__/input-number.test.ts`

- [ ] **Step 1: Add Input tests**

Append to `packages/components/src/input/__tests__/input.test.ts`:

```ts
  it('supports Ant-style addons prefix suffix and variants', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'site',
        prefix: 'https://',
        suffix: '.com',
        addonBefore: 'URL',
        addonAfter: 'open',
        variant: 'filled',
        id: 'site-input',
        readOnly: true
      }
    })

    expect(wrapper.classes()).toContain('aheart-input-group')
    expect(wrapper.find('.aheart-input__addon--before').text()).toBe('URL')
    expect(wrapper.find('.aheart-input__addon--after').text()).toBe('open')
    expect(wrapper.find('.aheart-input').classes()).toContain('aheart-input--filled')
    expect(wrapper.find('.aheart-input__prefix').text()).toBe('https://')
    expect(wrapper.find('.aheart-input__suffix').text()).toBe('.com')
    expect(wrapper.find('input').attributes('id')).toBe('site-input')
    expect(wrapper.find('input').attributes()).toHaveProperty('readonly')
  })

  it('maps bordered false to borderless and emits pressEnter', async () => {
    const wrapper = mount(Input, {
      props: { bordered: false }
    })

    expect(wrapper.find('.aheart-input').classes()).toContain('aheart-input--borderless')

    await wrapper.find('input').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('pressEnter')).toHaveLength(1)
  })
```

- [ ] **Step 2: Add Textarea tests**

Append to `packages/components/src/textarea/__tests__/textarea.test.ts`:

```ts
  it('supports allowClear variants readonly id and pressEnter', async () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'Clear me',
        allowClear: true,
        variant: 'underlined',
        id: 'notes',
        readOnly: true
      }
    })

    expect(wrapper.classes()).toContain('aheart-textarea--underlined')
    expect(wrapper.find('textarea').attributes('id')).toBe('notes')
    expect(wrapper.find('textarea').attributes()).toHaveProperty('readonly')

    await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('pressEnter')).toHaveLength(1)

    await wrapper.find('.aheart-textarea__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('supports autoSize object minRows and maxRows', () => {
    const wrapper = mount(Textarea, {
      props: { autoSize: { minRows: 2, maxRows: 5 } }
    })

    expect(wrapper.classes()).toContain('is-autosize')
    expect(wrapper.attributes('style')).toContain('--aheart-textarea-min-rows: 2')
    expect(wrapper.attributes('style')).toContain('--aheart-textarea-max-rows: 5')
  })
```

- [ ] **Step 3: Add InputNumber tests**

Append to `packages/components/src/input-number/__tests__/input-number.test.ts`:

```ts
  it('supports prefix suffix status variant readonly id and formatted display', () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 1200,
        prefix: '$',
        suffix: 'USD',
        status: 'warning',
        variant: 'filled',
        id: 'amount',
        readOnly: true,
        formatter: (value?: number) => (value === undefined ? '' : `${value.toLocaleString()}`)
      }
    })

    expect(wrapper.classes()).toContain('aheart-input-number--warning')
    expect(wrapper.classes()).toContain('aheart-input-number--filled')
    expect(wrapper.find('.aheart-input-number__prefix').text()).toBe('$')
    expect(wrapper.find('.aheart-input-number__suffix').text()).toBe('USD')
    expect(wrapper.find('input').element.value).toBe('1,200')
    expect(wrapper.find('input').attributes('id')).toBe('amount')
    expect(wrapper.find('input').attributes()).toHaveProperty('readonly')
  })

  it('parses input applies precision and emits pressEnter', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        precision: 2,
        parser: (value: string) => Number(value.replace('$', ''))
      }
    })

    await wrapper.find('input').setValue('$12.345')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([12.35])
    expect(wrapper.emitted('pressEnter')).toHaveLength(1)
  })

  it('supports keyboard suppression and step events', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, keyboard: false }
    })

    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.find('.aheart-input-number__increase').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    expect(wrapper.emitted('step')?.[0]).toEqual([3, { offset: 1, type: 'up' }])
  })
```

- [ ] **Step 4: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- input textarea input-number
```

Expected: FAIL because the new props and behavior are not implemented yet.

## Task 2: Implement Input API Additions

**Files:**
- Modify: `packages/components/src/input/types.ts`
- Modify: `packages/components/src/input/input.vue`
- Modify: `packages/components/src/input/style.css`
- Modify: `packages/components/src/textarea/types.ts`
- Modify: `packages/components/src/textarea/textarea.vue`
- Modify: `packages/components/src/textarea/style.css`
- Modify: `packages/components/src/input-number/types.ts`
- Modify: `packages/components/src/input-number/input-number.vue`
- Modify: `packages/components/src/input-number/style.css`

- [ ] **Step 1: Implement Input props and rendering**

Add prefix/suffix props, addonBefore/addonAfter wrappers, variant/bordered/readOnly/id, and pressEnter.

- [ ] **Step 2: Implement Textarea props and rendering**

Add allowClear, variant/bordered/readOnly/id, autoSize object styles, clear, and pressEnter.

- [ ] **Step 3: Implement InputNumber props and behavior**

Add prefix/suffix, status, variant/bordered/readOnly/id, formatter/parser, precision, keyboard handling, pressEnter, and step event.

- [ ] **Step 4: Run targeted verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- input textarea input-number
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit source**

```bash
git add packages/components/src/input packages/components/src/textarea packages/components/src/input-number
git commit -m "feat: expand input component APIs"
```

## Task 3: Update Documentation

**Files:**
- Modify: `docs/components/input.md`
- Modify: `docs/components/textarea.md`
- Modify: `docs/components/input-number.md`

- [ ] **Step 1: Update Input docs**

Document addon, prefix/suffix props, variant, bordered, readOnly, id, and pressEnter.

- [ ] **Step 2: Update Textarea docs**

Document allowClear, variant, bordered, readOnly, id, autoSize object, clear, and pressEnter.

- [ ] **Step 3: Update InputNumber docs**

Document prefix/suffix, status, variant, bordered, readOnly, id, formatter/parser, precision, keyboard, pressEnter, and step.

- [ ] **Step 4: Build docs and commit**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: PASS.

Then commit:

```bash
git add docs/components/input.md docs/components/textarea.md docs/components/input-number.md
git commit -m "docs: document expanded input APIs"
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
test -f packages/components/es/input/index.d.ts && test -f packages/components/es/textarea/index.d.ts && test -f packages/components/es/input-number/index.d.ts && test -f packages/components/lib/input/index.d.ts && test -f packages/components/lib/textarea/index.d.ts && test -f packages/components/lib/input-number/index.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo declarations-and-docs-ok
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
git commit -m "build: update input api outputs"
```

## Self-Review

- Spec coverage: all Input, Textarea, and InputNumber API additions map to tests, implementation, docs, and build output tasks.
- Placeholder scan: the plan contains no TBD/TODO/fill-in placeholders.
- Type consistency: `InputVariant`, `TextareaVariant`, `InputNumberVariant`, and `InputNumberStepInfo` names are consistent across the plan.
