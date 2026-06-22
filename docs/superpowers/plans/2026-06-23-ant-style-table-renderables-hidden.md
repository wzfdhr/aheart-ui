# Ant Style Table Renderables and Hidden Columns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render Ant-style Table column titles, custom cells, and expanded rows as VNodes, and support hidden columns.

**Architecture:** Keep `ATable` as one Vue SFC backed by `types.ts`. Broaden the `TableColumn` title type, add a local render helper, filter hidden columns in the existing normalized column pipeline, and render cell / expanded output through the helper.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- Renderable `TableColumn.title`.
- Renderable `TableColumn.customRender` output.
- Renderable `TableExpandable.expandedRowRender` output.
- `TableColumn.hidden`.
- Docs and generated package output refresh.

This plan does not add nested column groups, fixed columns, sticky headers, virtual scrolling, drag sorting, column resizing, or remote loading.

## Files

- Modify: `packages/components/src/table/types.ts`
- Modify: `packages/components/src/table/table.vue`
- Modify: `packages/components/src/table/__tests__/table.test.ts`
- Modify: `docs/components/table.md`
- Generated after build: `packages/components/es/table/*`
- Generated after build: `packages/components/lib/table/*`

## Task 1: Write Failing Table Tests

- [ ] **Step 1: Add renderable and hidden column tests**

In `packages/components/src/table/__tests__/table.test.ts`, add these tests after `renders columns and rows from dataSource`:

```ts
it('renders vnode column titles custom cells and expanded content', async () => {
  const wrapper = mount(Table, {
    props: {
      columns: [
        {
          title: h('span', { class: 'title-node' }, 'Name node'),
          dataIndex: 'name',
          key: 'name',
          customRender: ({ text }) => h('strong', { class: 'cell-node' }, String(text))
        }
      ],
      dataSource,
      expandable: {
        expandedRowRender: (record) => h('span', { class: 'expanded-node' }, `${record.name} details`)
      }
    }
  })

  expect(wrapper.find('.title-node').text()).toBe('Name node')
  expect(wrapper.find('.cell-node').text()).toBe('Ada')

  await wrapper.find('.aheart-table__expand-button').trigger('click')

  expect(wrapper.find('.expanded-node').text()).toBe('Ada details')
})

it('omits hidden columns from headers body cells and column count', () => {
  const wrapper = mount(Table, {
    props: {
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Secret', dataIndex: 'role', key: 'secret', hidden: true },
        { title: 'Age', dataIndex: 'age', key: 'age' }
      ],
      dataSource: [dataSource[0]],
      expandable: {
        defaultExpandedRowKeys: ['ada'],
        expandedRowRender: () => 'Expanded'
      }
    }
  })

  expect(wrapper.findAll('th').map((cell) => cell.text())).toEqual(['', 'Name', 'Age'])
  expect(wrapper.find('tbody tr').text()).not.toContain('Architect')
  expect(wrapper.find('.aheart-table__expanded-cell').attributes('colspan')).toBe('3')
})
```

- [ ] **Step 2: Run targeted test to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- table
```

Expected: the new tests fail because VNodes are not rendered as DOM and hidden columns are still rendered.

## Task 2: Extend Table Types

- [ ] **Step 1: Add renderable type and hidden column field**

In `packages/components/src/table/types.ts`, add:

```ts
export type TableRenderable = VNodeChild
```

Update `TableColumn`:

```ts
export interface TableColumn<T extends TableRecord = TableRecord> {
  title: TableRenderable
  dataIndex?: keyof T | TableDataIndex
  key?: string
  align?: TableColumnAlign
  width?: string | number
  className?: string
  hidden?: boolean
  ...
}
```

## Task 3: Render Nodes and Filter Hidden Columns

- [ ] **Step 1: Add render helper**

In `packages/components/src/table/table.vue`, update imports:

```ts
import { computed, defineComponent, ref, watch, type PropType, type VNodeChild } from 'vue'
```

Add this helper after `defineOptions`:

```ts
const ARenderNode = defineComponent({
  name: 'ATableRenderNode',
  props: {
    node: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderProps.node
  }
})
```

- [ ] **Step 2: Filter hidden columns**

Change `normalizedColumns`:

```ts
const normalizedColumns = computed(() => (props.columns ?? []).filter((column) => !column.hidden))
```

- [ ] **Step 3: Render headers and cells through helper**

Replace header title mustache output:

```vue
<span><ARenderNode :node="column.title" /></span>
```

```vue
<span v-else class="aheart-table__title"><ARenderNode :node="column.title" /></span>
```

Replace body cell output:

```vue
<ARenderNode :node="renderCell(column, row.record, row.index)" />
```

Replace expanded row output:

```vue
<ARenderNode :node="renderExpanded(row.record, row.index)" />
```

- [ ] **Step 4: Run targeted test to verify GREEN**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- table
```

Expected: all Table tests pass.

## Task 4: Update Table Documentation

- [ ] **Step 1: Update demos and API table**

In `docs/components/table.md`:

- Add a custom render demo that uses `customRender`.
- Change `TableColumn.title` type to `VNodeChild`.
- Add `hidden` to the `TableColumn` API table.
- Clarify `customRender` and `expandedRowRender` output as rendered `VNodeChild`.

- [ ] **Step 2: Build docs once**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
```

Expected: VitePress build exits 0.

## Task 5: Refresh Generated Outputs and Verify

- [ ] **Step 1: Run full typecheck**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 typecheck
```

- [ ] **Step 2: Run full tests**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 test
```

- [ ] **Step 3: Build package outputs**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 build
```

- [ ] **Step 4: Clean known generated drift for non-Table components**

Run:

```bash
git diff -- packages/components/es/checkbox packages/components/lib/checkbox packages/components/es/radio packages/components/lib/radio packages/components/es/steps packages/components/lib/steps packages/components/es/form packages/components/lib/form packages/components/es/modal packages/components/lib/modal packages/components/es/drawer packages/components/lib/drawer packages/components/es/pagination packages/components/lib/pagination | git apply -R
```

- [ ] **Step 5: Build docs and clean cache**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm dlx pnpm@9.15.4 docs:build
rm -rf docs/.vitepress/cache
```

- [ ] **Step 6: Check diff hygiene**

Run:

```bash
git diff --check
git status --short --branch
```

- [ ] **Step 7: Commit slice**

Run:

```bash
git add docs/superpowers/specs/2026-06-23-ant-style-table-renderables-hidden-design.md docs/superpowers/plans/2026-06-23-ant-style-table-renderables-hidden.md packages/components/src/table/types.ts packages/components/src/table/table.vue packages/components/src/table/__tests__/table.test.ts docs/components/table.md packages/components/es/table packages/components/lib/table
git commit -m "feat: align table renderable columns"
```

## Self-Review

- Spec coverage: every behavior in the design has a task.
- Placeholder scan: no TODO/TBD placeholders.
- Type consistency: `TableRenderable`, `TableColumn.title`, `hidden`, `customRender`, and `expandedRowRender` names are consistent across tasks.
