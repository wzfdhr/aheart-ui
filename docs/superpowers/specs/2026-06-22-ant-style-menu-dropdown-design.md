# Ant Style Menu Dropdown Design

## Goal

Add first-pass Menu and Dropdown components to complete the current Navigation roadmap.

This slice follows the Ant Design public component shape for `items`, selected keys, open keys, dropdown triggers, placement, and menu-driven actions while keeping portal, animation, keyboard roving focus, and advanced overflow behavior out of scope for the foundation pass.

## References

- Ant Design Menu: https://ant.design/components/menu/
- Ant Design Dropdown: https://ant.design/components/dropdown/

These references guide API names and documentation structure. Aheart UI keeps an independent Vue implementation and a smaller first-pass feature set.

## Scope

Implement:

- Menu
- Dropdown
- Item-based menu rendering
- Menu item, group, divider, and submenu structures
- Controlled and uncontrolled selected keys
- Controlled and uncontrolled open keys
- Multiple selection
- Inline, vertical, and horizontal menu modes
- Light and dark menu themes
- Dropdown click and hover triggers
- Controlled and uncontrolled dropdown open state
- Dropdown placement classes
- ConfigProvider disabled fallback

Out of scope:

- Portal rendering to `body`
- Motion/transition choreography
- Keyboard roving focus
- Overflow measurement for horizontal menus
- Cascading context menus
- Arbitrary overlay content outside a menu

## Architecture

### Menu

Directory:

- `packages/components/src/menu/menu.vue`
- `packages/components/src/menu/menu-node.vue`
- `packages/components/src/menu/types.ts`
- `packages/components/src/menu/style.css`
- `packages/components/src/menu/index.ts`
- `packages/components/src/menu/__tests__/menu.test.ts`

`AMenu` renders a semantic list from `items`. `menu-node.vue` is an internal recursive node renderer so nested submenus remain small and testable without putting all markup in one file.

Props:

- `items?: MenuItem[]`
- `mode?: 'vertical' | 'horizontal' | 'inline'`
- `theme?: 'light' | 'dark'`
- `selectedKeys?: string[]`
- `defaultSelectedKeys?: string[]`
- `openKeys?: string[]`
- `defaultOpenKeys?: string[]`
- `multiple?: boolean`
- `selectable?: boolean`
- `inlineCollapsed?: boolean`
- `disabled?: boolean`

Events:

- `click`
- `select`
- `deselect`
- `openChange`
- `update:selectedKeys`
- `update:openKeys`

### Dropdown

Directory:

- `packages/components/src/dropdown/dropdown.vue`
- `packages/components/src/dropdown/types.ts`
- `packages/components/src/dropdown/style.css`
- `packages/components/src/dropdown/index.ts`
- `packages/components/src/dropdown/__tests__/dropdown.test.ts`

`ADropdown` wraps a trigger element and renders an internal `AMenu` overlay when open. It supports `menu.items` for the foundation pass and emits menu clicks upward.

Props:

- `menu?: DropdownMenuConfig`
- `trigger?: Array<'click' | 'hover'>`
- `placement?: 'bottomLeft' | 'bottom' | 'bottomRight' | 'topLeft' | 'top' | 'topRight'`
- `open?: boolean`
- `defaultOpen?: boolean`
- `disabled?: boolean`
- `arrow?: boolean`

Events:

- `update:open`
- `openChange`
- `click`

## Behavior

- Menu renders item labels, divider separators, group labels, and nested submenu lists.
- Clicking an enabled item emits `click`; selectable menus also update selection.
- In single-select mode, selecting one item replaces selected keys.
- In multiple-select mode, clicking an already selected item deselects it.
- Clicking a submenu title toggles open state and emits `openChange`.
- Disabled menus or disabled items do not emit selection/click/open changes.
- Dropdown opens on click or hover depending on `trigger`.
- Controlled dropdown `open` emits updates but does not mutate internal state.
- Dropdown menu item clicks emit `click` and close the dropdown in uncontrolled mode.

## Documentation

Update Navigation status:

- Menu -> Ready
- Dropdown -> Ready

Add VitePress pages:

- `docs/components/menu.md`
- `docs/components/dropdown.md`

The pages include core demos, API tables, events, item shapes, and theme token notes.

## Testing

Tests are written before implementation:

- Menu renders item, group, divider, and submenu nodes.
- Menu updates selected keys and emits click/select.
- Menu supports multiple selection and deselect.
- Menu toggles submenu open keys.
- Menu respects ConfigProvider disabled fallback.
- Dropdown renders default trigger slot and opens on click.
- Dropdown opens on hover when configured.
- Dropdown supports controlled open state.
- Dropdown emits menu item clicks and closes after item click.
- Dropdown respects disabled fallback.

Full verification:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Use the bundled pnpm command in this environment.

## Self-Review

- Placeholder scan: no unresolved placeholders remain.
- Scope check: this slice covers Navigation Menu and Dropdown only.
- Ambiguity check: Dropdown overlay content is menu-based in this pass.
