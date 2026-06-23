# Ant Style Drawer Destroy Inactive Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Ant-compatible deprecated `destroyInactivePanel` alias to Drawer.

**Architecture:** Keep Drawer lifecycle behavior in `drawer.vue`. Add the alias as a boolean prop in `types.ts`, include it in the existing destroy computed value, and document it as a compatibility alias for `destroyOnHidden`.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite component build, VitePress docs.

---

### Task 1: Failing Drawer Alias Tests

**Files:**
- Modify: `packages/components/src/drawer/__tests__/drawer.test.ts`

- [ ] **Step 1: Add tests after `supports afterOpenChange forceRender and destroyOnHidden`**

```ts
  it('treats destroyInactivePanel as a destroyOnHidden alias', async () => {
    const wrapper = mountDrawer({
      props: { open: true, destroyInactivePanel: true, title: 'Legacy destroy' },
      slots: {
        default: '<button class="legacy-destroy-control">Legacy control</button>'
      }
    })

    expect(wrapper.find('.legacy-destroy-control').exists()).toBe(true)

    await wrapper.setProps({ open: false })

    expect(wrapper.find('.aheart-drawer').exists()).toBe(false)
    expect(wrapper.emitted('afterOpenChange')?.[0]).toEqual([false])
  })

  it('keeps forceRender ahead of destroyInactivePanel', async () => {
    const wrapper = mountDrawer({
      props: {
        open: true,
        forceRender: true,
        destroyInactivePanel: true,
        title: 'Forced legacy destroy'
      },
      slots: {
        default: '<button class="forced-legacy-control">Forced control</button>'
      }
    })

    await wrapper.setProps({ open: false })

    expect(wrapper.find('.aheart-drawer').exists()).toBe(true)
    expect(wrapper.find('.forced-legacy-control').exists()).toBe(true)
  })
```

- [ ] **Step 2: Run the focused test and confirm red**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: FAIL because `destroyInactivePanel` is not defined on Drawer props and the drawer remains rendered after closing.

### Task 2: Drawer Alias Implementation

**Files:**
- Modify: `packages/components/src/drawer/types.ts`
- Modify: `packages/components/src/drawer/drawer.vue`

- [ ] **Step 1: Add the prop**

In `packages/components/src/drawer/types.ts`, add the prop near `destroyOnClose` and `destroyOnHidden`:

```ts
  destroyOnClose: Boolean,
  destroyOnHidden: Boolean,
  destroyInactivePanel: Boolean
```

- [ ] **Step 2: Include the alias in the destroy decision**

In `packages/components/src/drawer/drawer.vue`, replace the current destroy computed value with:

```ts
const shouldDestroy = computed(() => props.destroyOnHidden || props.destroyOnClose || props.destroyInactivePanel)
```

- [ ] **Step 3: Run the focused test and confirm green**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
```

Expected: PASS with all Drawer tests green.

### Task 3: Docs and Generated Output

**Files:**
- Modify: `docs/components/drawer.md`
- Generated: `packages/components/es/drawer/*`
- Generated: `packages/components/lib/drawer/*`

- [ ] **Step 1: Document the alias**

Add this API row after `destroyOnHidden`:

```md
| destroyInactivePanel | 关闭后销毁内容；废弃兼容别名，优先使用 `destroyOnHidden` | `boolean` | `false` |
```

- [ ] **Step 2: Refresh generated component output**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
```

Expected: build succeeds and generated Drawer declaration/runtime files include `destroyInactivePanel`.

### Task 4: Verification, Commit, Push, and Merge

**Files:**
- Stage only Drawer source/tests/docs, this stage's spec/plan, and generated Drawer outputs.

- [ ] **Step 1: Run verification**

Run:

```bash
cd packages/components
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom src/drawer/__tests__/drawer.test.ts
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vue-tsc --noEmit -p tsconfig.json
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vitest run --environment jsdom
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ../../node_modules/.bin/vite build
cd ../../docs
PATH="/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" node_modules/.bin/vitepress build .
cd ..
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 2: Commit and publish**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-drawer-destroy-inactive-panel-design.md docs/superpowers/plans/2026-06-23-ant-style-drawer-destroy-inactive-panel.md docs/components/drawer.md packages/components/src/drawer packages/components/es/drawer packages/components/lib/drawer
git commit -m "feat: align drawer destroy alias"
git push origin codex/consolidated-ant-style-foundation
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

Expected: the work branch and `master` both point to the new stage commit.

## Self Review

- Spec coverage: tests, implementation, docs, generated output, verification, commit, push, and merge are represented.
- Placeholder scan: no placeholder wording remains.
- Type consistency: `destroyInactivePanel` is used consistently across all planned files and commands.
