# Ant Style Message Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Message and Skeleton as Ready Feedback components.

**Architecture:** Message is split into a presentational host component and a lightweight DOM-mounted service. Skeleton is a focused placeholder component that switches between loading placeholders and slot content.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Message`
- `message` static service
- `Skeleton`
- package root exports and plugin install
- docs pages and Ready status
- package build output refresh

This plan does not cover message hooks/context, promise chaining, app-level providers, message placement variants, or Skeleton input/button/image node variants.

## Task 1: Write Failing Tests

**Files:**
- Create: `packages/components/src/message/__tests__/message.test.ts`
- Create: `packages/components/src/skeleton/__tests__/skeleton.test.ts`

- [ ] **Step 1: Create Message tests**

Create `packages/components/src/message/__tests__/message.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Message, { message } from '../index'

afterEach(() => {
  message.destroy()
})

describe('Message', () => {
  it('renders notices and emits close', async () => {
    const wrapper = mount(Message, {
      props: {
        notices: [
          { key: 'saved', type: 'success', content: 'Saved' },
          { key: 'failed', type: 'error', content: 'Failed' }
        ]
      }
    })

    expect(wrapper.classes()).toContain('aheart-message')
    expect(wrapper.text()).toContain('Saved')
    expect(wrapper.text()).toContain('Failed')
    expect(wrapper.find('.aheart-message-notice--success').exists()).toBe(true)

    await wrapper.find('.aheart-message-notice__close').trigger('click')

    expect(wrapper.emitted('close')?.[0]).toEqual(['saved'])
  })

  it('message.success mounts a global persistent notice', async () => {
    message.success('Saved', 0)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(document.body.querySelector('.aheart-message')).toBeTruthy()
    expect(document.body.textContent).toContain('Saved')
  })

  it('updates notices by key', async () => {
    message.loading({ key: 'upload', content: 'Uploading', duration: 0 })
    message.success({ key: 'upload', content: 'Uploaded', duration: 0 })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(document.body.textContent).not.toContain('Uploading')
    expect(document.body.textContent).toContain('Uploaded')
    expect(document.body.querySelectorAll('.aheart-message-notice')).toHaveLength(1)
  })

  it('applies top and maxCount config', async () => {
    message.config({ top: 32, maxCount: 1 })
    message.info('First', 0)
    message.warning('Second', 0)
    await new Promise((resolve) => setTimeout(resolve, 0))

    const host = document.body.querySelector('.aheart-message') as HTMLElement
    expect(host.getAttribute('style')).toContain('top: 32px')
    expect(document.body.textContent).not.toContain('First')
    expect(document.body.textContent).toContain('Second')
  })

  it('destroys notices by key or all notices', async () => {
    message.info({ key: 'one', content: 'One', duration: 0 })
    message.info({ key: 'two', content: 'Two', duration: 0 })
    await new Promise((resolve) => setTimeout(resolve, 0))

    message.destroy('one')
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(document.body.textContent).not.toContain('One')
    expect(document.body.textContent).toContain('Two')

    message.destroy()
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(document.body.querySelectorAll('.aheart-message-notice')).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Create Skeleton tests**

Create `packages/components/src/skeleton/__tests__/skeleton.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Skeleton from '../skeleton.vue'

describe('Skeleton', () => {
  it('renders default title and paragraph placeholders', () => {
    const wrapper = mount(Skeleton)

    expect(wrapper.classes()).toContain('aheart-skeleton')
    expect(wrapper.find('.aheart-skeleton__title').exists()).toBe(true)
    expect(wrapper.findAll('.aheart-skeleton__paragraph-row')).toHaveLength(3)
  })

  it('renders active avatar title paragraph and round variants', () => {
    const wrapper = mount(Skeleton, {
      props: {
        active: true,
        round: true,
        avatar: { size: 40, shape: 'circle' },
        title: { width: '60%' },
        paragraph: { rows: 2, width: ['80%', '50%'] }
      }
    })

    expect(wrapper.classes()).toContain('is-active')
    expect(wrapper.classes()).toContain('is-round')
    expect(wrapper.find('.aheart-skeleton__avatar').attributes('style')).toContain('width: 40px')
    expect(wrapper.find('.aheart-skeleton__title').attributes('style')).toContain('width: 60%')
    expect(wrapper.findAll('.aheart-skeleton__paragraph-row')).toHaveLength(2)
  })

  it('renders slot content when loading is false', () => {
    const wrapper = mount(Skeleton, {
      props: { loading: false },
      slots: { default: '<div class="loaded">Loaded</div>' }
    })

    expect(wrapper.find('.loaded').text()).toBe('Loaded')
    expect(wrapper.find('.aheart-skeleton__title').exists()).toBe(false)
  })
})
```

- [ ] **Step 3: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- message skeleton
```

Expected: FAIL because Message and Skeleton implementation files do not exist.

## Task 2: Implement Message And Skeleton

**Files:**
- Create: `packages/components/src/message/message.vue`
- Create: `packages/components/src/message/service.ts`
- Create: `packages/components/src/message/types.ts`
- Create: `packages/components/src/message/style.css`
- Create: `packages/components/src/message/index.ts`
- Create: `packages/components/src/skeleton/skeleton.vue`
- Create: `packages/components/src/skeleton/types.ts`
- Create: `packages/components/src/skeleton/style.css`
- Create: `packages/components/src/skeleton/index.ts`
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Create component and service files**

Create component files matching `docs/superpowers/specs/2026-06-22-ant-style-message-skeleton-design.md`.

The implementation must:

- render `AMessage` as a top-centered notice host
- expose the static `message` service
- support message type helpers, keyed updates, duration, top, maxCount, and destroy
- render `ASkeleton` placeholders with loading/active/avatar/title/paragraph/round behavior

- [ ] **Step 2: Update package root exports**

Modify `packages/components/src/index.ts` so Message, Skeleton, and `message` are imported, registered/exported where appropriate.

- [ ] **Step 3: Run targeted verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- message skeleton
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit source**

```bash
git add packages/components/src/message packages/components/src/skeleton packages/components/src/index.ts
git commit -m "feat: add message and skeleton components"
```

## Task 3: Add Documentation

**Files:**
- Modify: `docs/.vitepress/data/components.ts`
- Modify: `docs/.vitepress/config.ts`
- Create: `docs/components/message.md`
- Create: `docs/components/skeleton.md`

- [ ] **Step 1: Update component metadata**

Modify `docs/.vitepress/data/components.ts`:

- `Message` -> Ready with `/components/message`
- `Skeleton` -> Ready with `/components/skeleton`

- [ ] **Step 2: Update sidebar**

Modify `docs/.vitepress/config.ts` and add:

- `Message 全局提示`
- `Skeleton 骨架屏`

- [ ] **Step 3: Create component docs**

Create `docs/components/message.md` and `docs/components/skeleton.md` with:

- Ready badge
- demos
- API tables
- service method tables
- event tables where applicable
- theme token notes

- [ ] **Step 4: Build docs and commit**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: PASS.

Then commit:

```bash
git add docs/.vitepress/data/components.ts docs/.vitepress/config.ts docs/components/message.md docs/components/skeleton.md
git commit -m "docs: add message and skeleton documentation"
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
test -f packages/components/es/message/index.d.ts && test -f packages/components/es/skeleton/index.d.ts && test -f packages/components/lib/message/index.d.ts && test -f packages/components/lib/skeleton/index.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo declarations-and-docs-ok
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
git commit -m "build: update message and skeleton outputs"
```

## Self-Review

- Spec coverage: all Message and Skeleton design requirements map to tests, implementation, docs, and build output tasks.
- Placeholder scan: the plan contains no TBD/TODO/fill-in placeholders.
- Type consistency: `MessageNotice`, `MessageConfig`, `SkeletonAvatarConfig`, and `SkeletonParagraphConfig` names are consistent across the plan.
