# Button <span class="aheart-status aheart-status--ready">Ready</span>

Button triggers an action and communicates priority through type, size, disabled, loading, block, and rounded states.

## Basic Usage

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton>Default</AButton>
    <AButton type="primary">Primary</AButton>
    <AButton type="success">Success</AButton>
    <AButton type="warning">Warning</AButton>
    <AButton type="danger">Danger</AButton>
  </div>
</div>

```vue
<template>
  <Button>Default</Button>
  <Button type="primary">Primary</Button>
  <Button type="success">Success</Button>
  <Button type="warning">Warning</Button>
  <Button type="danger">Danger</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
</script>
```

## Size

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton size="large">Large</AButton>
    <AButton>Normal</AButton>
    <AButton size="small">Small</AButton>
    <AButton size="mini">Mini</AButton>
  </div>
</div>

```vue
<template>
  <Button size="large">Large</Button>
  <Button>Normal</Button>
  <Button size="small">Small</Button>
  <Button size="mini">Mini</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
</script>
```

## States

<div class="aheart-demo-panel">
  <div class="aheart-demo-row">
    <AButton disabled>Disabled</AButton>
    <AButton type="primary" loading>Loading</AButton>
    <AButton block>Block</AButton>
    <AButton round>Round</AButton>
  </div>
</div>

```vue
<template>
  <Button disabled>Disabled</Button>
  <Button type="primary" loading>Loading</Button>
  <Button block>Block</Button>
  <Button round>Round</Button>
</template>

<script setup lang="ts">
import { Button } from 'aheart-ui'
import 'aheart-ui/es/style.css'
</script>
```

## API

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Button type | `default` \| `primary` \| `success` \| `warning` \| `danger` | `default` |
| size | Button size | `large` \| `normal` \| `small` \| `mini` | `normal` |
| nativeType | Native button type | `button` \| `submit` \| `reset` | `button` |
| disabled | Whether the button is disabled | `boolean` | `false` |
| loading | Whether the button is loading | `boolean` | `false` |
| block | Whether the button fills the available width | `boolean` | `false` |
| round | Whether the button uses rounded corners | `boolean` | `false` |

## Slots

| Name | Description |
| --- | --- |
| default | Button content |

## Theme Tokens

Button uses the global Aheart UI CSS variables:

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-success`
- `--aheart-color-warning`
- `--aheart-color-danger`
- `--aheart-radius`
- `--aheart-motion-duration`
