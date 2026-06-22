# Ant Style Components Foundation Design

## Goal

Grow Aheart UI from a Button-only Vue 3 library into an Ant Design-inspired component system with a real global configuration layer, consistent component APIs, complete documentation, and a staged path toward broad component coverage.

This spec defines the full product direction and the first implementation slice. The first slice is intentionally Foundation + lightweight components so later form, overlay, table, and navigation work can reuse stable configuration, tokens, tests, and docs patterns.

## References

- Ant Design components overview: https://ant.design/components/overview/
- Ant Design ConfigProvider: https://ant.design/components/config-provider/
- Ant Design Vue ConfigProvider: https://antdv.com/components/config-provider
- Ant Design Vue Chinese ConfigProvider docs: https://www.antdv.com/components/config-provider-cn

These references guide information architecture, component categories, and global configuration concepts. Aheart UI must not copy Ant Design's branding, exact source code, or exact documentation wording.

## Current State

- `packages/components/src` contains one production component: `Button`.
- `Button` has runtime props, CSS, install support, tests, and docs.
- `docs/.vitepress/data/components.ts` lists 36 roadmap components, but only `Button` is `Ready`.
- There is no shared component configuration, global size, locale, disabled state, or theme override provider.
- Component implementation pattern is simple and repeatable: `component.vue`, `types.ts`, `style.css`, `index.ts`, `__tests__/*.test.ts`, package root export, and VitePress docs page.

## Product Scope

The long-term target is an Ant-style Vue component library, organized by documentation category.

### Configuration

- ConfigProvider
- Global theme tokens
- Global component size
- Global disabled state
- Locale object for components that render built-in text

### General

- Button
- Icon
- Typography
- FloatButton

### Layout

- Divider
- Flex
- Grid
- Layout
- Space
- Splitter

### Navigation

- Anchor
- Breadcrumb
- Dropdown
- Menu
- Pagination
- Steps
- Tabs

### Data Entry

- AutoComplete
- Cascader
- Checkbox
- ColorPicker
- DatePicker
- Form
- Input
- InputNumber
- Mentions
- Radio
- Rate
- Select
- Slider
- Switch
- TimePicker
- Transfer
- TreeSelect
- Upload

### Data Display

- Avatar
- Badge
- Calendar
- Card
- Carousel
- Collapse
- Descriptions
- Empty
- Image
- List
- Popover
- QRCode
- Segmented
- Statistic
- Table
- Tag
- Timeline
- Tooltip
- Tour
- Tree

### Feedback

- Alert
- Drawer
- Message
- Modal
- Notification
- Popconfirm
- Progress
- Result
- Skeleton
- Spin

## First Slice

The first implementation slice is:

- ConfigProvider
- Icon
- Typography
- Space
- Divider
- Flex
- Tag
- Badge
- Alert
- Spin
- Empty

These components have limited cross-component state and can establish the shared architecture before stateful controls, floating layers, and data-heavy components are added.

## Architecture

### Component Structure

Each component lives in its own directory under `packages/components/src/<component-name>/`.

Required files for each component:

- `<component>.vue`: Vue implementation.
- `types.ts`: runtime props and exported TypeScript types.
- `style.css`: component styles using Aheart CSS variables.
- `index.ts`: install wrapper using `withInstall`.
- `__tests__/<component>.test.ts`: Vue Test Utils + Vitest coverage.

The package root exports every installable component and registers them in the default plugin:

```ts
export { Button, ConfigProvider, Space }
export default AheartUI
```

### Shared Configuration

Add `packages/components/src/config-provider/` and `packages/components/src/config/`.

`ConfigProvider` provides a typed config object through Vue provide/inject:

```ts
export type AheartSize = 'large' | 'middle' | 'small'

export interface AheartLocale {
  empty?: {
    description?: string
  }
}

export interface AheartTheme {
  primaryColor?: string
  successColor?: string
  warningColor?: string
  dangerColor?: string
  borderRadius?: string
  fontSize?: string
}

export interface AheartConfig {
  size?: AheartSize
  disabled?: boolean
  locale?: AheartLocale
  theme?: AheartTheme
}
```

Components consume config through a `useAheartConfig()` composable. Local props always override global config. For example, a component with a `size` prop uses prop value first, then provider value, then local default.

`ConfigProvider` renders a wrapper element that applies CSS variables derived from `theme`, so nested components inherit token overrides without runtime style injection.

### Naming

- Public component names use `A` prefix in templates: `AButton`, `AConfigProvider`, `ASpace`.
- Named imports use plain names: `import { Space } from 'aheart-ui'`.
- CSS classes use the `aheart-` prefix.
- Docs page titles follow `Component 中文名`.

### Styling

The theme layer grows from the current base tokens:

- Color tokens: primary, success, warning, danger, info, text, secondary text, border, fill, background.
- Size tokens: font sizes, line heights, control heights, spacing.
- Shape tokens: radius, shadow, outline.
- Motion tokens: duration and easing.

First-slice components must avoid decorative gradients and oversized marketing visuals. They should look like practical product UI components: compact, bordered, readable, keyboard-visible, and consistent.

### Documentation

For every Ready component:

- Add a VitePress page under `docs/components/<component>.md`.
- Update `docs/.vitepress/data/components.ts` to `Ready` with a link.
- Add sidebar entry in `docs/.vitepress/config.ts`.
- Include status badge, install/import snippet, examples, API table, slots/events table when applicable, and theme token notes.

Planned components remain visible in overview but must not link to fake docs pages.

### Testing

Every component must have tests before implementation code:

- Render test for default content/DOM.
- Prop test for primary variants.
- ConfigProvider inheritance test where applicable.
- Accessibility-oriented state test where applicable, such as `aria-busy`, `role`, `aria-label`, `aria-live`, or semantic tags.
- Install/export test either in component-level tests or a package-level export test.

The verification gate for each implementation batch is:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

In this environment, use the bundled pnpm path if plain `pnpm` is unavailable:

```bash
PATH=/Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/start/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx pnpm@9.15.4 <script>
```

## First-Slice Component Requirements

### ConfigProvider

Props:

- `size?: 'large' | 'middle' | 'small'`
- `disabled?: boolean`
- `locale?: AheartLocale`
- `theme?: AheartTheme`

Behavior:

- Provides config to descendants.
- Applies CSS variables for supplied theme values.
- Renders a stable wrapper with class `aheart-config-provider`.
- Does not mutate global document styles.

### Icon

Props:

- `name?: string`
- `size?: number | string`
- `color?: string`
- `spin?: boolean`

Behavior:

- Renders a semantic inline icon container.
- Uses default slot for custom SVG/content.
- Supports simple named fallback text/icon when no slot is provided.
- `spin` adds motion class.

### Typography

Components:

- `Typography`
- `Title`
- `Text`
- `Paragraph`
- `Link`

Minimum behavior:

- Typography root spaces text content.
- Title supports `level` 1-5.
- Text supports `type`, `strong`, `italic`, `code`, `keyboard`, `delete`, `underline`, `disabled`.
- Paragraph supports copyable-looking and ellipsis-ready class hooks, but full clipboard and advanced ellipsis can be later slices.
- Link renders anchor with disabled handling.

### Space

Props:

- `size?: AheartSize | number | [number, number]`
- `direction?: 'horizontal' | 'vertical'`
- `align?: 'start' | 'end' | 'center' | 'baseline'`
- `wrap?: boolean`

Behavior:

- Adds consistent gap between child items.
- Supports vertical and wrapping layouts.

### Divider

Props:

- `type?: 'horizontal' | 'vertical'`
- `orientation?: 'left' | 'center' | 'right'`
- `dashed?: boolean`
- `plain?: boolean`

Behavior:

- Renders semantic separator.
- Supports optional label through default slot.

### Flex

Props:

- `vertical?: boolean`
- `wrap?: boolean | string`
- `justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'`
- `align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'`
- `gap?: AheartSize | number`

Behavior:

- Lightweight flex layout helper with stable class names and inline gap variable.

### Tag

Props:

- `color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | string`
- `closable?: boolean`

Events:

- `close`

Behavior:

- Renders compact label.
- Shows close button when closable.
- Emits close without removing itself automatically.

### Badge

Props:

- `count?: number | string`
- `dot?: boolean`
- `status?: 'success' | 'processing' | 'default' | 'error' | 'warning'`
- `text?: string`
- `overflowCount?: number`

Behavior:

- Supports standalone status badge and wrapped count badge.
- Displays `overflowCount+` when numeric count exceeds overflow.

### Alert

Props:

- `type?: 'success' | 'info' | 'warning' | 'error'`
- `message?: string`
- `description?: string`
- `showIcon?: boolean`
- `closable?: boolean`

Events:

- `close`

Behavior:

- Renders `role="alert"`.
- Supports message, description, default slot, and close button.

### Spin

Props:

- `spinning?: boolean`
- `size?: AheartSize`
- `tip?: string`

Behavior:

- Renders spinner with `aria-busy`.
- Wraps default slot in a container when content is present.

### Empty

Props:

- `description?: string`

Behavior:

- Uses ConfigProvider locale fallback when description prop is absent.
- Supports `image` and default slots.

## Later Slice Boundaries

### Form Slice

Implement after the first slice:

- Input
- Textarea
- InputNumber
- Checkbox
- Radio
- Switch
- Select
- Form

This slice needs a shared controlled/uncontrolled model, form item context, validation messaging, and keyboard/focus behavior.

### Overlay Slice

Implement after form basics:

- Tooltip
- Popover
- Popconfirm
- Modal
- Drawer
- Dropdown
- Message
- Notification

This slice needs portal/teleport, focus management, z-index tokens, escape handling, and global app-like APIs.

### Data Slice

Implement after forms and pagination:

- Table
- Pagination
- Descriptions
- Card
- List
- Tree
- Collapse
- Timeline
- Statistic

This slice needs column/data models, empty states, pagination integration, and responsive layout.

## Non-Goals For First Slice

- Do not implement complex overlays.
- Do not implement form validation.
- Do not implement full table, select popup, date/time pickers, upload, tree, or virtual scrolling.
- Do not copy Ant source code or exact docs prose.
- Do not mark components `Ready` unless implementation, tests, exports, and docs are all present.

## Completion Criteria For First Slice

First slice is complete only when:

- All 11 first-slice components are exported from `aheart-ui`.
- All 11 components can be globally installed through the default plugin.
- ConfigProvider inheritance works in tests for at least Button, Space/Flex size, and Empty locale.
- Each Ready component has tests and VitePress docs.
- Component overview and sidebar link every Ready component.
- `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm docs:build` pass.
- Built package output contains declarations and JS entries for every Ready component.

## Self-Review

- No placeholder requirements remain.
- The first slice is intentionally smaller than the full objective but directly advances the full objective by establishing configuration and component patterns.
- Full objective remains open after this slice; later slices are required before Aheart UI can claim broad Ant-style component coverage.
- The design keeps planned components visible while avoiding fake Ready status.
