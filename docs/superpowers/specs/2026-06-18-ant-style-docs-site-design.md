# Ant Style Docs Site Design

## Goal

Build a professional Aheart UI documentation website inspired by Ant Design's information architecture, while keeping Aheart UI visually distinct and honest about its current component coverage.

## Confirmed Direction

- Visual direction: official technical documentation style.
- Framework: keep the existing VitePress docs site.
- Implementation style: VitePress pages plus custom Vue components and CSS where needed.
- Component coverage strategy: show implemented and roadmap components together.
- Component status labels:
  - `Ready`: implemented and usable.
  - `Planned`: included in the roadmap but not implemented yet.

## Non-Goals

- Do not copy Ant Design's exact UI, illustrations, wording, or branding.
- Do not imply planned components are already available.
- Do not replace VitePress with a custom Vue Router application.
- Do not build every planned component as part of this website task.
- Do not deploy to the user's server until server access and target path are provided.

## Information Architecture

The site should use a structure similar to mature component library documentation:

- Home
  - Hero section
  - Quick start
  - Feature highlights
  - Component category preview
  - Roadmap status explanation
- Guide
  - Introduction
  - Installation
  - Usage
  - Theme tokens
- Components
  - Overview
  - Button

The component overview should group components by category:

- General
  - Button: `Ready`
  - Icon: `Planned`
  - Typography: `Planned`
- Layout
  - Space: `Planned`
  - Divider: `Planned`
  - Flex: `Planned`
  - Grid: `Planned`
- Navigation
  - Tabs: `Planned`
  - Breadcrumb: `Planned`
  - Dropdown: `Planned`
  - Menu: `Planned`
  - Steps: `Planned`
- Data Entry
  - Input: `Planned`
  - Textarea: `Planned`
  - InputNumber: `Planned`
  - Checkbox: `Planned`
  - Radio: `Planned`
  - Switch: `Planned`
  - Select: `Planned`
  - Form: `Planned`
- Data Display
  - Tag: `Planned`
  - Badge: `Planned`
  - Card: `Planned`
  - Empty: `Planned`
  - Descriptions: `Planned`
  - Table: `Planned`
  - Pagination: `Planned`
- Feedback
  - Alert: `Planned`
  - Message: `Planned`
  - Modal: `Planned`
  - Drawer: `Planned`
  - Tooltip: `Planned`
  - Popover: `Planned`
  - Popconfirm: `Planned`
  - Spin: `Planned`
  - Skeleton: `Planned`

## Visual Design

The visual language should feel close to a polished technical documentation product:

- White background with subtle blue accents.
- Thin borders, restrained shadows, and compact spacing.
- Top navigation with product name, guide link, component link, GitHub link placeholder, and version text.
- Homepage hero with a direct headline:
  - `Aheart UI`
  - Supporting copy explains it is a Vue 3 component library for product interfaces.
- Hero should include a small live-looking component preview using Aheart UI's button styles.
- Avoid oversized marketing sections, decorative blobs, and one-note gradients.
- Use professional documentation density rather than a landing-page-heavy composition.

## Pages

### Home Page

Path: `docs/index.md`

Content:

- Hero title: `Aheart UI`
- Subtitle: Vue 3 component library for product interfaces.
- Primary actions:
  - Get Started -> `/guide/installation`
  - Components -> `/components/overview`
- Install command:
  - `pnpm add aheart-ui`
- Feature highlights:
  - Vue 3 + TypeScript
  - Theme tokens
  - Plugin and named imports
  - Tested Button foundation
- Component category preview with Ready and Planned statuses.

### Guide Pages

Create:

- `docs/guide/introduction.md`
- `docs/guide/installation.md`
- `docs/guide/usage.md`
- `docs/guide/theme.md`

These pages should be concise and practical, showing commands and code snippets based on the current library state.

### Component Overview

Create:

- `docs/components/overview.md`

This page should show a category matrix. Each item links to its doc page when implemented. Planned items should not link to fake pages unless a roadmap anchor is useful.

### Button Page

Modify:

- `docs/components/button.md`

The page should be upgraded with:

- Status badge: `Ready`
- Import examples
- Live-looking examples
- Props table
- Slots table
- Theme token notes

## VitePress Configuration

Modify:

- `docs/.vitepress/config.ts`

Required updates:

- Add nav items: Guide, Components, GitHub placeholder, version.
- Add sidebar groups for Guide and Components.
- Keep `srcExclude: ['superpowers/**']`.
- Add `head` metadata for favicon placeholder and viewport if useful.

## Theme Customization

Create or modify:

- `docs/.vitepress/theme/index.ts`
- `docs/.vitepress/theme/style.css`

The theme should:

- Import VitePress default theme.
- Import custom CSS.
- Import `aheart-ui/es/style.css` if using Aheart UI components inside docs.
- Optionally register Aheart UI globally when docs examples need live components.

## Data Model

Create:

- `docs/.vitepress/data/components.ts`

Suggested shape:

```ts
export type ComponentStatus = 'Ready' | 'Planned'

export interface ComponentMeta {
  name: string
  description: string
  status: ComponentStatus
  link?: string
}

export interface ComponentCategory {
  name: string
  description: string
  components: ComponentMeta[]
}
```

This keeps the component matrix maintainable as the library grows.

## Testing And Verification

Required checks:

- `pnpm docs:build`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

Manual checks after implementation:

- Homepage renders with custom layout and no broken links.
- Component overview clearly distinguishes `Ready` and `Planned`.
- Button page still accurately reflects implemented API.
- VitePress does not publish `docs/superpowers/**`.

## Deployment Boundary

This design covers building the website locally. Deployment to the user's server requires:

- Server host or IP.
- SSH username.
- Authentication method, preferably existing SSH key.
- Target directory, for example `/var/www/aheart-ui`.
- Web server type, for example Nginx, Apache, or a static host.
- Domain name, if available.

Until those are provided, implementation should stop at a verified static build in `docs/.vitepress/dist`.
