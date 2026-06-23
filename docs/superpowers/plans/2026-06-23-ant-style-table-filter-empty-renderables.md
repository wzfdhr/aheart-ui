# Ant Style Table Filter Empty Renderables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align Table filter labels and empty-state content with Ant-style renderable APIs.

**Architecture:** Reuse Table's existing `TableRenderable` type and local `ARenderNode` helper. Keep behavior scoped to rendering surfaces; filtering, sorting, selection, expansion, and pagination logic stay unchanged.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, pnpm workspace build.

---

## File Map

- Modify `packages/components/src/table/types.ts`: widen `TableColumnFilter.text` and `emptyText`.
- Modify `packages/components/src/table/table.vue`: render filter text and empty text through `ARenderNode`.
- Modify `packages/components/src/table/__tests__/table.test.ts`: add failing coverage for VNode filter and empty content.
- Modify `docs/components/table.md`: add a renderable filter/empty example and update API tables.
- Update generated package output in `packages/components/es/table` and `packages/components/lib/table` through the normal build.

### Task 1: Add Table Renderable Test

**Files:**
- Modify: `packages/components/src/table/__tests__/table.test.ts`

- [x] **Step 1: Write the failing test**

```ts
it('renders vnode filter labels and empty content', () => {
  const wrapper = mount(Table, {
    props: {
      columns: [
        {
          title: 'Role',
          dataIndex: 'role',
          key: 'role',
          filters: [{ text: h('span', { class: 'filter-node' }, 'Engineer filter'), value: 'Engineer' }]
        }
      ],
      dataSource: [],
      emptyText: h('span', { class: 'empty-node' }, 'No engineers')
    }
  })

  expect(wrapper.find('.filter-node').text()).toBe('Engineer filter')
  expect(wrapper.find('.empty-node').text()).toBe('No engineers')
})
```

- [x] **Step 2: Run test to verify it fails**

Run: `PATH="/Users/start/.local/share/pnpm:$PATH" pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- table`

Expected: FAIL because VNode filter text and empty content are not rendered as nodes yet.

### Task 2: Widen Types And Render Nodes

**Files:**
- Modify: `packages/components/src/table/types.ts`
- Modify: `packages/components/src/table/table.vue`

- [x] **Step 1: Widen TypeScript props**

Change `TableColumnFilter.text` from `string` to `TableRenderable`, and change `emptyText` from `String` to a `PropType<TableRenderable>` that accepts primitive, object, and array values.

- [x] **Step 2: Render through ARenderNode**

Use `ARenderNode` inside filter buttons and the empty cell. Add a tiny helper so `resolvedEmptyText` preserves explicit `0` while falling back for absent content.

- [x] **Step 3: Run test to verify it passes**

Run: `PATH="/Users/start/.local/share/pnpm:$PATH" pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- table`

Expected: PASS for the Table suite.

### Task 3: Update Table Docs

**Files:**
- Modify: `docs/components/table.md`

- [x] **Step 1: Add renderable docs example**

Add a compact example in the filter section showing `h('span', ...)` for `filters[].text` and `emptyText`.

- [x] **Step 2: Update API rows**

Change `emptyText` and `TableColumnFilter.text` type rows from `string` to `VNodeChild`.

### Task 4: Verify, Build, Commit, Push, And Merge

**Files:**
- Generated: `packages/components/es/table`
- Generated: `packages/components/lib/table`

- [x] **Step 1: Run verification**

Run:

```bash
PATH="/Users/start/.local/share/pnpm:$PATH" pnpm dlx pnpm@9.15.4 typecheck
PATH="/Users/start/.local/share/pnpm:$PATH" pnpm dlx pnpm@9.15.4 test
PATH="/Users/start/.local/share/pnpm:$PATH" pnpm dlx pnpm@9.15.4 build
PATH="/Users/start/.local/share/pnpm:$PATH" pnpm dlx pnpm@9.15.4 docs:build
git diff --check
```

Expected: all commands exit 0.

- [x] **Step 2: Stage phase files explicitly**

Run:

```bash
git add docs/components/table.md docs/superpowers/specs/2026-06-23-ant-style-table-filter-empty-renderables-design.md docs/superpowers/plans/2026-06-23-ant-style-table-filter-empty-renderables.md packages/components/src/table/types.ts packages/components/src/table/table.vue packages/components/src/table/__tests__/table.test.ts packages/components/es/table packages/components/lib/table
```

- [ ] **Step 3: Commit**

Run: `git commit -m "feat: align table renderable filter empty"`

- [ ] **Step 4: Push and merge**

Run:

```bash
git push -u origin codex/consolidated-ant-style-foundation
git fetch origin master codex/consolidated-ant-style-foundation
git checkout master
git pull --ff-only origin master
git merge --ff-only codex/consolidated-ant-style-foundation
git push origin master
git checkout codex/consolidated-ant-style-foundation
```

Expected: branch push succeeds and master fast-forwards to the phase commit.
