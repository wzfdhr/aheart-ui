# Ant Style Data Entry Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first Data Entry primitives: Input, Textarea, InputNumber, Checkbox, Radio, and Switch.

**Architecture:** Follow the existing Aheart component directory pattern with typed props, local CSS, install entries, package root exports, tests, VitePress docs, and tracked build outputs. Controls consume ConfigProvider disabled; Input, Textarea, InputNumber, and Switch also consume ConfigProvider size.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Input`
- `Textarea`
- `InputNumber`
- `Checkbox`
- `Radio`
- `Switch`
- package root exports and plugin install
- docs pages and Ready status for these six components
- package build output refresh

This plan does not cover Form, Select, DatePicker, TimePicker, grouped checkbox/radio abstractions, or overlay-based data entry.

## Task 1: Write Failing Data Entry Tests

**Files:**
- Create: `packages/components/src/input/__tests__/input.test.ts`
- Create: `packages/components/src/textarea/__tests__/textarea.test.ts`
- Create: `packages/components/src/input-number/__tests__/input-number.test.ts`
- Create: `packages/components/src/checkbox/__tests__/checkbox.test.ts`
- Create: `packages/components/src/radio/__tests__/radio.test.ts`
- Create: `packages/components/src/switch/__tests__/switch.test.ts`

- [ ] **Step 1: Create Input tests**

Create `packages/components/src/input/__tests__/input.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Input from '../input.vue'

describe('Input', () => {
  it('renders model value with prefix, suffix, and count', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'Aheart', maxlength: 12, showCount: true },
      slots: { prefix: 'P', suffix: 'S' }
    })

    expect(wrapper.classes()).toContain('aheart-input')
    expect(wrapper.find('input').element.value).toBe('Aheart')
    expect(wrapper.find('.aheart-input__count').text()).toBe('6 / 12')
    expect(wrapper.text()).toContain('P')
    expect(wrapper.text()).toContain('S')
  })

  it('emits model update, input, and change', async () => {
    const wrapper = mount(Input)

    await wrapper.find('input').setValue('Hello')
    await wrapper.find('input').trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Hello'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['Hello'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['Hello'])
  })

  it('clears value when allowClear button is clicked', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'Clear me', allowClear: true }
    })

    await wrapper.find('.aheart-input__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('uses ConfigProvider size and disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large', disabled: true },
      slots: {
        default: {
          render() {
            return h(Input, { modelValue: 'Readonly' })
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

- [ ] **Step 2: Create Textarea tests**

Create `packages/components/src/textarea/__tests__/textarea.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Textarea from '../textarea.vue'

describe('Textarea', () => {
  it('renders value, rows, count, and autosize class', () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: 'Line one', rows: 4, maxlength: 20, showCount: true, autoSize: true }
    })

    expect(wrapper.classes()).toContain('aheart-textarea')
    expect(wrapper.classes()).toContain('is-autosize')
    expect(wrapper.find('textarea').attributes('rows')).toBe('4')
    expect(wrapper.find('textarea').element.value).toBe('Line one')
    expect(wrapper.find('.aheart-textarea__count').text()).toBe('8 / 20')
  })

  it('emits model update, input, and change', async () => {
    const wrapper = mount(Textarea)

    await wrapper.find('textarea').setValue('Long text')
    await wrapper.find('textarea').trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Long text'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['Long text'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['Long text'])
  })

  it('uses ConfigProvider disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: {
          render() {
            return h(Textarea, { modelValue: 'Disabled' })
          }
        }
      }
    })

    expect(wrapper.find('textarea').attributes()).toHaveProperty('disabled')
  })
})
```

- [ ] **Step 3: Create InputNumber tests**

Create `packages/components/src/input-number/__tests__/input-number.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import InputNumber from '../input-number.vue'

describe('InputNumber', () => {
  it('renders numeric value and size class', () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 4, size: 'small' }
    })

    expect(wrapper.classes()).toContain('aheart-input-number')
    expect(wrapper.classes()).toContain('aheart-input-number--small')
    expect(wrapper.find('input').element.value).toBe('4')
  })

  it('clamps typed values to min and max', async () => {
    const wrapper = mount(InputNumber, {
      props: { min: 1, max: 10 }
    })

    await wrapper.find('input').setValue('20')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
    expect(wrapper.emitted('change')?.[0]).toEqual([10])
  })

  it('increments and decrements by step controls', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 2, step: 2, controls: true }
    })

    await wrapper.find('.aheart-input-number__increase').trigger('click')
    await wrapper.find('.aheart-input-number__decrease').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0])
  })

  it('uses ConfigProvider size and disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large', disabled: true },
      slots: {
        default: {
          render() {
            return h(InputNumber, { modelValue: 8 })
          }
        }
      }
    })

    const inputNumber = wrapper.findComponent(InputNumber)
    expect(inputNumber.classes()).toContain('aheart-input-number--large')
    expect(inputNumber.find('input').attributes()).toHaveProperty('disabled')
  })
})
```

- [ ] **Step 4: Create Checkbox tests**

Create `packages/components/src/checkbox/__tests__/checkbox.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Checkbox from '../checkbox.vue'

describe('Checkbox', () => {
  it('renders checked state, label, and indeterminate class', () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: true, indeterminate: true, label: 'Remember me' }
    })

    expect(wrapper.classes()).toContain('aheart-checkbox')
    expect(wrapper.classes()).toContain('is-indeterminate')
    expect(wrapper.find('input').element.checked).toBe(true)
    expect(wrapper.text()).toContain('Remember me')
  })

  it('emits model update and change when toggled', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false }
    })

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('uses ConfigProvider disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: {
          render() {
            return h(Checkbox, { label: 'Disabled' })
          }
        }
      }
    })

    expect(wrapper.find('input').attributes()).toHaveProperty('disabled')
  })
})
```

- [ ] **Step 5: Create Radio tests**

Create `packages/components/src/radio/__tests__/radio.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Radio from '../radio.vue'

describe('Radio', () => {
  it('renders checked state with label and name', () => {
    const wrapper = mount(Radio, {
      props: { modelValue: true, label: 'Option A', name: 'choice' }
    })

    expect(wrapper.classes()).toContain('aheart-radio')
    expect(wrapper.find('input').attributes('type')).toBe('radio')
    expect(wrapper.find('input').attributes('name')).toBe('choice')
    expect(wrapper.find('input').element.checked).toBe(true)
    expect(wrapper.text()).toContain('Option A')
  })

  it('emits true when selected', async () => {
    const wrapper = mount(Radio, {
      props: { modelValue: false }
    })

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('uses ConfigProvider disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { disabled: true },
      slots: {
        default: {
          render() {
            return h(Radio, { label: 'Disabled' })
          }
        }
      }
    })

    expect(wrapper.find('input').attributes()).toHaveProperty('disabled')
  })
})
```

- [ ] **Step 6: Create Switch tests**

Create `packages/components/src/switch/__tests__/switch.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Switch from '../switch.vue'

describe('Switch', () => {
  it('renders role switch, checked state, and checked label', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true, checkedChildren: 'On', unCheckedChildren: 'Off' }
    })

    expect(wrapper.classes()).toContain('aheart-switch')
    expect(wrapper.attributes('role')).toBe('switch')
    expect(wrapper.attributes('aria-checked')).toBe('true')
    expect(wrapper.text()).toContain('On')
  })

  it('emits model update and change when clicked', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('does not emit when loading', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false, loading: true }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('uses ConfigProvider size and disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small', disabled: true },
      slots: {
        default: {
          render() {
            return h(Switch)
          }
        }
      }
    })

    const control = wrapper.findComponent(Switch)
    expect(control.classes()).toContain('aheart-switch--small')
    expect(control.attributes()).toHaveProperty('disabled')
  })
})
```

- [ ] **Step 7: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- input textarea input-number checkbox radio switch
```

Expected: FAIL because implementation files do not exist yet.

## Task 2: Implement Data Entry Components

- [ ] **Step 1: Create component files**

Create typed props, Vue implementation, CSS, and install entry for:

- `packages/components/src/input`
- `packages/components/src/textarea`
- `packages/components/src/input-number`
- `packages/components/src/checkbox`
- `packages/components/src/radio`
- `packages/components/src/switch`

Each component must match the API in `docs/superpowers/specs/2026-06-22-ant-style-data-entry-primitives-design.md`.

- [ ] **Step 2: Update package root exports**

Modify `packages/components/src/index.ts` so each new component is imported, registered in the `components` array, and exported by name.

- [ ] **Step 3: Run targeted verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- input textarea input-number checkbox radio switch
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit source**

```bash
git add packages/components/src/input packages/components/src/textarea packages/components/src/input-number packages/components/src/checkbox packages/components/src/radio packages/components/src/switch packages/components/src/index.ts
git commit -m "feat: add data entry primitives"
```

## Task 3: Add Documentation

- [ ] **Step 1: Update component metadata**

Modify `docs/.vitepress/data/components.ts`:

- `Input` -> Ready with `/components/input`
- `Textarea` -> Ready with `/components/textarea`
- `InputNumber` -> Ready with `/components/input-number`
- `Checkbox` -> Ready with `/components/checkbox`
- `Radio` -> Ready with `/components/radio`
- `Switch` -> Ready with `/components/switch`

- [ ] **Step 2: Update sidebar**

Modify `docs/.vitepress/config.ts` and add:

- `Input 输入框`
- `Textarea 文本域`
- `InputNumber 数字输入框`
- `Checkbox 多选框`
- `Radio 单选框`
- `Switch 开关`

- [ ] **Step 3: Create component docs**

Create:

- `docs/components/input.md`
- `docs/components/textarea.md`
- `docs/components/input-number.md`
- `docs/components/checkbox.md`
- `docs/components/radio.md`
- `docs/components/switch.md`

Each page must include a Ready badge, description, demos, Vue code, API table, events, slots where applicable, and theme token notes.

- [ ] **Step 4: Build docs and commit**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Remove `docs/.vitepress/cache` if generated, then commit:

```bash
git add docs/.vitepress/config.ts docs/.vitepress/data/components.ts docs/components/input.md docs/components/textarea.md docs/components/input-number.md docs/components/checkbox.md docs/components/radio.md docs/components/switch.md
git commit -m "docs: add data entry primitive documentation"
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
test -f packages/components/es/input/index.d.ts
test -f packages/components/es/textarea/index.d.ts
test -f packages/components/es/input-number/index.d.ts
test -f packages/components/es/checkbox/index.d.ts
test -f packages/components/es/radio/index.d.ts
test -f packages/components/es/switch/index.d.ts
test -f packages/components/lib/input/index.d.ts
test -f packages/components/lib/textarea/index.d.ts
test -f packages/components/lib/input-number/index.d.ts
test -f packages/components/lib/checkbox/index.d.ts
test -f packages/components/lib/radio/index.d.ts
test -f packages/components/lib/switch/index.d.ts
test ! -e docs/.vitepress/dist/superpowers
```

Expected: all commands exit 0.

- [ ] **Step 3: Commit build outputs**

```bash
git add packages/components/es packages/components/lib
git commit -m "build: update data entry component outputs"
```

- [ ] **Step 4: Final status**

Run:

```bash
git status --short --branch
```

Expected: clean branch.

## Self-Review

- Spec coverage: All six components from the design doc are covered by tests, implementation, docs, and build output tasks.
- Placeholder scan: No unresolved placeholder markers are present.
- Type consistency: Component names and event names match the design doc and tests.
