# Steps <span class="aheart-status aheart-status--ready">Ready</span>

Steps communicates progress through a multi-step workflow.



## Basic Usage

<div class="aheart-demo-panel">
  <ASteps
    :current="1"
    :items="[
      { title: 'Finished', description: 'This step is complete.' },
      { title: 'In Progress', description: 'This step is active.' },
      { title: 'Waiting', description: 'This step is upcoming.' }
    ]"
  />
</div>

```vue
<template>
<ASteps
    :current="1"
    :items="[
      { title: 'Finished', description: 'This step is complete.' },
      { title: 'In Progress', description: 'This step is active.' },
      { title: 'Waiting', description: 'This step is upcoming.' }
    ]"
  />
</template>
```

## Vertical Direction

<div class="aheart-demo-panel">
  <ASteps
    direction="vertical"
    size="small"
    :current="1"
    :items="[
      { title: 'Account', description: 'Create the account.' },
      { title: 'Billing', description: 'Add billing details.' },
      { title: 'Confirm', description: 'Review and publish.' }
    ]"
  />
</div>

```vue
<template>
<ASteps
    direction="vertical"
    size="small"
    :current="1"
    :items="[
      { title: 'Account', description: 'Create the account.' },
      { title: 'Billing', description: 'Add billing details.' },
      { title: 'Confirm', description: 'Review and publish.' }
    ]"
  />
</template>
```

## Error Status

<div class="aheart-demo-panel">
  <ASteps
    :current="1"
    :items="[
      { title: 'Account' },
      { title: 'Billing', status: 'error', description: 'Payment method was declined.' },
      { title: 'Confirm', disabled: true }
    ]"
  />
</div>

```vue
<template>
<ASteps
    :current="1"
    :items="[
      { title: 'Account' },
      { title: 'Billing', status: 'error', description: 'Payment method was declined.' },
      { title: 'Confirm', disabled: true }
    ]"
  />
</template>
```

## Type Variants

<div class="aheart-demo-panel aheart-demo-stack">
  <ASteps
    type="navigation"
    :current="1"
    :items="[
      { title: 'Draft' },
      { title: 'Review' },
      { title: 'Publish' }
    ]"
  />
  <ASteps
    type="panel"
    :current="1"
    :items="[
      { title: 'Account', content: 'Collect the profile details.' },
      { title: 'Billing', content: 'Confirm the payment method.' },
      { title: 'Confirm', content: 'Review before publishing.' }
    ]"
  />
  <ASteps
    type="inline"
    :current="1"
    :items="[
      { title: 'Queued', subTitle: '09:00' },
      { title: 'Running', subTitle: 'Now' },
      { title: 'Done' }
    ]"
  />
</div>

```vue
<template>
<ASteps
    type="navigation"
    :current="1"
    :items="[
      { title: 'Draft' },
      { title: 'Review' },
      { title: 'Publish' }
    ]"
  />
  <ASteps
    type="panel"
    :current="1"
    :items="[
      { title: 'Account', content: 'Collect the profile details.' },
      { title: 'Billing', content: 'Confirm the payment method.' },
      { title: 'Confirm', content: 'Review before publishing.' }
    ]"
  />
  <ASteps
    type="inline"
    :current="1"
    :items="[
      { title: 'Queued', subTitle: '09:00' },
      { title: 'Running', subTitle: 'Now' },
      { title: 'Done' }
    ]"
  />
</template>
```

## Title Placement

<div class="aheart-demo-panel">
  <ASteps
    type="dot"
    orientation="vertical"
    title-placement="vertical"
    :initial="3"
    :current="1"
    :items="[
      { title: 'Create', description: 'Dot mode uses compact markers.' },
      { title: 'Process', description: 'The active item keeps zero-based current.' },
      { title: 'Finish', description: 'Generated numbers are hidden for dot markers.' }
    ]"
  />
</div>

```vue
<template>
<ASteps
    type="dot"
    orientation="vertical"
    title-placement="vertical"
    :initial="3"
    :current="1"
    :items="[
      { title: 'Create', description: 'Dot mode uses compact markers.' },
      { title: 'Process', description: 'The active item keeps zero-based current.' },
      { title: 'Finish', description: 'Generated numbers are hidden for dot markers.' }
    ]"
  />
</template>
```

## Progress and Content

<div class="aheart-demo-panel">
  <ASteps
    :current="1"
    :percent="65"
    :items="[
      { title: 'Profile', icon: 'A', subTitle: 'Ready', content: 'Profile fields are complete.' },
      { title: 'Billing', subTitle: '65%', description: 'Payment verification is running.', content: 'Waiting for provider confirmation.' },
      { title: 'Confirm', icon: 'C', subTitle: 'Next' }
    ]"
  />
</div>

```vue
<template>
<ASteps
    :current="1"
    :percent="65"
    :items="[
      { title: 'Profile', icon: 'A', subTitle: 'Ready', content: 'Profile fields are complete.' },
      { title: 'Billing', subTitle: '65%', description: 'Payment verification is running.', content: 'Waiting for provider confirmation.' },
      { title: 'Confirm', icon: 'C', subTitle: 'Next' }
    ]"
  />
</template>
```

`StepItem` title, description, icon, subtitle, and extra content accept `VNodeChild`, so rendered nodes can be passed for richer labels, buttons, or icons.

## Semantic Styling

<div class="aheart-demo-panel">
  <ASteps
    root-class-name="steps-semantic-demo"
    :current="1"
    :class-names="{ activeItem: 'steps-semantic-demo__active', connector: 'steps-semantic-demo__connector' }"
    :styles="{
      root: { maxWidth: '720px' },
      item: { minWidth: '160px' },
      activeItem: { fontWeight: 700 },
      connector: { backgroundColor: 'var(--aheart-color-primary)' }
    }"
    :items="[
      { title: 'Configured', description: 'Root and item hooks are available.' },
      { title: 'Styled', description: 'The active item receives a dedicated hook.' },
      { title: 'Connected', description: 'Connector is a real semantic element.' }
    ]"
  />
</div>

```vue
<template>
<ASteps
    root-class-name="steps-semantic-demo"
    :current="1"
    :class-names="{ activeItem: 'steps-semantic-demo__active', connector: 'steps-semantic-demo__connector' }"
    :styles="{
      root: { maxWidth: '720px' },
      item: { minWidth: '160px' },
      activeItem: { fontWeight: 700 },
      connector: { backgroundColor: 'var(--aheart-color-primary)' }
    }"
    :items="[
      { title: 'Configured', description: 'Root and item hooks are available.' },
      { title: 'Styled', description: 'The active item receives a dedicated hook.' },
      { title: 'Connected', description: 'Connector is a real semantic element.' }
    ]"
  />
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| items | Steps to display. | `StepItem[]` | `[]` |
| current | Current page in controlled mode. | `number` | `0` |
| status | Status applied to the current step. | `wait` \| `process` \| `finish` \| `error` | `process` |
| direction | Layout direction. | `horizontal` \|`vertical` | `horizontal` |
| orientation | Ant-compatible direction alias, which takes precedence over `direction` when provided. | `horizontal` \|`vertical` | - |
| size | Component size. | `large` \| `middle` \| `small` | ConfigProvider size |
| type | Component type or visual style. | `default` \| `dot` \| `navigation` \| `panel` \| `inline` | `default` |
| titlePlacement | Title placement. | `horizontal` \| `vertical` | `horizontal` |
| initial | Starting value for generated number indicators; it does not affect `current` and is hidden for dot steps. | `number` | `1` |
| percent | Progress text or percentage. | `number` | - |
| className | Compatibility class name for the root node. | `string` | - |
| rootClassName | Class name for the root node. | `string` | - |
| style | Styles for the root node. | `StyleValue` | - |
| classNames | Semantic DOM class names, as an object or function. | `Partial<Record<StepsSemanticPart, string>>` | - |
| styles | Semantic DOM styles, as an object or function. | `Partial<Record<StepsSemanticPart, StyleValue>>` | - |

### StepItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| title | Step title. | `VNodeChild` | - |
| description | Custom description content. | `VNodeChild` | - |
| status | Custom status for this step; automatically computed from `current` when omitted. | `wait` \| `process` \| `finish` \| `error` | automatically computed |
| disabled | Whether interaction is disabled. | `boolean` | `false` |
| icon | Custom icon. | `VNodeChild` | - |
| subTitle | Supporting content displayed beside the title. | `VNodeChild` | - |
| content | Additional content for `panel` steps or detailed step layouts. | `VNodeChild` | - |

### StepsSemanticPart

| value | Description |
| --- | --- |
| root | Root element. |
| item | Individual step item. |
| activeItem | Current step item. |
| button | Step button. |
| indicator | Icon container. |
| icon | Icon content. |
| content | Text-content container. |
| title | Step title. |
| subTitle | Supporting title. |
| description | Step description. |
| connector | Connector line. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| change | Fired when an enabled, non-current step is clicked. | `(current: number) => void` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-danger`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-control-height`
