# Ant Style Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Table as a Ready Data Display component.

**Architecture:** Table is a semantic native table with typed columns, local sorting, optional row selection, optional expandable rows, and local pagination through the existing APagination component. It follows established component folder patterns and inherits size/disabled state from ConfigProvider.

**Tech Stack:** Vue 3, TypeScript, Vite, vite-plugin-dts, Vitest, Vue Test Utils, VitePress, pnpm workspace.

---

## Scope

This plan covers:

- `Table`
- package root exports and plugin install
- docs page and Ready status
- package build output refresh

This plan does not cover filters, fixed columns, fixed headers, virtual scrolling, editable rows, tree data, grouped headers, or drag sorting.

## Task 1: Write Failing Tests

**Files:**
- Create: `packages/components/src/table/__tests__/table.test.ts`

- [ ] **Step 1: Create Table tests**

Create `packages/components/src/table/__tests__/table.test.ts`:

```ts
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/config-provider.vue'
import Table from '../table.vue'
import type { TableColumn } from '../types'

interface Person {
  key: string
  name: string
  age: number
  role: string
}

const columns: TableColumn<Person>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a, b) => a.age - b.age },
  { title: 'Role', dataIndex: 'role', key: 'role' }
]

const dataSource: Person[] = [
  { key: 'ada', name: 'Ada', age: 36, role: 'Architect' },
  { key: 'grace', name: 'Grace', age: 28, role: 'Engineer' },
  { key: 'linus', name: 'Linus', age: 42, role: 'Maintainer' }
]

describe('Table', () => {
  it('renders columns and rows from dataSource', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource }
    })

    expect(wrapper.classes()).toContain('aheart-table')
    expect(wrapper.findAll('th').map((cell) => cell.text())).toEqual(['Name', 'Age', 'Role'])
    expect(wrapper.text()).toContain('Ada')
    expect(wrapper.text()).toContain('Maintainer')
  })

  it('renders custom empty text when no data is available', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: [], emptyText: 'No records' }
    })

    expect(wrapper.find('.aheart-table__empty').text()).toBe('No records')
  })

  it('sorts local data when a sortable header is clicked', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource }
    })

    await wrapper.findAll('th')[1].find('button').trigger('click')

    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('Grace')
    expect(wrapper.emitted('change')?.[0]?.[2]).toMatchObject({ columnKey: 'age', order: 'ascend' })
  })

  it('selects checkbox rows and emits selected keys', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        rowSelection: { defaultSelectedRowKeys: ['ada'] }
      }
    })

    const checkboxes = wrapper.findAll('tbody input[type="checkbox"]')
    expect((checkboxes[0].element as HTMLInputElement).checked).toBe(true)

    await checkboxes[1].setValue(true)

    expect(wrapper.emitted('update:selectedRowKeys')?.[0]).toEqual([['ada', 'grace']])
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('grace')
  })

  it('supports radio row selection', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        rowSelection: { type: 'radio' }
      }
    })

    await wrapper.findAll('tbody input[type="radio"]')[2].setValue(true)

    expect(wrapper.emitted('update:selectedRowKeys')?.[0]).toEqual([['linus']])
  })

  it('expands rows with custom expanded content', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        expandable: {
          expandedRowRender: (record) => `${record.name} details`
        }
      }
    })

    await wrapper.find('.aheart-table__expand-button').trigger('click')

    expect(wrapper.find('.aheart-table__expanded-cell').text()).toContain('Ada details')
    expect(wrapper.emitted('expand')?.[0]).toEqual([true, dataSource[0], 'ada'])
  })

  it('paginates local data', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        pagination: { current: 1, pageSize: 2 }
      }
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)

    await wrapper.find('.aheart-pagination__next').trigger('click')

    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ current: 2, pageSize: 2 })
  })

  it('uses ConfigProvider size and disabled fallback', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small', disabled: true },
      slots: {
        default: {
          render() {
            return h(Table, { columns, dataSource, rowSelection: {} })
          }
        }
      }
    })

    const table = wrapper.findComponent(Table)
    expect(table.classes()).toContain('aheart-table--small')
    expect(table.find('tbody input[type="checkbox"]').attributes()).toHaveProperty('disabled')
  })
})
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- table
```

Expected: FAIL because `packages/components/src/table/table.vue` does not exist.

## Task 2: Implement Table

**Files:**
- Create: `packages/components/src/table/table.vue`
- Create: `packages/components/src/table/types.ts`
- Create: `packages/components/src/table/style.css`
- Create: `packages/components/src/table/index.ts`
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Create component files**

Create component files matching `docs/superpowers/specs/2026-06-22-ant-style-table-design.md`.

The implementation must:

- render native `table`, `thead`, `tbody`, `th`, and `td` elements
- support `columns`, `dataSource`, `rowKey`, `bordered`, `loading`, `size`, `disabled`, `pagination`, `rowSelection`, `expandable`, `showHeader`, and `emptyText`
- emit `change`, `update:selectedRowKeys`, `select`, and `expand`
- use `APagination` for local pagination
- use ConfigProvider size and disabled fallback

- [ ] **Step 2: Update package root exports**

Modify `packages/components/src/index.ts` so Table is imported, registered, and exported by name.

- [ ] **Step 3: Run targeted verification**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components test -- table
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 --filter ./packages/components typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit source**

```bash
git add packages/components/src/table packages/components/src/index.ts
git commit -m "feat: add table component"
```

## Task 3: Add Documentation

**Files:**
- Modify: `docs/.vitepress/data/components.ts`
- Modify: `docs/.vitepress/config.ts`
- Create: `docs/components/table.md`

- [ ] **Step 1: Update component metadata**

Modify `docs/.vitepress/data/components.ts`:

- `Table` -> Ready with `/components/table`

- [ ] **Step 2: Update sidebar**

Modify `docs/.vitepress/config.ts` and add `Table 表格` under Data Display.

- [ ] **Step 3: Create component docs**

Create `docs/components/table.md` with:

- Ready badge
- basic usage demo
- sorting demo
- row selection demo
- expandable row demo
- pagination/loading/empty demo
- API tables for Table, TableColumn, rowSelection, expandable, pagination
- Events table
- Theme Tokens list

- [ ] **Step 4: Build docs and commit**

Run:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 docs:build
```

Expected: PASS.

Then commit:

```bash
git add docs/.vitepress/data/components.ts docs/.vitepress/config.ts docs/components/table.md
git commit -m "docs: add table documentation"
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
test -f packages/components/es/table/index.d.ts && test -f packages/components/lib/table/index.d.ts && test ! -e docs/.vitepress/dist/superpowers && echo declarations-and-docs-ok
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
git commit -m "build: update table outputs"
```

## Self-Review

- Spec coverage: all Table design requirements map to tests, implementation, docs, and build output tasks.
- Placeholder scan: the plan contains no TBD/TODO/fill-in placeholders.
- Type consistency: `TableColumn`, `TableRowSelection`, `TableExpandable`, and `TablePaginationConfig` names are consistent across the plan.
