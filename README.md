# Aheart UI

Aheart UI is a Vue 3 component library for product interfaces. This repository is a pnpm workspace built with Vue 3, TypeScript, Vite, Vitest, and VitePress.

## Components

The library covers the component categories used in product interfaces:

- General and configuration: Button, ConfigProvider, Icon, Typography, Tag, Badge.
- Layout: Space, Divider, Flex, Grid, Card, Descriptions.
- Navigation: Breadcrumb, Dropdown, Menu, Tabs, Steps, Pagination.
- Data entry: Input, Textarea, InputNumber, Checkbox, Radio, Switch, Select, Form.
- Feedback: Alert, Message, Modal, Drawer, Tooltip, Popover, Popconfirm, Spin, Skeleton, Empty.
- Data display: Table and the supporting display primitives above.

## Installation

Install the package and Vue 3 in your application:

```bash
pnpm add aheart-ui vue
```

Install every component through the default plugin and load the package stylesheet:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import AheartUI from 'aheart-ui'
import 'aheart-ui/style.css'

const app = createApp(App)
app.use(AheartUI)
app.mount('#app')
```

For a single component, import and install it by name:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { Button } from 'aheart-ui'
import 'aheart-ui/style.css'

const app = createApp(App)
app.use(Button)
app.mount('#app')
```

## Workspace

This repository has one VitePress documentation site in `docs`; it also hosts the component demos. There is no second demo application.

- `packages/components` owns the public `aheart-ui` package, component source, tests, and `es` / `lib` build output.
- `packages/utils` owns the shared `@aheart-ui/utils` workspace package.

## Development

Install workspace dependencies with `pnpm install`, then use these commands from the repository root:

```bash
pnpm dev
pnpm test
pnpm typecheck
pnpm build
pnpm docs:build
pnpm release:check
```

`pnpm dev` starts the VitePress site. `pnpm release:check` runs tests, type checking, the component build, the VitePress production build, generated-output verification, and whitespace validation.

## Roadmap

The next milestones are, in order:

1. Internationalization.
2. Splitter.
3. Advanced inputs.
4. Drag and drop.
5. AI packages.

## License

MIT
