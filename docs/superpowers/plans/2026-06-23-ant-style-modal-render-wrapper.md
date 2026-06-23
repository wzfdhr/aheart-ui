# Ant Style Modal Render Wrapper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align Aheart Modal with Ant-style `modalRender` support for custom dialog content rendering.

**Architecture:** Add a typed render-function prop to `types.ts`. Keep the existing template structure, but route the dialog section through a local render-wrapper component that calls `modalRender` with the default slot VNode array and renders the returned node without adding DOM when the prop is omitted.

**Tech Stack:** Vue 3 SFC, TypeScript, Vitest, Vue Test Utils, VitePress docs, package build output under `packages/components/es` and `packages/components/lib`.

---

## File Structure

- Modify `packages/components/src/modal/types.ts` to add `ModalRender` and `modalRender`.
- Modify `packages/components/src/modal/modal.vue` to wrap the dialog section with a local render-wrapper component.
- Modify `packages/components/src/modal/__tests__/modal.test.ts` to cover the render hook.
- Modify `docs/components/modal.md` to document and demonstrate the prop.
- Generate `packages/components/es/modal/*` and `packages/components/lib/modal/*` with the component build.

### Task 1: Modal Render Wrapper Tests

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
it('renders modalRender result around the dialog node', () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      title: 'Wrapped modal',
      modalRender: (node: unknown) => h('div', { class: 'modal-render-shell' }, [node])
    },
    slots: { default: 'Wrapped body' }
  })

  expect(wrapper.find('.modal-render-shell').exists()).toBe(true)
  expect(wrapper.find('.modal-render-shell .aheart-modal__dialog').exists()).toBe(true)
  expect(wrapper.text()).toContain('Wrapped modal')
  expect(wrapper.text()).toContain('Wrapped body')
})

it('preserves footer interactions inside modalRender', async () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      modalRender: (node: unknown) => h('div', { class: 'modal-render-shell' }, [node])
    }
  })

  await wrapper.find('.aheart-modal__ok').trigger('click')
  await wrapper.find('.aheart-modal__cancel').trigger('click')

  expect(wrapper.emitted('ok')).toHaveLength(1)
  expect(wrapper.emitted('cancel')).toHaveLength(1)
  expect(wrapper.emitted('close')).toHaveLength(1)
  expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: FAIL because `modalRender` is not applied to the dialog node yet.

### Task 2: Modal Render Wrapper Implementation

**Files:**
- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`

- [ ] **Step 1: Add the prop type**

Add:

```ts
export type ModalRender = (node: ModalRenderable) => ModalRenderable
```

Then add this prop to `modalProps`:

```ts
modalRender: Function as PropType<ModalRender>,
```

- [ ] **Step 2: Add the render-wrapper component**

Add a local component:

```ts
const AModalRenderWrapper = defineComponent({
  name: 'AModalRenderWrapper',
  props: {
    renderer: Function as PropType<ModalRender>
  },
  setup(renderProps, { slots }) {
    return () => {
      const node = slots.default?.()
      return renderProps.renderer ? renderProps.renderer(node) : node
    }
  }
})
```

- [ ] **Step 3: Wrap the dialog section**

Inside `.aheart-modal__wrap`, wrap the existing `<section>`:

```vue
<AModalRenderWrapper :renderer="modalRender">
  <section ...>
    ...
  </section>
</AModalRenderWrapper>
```

- [ ] **Step 4: Run tests to verify they pass**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts
```

Expected: PASS.

### Task 3: Docs, Build Outputs, And Publish

**Files:**
- Modify: `docs/components/modal.md`
- Modify generated output under `packages/components/es/modal/*`
- Modify generated output under `packages/components/lib/modal/*`

- [ ] **Step 1: Update Modal docs**

Add a custom render example and this row to the API table:

```md
| modalRender | 自定义渲染对话框内容 | `(node: VNodeChild) => VNodeChild` | - |
```

- [ ] **Step 2: Run full verification**

Run from `packages/components`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Run from `docs`:

```bash
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../node_modules/.bin/vitepress build .
```

Run from the repository root:

```bash
git diff -- packages/components/es/drawer packages/components/lib/drawer packages/components/es/form packages/components/lib/form | git apply -R
git diff --check
git status --short
```

- [ ] **Step 3: Commit and publish**

Run from the repository root:

```bash
git add docs/components/modal.md \
  docs/superpowers/plans/2026-06-23-ant-style-modal-render-wrapper.md \
  docs/superpowers/specs/2026-06-23-ant-style-modal-render-wrapper-design.md \
  packages/components/src/modal/types.ts \
  packages/components/src/modal/modal.vue \
  packages/components/src/modal/__tests__/modal.test.ts \
  packages/components/es/modal \
  packages/components/lib/modal
git commit -m "feat: align modal render wrapper"
git push -u origin codex/consolidated-ant-style-foundation
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

## Self-Review

- Spec coverage: all spec requirements map to Task 1, Task 2, or Task 3.
- Placeholder scan: no TBD/TODO/fill-in placeholders.
- Type consistency: `ModalRender` and `modalRender` are named consistently across tests, props, docs, and generated outputs.
