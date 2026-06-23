# Ant Style Modal Renderable Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align Aheart Modal title, button label, and footer props with Ant-style renderable content APIs.

**Architecture:** Keep `AModal` as one Vue SFC backed by `types.ts`. Widen the relevant prop types to `VNodeChild`, reuse the existing local render-node helper, and build default footer button nodes in script so renderable footers and footer render functions can share the same OK/Cancel behavior.

**Tech Stack:** Vue 3 SFC, TypeScript, Vitest, Vue Test Utils, VitePress docs, package build output under `packages/components/es` and `packages/components/lib`.

---

## File Structure

- Modify `packages/components/src/modal/types.ts` for renderable title/label/footer types.
- Modify `packages/components/src/modal/modal.vue` for title rendering, footer rendering, and default footer node creation.
- Modify `packages/components/src/modal/__tests__/modal.test.ts` for TDD coverage.
- Modify `docs/components/modal.md` for examples and API docs.
- Generate `packages/components/es/modal/*` and `packages/components/lib/modal/*` with the component build.

### Task 1: Modal Renderable Content Tests

**Files:**
- Modify: `packages/components/src/modal/__tests__/modal.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
it('renders vnode title and action text props', async () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      title: h('span', { class: 'title-node' }, 'Rich title'),
      okText: h('span', { class: 'ok-node' }, 'Confirm'),
      cancelText: h('span', { class: 'cancel-node' }, 'Dismiss')
    }
  })

  expect(wrapper.find('.title-node').text()).toBe('Rich title')
  expect(wrapper.find('.ok-node').text()).toBe('Confirm')
  expect(wrapper.find('.cancel-node').text()).toBe('Dismiss')

  await wrapper.find('.aheart-modal__ok').trigger('click')
  await wrapper.find('.aheart-modal__cancel').trigger('click')

  expect(wrapper.emitted('ok')).toHaveLength(1)
  expect(wrapper.emitted('cancel')).toHaveLength(1)
})

it('renders numeric zero title and action text props', () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      title: 0,
      okText: 0,
      cancelText: 0
    }
  })

  expect(wrapper.find('.aheart-modal__title').text()).toBe('0')
  expect(wrapper.find('.aheart-modal__ok').text()).toBe('0')
  expect(wrapper.find('.aheart-modal__cancel').text()).toBe('0')
})

it('keeps title slot above renderable title prop', () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      title: h('span', { class: 'title-prop' }, 'Prop title')
    },
    slots: {
      title: '<span class="title-slot">Slot title</span>'
    }
  })

  expect(wrapper.find('.title-slot').text()).toBe('Slot title')
  expect(wrapper.find('.title-prop').exists()).toBe(false)
})

it('renders footer prop content instead of default buttons', () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      footer: h('div', { class: 'footer-node' }, 'Custom footer')
    }
  })

  expect(wrapper.find('.footer-node').text()).toBe('Custom footer')
  expect(wrapper.find('.aheart-modal__ok').exists()).toBe(false)
  expect(wrapper.find('.aheart-modal__cancel').exists()).toBe(false)
})

it('lets footer render function compose default action buttons', async () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      footer: (_originNode, { cancelButton, okButton }) =>
        h('div', { class: 'footer-render' }, [cancelButton, okButton])
    }
  })

  expect(wrapper.find('.footer-render').exists()).toBe(true)

  await wrapper.find('.aheart-modal__ok').trigger('click')
  await wrapper.find('.aheart-modal__cancel').trigger('click')

  expect(wrapper.emitted('ok')).toHaveLength(1)
  expect(wrapper.emitted('cancel')).toHaveLength(1)
})

it('hides the default footer when footer is null', () => {
  const wrapper = mount(Modal, {
    props: {
      open: true,
      footer: null
    }
  })

  expect(wrapper.find('.aheart-modal__footer').exists()).toBe(false)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts`

Expected: FAIL because `title`, `okText`, `cancelText`, and `footer` props do not yet accept or render VNode content.

### Task 2: Modal Renderable Content Implementation

**Files:**
- Modify: `packages/components/src/modal/types.ts`
- Modify: `packages/components/src/modal/modal.vue`

- [ ] **Step 1: Add renderable modal types**

Define `ModalFooterRenderExtra`, `ModalFooterRender`, and `ModalFooter`. Widen `title`, `okText`, `cancelText`, and `footer`.

- [ ] **Step 2: Render title through `AModalRenderNode`**

Add a `hasRenderable` helper and `hasTitle` computed value. Use the title slot first, then render `title` through `AModalRenderNode`.

- [ ] **Step 3: Build default footer button nodes in script**

Create `cancelButtonNode`, `okButtonNode`, and `defaultFooterNode` computed values with the existing `handleCancel` / `handleOk` handlers and resolved button props.

- [ ] **Step 4: Resolve footer content**

Render the footer slot first. Otherwise, render a footer function result, renderable footer prop, or default footer node according to the spec precedence.

- [ ] **Step 5: Verify modal tests pass**

Run: `PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/modal/__tests__/modal.test.ts`

Expected: PASS.

### Task 3: Docs, Build Outputs, And Publish

**Files:**
- Modify: `docs/components/modal.md`
- Modify generated output under `packages/components/es/modal/*`
- Modify generated output under `packages/components/lib/modal/*`

- [ ] **Step 1: Update Modal docs**

Add a renderable-content example and document the widened API types.

- [ ] **Step 2: Run full verification**

Run component tests, typecheck, component build, docs build, `git diff --check`, and inspect the final staged diff.

- [ ] **Step 3: Commit and publish**

Stage only this phase, commit as `feat: align modal renderable content`, push `codex/consolidated-ant-style-foundation`, fast-forward merge into `master`, push `master`, then switch back to the work branch.

## Self-Review

- Spec coverage: all spec requirements map to Task 1, Task 2, or Task 3.
- Placeholder scan: no TBD/TODO/fill-in placeholders.
- Type consistency: `ModalRenderable`, `ModalFooter`, `ModalFooterRender`, and `ModalFooterRenderExtra` are named consistently.
